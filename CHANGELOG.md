## 1.0.0-beta.5 (2025-10-30) (prototype)

### Solved
  - Tricky question answered: if a tab (lowercase 't') is both a Tab (Instance) and an Element, what should its constructor return? Is it a Tab first? Or an Element?
  - Completely new programming territory with no precedent, requires careful thought to arrive at logical conclusion.
  - Answer: Constructors are, you guessed it, objects, so add both, but prioritize its (most semantically accurate) class definition.
  - `tab.constructor === Tab` => `true`
  - `tab.constructor.native === HTMLDivElement` => also `true` (if a div)
  - if tab is a button, `tab.constructor.native` is `HTMLButtonElement` and so on
  - Auto-override of constructor can be configured in options: `{ constructor: [true|false] }` (defaults to `true` if omitted)
  - Implemented in beta.5

### Prototyped:
  - new Kernel class using cached native statics to minimize tampering (whether accidental or intentional).
  - Supports inheritance of custom metadata descriptors (enumerable, configurable, writable) (set via `Object.defineProperty` or possibly even via @decorators) on Subclasses
  - Modes: `'flexible'` | `'strict'` | `'strictest'`
  - *Flexible*: subclass descriptors override inherited ones by default; descriptors are not inherited.
  - *Strict*: non-configurable, non-writable subclass metadata descriptor.value can be overridden by identically-named child methods, however metadata descriptors are inherited from parent (and cannot be overridden when 'false')
  - *Strictest*: non-configurable, non-writable subclass descriptors can NOT be overridden by identically-named child methods.

### Removed
  - this.element, this._element, some other vars. I don't like programmatic clutter.

### TODO:
  - A lot
  - Full Direct Element Architecture compliance: make `(Tab.prototype.isPrototypeOf(tab) === true` AND `HTMLDivElement.isPrototypeOf(tab) === true`. (it's the only remaining `false` check...as far as I know.
  - Switch Instance element metadata properties to Symbols to avoid polluting DOM element namespace except where its intentional.
  - Handle edge cases of descriptor inheritance, fully delineate descriptor inheritance model across each mode.
  - Fully flesh out Instance API
  - Simplify and/or fully harden the Kernel.
  - Minor polish
  - Might remove `this.main`, we'll see. Probably won't do this one, let's be honest.
  - Make strictest mode explicitly throw instead of merely warning to console. Keep strict mode as warn-by-default.
  - API: May change 'strictest' to 'strict' for minimal dev learning curve, and change current 'strict' mode to some other name (rigid, perhaps)

## 1.0.0-beta.4 (2025-10-27) (meta-stable)

### Fixed
  - Host Method Merging: Resolved critical issues from `beta.2` where some host methods (e.g. read-only APIs like `document.children`) did not seamlessly merge into subclass prototypes (throwing on copy). `Beta.4` fixes edge cases, ensuring seamless inheritance without shadowing or breakage.
  - `super` and `async super`: Deep `super` chaining now fully supports natives (e.g., remove() bubbling through 4+ levels).
Async super calls (await super.method()) resolve correctly. (To be honest, this was already true, it was just the host method merging getting in the way).

### Other
  - Unit Testing Completed: All 56 unit tests passed (100% coverage), including multi-level inheritance, async cascades, getters/setters shadowing, static factories, error bubbling, and `Symbol.hasInstance` upgrades.
  - See Instance-comprehensive-unit-test.html
  - *Woops*: Beta.3? Yeah, I skipped that one - Semver deemed skipping a version appropriate. 😅 Full diff: [beta.2...beta.4](link-to-compare).
  - No Breaking Changes: Backward-compatible with `beta.2`; deprecations for legacy .main/.element props (use `this` directly for DOM access).

## 1.0.0-beta.2 (2025-10-26)
### ✨ Enhancements
- **Direct Element Architecture** (ADR 007): `new Instance()` now *is* the DOM element—true identity, zero wrappers, fluent chaining with native DOM/jQuery.
- Auto-method copying from prototype chain (preserves `super()`, overrides correctly [mostly, see changelog]).
- Custom `Symbol.hasInstance` for seamless `instanceof Subclass`.
- jQuery auto-merge on first init (overrides optional).

## 1.0.0-beta.1 (2025-10-25)
  - Dropped Proxy layer implementation; (ADR 005) Proxified Instances deemed 'unsolvable' without Transparent Proxies.
