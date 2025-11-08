
# Using Constructor Return Override in JavaScript Classes

You can think of classes as Java (or Solidity) Interfaces, except they can also contain internal logic:

```javascript
class Example {
    someMethod() { alert('Hello World!'); }
}

let exp = new Example();
exp.someMethod(); // alerts "Hello World!"
```

Not to be confused with ES5 'constructor functions' (ES5: `function Box() { this.a = 1; }`): ES6 classes MUST be instantiated via the `new` keyword: `new Example()`.

Calling a class without `new` throws a `TypeError`.

In JavaScript, a class `constructor` is a special internal method that auto-executes exactly once: when a *new instance* of that class is created (upon `new Example()`).

```javascript
var counter = 0;

class Example {
    constructor() {
        console.log(++counter, 'instanceof this was initialized at: '+(+new Date()));
    }
    someMethod() { alert('Hello World!'); }
}

let exp1 = new Example(); // (1, some date);
let exp2 = new Example(); // (2, some date);
```

Constructors are responsible for handling the class’s default state or logic during initialization.

Including one is optional, except for when you need fine-grained control. (A default 'blank' constructor is automatically included if the class does not define one)., 

They also automatically follow specific rules regarding their return value, which can be leveraged to implement custom patterns like factories or singletons.

## 1. The Standard: Implicit `return this`

By default, a class `constructor` function is designed to initialize the new object instance. When a constructor finishes execution without an explicit `return`, it **implicitly returns the object referenced by `this`**.

```javascript
class Standard {
    constructor(name) {
        this.name = name;
        // not needed: 'return this' is implicit:
     // return this;
    }
}

const standardInstance = new Standard('Alice');
console.log(standardInstance); // Output: { name: 'Alice' }
```
-----

## 2. The Override: Explicit Return Rules

A constructor **can** contain an explicit `return` statement, but its effect depends on the data type of the returned value:

### Rule A: Returning a Primitive Value

If you explicitly return a **primitive value** (e.g., a number, string, boolean, `undefined`, or `null`), the return value is **ignored**. The constructor will still return the object referenced by `this`.

```javascript
class PrimitiveReturner {
    constructor() {
        this.status = 'initialized';
        return 42;   // -> primitive return value -> IGNORED
    /// return;      // -> equivalent to `return undefined` -> IGNORED
    /// return true; // -> IGNORED
    /// return null; // -> IGNORED
    }
}

const instanceA = new PrimitiveReturner();
console.log(instanceA); // Output: { status: 'initialized' }
```

### Rule B: Returning a Non-`null` Object (The Constructor Return Override)

If you explicitly return a **non-`null` object** (e.g., `{}` literal, `[]` array, or an instance of another class), this returned object will become the final instance, effectively **overriding and discarding the `this` object** that was initially created.

This behavior is useful for implementing **Factory Patterns** (where the constructor decides which type of object to return) or **Singleton Patterns** (where the constructor ensures only one instance exists).

```javascript
class ObjectReturner {
  constructor(property) {
    // The 'this' object is created and initialized, but will be discarded.
    this.originalID = 1; 
    
    // Explicitly return a *new* object.
    return {
      property: property,
      override: true
    };
  }
}

const instanceB = new ObjectReturner('Custom Value');
console.log(instanceB); 
// Output: { property: 'Custom Value', override: true }
```

-----

## 3\. The Practical Application: Returning a DOM Element 🏗️

Since **DOM elements are (non-null) JavaScript objects** (See ADR-008), 
this override rule allows a class constructor to be used as a convenient factory for creating and returning a ready-to-use DOM element, 
rather than returning a direct instance of the class itself.

```javascript
class MyCustomButton {
  constructor(text) {
    // 1. Create the DOM element
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'custom-btn';
    
    // 2. Attach some event logic (optional)
    button.addEventListener('click', () => {
        console.log(`Button "${text}" clicked!`);
    });

    // 3. Explicitly return the DOM element (a non-null object)
    return button;
  }
}

// Now, when creating a new instance:
const saveButton = new MyCustomButton('Save Data');

// The result is the actual HTML Button element, not the MyCustomButton class instance.
console.log(saveButton instanceof HTMLButtonElement); // Output: true
console.log(saveButton.textContent);                  // Output: 'Save Data'

// This object can now be directly appended to the DOM:
// document.body.appendChild(saveButton); 
```

In this scenario, calling `new MyCustomButton('...')` immediately provides the functional DOM element, simplifying the code needed to render the component.
