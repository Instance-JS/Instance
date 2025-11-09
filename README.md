See CHANGELOG.md for history.

Usage (in future release after beta.6):
```javascript
new Div('@.target')  // "NEW DIV AT TARGET"
await (new $_('Tab'))('div') // AWAIT NEW TAB DIV
```

```javascript
// jQuery
$('.container').append(
  $('<div>')
    .text('hello')
    .on('click', handler)
);

// React
ReactDOM.render(
  <div onClick={handler}>hello</div>,
  document.querySelector('.container')
);

// Instance
new Div('hello', '@.container', handler);
```

```javascript
new Div('Click me', '@.button-container', function(div) { // NEW DIV "'CLICK ME'" AT BUTTON-CONTAINER, FOR EACH DIV ADD CLASS 'READY'
  div.classList.add('ready');
});
```


```javascript
let tab = new Tab('@#tab');
tab.setColor('#000');        // Custom method
tab.classlist.add('tabby');  // Native method
document.body.appendChild(tab);  // It's a REAL DOM node
console.log(tab instanceof HTMLElement);  // true
console.log(tab instanceof Tab); // true
```


```javascript
// (Optional): Include jQuery in another file (for the jQuery checks)
// See Instance-comprehensive-unit-test.html for the complete version

class Tab extends Instance {
  /*
    // not necessary to explicitly include, as super(...args) is auto-called when no constructor is provided.
    constructor(query, options) {
      super(query, options);
    }
  */
  setColor(color) {
    this.style.backgroundColor = color; // or this.element.style.backgroundColor
    return this;
  }

  setHeight(height) {
    this.style.height = height;
    return this;
  }
}

let $_ = new Instance(document);

document.addEventListener('DOMContentLoaded', function(e) {
    let tab = new Tab('#tab');
    tab.addClass('jquery-compatible').setColor('#000').setHeight('100px');
    
    // ═══════════════════════════════════════════════════════════
    // INSTANCEOF CHECKS (Symbol [hasInstance] Meta-Constructor) (ADR-006)
    // ═══════════════════════════════════════════════════════════
    console.log(tab instanceof Tab);                    // true ✅
    console.log(tab instanceof Instance);               // true ✅
    console.log(tab instanceof HTMLElement);            // true ✅ (The class IS the element!)
    console.log(tab instanceof HTMLDivElement);         // true ✅ (Specific element type)
    console.log(tab instanceof Element);                // true ✅
    console.log(tab instanceof Node);                   // true ✅
    console.log(tab instanceof Object);                 // true ✅ (everything is Object)
    console.log(Tab instanceof Instance);               // true ✅ (Meta-constructor from ADR 006)

    // ═══════════════════════════════════════════════════════════
    // JQUERY COMPATIBILITY (Classes are [Function] Objects) (ADR-004)
    // ═══════════════════════════════════════════════════════════
    console.log($(tab)[0] === tab);                     // true ✅ (jQuery wraps it, [0] returns it)
    console.log($(tab).length === 1);                   // true ✅ (jQuery sees it as collection)
    console.log(tab.length === 1);                      // true ✅ (Array-like)
    console.log(tab.jquery === undefined);              // true ✅ (NOT a jQuery object)
    console.log($(tab).jquery !== undefined);           // true ✅ (but CAN be wrapped)
    
    // ═══════════════════════════════════════════════════════════
    // ELEMENT IDENTITY (Elements are [Class] Objects) (ADR-007)
    // ═══════════════════════════════════════════════════════════
    console.log(tab === tab[0]);                        // true ✅ (jQuery compat: tab[0] is self)
    console.log(tab === document.querySelector('#tab'));// true ✅ (IT'S THE ACTUAL DOM ELEMENT!)
    console.log(tab.nodeType === 1);                    // true ✅ (Element node)
    console.log(tab.tagName === 'DIV');                 // true ✅ (Real DOM element)
    
    // ═══════════════════════════════════════════════════════════
    // DIRECT DOM API ACCESS (No .element needed!)
    // ═══════════════════════════════════════════════════════════
    console.log(typeof tab.style === 'object');         // true ✅
    console.log(typeof tab.classList === 'object');     // true ✅
    console.log(typeof tab.appendChild === 'function'); // true ✅
    console.log(typeof tab.addEventListener === 'function'); // true ✅
    console.log(tab.parentNode === document.body);      // true ✅ (if appended)
    
    // ═══════════════════════════════════════════════════════════
    // CUSTOM METHODS WORK (Instance API)
    // ═══════════════════════════════════════════════════════════
    console.log(typeof tab.setColor === 'function');    // true ✅
    console.log(typeof tab.setHeight === 'function');   // true ✅
    console.log(typeof tab.init === 'function');        // true ✅
    console.log(typeof tab.append === 'function');      // true ✅
    
    // ═══════════════════════════════════════════════════════════
    // METHOD CHAINING (Returns self)
    // ═══════════════════════════════════════════════════════════
    console.log(tab.setColor('#000') === tab);          // true ✅
    console.log(tab.addClass('test') === tab);          // true ✅
    console.log($(tab).addClass('test')[0] === tab);    // true ✅
    
    // ═══════════════════════════════════════════════════════════
    // METADATA MARKERS (Internal tracking)
    // ═══════════════════════════════════════════════════════════
    console.log(tab._isInstance === true);              // true ✅
    console.log(tab._instanceClass === Tab);            // true ✅
    
    // ═══════════════════════════════════════════════════════════
    // WORKS WITH NATIVE DOM APIS
    // ═══════════════════════════════════════════════════════════
    document.body.appendChild(tab);                     // Works! ✅
    console.log(document.body.contains(tab));           // true ✅
    console.log(document.getElementById('tab') === tab);// true ✅
    
    // ═══════════════════════════════════════════════════════════
    // WEAKMAP PRIVATE DATA (Memory safe)
    // ═══════════════════════════════════════════════════════════
    console.log(typeof tab.isInitialized === 'boolean');// true ✅
    console.log(typeof tab.options === 'object');       // true ✅
    console.log(tab.hasOwnProperty('isInitialized'));   // false ✅ (WeakMap, not own property)
    
    // ═══════════════════════════════════════════════════════════
    // TYPE CHECKING (Multiple valid ways)
    // ═══════════════════════════════════════════════════════════
    console.log(Tab.isPrototypeOf(tab));                // false (element's proto is HTMLElement)
    console.log(tab.constructor === HTMLDivElement);    // true ✅ (DOM constructor)
    console.log(tab._instanceClass === Tab);            // true ✅ (Our marker)
    
    // ═══════════════════════════════════════════════════════════
    // COMPARISON EDGE CASES
    // ═══════════════════════════════════════════════════════════
    let sameTab = document.querySelector('#tab');
    console.log(tab === sameTab);                       // true ✅ (SAME OBJECT!)
    console.log(Object.is(tab, sameTab));               // true ✅ (Strict equality)
    
    // WeakMap/WeakSet keys work
    let weakMap = new WeakMap();
    weakMap.set(tab, 'data');
    console.log(weakMap.get(tab) === 'data');           // true ✅
    
    let weakSet = new WeakSet();
    weakSet.add(tab);
    console.log(weakSet.has(tab));                      // true ✅
    
    // ═══════════════════════════════════════════════════════════
    // SUPER CALLS WORK NATURALLY
    // ═══════════════════════════════════════════════════════════
    // (In Tab class definition)
    // render() {
    //     super.render(); // ✅ Works due to lexical binding!
    //     this.style.background = 'blue';
    // }
    
    // ═══════════════════════════════════════════════════════════
    // WHAT DOESN'T WORK (For completeness)
    // ═══════════════════════════════════════════════════════════
    console.log(Tab.prototype.isPrototypeOf(tab));      // false ❌ (not in proto chain)
    console.log(tab.constructor === Tab);               // false ❌ (constructor is HTMLDivElement)
    
});

```
