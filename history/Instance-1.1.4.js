
/**
 *  - Instance~.js
 *  - Base class for defining jQuery-compatible DOM component Instances.
 *  - A redefinition of component-based UI architecture, combining class-based modular inheritance with the seamless API and method chaining of jQuery.
 * @version flux 
 * (beta release, basically, but I prototype very rapidly and I'm not adding a version number for every tiny logical improvement; that's painfully boring).
 */

/**
 * NOTE: This implementation uses a standard, non-proxied object model to guarantee
 * full ECMAScript compatibility, including object identity, prototype chains,
 * instanceof checks, and subclass extensibility via `new.target`.
 *
 * A Proxy-wrapped design was originally planned, such that dynamic API validation (pre- and post-initialization), could be achieved without manual boilerplate checks.
 * However, current JavaScript (ES2025) lacks Transparent Proxies - a key feature (that I determined to be) necessary in order to 
 * avoid breaking (at least) one of the following: zero-boilerplate subclass instantiation / extensibility, 
 * class method strict equality, WeakMap key identity, and reflective behaviors.

 * Transparent Proxies (`new TransparentProxy()`) would unify Proxy and target identity (e.g., `proxy === target`)
 * while maintaining full prototype transparency; meaning, usable within Instance. This feature has been proposed in
 * academic research since 2015 and exists in experimental builds, but remains, as of yet, unstandardized.
 *
 * Widespread adoption of (a future release of) Instance could build momentum for Transparent Proxy standardization, enabling richer features in future releases. Until then,
 * clean, intuitive inheritance is prioritized over bulletproof API validation.
 *
 * Excerpt from ADR-005 (October 25, 2025)
 */


class Instance {

    // Private static WeakMap for observer management (auto garbage collected)
    static #observers = new WeakMap();
    
    #isInitialized = false;
    #options = {};

    // Internal helper: Creates the custom [Symbol.hasInstance] function for a given base
    static #createHasInstance(base) {
        return (value) => {
            return (typeof value !== 'function') 
                ? Function.prototype[Symbol.hasInstance].call(base, value)
                : value.prototype instanceof base;
        };
    }

    // Base's own static method (uses internal helper)
    static [Symbol.hasInstance](value) {
        return Instance.#createHasInstance(Instance)(value);
    }

    // Static flag for lazy merge
    static isMerged = false;

    static config = {
        /**
         * Strictness mode for method access and whitelist mutation.
         *  - 'flexible' : Permissive (default), jQuery methods (if jQuery is defined) are allowed before init.
         *      NOTE: Instance methods ALWAYS override jQuery methods.
         *      NOTE: Instance subclass methods ALWAYS override Instance methods.
         *  - 'strict'   : Disallow jQuery methods before init(), allow whitelist edits
         *  - 'strictest': Disallow jQuery before init(), freeze whitelist
         */
        mode: 'flexible',
        debug: false
    };

    static get jQuery() {
        return (typeof jQuery === 'function');
    }

    static throw(msg, ErrorClass = TypeError) {
        throw new ErrorClass(msg);
    }

    // Integrated require: Handles single (value, msg, fn) or multi ({ msg: condition }) based on args
    static require(...args) {
        // Multi-mode: First (and only) arg is a plain object
        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
            const validations = args[0];
            for (const [msg, condition] of Object.entries(validations)) {
                if (!condition) {
                    Instance.throw(msg);
                }
            }
            return true;  // Success signal (or return validations for chaining)
        }

        // Single-mode: Original logic (value, msg, fn)
        const [value, msg, fn] = args;
        if (!value) {
            Instance.throw(msg || `${value} evaluated falsy.`);
        }
        if (typeof fn === 'function') {
            let val = fn.call(undefined, value);
            if (val !== undefined) {
                return val;
            }
        }
        return value;
    }

    /**
     * Dynamically merges all function properties from jQuery.fn to Instance.prototype.
     * Direct assignment—jQuery methods work on Instance as array-like collection.
     * Skips if already defined (defers to overrides); public for force-run (e.g., dynamic jQuery).
     * @param {boolean} [force=false] - If true, resets isMerged and re-merges (overwrites skips).
     */
    static mergeJQuery(force = false) {
        if (!Instance.jQuery) {
            console.warn('mergeJQuery(): jQuery not loaded—skipping.');
            return;
        }

        if (force) {
            Instance.isMerged = false;  // Allow re-merge (e.g., jQ version change)
        }

        if (Instance.isMerged) {
            console.log('mergeJQuery(): Already merged—skipping.');
            return;
        }

        const $ = jQuery;
        const fnKeys = Object.keys($.fn);

        fnKeys.forEach(method => {
            const fn = $.fn[method];
            if (typeof fn === 'function' && !Instance.prototype.hasOwnProperty(method)) {
                Instance.prototype[method] = fn;  // Direct copy—native chaining
            }
        });

        Instance.isMerged = true;
        console.log(`Merged ${fnKeys.filter(k => typeof $.fn[k] === 'function').length} jQuery.fn methods to Instance.prototype`);
    }

    get main() { return this[0]; } set main(v) { this[0] = v; } // I prefer main so I'm keeping it. Yes yes it's a technical redundancy. *moons you*
    get element() { return this[0]; } set element(v) { this[0] = v; } 

    get name() { return this.constructor.name; }

    constructor() {

        // Auto-merge jQuery on first instantiation if available
        if (Instance.jQuery && !Instance.isMerged) {
            Instance.mergeJQuery();
        }

        // Auto-propagate: Set on subclass constructor if not already set
        // makes `{Subclass} instanceof Instance` => true
        if (new.target !== Instance) {
            const subclass = new.target;
            if (!subclass[Symbol.hasInstance]) {
                subclass[Symbol.hasInstance] = Instance.#createHasInstance(subclass);
            }
        }

        let value = arguments[0];
        let maybeOptions = arguments[1];
        let options = (function(len) {
            const isPlainObject = (O) => (O?.constructor === Object);
            switch (len) {
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
        
        this.#options = options;
        
        // --- main element setup ---
        if ('main' in options) {
            const el = Instance.query(options.main);
            if (!el) {
                Instance.throw(`Element query not resolved for "${options.main}"`);
            }
            this[0] = el;
            this.length = 1;
            if (options.autoInit !== false && this.init) this.init(options);
        }
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
     * Usage: 
     *   - Anonymous: const TabModule = Instance.extend(class { constructor(a, b) { super(a, b); } ... });
     *   - Pre-defined: class TabModule extends Instance { ... }; const TabModule = Instance.extend(TabModule);
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
                super(...args);  // Base setup/auto-init
                // Call user's constructor if defined (check for custom implementation)
                const defConstructor = def.toString();
                const hasCustomConstructor = defConstructor.includes('constructor') && 
                    !defConstructor.match(/constructor\s*\(\s*\)\s*{\s*}/);
                
                if (hasCustomConstructor && def.prototype.constructor !== Object.prototype.constructor) {
                    def.prototype.constructor.apply(this, args);
                }
            }
        };

        // Merge methods/statics from def to Sub (user overrides base)
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

        if (value instanceof Instance || (Instance.jQuery && (value instanceof jQuery))) { // Instance / jQuery object
            const elem = value[0];
            if (!elem && strict) {
                Instance.throw(`${this.name || 'Instance'}: Instance / jQuery Object contains no element`);
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
                            
                            // Clean up observer via WeakMap
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

        // Store observer in WeakMap for later cleanup
        if (callbackScope) {
            Instance.#observers.set(callbackScope, observer);
        }
    }

    init(optionsOrRoot) {

        if (this.#isInitialized) {
            Instance.throw(`${this.name}.init(): Already initialized.`);
        }
        this.#isInitialized = true;

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

        this.#options = { ...this.#options, ...options };

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

    get options() {
        return this.#options;
    }

    onInserted(element) {}
    sync() {}

    // to do, add jQuery native way
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
        if (content instanceof Instance) {
            this.main.appendChild(content.main);
        } else if (content instanceof Element) {
            this.main.appendChild(content);
        } else if (typeof content === 'string') {
            this.main.insertAdjacentHTML('beforeend', content);
        }
        return this;
    }

    prepend(content) {
        if (!this.main) {
            Instance.throw(`${this.name}.prepend(): No main element`);
        }
        if (content instanceof Instance) {
            this.main.insertBefore(content.main, this.main.firstChild);
        } else if (content instanceof Element) {
            this.main.insertBefore(content, this.main.firstChild);
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

    ready(fn) {
        if (typeof fn !== 'function') return this;

        if (document.readyState === 'loading') {
            const handler = () => {
                fn();
                document.removeEventListener('DOMContentLoaded', handler);
            };
            document.addEventListener('DOMContentLoaded', handler);
        } else {
            fn();
        }
        return this;
    }

    get isInitialized() {
        return this.#isInitialized;
    }

    get isWrapped() {
        return !!Instance.jQuery;
    }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Instance;
}
