## Section 3: "Not Accessible from Instances"

```markdown
### 3. Instances Can Access Via Class Name

Instances **can** access static private fields by using the class name (not `this`):

```javascript
class Example {
    static #secret = 'classified';
    
    // Instance method can access via class name
    tryAccess() {
        return Example.#secret;  // ✓ Works
    }
    
    tryAccessViaThis() {
        return this.#secret;  // ❌ SyntaxError
    }
}

const ex = new Example();
ex.#secret;        // ❌ SyntaxError (can't access directly)
ex.tryAccess();    // ✓ 'classified' (works via class name)
ex.tryAccessViaThis();  // ❌ SyntaxError
```

**Key Point:** The private field is checked against the **class name**, not the instance. Since `Example.#secret` is valid syntax inside the class body, it works from instance methods too.
```

---

The confusion is: 
- `this.#secret` doesn't work
- `this` is bound at runtime to what the class constructor implicitly (or explicitly via constructor return override) returns: e.g (ex = new Example(), not the class `Example`)
- Implicitly, class constructors `return this`.
- `Example.#secret` works (because it's the correct class reference)
- Direct access `ex.#secret` doesn't work (outside the class body)
