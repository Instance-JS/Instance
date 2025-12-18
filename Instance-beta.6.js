/**
 *  Instance.js - Direct DOM Architecture (v1.0.0-beta.6)
 * 
 *  @license AGPL-3.0 
 * 
 *  Instance is not a framework. It is not a library. It is not a wrapper around the DOM. Instance IS the DOM, or, more precisely, it is a meta-layer
 *  that handles the abstraction of merging both the ES6 Class Model and the Document Object Model into one unified architecture. No build tools.
 *  No dependencies (unless you want them). Just pure javascript.
 * 
 *  See docs/ADR.md
 */

/*
    The ants go marching one by one, hurrah. Hurrah.
    ---
    The ants go marching two by two, hurrah! Hurrah!

    ## The Nursery Rhyme as Algorithm
    ```
    The ants go marching one by one, hurrah, hurrah → First pass: Copy everything configurable

    The ants go marching two by two, hurrah, hurrah → Second pass: Lock down what needs locking

    The little one stops to suck his thumb → Check if property exists, handle edge cases

    And they all go marching down to the ground → Return the fully-configured element

    To get out of the rain, BOOM! BOOM! BOOM! → Error handling with try-catch
*/
// (Dual Prototype Chains via Symbol.for Meta-Classes)
/**
 * Kernel - Native Function Cache & Safe Wrappers
 * 
 * THREAT MODEL:
 * 
 * 1. Prototype Pollution
 *    - Attacker overrides native Object.prototype.toString, Array.prototype.slice, Function.prototype.call, etc.
 *    - Defense: Cache (required) natives at module load, use frozen statics. This is good practice anyway, even if we don't fully harden.
 * 
 * 2. Evil Web Components
 *    - Native DOM element properties can be overridden by 'identical' getters (tagName, constructor) that invoke state-changing functions on read access.
 *    - Defense: Use cached native getters to read internal slots.
 * 
 * 3. Reactive Frameworks (e.g. Vue, Angular, Svelte)
 *    - Legitimate custom getters may log data or mutate state on read access. Not very common, but not unheard of. (i.e. Vue.reactive())
 *    - Defense: Only use descriptors to 'read' data via Object.getOwnPropertyDescriptor.
 * 
 * 4. Revoked Proxies 
 *    - DevTools creates revocable proxy (i.e. on element inspection), then revokes it (user closes console). 
 *    - All operations except get|set will now automatically throw. 
 *    - Even trusted natives, like Object.getOwnPropertyDescriptor, break. An obscure, 'standards compliant' absurdity. Hard to expect, harder to trace.
 *    - Defense: Try-catch handles TypeError returned from revoked operations
 * 
 * 5. Proxy Traps
 *    - Malicious or overly defensive Proxies can intercept all property access and/or method calls, deliberately throwing errors on any read / write operation.
 *    - Defense: Every operation wrapped in try-catch, never use 'in' operator
 * 
 * 6. Frozen/Sealed Objects
 *    - Security policies or malicious code freezes prototypes
 *    - Defense: defineProperty wrapped, continues on failure
 * 
 * 
 * WHAT WE CANNOT DEFEND AGAINST:
 * 
 * - Attacker runs BEFORE Kernel loads (cache poisoning)
 * - Attacker has direct reference to Kernel internals
 * - Ancient browsers that do not support both ES5 Object descriptors (Object.freeze), and ES6 Class Syntax
 * - Complete memory exhaustion (ERR_OUT_OF_MEMORY)
 * - JavaScript engine bugs
 * 
 * If attacker controls script execution order, they have already won.
 * 
 * Warning: This is not yet a completely hardened implementation.
 */
class Kernel {

    static Object = Object.freeze({
        getPrototypeOf: Object.getPrototypeOf,
        getOwnPropertyNames: Object.getOwnPropertyNames,
        getOwnPropertySymbols: Object.getOwnPropertySymbols,
        getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
        defineProperty: Object.defineProperty,
        freeze: Object.freeze
    });
    
    static Array = Object.freeze({
        push: Array.prototype.push,
        reverse: Array.prototype.reverse,
        includes: Array.prototype.includes,
        forEach: Array.prototype.forEach
    });
    
    static Function = Object.freeze({
        call: Function.prototype.call,
        bind: Function.prototype.bind
    });
    
    static Reflect = Object.freeze({
        has: Reflect.has
    });
    
    static console = Object.freeze({
        log: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
    });
    
    static document = Object.freeze({
        createElement: document.createElement.bind(document)
    });
    
    static Element = Object.freeze({
        tagName: Object.getOwnPropertyDescriptor(Element.prototype, 'tagName')?.get,
        remove: Element.prototype.remove
    });
    
    // ========================================================================
    // CONFIGURATION
    // ========================================================================
    
    static MAX_PROTOTYPE_DEPTH = 50;
    
    // ========================================================================
    // SAFE WRAPPERS
    // ========================================================================
    
    static getPrototypeOf(obj) {
        try {
            return Kernel.Object.getPrototypeOf(obj);
        } catch (e) {
            return null;
        }
    }
    
    static getOwnPropertyNames(obj) {
        try {
            return Kernel.Object.getOwnPropertyNames(obj);
        } catch (e) {
            return [];
        }
    }
    
    static getOwnPropertySymbols(obj) {
        try {
            return Kernel.Object.getOwnPropertySymbols(obj);
        } catch (e) {
            return [];
        }
    }
    
    static getOwnPropertyDescriptor(obj, prop) {
        try {
            return Kernel.Object.getOwnPropertyDescriptor(obj, prop);
        } catch (e) {
            return undefined;
        }
    }
    
    static defineProperty(obj, prop, descriptor) {
        try {
            Kernel.Object.defineProperty(obj, prop, descriptor);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    static has(obj, prop) {
        try {
            return Kernel.Reflect.has(obj, prop);
        } catch (e) {
            return false;
        }
    }
    
    static arrayPush(arr, ...items) {
        try {
            return Kernel.Function.call.call(Kernel.Array.push, arr, ...items);
        } catch (e) {
            return arr.length;
        }
    }
    
    static arrayReverse(arr) {
        try {
            return Kernel.Function.call.call(Kernel.Array.reverse, arr);
        } catch (e) {
            return arr;
        }
    }
    
    static arrayIncludes(arr, item) {
        try {
            return Kernel.Function.call.call(Kernel.Array.includes, arr, item);
        } catch (e) {
            return false;
        }
    }
    
    static arrayForEach(arr, callback, thisArg) {
        try {
            return Kernel.Function.call.call(Kernel.Array.forEach, arr, callback, thisArg);
        } catch (e) {
            // Silent fail
        }
    }
    
    static bind(fn, thisArg) {
        try {
            return Kernel.Function.call.call(Kernel.Function.bind, fn, thisArg);
        } catch (e) {
            return () => undefined;
        }
    }
    
    static isFunction(obj) {
        return typeof obj === 'function';
    }
    
    static log(...args) {
        try {
            Kernel.Function.call.call(Kernel.console.log, console, ...args);
        } catch (e) {
            // Silent fail
        }
    }
    
    static warn(...args) {
        try {
            Kernel.Function.call.call(Kernel.console.warn, console, ...args);
        } catch (e) {
            // Silent fail
        }
    }
    
    static error(...args) {
        try {
            Kernel.Function.call.call(Kernel.console.error, console, ...args);
        } catch (e) {
            // Silent fail
        }
    }
    
    static createElement(tagName) {
        try {
            return Kernel.document.createElement(tagName);
        } catch (e) {
            return null;
        }
    }
    
    static getTagName(element) {
        if (!Kernel.Element.tagName) {
            try {
                return element.tagName;
            } catch (e) {
                return null;
            }
        }
        
        try {
            return Kernel.Function.call.call(Kernel.Element.tagName, element);
        } catch (e) {
            return null;
        }
    }
    
    static removeElement(element) {
        try {
            Kernel.Function.call.call(Kernel.Element.remove, element);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    static getPrototypeChain(obj, maxDepth = Kernel.MAX_PROTOTYPE_DEPTH) {
        const chain = [];
        const seen = new Set();
        let current = obj;
        let depth = 0;
        
        while (current && current !== Object.prototype && depth < maxDepth) {
            if (seen.has(current)) {
                Kernel.warn('Circular prototype chain detected');
                break;
            }
            
            Kernel.arrayPush(chain, current);
            seen.add(current);
            
            current = Kernel.getPrototypeOf(current);
            depth++;
            
            if (depth >= maxDepth) {
                Kernel.warn('Prototype chain exceeds max depth', maxDepth);
            }
        }
        
        return chain;
    }
    
    static isNativeDOMProperty(element, propName) {
        const tagName = Kernel.getTagName(element);
        if (!tagName) {
            return false;
        }
        
        const testEl = Kernel.createElement(tagName);
        if (!testEl) {
            return false;
        }
        
        const isNative = Kernel.has(testEl, propName);
        Kernel.removeElement(testEl);
        
        return isNative;
    }
}

Object.freeze(Kernel);
Object.freeze(Kernel.prototype);

let Protodummy = function Bridge(element) {
    return element;
};

Protodummy.prototype = HTMLElement.prototype;

class Instance {

    static [Symbol.hasInstance](value) {
        return Instance.#createHasInstance(Instance)(value);
    }

    static #observers = new WeakMap();
    static #privateData = new WeakMap();
    static #elementTypeCache = new Map();



      // main getter/setter. (Leftover from legacy code). I like it, I created it, so I'm keeping it. *moons you*
    // fun fact: [0] does not technically violate the DOM property naming specification.

    get main() { return this[0]; } 
    set main(v) { this[0] = v; }

    // TODO: Private fields can not be set on DOM elements, however, Symbols can.

    get isWrapped() {
        return !!Instance.jQuery;
    }

    get isInitialized() {
        const privateData = Instance.#privateData.get(this);
        return privateData ? privateData.isInitialized || false : false;
    }

    get options() {
        const privateData = Instance.#privateData.get(this);
        return privateData ? privateData.options || {} : {};
    }

    get name() { return this.Instance?.name || 'Instance'; }
    
    constructor() {
        // Auto-merge jQuery on first instantiation if available
        if (Instance.jQuery && !Instance.isjQueryMerged) {
            Instance.mergeJQuery();
        }

        

        // Auto-propagate: Set on subclass constructor if not already set
        if (new.target !== Instance) {
            const subclass = new.target;
            if (!subclass[Symbol.hasInstance]) {
                subclass[Symbol.hasInstance] = Instance.#createHasInstance(subclass);
            }
        }

        // Parse constructor arguments
        let value = arguments[0];
        let maybeOptions = arguments[1];
        let options = (function(len) {
            const isPlainObject = (O) => (O?.constructor === Object);
            switch (len) {
                case 0: {
                    return {}; // No arguments - will create default div
                }
                case 1: {
                    if (!value) Instance.throw('Constructor argument must be non-nullish.');
                    if (isPlainObject(value) && !('main' in value)) {
                        Instance.throw('Options object requires "main" key for auto-init.');
                    }
                    return isPlainObject(value) ? value : { main: value };
                }
                case 2: {
                    if (isPlainObject(value) && isPlainObject(maybeOptions)) {
                        Instance.throw('Both arguments cannot be object literals.');
                    }
                    return {
                        ...(isPlainObject(maybeOptions) ? maybeOptions : {}),
                        main: value
                    };
                }
                default: {
                    return {};
                }
            }
        })(arguments.length);

        // Create or query the element
        let element;
        if ('main' in options) {
            // Selector/element provided - must exist or throw
            const el = Instance.query(options.main);
            if (!el) {
                Instance.throw(`Element query not resolved for "${options.main}"`);
            }
            element = el;
        } else {
            // No arguments - create default div
            element = document.createElement('div');
        }

        // ========================================================================
        // 🔥 DYNAMIC SPECIALIZED CLASS CREATION FOR DUAL PROTOTYPE CHAIN
        // ========================================================================
        // Goal: Make BOTH of these true:
        // - Tab.prototype.isPrototypeOf(tab) === true
        // - HTMLDivElement.prototype.isPrototypeOf(tab) === true
        //
        // Strategy: 
        // 1. Create a specialized subclass per (UserClass, NativeElementClass) pair
        // 2. Link the specialized class's prototype chain to include the native prototype
        // 3. Each pair gets its own bridge class, cached for reuse
        //
        // Example chains:
        // - new Tab(div):
        //   element → SpecializedClass.prototype → Tab.prototype → Instance.prototype → HTMLDivElement.prototype → ...
        // - new Tab(button):  
        //   element → SpecializedClass2.prototype → Tab.prototype → Instance.prototype → HTMLButtonElement.prototype → ...
        // ========================================================================
        
        // CRITICAL: Check if element.constructor has been modified by Instance
        // If element.constructor.native exists, use that; otherwise use element.constructor
        const NativeElementClass = element.constructor?.native || element.constructor;
        const UserClass = this.constructor;
        
        // Create unique cache key using Symbol for true uniqueness
        const cacheKey = Symbol.for(`${UserClass.name}:${NativeElementClass.name}`);
        
        // Get or create specialized subclass for this (UserClass, NativeElementClass) pair
        let SpecializedClass = Instance.#elementTypeCache.get(cacheKey);
        
        if (!SpecializedClass) {
            if (Instance.config.debug) {
                Kernel.log(`Creating specialized class: ${UserClass.name}:${NativeElementClass.name}`);
            }
            
            // Create anonymous subclass of UserClass
            // Initial chain: SpecializedClass.prototype → UserClass.prototype → Instance.prototype → Object.prototype
            SpecializedClass = class extends UserClass {

            };

            /*
                let EigenProto = class extends Protodummy {

                }

                setPrototypeOf(EigenProto)

            */
            
            // Walk the prototype chain starting from SpecializedClass.prototype
            // and find where to insert the native element prototype
            // Object.setPrototypeOf(SpecializedClass.prototype, new Protodummy(element));
            let currentProto = SpecializedClass.prototype;
            // try {
            while (currentProto) {
                // console.log('Logging proto:', currentProto);
                const nextProto = Object.getPrototypeOf(currentProto);
                
                // If we've reached Instance.prototype, link it to the native prototype
                // If we've reached Object.prototype or null, link current proto to native
                if (
                    (currentProto === Instance.prototype) ||
                    (nextProto === Object.prototype || !nextProto)
                ) {
                    Object.setPrototypeOf(currentProto, NativeElementClass.prototype);
                    if (Instance.config.debug) {
                        Kernel.log(`Linked Instance.prototype → ${NativeElementClass.name}.prototype`);
                    }
                    break;
                }
                
                currentProto = nextProto;
            }
            // } catch (e) {}
            
            // Cache the specialized class for future instances of this pair
            Instance.#elementTypeCache.set(cacheKey, SpecializedClass);
        }
        
        // Set element's prototype to the specialized class prototype
        // Final chain: element → SpecializedClass.prototype → UserClass.prototype → Instance.prototype → NativeElementClass.prototype → ...
        Object.setPrototypeOf(element, SpecializedClass.prototype);

        // ========================================================================
        // METADATA & CONFIGURATION
        // ========================================================================

        // Mark element with Instance metadata
        element._isInstance = true;
        element.Instance = UserClass;      // Points to original class (Tab), not SpecializedClass
        element.instance = UserClass.name; // String name for debugging
        
        // jQuery compatibility: Array-like interface
        element[0] = element;
        element.length = 1;

        // Constructor override (optional via config)
        let overrideConstructor = 
            this.constructor.config?.constructor ?? 
            Instance.config.constructor ?? 
            true;

        if (overrideConstructor) {
            const nativeConstructor = NativeElementClass;
            element.constructor = UserClass;
            element.constructor.native = nativeConstructor;
        }

        // Store private data in WeakMap
        Instance.#privateData.set(element, {
            isInitialized: false,
            options: options
        });

        // Copy all methods from prototype chain onto element
        // Note: This may be redundant with the new prototype chain architecture
        // and could potentially be removed in future versions for performance
        // this._copyMethodsToElement(element);

        // Auto-init if requested
        if (options.autoInit !== false && element.init) {
            element.init(options);
        }

        // CRITICAL: Return element — not `this`
        // This makes `new Tab()` return the actual DOM element, not a wrapper
        // Subclasses don't need to manually return - this happens automatically
        return element;
    }



    static get jQuery() { return typeof jQuery === 'function'; }

    static isjQueryMerged = false;
    static config = { mode: 'flexible', debug: false };

    static #createHasInstance(base) {
        return function(value) {
            if (value && value._isInstance === true) {
                return true;
            }
            return (typeof value !== 'function') 
                ? Function.prototype[Symbol.hasInstance].call(base, value)
                : value.prototype instanceof base;
        };
    }

    static throw(msg, ErrorClass = TypeError) { throw new ErrorClass(msg); }

    static require(...args) {
        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
          const validations = args[0];
          for (const [msg, condition] of Object.entries(validations)) {
            if (!condition) Instance.throw(msg);
          }
          return true;
        }
        const [value, msg, fn] = args;
        if (!value) Instance.throw(msg || `${value} evaluated falsy.`);
        if (typeof fn === 'function') {
          let val = fn.call(undefined, value);
          if (val !== undefined) return val;
        }
        return value;
    }


    static mergeJQuery(force = false) {
        if (!Instance.jQuery) {
          console.warn('mergeJQuery(): jQuery not loaded—skipping.');
          return;
        }
        if (force) Instance.isjQueryMerged = false;
        if (Instance.isjQueryMerged) {
          console.log('mergeJQuery(): Already merged—skipping.');
          return;
        }
        const fnKeys = Object.keys(jQuery.fn);
        fnKeys.forEach(method => {
          const fn = jQuery.fn[method];
          if (typeof fn === 'function' && !Instance.prototype.hasOwnProperty(method)) {
            Instance.prototype[method] = fn;
          }
        });
        Instance.isjQueryMerged = true;
        console.log(`Merged ${fnKeys.filter(k => typeof jQuery.fn[k] === 'function').length} jQuery.fn methods`);
    }
  
    /*
     * I initially assumed that designing the correct implementation of this method would prove fairly trivial.
     * The code: [https://www.youtube.com/watch?v=wFJ6UZ0SkYY]
     */
    _copyMethodsToElement(element) {
        // Philosophy: this function can NEVER throw. So we make sure it doesn't.
       try {

        // Get mode from subclass config, fallback to Instance.config
        const mode = this.constructor.config?.mode || Instance.config.mode || 'strict';
        
        const InstanceInternals = ['constructor', '_copyMethodsToElement', '_getPrivate', '_setPrivate'];
          
        const propertyMap = new Map(); // Map to store merged property information | name → { type, value/get/set, writable, enumerable, shouldLock }
    
        const protos = Kernel.getPrototypeChain(this); // Collect prototype chain
      
        // ========================================================================
        // 🐜 PASS ONE: Collect and merge all properties
        // ========================================================================

        // CRITICAL: Traverse the prototypes in reverse order: Parent first, child last
        Kernel.arrayReverse(protos);
        Kernel.arrayForEach(protos, proto => {
            // Get both string-named properties AND symbols
            let allKeys = [...Kernel.getOwnPropertyNames(proto), ...Kernel.getOwnPropertySymbols(proto)];
            
            Kernel.arrayForEach(allKeys, name => {
                // Skip internal methods (string names only)
                if (typeof name === 'string' && Kernel.arrayIncludes(InstanceInternals, name)) {
                    return;
                }
                
                const descriptor = Kernel.getOwnPropertyDescriptor(proto, name);
                if (!descriptor) {
                    return;
                }
                
                // CRITICAL: Skip native DOM properties (string names only)
                if (typeof name === 'string' && Kernel.isNativeDOMProperty(element, name)) {
                    if (Instance.config.debug) {
                        Kernel.log('Skipping native DOM property:', name);
                    }
                    return;
                }
                
                const existing = propertyMap.get(name);
                const isData = 'value' in descriptor;
                const isAccessor = descriptor.get || descriptor.set;
                
                // ----------------------------------------------------------------
                // STRICTEST MODE: Reject override if parent is non-configurable
                // ----------------------------------------------------------------
                if (mode === 'strictest' && existing?.shouldLock) {
                    Kernel.warn('Cannot override non-configurable parent property:', name);
                    return;
                }
                
                // ----------------------------------------------------------------
                // TYPE CHANGE DETECTION: Warn/block data ↔ accessor conversions
                // ----------------------------------------------------------------
                if (existing && mode !== 'flexible') {
                    const wasData = existing.type === 'data';
                    const nowData = isData;
                    
                    if (wasData !== nowData) {
                        if (mode === 'strictest') {
                            Kernel.warn('Cannot convert between data/accessor in strictest mode:', name);
                            return;
                        }
                        if (mode === 'strict' && Instance.config.debug) {
                            Kernel.warn('Converting property type for:', name, 
                                '(', wasData ? 'data→accessor' : 'accessor→data', ')');
                        }
                    }
                }
                
                // ----------------------------------------------------------------
                // DETERMINE DESCRIPTOR ATTRIBUTES BASED ON MODE
                // ----------------------------------------------------------------
                let shouldLock, writable, enumerable;
                
                if (mode === 'flexible') {
                    // FLEXIBLE: Child's descriptor attributes win entirely
                    shouldLock = descriptor.configurable === false;
                    writable = descriptor.writable ?? true;
                    enumerable = descriptor.enumerable ?? false;
                } else {
                    // STRICT/STRICTEST: Union of constraints (most restrictive wins)
                    
                    // configurable: false from ANY ancestor → lock it
                    shouldLock = (descriptor.configurable === false) || (existing?.shouldLock ?? false);
                    
                    // writable: false from ANY ancestor → make read-only
                    if (isData) {
                        const currentWritable = descriptor.writable ?? true;
                        const parentWritable = existing?.writable ?? true;
                        writable = currentWritable && parentWritable;  // Both must be true
                    } else {
                        writable = true;  // Not applicable for accessors
                    }
                    
                    // enumerable: Child wins (not a security constraint)
                    enumerable = descriptor.enumerable ?? (existing?.enumerable ?? false);
                }
                
                // ----------------------------------------------------------------
                // BUILD MERGED PROPERTY INFO
                // ----------------------------------------------------------------
                
                if (isData) {
                    // DATA DESCRIPTOR (value property)
                    const value = Kernel.isFunction(descriptor.value)
                        ? Kernel.bind(descriptor.value, element)
                        : descriptor.value;
                    
                    propertyMap.set(name, {
                        type: 'data',
                        value: value,
                        writable: writable,
                        enumerable: enumerable,
                        shouldLock: shouldLock
                    });
                } 
                else if (isAccessor) {
                    // ACCESSOR DESCRIPTOR (get/set) 
                    let finalGet, finalSet;
                    
                    if (mode === 'flexible' || !existing || existing.type !== 'accessor') {
                        // FLEXIBLE mode or first definition or type changed:
                        // Use child's get/set as-is (undefined if not provided)
                        finalGet = descriptor.get ? Kernel.bind(descriptor.get, element) : undefined;
                        finalSet = descriptor.set ? Kernel.bind(descriptor.set, element) : undefined;
                    } else {
                        // STRICT/STRICTEST mode with existing accessor:
                        // PARTIAL ACCESSOR MERGING - preserve parent's undefined accessors
                        
                        finalGet = descriptor.get 
                            ? Kernel.bind(descriptor.get, element)  // Child defines getter
                            : existing.get;  // Keep parent's getter
                        
                        finalSet = descriptor.set 
                            ? Kernel.bind(descriptor.set, element)  // Child defines setter
                            : existing.set;  // Keep parent's setter
                    }
                    
                    propertyMap.set(name, {
                        type: 'accessor',
                        get: finalGet,
                        set: finalSet,
                        enumerable: enumerable,
                        shouldLock: shouldLock
                    });
                }
            });
        });
        
        // ========================================================================
        // 🐜🐜 PASS TWO: Apply all merged properties to element
        // ========================================================================
        
        propertyMap.forEach((propInfo, name) => {
            let success = false;
            
            if (propInfo.type === 'data') {
                // Define data property
                success = Kernel.defineProperty(element, name, {
                    value: propInfo.value,
                    writable: propInfo.writable,
                    enumerable: propInfo.enumerable,
                    configurable: !propInfo.shouldLock
                });
                
                if (!success) {
                    Kernel.warn('Failed to define data property:', name);
                }
            } 
            else if (propInfo.type === 'accessor') {
                // Define accessor property
                success = Kernel.defineProperty(element, name, {
                    get: propInfo.get,
                    set: propInfo.set,
                    enumerable: propInfo.enumerable,
                    configurable: !propInfo.shouldLock
                });
                
                if (!success) {
                    Kernel.warn('Failed to define accessor property:', name);
                }
            }
            
            if (Instance.config.debug && success) {
                Kernel.log('Copied property:', name, 
                    '(', propInfo.type, 
                    propInfo.shouldLock ? ', locked' : ', configurable',
                    ')');
            }
        });
      } catch (e) {
        Kernel.warn('Unknown proto failure. Methods could not be copied.')
      }
    }



      // Private data accessors (using WeakMap)
      // Note: Can't use # syntax for getters when 'this' is an element
      _getPrivate() {
        return Instance.#privateData.get(this) || {};
      }
      
      _setPrivate(data) {
        const current = Instance.#privateData.get(this) || {};
        Instance.#privateData.set(this, { ...current, ...data });
      }

      push(elem) {
        return Instance.require(Instance.query(elem), `${this.name}.push(): Element query not resolved`, (value) => {
          this.length = this.length >>> 0;
          this[this.length++] = value;
          return this;
        });
      }

      /**
       * Factory for ergonomic subclassing: Handles both anonymous defs and pre-defined 'extends Instance' classes.
       * - Anonymous: Merges into new Sub extends Instance.
       * - Pre-defined: Returns the subclass (no-op).
       * 
       * NOTE: Subclasses DON'T need to manually return element from constructor.
       * The base Instance constructor automatically returns the element.
       * 
       * Usage: 
       *   - Pre-defined: class Tab extends Instance { ... } -> Instance.extend(Tab) 
       *   - Anonymous: let TabModule = Instance.extend(class { myMethod() {...} });
       * 
       * @param {ClassDefinition|Subclass} def - Anonymous class or existing subclass.
       * @returns {Subclass} The merged or existing constructor—use with 'new'.
       */
      static extend(def) {
        if (typeof def !== 'function') {
          Instance.throw('extend(): Argument must be a class definition or subclass.');
        }

        // Handle pre-defined subclass (extends Instance): Return as-is
        if (def.prototype instanceof Instance) {
          return def;
        }

        // Anonymous def: Create/merge into new Sub
        const Sub = class extends Instance {
          constructor(...args) {
            super(...args); // Returns element automatically
            
            // 'this' is now the element (returned by super)
            // Call user's constructor if defined
            const defConstructor = def.toString();
            const hasCustomConstructor = defConstructor.includes('constructor') && 
              !defConstructor.match(/constructor\s*\(\s*\)\s*{\s*}/);
            
            if (hasCustomConstructor && def.prototype.constructor !== Object.prototype.constructor) {
              def.prototype.constructor.apply(this, args);
            }
            
            // No need to return - super() already returned the element
          }
        };
        // Kernel.retrieve('prototype', def)

        // Merge methods/statics from def to Sub
        Object.getOwnPropertyNames(def.prototype).forEach(key => {
          if (key !== 'constructor') {
            Sub.prototype[key] = def.prototype[key];
          }
        });
        Object.getOwnPropertyNames(def).forEach(key => {
          if (key !== 'length' && key !== 'name' && key !== 'prototype') {
            Sub[key] = def[key];
          }
        });

        return Sub;
      }

      // ───────────────────────────────────────────────
      //  Configuration utility
      // ───────────────────────────────────────────────
      static configure(options = {}) {
        if (typeof options.mode === 'string') {
          this.config.mode = options.mode;
        }
        return this.config;
      }

      static query(value, strict = false) {
        if (value && value._isInstance) { // Direct element architecture check
          return value[0] || value;
        }

        if (Instance.jQuery && (value instanceof jQuery)) {
          const elem = value[0];
          if (!elem && strict) {
            Instance.throw(`${this.name || 'Instance'}: jQuery Object contains no element`);
          }
          return elem || null;
        }

        if ((value && value.nodeType === 1) || value instanceof Document || value instanceof Window) {
          return value;
        }

        if (typeof value === 'string') {
          const elem = Instance.jQuery ? jQuery(value)[0] : document.querySelector(value);
          if (!elem && strict) {
            Instance.throw(`${this.name || 'Instance'}: No element found for selector "${value}"`);
          }
          return elem || null;
        }

        if (strict) {
          Instance.throw(`${this.name || 'Instance'}: Argument must resolve to a valid Instance, jQuery Object, Global, or Element`);
        }
        return null;
      }

      static whenInsertedTo(rootNode, element, callbackScope = null, callback) {

        Instance.require({
            'rootNode must be a DOM Node': rootNode instanceof Node,
            'element must be a DOM Node': element instanceof Node,
            'callback must be a function!': typeof callback === 'function'
        });

        const invokeCallback = (el) => {
          if (callbackScope) {
            callback.call(callbackScope, el);
          } else {
            callback(el);
          }
        };

        if (rootNode.contains(element)) {
          invokeCallback(element);
          return;
        }

        let observer = new MutationObserver((mutations, obs) => {
          for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
              for (let node of mutation.addedNodes) {
                if (node === element || node.contains(element)) {
                  invokeCallback(element);
                  obs.disconnect();
                  
                  if (callbackScope) {
                    Instance.#observers.delete(callbackScope);
                  }
                  return;
                }
              }
            }
          }
        });

        observer.observe(rootNode, { childList: true, subtree: true });

        if (callbackScope) {
          Instance.#observers.set(callbackScope, observer);
        }
      }

      init(optionsOrRoot) {

        const privateData = Instance.#privateData.get(this) || {};
        
        if (privateData.isInitialized) {
          Instance.throw(`${this.name}.init(): Already initialized.`);
        }

        Instance.require(this.main,
          `${this.name}.init(): this[0] must be set before calling init(). ` +
          `Set this[0] = element in your constructor before calling this.init().`
        );

        let options = {};
        let root = document.documentElement;

        if (optionsOrRoot) {
          if (optionsOrRoot instanceof Node) {
            root = optionsOrRoot;
          } else if (typeof optionsOrRoot === 'object') {
            options = optionsOrRoot;
            root = options.root || root;
          }
        }

        // Update private data
        Instance.#privateData.set(this, {
          isInitialized: true,
          options: { ...privateData.options, ...options }
        });

        // Capture self for consistent hook invocation
        const self = this;
        Instance.whenInsertedTo(root, this.main, self, function(element) {
          try {
            self.onInserted(element);
          } catch (err) {
            console.error(err);
          }
          try {
            self.sync();
          } catch (err) {
            console.error(err);
          }
        });

        return this;
      }

      onInserted(element) {}
      // whenInsertedTo(arbitrary node, fn);
      // handle when target is appended with / without using the formal API
      sync() {}

      appendTo(container) {
        const target = Instance.query(container);
        if (!target) {
          Instance.throw(`${this.name}.appendTo(): Invalid container`);
        }
        if (!this.main) {
          Instance.throw(`${this.name}.appendTo(): No main element to append`);
        }
        target.appendChild(this.main);
        return this;
      }

      append(content) {
        if (!this.main) {
          Instance.throw(`${this.name}.append(): No main element`);
        }
        
        const contentElement = content?._isInstance ? content[0] : 
                content instanceof Element ? content : null;
        
        if (contentElement) {
          this.main.appendChild(contentElement);
        } else if (typeof content === 'string') {
          this.main.insertAdjacentHTML('beforeend', content);
        }
        return this;
      }

      prepend(content) {
        if (!this.main) {
          Instance.throw(`${this.name}.prepend(): No main element`);
        }
        
        const contentElement = content?._isInstance ? content[0] : 
                              content instanceof Element ? content : null;
        
        if (contentElement) {
          this.main.insertBefore(contentElement, this.main.firstChild);
        } else if (typeof content === 'string') {
          this.main.insertAdjacentHTML('afterbegin', content);
        }
        return this;
      }

      remove() {
        this.beforeRemoving();

        if (this.main && this.main.parentNode) {
          if (Instance.jQuery) {
            jQuery(this.main).remove();
          } else {
            this.main.remove();
          }
        }

        // Disconnect observer via WeakMap
        const observer = Instance.#observers.get(this);
        if (observer) {
          observer.disconnect();
          Instance.#observers.delete(this);
        }

        this.afterRemoving();
        return this;
      }

      beforeRemoving() {}
      afterRemoving() {}

}
