#

### 🧩 Case Modes
Naming conventions are defined by case modifiers (e.g., `-acronym`) applied to element constructors in Instance.js.
>*For those who would like to peruse a (quite reasonably) comprehensive list of all elements, see master/docs/table-of-elements.md*

## 1. Default Case (`initial`): Annotated Table for Instance.js

>It is unnecessary to even present a list of transformations here. The first letter of any element you may find is capitalized. That's it.

```javascript
new A() for <a>
new Abbr() for <abbr>
...
new Div() for <div>
...
new H1() for <h1>
new H2() for <h2>
...
new Wbr() for <wbr>
```

## 2. Annotated Table of Tags when case modifier `-acronym` is specified.

This naming convention applies default case (case #1), but with modifications to acronyms only.

> Rule of thumb:
> A tag is classified as an 'acronym' if it matches the semantic hierarchy of these 3 rules:
>
>1. **Formal Specificity:** Its letters correspond directly to its *formal specification* name when fully expanded. (`<li>` -> 'List Item', `<SVG>` -> 'Scalable Vector Graphic')
> 
>2. **Orthographic Dominance**: The tag is 'unpronounceable' in natural language, forcing you to enunciate each letter: (`<dfn>`: 'D-F-N' [acronym]), (`<del>`: 'Del' [not an acronym])
> 
>3. **The Exception Rule:**: `<img>` is `Img`. It’s almost always contextually understood as “image,” not 'I-M-G'.

| Tag       |   X-Acronym     | Full Meaning                          | Reasoning                                                                 |
|-----------|----------------|---------------------------------------|---------------------------------------------------------------------------|
| `<li>`   | `LI`          | List Item                            | Rule 1: Directly ties to formal spec name 'List Item'; Rule 2: Pronounced 'L-I' rather than as a word. |
| `<ul>`   | `UL`          | Unordered List                       | Rule 1: Ties to 'Unordered List'; Rule 2: Enunciated as 'U-L'.            |
| `<ol>`   | `OL`          | Ordered List                         | Rule 1: Ties to 'Ordered List'; Rule 2: Enunciated as 'O-L'.              |
| `<dl>`   | `DL`          | Description List                     | Rule 1: Ties to 'Description List' (or Definition List); Rule 2: 'D-L'.   |
| `<dt>`   | `DT`          | Description Term                     | Rule 1: Ties to 'Description Term' (or Definition Term); Rule 2: 'D-T'.   |
| `<dd>`   | `DD`          | Description Definition               | Rule 1: Ties to 'Description Definition' (or Definition Description); Rule 2: 'D-D'. |
| `<td>`   | `TD`          | Table Data                           | Rule 1: Ties to 'Table Data'; Rule 2: 'T-D'.                              |
| `<th>`   | `TH`          | Table Header                         | Rule 1: Ties to 'Table Header'; Rule 2: 'T-H'.                            |
| `<tr>`   | `TR`          | Table Row                            | Rule 1: Ties to 'Table Row'; Rule 2: 'T-R'.                               |
| `<tt>`   | `TT`          | Teletype Text                        | Rule 1: Ties to 'Teletype Text'; Rule 2: 'T-T'.                           |
| `<hr>`   | `HR`          | Horizontal Rule                      | Rule 1: Ties to 'Horizontal Rule'; Rule 2: 'H-R'.                         |
| `<br>`   | `BR`          | Break (Line Break)                   | Rule 1: Ties to 'Break Rule' or 'Line Break'; Rule 2: 'B-R'.              |
| `<bdi>`  | `BDI`         | Bi-Directional Isolation             | Rule 1: Ties to 'Bi-Directional Isolation'; Rule 2: 'B-D-I', unpronounceable as a word. |
| `<bdo>`  | `BDO`         | Bi-Directional Override              | Rule 1: Ties to 'Bi-Directional Override'; Rule 2: 'B-D-O'.               |
| `<dfn>`  | `DFN`         | Definition                           | Rule 1: Ties to 'Definition For Notation'; Rule 2: 'D-F-N', enunciated letters. |
| `<kbd>`  | `KBD`         | Keyboard Input                       | Rule 1: Ties to 'Keyboard' or 'Key Board'; Rule 2: 'K-B-D'.                              |
| `<svg>`  | `SVG`         | Scalable Vector Graphics             | Rule 1: Ties to 'Scalable Vector Graphics'; Rule 2: 'S-V-G'.              |
| `<xml>`  | `XML`         | Extensible Markup Language           | Rule 1: Ties to 'Extensible Markup Language'; Rule 2: 'X-M-L'.            |
| `<wbr>`  | `WBR`         | Word Break Opportunity               | Rule 1: Ties to 'Word Break Rule'; Rule 2: 'W-B-R'.                       |
| `<rb>`   | `RB`          | Ruby Base                            | Rule 1: Ties to 'Ruby Base' from Ruby Annotation Spec; Rule 2: 'R-B'.     |
| `<rp>`   | `RP`          | Ruby Parenthesis                     | Rule 1: Ties to 'Ruby Parenthesis'; Rule 2: 'R-P'.                        |
| `<rt>`   | `RT`          | Ruby Text                            | Rule 1: Ties to 'Ruby Text'; Rule 2: 'R-T'.                               |
| `<rtc>`  | `RTC`         | Ruby Text Container                  | Rule 1: Ties to 'Ruby Text Container'; Rule 2: 'R-T-C'.                   |
| `<html>` | `HTML`        | HyperText Markup Language            | Rule 1: Ties to 'HyperText Markup Language'; Rule 2: 'H-T-M-L'.           |

Usage:

```javascript
new LI()  // <li>
new SVG() // <svg>
new DFN() // <dfn>
```

## Excluded Three-Letter Elements (fails Acronym model)

| Tag       | Full Meaning                          | Reason Not Included                                                                 |
|-----------|---------------------------------------|-------------------------------------------------------------------------------------|
| `<big>`  | Big Text                             | Not an acronym; Rule 2: Pronounceable as "big" (a single word); no spec tie to letters. |
| `<col>`  | Column                               | Not an acronym; Rule 2: Pronounceable as "col" or "column"; no letter-based spec name. |
| `<del>`  | Deleted Text                         | Not an acronym; Rule 2: Pronounceable as "del"; "delete" is contextualized, but not enunciated as letters. |
| `<dir>`  | Directory List                       | not an acronym; Rule 2: Pronounceable as "dir" (directory).            |
| `<div>`  | Division                             | Not an acronym; Rule 2: Pronounceable as "div"; common word.                       |
| `<em>`   | Emphasis                             | Not an acronym; Rule 2: Pronounceable as "em"; uncommon word. no letter tie.       |
| `<img>`  | Image                                | Rule 3: Contextualized as 'image'; not enunciated as 'I-M-G'; spec name is 'Image'.|
| `<ins>`  | Inserted Text                        | Not an acronym; Rule 2: Pronounceable as "ins"; ties to "insert", not letters.     |
| `<map>`  | Map                                  | Not an acronym; Rule 2: Pronounceable as "map"; common word.                       |
| `<nav>`  | Navigation                           | Not an acronym; Rule 2: Pronounceable as "nav"; uncommon word. ties to "navigation", not letters. |
| `<pre>`  | Preformatted Text                    | Not an acronym; Rule 2: Pronounceable as "pre"; common prefix. ties to "preformatted".|
| `<q>`    | Quotation                            | Not an acronym; Moot: single letters in all 4 naming styles are uppercased.                     |
| `<s>`    | Strikethrough                        | Not an acronym; Moot: single letters in all 4 naming styles are uppercased.              |
| `<sub>`  | Subscript                            | Not an acronym; Rule 2: Pronounceable as "sub"; common word. common prefix.                     |
| `<sup>`  | Superscript                          | Not an acronym; Rule 2: Pronounceable as "sup"; common word. common prefix.                     |
| `<u>`    | Underline                            | Not an acronym; Moot: single letters in all 4 naming styles are uppercased.                        |
| `<var>`  | Variable                             | Not an acronym; Rule 2: Pronounceable as "var"; ties to "variable"; common word.                       |
