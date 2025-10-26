## 1.0.0-beta.2 (2025-10-26)
### ✨ Enhancements
- **Direct Element Architecture** (ADR 007): `new Instance()` *is* the DOM element—true identity, zero wrappers, fluent chaining with native DOM/jQuery.
- Auto-method copying from prototype chain (preserves `super()`, overrides correctly).
- Custom `Symbol.hasInstance` for seamless `instanceof Subclass`.
- jQuery auto-merge on first init (overrides optional).

## 1.0.0-beta.1 (2025-10-25)
  - Dropped Proxy layer implementation; (ADR 005) Proxified Instances deemed 'unsolvable' without Transparent Proxies.
