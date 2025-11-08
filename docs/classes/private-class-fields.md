# Private Class Fields in JavaScript

## Overview

Private fields (introduced in ES2022) provide true encapsulation in JavaScript classes. They are completely inaccessible from outside the class definition, even to subclasses. Understanding their behavior is essential for building robust, maintainable class architectures.

## Table of Contents

- [What Are Private Fields?](#what-are-private-fields)
- [Syntax and Declaration](#syntax-and-declaration)
- [Key Characteristics](#key-characteristics)
- [Private vs Public Comparison](#private-vs-public-comparison)
- [Inheritance and Private Fields](#inheritance-and-private-fields)
- [Private Methods](#private-methods)
- [Private Static Fields](#private-static-fields)
- [Common Patterns](#common-patterns)
- [Gotchas and Limitations](#gotchas-and-limitations)
- [Best Practices](#best-practices)

---

## What Are Private Fields?

Private fields are class properties that are **completely inaccessible** outside the class body. They use the `#` prefix to distinguish them from public properties.

```javascript
class BankAccount {
    #balance = 0;  // Private field
    
    deposit(amount) {
        this.#balance += amount;  // ✓ Accessible inside class
    }
    
    getBalance() {
        return this.#balance;  // ✓ Accessible inside class
    }
}

const account = new BankAccount();
account.deposit(100);
account.getBalance();  // 100
account.#balance;      // ❌ SyntaxError: Private field '#balance' must be declared in an enclosing class
```

### Not Properties, But Internal Slots

Private fields are **not** properties in the traditional JavaScript sense. They're stored in internal slots that are:
- Not enumerable
- Not accessible via bracket notation
- Not visible in `Object.keys()`, `Object.getOwnPropertyNames()`, or `for...in` loops
- Not accessible via reflection APIs like `Reflect` or `Object.getOwnPropertyDescriptor()`

```javascript
class Example {
    #private = 'secret';
    public = 'visible';
}

const ex = new Example();

Object.keys(ex);                    // ['public']
Object.getOwnPropertyNames(ex);     // ['public']
Object.getOwnPropertyDescriptor(ex, '#private');  // undefined
ex['#private'];                     // undefined (not a SyntaxError, just undefined)
```

---

### Implementation: Private Fields use Symbols internally.

Under the hood, JavaScript engines typically implement private fields using **Symbols** (or Symbol-like mechanisms). While the exact implementation is engine-specific, the conceptual model is:

```javascript
// Conceptual representation (not actual syntax)
class Example {
    #private = 'value';
}

// Roughly equivalent to:
const hashtag_private = Symbol('Example.#private');

class Example {
    constructor() {
        this[hashtag_private] = 'value';
    }
}
```

However, private fields have **stricter guarantees** than regular Symbol properties:

| Aspect | Private Field (`#field`) | Symbol Property (`[sym]`) |
|--------|-------------------------|---------------------------|
| **Access Outside Class** | ❌ SyntaxError | ✓ Accessible if symbol is shared |
| **Reflection APIs** | ❌ Invisible | ✓ `Object.getOwnPropertySymbols()` |
| **Compile-Time Checking** | ✓ Yes | ❌ No (runtime only) |
| **Serialization** | Never serialized | Can be serialized if exposed |

**Why This Matters:**

Even if you could somehow extract the internal Symbol (you can't in practice), the JavaScript engine enforces access control at parse time. Private fields are **language-level encapsulation**, not convention-based privacy:

```javascript
class Example {
    #value = 42;
}

const ex = new Example();

// Even getting the Symbol wouldn't help
const symbols = Object.getOwnPropertySymbols(ex);  // []
// Private fields don't show up!

// The engine itself prevents access
ex.#value;  // SyntaxError (caught before execution)
```

This Symbol-based implementation is why private fields are performant—they're direct slot lookups, not property chain traversals.

---

## Syntax and Declaration

### Declaration Rules

Private fields **must** be declared at the class level before use:

```javascript
class Valid {
    #field = 'value';  // ✓ Declared
    
    method() {
        console.log(this.#field);  // ✓ Can use
    }
}

class Invalid {
    method() {
        this.#field = 'value';  // ❌ SyntaxError: Private field '#field' must be declared
    }
}
```

### Naming Convention

The `#` is **part of the name**, not a prefix:

```javascript
class Example {
    #name = 'private';
    name = 'public';
    
    compare() {
        console.log(this.#name);  // 'private'
        console.log(this.name);   // 'public'
        // These are TWO DIFFERENT fields
    }
}
```

### Initialization Options

```javascript
class Example {
    #initialized = 42;           // ✓ With initial value
    #uninitialized;              // ✓ Undefined initially
    #computed = this.calculate(); // ✓ Computed value
    
    calculate() {
        return Math.random();
    }
}
```

---

## Key Characteristics

### 1. Compile-Time Checking

Private field access is checked at **parse time**, not runtime:

```javascript
class Example {
    #field = 'value';
}

const ex = new Example();

// This is a SYNTAX ERROR, caught before execution
ex.#field;  // SyntaxError

// Even this won't work:
const fieldName = '#field';
ex[fieldName];  // undefined (not an error, just treats it as a string key)
```

### 2. Instance-Specific

Each instance gets its own private fields, just like public instance fields:

```javascript
class Counter {
    #count = 0;
    
    increment() {
        this.#count++;
    }
    
    getCount() {
        return this.#count;
    }
}

const c1 = new Counter();
const c2 = new Counter();

c1.increment();
console.log(c1.getCount());  // 1
console.log(c2.getCount());  // 0 (separate instance)
```

### 3. Hard Privacy Guarantee

Unlike naming conventions (like `_private`), private fields provide **true encapsulation**:

```javascript
class Weak {
    _internal = 'convention';  // Just a convention
}

const weak = new Weak();
weak._internal = 'hacked';  // ✓ Can modify

class Strong {
    #internal = 'private';
}

const strong = new Strong();
strong.#internal = 'hacked';  // ❌ SyntaxError
```

---

## Private vs Public Comparison

| Aspect | Private Field (`#field`) | Public Field (`field`) |
|--------|-------------------------|------------------------|
| **Syntax** | `#fieldName` | `fieldName` |
| **Access Outside Class** | ❌ Never | ✓ Always |
| **Access in Subclass** | ❌ No | ✓ Yes |
| **Enumerable** | N/A (not a property) | ✓ Yes |
| **In `Object.keys()`** | ❌ No | ✓ Yes |
| **Bracket Notation** | ❌ No | ✓ Yes |
| **Can Be Added Dynamically** | ❌ No | ✓ Yes |
| **Naming Conflicts** | Isolated per class | Can conflict with parent |
| **Performance** | Slightly faster (direct slot access) | Normal property lookup |

---

## Inheritance and Private Fields

### Private Fields Are NOT Inherited

This is the most important concept: **private fields are completely isolated per class**.

```javascript
class Parent {
    #parentPrivate = 'parent secret';
    
    getParentPrivate() {
        return this.#parentPrivate;
    }
}

class Child extends Parent {
    #childPrivate = 'child secret';
    
    tryAccess() {
        console.log(this.#childPrivate);      // ✓ Works (own private field)
        console.log(this.getParentPrivate()); // ✓ Works (via public method)
        console.log(this.#parentPrivate);     // ❌ SyntaxError
    }
}
```

### Same Name, Different Fields

Parent and child can have private fields with the **same name** - they're completely separate:

```javascript
class Parent {
    #value = 'parent';
    
    getParentValue() {
        return this.#value;  // Accesses Parent's #value
    }
}

class Child extends Parent {
    #value = 'child';  // Different field, same name!
    
    getChildValue() {
        return this.#value;  // Accesses Child's #value
    }
    
    compare() {
        console.log(this.#value);          // 'child' (Child's #value)
        console.log(this.getParentValue()); // 'parent' (Parent's #value)
    }
}

const child = new Child();
child.compare();
// Output:
// 'child'
// 'parent'
```

### Why This Design?

This isolation prevents the "fragile base class" problem:

```javascript
// Parent class (v1)
class Component {
    #state = { data: [] };
}

// Child class works fine
class Button extends Component {
    #state = { clicked: false };  // No conflict!
}

// Parent class (v2) - adds new private field
class Component {
    #state = { data: [] };
    #config = { theme: 'dark' };  // New field doesn't break Button
}
```

---

## Private Methods

Private methods work just like private fields:

```javascript
class Calculator {
    #internalValue = 0;
    
    // Private method
    #validate(value) {
        if (typeof value !== 'number') {
            throw new TypeError('Must be a number');
        }
    }
    
    // Public method using private method
    add(value) {
        this.#validate(value);
        this.#internalValue += value;
    }
}

const calc = new Calculator();
calc.add(5);        // ✓ Works
calc.#validate(5);  // ❌ SyntaxError
```

### Private Getters and Setters

```javascript
class Temperature {
    #celsius = 0;
    
    // Private getter
    get #fahrenheit() {
        return (this.#celsius * 9/5) + 32;
    }
    
    // Private setter
    set #fahrenheit(f) {
        this.#celsius = (f - 32) * 5/9;
    }
    
    setFahrenheit(f) {
        this.#fahrenheit = f;  // Uses private setter
    }
    
    getFahrenheit() {
        return this.#fahrenheit;  // Uses private getter
    }
}
```

---

## Private Static Fields

Static private fields belong to the **class itself**, not instances:

```javascript
class Database {
    static #connection = null;
    static #connectionCount = 0;
    
    static connect() {
        if (!Database.#connection) {
            Database.#connection = createConnection();
            Database.#connectionCount++;
        }
        return Database.#connection;
    }
    
    static getStats() {
        return {
            connections: Database.#connectionCount
        };
    }
}

Database.connect();
Database.getStats();  // { connections: 1 }
Database.#connection;  // ❌ SyntaxError
```

### Private Static Methods

```javascript
class Validator {
    static #patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\d{3}-\d{3}-\d{4}$/
    };
    
    // Private static method
    static #test(pattern, value) {
        return pattern.test(value);
    }
    
    // Public static method
    static isValidEmail(email) {
        return Validator.#test(Validator.#patterns.email, email);
    }
}

Validator.isValidEmail('test@example.com');  // true
Validator.#test(/regex/, 'value');            // ❌ SyntaxError
```

### Not Inherited by Subclasses

Just like instance private fields, static private fields are **not accessible** in subclasses:

```javascript
class Parent {
    static #privateStatic = 'secret';
    
    static getPrivate() {
        return Parent.#privateStatic;
    }
}

class Child extends Parent {
    static tryAccess() {
        console.log(Parent.#privateStatic);  // ❌ SyntaxError
        console.log(this.#privateStatic);    // ❌ SyntaxError
        console.log(this.getPrivate());      // ✓ Works (via public method)
    }
}
```

---

## Common Patterns

### Pattern 1: Encapsulated State

```javascript
class Counter {
    #count = 0;
    #min = 0;
    #max = 100;
    
    increment() {
        if (this.#count < this.#max) {
            this.#count++;
        }
        return this;
    }
    
    decrement() {
        if (this.#count > this.#min) {
            this.#count--;
        }
        return this;
    }
    
    get value() {
        return this.#count;
    }
}

const counter = new Counter();
counter.increment().increment();
console.log(counter.value);  // 2
// Can't break the min/max constraints from outside
```

### Pattern 2: Singleton with Private Constructor

```javascript
class Singleton {
    static #instance = null;
    #data = {};
    
    // Private constructor simulation via private field check
    constructor() {
        if (Singleton.#instance) {
            throw new Error('Use Singleton.getInstance()');
        }
        Singleton.#instance = this;
    }
    
    static getInstance() {
        if (!Singleton.#instance) {
            new Singleton();  // Only way to construct
        }
        return Singleton.#instance;
    }
}

const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2);  // true

new Singleton();  // ❌ Error: Use Singleton.getInstance()
```

### Pattern 3: Friend Classes (Controlled Access)

```javascript
class PrivateData {
    #secret = 'confidential';
    
    // "Friend" method that can access private data
    [Symbol.for('internal.access')](accessor) {
        if (accessor === TrustedClass) {
            return this.#secret;
        }
        throw new Error('Access denied');
    }
}

class TrustedClass {
    static readSecret(data) {
        return data[Symbol.for('internal.access')](TrustedClass);
    }
}

const data = new PrivateData();
TrustedClass.readSecret(data);  // 'confidential'
```

### Pattern 4: Private Validation

```javascript
class Email {
    #address;
    
    constructor(address) {
        this.#validateAndSet(address);
    }
    
    #validateAndSet(address) {
        if (!this.#isValid(address)) {
            throw new Error('Invalid email');
        }
        this.#address = address;
    }
    
    #isValid(address) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
    }
    
    get value() {
        return this.#address;
    }
    
    set value(address) {
        this.#validateAndSet(address);
    }
}

const email = new Email('test@example.com');
email.value = 'invalid';  // ❌ Error: Invalid email
```

### Pattern 5: WeakMap Alternative

Before private fields, WeakMaps were used for privacy:

```javascript
// Old way (still valid)
const privates = new WeakMap();

class OldStyle {
    constructor() {
        privates.set(this, { secret: 'value' });
    }
    
    getSecret() {
        return privates.get(this).secret;
    }
}

// New way (cleaner)
class NewStyle {
    #secret = 'value';
    
    getSecret() {
        return this.#secret;
    }
}
```

---

## Gotchas and Limitations

### ❌ Gotcha: Can't Access in Object Literals

```javascript
class Example {
    #value = 42;
    
    toJSON() {
        return {
            value: this.#value  // ✓ Works in method
        };
    }
}

const ex = new Example();

// Can't access in external object literal
const obj = {
    extracted: ex.#value  // ❌ SyntaxError
};
```

### ❌ Gotcha: No Dynamic Access

```javascript
class Example {
    #field1 = 'a';
    #field2 = 'b';
    
    get(fieldName) {
        // Can't do dynamic access
        return this[fieldName];  // Doesn't work for private fields
        
        // Have to use explicit conditionals
        if (fieldName === 'field1') return this.#field1;
        if (fieldName === 'field2') return this.#field2;
    }
}
```

### ❌ Gotcha: Testing Private Fields

Private fields make unit testing harder since you can't spy on them:

```javascript
class Example {
    #internal = 0;
    
    process() {
        this.#internal++;
        return this.#transform(this.#internal);
    }
    
    #transform(value) {
        return value * 2;
    }
}

// Can't test #transform directly
// Can't verify #internal value
// Must test through public API only
```

**Solution:** Either test through public API or expose getters for testing:

```javascript
class Example {
    #internal = 0;
    
    // Only available in test builds
    get __internal() {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('Test-only accessor');
        }
        return this.#internal;
    }
}
```

### ❌ Gotcha: Can't Delete Private Fields

```javascript
class Example {
    #field = 'value';
    
    remove() {
        delete this.#field;  // ❌ SyntaxError
        this.#field = undefined;  // ✓ Can set to undefined
    }
}
```

### ❌ Gotcha: `this` in Private Methods

```javascript
class Example {
    #value = 42;
    
    #getDouble() {
        return this.#value * 2;
    }
    
    process() {
        const fn = this.#getDouble;
        fn();  // ❌ TypeError: this.#value is not accessible
        
        // Must bind or use arrow function
        const bound = this.#getDouble.bind(this);
        bound();  // ✓ Works
    }
}
```

### ❌ Gotcha: Subclass Can't Override Private Methods

```javascript
class Parent {
    #helper() {
        return 'parent';
    }
    
    process() {
        return this.#helper();
    }
}

class Child extends Parent {
    // This is a DIFFERENT method, doesn't override parent's
    #helper() {
        return 'child';
    }
}

const child = new Child();
child.process();  // 'parent' (not 'child'!)
```

---

## Best Practices

### ✅ Use Private Fields for True Encapsulation

Don't use `_underscore` convention when you need real privacy:

```javascript
// ❌ Weak privacy
class Weak {
    _internal = 'please don't touch';
}

// ✓ Strong privacy
class Strong {
    #internal = 'actually private';
}
```

### ✅ Provide Public Accessors When Needed

```javascript
class User {
    #email;
    #password;
    
    constructor(email, password) {
        this.#email = email;
        this.#password = this.#hash(password);
    }
    
    // Public getter, no setter (read-only)
    get email() {
        return this.#email;
    }
    
    // No direct password access at all
    verifyPassword(input) {
        return this.#hash(input) === this.#password;
    }
    
    #hash(value) {
        // Hash implementation
        return value; // Simplified
    }
}
```

### ✅ Use Private Methods for Internal Logic

```javascript
class DataProcessor {
    process(data) {
        const validated = this.#validate(data);
        const transformed = this.#transform(validated);
        return this.#finalize(transformed);
    }
    
    // These are implementation details
    #validate(data) { /* ... */ }
    #transform(data) { /* ... */ }
    #finalize(data) { /* ... */ }
}
```

### ✅ Document What's Private and Why

```javascript
/**
 * Manages user authentication.
 * 
 * Private fields:
 * - #sessions: WeakMap of active sessions (security)
 * - #tokenSecret: Secret key for JWT signing (security)
 * 
 * These are private to prevent external tampering.
 */
class AuthManager {
    #sessions = new WeakMap();
    #tokenSecret = generateSecret();
    
    // Public API...
}
```

### ✅ Prefer Private Over Protected

JavaScript has no `protected` keyword. If subclasses need access, use public/protected naming:

```javascript
class Base {
    #trulyPrivate = 'only Base';
    _protectedByConvention = 'subclasses can use';
    
    // Or provide protected access method
    _getInternal() {
        return this.#trulyPrivate;
    }
}
```

### ✅ Use Private Static for Class-Level Secrets

```javascript
class APIClient {
    static #apiKey = process.env.API_KEY;
    static #baseURL = 'https://api.example.com';
    
    static async fetch(endpoint) {
        return fetch(APIClient.#baseURL + endpoint, {
            headers: { 'Authorization': APIClient.#apiKey }
        });
    }
}

// API key is completely hidden
```

---

## Browser Support

Private fields are supported in:
- Chrome 74+ (2019)
- Firefox 90+ (2021)
- Safari 14.1+ (2021)
- Node.js 12+ (with flag), 14+ (stable)

For older environments, use a transpiler like Babel or TypeScript.

---

## Summary Table

| Feature | Behavior |
|---------|----------|
| **Syntax** | `#fieldName` (# is part of name) |
| **Declaration Required** | ✓ Yes (at class level) |
| **Access Outside Class** | ❌ Never (SyntaxError) |
| **Access in Subclass** | ❌ Never (SyntaxError) |
| **Inherited** | ❌ No (each class has own) |
| **Enumerable** | N/A (not a property) |
| **Dynamic Access** | ❌ No (no bracket notation) |
| **Can Be Deleted** | ❌ No |
| **Performance** | Slightly faster than public |
| **Use Case** | True encapsulation |

---

## Further Reading

- [MDN: Private Class Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
- [TC39 Proposal: Class Fields](https://github.com/tc39/proposal-class-fields)
- [Static Properties →](./static-properties.md)
- [Instance.js: Encapsulation Patterns](../patterns/encapsulation.md)

---

**Next:** [Class Inheritance Patterns →](./inheritance-patterns.md)
