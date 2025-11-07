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

This naming convention can be applied to both default case and pascal case, but with modifications to acronyms only.

> Rule of thumb:
> A tag is classified as an 'acronym' if it matches one of these 3 rules, in order of semantic hierarchy:
>
>1. **Formal Specificity:** Its individual letters map one-to-one with its fully expanded 'formal' name: (`<LI>` -> 'List Item', `<SVG>` -> 'Scalable Vector Graphic').
>   Tagnames that can be considered abbreviations or shorthand do not qualify.
> 
>3. **Orthographic Dominance:**: The tag is 'unpronounceable' in natural language (English), forcing you to enunciate each letter: (`<DFN>`: 'D-F-N' [acronym]), (`<del>`: `Del` [not an acronym])
> 
>3. **The Exception Rule:**: `<img>` is `Img`. It’s almost always contextualized as “image,” not 'I-M-G'.

| Tag       |   X-Acronym     | Full Meaning                          | Reasoning                                                                 |
|-----------|----------------|---------------------------------------|---------------------------------------------------------------------------|
| `<li>`   | `LI`          | List Item                            | Rule 1: 1-to-1 acronym: 'List Item'; Rule 2: subjective. *sometimes* pronounced 'L-I' instead of `Li`. Hierarchic invariant 'Rule 1' overrides. |
| `<ul>`   | `UL`          | Unordered List                       | Rule 1: 1-to-1 acronym: 'Unordered List'; Rule 2: subjective. *generally* enunciated as 'U-L'. Hierarchic invariant Rule 1 overrides.      |
| `<ol>`   | `OL`          | Ordered List                         | Rule 1: 1-to-1 acronym: 'Ordered List'; Rule 2: subjective. *generally* enunciated as 'O-L'. Hierarchic invariant Rule 1 overrides.     |
| `<dl>`   | `DL`          | Description List                     | Rule 1: 1-to-1 acronym: 'Description List' (or Definition List); Rule 2: 'D-L'.   |
| `<dt>`   | `DT`          | Description Term                     | Rule 1: 1-to-1 acronym: 'Description Term' (or Definition Term); Rule 2: 'D-T'.   |
| `<dd>`   | `DD`          | Description Definition               | Rule 1: 1-to-1 acronym: 'Description Definition' (or Definition Description); Rule 2: 'D-D'. |
| `<td>`   | `TD`          | Table Data                           | Rule 1: 1-to-1 acronym: 'Table Data'; Rule 2: 'T-D'.                              |
| `<th>`   | `TH`          | Table Header                         | Rule 1: 1-to-1 acronym: 'Table Header'; Rule 2: 'T-H'.                            |
| `<tr>`   | `TR`          | Table Row                            | Rule 1: 1-to-1 acronym: 'Table Row'; Rule 2: 'T-R'.                               |
| `<tt>`   | `TT`          | Teletype Text                        | Rule 1: 1-to-1 acronym: 'Teletype Text'; Rule 2: 'T-T'.                           |
| `<hr>`   | `HR`          | Horizontal Rule                      | Rule 1: 1-to-1 acronym: 'Horizontal Rule'; Rule 2: 'H-R'.                         |
| `<br>`   | `BR`          | Break (Line Break)                   | Rule 1: 1-to-1 acronym: 'Break Rule' (Line Break)'; Rule 2: 'B-R'.              |
| `<bdi>`  | `BDI`         | Bi-Directional Isolation             | Rule 1: 1-to-1 acronym: 'Bi-Directional Isolation'; Rule 2: 'B-D-I', unpronounceable as a word. |
| `<bdo>`  | `BDO`         | Bi-Directional Override              | Rule 1: 1-to-1 acronym: 'Bi-Directional Override'; Rule 2: 'B-D-O'.               |
| `<dfn>`  | `DFN`         | Definition                           | Rule 1: subjective. Rule 2: 'D-F-N'. |
| `<kbd>`  | `KBD`         | Keyboard Input                       | Rule 1: subjective. Rule 2: 'K-B-D'.                              |
| `<svg>`  | `SVG`         | Scalable Vector Graphics             | Rule 1: 1-to-1 acronym: 'Scalable Vector Graphics'; Rule 2: 'S-V-G'.              |
| `<xml>`  | `XML`         | Extensible Markup Language           | Rule 1: 1-to-1 acronym: '(E)xtensible Markup Language' (bite me); Rule 2: 'X-M-L'.            |
| `<wbr>`  | `WBR`         | Word Break Opportunity               | Rule 1: subjective. Rule 2: 'W-B-R'.                       |
| `<rb>`   | `RB`          | Ruby Base                            | Rule 1: 1-to-1 acronym: 'Ruby Base' from Ruby Annotation Spec; Rule 2: 'R-B'.     |
| `<rp>`   | `RP`          | Ruby Parenthesis                     | Rule 1: 1-to-1 acronym: 'Ruby Parenthesis'; Rule 2: 'R-P'.                        |
| `<rt>`   | `RT`          | Ruby Text                            | Rule 1: 1-to-1 acronym: 'Ruby Text'; Rule 2: 'R-T'.                               |
| `<rtc>`  | `RTC`         | Ruby Text Container                  | Rule 1: 1-to-1 acronym: 'Ruby Text Container'; Rule 2: 'R-T-C'.                   |
| `<html>` | `HTML`        | HyperText Markup Language            | Rule 1: 1-to-1 acronym: 'HyperText Markup Language'; Rule 2: 'H-T-M-L'.           |

Usage:

```javascript
new LI()  // <li>
new SVG() // <svg>
new DFN() // <dfn>
```

## Excluded Three-Letter Elements (fails Acronym model)

| Tag       | Full Meaning                          | Reason Not Included                                                                 |
|-----------|---------------------------------------|-------------------------------------------------------------------------------------|
| `<big>`  | Big Text                             | Shorthand for 'big text'. Rule 2: Pronounceable as "big" (a single word); no spec tie to letters. |
| `<col>`  | Column                               | Abbreviation of 'column'. Rule 2: Pronounceable as "coal" or "call"; |
| `<del>`  | Deleted Text                         | Abbreviation, not acronym; Rule 2: Pronounceable as "dell"; "delete" is contextualized. |
| `<dir>`  | Directory List                       | Abbreviation of 'directory'. Rule 2: Pronounceable as "deer".        |
| `<div>`  | Division                             | Abbreviation of 'division' or 'divider'. Rule 2: Pronounceable as "div";                    |
| `<em>`   | Emphasis                             | Abbreviation of 'emphasis'; Rule 2: Pronounceable as "em"; uncommon word.     |
| `<img>`  | Image                                | Shorthand for 'image'; Rule 3: Contextualized as 'image'; not enunciated as 'I-M-G'; spec name is 'Image'.|
| `<ins>`  | Inserted Text                        | Shorthand for 'inserted text'; Rule 2: Pronounceable as "ins"; ties to "insert", not letters.     |
| `<map>`  | Map                                  | Eponymous. Rule 2: Pronounceable as "map";                   |
| `<nav>`  | Navigation                           | Abbreviation of 'navigation'; Rule 2: Pronounceable as "nav"; uncommon word. ties to "navigation", not letters. |
| `<pre>`  | Preformatted Text                    | Shorthand for 'preformatted text'; Rule 2: Pronounceable as "pre"; common prefix. ties to "preformatted".|
| `<q>`    | Quotation                            | Abbreviation of 'quotation'; Moot: single letters in all 4 naming styles are uppercased.                     |
| `<s>`    | Strikethrough                        | Abbreviation of 'strikethrough'; Moot: single letters in all 4 naming styles are uppercased.              |
| `<sub>`  | Subscript                            | Abbreviation of 'subscript'. Rule 2: Pronounceable as "sub"; common word. common prefix.                     |
| `<sup>`  | Superscript                          | Abbreviation of 'superscript'. Rule 2: Pronounceable as "sup"; common word. common prefix.                     |
| `<u>`    | Underline                            | Abbreviation of 'underline'. Moot: single letters in all 4 naming styles are uppercased.                        |
| `<var>`  | Variable                             | Abbreviation of 'variable'. Rule 2: Pronounceable as "var"; ties to "variable"; common word.                       |
