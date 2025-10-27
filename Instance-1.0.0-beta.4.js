  /**
     * Instance.js - Direct Element Architecture (v1.0.0-beta.4)
     * Base class for DOM components with zero-boilerplate inheritance.
     * See ADRs for the full evolution story.
     */

     /*
        The ants go marching two by two, hurrah. Hurrah.
        The ants go marching two by two, hurrah! Hurrah!
     */
    class Instance {
      static #observers = new WeakMap();
      static #privateData = new WeakMap();

      static #createHasInstance(base) {
        return (value) => {
          if (value && value._isInstance === true) return true;
          return (typeof value !== 'function') 
            ? Function.prototype[Symbol.hasInstance].call(base, value)
            : value.prototype instanceof base;
        };
      }

      static [Symbol.hasInstance](value) {
        return Instance.#createHasInstance(Instance)(value);
      }

      static isMerged = false;

      static config = { mode: 'flexible', debug: false };

      static get jQuery() { return typeof jQuery === 'function'; }

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
        if (force) Instance.isMerged = false;
        if (Instance.isMerged) {
          console.log('mergeJQuery(): Already merged—skipping.');
          return;
        }
        const $ = jQuery;
        const fnKeys = Object.keys($.fn);
        fnKeys.forEach(method => {
          const fn = $.fn[method];
          if (typeof fn === 'function' && !Instance.prototype.hasOwnProperty(method)) {
            Instance.prototype[method] = fn;
          }
        });
        Instance.isMerged = true;
        console.log(`Merged ${fnKeys.filter(k => typeof $.fn[k] === 'function').length} jQuery.fn methods`);
      }
  
    _copyMethodsToElement(element) {
      console.log('Copying methods to:', element.constructor.name, element);
  const internalMethods = ['constructor', '_copyMethodsToElement', '_getPrivate', '_setPrivate'];
  
  // Collect all prototypes in the inheritance chain
  const protos = [];
  let proto = Object.getPrototypeOf(this);
  
  while (proto && proto !== Object.prototype) {
    protos.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  
  // CRITICAL: Reverse order (parent first, child last)
  // Ensures child methods overwrite parent while preserving super references
  protos.reverse().forEach(proto => {
    Object.getOwnPropertyNames(proto).forEach(name => {
      // Skip internal methods
      if (internalMethods.includes(name)) {
        return;
      }

      // methods like children() are read-only, but do NOT exist as own properties, but rather in the element prototype. 
      // if (name in element && element.hasOwnProperty(name)) {} <- this check breaks
      
      // GUARD: Only skip if it's a native DOM property
      // Check on a fresh element to detect native properties
      if (name in element) {
        const testEl = document.createElement(element.tagName);
        const isNative = name in testEl;
        testEl.remove();
        
        if (isNative) {
          console.warn(`Skipping native DOM prop '${name}' on ${element.constructor.name}`);
          return;
        }
        // If not native, allow overwriting (child overrides parent)
      }
      
      const descriptor = Object.getOwnPropertyDescriptor(proto, name);
      
      // Copy methods (bind to element)
      if (descriptor && typeof descriptor.value === 'function') {
        element[name] = descriptor.value.bind(element);
      }
      // Copy getters/setters (only if configurable)
      else if (descriptor && (descriptor.get || descriptor.set) && descriptor.configurable) {
        Object.defineProperty(element, name, {
          get: descriptor.get ? descriptor.get.bind(element) : undefined,
          set: descriptor.set ? descriptor.set.bind(element) : undefined,
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable
        });
      }
    });
  });
}



      get name() { return this._instanceClass?.name || 'Instance'; }

      constructor() {
        // Auto-merge jQuery on first instantiation if available
        if (Instance.jQuery && !Instance.isMerged) {
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
              // No arguments - will create default div
              return {};
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

        // Mark element with Instance metadata
        element._isInstance = true;
        element._instanceClass = this.constructor;
        
        // Array-like interface (jQuery compatibility)
        element[0] = element;
        element.length = 1;

        // Store private data in WeakMap
        Instance.#privateData.set(element, {
          isInitialized: false,
          options: options
        });

        // Copy all methods from prototype chain onto element
        this._copyMethodsToElement(element);

        // Store element reference on 'this' temporarily for subclass constructor access
        // Subclass constructors can access 'this' to get the element, then we return it
        this._element = element;

        // Auto-init if requested
        if (options.autoInit !== false && element.init) {
          element.init(options);
        }

        // CRITICAL: Return element instead of 'this'
        // This makes `new Instance()` yield the element directly
        // Subclasses DON'T need to manually return - this happens automatically
        return element;
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

      get isInitialized() {
        const privateData = Instance.#privateData.get(this);
        return privateData ? privateData.isInitialized || false : false;
      }

      get options() {
        const privateData = Instance.#privateData.get(this);
        return privateData ? privateData.options || {} : {};
      }

      // Getters / Setters. (Leftover from legacy code)
      get main() { return this[0]; } set main(v) { this[0] = v; }
      get element() { return this[0]; } set element(v) { this[0] = v; }

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
       *   - Direct extension: class Tab extends Instance { constructor(...args) { super(...args); this.classList.add('tab'); } }
       *   - Anonymous: const TabModule = Instance.extend(class { myMethod() {...} });
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

      get isWrapped() {
        return !!Instance.jQuery;
      }
    }
