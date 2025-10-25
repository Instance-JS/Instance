Usage:

```javascript
// can include jQuery in another file (optional)
class Tab extends Instance {
  /*
    // not necessary to explicitly include, as super(...args) is auto-called when no constructor is provided.
    constructor(query, options) {
      super(query, options);
    }
  */
  setColor(color) {
    this.main.style.color = color; // or this.element.style.color
    return this;
  }

  setHeight(height) {
    this.main.style.height = height;
    return this;
  }
}

let $_ = new Instance(document);

$_.ready(function(e) {
    let tab = new Tab('#tab');

    tab.addClass('jquery-compatible').setColor('#000').setHeight('100px');

    $(tab).removeClass('jquery-compatible').append(new Tab('#def'));

    console.log(tab instanceof Tab); // true
    console.log(tab instanceof Instance); // true
    console.log(Tab instanceof Instance); // true

});

```
