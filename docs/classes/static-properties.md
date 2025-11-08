# Static Properties in JavaScript Classes

## Overview

Static properties (fields and methods) live on the **class itself**, not on instances. Understanding how they work with inheritance is crucial for building class-based architectures.

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Accessing Static Properties](#accessing-static-properties)
- [Inheritance Behavior](#inheritance-behavior)
- [The Static Prototype Chain](#the-static-prototype-chain)
- [Common Patterns](#common-patterns)
- [Gotchas and Best Practices](#gotchas-and-best-practices)

---

## Basic Concepts

### What Are Static Properties?

Static properties are attached to the **constructor function** (the class itself), not to instances or prototypes.

```javascript
class Factory {
    static count = 0;
    static create() { return new Factory(); }
}

// Access via the class name
Factory.count;    // 0
Factory.create(); // Factory instance

// NOT accessible on instances
const instance = new Factory();
instance.count;   // undefined
instance.create;  // undefined
```

### When Are They Created?

Static properties are defined **once** at class definition time, not per instance.

```javascript
class Example {
    static initialized = Date.now();
}

// This timestamp never changes, even with new instances
console.log(Example.initialized); // 1699564800000
setTimeout(() => {
    console.log(Example.initialized); // Still 1699564800000
}, 1000);
```

---

## Accessing Static Properties

### Three Access Patterns

```javascript
class Factory {
    static config = { mode: 'production' };
}

class SubFactory extends Factory {}

// 1. Direct access on parent class
Factory.config  // ✓ Works

// 2. Access via subclass (inherited)
SubFactory.config  // ✓ Works

// 3. Access on instances
const instance = new SubFactory();
instance.config  // ✗ undefined (static props don't exist on instances)
```

### Inside Class Methods

```javascript
class Factory {
    static config = { mode: 'production' };
    
    // Instance method accessing static property
    getMode() {
        return Factory.config.mode;  // ✓ Explicit class name
        return this.constructor.config.mode;  // ✓ Dynamic (works in subclasses)
    }
    
    // Static method accessing static property
    static getConfig() {
        return this.config;  // ✓ 'this' refers to the class
        return Factory.config;  // ✓ Also works
    }
}
```

---

## Inheritance Behavior

### Static Properties Are Accessible, Not Inherited

This is the most confusing part. Subclasses **can access** parent static properties, but they don't **own** them.

```javascript
class Factory {
    static version = '1.0.0';
}

class SubFactory extends Factory {}

// Access works
SubFactory.version  // '1.0.0'

// But it's not an own property
SubFactory.hasOwnProperty('version')  // false
Factory.hasOwnProperty('version')     // true
```

### Why This Matters

Changes to the parent affect all subclasses (unless they override):

```javascript
class Factory {
    static count = 0;
}

class SubFactory extends Factory {}
class AnotherSub extends Factory {}

// All share the same property
Factory.count++;
console.log(SubFactory.count);   // 1
console.log(AnotherSub.count);   // 1

// Modifying via subclass affects the parent
SubFactory.count++;
console.log(Factory.count);      // 2
console.log(AnotherSub.count);   // 2
```

### Shadowing (Overriding)

When a subclass defines its own static property with the same name:

```javascript
class Factory {
    static type = 'base';
}

class SubFactory extends Factory {
    static type = 'specialized';  // Shadows parent's property
}

Factory.type     // 'base'
SubFactory.type  // 'specialized'

// Now they're independent
Factory.type = 'modified';
SubFactory.type  // Still 'specialized'
```

---

## The Static Prototype Chain

Classes themselves have a prototype chain, separate from the instance prototype chain.

### Two Chains Exist

```javascript
class GrandParent {
    static gp = 'grandparent';
}

class Parent extends GrandParent {
    static p = 'parent';
}

class Child extends Parent {
    static c = 'child';
}

// Instance prototype chain:
// instance → Child.prototype → Parent.prototype → GrandParent.prototype → Object.prototype

// Static prototype chain:
// Child → Parent → GrandParent → Function.prototype → Object.prototype
```

### Walking the Static Chain

```javascript
Object.getPrototypeOf(Child) === Parent           // true
Object.getPrototypeOf(Parent) === GrandParent     // true
Object.getPrototypeOf(GrandParent) === Function.prototype  // true

// This is how Child.gp works:
// 1. Check Child - not found
// 2. Check Parent (Child's prototype) - not found
// 3. Check GrandParent (Parent's prototype) - found!
```

---

## Common Patterns

### Pattern 1: Shared Configuration

```javascript
class Database {
    static config = {
        host: 'localhost',
        port: 5432
    };
    
    connect() {
        const { host, port } = this.constructor.config;
        // Use host and port...
    }
}

class ProductionDB extends Database {
    static config = {
        host: 'prod.example.com',
        port: 5432
    };
}
```

### Pattern 2: Factory Registry

```javascript
class Component {
    static registry = new Map();
    
    static register(name, implementation) {
        this.registry.set(name, implementation);
    }
    
    static create(name) {
        const Implementation = this.registry.get(name);
        return new Implementation();
    }
}

class Button extends Component {}
class Input extends Component {}

Component.register('button', Button);
Component.register('input', Input);

const btn = Component.create('button');  // Button instance
```

### Pattern 3: Singleton Pattern

```javascript
class ConfigManager {
    static #instance = null;
    
    static getInstance() {
        if (!this.#instance) {
            this.#instance = new this();
        }
        return this.#instance;
    }
}

const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();
console.log(config1 === config2);  // true
```

### Pattern 4: Class-Level Counters

```javascript
class Entity {
    static #nextId = 0;
    
    constructor() {
        this.id = Entity.#nextId++;
    }
}

const e1 = new Entity();  // id: 0
const e2 = new Entity();  // id: 1
```

---

## Gotchas and Best Practices

### ❌ Gotcha: Shared Mutable State

```javascript
class Factory {
    static items = [];  // SHARED across all subclasses!
}

class FactoryA extends Factory {}
class FactoryB extends Factory {}

FactoryA.items.push('A');
console.log(FactoryB.items);  // ['A'] - shared!
```

**Solution:** Override in each subclass if you need isolation:

```javascript
class FactoryA extends Factory {
    static items = [];  // Own copy
}
```

### ❌ Gotcha: `this` in Static Methods

```javascript
class Factory {
    static type = 'base';
    
    static getType() {
        return this.type;  // 'this' is the class that called it
    }
}

class SubFactory extends Factory {
    static type = 'sub';
}

Factory.getType();     // 'base'
SubFactory.getType();  // 'sub' (not 'base'!)
```

This is usually what you want, but be aware `this` is dynamic.

### ❌ Gotcha: Arrow Functions Lose `this`

```javascript
class Factory {
    static type = 'factory';
    
    // Arrow function captures 'this' at definition time
    static getType = () => {
        return this.type;  // 'this' is undefined or global!
    }
}
```

**Solution:** Use regular methods for static methods that need `this`.

### ✅ Best Practice: Use Explicit Class Names for Clarity

```javascript
class Factory {
    static config = {};
    
    // Clear what's being accessed
    static getConfig() {
        return Factory.config;  // Explicit
    }
    
    // vs
    static getConfigDynamic() {
        return this.config;  // Dynamic, but less clear
    }
}
```

### ✅ Best Practice: Private Static Fields for Encapsulation

```javascript
class Factory {
    static #instances = new WeakMap();
    
    static register(key, value) {
        Factory.#instances.set(key, value);  // Only Factory can access
    }
    
    static get(key) {
        return Factory.#instances.get(key);
    }
}

// Can't do this:
// Factory.#instances  // SyntaxError
```

### ✅ Best Practice: Document Inheritance Expectations

```javascript
/**
 * Base configuration class.
 * 
 * Subclasses should override `static config` to provide
 * their own configuration without affecting the parent.
 */
class BaseConfig {
    static config = { /* defaults */ };
}
```

---

## Summary Table

| Aspect | Behavior |
|--------|----------|
| **Location** | On the class constructor itself |
| **When Created** | Class definition time (once) |
| **Accessible from Instances** | ❌ No |
| **Accessible from Subclasses** | ✓ Yes (via prototype chain) |
| **Own Property of Subclass** | ❌ No (unless overridden) |
| **Inherited** | Sort of (accessible, not copied) |
| **Mutable** | ✓ Yes (changes affect all unless shadowed) |
| **`hasOwnProperty`** | Only true on defining class |

---

## Further Reading

- [MDN: Static Properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)
- [Instance.js: Symbol Registry Pattern](../api/registry.md)
- [Understanding JavaScript Prototypes](./prototypes.md)

---

**Next:** [Private Fields and Methods →](./private-properties.md)
