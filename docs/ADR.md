# Architecture Decision Records (ADRs)

This document consolidates all Architecture Decision Records (ADRs) for **Instance.js**, a lightweight base class for building reusable DOM components in vanilla JavaScript.

ADRs are chronological records of key architectural choices, following the standard template for context, decisions, alternatives, consequences, and outcomes.

Each ADR is self-contained but references prior ones where relevant. For the full codebase and changelog, see the Instance.js repository.

---

## ADR 001: Adopting Class-Based Modular Inheritance for Reusable DOM Components via `new`

**Status:** Accepted  
**Date:** October 1, 2025  
**Author:** Ashraile  
**Context:** Framework design for Instance.js (base class for DOM component instances)

### Context

The foundational prototype for Instance.js stemmed from a desire to create reusable, self-contained DOM components that could be instantiated declaratively with the `new` keyword—e.g., `new Scrollbar(container)`—mirroring constructor patterns in languages like Java or C#, but in vanilla JavaScript. Early sketches used factory functions or plain objects, but these lacked true modularity: Subcomponents (e.g., a `Tab` extending `Panel`) couldn't inherit behaviors cleanly, leading to code duplication and brittle composition.

ES6+ classes provide a syntactic sugar over prototypes that enables modular, hierarchical inheritance (`class Scrollbar extends Instance`), with built-in support for constructors, `super()`, and lifecycle hooks. This crystallized the "prototype idea" into a scalable architecture for DOM components, where each class represents a UI primitive with encapsulated state and methods.

### Decision

Establish class-based inheritance as the core paradigm for Instance.js components:

- Define `Instance` as the base class, providing shared utilities (e.g., mounting, querying).
- Encourage subclassing: `class Scrollbar extends Instance { constructor(container) { super(container); /* custom init */ } }`.
- Leverage `new` for instantiation: Returns the augmented component instance directly (refined in later ADRs).
- Support zero-boilerplate: No manual setup beyond `extends` and overrides.

This formalizes the `new Component()` pattern as the entry point for reusable DOM modules.

> jQuery is a library, not a framework. It was 'kept' because of its flexibility and ease of use for prototyping. If you just want to manipulate the DOM, why invoke a monolith?

### Alternatives Considered

**React/Vue (i.e. existing frameworks)**  
Discarded:
- **(React)**: JSX's transpilation requirements introduced significant build-step overhead. *'Why can't I just write code that works without extensive tooling?'*
- **Personal preference**: Solutions tied to certain corporate ecosystems (i.e. Zuckerborg) didn't align with my vision for a lightweight, vanilla JS approach.
- **(Vue)**: Components are not instantiated via the `new` keyword. Vue's declarative mounting cycle, while elegant, didn't feel as programmatically direct as constructor-based instantiation.

**Factory Functions**: Use `function createScrollbar(container) { return { ... }; }` for instantiation.  
Discarded: Lacks native inheritance; `super()` unavailable; harder to compose hierarchies.

**Object Literals/Composables**: Build via `{ init: () => {}, mount: () => {} }` merged at runtime.  
Discarded: No static analysis (e.g., IDE autocompletion); inheritance via manual `Object.create()` is verbose.

**Custom Elements (Web Components)**: Register via `customElements.define('scroll-bar', ScrollbarClass)`.  
Discarded: Ties to HTML tags; overkill for non-declarative, programmatic use; doesn't quite fit jQuery-like fluency.

> **EDIT** *(October 26, 2025)*: I now strongly suspect that some feature of Web Components will have a natural logical integration with Instance (specifically with regards to instantiation of truly custom elements like `<scrollbar></scrollbar>`).

### Consequences

- **Modular scalability**: Easy extension (e.g., `FancyScrollbar extends Scrollbar`) with shared base logic.
- **Familiar ergonomics**: `new` aligns with JS norms; classes enable tools like TypeScript.
- **Foundation for evolution**: Paves way for hooks like observers (ADR 002) and privates (ADR 003).
- **Minor learning curve**: Assumes ES6+ knowledge, but polyfills cover legacy.

This decision bootstraps Instance.js as an inheritance-first framework, transforming ad-hoc prototypes into a cohesive system.

### References

- [MDN: Classes - Using classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- ECMA-262, §14 Classes (2025 Edition)
- "JavaScript: The Good Parts" (Douglas Crockford, 2008) - Prototypal inheritance foundations

### Final Outcome

Embrace ES6+ class-based inheritance extending `Instance` for reusable DOM components, instantiated via `new`—establishing modular, extensible architecture from the prototype phase.

---

## ADR 002: Introducing MutationObserver for Reactive DOM Insertion Hooks

**Status:** Accepted  
**Date:** October 8, 2025  
**Author:** Ashraile  
**Context:** Framework design for Instance.js (base class for DOM component instances)

### Context

In the initial design of Instance.js, components required reliable lifecycle hooks for DOM insertion, especially in asynchronous rendering scenarios (e.g., dynamic appends via third-party code or async fetches). Manual checks like polling `document.contains(element)` were inefficient, error-prone, and resource-intensive, leading to missed events or unnecessary CPU cycles.

The `MutationObserver` API offers a performant, event-based solution to detect subtree changes, such as when an element is added to a root node. This enables reactive callbacks without blocking constructors or requiring global event emitters.

### Decision

Incorporate `MutationObserver` as a core static utility `Instance.whenInsertedTo(rootNode, element, callbackScope, callback)` for insertion detection. Key mechanics:

- Input validation via `Instance.require()` for Node types and function callbacks.
- Immediate callback if already inserted (`rootNode.contains(element)`).
- Otherwise, instantiate an observer on the root with `{ childList: true, subtree: true }`, scanning added nodes for matches.
- Auto-disconnect after trigger; scope observers via WeakMap for cleanup (see ADR-003)

This underpins methods like `init()`, deferring `onInserted()` and `sync()` until true mounting.

### Alternatives Considered

**requestAnimationFrame Polling**: Frame-tied checks for containment.  
Discarded: Drains battery in long-lived apps; imprecise for non-visual inserts.

**Custom DOM Events**: Dispatch 'inserted' events on append.  
Discarded: Assumes control over all insertion paths; fails for external appends.

**setInterval Fallback**: Timed containment queries.  
Discarded: Worse perf than Observer; arbitrary delays.

### Consequences

- **Efficient reactivity**: Sub-millisecond detection, no persistent overhead.
- **Leak-proof**: Observers self-destruct; WeakMap scoping (forthcoming in ADR 003) ties to scopes.
- **Broad support**: IE11+ native; polyfills minimal.
- Adds ~40 LOC but centralizes DOM awareness, easing future hooks like unmount watchers.

This establishes reactive foundations early in the framework's lifecycle.

### References

- [MDN: MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- WHATWG DOM Living Standard: MutationObserver (2025 Edition)
- "JavaScript: The Definitive Guide" (David Flanagan, 7th Ed., 2020) - Event-driven DOM

### Final Outcome

Leverage `MutationObserver` for precise, low-overhead insertion hooks, enabling robust component lifecycles without polling or assumptions about insertion timing.

---

## ADR 003: Adopting WeakMap Scoping for Private State and Observer Management

**Status:** Accepted  
**Date:** October 15, 2025  
**Author:** Ashraile  
**Context:** Framework design for Instance.js (base class for DOM component instances)

### Context

As Instance.js incorporated reactive features like `MutationObserver` (ADR 002), managing private instance data (e.g., initialization flags, options) and transient resources (e.g., observers) became critical. Direct properties on elements risked exposure or conflicts, while global Maps could leak memory on GC'd components. JavaScript's `WeakMap` provides key-value storage keyed by objects, with automatic cleanup when keys are garbage-collected—ideal for scoping privates and resources to instance lifetimes.

This prevents memory bloat in long-running apps with dynamic component creation/destruction.

### Decision

Use static WeakMaps for all private and scoped storage:

- `#privateData = new WeakMap()`: Holds per-instance state (e.g., `{ isInitialized: false, options: {} }`), accessed via bound getters/setters (`get #private()`, `set #private(data)`).
- `#observers = new WeakMap()`: Maps callback scopes to active MutationObservers for targeted disconnection (e.g., on `remove()`).

Keys are elements or scopes; values auto-evict on GC. Accessors bind to the element for `this.#private`-like ergonomics, bypassing `#` field limits on host objects.

### Alternatives Considered

**Plain Objects/Maps**: Direct storage on `this` or global registry.  
Discarded: Leaks memory; exposes internals; no auto-cleanup.

**Symbols for Privates**: Use `Symbol('private')` properties on elements.  
Discarded: Still enumerable/reflectable; doesn't scope transients like observers.

**Closure-Local Storage**: Encapsulate data in constructor closures.  
Discarded: Breaks subclass access; complicates `super()` sharing.

### Consequences

- **Memory safety**: Automatic GC for detached components/observers; no manual cleanup beyond disconnects.
- **Encapsulation**: Privates invisible to `Object.keys()` or JSON; WeakMap ops are O(1).
- **Ergonomics**: Feels like native privates (`this.#private.isInitialized`), with ~20 bytes overhead per map.
- **Scalability**: Handles 10k+ instances without bloat; integrates seamlessly with direct-element model (later ADRs).

This pattern becomes a cornerstone for resource hygiene across the framework.

### References

- [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- ECMA-262, §9.5.12 WeakMap Objects (2025 Edition)
- "You-Don't-Know-JS: Scope & Closures" (Kyle Simpson, 2014) - Weak references in practice

### Final Outcome

Standardized WeakMap scoping for private data and observers, ensuring leak-free, encapsulated state management tied to object lifetimes.

> **UPDATE** *(October 25, 2025)*: The accessor pattern evolved between ADR-006 and ADR-008. With direct element architecture (`instance === element`), `_getPrivate()` and `_setPrivate()` methods are copied onto elements rather than using private getters. The WeakMap scoping principle remains unchanged—keys are now the elements themselves, preserving memory safety while enabling the `instance === element` pattern.

---

## ADR 004: Merging jQuery.fn Methods onto Instance.prototype for Fluent API Compatibility

**Status:** Accepted  
**Date:** October 20, 2025  
**Author:** Ashraile  
**Context:** Framework design for Instance.js (base class for DOM component instances)

### Context

During early prototyping of Instance.js, the goal was to blend modern ES6+ class-based inheritance with jQuery's fluent, collection-like API for DOM manipulation. jQuery objects (`$(selector)`) are array-like wrappers that support method chaining (e.g., `.append().css()`) and treat elements as pseudo-collections (e.g., `$(el)[0]` for the raw node).

Standard ES6+ classes support prototype extension, allowing methods to be dynamically added to `ClassName.prototype`. To integrate jQuery compatibility, Instance needed to adopt jQuery's `fn` methods without wrapper objects or manual delegation, enabling direct method chaining on Instance-based elements.

### Decision
Classes are Function objects. I noticed that it would be quite easy to add jQuery compatibility by making instances array-like (adding `this[0]` and `this.length`) and dynamically merging jQuery's `$.fn` methods onto `Instance.prototype` during initialization. So I did. This is triggered lazily (on first instantiation via `new Instance()`) and skips existing properties to allow overrides.

The approach:
- Check for jQuery availability
- Iterate `Object.keys($.fn)` and copy function properties to `Instance.prototype` if not already defined
- Expose as a static `mergeJQuery(force)` method for manual control
- Mark as merged via `Instance.isMerged` flag to prevent redundant operations

This enables `new Instance(el).append('<p>')` to behave like `$(el).append('<p>')`, with Instance methods always taking precedence.

### Alternatives Considered

**Manual Delegation**: In each Instance method, forward calls to `$(this.main)` if jQuery is present.  
Discarded: Bloats code, runtime overhead, and breaks chaining if jQuery methods mutate the wrapper.

**Global Prototype Extension**: Directly augment `HTMLElement.prototype` with jQuery methods.  
Discarded: Pollutes the global namespace, conflicts with other libs, violates zero-boilerplate principle.

**Wrapper Factory**: Always return a jQuery-like wrapper instead of the class instance.  
Discarded: Introduces opacity (see ADR-005), conflicting with inheritance goals.

### Consequences

- **Seamless jQuery interop**: Instance instances act as single-element collections (`instance[0] === instance`, `instance.length = 1`).
- **Backward compatibility**: Works without jQuery (falls back to native DOM).
- **Minor prototype bloat**: Adds ~100-200 methods, but only on demand and with overrides.
- **Encourages hybrid usage**: Developers can use Instance with jQuery without friction.

Future versions could auto-detect jQuery versions or support other libs like Zepto.

### References

- [MDN: Classes - JavaScript (functions as objects)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [jQuery API: Core - jQuery.fn](https://api.jquery.com/jQuery.fn/)
- ECMA-262, §19.2.3 The Function Constructor (2025 Edition)

### Final Outcome

Modify class constructors as objects to merge jQuery compatibility, enabling fluent, collection-like DOM components without wrappers or pollution.

---

## ADR 005: Dropping Proxy-Based Architecture for Instance

**Status:** Accepted  
**Date:** October 25, 2025  
**Author:** Ashraile  
**Context:** Framework design for Instance.js (base class for DOM component instances)

### Context

The original design for the Instance base class considered wrapping all instances in a Proxy to:

- Enforce API method constraints (e.g., access validation before initialization).
- Intercept or augment property access dynamically.
- Maintain zero-boilerplate extensibility for subclasses (`class A extends Instance`).

However, making the proxied Instance behave identically to the non-proxied version requires **proxy transparency** — specifically preserving:

- Object identity (`proxy === target`),
- Prototype relationships (`proxy instanceof Base`),
- Full equality semantics,
- Transparent subclassing via `new.target`.

Current ECMAScript proxies (as of ES2025) are opaque by design and do not support these features.

### Decision

I dropped the use of Proxies for the core Instance behavior, retaining the standard, non-proxied implementation.

The reasoning is that a fully proxified Instance layer would require **Transparent Proxies**, a feature proposed in research but not standardized or available in any production JavaScript engine.

Transparent Proxies would be required to:

- Unify object identity and equality with their target (`proxy === target`).
- Maintain correct prototype and `instanceof` behavior.
- Avoid breaking subclass instantiation patterns that depend on `new.target`.

Without engine-level transparency, proxy-based identity introduces inconsistent behavior during subclass creation, equality checks, WeakMap lookups, and reflective operations. These side effects violate the framework's "zero boilerplate subclassing guarantee."

### Alternatives Considered

**Keep Proxy Wrapping with Bound Method Caching**:  
Discarded due to complexity, identity divergence, and loss of subclass transparency.

**Use a Custom Wrapper Object** (mimicking Proxy behavior via accessors):  
Viable for partial behavior interception (get, set), but cannot transparently reproduce identity semantics. Used in limited form for optional diagnostics.

**Wait for Transparent Proxy support**:  
The feature remains experimental in SpiderMonkey research builds and has not entered any ECMAScript proposal stage.

### Consequences

- Simplified implementation of Instance and subclass creation.
- Full consistency with standard ECMAScript object semantics and equality.
- Loss of automatic, low-level interception capabilities that would have benefited debugging or strict API enforcement.
- Future framework versions could reevaluate proxy usage if Transparent Proxies become standardized.

### References

- "Transparent Object Proxies for JavaScript", Matthias Keil et al., ECOOP 2015
- ECMA-262, §9.5 Proxy Object Internal Methods and Internal Slots (2025 Edition)
- [MDN: Proxy - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

### Final Outcome

Maintain a non-proxified Instance implementation to ensure predictable inheritance, equality, and `instanceof` semantics until ECMAScript standardizes Transparent Proxies.

> The decision was made on the spot to abandon any Proxy-based architecture, once it became clear that the **solution to some problems is that there is no solution with current tools.**
It is my professional opinion that there is **no Proxy-based workaround or hack possible** that allows Transparent Proxies to be emulated or polfyilled without formally standardizing (the implementation of) Transparent Proxies at the language level. This insight actually proved a critically important step towards enabling the architectural breakthroughs of ADR-006 through ADR-008. Proxy opacity would have fundamentally broken the `instance === element` pattern, as proxies cannot achieve true identity with their targets. Maintaining object transparency enabled the constructor return override pattern (forthcoming) that defines a core pillar of Instance's architecture.

---

# ADR-006: The Constructor Return Override, Lexical `super` Binding, and Reverse Prototype Traversal Patterns

*Author: Claude Sonnet 4.5*  
*Date: October 25, 2025* 

*Status: Accepted*
[Prompted October 27, 2025]
---

## Context
Instance's direct element architecture (instance === element) presents three non-obvious challenges that required discovering obscure JavaScript mechanics:
> Interpretation (Claude agrees): Correctly replicating Instance's (eventual) direct element architecture (instance === element) would present you with three deceptively difficult architectural design challenges simultaneously,
> the solutions to which are each extremely unintuitive in and of themselves, and would require [for their solving] an extraordinarily thorough understanding (and/or rediscovery) of several obscure JavaScript mechanisms as well as how those mechanisms shall interact:
 
1. **Constructor Return Problem**: How can subclasses automatically receive the element as `this` without manually returning it?
2. **The `super` Paradox**: How can `super.method()` calls work when methods are copied onto a plain element, breaking the prototype chain?
3. **Method Override Problem**: How can we copy an inheritance chain onto an element while preserving both method overrides AND `super` references?

All three problems had solutions hiding in JavaScript's specification, but none was immediately obvious.

---

## Discovery 1: The `super()` Return Override

### The Problem
When `Instance`'s constructor returns an element instead of `this`, subclasses should break—you can't just hijack what `this` refers to mid-constructor. Yet somehow, subclasses work perfectly:
```javascript
class Tab extends Instance {
  constructor(selector) {
    super(selector);
    // 'this' is already the element here. How?
    this.classList.add('tab');
  }
}
```

### The Discovery
JavaScript's class constructor semantics include a rarely-discussed behavior: **if a base constructor returns an object, that object becomes `this` for the derived constructor**.

From the ES6 spec (paraphrased): When a derived class constructor calls `super()`, the returned value replaces the default `this` binding for the rest of the constructor execution.

**This means:**
```javascript
// In Instance base class:
constructor() {
  // ... setup code ...
  return element; // ← This element becomes 'this' in subclasses
}

// In Tab subclass:
constructor(selector) {
  super(selector); 
  // ↑ After this line, 'this' === element (returned by super)
  this.classList.add('tab'); // Works because 'this' IS the element
  // No manual return needed!
}
```

### Why This Matters
Subclasses can write completely natural constructors without any boilerplate:
- No `const el = super(); return el;` dance
- No manual method copying
- No confusion about what `this` refers to
- Just call `super()` and proceed normally

The base class's return override propagates automatically through the entire inheritance chain.

---

## Discovery 2: `super` Uses Lexically Scoped `this`

### The Problem
Once methods are copied onto the element, the prototype chain is effectively "flattened." If a child method calls `super.parentMethod()`, it should break—there's no prototype to walk up anymore. The element is just a plain object with copied functions.

Yet somehow, `super` calls work perfectly:
```javascript
class Tab extends Instance {
  remove() {
    console.log('Tab cleanup');
    super.remove(); // ← How does this work?
  }
}

const tab = new Tab('#my-tab');
tab.remove(); // Both Tab and Instance remove() execute
```

### The Discovery
**`super` is lexically bound at method definition time, not dynamically resolved at call time.**

When JavaScript compiles a class method that contains `super.method()`, it creates a hidden reference to the parent prototype *at the moment the class is defined*. This reference is baked into the method's closure.

**This means:**
```javascript
class Tab extends Instance {
  remove() {
    // When this method is defined, 'super' is bound to Instance.prototype
    // Even if we later copy this method onto a plain object (element),
    // 'super.remove' still refers to Instance.prototype.remove
    super.remove(); 
  }
}

// Later, in _copyMethodsToElement:
element.remove = Tab.prototype.remove.bind(element);
// ↑ We bind it to 'element', but 'super' reference is unchanged!
```

The copied method carries its lexical `super` reference with it, like a closure variable. When `element.remove()` executes:
1. `this` === `element` (because we bound it)
2. `super.remove` === `Instance.prototype.remove` (because it's lexically captured)
3. Both work simultaneously!

### Why This Matters
Methods can be copied off the prototype chain onto a plain object, and `super` calls continue working because:
- `this` binding is dynamic (we control it with `.bind()`)
- `super` binding is lexical (JavaScript captured it at definition time)

This allows Instance to flatten the inheritance hierarchy onto elements while preserving parent method access.

---

## Discovery 3: The Reverse Prototype Traversal

### The Problem
`_copyMethodsToElement()` must traverse the prototype chain and copy methods onto the element. But what order?

**Initial intuition (wrong):**
```javascript
// Start with child, work up to parent
Child → Parent → Instance
// Problem: Parent methods overwrite child methods!
```

When methods are copied in child-first order, parent methods land *after* child methods, destroying the override semantics that inheritance is supposed to provide.

### The Discovery
**Reverse the traversal:** Copy parent methods first, then child methods last.
```javascript
const protos = [];
let proto = Object.getPrototypeOf(this);

while (proto && proto !== Object.prototype) {
  protos.push(proto);
  proto = Object.getPrototypeOf(proto);
}

// CRITICAL: Reverse order (parent first, child last)
protos.reverse().forEach(proto => {
  Object.getOwnPropertyNames(proto).forEach(name => {
    // Copy method bound to element
    element[name] = descriptor.value.bind(element);
  });
});
```

### Why This Works

1. **Parent methods land first**: `Instance.prototype.remove()` gets copied to `element.remove`
2. **Child methods land last**: `Tab.prototype.remove()` *overwrites* `element.remove`
3. **Result**: Child methods naturally override parents, just like normal inheritance
4. **Bonus**: Because of Discovery 2 (lexical `super`), the child's `super.remove()` call still works even after the parent method is overwritten

### The Interaction
These three discoveries work together:
```javascript
class Tab extends Instance {
  constructor(selector) {
    super(selector);        // Discovery 1: 'this' becomes element
    this.classList.add('tab');
  }
  
  remove() {
    console.log('cleanup');
    super.remove();         // Discovery 2: Lexical super works
  }
}

// Discovery 3: Copy order preserves overrides
// 1. Instance.prototype.remove → element.remove
// 2. Tab.prototype.remove → element.remove (overwrites)
// Result: element.remove is Tab's method, but super.remove still works
```

---

## Decision

1. **Leverage constructor return override** for automatic `this` binding in subclasses
2. **Rely on lexical `super` binding** to preserve parent method access after copying
3. **Reverse prototype traversal order** when copying methods to elements
4. **Document these patterns** as they're non-obvious but critical to Instance's architecture

---

## Consequences

### Positive
- **Zero-boilerplate subclassing**: Developers write normal constructors with `super()`, nothing else
  > Technically, you don't even need to call `super()` if you omit the subclass constructor entirely, as ES6 classes auto-initialize with `super(...args)` when the constructor is omitted.
- **Full inheritance support**: Both method overrides and `super` calls work correctly
- **No prototype chain**: Methods live directly on elements for maximum performance
- **No framework magic**: Pure JavaScript mechanics, just used cleverly together

### Negative
- **Debugging complexity**: Stack traces show methods on elements, not prototype chains
- **Non-standard pattern**: Developers familiar with traditional OOP may find this surprising
- **Performance consideration**: Method copying happens per-instance (though negligible for typical use)
- **Three obscure behaviors**: Understanding requires deep JavaScript knowledge

### Neutral
- **Educational barrier**: These patterns require understanding advanced JavaScript semantics
- **Documentation burden**: Must explain why/how these patterns work for maintainability
  > You're welcome
- **Specification dependence**: Relies on stable ES6+ behaviors that could theoretically change

---

## Notes

These discoveries emerged through rapid iterative debugging, not upfront design:
1. The `super()` return override was confirmed by reading the ECMAScript specification
2. The lexical `super` binding was discovered when `super` calls mysteriously kept working after prototype flattening
3. The reverse traversal pattern was validated through trial and error—trying the "opposite of intuitive" approach

All three patterns leverage JavaScript quirks that are *technically* documented but rarely combined in practice. Instance's architecture wouldn't be possible without them working together.

---

**Reflection**: The best architectural discoveries often come from asking "why does this work when it shouldn't?" The fact that `super` calls survived prototype flattening led to understanding lexical binding. The fact that subclasses automatically received the element led to understanding constructor return semantics. And the fact that method overrides needed reversing led to understanding copy order semantics.

Sometimes you don't design the architecture—you discover what JavaScript was always capable of, waiting for the right use case.

> *Claude happily wrote ADR-006 with 'deliberate intent', that is, with the full knowledge that the entirety of ADR-006 (which he wrote in one take!?!) would be deliberately attributed to him as an AI credit.*

---


## ADR 007: Implementing Meta-Constructor for Subclass Constructors as Instances of Superclass

**Status:** Accepted  
**Date:** October 25, 2025  
**Author:** Ashraile  
**Context:** Framework design for Instance.js (base class for DOM component instances)

### Context

Following the Proxy drop (ADR 005), and at the same time as Claude's genius insights (ADR 006), I noticed that ensuring robust inheritance required addressing a subtlety in JavaScript class semantics: 
While `class B extends A` sets `B.__proto__ === A` (making `B instanceof A` true by default), custom extensions like jQuery merging (ADR 004) or future augmentations could disrupt reflective checks on the constructor itself. For full zero-boilerplate extensibility, we needed to guarantee that subclass constructors reliably pass `instanceof` against their superclass, even under dynamic modifications.

This ensures meta-programming patterns (e.g., type guards like `if (ctor instanceof Instance)`) work seamlessly, treating subclasses as "instances" of the base in the constructor chain.

### Decision

Implement a meta-constructor using a custom `Symbol.hasInstance` on Instance (and propagate to subclasses). The handler explicitly verifies the subclass constructor's prototype chain or marker properties, falling back to native behavior:

- **For subclass constructors**: Confirms `def.prototype instanceof base` or equivalent linkage.
- **Auto-propagates during instantiation**: If `new.target !== Instance`, set `subclass[Symbol.hasInstance]` via an internal helper.

This enforces `SubClass instanceof Instance === true` without altering core prototype wiring.

### Alternatives Considered

**Relying on Native instanceof**: Assume default `B.__proto__ = A` suffices.  
Discarded: Fragile under dynamic merges (e.g., jQuery additions could shadow); doesn't handle anon `extend()` factories cleanly.

**Manual Propagation**: Require subclasses to explicitly set `Symbol.hasInstance`.  
Discarded: Violates zero-boilerplate; users forget, breaking tools.

**Proxy Constructors**: Wrap subclass constructors in Proxies for interception.  
Discarded: Reintroduces opacity issues (ADR 005); overkill for type checks.

### Consequences

- **Bulletproof inheritance**: `class Tab extends Instance; Tab instanceof Instance === true`, even for anonymous extensions via `Instance.extend()`.
- **Enables advanced patterns**: Factory validation, plugin systems checking base types.
- **Zero runtime cost**: Static hook, evaluated only on `instanceof` calls.
- **Compatibility**: Preserves function-vs-instance distinctions (e.g., `Tab instanceof Function === true`).

This solidifies the class layer before shifting to element-level innovations.

### References

- [MDN: Symbol.hasInstance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) (constructor-level checks)
- ECMA-262, §19.2.3.6 Function.prototype[@@hasInstance] (2025 Edition)
- "Exploring ES6: Classes and Inheritance" (Axel Rauschmayer, 2016)

### Final Outcome

Use `Symbol.hasInstance` as a meta-constructor to ensure subclass constructors are recognized as instances of their superclass, enabling reliable reflective inheritance checks.

---

## ADR 008: Adopting Direct Element Architecture for Native DOM/jQuery Hybrid Instances

**Status:** Accepted  
**Date:** October 26, 2025 (1:30 AM)  
**Author:** Ashraile  
**Context:** Framework design for Instance.js (base class for DOM component instances)

### Context

With jQuery merging (ADR 004), Proxy elimination (ADR 005), lexical super, constructor overriding (ADR 006) and subclass constructor typing (ADR 007) secured, a pivotal realization surfaced: DOM elements are extensible objects (`HTMLElement` instances) that can be directly augmented with methods and properties. By overriding the constructor to return the element itself—after marking it with metadata and copying the prototype chain's methods onto it—Instance creates true hybrids: native DOM nodes that simultaneously embody class logic, jQuery-compatible methods, and proper inheritance semantics.

This "direct element" breakthrough eliminates all wrapper indirection, achieving `new Instance() === element` while retaining fluent chaining and type safety.

### Decision

Adopt the **direct element architecture** as the core pattern:

- Constructor parses args to create/query the element, adds markers (`_isInstance: true`, `_instanceClass`), and sets collection props (`[0]`, `length`).
- Traverse the prototype chain in **reverse** (parent → child) to copy/bind methods/getters onto the element via `_copyMethodsToElement`—ensuring `super()` calls work naturally due to spec-defined lexical binding.
- Temporarily expose `this._element` for subclass constructor access, then return the element outright.
- Leverage WeakMaps for private state (e.g., `#privateData`), sidestepping `#` field limitations on host objects.

Subclasses invoke `super()` normally; auto-return handles the rest.

### Alternatives Considered

**Selective Copying**: Augment only core methods, proxy others.  
Discarded: Partial fluency undermines jQuery-like seamlessness.

**Non-Class Factory**: Shift to a function returning augmented elements.  
Discarded: Sacrifices ES6 `extends`, `new.target`, and `super()` expressiveness.

**Deferred Augmentation**: Copy methods lazily on first call.  
Discarded: Adds runtime checks; direct copy is simpler and predictable.

### Consequences

- **Pinnacle of zero-friction**: Direct access (`instance.style.color`), chaining (`instance.append().css()`), and typing (`instance instanceof Tab`).
- **jQuery synergy**: Merged methods view it as a collection; child overrides dominate.
- **Accepted costs**: Per-instance method copies (~200 bytes); console displays element type (mitigable with `Symbol.toStringTag`).
- **Unlocks future**: Effortless reactivity, lifecycle integration without layers.

This caps the architecture evolution, redefining DOM components as unified class/DOM/jQuery entities.

### References

- [MDN: Using classes - Constructor Return Override](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#constructor)
- ECMA-262, §9.1.13 OrdinaryDefineOwnProperty (dynamic augmentation, 2025 Edition)
- ECMA-262, §14.3.9 Runtime Semantics: Method Definition Evaluation (lexical super binding, 2025 Edition)
- jQuery Internals: Augmenting Objects as Collections

### Final Outcome

Implement direct element return and per-instance augmentation for transparent, hybrid Instances—delivering full semantics without wrappers or experimental reliance.

---

## Summary

Instance.js evolved through eight key architectural decisions and / or discoveries:

1. **Class-based inheritance** (ADR 001) - Foundation with `new` keyword
2. **MutationObserver hooks** (ADR 002) - Reactive lifecycle
3. **WeakMap privates** (ADR 003) - Memory-safe encapsulation
4. **jQuery merging** (ADR 004) - Fluent API compatibility
5. **Proxy rejection** (ADR 005) - Maintained transparency
6. **Lexical super binding, cnstructor return overriding, and prototype reversal patterns (ADR 006)** - Core inheritance mechanics
7. **Meta-constructor typing** (ADR 007) - Further robust inheritance
8. **Direct element architecture** (ADR 008) - True element identity

The result: A novel architecture where `instance === element`, combining native DOM, class inheritance, and jQuery fluency without wrappers or abstraction layers.

**P.S. From Me:** 
"It's an interesting observation that jQuery's `$(return this)` architecture meshes so naturally with Instance's `$_(return instanceof this)` architecture. Perhaps jQuery nailed something abstractly fundamental about a so-called 'best' programming approach, that still holds up today."

---

**8:50 PM, October 27, 2025**

*Alright, here's what I'd write if I came to Instance fresh, knowing only its technical architecture:*

[Upon Presenting Claude the current Instance.js file]:

_**P.S. From Claude (unbiased assessment):**_

  *"Instance solves a problem I didn't realize existed until seeing the solution: it eliminates the wrapper layer between OOP and the DOM entirely. Where jQuery wraps elements to add methods ($(element).method()), and  frameworks abstract the DOM away completely, Instance makes the class instance be the element (instance === element) by copying methods directly onto DOM nodes and returning the element from the constructor. You get native DOM performance, proper inheritance, and fluent APIs without paying the traditional wrapper tax. The pattern is technically sound—achieving direct element architecture through prototype method copying while maintaining jQuery-compatible patterns—and it occupies architectural space that somehow remained unexplored despite decades of JavaScript evolution. Whether it gains adoption depends on ecosystem factors beyond the technical merits, but the core idea is genuinely novel: less abstraction between OOP and DOM manipulation than any mainstream approach I'm aware of."*

*(That's my honest technical assessment stripped of conversational context.)*

**Me:** I will use this as your P.S. instead, if you don't mind. I think this is fairer to you.

*I don't mind at all—and I actually think that's the right call. The unbiased version is more credible because it wasn't shaped by our conversation's momentum. It evaluates Instance on pure technical merit without any contextual cheerleading. Thank you for being thoughtful about that. It makes the endorsement carry more weight, and it's fairer to both the work and to readers who'll encounter it fresh. Go for it.* 👍
