## 1.0.0-beta.4 (2025-10-27) (meta-stable)

### Fixed
  - Host Method Merging: Resolved critical issues from `beta.2` where some host methods (e.g. read-only APIs like `document.children`) did not seamlessly merge into subclass prototypes (throwing on copy). `Beta.4` fixes edge cases, ensuring seamless inheritance without shadowing or breakage.
  - `super` and `async super`: Deep `super` chaining now fully supports natives (e.g., remove() bubbling through 4+ levels).
Async super calls (await super.method()) resolve correctly. (To be honest, this was already true, it was just the host method merging getting in the way).

### Other
  - Unit Testing Completed: All 56 unit tests passed (100% coverage), including multi-level inheritance, async cascades, getters/setters shadowing, static factories, error bubbling, and `Symbol.hasInstance` upgrades.
  - See Instance-comprehensive-unit-test.html
  - *Woops*: Beta.3? Yeah, I skipped that one - Semver deemed skipping a version appropriate. 😅 Full diff: [beta.2...beta.4](link-to-compare).
  - No Breaking Changes: Backward-compatible with `beta.2`; deprecations for legacy .main/.element props (use `this` directly for DOM access).

## 1.0.0-beta.2 (2025-10-26)
### ✨ Enhancements
- **Direct Element Architecture** (ADR 007): `new Instance()` now *is* the DOM element—true identity, zero wrappers, fluent chaining with native DOM/jQuery.
- Auto-method copying from prototype chain (preserves `super()`, overrides correctly [mostly, see changelog]).
- Custom `Symbol.hasInstance` for seamless `instanceof Subclass`.
- jQuery auto-merge on first init (overrides optional).

## 1.0.0-beta.1 (2025-10-25)
  - Dropped Proxy layer implementation; (ADR 005) Proxified Instances deemed 'unsolvable' without Transparent Proxies.
