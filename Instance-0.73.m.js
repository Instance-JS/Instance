/**!
*   Instance.js - Direct Element Architecture
*   @version 0.73.m
*   @copyright © 2026 Instance
*   @author Instance Foundation
*   @license
*   @funding github.com/username/instance#funding
*/
void async function v73_m(factory, build) {
	// 'use strict';

	const u = typeof(void 0), g = (
		typeof globalThis !== u ? globalThis :
		  typeof window !== u ? window :
			typeof self !== u ? self :
			  typeof global !== u ? global :
				this ?? new Function('return this')()
	);

	const Instance = await factory(g, build);

	const INSTANCE_UUID = Symbol.for('Instance');

	Reflect.defineProperty(g, INSTANCE_UUID, { value: Instance });
	Reflect.defineProperty(g, 'Instance', { value: Instance });

	// window.this (strict mode & worker compliant)
	Reflect.defineProperty(g, 'this', {
		get() { return g }, set() { return arguments[0] } // ec: false, gaslight setter
	});

	// 1. AMD
	if (typeof define === 'function' && define.amd) return define([], () => Instance);

	// 2. Node.js
	if (typeof module === 'object' && module.exports) return module.exports = Instance;

}(async function init(global, build) {

	'use strict';

	class JSDOM {

		static COLLISIONS = /^(?:Audio|Error|Image|Map|Math|Object|Option)$/;

		static NAMESPACES = ((w3) => ({
            math: w3 + '1998/Math/MathML', html: w3 + '1999/xhtml', svg:  w3 + '2000/svg'
		}))('http://www.w3.org/');

		static SUPPORTS = { html: 99.97, svg : 99.84, math: 91.57, '@': '16/3/26' };

		static ACRONYMS = ('LI|UL|OL|DL|DT|DD|TD|TH|TR|TT|HR|BR|BDI|BDO|DFN|KBD|SVG|WBR|XMP|HTML|RB|RP|RT|RTC');

		static #_ = (s, x, t = (x ?
			'sloppy|strict|literals|constants|cursed|nodejs' :
			'stable|baseline|experimental|deprecated|legacy|obsolete').split('|'), o = {}) =>
			(s.matchAll(/(\d):\[([^\]]*)\]\s*/g).forEach(([,i,b]) => o[t[i]] = b||null), o);

		static ELEMENTS = {
			core: this.#_(
				'0:[a|abbr|acronym|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|'+
				'body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|'+
				'details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|'+
				'form|head|header|hgroup|h1|h2|h3|h4|h5|h6|hr|html|i|iframe|img|input|ins|'+
				'kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noscript|'+
				'object|ol|optgroup|option|output|p|picture|pre|progress|q|rp|rt|ruby|s|'+
				'samp|script|section|select|slot|small|source|span|strong|style|sub|'+
				'summary|sup|svg|table|tbody|td|template|textarea|tfoot|th|thead|time|'+
				'title|tr|track|u|ul|var|video|wbr] 1:[search] 2:[fencedframe|geolocation|'+
				'selectedcontent] 3:[basefont|big|center|dir|font|nobr|rb|rtc|strike|tt]'+
				'4:[listing|marquee|noembed|noframes|plaintext|xmp] 5:[applet|blink|frame|'+
				'frameset|isindex|keygen|menuitem|multicol|nextid|param|spacer]'
			),
			math: this.#_(
				'1:[annotation|annotation-xml|math|merror|mfrac|mi|mmultiscripts|mn|mo|mover|'+
				'mpadded|mphantom|mprescripts|mroot|mrow|ms|mspace|msqrt|mstyle|msub|msubsup|msup|'+
				'mtable|mtd|mtext|mtr|munder|munderover|none|semantics] 3:[maction|mfenced] 5:[menclose]'
			),
			svg: this.#_(
				'0:[a|animate|animateMotion|animateTransform|circle|clipPath|defs|desc|ellipse|'+
				'feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|'+
				'feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|'+
				'feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|'+
				'feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|'+
				'feTurbulence|filter|foreignObject|g|image|line|linearGradient|marker|mask|'+
				'metadata|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|stop|'+
				'style|svg|switch|symbol|text|textPath|title|tspan|use|view]'
			)
		};

		static KEYWORDS = this.#_(
			'0:[break|case|catch|class|const|continue|debugger|default|delete|do|'+
			'else|export|extends|finally|for|function|if|import|in|instanceof|'+
			'new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield]'+
			'1:[arguments|enum|eval|implements|interface|let|package|private|protected|'+
			'public|static] 2:[false|null|true] 3:[undefined|NaN|Infinity] 4:[async|await|'+
			'defer|get|set] 5:[__dirname|__filename|exports|global|module|process|require]', 1
		);

		static EVENTS = ({
			'@': (
				'click|dblclick|scroll|storage|hashchange|visibilitychange|beforeunload|'+
				'unload|fullscreenchange|fullscreenerror|copy|cut|paste|contextmenu|input|'+
				'submit|reset|select|wheel|resize|popstate|drop|abort|change|load'
			),
			focus:      '|in|out',
			key:        'down|up|press',
			mouse:      'down|up|move|over|out|enter|leave',
			pointer:    'down|up|move|over|out|enter|leave|cancel',
			touch:      'start|end|move|cancel',
			drag:       '|start|end|enter|leave|over',
			transition: 'start|end|cancel',
			animation:  'start|end|iteration'
		});

		static DICTIONARIES = ({
			Pascalite: (
				'BDI|HTML|TBody|BDO|IFrame|TD|BR|KBD|TFoot|DD|LI|TH|DFN|OL|'+
				'THead|DL|RB|TR|DT|RP|TT|RT|UL|HGroup|RTC|WBR|SVG|XMP|HR'
			),
			Pascal: (
				'BaseFont|KeyGen|BlockQuote|MenuItem|ColGroup|NoFrames|DataList|NoScript|'+
				'FencedFrame|OptGroup|FieldSet|SelectedContent|FigCaption|FrameSet|TextArea'
			)
		});
	}

	const _ = 'Instance', $ = Symbol, $f = $.for, $k = $.keyFor;

	const
		INSTANCE_UUID             = $f(_),
		INSTANCE_FACTORY          = INSTANCE_UUID,
		OBSERVERS                 = $(`${_} Observers`),
		META_OBSERVERS            = $(`${_} Meta Observers`),
		PATCHED_EVENTS            = $(`${_} Patched Events`),
		METADATA                  = $(`${_} Metadata`),
		ELEMENTS                  = $(`${_} Elements`),
		REACTIVE_STORE            = $(`${_} Reactive Store`),
		REACTIVE_PROXY            = $(`${_} Reactive Proxy`),
		SCOPED_EFFECTS            = $(`${_} Scoped Effects`),
		CLASS_REACTIVE_STORE      = $(`${_} Class Reactive Store`),
		CLASS_REACTIVE_PROXY      = $(`${_} Class Reactive Proxy`),
		LIFECYCLE_HANDLERS        = $(`${_} Lifecycle Handlers`),
		INSTANCE_PROTO            = $(`${_} Proto`),
		INSTANCE_ENSURE_INDEX_UID = $(`${_} Index`),
		CLASS_INSTANCES           = $(`${_} Class Registry`),
		SHADOW_ROOT               = $(`${_} Shadow Root`),
		META_TRANSITION_HANDLERS  = $(`${_} Meta Transition Handlers`),
		ACTIVE_TRANSITIONS        = $(`${_} Active Transitions`),
		ELEMENT_NS_STORE          = $(`${_} Element Namespace Store`),
		PENDING_ARGS              = $(`${_} Pending Args`),
		SCOPED_STYLES_INJECTED    = $(`${_} Scoped Styles Injected`),
		WORKER_PROXY              = $(`${_} Worker Proxy`),
		SOCKET_PROXY              = $(`${_} Socket Proxy`),
		LISTEN_PROXY              = $(`${_} Listen Proxy`),
		FORM_STATE                = $(`${_} Form State`),

		// Transient element state — formerly underscored static methods on Symlink.
		// Accessed via el[SYMBOL] = value / el[SYMBOL] reads — same as all other state.
		MOUNTED                   = $(`${_} Mounted`),
		LAST_PARENT               = $(`${_} Last Parent`),
		LAST_SIBLING              = $(`${_} Last Sibling`),
		PLACEMENT                 = $(`${_} Placement`),
		INBOUND_HANDLERS          = $(`${_} Inbound Handlers`),
		DELEGATES                 = $(`${_} Delegates`);

	const
		S = 'string', FN = 'function', O = 'object',
		T = true, F = false,
		gA = 'getAttribute',   sA = 'setAttribute',
		rA = 'removeAttribute', hA = 'hasAttribute',
		aC = 'appendChild',    rC = 'removeChild',
		iB = 'insertBefore',
		qS = 'querySelector',  qSA = 'querySelectorAll',
		cN = 'cloneNode';

	const
		THIS_VERSION    = build.version,
		THIS_SCRIPT     = (() => document.currentScript || [...document.scripts].find(s =>
			(s.src || '').split(/[?#]/)[0].toLowerCase().endsWith('/instance.js')
		) || null)(),
		CAN_NEW_FUNCTION = !!(() => { try { return new Function('return 1')() } catch(e){} })(),
		JS_GLOBALS      = JSDOM.COLLISIONS,
		PREFIX_PATTERN  = /^(::|[@$%<])/,
		PLACEMENT_VERBS = new Set(['after','before','firstchild','lastchild','append','replace','wrap','every','slot']);

	// Descriptor helpers. All value descriptors are generated from a 3-bit flag:
	//   bit 0 = configurable   bit 1 = writable   bit 2 = enumerable
	// The bitmap ($d) is the single implementation. Named helpers are thin wrappers —
	// V8 inlines them immediately. Call sites stay readable.

	const $d     = (f, v) => ({ value: v, configurable: !!(f&1), writable: !!(f&2), enumerable: !!(f&4) });
	const CONF   = v      => $d(0b001, v); // configurable
	const CONF_W = v      => $d(0b011, v); // configurable + writable
	const GET    = fn     => ({ get: fn, configurable: T, enumerable: F });
	const GET_SET= (g, s) => ({ get: g, set: s, configurable: T, enumerable: F });

	const
		CREATE_ELEMENT    = document.createElement.bind(document),
		CREATE_ELEMENT_NS = document.createElementNS.bind(document),
		OBJECT_GET_DESC   = Object.getOwnPropertyDescriptor,
		OBJECT_DEFINE     = Object.defineProperty,
		OBJECT_DEFINE_MULTI = Object.defineProperties;

	const {
		freeze, entries, fromEntries, assign, keys, values,
		defineProperty: define, getPrototypeOf, hasOwn
	} = Object;

	const {
		type, is, all, owns, ifndef
	} =
	class Utils {

		static #has = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
		static owns = (prop, obj) => Utils.#has(obj, prop);

		static type = (v) => Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
		static is = (t,v) => Utils.type(v) === t.toLowerCase();

		static all = v => [...new Set(values(v).flatMap(s => [...s]))];

		static ifndef = (
			object, property, can_define = () => {}, can_not_define = () => {}, MAX_PROTO_DEPTH = 50
		) => {
			let collision = true;
			try {
				let proto = object;
				let depth = 0;
				collision = false;
				while (proto !== null) {
					if ((++depth > MAX_PROTO_DEPTH) || Reflect.getOwnPropertyDescriptor(proto, property)) {
						collision = true; break;
					}
					proto = Reflect.getPrototypeOf(proto);
				}
			} catch (e) { collision = true; }
			return (!collision ? can_define : can_not_define).call(object, property, object);
		}

		static toArray = v =>
			Utils.is('set', v) ? Array.from(v) :
			Utils.is('string', v) ? v.split('|') : [];

		static merge = (input) => ({
			as: s => {
				const lookup = path => path.split('.').reduce((obj, k) => obj?.[k], s);
				const resolve = (keys, prefix) =>
					(keys || []).flatMap(key => {
						const path = prefix ? `${prefix}.${key}` : key;
						return Utils.toArray(lookup(path));
					});
				if (Utils.is('array', input)) {
					return [...new Set(input.flatMap(key => Utils.toArray(lookup(key))))].sort();
				}
				return fromEntries(
					entries(input).map(([ns, keys]) => [
						ns, [...new Set(resolve(keys, ns))].sort()
					])
				);
			}
		});

		static exec(fn, ctx, ...args) {
			try {
				const r = fn.apply(ctx, args);
				return (r instanceof Promise) ? r.catch(e => (console.warn(e), null)) : r;
			} catch (e) { return console.warn(e), null; }
		}

		static validatePrefix(input, fallback = '_') {
			const rx = /^[$_\p{ID_Start}][$_\p{ID_Continue}]*$/u;
			const norm = typeof input === S ? input.normalize('NFC') : '';
			const points = [...norm];
			const valid = points.length > 0 && points.length <= 5 && rx.test(norm);
			if (valid) return norm;
			console.warn(`Catalogue: Invalid prefix "${input}" (reverting to "${fallback}")`);
			return fallback;
		}

		static safeTrim(input) {
			return (
				(typeof input === S) ||
				(typeof input === O && input instanceof String)
			) ? input.trim() : input;
		}

		static {
			Object.freeze(this);
		}
	}

	// Parses '@verb selector' or '@verbselector'. Space optional.
	// Returns { verb, selector } or null if not a valid placement string.
	//
	//   '@after #target'    → { verb: 'after',      selector: '#target' }
	//   '@every.container'  → { verb: 'every',      selector: '.container' }
	//   '@firstchild #list' → { verb: 'firstchild', selector: '#list' }

	function parseAtString(str) {
		const match = str.slice(1).match(/^([a-z]+)\s*(.*)/);
		if (!match) return null;
		const [, verb, selector] = match;
		if (!PLACEMENT_VERBS.has(verb)) return null;
		return { verb, selector: selector.trim() };
	}

	// Parses '#id.class.class2' or '.class' or '#id' into an attribute map.
	// Escape: string starting with '\' → treat rest as text, not identity.

	function parseSelectorString(str) {
		const attrs = {};
		const classes = [];
		str.replace(/([#.])([^#.\s\\]+)/g, (_, sigil, val) => {
			const v = val.trim();
			if (!v) return;
			if (sigil === '#') attrs.id = v;
			if (sigil === '.') classes.push(v);
		});
		if (classes.length) attrs.class = classes.join(' ');
		return attrs;
	}

	// Executes a DOM placement operation. Returns the context element.
	// For @every: inserts el into first match, clones into remainder,
	// wires clones into el's ELEMENTS collection.

	function applyPlacement(verb, selector, el) {
		if (verb === 'every') {
			const targets = selector ? [...document.querySelectorAll(selector)] : [];
			if (!targets.length) return null;
			targets.forEach((target, i) => {
				if (i === 0) {
					target.appendChild(el);
				} else {
					const clone = el.cloneNode(true);
					target.appendChild(clone);
					if (el[ELEMENTS]) {
						el[ELEMENTS].push(clone);
						ENSURE_INDEX_UID(el, el[ELEMENTS].length - 1);
					}
				}
			});
			return targets[0];
		}

		const target = selector ? document.querySelector(selector) : null;
		if (!target && selector) return null;

		switch (verb) {
			case 'after':      target.after(el);                                 break;
			case 'before':     target.before(el);                                break;
			case 'firstchild': target.prepend(el);                               break;
			case 'lastchild':  target.appendChild(el);                           break;
			case 'append':     (target ?? document.body).appendChild(el);        break;
			case 'replace':    target.replaceWith(el);                           break;
			case 'wrap': {
				const parent = target.parentNode;
				if (parent) { parent.insertBefore(el, target); el.appendChild(target); }
				break;
			}
			case 'slot': {
				// @slot name — sets slot="name" attribute on el
				// parent shadow DOM handles placement via named slot
				el.setAttribute('slot', selector || '');
				break;
			}
		}
		return target;
	}

	// Initialises the CLASS_INSTANCES registry and meta-query API on a class.
	// Safe to call multiple times — no-op if registry already present.

	function makeClassRegistry(Class) {
		if (owns(CLASS_INSTANCES, Class)) return;

		const instances = [];

		OBJECT_DEFINE_MULTI(Class, {
			[CLASS_INSTANCES]: CONF(instances),
			length:    { get: () => instances.length, configurable: T, enumerable: F },
			instances: { get: () => instances,        configurable: T, enumerable: F }
		});

		const def = (name, fn) => define(Class, name, CONF(fn));

		def('first',   ()    => instances[0] ?? null);
		def('last',    ()    => instances[instances.length - 1] ?? null);
		def('at',      (n)   => instances.at(n) ?? null);
		def('has',     (el)  => instances.includes(el));
		def('isEmpty', ()    => instances.length === 0);
		def('each',    (fn)  => { instances.forEach(fn); return Class; });

		def('where', (fn) => instances.filter(fn));

		def('within', (selector) => {
			const container = typeof selector === S
				? document.querySelector(selector) : selector;
			return container ? instances.filter(el => container.contains(el)) : [];
		});

		def('after',  (el) => { const i = instances.indexOf(el); return i === -1 ? [] : instances.slice(i + 1); });
		def('before', (el) => { const i = instances.indexOf(el); return i === -1 ? [] : instances.slice(0, i); });

		def('firstChildren', () => instances.filter(el => {
			const prev = el.previousElementSibling;
			return !prev || !prev[METADATA];
		}));

		def('lastChildren', () => instances.filter(el => {
			const next = el.nextElementSibling;
			return !next || !next[METADATA];
		}));

		def('orphaned',    () => instances.filter(el => !document.contains(el)));
		def('byInsertion', () => [...instances]);

		def('byDocument', () => [...instances].sort((a, b) => {
			const pos = a.compareDocumentPosition(b);
			return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
		}));
	}

	// Same as ENSURE_INDEX_UID but reads from CLASS_INSTANCES on the class.

	function ENSURE_CLASS_INDEX_UID(Class, i) {
		if (owns(i, Class)) return;
		define(Class, i, {
			get: () => Class[CLASS_INSTANCES][i],
			set: (v) => { Class[CLASS_INSTANCES][i] = v; },
			configurable: T, enumerable: F
		});
	}

	function _walkRegistry(el, fn) {
		let Ctor = el[METADATA]?.constructor;
		while (Ctor && Ctor !== Function.prototype) {
			if (typeof Ctor === FN && (Ctor.prototype instanceof Instance || Ctor === Instance)) fn(Ctor);
			Ctor = getPrototypeOf(Ctor);
		}
	}

	function registryAdd(el) {
		_walkRegistry(el, Ctor => {
			makeClassRegistry(Ctor);
			const reg = Ctor[CLASS_INSTANCES];
			if (!reg.includes(el)) { reg.push(el); ENSURE_CLASS_INDEX_UID(Ctor, reg.length - 1); }
		});
	}

	function registryRemove(el) {
		_walkRegistry(el, Ctor => {
			if (!owns(CLASS_INSTANCES, Ctor)) return;
			const reg = Ctor[CLASS_INSTANCES];
			const idx = reg.indexOf(el);
			if (idx !== -1) { reg.splice(idx, 1); reg.forEach((_, i) => ENSURE_CLASS_INDEX_UID(Ctor, i)); }
		});
	}

	function ENSURE_INDEX_UID(element, i) {
		if (owns(i, element)) return;
		define(element, i, {
			get: () => element[ELEMENTS][i],
			set: (v) => { element[ELEMENTS][i] = v },
			configurable: T, enumerable: F
		});
	}

	function makeChainable(promise) {
		return new Proxy(promise, {
			get(target, prop) {
				if (prop in target) return target[prop].bind(target);
				return function(...args) {
					const nextPromise = target.then(resolvedentry => {
						if (typeof resolvedentry[prop] !== 'function') {
							throw new TypeError(`Method '${String(prop)}' does not exist on resolved entry.`);
						}
						return resolvedentry[prop](...args);
					});
					return makeChainable(nextPromise);
				};
			}
		});
	}

	// Creates a branded Proxy for a Metaclass.
	// Brand = INSTANCE_FACTORY = INSTANCE_UUID = Symbol.for('Instance').
	//
	//   div()                        → new Div()
	//   div(span, p)                 → new Div(new Span(), new P())
	//   div[Symbol.for('Instance')]  → Div metaclass

	function makeFactory(Metaclass) {
		return new Proxy(function() {}, {
			apply(_, __, args) {
				const resolved = args.map(arg =>
					(typeof arg === FN && arg[INSTANCE_FACTORY]) ? arg() : arg
				);
				return new Metaclass(...resolved);
			},
			construct(_, args) {
				const resolved = args.map(arg =>
					(typeof arg === FN && arg[INSTANCE_FACTORY]) ? arg() : arg
				);
				return new Metaclass(...resolved);
			},
			get(_, prop) {
				if (prop === INSTANCE_FACTORY) return Metaclass;
				return Metaclass[prop];
			}
		});
	}

	// Thin collection returned by $() and $$() and meta-query methods.
	// Collection-default: all methods act on every member.
	// Use .at(n) / .first() / .last() to scope to one element.

	class InstanceCollection {
		constructor(elements) {
			const arr = Array.isArray(elements) ? elements : Array.from(elements ?? []);
			OBJECT_DEFINE_MULTI(this, {
				[ELEMENTS]: CONF_W(arr),
				length:     GET(() => this[ELEMENTS].length)
			});
			arr.forEach((_, i) => define(this, i, GET_SET(() => this[ELEMENTS][i], v => { this[ELEMENTS][i] = v; })));
		}

		*[Symbol.iterator]() { for (let i = 0; i < this[ELEMENTS].length; i++) yield this[ELEMENTS][i]; }

		find(sel)    { return new InstanceCollection(this[ELEMENTS].flatMap(el => [...el[qSA](sel)])); }
		findAll(sel) { return this.find(sel); }
		where(fn)    { return new InstanceCollection(this[ELEMENTS].filter(fn)); }
		map(fn)      { return this[ELEMENTS].map(fn); }
		filter(fn)   { return new InstanceCollection(this[ELEMENTS].filter(fn)); }
		at(n)        { return this[ELEMENTS].at(n) ?? null; }
		first()      { return this[ELEMENTS][0] ?? null; }
		last()       { return this[ELEMENTS][this[ELEMENTS].length - 1] ?? null; }
	}

	// Generate collection-wide methods from table
	// Each method applies a DOM operation to all ELEMENTS and returns this.
	;[
		['each',        (el, fn)       => fn.call(el, el)],
		['on',          (el, evt, fn)  => el.addEventListener(evt, fn)],
		['off',         (el, evt, fn)  => el.removeEventListener(evt, fn)],
		['addClass',    (el, cls)      => el.classList.add(cls)],
		['removeClass', (el, cls)      => el.classList.remove(cls)],
		['text',        (el, t)        => { el.textContent = t; }],
		['trigger',     (el, evt, d)   => el.dispatchEvent(new CustomEvent(evt, { bubbles: true, detail: d ?? {} }))],
	].forEach(([name, fn]) => {
		InstanceCollection.prototype[name] = function(...args) {
			this[ELEMENTS].forEach(el => fn(el, ...args));
			return this;
		};
	});

	// Shared helper for semantic inline link elements (email, tel, website).

	function _makeInlineLink(el, sym, hrefFn, relAttr) {
		if (el[sym]) return;
		el[sym] = true;
		const text = el.textContent.trim() || el[gA]('href') || '';
		if (!text) return;
		const a = document.createElement('a');
		a.href = hrefFn(text);
		a.textContent = text;
		if (relAttr) a[sA]('rel', relAttr), a[sA]('target', '_blank');
		el.innerHTML = '';
		el[aC](a);
	}

	// [0.73.b] Component model, this.this, class registry, $ / $$, lifecycles
	//
	// this       → the element     singular    the DOM node
	// this.this  → the class       registry    the coordination point
	//
	// Doubling rule (discovered, not designed):
	//   $    $$       wide → narrow   query/construct
	//   @    @@       all  → result   placement
	//   this this.this singular → class
	//
	// Lifecycle computed-property keys:
	//   ['@insertion'](context)   every DOM entry
	//   ['@mount'](context)       first DOM entry only
	//   ['@rendered']()           post-paint
	//   ['@removal'](context)     every DOM exit
	//   ['@unmount'](context)     final DOM exit only
	//   ['@firstchild'](context)  placed as first child
	//   ['@lastchild'](context)   placed as last child
	//   ['@after'](context)       placed @after
	//   ['@before'](context)      placed @before
	//   ['@append'](context)      placed @append / @every
	//
	// context = the target the component was placed relative to
	//

	function InstanceSelector(...args) {
		let arg = arguments[0];
		if (typeof arg === FN) {
			document.addEventListener('DOMContentLoaded', () => {
				Instance.mergeJQuery();
				arg();
			}, false);
		}
	}

	class AttributeParser {

		static conventions = freeze(
			new Set(('initial|jquery|pascal|pascalite|lowercase|uppercase|none').split('|'))
		);

		normalize(elem, attribute) {
			if (!(elem instanceof Element) || !is('string', attribute)) return [];
			const attr = attribute.startsWith('data-') ? attribute : 'data-' + attribute;
			const bare = attribute.startsWith('data-') ? attribute.slice(5) : attribute;
			const read = key => (elem.getAttribute(key) ?? '').normalize('NFC').toLowerCase();
			const parse = raw => raw.split(/[\s,|]+/).map(s => s.trim()).filter(Boolean);
			return [...new Set([...parse(read(attr)), ...parse(read(bare))])];
		}

		static autoclass(elem) {
			const result = { core: [], math: [], svg: [] };
			const API = this.prototype.normalize(elem, 'autoclass');
			const elementSets = fromEntries(
				keys(result).map(ns => [
					ns, new Set(Object.values(JSDOM.ELEMENTS[ns]).filter(Boolean).join('|').split('|'))
				])
			);
			const SHORTHANDS = {
				core: 'core.stable', stable: 'core.stable', baseline: 'core.baseline',
				experimental: 'core.experimental', deprecated: 'core.deprecated',
				legacy: 'core.legacy', obsolete: 'core.obsolete',
			};
			const expand = (ns, prop) => (JSDOM.ELEMENTS[ns][prop] ?? '').split('|').filter(Boolean);
			for (const token of API) {
				if (token.includes('.')) {
					const i = token.indexOf('.');
					const ns = token.slice(0, i);
					const prop = token.slice(i + 1);
					if (!owns(ns, result)) { console.warn(`autoclass: unknown namespace "${ns}", skipping "${token}".`); continue; }
					result[ns].push(...(owns(prop, JSDOM.ELEMENTS[ns]) ? expand(ns, prop) : elementSets[ns].has(prop) ? [prop] : (console.warn(`autoclass: unknown "${prop}" on "${ns}", skipping "${token}".`), [])));
					continue;
				}
				if (owns(token, SHORTHANDS)) { const [ns, prop] = SHORTHANDS[token].split('.'); result[ns].push(...expand(ns, prop)); continue; }
				if (elementSets.core.has(token)) { result.core.push(token); continue; }
				console.warn(`autoclass: unknown token "${token}", skipping.`);
			}
			keys(result).forEach(ns => result[ns] = [...new Set(result[ns])].sort());
			if (!keys(result).some(ns => result[ns].length)) {
				console.warn('autoclass: no valid tokens, falling back to core.stable.');
				result.core = expand('core', 'stable').sort();
			}
			result.core = new Set(result.core);
			result.math = new Set(result.math);
			result.svg  = new Set(result.svg);
			return result;
		}

		sanitize(el, key, allowed) {
			const attr = (el?.getAttribute('data-'+ key) ?? el?.getAttribute(key) ?? '')
				.normalize('NFC').toLowerCase().trim();
			const result = attr ? [...new Set(attr.split(/\s*,\s*/).filter(Boolean))] : [];
			return is('array', allowed) ? result.filter(s => allowed.includes(s)) : result;
		}

		static types(script) {
			return Array.from(script?.attributes ?? []).flatMap(({ name, value }) => {
				const ln = name.toLowerCase();
				const base = ln.startsWith('data-') ? ln.slice(5) : ln.startsWith('@') ? ln.slice(1) : ln;
				const typeset = (base === 'typeset');
				if (!typeset && !this.conventions.has(base)) return [];
				return [ typeset ? value : (value ? (base +'='+ value) : base) ];
			}).join(', ');
		}

		static typeset(input, whitelist = AttributeParser.conventions) {
			const raw = (input instanceof Element) ? AttributeParser.types(input) : (is('string', input) ? input : '');
			const seen = new Set();
			const list = whitelist && new Set(whitelist);
			const array = raw.split(',').flatMap((segment) => {
				let [key, ...v] = segment.split('=').map(s => s.trim().normalize('NFC'));
				if (!key) return [];
				key = key.toLowerCase();
				const value = v.join('=') || null;
				const id = key + '|' + value;
				return ((!list || list.has(key)) && !seen.has(id)) ? (seen.add(id), { key, value }) : [];
			});
			return array.length ? array : [{ key: 'pascalite', value: null }];
		}

		static engine(el) {
			return !!(
				el?.hasAttribute('⚡') || el?.hasAttribute('🏌🏽') ||
				el?.hasAttribute('data-engine') || el?.hasAttribute('engine')
			);
		}

		parse(el, defaults) {
			const settings = {};
			for (const [key, value] of entries(defaults)) {
				switch(type(value)) {
					case 'function': {
						if (!value.length) { settings[key] = this.constructor[key].call(this.constructor, el); }
						else               { settings[key] = value.call(el, el); }
						break;
					}
					case 'object': {
						let [primary, alternatives] = entries(value)[0];
						let result = this.sanitize(el, key, [primary, ...alternatives]);
						settings[key] = result.length ? result : [primary];
						break;
					}
					case 'boolean': { console.log(key, value); settings[key] = value; }
					default: {
						settings[key] = (value === !!value)
							? !!(el?.hasAttribute('data-' + key) || el?.hasAttribute(key))
							: value;
					}
				}
			}
			settings.attributes = el?.attributes;
			settings.defaults   = defaults;
			settings.script     = [el];
			return freeze(settings);
		}
	}

	class Lexeme extends String {

		static conventions = AttributeParser.conventions;

		constructor(text, typeset, id, initial) {
			super(text);
			const lock = (v) => ({ value: v, enumerable: T });
			const isMetaObj = typeset?.constructor === Object;
			const meta      = isMetaObj ? typeset : {};
			this.convention = isMetaObj ? 'none' : (typeset?.toLowerCase() || 'pascalite');
			const props = {
				id:       lock(id ?? text.toUpperCase()),
				original: lock(initial ?? text),
				metadata: { value: meta }
			};
			for (const [key, value] of entries(meta)) {
				if (!(key in props) && key !== 'convention') props[key] = lock(value);
			}
			Object.defineProperties(this, props);
			const mode = Lexeme.conventions.has(this.convention) ? this.convention : 'pascalite';
			return (initial === void 0) ? this[mode]() : this;
		}

		#step = (v) => {
			const typeArg = Object.keys(this.metadata).length ? this.metadata : this.convention;
			return new Lexeme(String(v), typeArg, this.id, this.original);
		};
		#map = (convention, fallback) => {
			const entry = JSDOM.DICTIONARIES?.[convention]?.[this.toLowerCase()];
			return this.#step(entry ?? String(fallback));
		};

		alias(convention)  { return new Lexeme(this.original, convention, this.id); }
		transform(convention, fromInitial = false) {
			const mode = Lexeme.conventions.has(convention) ? convention : 'pascalite';
			return fromInitial ? this.alias(convention) : this[mode]();
		}
		suffix(regex, str) { return regex.test(this) ? this.#step(this + str) : this; }
		prefix(str)        { return str ? this.#step(str + this) : this; }
		initial()   { if (!this.length) return this; return this.#step(this[0].toUpperCase() + this.slice(1).toLowerCase()); }
		pascalite() { return this.#map('Pascalite', this.initial()) }
		uppercase() { return this.#step(super.toUpperCase()) }
		lowercase() { return this.#step(super.toLowerCase()) }
		pascal()    { return this.#map('Pascal', this.pascalite()) }
		jquery()    { return this.#step('$' + this.initial()) }
		none()      { return this }
	}

    const THIS_CONFIGURATION = new AttributeParser().parse(THIS_SCRIPT, {
		typeset:   () => {},
		autoclass: () => {},
		engine:    () => {},
		mode:      { 'strict' : [ 'flexible', 'strictest' ] },
		events:    true,
		noglobals: [false, [true, 'init']],
		debug:     [false, [true, 'init']],
	});

	// ── Symlink ───────────────────────────────────────────────────────────────
	// Per-element private storage contract for Instance components.
	//
	// All internal state is held in static private WeakMaps keyed by element.
	// This means the element itself carries zero own properties — Reflect.ownKeys()
	// on any mounted component returns exactly what a plain DOM element returns: [].
	//
	// The only external access path is through the Symbol-keyed getters defined
	// on the prototype below. These are copied to each Metaclass prototype by
	// the #metaclass loop, so every Div, Span, ProductCard etc inherits them.
	// The getter bodies close over 'Symlink' directly and survive the copy intact.
	//
	// Storage is split by concern. Each WeakMap holds one category of state.
	// The WeakMap keys are always the element. Values are whatever that concern needs.
	// Absence from a map = that feature was never used on this element (lazy, zero cost).
	//
	// #mounted uses WeakSet rather than WeakMap — a flag has no value, it either
	// exists or it doesn't. has() is faster than get() + null check for booleans.

	class Symlink {

		// ── Storage maps ──────────────────────────────────────────────────────

		// Component identity. Set at mount time, never changes.
		// Value: { constructor: Class, native: HTMLElement|null }
		static #metadata       = new WeakMap();

		// Element collection. Index 0 is always the element itself.
		// Grows when @every placement creates clones.
		// Value: Array<Element>
		static #elements       = new WeakMap();

		// Reactive effect disposal functions. Populated lazily on first effect.
		// Each entry is a dispose() fn that stops one scoped effect.
		// The entire set is drained on @unmount via _disposeEffects().
		// Value: Set<Function>
		static #scopedEffects  = new WeakMap();

		// Shadow DOM root. Set at mount time for shadow components, null otherwise.
		// Value: ShadowRoot
		static #shadowRoot     = new WeakMap();

		// Reactive signal store. Backing storage for this.$.key signals.
		// Populated lazily when this.$ is first accessed.
		// Value: Map<string, Signal>
		static #reactiveStore  = new WeakMap();

		// Reactive proxy. The callable Proxy returned by this.$ getter.
		// Cached after first construction.
		// Value: Proxy
		static #reactiveProxy  = new WeakMap();

		// Meta-transition observers. Populated by this.on(':name', fn).
		// Each key is a transition name. Value holds start and end handler sets.
		// Value: Map<string, { start: Set<Function>, end: Set<Function> }>
		static #metaTransition = new WeakMap();

		// Currently running transition names. Prevents the same transition
		// from being triggered twice concurrently on the same element.
		// Value: Set<string>
		static #activeTransitions = new WeakMap();

		// Element namespace cache. Holds initialised namespace objects per tag.
		// Populated lazily on first this.$.form / this.$.input / this.$.a etc access.
		// Value: Map<string, NamespaceObject>
		static #namespaceStore = new WeakMap();

		// Worker, socket, and message-channel proxy objects.
		// Each created lazily on first this.worker / this.socket / this.listen access.
		// Removed and set to null by @removal lifecycle.
		// Value: Proxy
		static #workerProxy    = new WeakMap();
		static #socketProxy    = new WeakMap();
		static #listenProxy    = new WeakMap();

		// Mounted flag. Presence in the set means the element has fired @mount.
		// Absence means it hasn't (first entry pending) or was fully cleaned up.
		// WeakSet rather than WeakMap — a flag has no value, only existence.
		static #mounted        = new WeakSet();

		// Deferred-unmount scratch. Set just before @unmount transition begins,
		// cleared by _fullCleanup after the transition resolves.
		// Value: Element | null
		static #lastParent     = new WeakMap();
		// Value: Node | null
		static #lastSibling    = new WeakMap();

		// Placement scratch. Set by _processArgs when an @verb placement is found,
		// consumed by the MutationObserver on @insertion, then cleared.
		// Stored as one object: { verb: string, ctx: Element|null }
		static #placement      = new WeakMap();

		// Shadow event contract handlers. Map of event name → listener fn.
		// Populated by wireInboundEvents(). Cleaned up by cleanupInboundEvents().
		// Value: Map<string, Function>
		static #inboundHandlers = new WeakMap();

		// Delegated event listeners. Keyed by 'eventname|selector'.
		// Inner map: original callback → wrapped delegate function.
		// Value: Map<string, Map<Function, Function>>
		static #delegates      = new WeakMap();

		// ── Internal accessors ────────────────────────────────────────────────
		// Three patterns cover all storage operations:
		//   #read(map, el)          — get value or null
		//   #write(map, el, value)  — set value
		//   #ensure(map, el, init)  — get value, initialising lazily if absent

		static #read   = (map, element)            => map.get(element) ?? null;
		static #write  = (map, element, value)     => { map.set(element, value); };
		static #ensure = (map, element, initFn)    => {
			if (!map.has(element)) map.set(element, initFn());
			return map.get(element);
		};

		// ── Symbol getters ────────────────────────────────────────────────────
		// Prototype methods — 'this' is always the element (or the class) at call time.
		// These are the only external doors into the private storage.
		// Copied verbatim to each Metaclass.prototype by the #metaclass loop.
		// The 'Symlink' reference in each body is captured in the closure,
		// so copies work correctly regardless of where they end up in the chain.

		// Component identity — set at mount, readable by anything with the symbol.
		get [METADATA]()  { return Symlink.#read(Symlink.#metadata, this); }

        // Mounted flag — true once @mount has fired. WeakSet: presence = mounted.
		get [MOUNTED]()  { return Symlink.#mounted.has(this); }
		set [MOUNTED](v) { v ? Symlink.#mounted.add(this) : Symlink.#mounted.delete(this); }

		// The element's collection. Index 0 = self. Grows with @every clones.
		get [ELEMENTS]()  { return Symlink.#read(Symlink.#elements, this); }
		set [ELEMENTS](v) { Symlink.#write(Symlink.#elements, this, v); }

		// Shadow root. Null on non-shadow components.
		get [SHADOW_ROOT]()  { return Symlink.#read(Symlink.#shadowRoot, this); }
		set [SHADOW_ROOT](v) { Symlink.#write(Symlink.#shadowRoot, this, v); }

		// Scoped effects. Lazily initialised — zero cost until first effect registered.
		get [SCOPED_EFFECTS]() { return Symlink.#ensure(Symlink.#scopedEffects, this, () => new Set()); }

		// Reactive store and proxy. Lazily initialised by the $ getter.
		get [REACTIVE_STORE]()  { return Symlink.#read(Symlink.#reactiveStore, this); }
		set [REACTIVE_STORE](v) { Symlink.#write(Symlink.#reactiveStore, this, v); }
		get [REACTIVE_PROXY]()  { return Symlink.#read(Symlink.#reactiveProxy, this); }
		set [REACTIVE_PROXY](v) { Symlink.#write(Symlink.#reactiveProxy, this, v); }

		// Meta-transition handlers and active transition names. Both lazy.
		get [META_TRANSITION_HANDLERS]() { return Symlink.#ensure(Symlink.#metaTransition,   this, () => new Map()); }
		get [ACTIVE_TRANSITIONS]()       { return Symlink.#ensure(Symlink.#activeTransitions, this, () => new Set()); }

		// Namespace cache for this.$.form, this.$.input etc. Lazy.
		get [ELEMENT_NS_STORE]() { return Symlink.#ensure(Symlink.#namespaceStore, this, () => new Map()); }

		// Communication proxies. Lazy, cleaned up on @removal.
		get [WORKER_PROXY]()  { return Symlink.#read(Symlink.#workerProxy, this); }
		set [WORKER_PROXY](v) { Symlink.#write(Symlink.#workerProxy, this, v); }
		get [SOCKET_PROXY]()  { return Symlink.#read(Symlink.#socketProxy, this); }
		set [SOCKET_PROXY](v) { Symlink.#write(Symlink.#socketProxy, this, v); }
		get [LISTEN_PROXY]()  { return Symlink.#read(Symlink.#listenProxy, this); }
		set [LISTEN_PROXY](v) { Symlink.#write(Symlink.#listenProxy, this, v); }

		// Collection length and index-0 shorthand. Derived from #elements.
		get length() { return (Symlink.#read(Symlink.#elements, this) ?? []).length; }
		get 0()      { return (Symlink.#read(Symlink.#elements, this) ?? [])[0] ?? null; }

		// Deferred-unmount scratch — last known DOM position before removal.
		get [LAST_PARENT]()      { return Symlink.#read(Symlink.#lastParent,  this); }
		set [LAST_PARENT](value) { Symlink.#write(Symlink.#lastParent,  this, value); }
		get [LAST_SIBLING]()      { return Symlink.#read(Symlink.#lastSibling, this); }
		set [LAST_SIBLING](value) { Symlink.#write(Symlink.#lastSibling, this, value); }

		// Placement scratch — { verb, ctx } set during construction,
		// consumed by MutationObserver on @insertion. Set null to clear.
		get [PLACEMENT]()      { return Symlink.#read(Symlink.#placement, this); }
		set [PLACEMENT](value) { value == null ? Symlink.#placement.delete(this) : Symlink.#write(Symlink.#placement, this, value); }

		// Shadow inbound event handlers. Lazy — Map created on first use.
		get [INBOUND_HANDLERS]() { return Symlink.#ensure(Symlink.#inboundHandlers, this, () => new Map()); }

		// Delegated event listener map. Lazy — Map created on first use.
		get [DELEGATES]() { return Symlink.#ensure(Symlink.#delegates, this, () => new Map()); }

		// ── Lifecycle API ─────────────────────────────────────────────────────
		// Called by _mountElement, MutationObserver, _processArgs, and cleanup paths.
		// These are the write side — the read side is through the symbol getters above.

		// Initialise storage for a newly mounted element.
		// Called once per element from _mountElement.
		static _stamp(element, Klass) {
			Symlink.#write(Symlink.#metadata, element, { constructor: Klass, native: Klass.native ?? null });
			Symlink.#write(Symlink.#elements, element, [element]);
			// #mounted is a WeakSet — absence = not yet mounted. No write needed here.
		}

		// _stamp and _fullCleanup remain as static methods — they're lifecycle
		// operations taking multiple arguments, not per-property accessors.

		// Full teardown. Removes element from every storage map and the mounted set.
		// Called on permanent removal (@unmount path) after effects have been disposed.
		// After this, the element is GC-eligible — no Instance references hold it.
		static _fullCleanup(element) {
			[
				Symlink.#metadata,       Symlink.#elements,      Symlink.#scopedEffects,
				Symlink.#shadowRoot,     Symlink.#reactiveStore,  Symlink.#reactiveProxy,
				Symlink.#metaTransition, Symlink.#activeTransitions, Symlink.#namespaceStore,
				Symlink.#workerProxy,    Symlink.#socketProxy,    Symlink.#listenProxy,
				Symlink.#lastParent,     Symlink.#lastSibling,    Symlink.#placement,
				Symlink.#inboundHandlers, Symlink.#delegates
			].forEach(map => map.delete(element));
			Symlink.#mounted.delete(element);
		}
	}


	class Instance {

		static sleep(ms, callback) { return new Sleep(ms, callback); }

		// Symlink spliced first — symbol getters land on Instance.prototype
		// before the metaclass copy loop runs. Every Metaclass inherits them.
		static { _spliceInterface(Instance, Symlink); }

		static #once;
		static #config;
		static #autoclass;
		static #engine = new Map();


		static get [Symbol.species]() { return this; }

		// Instance.this    → window
		// Div.this         → Instance
		// ProductCard.this → Div

		static get this() {
			if (this === Instance) return global;
			const parent = getPrototypeOf(this);
			return (parent === Function.prototype) ? global : parent;
		}

		static get debug()  { return this.#config?.debug; }
		static get engine() { return this.#config?.engine; }

		static {
			const config    = THIS_CONFIGURATION;
			const autoclass = config.autoclass;

			this.#config    = config;
			this.#autoclass = autoclass;
			this.Lexeme     = Lexeme;

			define(this, Symbol.species, { configurable: F });

			Object.defineProperties(this, {
				version: { value: THIS_VERSION },
				id:      { value: 'INSTANCE' },
				mode:    { value: config.mode[0] },
				config:  { value: config },
				fn:      { value: InstanceSelector },
				expando: { value: ('Instance' + (+new Date() + Math.random())).replace(/\./g, '') }
			});

			makeClassRegistry(this);

			const ARRAY_METHODS = (
				'filter|map|reduce|reduceRight|findIndex|findLast|findLastIndex|forEach|some|' +
				'includes|flat|flatMap|entries|keys|values|indexOf|lastIndexOf|join|slice'
			).split('|');
			// Note: 'find' excluded — Instance.prototype.find is DOM query, not Array.find
			// Note: 'every' excluded — Instance.prototype.every is for collection access

			ARRAY_METHODS.forEach((method) => {
				define(Instance.prototype, method, {
					value: Array.prototype[method],
					configurable: T, enumerable: F, writable: F
				});
			});

			document.addEventListener('DOMContentLoaded', function() {
				new Instance(window);
			});
		}

		*[Symbol.iterator]() {
			const elements = this[ELEMENTS];
			for (let i=0; i < elements.length; i++) yield elements[i];
		}

		[INSTANCE_ENSURE_INDEX_UID](index) { ENSURE_INDEX_UID(this, index); }

		static [Symbol.hasInstance](value) {
			if (value === null || (typeof value !== 'object' && typeof value !== 'function')) return false;
			const md = value[METADATA];
			if (md) {
				let ctor = md.constructor;
				while (ctor && ctor !== Object) {
					if (ctor === this) return true;
					ctor = getPrototypeOf(ctor);
				}
				return false;
			}
			return Function.prototype[Symbol.hasInstance].call(this, value);
		}

		get version()  { return Instance.version; }
		get author()   { return this.constructor.author || {}; }
		get instance() { return this[METADATA]?.native ?? null; }

		get prototype() {
			let proto = getPrototypeOf(this);
			while (proto?.[INSTANCE_PROTO]) proto = getPrototypeOf(proto);
			return proto;
		}

		// Returns the constructor (the class) from METADATA.
		//
		//   this           → the HTMLDivElement     — singular — the DOM node
		//   this.this      → ProductCard            — the class — the registry
		//   this.this.this → Div                    — parent class
		//   this.this.this.this → Instance          — base
		//   this.this.this.this.this → window       — terminal
		//
		//   this.this[0]          → first live instance of this class
		//   this.this.length      → how many live instances
		//   this.this.where(fn)   → filtered collection

		get this() {
			return this[METADATA]?.constructor ?? this.constructor;
		}

		// Returns an InstanceCollection wrapping all ELEMENTS.
		// Instance methods (addClass, on, text…) act on THIS element only.
		// Use this.every when you genuinely mean the full collection.
		//
		//   this.addClass('visible')       → this element only
		//   this.every.addClass('visible') → all ELEMENTS

		get every() {
			return new InstanceCollection(this[ELEMENTS] ?? [this]);
		}

		get() {}
		set() { console.warn('[Instance] set() is not yet implemented. Override in your subclass.'); }

		static #metadata(object) { return object?.[METADATA] ?? null; }

		static #metaclass = (NAME, ID) => {

			const nativeProto = Object.getPrototypeOf(CREATE_ELEMENT(String(ID.toLowerCase())));

			const meta_descriptor = {
				[Symbol.species]: { configurable: F },
				name:        { value: String(NAME), configurable: T },
				id:          { value: ID },
				constructor: CONF_W(nativeProto.constructor)
			};

			let Metaclass;

			if (!CAN_NEW_FUNCTION) Instance.warn('CSP Strict: new Function() blocked for ' + NAME);
			try {
				Metaclass = Object.defineProperties( CAN_NEW_FUNCTION
					? new Function('Instance', `return class ${NAME} extends Instance {}`)(Instance)
					: class extends Instance {}
					, meta_descriptor
				);
			} catch (e) {
				Instance.warn('Unknown Error: could not define Instance metaclass ' + NAME);
				return null;
			}

			Object.setPrototypeOf(Metaclass.prototype, nativeProto);

			Reflect.ownKeys(Instance.prototype).forEach((key) => {
				if (key === 'constructor') return;
				const desc = Object.getOwnPropertyDescriptor(Instance.prototype, key);
				if (desc) Object.defineProperty(Metaclass.prototype, key, desc);
			});

			makeClassRegistry(Metaclass);

			if (Instance.#config.engine) {
				const original = Object.getOwnPropertyDescriptor(nativeProto, 'constructor');
				Instance.#engine.set(nativeProto, original);
				Object.defineProperty(nativeProto, 'constructor', {
					value: Metaclass, configurable: T, enumerable: F, writable: T
				});
			}

			return Metaclass;
		};

		static powerdown() {
			Instance.#engine.forEach((original, proto) => {
				if (original) { Object.defineProperty(proto, 'constructor', original); }
				else          { delete proto.constructor; }
			});
			Instance.#engine.clear();
			if (Instance.debug) console.info('[Instance] ⚡ engine powered down — native constructors restored');
			return Instance;
		}

		static from(elements) {
			const arr = Array.isArray(elements) ? elements : Array.from(elements ?? []);
			if (!arr.length) return null;
			if (arr.length === 1) return arr[0];
			return new InstanceCollection(arr);
		}

		static #init(target) {

			this.#once = true;
			const typeset = this.#config.typeset;

			const mode = (() => {
				switch (Instance.mode) {
					case 'flexible':  return { writable: T,  enumerable: F, configurable: T  }
					case 'strict':    return { writable: F, enumerable: F, configurable: T  }
					case 'strictest': return { writable: F, enumerable: F, configurable: F }
				}
			})();

			const [MasterConvention, ...Aliases] = typeset;
			const { key: convention, value: prefix } = MasterConvention;

			if (Instance.#config.engine) {
				console.info('[Instance] ⚡ engine active — native prototype constructors will be rewired');
			}

			this.#autoclass.core.forEach((tagName) => {

				const NAME = new Lexeme(tagName, convention).prefix(prefix).suffix(JS_GLOBALS, 'Element');
				const ID   = NAME.id;

				ifndef(target, NAME,
					() => {
						const Metaclass = Instance.#metaclass(NAME, ID);
						if (Metaclass) {

							Reflect.defineProperty(target, NAME, assign({ value: Metaclass }, mode));

							ifndef(target, tagName, () => {
								Reflect.defineProperty(target, tagName, {
									get() { return makeFactory(Metaclass); },
									configurable: T, enumerable: F
								});
							});

							// el.span → el.querySelector('span')
							ifndef(Instance.prototype, tagName, () => {
								Object.defineProperty(Instance.prototype, tagName, {
									get() { return this.querySelector(tagName) ?? null; },
									configurable: T, enumerable: F
								});
							});

							Aliases.forEach(({ key: conv, value: pref }) => {
								const ALT = NAME.alias(conv).prefix(pref).suffix(JS_GLOBALS, 'Element');
								ifndef(target, ALT,
									() => { Reflect.defineProperty(target, ALT, assign({ value: Metaclass }, mode)); },
									() => { Instance.warn(`Class [${ALT}] already exists pre-initialization. Skipping.`); }
								);
							});
						}
					},
					() => { Instance.warn(`Class [${NAME}] could not be defined. Skipping.`); }
				);
			});

			// $  — collection: querySelectorAll or construct multiple
			// $$ — singular:   querySelector or construct/return one
			//
			//   $('.card')       → InstanceCollection of all .cards
			//   $$('.card')      → first .card element
			//   $(div, span, p)  → InstanceCollection of constructed elements

			ifndef(target, '$', () => {
				Reflect.defineProperty(target, '$', {
					get() {
						return new Proxy(function $() {}, {
							apply(_, __, args) {
								if (args.length === 1 && typeof args[0] === 'string') {
									return new InstanceCollection([...document.querySelectorAll(args[0])]);
								}
								if (args.every(a => typeof a === FN && a[INSTANCE_FACTORY])) {
									return new InstanceCollection(args.map(a => a()));
								}
								if (args.every(a => a instanceof Node)) {
									return new InstanceCollection(args);
								}
								return new InstanceCollection(args.filter(a => a instanceof Node));
							}
						});
					},
					configurable: T, enumerable: F
				});
			});

			ifndef(target, '$$', () => {
				Reflect.defineProperty(target, '$$', {
					get() {
						return new Proxy(function $$() {}, {
							apply(_, __, args) {
								if (args.length === 1 && typeof args[0] === 'string') {
									return document.querySelector(args[0]);
								}
								if (args.length === 1 && typeof args[0] === 'function' && args[0][INSTANCE_FACTORY]) {
									return args[0]();
								}
								if (args.length === 1 && args[0] instanceof Node) return args[0];
								return args[0] ?? null;
							}
						});
					},
					configurable: T, enumerable: F
				});
			});
		}

		constructor(...args) {
            
		  if (new.target === Instance) {

			if (!Instance.#once) Instance.#init(globalThis);

			let first = arguments[0];
			if (first === window || first === document) return Instance.fn;

		  } else {

			// Priority:
			//   1. new.target.id              — set by #metaclass (Div, Span etc)
			//   2. new.target.element string  — explicit static element = 'article'
			//   3. new.target.name.toUpperCase() — derived from class name (Tab → 'TAB')

			const nt = new.target;

			// static element = ['div', 'section', 'article']
			// Constructor returns a pending Proxy. Caller provides element type.
			if (Array.isArray(nt.element)) {
				return makePendingProxy(nt, [...arguments]);
			}

			let resolvedTag = null;

			// Check for '<:tagname>' specifier in first non-identity arg
			for (let i = 0; i < arguments.length; i++) {
				if (isElementSpecifier(arguments[i])) {
					resolvedTag = parseElementSpecifier(arguments[i]);
					break;
				}
			}

			if (!resolvedTag) {
				if (nt.id) {
					resolvedTag = nt.id.toLowerCase();
				} else if (typeof nt.element === 'string') {
					resolvedTag = nt.element.toLowerCase();
				} else {
					resolvedTag = toID(nt.name).toLowerCase();
					// Set id on class so future constructions skip this
					if (!owns('id', nt)) {
						define(nt, 'id', CONF(toID(nt.name)));
					}
				}
			}

			// Create the element — any tag, registered or custom
			const element = CREATE_ELEMENT(resolvedTag);
			this.#mount(element);

			// static styles on non-shadow component — inject once per class
			if (nt.styles && !nt[SCOPED_STYLES_INJECTED]) {
				Instance._injectScopedStyles(nt, resolvedTag);
			}

			const hasURL = [...arguments].some(a => typeof a === S && isURL(a.trim()));

			if (hasURL) {
				return _processConstructorArgs(element, [...arguments], nt);
			}

			_processConstructorArgsSync(element, [...arguments]);

			return element;
		  }
		}

		#mount(element) {
			_mountElement(element, this.constructor);
			const nt = this.constructor;
			if (nt.element && !nt._ceRegistered) {
				const isNative = typeof nt.element === S && (Instance.#autoclass?.core?.has(nt.element) ?? false);
				const tag = typeof nt.element === S ? nt.element : (nt.name?.toLowerCase() ?? null);
				if (tag && !isNative && !customElements.get(tag)) {
					registerCustomElement(nt, tag);
					define(nt, '_ceRegistered', CONF(true));
				}
			}
		}

		static #registry_internal = new Map();
		static registry  = function() {};

		// Injects static styles into <head> scoped to this class's elements.
		// Uses element tag name as scope if custom, or a data attribute for
		// standard elements to avoid clobbering global styles.
		// Called once per class — guarded by SCOPED_STYLES_INJECTED.

		static _injectScopedStyles(Klass, tag) {
			if (Klass[SCOPED_STYLES_INJECTED]) return;
			define(Klass, SCOPED_STYLES_INJECTED, CONF(true));

			const styles  = Klass.styles;
			if (!styles)  return;

			// Scope selector — custom elements use tag directly,
			// standard elements use a data-instance-scope attribute
			const isCustom = tag.includes('-') || !JSDOM.ELEMENTS.core.stable?.includes(tag);
			const scope    = isCustom ? tag : `[data-instance-scope="${Klass.id ?? tag.toUpperCase()}"]`;

			// Apply scope attribute to all future instances via @insertion
			if (!isCustom) {
				const origInsertion = Klass.prototype['@insertion'];
				define(Klass.prototype, '@insertion', {
					value: function(context) {
						this.setAttribute('data-instance-scope', Klass.id ?? tag.toUpperCase());
						if (origInsertion && origInsertion !== Instance.prototype['@insertion']) {
							origInsertion.call(this, context);
						}
					},
					configurable: T, enumerable: F, writable: T
				});
			}

			// Scope the CSS — prefix each rule with the scope selector
			// Simple approach: wrap in a @scope block or prefix each selector
			const scoped = styles.replace(/:host/g, scope);

			const styleEl = document.createElement('style');
			styleEl.setAttribute('data-instance-class', Klass.name ?? tag);
			styleEl.textContent = scoped;
			document.head.appendChild(styleEl);

			// Track for cleanup — remove when last instance unmounts
			const origUnmount = Klass.prototype['@unmount'];
			define(Klass.prototype, '@unmount', {
				value: function(context) {
					// Check via class registry — if last instance, remove stylesheet
					if (Klass[CLASS_INSTANCES]?.length === 0) {
						styleEl.remove();
						delete Klass[SCOPED_STYLES_INJECTED];
					}
					if (origUnmount && origUnmount !== Instance.prototype['@unmount']) {
						origUnmount.call(this, context);
					}
				},
				configurable: T, enumerable: F, writable: T
			});
		}

		// Fired by _fetchAndPopulate based on response content-type.
		// Override in subclasses to handle each content type.

		['@loading'](context)   {}   // fetch initiated — context.url, context.pending
		['@response'](context)  {}   // raw Response — escape hatch, call context.cancel() to stop
		['@html'](context)      {}   // text/html — context.html, context.url
		['@json'](context)      {}   // application/json — context.data, context.url
		['@text'](context)      {}   // text/plain — context.text, context.url
		['@blob'](context)      {}   // binary — context.blob, context.type, context.url
		['@stream'](context)    {}   // streaming — context.reader, context.stream, context.url
		['@streamend'](context) {}   // stream closed — context.url
		['@data'](context)      {}   // fallback catch-all — any unhandled content type
		['@async'](context)     {}   // fired on parent when child <async> resolves

		// ['::eventname'] — fires ONLY via validated shadow contract path
		// ['::*']         — fires for ALL inbound contract events (canonical catch-all)
		// ['@shadow']     — alias for ['::*'] — same behaviour, both fire

		['::*'](context)        {}   // canonical catch-all — all inbound contract events
		['@shadow'](context)    {}   // alias — fires alongside ['::*']

		static warn(...args) {
			if (Instance.debug) { /* console.warn.apply(null, ...args); */ }
			return Instance;
		}

		static _LIFECYCLE_EVENTS = new Set([
			'insertion', 'mount', 'removal', 'unmount', 'rendered',
			'adopted', 'attributechanged',
			'after', 'before', 'firstchild', 'lastchild', 'append', 'replace', 'wrap', 'every', 'slot',
			// content-type lifecycles
			'loading', 'response', 'html', 'json', 'text', 'blob', 'stream', 'streamend', 'data', 'async',
			// shadow contract catch-alls
			'::*', 'shadow',
		]);

		static _NATIVE_EVENTS = all(JSDOM.EVENTS);

		static _normalizeEvent = function(name) {
			return String(name).replace(/_/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		};

		static of(object) {
			const metadata = Instance.#metadata(object);
			return metadata ? metadata.constructor : null;
		}

		static register(symbolKey, Implementation) {
			const sym = typeof symbolKey === S ? Symbol.for(symbolKey) : symbolKey;
			Instance.#registry_internal.set(sym, Implementation);
			if (!global[sym]) OBJECT_DEFINE(global, sym, CONF_W(Implementation));
			return sym;
		}

		static get(symbolKey) {
			const sym = typeof symbolKey === S ? Symbol.for(symbolKey) : symbolKey;
			return Instance.#registry_internal.get(sym);
		}

		static #jquery = { merged: false };

		static #jqueryDefine(methodName, value) {
			const jq_descriptor = (value) => ({ value, writable: T, enumerable: F, configurable: T });
			if (owns(methodName, Instance.prototype)) return false;
			OBJECT_DEFINE(Instance.prototype, methodName, jq_descriptor(value));
			return true;
		}

		static mergeJQuery() {
			const jQuery = global.jQuery;
			const JQUERY_ASYNC = new Set([
				'animate','fadeIn','fadeOut','fadeTo','fadeToggle',
				'slideDown','slideUp','slideToggle','show','hide',
				'toggle','delay','queue','dequeue','stop','finish'
			]);
			let count = 0;
			if (!jQuery?.fn)             return Instance.warn('mergeJQuery(): jQuery not found — skipping.');
			if (Instance.#jquery.merged) return Instance.warn('mergeJQuery(): already merged — skipping.');
			Object.keys(jQuery.fn).forEach(methodName => {
				if (typeof jQuery.fn[methodName] !== 'function') return;
				const value = JQUERY_ASYNC.has(methodName)
					? function(...args) {
						const el = this;
						return makeChainable(new Promise((resolve, reject) => {
							try { jQuery(el)[methodName](...args).promise().then(() => resolve(el)).catch(reject); }
							catch(e) { reject(e); }
						}));
					}
					: jQuery.fn[methodName];
				if (Instance.#jqueryDefine(methodName, value)) count++;
			});
			if (typeof jQuery.fn.promise === 'function') {
				Instance.#jqueryDefine('promise', function() {
					const el = this;
					return new Promise((resolve, reject) => {
						try { jQuery(el).promise().then(() => resolve(el)).catch(reject); }
						catch(e) { reject(e); }
					});
				});
			}
			Instance.#jquery.merged = true;
			console.info(`Instance.mergeJQuery(): merged ${count} synchronous jQuery.fn methods (${JQUERY_ASYNC.size} async).`);
			return Instance;
		}

		sleep(ms, callback) {
			const el = this;
			return makeChainable(new Promise(resolve =>
				setTimeout(async () => {
					for (const item of el) { await callback?.(item); }
					resolve(el);
				}, ms)
			));
		}

		// DOM query on this element — singular default.
		// Returns InstanceCollection for multiple, raw element for single match.

		find(selector) {
			const results = Array.from(this.querySelectorAll(String(selector)));
			return Instance.from(results);
		}

		findAll(selector) { return this.find(selector); }

		// Scope into ELEMENTS collection. Negative indices via Array.at.

		at(n)   { return this[ELEMENTS]?.at(n) ?? null; }
		first() { return this[ELEMENTS]?.[0] ?? null; }
		last()  { return this[ELEMENTS]?.[this[ELEMENTS].length - 1] ?? null; }

		// Full cascade:
		//   'event'     → native/custom DOM event
		//   ':event'    → meta — listener added / transition started
		//   '::event'   → shadow contract — inbound through boundary
		//   ':::event'  → meta of shadow — shadow contract listener added / shadow transition started

		on(event, delegation, callback) {
			if (typeof delegation === FN && callback === undefined) { callback = delegation; delegation = null; }
			if (typeof callback === FN && delegation === true) return this.once(event, callback);
			if (typeof callback !== 'function') return this;

			const { metaDepth, shadowDepth, coreName } = _parseEventDepth(event);

			// Meta layer — ':event' or ':::event'
			if (metaDepth === 1) {
				return this._onMetaObserver(coreName, shadowDepth, callback, 'start');
			}

			// Shadow contract — '::event' (handled by wireInboundEvents, not here)
			// but allow .on('::event', fn) as alias for LIFECYCLE_HANDLERS
			if (shadowDepth === 2 && metaDepth === 0) {
				return this._onMeta('::' + coreName, callback, delegation, false);
			}

			// Normal event — 'event'
			if (!this[OBSERVERS])      this[OBSERVERS]      = new Map();
			if (!this[META_OBSERVERS]) this[META_OBSERVERS] = new Map();

			if (event === 'change') {
				const prop = delegation;
				if (!this[OBSERVERS].has(prop)) { this[OBSERVERS].set(prop, new Set()); this.makeObservable(prop); }
				this[OBSERVERS].get(prop).add(callback);
				return this;
			}

			const normalized = Instance._normalizeEvent(event);
			if (typeof delegation === S) {
				const selector = delegation;
				const delegate = (e) => { if (e.target?.closest(selector)) callback.call(e.target.closest(selector), e); };
				
				const key = normalized + '|' + selector;
				if (!this[DELEGATES].has(key)) this[DELEGATES].set(key, new Map());
				this[DELEGATES].get(key).set(callback, delegate);
				this.addEventListener(normalized, delegate, delegation instanceof Object ? delegation : {});
			} else {
				const opts = (delegation && typeof delegation === O) ? delegation : undefined;
				this.addEventListener(normalized, callback, opts);
			}
			return this;
		}

		off(event, delegation, callback) {
			if (typeof delegation === FN && callback === undefined) { callback = delegation; delegation = null; }
			if (typeof callback !== 'function') return this;

			const { metaDepth, shadowDepth, coreName } = _parseEventDepth(event);

			// Meta layer — ':event' removal = end observer
			if (metaDepth === 1) {
				return this._offMetaObserver(coreName, shadowDepth, callback);
			}

			// Shadow contract alias
			if (shadowDepth === 2 && metaDepth === 0) {
				return this._offMeta('::' + coreName, callback);
			}

			// Normal event
			if (event === 'change') { this[OBSERVERS]?.get(delegation)?.delete(callback); return this; }
			const normalized = Instance._normalizeEvent(event);
			if (typeof delegation === S) {
				const key      = normalized + '|' + delegation;
				const delegate = this[DELEGATES]?.get(key)?.get(callback);
				if (delegate) { this.removeEventListener(normalized, delegate); this[DELEGATES].get(key).delete(callback); }
			} else {
				const opts = (delegation && typeof delegation === O) ? delegation : undefined;
				this.removeEventListener(normalized, callback, opts);
			}
			return this;
		}

		once(event, delegation, callback) {
			if (typeof delegation === FN && callback === undefined) { callback = delegation; delegation = null; }
			if (typeof callback !== 'function') return this;
			const el = this;
			const wrapper = function(...args) {
				callback.apply(this, args);
				el.off(event, delegation ?? wrapper, delegation ? wrapper : undefined);
			};
			const { metaDepth } = _parseEventDepth(event);
			if (metaDepth === 1) return this._onMeta(event.slice(1), wrapper, delegation, true);
			return delegation ? this.on(event, delegation, wrapper) : this.on(event, wrapper);
		}

		trigger(event, detail) {
			const normalized = Instance._normalizeEvent(event);
			const isNative   = Instance._NATIVE_EVENTS.has(normalized);
			const evt = isNative
				? new Event(normalized, { bubbles: true, cancelable: true })
				: new CustomEvent(normalized, { bubbles: true, cancelable: true, detail: detail ?? {} });
			this.dispatchEvent(evt);
			return this;
		}

		_onMeta(name, fn, options, isOnce) {
			const LIFECYCLE = Instance._LIFECYCLE_EVENTS;
			if (LIFECYCLE.has(name)) {
				if (!this[LIFECYCLE_HANDLERS]) OBJECT_DEFINE(this, LIFECYCLE_HANDLERS, CONF(new Map()));
				const handlers = this[LIFECYCLE_HANDLERS];
				if (!handlers.has(name)) handlers.set(name, new Set());
				if (isOnce) {
					const el   = this;
					const wrap = (...args) => { fn(...args); handlers.get(name)?.delete(wrap); };
					handlers.get(name).add(wrap);
				} else { handlers.get(name).add(fn); }
				if (name === 'attributechanged') Instance._watchAttributes(this, Array.isArray(options) ? options : null);
				Instance._ensureObserver();
			} else {
				const normalized = Instance._normalizeEvent(name);
				const opts = (options && typeof options === O) ? options : undefined;
				if (isOnce) {
					const el   = this;
					const wrap = function(...args) { fn.apply(this, args); el.removeEventListener(normalized, wrap, opts); };
					this.addEventListener(normalized, wrap, opts);
				} else { this.addEventListener(normalized, fn, opts); }
			}
			return this;
		}

		_offMeta(name, fn) {
			if (Instance._LIFECYCLE_EVENTS.has(name)) { this[LIFECYCLE_HANDLERS]?.get(name)?.delete(fn); }
			else { this.removeEventListener(Instance._normalizeEvent(name), fn); }
			return this;
		}

		// Handle ':event', ':transition', ':::shadowEvent', ':::shadowTransition'
		// on  = observe ADDITION (event listener added / transition started)
		// off = observe REMOVAL  (event listener removed / transition ended)

		_onMetaObserver(coreName, shadowDepth, fn, phase) {
			if (!this[META_TRANSITION_HANDLERS]) {
				OBJECT_DEFINE(this, META_TRANSITION_HANDLERS, CONF(new Map()));
			}
			const key = (shadowDepth === 2 ? '::' : '') + coreName;
			if (!this[META_TRANSITION_HANDLERS].has(key)) {
				this[META_TRANSITION_HANDLERS].set(key, { start: new Set(), end: new Set() });
			}
			this[META_TRANSITION_HANDLERS].get(key).start.add(fn);

			// Also patch addEventListener so event listener additions are observable
			if (shadowDepth === 0) this.patchEventMethods();
			return this;
		}

		_offMetaObserver(coreName, shadowDepth, fn) {
			const key = (shadowDepth === 2 ? '::' : '') + coreName;
			const handlers = this[META_TRANSITION_HANDLERS]?.get(key);
			if (handlers) {
				handlers.start.delete(fn);
				handlers.end.add(fn);   // off = end observer
			}
			return this;
		}

		then(resolved, rejected) { return this; }

		init(...behaviors) {
			const el = this;
			const run = (behavior) => {
				if (typeof behavior === FN) { return behavior.call(el, el); }
				else if (behavior && typeof behavior === O) {
					if (behavior.attach && typeof behavior.attach === 'function') { return behavior.attach(el); }
					else {
						Object.entries(behavior).forEach(([event, handler]) => {
							const bound = (...args) => { const res = handler.call(el, ...args); if (res && typeof res.then === 'function') res.catch(console.error); };
							el.addEventListener(event, bound);
						});
					}
				}
			};
			for (let i = 0; i < behaviors.length; i++) {
				const result = run(behaviors[i]);
				if (result && typeof result.then === 'function') {
					let promise = (async () => {
						await result;
						for (let j = i + 1; j < behaviors.length; j++) {
							const nextResult = run(behaviors[j]);
							if (nextResult && typeof nextResult.then === 'function') await nextResult;
						}
						return el;
					})();
					return makeChainable(promise);
				}
			}
			return this;
		}

		async(...behaviors) {
			const el = this;
			const parallelPromises = behaviors.map(behavior => {
				if (typeof behavior === FN) {
					const result = behavior.call(el, el);
					return result && typeof result.then === 'function' ? result : Promise.resolve(result);
				}
				if (behavior && typeof behavior.then === 'function') return behavior;
				return Promise.resolve(behavior);
			});
			const finalPromise = Promise.all(parallelPromises).then(() => el);
			return makeChainable(finalPromise);
		}

		makeObservable(prop) {
			if (OBJECT_GET_DESC(this, prop)?.configurable === false) { console.warn(`Can't observe non-configurable prop: ${prop}`); return; }
			let entry = this[prop];
			OBJECT_DEFINE(this, prop, {
				get() { return entry; },
				set(newVal) { const oldVal = entry; if (newVal !== oldVal) { entry = newVal; this[OBSERVERS]?.get(prop)?.forEach(cb => cb(newVal, oldVal)); } },
				configurable: T, enumerable: T
			});
		}

		patchEventMethods() {
			if (this[PATCHED_EVENTS]) return;
			this[PATCHED_EVENTS] = true;
			const el         = this;
			const origAdd    = this.addEventListener.bind(this);
			const origRemove = this.removeEventListener.bind(this);
			this.addEventListener = (type, listener, options) => {
				origAdd(type, listener, options);
				this.notify('addition', type, listener);
				// Fire ':type' meta observers — start (listener added)
				const handlers = el[META_TRANSITION_HANDLERS]?.get(type);
				if (handlers) handlers.start.forEach(fn => fn.call(el, { type, listener, phase: 'start' }));
			};
			this.removeEventListener = (type, listener, options) => {
				origRemove(type, listener, options);
				this.notify('removal', type, listener);
				// Fire ':type' meta observers — end (listener removed)
				const handlers = el[META_TRANSITION_HANDLERS]?.get(type);
				if (handlers) handlers.end.forEach(fn => fn.call(el, { type, listener, phase: 'end' }));
			};
		}

		notify(metaType, eventType, listener) {
			const observers = this[META_OBSERVERS]?.get(metaType)?.get(eventType);
			if (observers) observers.forEach(cb => cb(listener, eventType));
		}

		each(callback) {
			this[ELEMENTS].forEach((elem, index) => callback.call(elem, elem, index));
			return this;
		}

		// These act on THIS element only — not the ELEMENTS collection.
		// For collection-wide: this.every.method() or $(els).method()

		addClass(className)              { this.classList.add(className); return this; }
		removeClass(className)           { this.classList.remove(className); return this; }
		toggleClass(className, force)    { this.classList.toggle(className, force); return this; }
		hasClass(className)              { return this.classList.contains(className); }
		text(content)                    { if (content === undefined) return this.textContent; this.textContent = content; return this; }
		html(content)                    { if (content === undefined) return this.innerHTML; this.innerHTML = content; return this; }
		addStyle(prop, value)            { this.style[prop] = value; return this; }

		set(attr, value) {
			if (typeof attr === O) { for (const [k, v] of Object.entries(attr)) this.setAttribute(k, v); }
			else { this.setAttribute(attr, value); }
			return this;
		}

		appendTo(selector) {
			const targets = document.querySelectorAll(selector);
			if (targets.length === 0) return this;
			targets[0].appendChild(this);
			this[ELEMENTS] = [this];
			ENSURE_INDEX_UID(this, 0);
			const ctor = this.constructor;
			for (let i = 1; i < targets.length; i++) {
				const clone = new ctor();
				targets[i].appendChild(clone);
				this[ELEMENTS].push(clone);
				ENSURE_INDEX_UID(this, i);
			}
			return this;
		}

		fetch(url, options = {}) {
			return makeChainable(globalThis.fetch(url, options).then(r => {
				if (!r.ok) throw new Error(`Instance.fetch: ${r.status} ${r.statusText} — ${url}`);
				return r;
			}));
		}

		get(url, params = {}, options = {}) {
			const hasParams = Object.keys(params).length;
			const fullUrl   = hasParams ? `${url}?${new URLSearchParams(params)}` : url;
			return this.fetch(fullUrl, { ...options, method: 'GET' });
		}

		post(url, body = {}, options = {}) {
			return this.fetch(url, { ...options, method: 'POST', headers: { 'Content-Type': 'application/json', ...options.headers }, body: JSON.stringify(body) });
		}

		query(url, payload = {}, options = {}) {
			const isFlat = Object.values(payload).every(v => v === null || typeof v !== 'object' && !Array.isArray(v));
			return isFlat ? this.get(url, payload, options) : this.post(url, payload, options);
		}

		load(url, options = {}) {
			const el = this;
			return makeChainable(globalThis.fetch(url, options).then(r => {
				if (!r.ok) throw new Error(`Instance.load: ${r.status} ${r.statusText} — ${url}`);
				return r.text();
			}).then(html => { el.innerHTML = html; return el; }));
		}

		lazyLoad(url, options = {}) {
			const el = this;
			return makeChainable(new Promise((resolve, reject) => {
				const observer = new IntersectionObserver(([entry]) => {
					if (!entry.isIntersecting) return;
					observer.disconnect();
					el.load(url, options).then(resolve).catch(reject);
				});
				observer.observe(el);
			}));
		}

		get worker() {
			if (this[WORKER_PROXY]) return this[WORKER_PROXY];
			const el = this;
			let _worker = null, _url = null;
			const spawn = (fn) => {
				const src = `self.onmessage = function(e) { self.postMessage((${fn.toString()})(e.data)); }`;
				_url = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
				_worker = new Worker(_url);
				return _worker;
			};
			const iface = {
				run(fn, data) {
					return makeChainable(new Promise((resolve, reject) => {
						const w = _worker ?? spawn(fn);
						w.onmessage = e => resolve(e.data);
						w.onerror   = e => reject(e);
						w.postMessage(data);
					}));
				},
				post(data)     { _worker?.postMessage(data); return el; },
				on(event, cb)  { _worker?.addEventListener(event, cb); return el; },
				off(event, cb) { _worker?.removeEventListener(event, cb); return el; },
				remove() {
					_worker?.terminate(); URL.revokeObjectURL(_url); _worker = null; _url = null;
					el[WORKER_PROXY] = undefined;
					return el;
				}
			};
			const proxy = new Proxy(function worker() {}, {
				apply(_, __, [fn, data]) {
					return makeChainable(new Promise((resolve, reject) => {
						const src    = `self.onmessage = function(e) { self.postMessage((${fn.toString()})(e.data)); }`;
						const url    = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
						const worker = new Worker(url);
						worker.onmessage = e => { URL.revokeObjectURL(url); worker.terminate(); resolve(e.data); };
						worker.onerror   = e => { URL.revokeObjectURL(url); worker.terminate(); reject(e); };
						worker.postMessage(data);
					}));
				},
				get(_, prop) { return prop in iface ? iface[prop] : undefined; }
			});
			el[WORKER_PROXY] = proxy;
			return proxy;
		}

		get socket() {
			if (this[SOCKET_PROXY]) return this[SOCKET_PROXY];
			const el = this;
			let _socket = null;
			const iface = {
				send(data)     { _socket?.send(typeof data === S ? data : JSON.stringify(data)); return el; },
				on(event, cb)  { _socket?.addEventListener(event, cb); return el; },
				off(event, cb) { _socket?.removeEventListener(event, cb); return el; },
				close()  { _socket?.close(); _socket = null; return el; },
				remove() { _socket?.close(); _socket = null; el[SOCKET_PROXY] = undefined; return el; }
			};
			const proxy = new Proxy(function socket() {}, {
				apply(_, __, [url, protocols]) { _socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url); return proxy; },
				get(_, prop) { return prop in iface ? iface[prop] : undefined; }
			});
			el[SOCKET_PROXY] = proxy;
			return proxy;
		}

		get listen() {
			if (this[LISTEN_PROXY]) return this[LISTEN_PROXY];
			const el = this;
			const channels = new Map();
			const dispatch = (e) => { const { channel, data } = e.data ?? {}; if (!channel) return; channels.get(channel)?.forEach(cb => cb(data, e)); };
			const iface = {
				off(channel, cb) { channels.get(channel)?.delete(cb); return el; },
				post(channel, data, target = '*') { window.postMessage({ channel, data }, target); return el; },
				remove() {
					window.removeEventListener('message', dispatch); channels.clear();
					el[LISTEN_PROXY] = undefined;
					return el;
				}
			};
			const proxy = new Proxy(function listen() {}, {
				apply(_, __, [channel, cb]) {
					if (!channels.size) window.addEventListener('message', dispatch);
					if (!channels.has(channel)) channels.set(channel, new Set());
					channels.get(channel).add(cb);
					return proxy;
				},
				get(_, prop) { return prop in iface ? iface[prop] : undefined; }
			});
			el[LISTEN_PROXY] = proxy;
			return proxy;
		}

		// Overridden in subclasses via computed property syntax:
		//   ['@insertion'](context) { ... }
		// context = the element this was placed relative to (or null)

		['@insertion'](context)  {}
		['@mount'](context)      {}
		['@rendered']()          {}
		['@removal'](context)    { this[WORKER_PROXY]?.remove(); this[SOCKET_PROXY]?.remove(); this[LISTEN_PROXY]?.remove(); }
		['@unmount'](context)    {}
		['@after'](context)      {}
		['@before'](context)     {}
		['@firstchild'](context) {}
		['@lastchild'](context)  {}
		['@append'](context)     {}
		['@replace'](context)    {}
		['@wrap'](context)       {}
		attributeChanged(detail) {}
		adopted()                {}
	}

	Object.defineProperties(Instance, {
		'UUID': { value: function(key) {
			if (typeof key !== 'string' || !key) throw new Error('Instance.UUID expects a non-empty key');
			return Symbol.for(key); },
			writable: T, configurable: T },
		'UID':  { value: function(key = '') { return Symbol(String(key)); },
			writable: T, configurable: T },
		'UNS':  {
			value: function(prefix) { let ns = Instance.UUID(prefix); return function(key) { return Symbol.for(Symbol.keyFor(ns) + '/' + key); } },
			writable: T, configurable: T }
	});

	// toID: class name → uppercase id
	// BlogPost → 'BLOGPOST'   Tab → 'TAB'   ProductCard → 'PRODUCTCARD'
	const toID = name => String(name).toUpperCase();

	// isURL: detects fetch-able URL strings
	const isURL = s => typeof s === S && (
		s.startsWith('/') || s.startsWith('./') ||
		s.startsWith('http://') || s.startsWith('https://')
	);

	// isHTMLString: detects inline HTML strings '<p>...'
	const isHTMLString = s => typeof s === S && s.trimStart().startsWith('<') && !s.trimStart().startsWith('<:');

	// isElementSpecifier: '<:tagname>' — element type for variadic constructors
	const isElementSpecifier = s => typeof s === S && /^<:[a-z][a-z0-9-]*>$/i.test(s.trim());
	const parseElementSpecifier = s => s.trim().slice(2, -1).toLowerCase();

	// Shared async fetch logic used by constructor async path and <async> element.
	// Returns a Promise that resolves to an array of content nodes.
	// Fires appropriate content-type lifecycle on the target element.

	async function _fetchAndPopulate(el, url, pendingNode) {
		// Fire @loading lifecycle
		Instance._fireLifecycleKey(el, '@loading', { url, pending: pendingNode });

		let response;
		try {
			response = await fetch(url);
		} catch(err) {
			Instance._fireLifecycleKey(el, '@error', { error: err, url, status: 0 });
			return null;
		}

		if (!response.ok) {
			const err = new Error(`${response.status} ${response.statusText}`);
			Instance._fireLifecycleKey(el, '@error', { error: err, url, status: response.status, response });
			return null;
		}

		// @response — raw escape hatch, returning false cancels default processing
		let cancelled = false;
		const responseCtx = { response, url, cancel: () => { cancelled = true; } };
		Instance._fireLifecycleKey(el, '@response', responseCtx);
		if (cancelled) return null;

		const contentType = response.headers.get('content-type') ?? '';

		// Streaming
		if (contentType.includes('text/event-stream') || contentType.includes('application/octet-stream')) {
			const reader = response.body.getReader();
			Instance._fireLifecycleKey(el, '@stream', { stream: response.body, reader, url });
			return null; // stream lifecycle handles content
		}

		// JSON
		if (contentType.includes('application/json')) {
			const data = await response.json();
			Instance._fireLifecycleKey(el, '@json', { data, url });
			// @data fallback
			if (!el['@json'] || el['@json'] === Instance.prototype['@json']) {
				Instance._fireLifecycleKey(el, '@data', { data, url, type: 'json' });
			}
			return null; // lifecycle handles rendering
		}

		// Binary / blob
		if (contentType.startsWith('image/') || contentType.startsWith('audio/') ||
			contentType.startsWith('video/') || contentType.startsWith('application/')) {
			const blob = await response.blob();
			Instance._fireLifecycleKey(el, '@blob', { blob, url, type: contentType });
			return null;
		}

		// Plain text
		if (contentType.includes('text/plain')) {
			const text = await response.text();
			Instance._fireLifecycleKey(el, '@text', { text, url });
			if (!el['@text'] || el['@text'] === Instance.prototype['@text']) {
				el.appendChild(document.createTextNode(text));
			}
			return null;
		}

		// HTML (default)
		const html = await response.text();
		// Apply {} placeholder interpolation if pending args exist
		const processedHTML = pendingNode?.[PENDING_ARGS]
			? _interpolatePlaceholders(html, pendingNode[PENDING_ARGS])
			: html;

		Instance._fireLifecycleKey(el, '@html', { html: processedHTML, url });

		// Default HTML handling — parse and return nodes
		if (!el['@html'] || el['@html'] === Instance.prototype['@html']) {
			const template = document.createElement('template');
			template.innerHTML = processedHTML;
			return [...template.content.childNodes];
		}
		return null;
	}

	// Replaces {} or {n} or {name} in HTML with positional/named args.

	function _interpolatePlaceholders(html, args) {
		let i = 0;
		const named = args.find(a => a && typeof a === O && !(a instanceof Node)) ?? {};
		return html
			.replace(/\{(\w+)\}/g, (_, key) => {
				if (!isNaN(key)) return String(args[parseInt(key)] ?? '');
				return String(named[key] ?? '');
			})
			.replace(/\{\}/g, () => String(args[i++] ?? ''));
	}

	// Returns a callable Proxy representing a variadic construction in progress.
	// Carries the class and pending args. Called with element type to resolve.

	function makePendingProxy(Klass, pendingArgs) {
		const proxy = new Proxy(function PendingInstance() {}, {

			// pending('li') — resolve element type
			apply(_, __, [elementArg, ...extra]) {
				const validElements = Klass.element;
				const tag = typeof elementArg === S
					? elementArg.toLowerCase()
					: (Array.isArray(validElements) ? validElements[0] : validElements);

				if (Array.isArray(validElements) && !validElements.includes(tag)) {
					console.warn(`[Instance] '${tag}' not in ${Klass.name}.element list`);
				}

				// Create the element
				const el = CREATE_ELEMENT(tag);
				const inst = Object.create(Klass.prototype);
				inst.constructor = Klass;

				// Re-use mount logic
				Symlink._stamp(el, Klass);
				Object.setPrototypeOf(el, Klass.prototype);

				// Process pending args + any extra args from second call
				const allArgs = [...pendingArgs, ...extra];
				const hasURL  = allArgs.some(isURL);

				if (hasURL) {
					return _processConstructorArgs(el, allArgs, Klass);
				}

				_processConstructorArgsSync(el, allArgs);
				return el;
			},

			get(_, prop) {
				if (prop === 'constructor')       return Klass;
				if (prop === 'then')              return undefined; // not thenable
				if (prop === Symbol.toStringTag)  return 'PendingInstance';
				if (prop === PENDING_ARGS)        return pendingArgs;
				if (prop === Symbol.hasInstance)  return (v) => v instanceof Klass;
				return undefined;
			}
		});
		return proxy;
	}

	// Unified constructor argument processor.
	// Sync path (no URL args): returns void, mutates element directly.
	// Async path (URL args detected): returns Promise<element>.
	//
	// Dispatch per argument:
	//   Array           → dynamic identity
	//   '<:tag>'        → element specifier — skip (already resolved)
	//   '\..'           → escaped text node
	//   '.cls' / '#id'  → identity → setAttribute
	//   '@verb sel'     → placement → deferred
	//   '<html>'        → HTML string → fragment
	//   '/url' 'http..' → async URL → <async> placeholder
	//   { }             → attribute object
	//   string          → text node
	//   branded fn      → child factory
	//   Node            → child element

	function _processArgs(element, args, isAsync) {
		let placementVerb = null, placementSelector = null;
		const asyncSlots  = [];

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			if (isElementSpecifier(arg)) continue;

			if (Array.isArray(arg)) {
				const tokens = arg.filter(Boolean).join('');
				if (/^[#.]/.test(tokens)) {
					const attrs = parseSelectorString(tokens);
					for (const [k, v] of Object.entries(attrs)) element[sA](k, v);
				}
				continue;
			}

			if (typeof arg === S) {
				const t = arg.trim();
				if (!t) continue;
				if (t[0] === '\\') { element[aC](document.createTextNode(t.slice(1))); continue; }
				if (t[0] === '.' || t[0] === '#') { const a = parseSelectorString(t); for (const [k,v] of Object.entries(a)) element[sA](k,v); continue; }
				if (t[0] === '@') { const p = parseAtString(t); if (p) { placementVerb = p.verb; placementSelector = p.selector; } continue; }
				if (isAsync && isURL(t)) {
					const asyncEl = document.createElement('async');
					asyncEl[sA]('src', t); asyncEl[sA]('inert', '');
					asyncEl.style.pointerEvents = 'none';
					asyncEl[PENDING_ARGS] = args.filter((a,j) => j !== i && typeof a === S && !isURL(a) && a[0] !== '.' && a[0] !== '#' && a[0] !== '@');
					element[aC](asyncEl);
					asyncSlots.push({ url: t, pendingEl: asyncEl });
					continue;
				}
				if (isHTMLString(t)) { const tmpl = document.createElement('template'); tmpl.innerHTML = t; element[aC](tmpl.content[cN](true)); continue; }
				element[aC](document.createTextNode(t));
				continue;
			}

			if (arg && typeof arg === O && !(arg instanceof Node) && !arg[INSTANCE_FACTORY]) {
				for (const [k, v] of Object.entries(arg)) {
					if (v !== null && v !== undefined && v !== false) element[sA](k, v === true ? '' : String(v));
				}
				continue;
			}

			if (typeof arg === FN && arg[INSTANCE_FACTORY]) { element[aC](arg()); continue; }
			if (arg instanceof Node) { element[aC](arg); continue; }
		}

		const _finalizePlacement = () => {
			if (placementVerb) {
				const ctx = applyPlacement(placementVerb, placementSelector, element);
				element[PLACEMENT] = { verb: placementVerb, ctx };
			}
		};

		if (!isAsync || !asyncSlots.length) {
			_finalizePlacement();
			return;
		}

		// Async path — fetch all URLs in parallel, then place
		return Promise.all(asyncSlots.map(async ({ url, pendingEl }) => {
			const nodes = await _fetchAndPopulate(element, url, pendingEl);
			if (nodes) {
				pendingEl.replaceWith(...nodes);
			} else if (pendingEl.parentNode) {
				pendingEl.replaceWith(...(pendingEl.childNodes.length ? [pendingEl] : []));
				if (pendingEl.parentNode) pendingEl.remove();
			}
		})).then(() => { _finalizePlacement(); return element; });
	}

	// Compat aliases used by makePendingProxy
	const _processConstructorArgsSync = (el, args) => _processArgs(el, args, false);
	const _processConstructorArgs     = (el, args, Klass) => _processArgs(el, args, true);

	// Parses leading colons from an event/transition name.
	// Returns { metaDepth, shadowDepth, coreName }.
	//
	// Examples:
	//   'click'      → { metaDepth: 0, shadowDepth: 0, coreName: 'click' }
	//   ':click'     → { metaDepth: 1, shadowDepth: 0, coreName: 'click' }
	//   '::click'    → { metaDepth: 0, shadowDepth: 2, coreName: 'click' }
	//   ':::click'   → { metaDepth: 1, shadowDepth: 2, coreName: 'click' }
	//   ':enter'     → { metaDepth: 1, shadowDepth: 0, coreName: 'enter' }
	//   '::enter'    → { metaDepth: 0, shadowDepth: 2, coreName: 'enter' }
	//   ':::enter'   → { metaDepth: 1, shadowDepth: 2, coreName: 'enter' }
	//
	// Rule: metaDepth = leading single colons (before any ::)
	//       shadowDepth = 2 if '::' present after meta colons, else 0

	function _parseEventDepth(event) {
		const str = String(event);
		let i = 0;

		// Count leading single colons that are NOT part of '::'
		let metaDepth = 0;
		while (str[i] === ':' && str[i + 1] !== ':') { metaDepth++; i++; }

		// Check for '::' shadow prefix
		let shadowDepth = 0;
		if (str[i] === ':' && str[i + 1] === ':') { shadowDepth = 2; i += 2; }

		return { metaDepth, shadowDepth, coreName: str.slice(i) };
	}

	// Reserved keys in static shadow object. Everything else = part declaration.

	const SHADOW_CONFIG_KEYS = new Set(['mode', 'styles', 'dom', 'events', 'slots', 'transitions']);

	// Parses static shadow = true | { ...config, ...parts }
	// Returns null if shadow is falsy.
	// Config keys: mode, styles, dom, events, slots
	// Everything else: part name → CSS selector

	function parseShadowStatic(shadow) {
		if (!shadow) return null;
		if (shadow === true) return {
			mode: 'open', styles: true, dom: true, events: true, slots: true,
			transitions: {}, parts: {}
		};
		const config = { mode: 'open', styles: true, dom: true, events: true, slots: true, transitions: {} };
		const parts  = {};
		for (const [key, val] of Object.entries(shadow)) {
			if (SHADOW_CONFIG_KEYS.has(key)) config[key] = val;
			else parts[key] = val;
		}
		return { ...config, parts };
	}

	// Walks prototype chain from Klass up to (not including) Instance.
	// Returns array of classes, base first, subclass last.

	function _collectChain(Klass) {
		const chain = [];
		let proto = Klass;
		while (proto && proto !== Instance && proto !== Function.prototype) {
			chain.unshift(proto);
			proto = getPrototypeOf(proto);
		}
		return chain;
	}

	// Single chain walk — collects styles + theme vars, injects both.

	function _injectShadowAssets(el, root, Klass) {
		const chain = _collectChain(Klass);
		const sheets = [];
		const vars   = {};
		chain.forEach(K => {
			if (owns('styles', K) && K.styles) sheets.push(K.styles);
			if (owns('theme',  K) && K.theme)  Object.entries(K.theme).forEach(([k, s]) => { vars[k] = s.default ?? ''; });
		});
		if (Object.keys(vars).length) {
			const s = document.createElement('style');
			s.textContent = `:host {\n${Object.entries(vars).map(([k,v]) => `    ${k}: ${v};`).join('\n')}\n}`;
			root[iB](s, root.firstChild);
		}
		if (sheets.length) {
			const s = document.createElement('style');
			s.textContent = sheets.join('\n');
			root[iB](s, root.firstChild);
		}
	}

	// Compat aliases
	const _injectShadowStyles   = (el, root, Klass) => _injectShadowAssets(el, root, Klass);
	const _injectThemeDefaults  = (el, root, Klass) => _injectShadowAssets(el, root, Klass);

	// Applies part="name" to elements matching selectors inside the shadow root.
	// Additive — preserves existing part values from static template.

	function _applyParts(root, parts) {
		for (const [partName, selector] of Object.entries(parts)) {
			const el = root.querySelector(selector);
			if (!el) { if (Instance.debug) console.warn(`[Instance] shadow part '${partName}': no match for '${selector}'`); continue; }
			const existing = el.getAttribute('part');
			el.setAttribute('part', existing ? `${existing} ${partName}` : partName);
		}
	}

	// Walks prototype chain collecting static events declarations.
	// Subclass events merged over base. Returns flat merged object.

	function parseEventsStatic(Klass) {
		const merged = {};
		_collectChain(Klass).forEach(K => {
			if (!owns('events', K) || !K.events) return;
			for (const [name, spec] of Object.entries(K.events)) {
				merged[name] = { ...merged[name], ...spec };
			}
		});
		return merged;
	}

	// Dev-only detail shape validation against static events declaration.

	function _validateDetail(eventName, detail, schema) {
		if (!Instance.debug) return;
		for (const [key, typeStr] of Object.entries(schema)) {
			const optional = String(typeStr).endsWith('?');
			const baseType = optional ? typeStr.slice(0, -1) : typeStr;
			const val      = detail?.[key];
			if (!optional && (val === undefined || val === null)) {
				console.warn(`[Instance] event '${eventName}': missing required detail.${key} (${baseType})`);
			} else if (val !== undefined && val !== null && typeof val !== baseType) {
				console.warn(`[Instance] event '${eventName}': detail.${key} should be ${baseType}, got ${typeof val}`);
			}
		}
	}

	// Replaces trigger() on shadow components.
	// Ensures composed: true — never forgotten again.
	// Validates detail shape in development.

	function makeShadowTrigger(el, events) {
		return function shadowTrigger(name, detail) {
			const spec     = events[name] ?? {};
			const composed = spec.composed  ?? true;
			const bubbles  = spec.bubbles   ?? true;
			const cancelable = spec.cancelable ?? false;

			if (Instance.debug && spec.detail) _validateDetail(name, detail, spec.detail);

			const evt = new CustomEvent(name, { bubbles, composed, cancelable, detail: detail ?? {} });
			el.dispatchEvent(evt);
			return el;
		};
	}

	// For each event with receive: true — wire a host element listener.
	// Routes to ['::eventname'](context), ['::*'](context), ['@shadow'](context).
	// Uses private _fireLifecycleKey path — NOT this.on() — so raw DOM events
	// cannot accidentally trigger contract handlers.

	function wireInboundEvents(el, events) {
		// inboundHandlers via el[INBOUND_HANDLERS]

		for (const [name, spec] of Object.entries(events)) {
			if (!spec.receive) continue;

			const handler = (e) => {
				if (Instance.debug && spec.detail) _validateDetail(name, e.detail, spec.detail);

				const context = {
					detail: e.detail ?? {},
					event:  name,
					source: e.target,
					originalEvent: e,
				};

				// Specific handler: ['::select']
				Instance._fireLifecycleKey(el, '::' + name, context);

				// Canonical catch-all: ['::*']
				Instance._fireLifecycleKey(el, '::*',     { ...context, event: name });

				// Alias catch-all: ['@shadow']
				Instance._fireLifecycleKey(el, '@shadow', { ...context, event: name });
			};

			el.addEventListener(name, handler);
			el[INBOUND_HANDLERS].set(name, handler);
		}
	}

	function cleanupInboundEvents(el) {
		const handlers = el[INBOUND_HANDLERS];
		if (!handlers) return;
		handlers.forEach((handler, name) => el.removeEventListener(name, handler));
		handlers.clear();
	}

	// Registers an Instance class as a real browser Custom Element.
	// The element IS an Instance component — full lifecycle, registry, reactivity.
	// Custom Element is the external face. Instance is the internal engine.

	// ── _mountElement ─────────────────────────────────────────────────────────
	// Shared mount logic for both #mount (Instance constructor) and
	// InstanceCE.connectedCallback (Custom Element registration).

	function _mountElement(el, Klass) {
		Symlink._stamp(el, Klass);
		Object.setPrototypeOf(el, Klass.prototype);

		const shadowConfig = parseShadowStatic(Klass.shadow);
		if (shadowConfig) {
			const root = el.attachShadow({ mode: shadowConfig.mode });
			el[SHADOW_ROOT] = root;
			_injectShadowAssets(el, root, Klass);
			if (Klass.template) {
				const tmpl = document.createElement('template');
				tmpl.innerHTML = Klass.template;
				root[aC](tmpl.content[cN](true));
			}
			if (Object.keys(shadowConfig.parts).length) _applyParts(root, shadowConfig.parts);
		}

		const events = parseEventsStatic(Klass);
		if (Object.keys(events).length) {
			wireInboundEvents(el, events);
			if (shadowConfig) OBJECT_DEFINE(el, 'trigger', CONF_W(makeShadowTrigger(el, events)));
		}

		return shadowConfig;
	}

	function registerCustomElement(Klass, tag) {
		if (customElements.get(tag)) return;

		class InstanceCE extends HTMLElement {
			connectedCallback() {
				if (this[METADATA]) return;
				_mountElement(this, Klass);
				registryAdd(this);
				Instance._fireLifecycleKey(this, '@insertion', null);
				if (!this[MOUNTED]) {
					this[MOUNTED] = T;
					Instance._fireLifecycleKey(this, '@mount', null);
				}
			}
			disconnectedCallback() {
				Instance._fireLifecycleKey(this, '@removal', this.parentElement ?? null);
				if (!document.contains(this)) {
					Instance._fireLifecycleKey(this, '@unmount', null);
					cleanupInboundEvents(this);
					registryRemove(this);
				}
			}
			attributeChangedCallback(name, oldValue, newValue) {
				Instance._fireLifecycleKey(this, '@attributechanged', { name, oldValue, newValue });
			}
			static get observedAttributes() { return Klass.observedAttributes ?? []; }
		}

		try { customElements.define(tag, InstanceCE); }
		catch(e) { if (Instance.debug) console.warn(`[Instance] customElements.define('${tag}') failed:`, e.message); }
	}

// ── ReactiveInterface ─────────────────────────────────────────────────────────
// Reactive primitives as prototype methods, scoped to 'this' by default.
// Spliced onto Instance.prototype and Instance (static) by _spliceInterface().
// ─────────────────────────────────────────────────────────────────────────────

const _effectStack    = [];
let   _batchDepth     = 0;
const _pendingEffects = new Set();
const _evaluating     = new WeakSet();

function _makeEffectNode(fn, owner) {
	return { fn, deps: new Set(), disposed: false, running: false, owner: owner ?? null };
}
function _cleanup(node)  { node.deps.forEach(s => s.delete(node)); node.deps.clear(); }
function _track(subs)    { const c = _effectStack[_effectStack.length - 1]; if (!c) return; subs.add(c); c.deps.add(subs); }
function _trigger(subs)  { [...subs].forEach(n => { if (n.disposed) return; _batchDepth > 0 ? _pendingEffects.add(n) : _runNode(n); }); }

function _runNode(node) {
	if (node.disposed || node.running) return;
	node.running = true;
	_cleanup(node); _effectStack.push(node);
	let result;
	try { result = node.fn(); }
	catch(e) { _effectStack.pop(); node.running = false; console.warn('[Instance] effect error:', e); return; }
	if (result?.then) { _effectStack.pop(); node.running = false; _makeReactiveAsync(result, node).catch(e => console.warn('[Instance] async effect error:', e)); }
	else { _effectStack.pop(); node.running = false; }
}

function _makeReactiveAsync(promise, node) {
	return new Proxy(promise, {
		get(target, prop) {
			if (prop === 'then' || prop === 'catch' || prop === 'finally') {
				return function(onFulfilled, onRejected) {
					const wrap = (cb) => {
						if (typeof cb !== FN) return cb;
						return function(...args) {
							if (node.disposed) return cb(...args);
							_effectStack.push(node);
							try { return cb(...args); } finally { _effectStack.pop(); }
						};
					};
					return _makeReactiveAsync(target[prop](wrap(onFulfilled), wrap(onRejected)), node);
				};
			}
			const val = target[prop];
			return typeof val === FN ? val.bind(target) : val;
		}
	});
}

function _disposeEffects(el) {
	const effects = el[SCOPED_EFFECTS];
	if (effects) { effects.forEach(d => d()); effects.clear(); }
}

function _registerDisposable(owner, dispose) {
	if (owner?.[METADATA]) {
		owner[SCOPED_EFFECTS].add(dispose);
	}
}

class ReactiveInterface {

	signal(initialValue) {
		let value = initialValue;
		const subs = new Set();
		return Object.freeze({
			get()      { _track(subs); return value; },
			set(v)     { if (v === value) return; value = v; _trigger(subs); },
			peek()     { return value; },
			toString() { return String(value); },
			_subscribers: subs
		});
	}

	computed(fn) {
		let cached, dirty = true;
		const subs = new Set();
		const node = _makeEffectNode(() => { dirty = true; _trigger(subs); }, this);
		const self = {};
		return Object.freeze(Object.assign(self, {
			get() {
				if (_evaluating.has(self)) { console.warn('[Instance] circular computed dependency'); return cached; }
				_track(subs);
				if (dirty) {
					_evaluating.add(self); _cleanup(node); _effectStack.push(node);
					try { cached = fn(); dirty = false; }
					catch(e) { console.warn('[Instance] computed error:', e); }
					finally { _effectStack.pop(); _evaluating.delete(self); }
				}
				return cached;
			},
			peek()     { return dirty ? self.get() : cached; },
			toString() { return String(self.get()); },
			_subscribers: subs
		}));
	}

	effect(fn) {
		const node    = _makeEffectNode(fn, this);
		_runNode(node);
		const dispose = () => { node.disposed = true; _cleanup(node); };
		_registerDisposable(this, dispose);
		return dispose;
	}

	watch(source, fn) {
		const getter   = typeof source === FN ? source : () => source.get();
		let   oldValue = this.untrack(getter);
		const node     = _makeEffectNode(() => {
			const newValue = getter();
			if (newValue !== oldValue) { const prev = oldValue; oldValue = newValue; this.untrack(() => fn(newValue, prev)); }
		}, this);
		_runNode(node);
		const dispose = () => { node.disposed = true; _cleanup(node); };
		_registerDisposable(this, dispose);
		return dispose;
	}

	batch(fn) {
		_batchDepth++;
		try { fn(); }
		catch(e) { console.warn('[Instance] batch error:', e); }
		finally {
			if (--_batchDepth === 0) {
				const toRun = [..._pendingEffects]; _pendingEffects.clear();
				toRun.forEach(n => { if (!n.disposed) _runNode(n); });
			}
		}
	}

	untrack(fn) { _effectStack.push(null); try { return fn(); } finally { _effectStack.pop(); } }

	readonly(source) {
		return Object.freeze({ get() { return source.get(); }, peek() { return source.peek(); }, toString() { return source.toString(); }, _subscribers: source._subscribers });
	}

	resource(asyncFn) {
		const data = this.signal(undefined), loading = this.signal(false), error = this.signal(null);
		this.effect(async () => {
			loading.set(true); error.set(null);
			try { data.set(await asyncFn()); } catch(e) { error.set(e); } finally { loading.set(false); }
		});
		return Object.freeze({ data, loading, error });
	}

	store(obj) {
		const signalMap  = new WeakMap();
		const getSignals = t      => { if (!signalMap.has(t)) signalMap.set(t, new Map()); return signalMap.get(t); };
		const getSignal  = (t, k) => { const s = getSignals(t); if (!s.has(k)) s.set(k, this.signal(t[k])); return s.get(k); };
		const MUTATORS   = new Set(['push','pop','shift','unshift','splice','sort','reverse','fill','copyWithin']);
		const makeProxy  = target => {
			if (typeof target !== O || target === null || target.__isStoreProxy) return target;
			return new Proxy(target, {
				get(t, k) {
					if (k === '__isStoreProxy') return true;
					if (Array.isArray(t) && MUTATORS.has(k)) return function(...args) { const r = t[k](...args); getSignal(t,'length').set(t.length); _trigger(getSignal(t,k)._subscribers); return r; };
					const val = getSignal(t, k).get();
					return (typeof val === O && val !== null) ? makeProxy(val) : val;
				},
				set(t, k, v)         { t[k] = v; getSignal(t, k).set(v); if (Array.isArray(t)) getSignal(t,'length').set(t.length); return true; },
				deleteProperty(t, k) { delete t[k]; getSignal(t, k).set(undefined); return true; }
			});
		};
		return makeProxy(obj);
	}

	html(strings, ...values) {
		const template = document.createElement('template');
		const PH = '<!--__INSTANCE_BINDING__-->';
		template.innerHTML = strings.reduce((a, s, i) => a + s + (i < values.length ? PH : ''), '');
		const frag = template.content[cN](true);
		const walker = document.createTreeWalker(frag, NodeFilter.SHOW_COMMENT, { acceptNode: n => n.nodeValue === '__INSTANCE_BINDING__' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
		const placeholders = []; let node;
		while ((node = walker.nextNode())) placeholders.push(node);
		placeholders.forEach((comment, i) => {
			const v = values[i];
			if (v?.get)                    { const t = document.createTextNode(String(v.get())); this.effect(() => { t.data = String(v.get()); }); comment.replaceWith(t); }
			else if (v instanceof Node || v instanceof DocumentFragment) { comment.replaceWith(v); }
			else if (typeof v === FN)       { const r = v(); comment.replaceWith(r instanceof Node ? r : document.createTextNode(String(r ?? ''))); }
			else                           { comment.replaceWith(document.createTextNode(String(v ?? ''))); }
		});
		return frag;
	}

	_scopedEffect(el, fn) {
		const node    = _makeEffectNode(fn.bind(el), el);
		_runNode(node);
		const dispose = () => { node.disposed = true; _cleanup(node); };
		_registerDisposable(el, dispose);
		return dispose;
	}

	_walkTree(node, fn) {
		if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
		if (node[METADATA]) fn(node);
		node.childNodes?.forEach(child => this._walkTree(child, fn));
	}

	_fireLifecycle(el, name, detail) {
		el[LIFECYCLE_HANDLERS]?.get(name)?.forEach(fn => {
			try { fn.call(el, detail ?? el); } catch(e) { console.warn(`[Instance] :${name} handler error:`, e); }
		});
	}

	_fireLC(el, key, context, captureReturn) {
		if (!el[METADATA]) return undefined;
		const method = el[key];
		let result;
		if (typeof method === FN && method !== Instance.prototype[key]) {
			try { result = method.call(el, context); } catch(e) { console.warn(`[Instance] ${key}() error:`, e); }
		}
		const name = key.startsWith('::') ? key.slice(2) : key.slice(1);
		el[LIFECYCLE_HANDLERS]?.get(name)?.forEach(fn => {
			try { const r = fn.call(el, context ?? el); if (captureReturn && r?.then && !result?.then) result = r; }
			catch(e) { console.warn(`[Instance] ${key} handler error:`, e); }
		});
		return captureReturn ? result : undefined;
	}

	_fireLifecycleKey(el, key, ctx)           { return this._fireLC(el, key, ctx, false); }
	_fireLifecycleKeyWithReturn(el, key, ctx) { return this._fireLC(el, key, ctx, true);  }

	_watchAttributes(el, filter) {
		if (!this._attrObserver) {
			this._attrObserver = new MutationObserver(mutations => {
				mutations.forEach(m => {
					if (m.type !== 'attributes' || !m.target[METADATA]) return;
					const target = m.target;
					const detail = { name: m.attributeName, oldValue: m.oldValue, newValue: target[gA](m.attributeName) };
					const method = target['@attributechanged'];
					if (typeof method === FN && method !== Instance.prototype['@attributechanged']) {
						try { method.call(target, detail); } catch(e) { console.warn('[Instance] @attributechanged error:', e); }
					}
					target[LIFECYCLE_HANDLERS]?.get('attributechanged')?.forEach(fn => {
						try { fn.call(target, detail, target); } catch(e) { console.warn('[Instance] :attributechanged error:', e); }
					});
				});
			});
		}
		this._attrObserver.observe(el, { attributes: true, attributeOldValue: true, attributeFilter: Array.isArray(filter) ? filter : undefined });
	}

	_ensureObserver() {
		if (this._observer) return;
		this._observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				mutation.addedNodes.forEach(node => {
					this._walkTree(node, el => {
						const isFirstMount = !el[MOUNTED];
						registryAdd(el);
						this._fireLifecycleKey(el, '@insertion', el[PLACEMENT]?.ctx ?? null);
						if (isFirstMount) { el[MOUNTED] = T; this._fireLifecycleKey(el, '@mount', el[PLACEMENT]?.ctx ?? null); }
						const _pl = el[PLACEMENT]; if (_pl) { this._fireLifecycleKey(el, '@' + _pl.verb, _pl.ctx ?? null); el[PLACEMENT] = null; }
						requestAnimationFrame(() => { if (document.contains(el)) this._fireLifecycleKey(el, '@rendered', null); });
						this._fireLifecycle(el, 'insertion');
					});
				});
				mutation.removedNodes.forEach(node => {
					this._walkTree(node, el => {
						const context = el.parentElement ?? null;
						el[LAST_PARENT] = el.parentElement; el[LAST_SIBLING] = el.nextSibling;
						this._fireLifecycleKey(el, '@removal', context);
						if (!document.contains(el)) {
							const result = this._fireLifecycleKeyWithReturn(el, '@unmount', null);
							if (result?.then) {
								const parent = el[LAST_PARENT], sibling = el[LAST_SIBLING];
								if (parent && document.contains(parent)) parent[iB](el, sibling ?? null);
								result.then(() => {
									if (el.parentNode) el.parentNode[rC](el);
									cleanupInboundEvents(el); registryRemove(el); _disposeEffects(el); Symlink._fullCleanup(el);
								}).catch(e => { console.warn('[Instance] @unmount transition error:', e); if (el.parentNode) el.parentNode[rC](el); registryRemove(el); });
							} else {
								cleanupInboundEvents(el); registryRemove(el); _disposeEffects(el); Symlink._fullCleanup(el);
							}
						}
						this._fireLifecycle(el, 'removal');
					});
				});
			});
		});
		this._observer.observe(document.body, { childList: true, subtree: true });
	}

	inherit(key, source) {
		void this.$;
		const store = this[REACTIVE_STORE];
		let sig;
		if (source?.get)                                                       { sig = source; }
		else if (source === Instance)                                          { sig = { get: () => Instance.$[key], set: v => { Instance.$[key] = v; }, peek: () => this.untrack(() => Instance.$[key]), _subscribers: null }; }
		else if (typeof source === FN && source.prototype instanceof Instance)  { void source.$; const cs = source[CLASS_REACTIVE_STORE]; if (!cs.has(key)) cs.set(key, this.signal(undefined)); sig = cs.get(key); }
		else if (source?.[REACTIVE_STORE])                                     { void source.$; const es = source[REACTIVE_STORE]; if (!es.has(key)) es.set(key, this.signal(undefined)); sig = es.get(key); }
		else { throw new Error('[Instance] inherit() — unrecognised source'); }
		store.set(key, sig);
		return this;
	}

}

ReactiveInterface.prototype._observer     = null;
ReactiveInterface.prototype._attrObserver = null;

// ── _spliceInterface ──────────────────────────────────────────────────────────
// Splices all prototype methods from an Interface class onto a target class.
// Prototype methods → target.prototype
// Static methods    → target itself (skipped if skipStatic = true)
// Never overwrites existing properties — Instance's own definitions take priority.

function _spliceInterface(target, Interface, skipStatic) {
	const proto = Interface.prototype;
	const names = Object.getOwnPropertyNames(proto).filter(k => k !== 'constructor');

	// Prototype methods → target.prototype (so instances get them)
	names.forEach(k => {
		if (!owns(k, target.prototype)) {
			define(target.prototype, k, Object.getOwnPropertyDescriptor(proto, k));
		}
	});

	// Prototype methods → target itself (so Instance.signal() works as static call)
	// 'this' inside each method will be Instance when called statically,
	// or the element when called on an instance — correct either way.
	if (!skipStatic) {
		names.forEach(k => {
			if (!owns(k, target)) {
				define(target, k, Object.getOwnPropertyDescriptor(proto, k));
			}
		});
	}
}

// Splice ReactiveInterface immediately — Instance.prototype.signal etc
// must exist before blocks run and before DOMContentLoaded fires.
_spliceInterface(Instance, ReactiveInterface);

// 0.73.c — Instance.router / Instance.route
//
// Three surfaces:
//   Instance.router          — configuration, navigation, guards, events
//   Instance.route           — reactive current state (signals)
//   element.route({}, opts)  — register routes on a component
//
// Lifecycle hooks on outlet elements:
//   ['@routeleave'](context)   fires before current view leaves
//   ['@routeenter'](context)   fires after new view enters and mounts
//   ['@navigate'](context)     fires on every navigation including first
//
// Declarative zero-JS routing:
//   <nav data-router>          intercepts child <a> clicks
//   <div data-outlet></div>    default render target
//
// URL as reactive state:
//   Instance.route.path              signal → current pathname
//   Instance.route.params.id         signal → ':id' param value
//   Instance.route.query.page        signal → '?page=3'
//   Instance.route.hash              signal → '#section'
//   Instance.route.query.set(k, v)   write → URL updates → signals update
//   Instance.route.query.batch({})   write multiple → one history entry

{
// installRouter

	const _config = {
		history:  'push',     // 'push' | 'hash' | 'memory'
		outlet:   '[data-outlet]',
		base:     '',
		scroll:   true,
	};

	// Registered route tables: Map<outletElement, Array<{pattern, keys, source, options}>>
	const _tables  = new Map();

	// Global before-guards: Array<fn(from, to, next)>
	const _guards  = [];

	// Navigation event listeners
	const _listeners = { navigate: new Set(), error: new Set() };

	// Current navigation context (plain object, not reactive — signals are Instance.route.*)
	let _current = { path: '', params: {}, query: {}, hash: '' };

	// Instance.route.path, .hash are plain signals.
	// Instance.route.params and .query are Proxy objects that lazily create
	// signals per-key on first access, then reuse them.

	const _pathSignal = Instance.signal('');
	const _hashSignal = Instance.signal('');

	const _makeSignalMap = (initial = {}) => {
		const store = new Map();
		const _get  = key => {
			if (!store.has(key)) store.set(key, Instance.signal(initial[key] ?? null));
			return store.get(key);
		};
		// Proxy exposes signals directly: Instance.route.params.id → signal
		// .set(key, val) updates the signal value and the URL
		const proxy = new Proxy({}, {
			get(_, key) {
				if (key === 'set')   return (k, v) => _routeSignalWrite('param', k, v);
				if (key === 'batch') return (obj)  => _routeSignalBatch('param', obj);
				if (key === '_store') return store;
				return _get(key);
			}
		});
		return { proxy, store, _get };
	};

	const _params = _makeSignalMap();
	const _query  = _makeSignalMap();

	// Override query proxy to write to URL query string
	const _queryProxy = new Proxy({}, {
		get(_, key) {
			if (key === 'set')    return (k, v)  => _routeQueryWrite(k, v);
			if (key === 'batch')  return (obj)    => _routeQueryBatch(obj);
			if (key === '_store') return _query.store;
			return _query._get(key);
		}
	});

	const _paramsProxy = new Proxy({}, {
		get(_, key) {
			if (key === 'set')    return (k, v) => _routeParamWrite(k, v);
			if (key === '_store') return _params.store;
			return _params._get(key);
		}
	});

	const route = Object.freeze({
		get path()   { return _pathSignal; },
		get hash()   { return _hashSignal; },
		get params() { return _paramsProxy; },
		get query()  { return _queryProxy; },
		get full()   { return Instance.computed(() => {
			const p = _pathSignal.get();
			const q = [..._query.store.entries()].map(([k, s]) => `${k}=${s.get() ?? ''}`).join('&');
			const h = _hashSignal.get();
			return p + (q ? '?' + q : '') + (h ? '#' + h : '');
		}); }
	});

	function _parseURL(href) {
		const url      = new URL(href, location.origin);
		const base     = _config.base;
		const path     = base ? url.pathname.replace(new RegExp('^' + base), '') || '/' : url.pathname;
		const query    = Object.fromEntries(url.searchParams.entries());
		const hash     = url.hash.slice(1);
		return { path, query, hash, full: url.pathname + url.search + url.hash };
	}

	function _currentURL() {
		if (_config.history === 'hash') {
			const hash = location.hash.slice(1) || '/';
			return _parseURL(location.origin + hash);
		}
		return _parseURL(location.href);
	}

	// '/product/:id/review/:num' → { regex, keys: ['id', 'num'] }

	function _compile(pattern) {
		const keys   = [];
		const source = pattern
			.replace(/[.*+?^${}()|[\]\\]/g, (c) => c === '*' ? '(.*)' : '\\' + c)
			.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => { keys.push(key); return '([^/]+)'; });
		return { regex: new RegExp('^' + source + '\\/?$'), keys };
	}

	function _match(compiled, path) {
		const m = path.match(compiled.regex);
		if (!m) return null;
		const params = {};
		compiled.keys.forEach((key, i) => { params[key] = decodeURIComponent(m[i + 1]); });
		return params;
	}

	function _syncSignals(parsed, params) {
		Instance.batch(() => {
			_pathSignal.set(parsed.path);
			_hashSignal.set(parsed.hash);

			// Params — update existing signals, null out removed ones
			const activeKeys = new Set(Object.keys(params));
			_params.store.forEach((sig, key) => { if (!activeKeys.has(key)) sig.set(null); });
			activeKeys.forEach(key => _params._get(key).set(params[key]));

			// Query — update existing signals, null out removed ones
			const queryKeys = new Set(Object.keys(parsed.query));
			_query.store.forEach((sig, key) => { if (!queryKeys.has(key)) sig.set(null); });
			queryKeys.forEach(key => _query._get(key).set(parsed.query[key]));
		});
	}

	function _routeQueryWrite(key, value, replace = false) {
		const url = new URL(location.href);
		if (value === null || value === undefined || value === '') {
			url.searchParams.delete(key);
		} else {
			url.searchParams.set(key, String(value));
		}
		_push(url.pathname + url.search + url.hash, replace);
	}

	function _routeQueryBatch(obj, replace = false) {
		const url = new URL(location.href);
		for (const [key, value] of Object.entries(obj)) {
			if (value === null || value === undefined || value === '') {
				url.searchParams.delete(key);
			} else {
				url.searchParams.set(key, String(value));
			}
		}
		_push(url.pathname + url.search + url.hash, replace);
	}

	function _routeParamWrite(key, value) {
		// Reconstruct path with new param value
		const path = _pathSignal.peek();
		// Find which registered route matches current path and rebuild
		for (const [, table] of _tables) {
			for (const entry of table) {
				const params = _match(entry.compiled, path);
				if (params) {
					const newParams = { ...params, [key]: value };
					let newPath = entry.pattern;
					for (const [k, v] of Object.entries(newParams)) {
						newPath = newPath.replace(':' + k, encodeURIComponent(v));
					}
					_push(newPath);
					return;
				}
			}
		}
	}

	function _routeSignalBatch() {} // alias — unused directly

	function _push(path, replace = false) {
		const full = _config.base + path;
		if (_config.history === 'hash') {
			if (replace) location.replace('#' + path);
			else         location.hash = path;
		} else if (_config.history === 'memory') {
			_navigate(path);
		} else {
			if (replace) history.replaceState({}, '', full);
			else         history.pushState({},    '', full);
			_navigate(path);
		}
	}

	function _navigate(pathOrFull, fromPopstate = false) {
		const parsed = _config.history === 'hash'
			? _parseURL(location.origin + (location.hash.slice(1) || '/'))
			: _parseURL(location.origin + pathOrFull);

		const from = { ..._current };
		const to   = { path: parsed.path, query: parsed.query, hash: parsed.hash, params: {} };

		// Run guards
		_runGuards(from, to, () => _commit(from, to, parsed, fromPopstate));
	}

	function _runGuards(from, to, proceed) {
		const guards = [..._guards];
		let i = 0;
		function next(redirect) {
			if (redirect && typeof redirect === S) {
				_push(redirect);
			} else if (i < guards.length) {
				guards[i++](from, to, next);
			} else {
				proceed();
			}
		}
		next();
	}

	function _commit(from, to, parsed, fromPopstate) {
		let matched = null, matchParams = {}, matchOutlet = null, matchSource = null;

		for (const [outlet, table] of _tables) {
			for (const entry of table) {
				const params = _match(entry.compiled, parsed.path);
				if (params !== null) {
					matched     = entry;
					matchParams = params;
					matchOutlet = outlet;
					matchSource = typeof entry.source === FN ? entry.source(params, parsed) : entry.source;
					break;
				}
			}
			if (matched) break;
		}

		if (!matched) { _listeners.error.forEach(fn => fn(new Error(`No route matched: ${parsed.path}`))); return; }

		to.params = matchParams;
		_current  = { ...to };
		_syncSignals(parsed, matchParams);

		if (_config.scroll && !fromPopstate) window.scrollTo(0, 0);

		const ctx = { from, to, params: matchParams, query: parsed.query, hash: parsed.hash };

		if (matchOutlet?.[METADATA]) Instance._fireLC(matchOutlet, '@routeleave', ctx, false);

		if (matchOutlet && matchSource) {
			const _after = () => {
				Instance._fireLC(matchOutlet, '@routeenter', { ...ctx, el: matchOutlet }, false);
				Instance._fireLC(matchOutlet, '@navigate',   ctx, false);
				_listeners.navigate.forEach(fn => fn(from, to));
			};
			if (matchSource instanceof Node) {
				matchOutlet.innerHTML = '';
				matchOutlet[aC](matchSource);
				_after();
			} else if (typeof matchSource === S && typeof matchOutlet.load === FN) {
				matchOutlet.load(matchSource).then(_after);
			} else {
				_after();
			}
		} else {
			_listeners.navigate.forEach(fn => fn(from, to));
		}
	}

	// Runs on DOMContentLoaded. Finds data-router / data-outlet elements.
	// Intercepts clicks on <a> tags inside data-router containers.

	function _setupDeclarative() {
		const outlet = document.querySelector('[data-outlet]');
		if (!outlet) return;

		// Intercept clicks globally — check if target is a routable <a>
		document.addEventListener('click', (e) => {
			const anchor = e.target.closest('a[href]');
			if (!anchor) return;

			// Only intercept anchors inside data-router containers OR
			// anchors that match a registered route
			const inRouter = anchor.closest('[data-router]');
			if (!inRouter && !_isRegisteredPath(anchor.pathname)) return;

			const href = anchor.getAttribute('href');
			if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

			e.preventDefault();
			router.navigate(href);
		}, false);
	}

	function _isRegisteredPath(path) {
		for (const [, table] of _tables) {
			for (const entry of table) {
				if (_match(entry.compiled, path) !== null) return true;
			}
		}
		return false;
	}

	const router = Object.freeze({

		configure(opts = {}) {
			Object.assign(_config, opts);
			// Re-resolve outlet selector if provided as string
			return this;
		},

		navigate(path, opts = {}) {
			_push(path, opts.replace ?? false);
			return this;
		},

		back()    { history.back();    return this; },
		forward() { history.forward(); return this; },

		before(fn) {
			_guards.push(fn);
			return this;
		},

		on(event, fn) {
			if (_listeners[event]) _listeners[event].add(fn);
			return this;
		},

		off(event, fn) {
			if (_listeners[event]) _listeners[event].delete(fn);
			return this;
		},

		// Called by element.route({}) to register a route table
		_register(outlet, routeMap, options = {}) {
			const table = [];
			for (const [pattern, source] of Object.entries(routeMap)) {
				const compiled = _compile(pattern);
				table.push({ pattern, compiled, source, options });
			}
			_tables.set(outlet, table);

			// If no routes registered yet, navigate to current URL to trigger initial match
			if (_tables.size === 1) {
				_setupDeclarative();
				window.addEventListener('popstate', () => {
					_navigate(location.pathname + location.search + location.hash, true);
				});
				if (_config.history === 'hash') {
					window.addEventListener('hashchange', () => {
						_navigate(location.hash.slice(1) || '/');
					});
				}
			}

			// Initial navigation — match current URL immediately
			const current = _currentURL();
			_navigate(current.path + (current.hash ? '#' + current.hash : ''));
		},

		// Called when a routing component unmounts — clean up its table
		_unregister(outlet) {
			_tables.delete(outlet);
		},
	});

	// Registers a route map on a component. The component becomes the outlet
	// unless options.outlet specifies another element.

	define(Instance.prototype, 'route', {
		value: function route(routeMap, options = {}) {

			// Resolve outlet — default is this element
			let outlet = this;
			if (options.outlet) {
				outlet = typeof options.outlet === 'string'
					? document.querySelector(options.outlet)
					: options.outlet;
			}

			if (!outlet) {
				console.warn('[Instance.router] outlet not found');
				return this;
			}

			// Register with router
			Instance.router._register(outlet, routeMap, options);

			// Unregister when this component unmounts
			const el = this;
			const origUnmount = el['@unmount'];
			el['@unmount'] = function(context) {
				Instance.router._unregister(outlet);
				if (typeof origUnmount === FN) origUnmount.call(el, context);
			};

			return this;
		},
		configurable: T, enumerable: F, writable: T
	});

	Instance._LIFECYCLE_EVENTS.add('routeleave');
	Instance._LIFECYCLE_EVENTS.add('routeenter');
	Instance._LIFECYCLE_EVENTS.add('navigate');

	if (!Instance.prototype['@routeleave']) {
		define(Instance.prototype, '@routeleave', { value: function(context) {}, configurable: T, enumerable: F, writable: T });
	}
	if (!Instance.prototype['@routeenter']) {
		define(Instance.prototype, '@routeenter', { value: function(context) {}, configurable: T, enumerable: F, writable: T });
	}
	if (!Instance.prototype['@navigate']) {
		define(Instance.prototype, '@navigate',   { value: function(context) {}, configurable: T, enumerable: F, writable: T });
	}

	define(Instance, 'router', CONF(router));
	define(Instance, 'route',  { value: route,  configurable: T, enumerable: F, writable: F });

}

// 0.73.d — this.$.tagname namespaced reactive state
//
// Every HTML element's meaningful native state becomes a reactive signal,
// scoped under its tag name in this.$. Instance writes only to namespaced
// keys. User writes only to flat keys. Zero collision by design.
//
// Namespace objects are lazy — zero cost until first accessed.
// Self-cleaning — observers and listeners removed on @unmount.
//
// Also installs the Form system:
//   class Signup extends Form { ... }
//   ['@submit'](context)    valid submission
//   ['@invalid'](context)   invalid submission attempt
//   ['@change'](context)    field changed
//   ['@valid'](context)     form became valid
//   ['@forminvalid'](context) form became invalid
//   ['@success'](context)   submission succeeded
//   ['@error'](context)     submission failed
//   ['@reset'](context)     form reset

{
// installElementNamespaces

	// Registry: tagName → factory(el) → namespace object
	// Each factory is called once per element on first $.tagname access.
	// Returns a frozen object of signals for that element type.

	const namespaces = new Map();

	// Makes a signal that is kept in sync with a native property/event.
	// cleanup() is called on element @unmount via the ns cleanup registry.

	function _sig(initial) { return Instance.signal(initial); }

	function _observed(el, sig, eventNames, read) {
		const handler = () => sig.set(read(el));
		eventNames.forEach(evt => el.addEventListener(evt, handler, { passive: true }));
		return () => eventNames.forEach(evt => el.removeEventListener(evt, handler));
	}

	// Per-element cleanup registry — keyed by element, value = Set of teardown fns
	const _cleanups = new WeakMap();

	function _addCleanup(el, fn) {
		if (!_cleanups.has(el)) _cleanups.set(el, new Set());
		_cleanups.get(el).add(fn);
	}

	function _runCleanup(el) {
		_cleanups.get(el)?.forEach(fn => fn());
		_cleanups.delete(el);
	}

	// Hook into existing @unmount lifecycle to run cleanups
	const _origEnsureObserver = Instance._ensureObserver;
	define(Instance, '_ensureObserver', {
		value: function _ensureObserver() {
			_origEnsureObserver.call(Instance);
			// Wrap the existing MutationObserver callback to add cleanup on removal
			// We hook via the existing _fireLifecycleKey path — cleanups run after @unmount
		},
		configurable: T, writable: T, enumerable: F
	});

	// Simpler approach: patch _fireLifecycleKey to run ns cleanups on @unmount
	const _origFireKey = Instance._fireLifecycleKey;
	define(Instance, '_fireLifecycleKey', {
		value: function _fireLifecycleKey(el, key, context) {
			_origFireKey.call(Instance, el, key, context);
			if (key === '@unmount') _runCleanup(el);
		},
		configurable: T, writable: T, enumerable: F
	});

	// this.$.form → { loading, valid, dirty, submitted, errors }
	// Drives the full Form lifecycle system.

	namespaces.set('form', function initFormNamespace(el) {

		const loading   = _sig(false);
		const valid     = _sig(el.checkValidity?.() ?? true);
		const dirty     = _sig(false);
		const submitted = _sig(false);
		const errors    = _sig({});

		// Track initial values for dirty detection
		const _initialValues = () => Object.fromEntries(
			[...new FormData(el)].map(([k, v]) => [k, v])
		);
		let _initial = {};

		// Sync valid signal with native validity
		const _syncValid = () => valid.set(el.checkValidity?.() ?? true);

		// Sync dirty signal
		const _syncDirty = () => {
			const current = Object.fromEntries([...new FormData(el)].map(([k,v]) => [k,v]));
			dirty.set(JSON.stringify(current) !== JSON.stringify(_initial));
		};

		// Populate data-error spans for a field
		const _showError = (name, message) => {
			const span = el.querySelector(`[data-error="${name}"]`);
			if (span) span.textContent = message ?? '';
		};

		const _clearErrors = () => {
			errors.set({});
			el.querySelectorAll('[data-error]').forEach(span => { span.textContent = ''; });
			el.querySelectorAll('.instance-field--invalid').forEach(f => {
				f.classList.remove('instance-field--invalid');
				f.classList.add('instance-field--valid');
			});
		};

		// CSS state classes on the form element
		const _updateFormClasses = () => {
			const v = valid.peek();
			const d = dirty.peek();
			const l = loading.peek();
			const s = submitted.peek();
			el.classList.toggle('instance-form--valid',     v);
			el.classList.toggle('instance-form--invalid',   !v);
			el.classList.toggle('instance-form--dirty',     d);
			el.classList.toggle('instance-form--pristine',  !d);
			el.classList.toggle('instance-form--loading',   l);
			el.classList.toggle('instance-form--submitted', s);
		};

		// Effect: keep CSS classes in sync with signals
		const _disposeClasses = Instance.effect(() => {
			valid.get(); dirty.get(); loading.get(); submitted.get();
			_updateFormClasses();
		});

		const _getFieldRules = () => el[METADATA]?.constructor?.fields ?? {};

		async function _validateField(name, value) {
			const rules = _getFieldRules()[name];
			if (!rules) return null;

			// match: must equal another field's value
			if (rules.match) {
				const other = new FormData(el).get(rules.match);
				if (value !== other) return rules.message ?? `Must match ${rules.match}`;
			}

			// Custom async/sync validator
			if (rules.validate) {
				const result = await rules.validate(value);
				if (typeof result === S) return result;
				if (result === false) return rules.message ?? 'Invalid';
			}

			return null;
		}

		async function _validateAll() {
			const data   = new FormData(el);
			const errs   = {};
			let   native = el.checkValidity?.() ?? true;

			// Native validation messages
			if (!native) {
				[...el.elements].forEach(field => {
					if (!field.name || field.validity?.valid) return;
					const rules     = _getFieldRules()[field.name];
					const msgKey    = Object.keys(field.validity).find(k => k !== 'valid' && field.validity[k]);
					const custom    = rules?.messages?.[msgKey];
					errs[field.name] = custom ?? field.validationMessage;
				});
			}

			// Custom validation
			for (const [name, value] of data.entries()) {
				const err = await _validateField(name, String(value));
				if (err) errs[name] = err;
			}

			return errs;
		}

		// input / change — sync valid + dirty, fire @change lifecycle
		const _onInput = (e) => {
			_syncValid();
			_syncDirty();

			const field = e.target;
			if (!field.name) return;

			// Per-field CSS classes
			const fieldContainer = field.closest('[data-field]') ?? field.parentElement;
			if (fieldContainer) {
				fieldContainer.classList.toggle('instance-field--dirty',   true);
				fieldContainer.classList.toggle('instance-field--valid',   field.validity?.valid ?? true);
				fieldContainer.classList.toggle('instance-field--invalid', !(field.validity?.valid ?? true));
			}

			// Fire @change lifecycle
			const ctx = {
				field,
				name:   field.name,
				value:  field.value,
				valid:  field.validity?.valid ?? true,
				values: Object.fromEntries([...new FormData(el)].map(([k,v]) => [k,v]))
			};
			Instance._fireLifecycleKey(el, '@change', ctx);

			// Fire @valid / @forminvalid if validity changed
			const nowValid = el.checkValidity?.() ?? true;
			if (nowValid !== valid.peek()) {
				valid.set(nowValid);
				Instance._fireLifecycleKey(el, nowValid ? '@valid' : '@forminvalid', ctx);
			}
		};

		// blur — mark field as touched
		const _onBlur = (e) => {
			const field = e.target;
			if (!field.name) return;
			const container = field.closest('[data-field]') ?? field.parentElement;
			container?.classList.add('instance-field--touched');
		};

		// submit
		const _onSubmit = async (e) => {
			e.preventDefault();
			submitted.set(true);

			loading.set(true);
			el.classList.add('instance-form--loading');

			const errs = await _validateAll();
			const hasErrors = Object.keys(errs).length > 0;

			if (hasErrors) {
				loading.set(false);
				el.classList.remove('instance-form--loading');
				errors.set(errs);

				// Populate data-error spans
				Object.entries(errs).forEach(([name, msg]) => _showError(name, msg));

				// Per-field invalid classes
				Object.keys(errs).forEach(name => {
					const field = el.elements[name];
					const container = field?.closest('[data-field]') ?? field?.parentElement;
					container?.classList.add('instance-field--invalid');
					container?.classList.remove('instance-field--valid');
				});

				const ctx = {
					errors: errs,
					fields: el.elements,
					first:  el.querySelector(':invalid') ?? el.elements[Object.keys(errs)[0]]
				};
				Instance._fireLifecycleKey(el, '@invalid', ctx);
				return;
			}

			_clearErrors();

			const values = Object.fromEntries([...new FormData(el)].map(([k,v]) => [k,v]));
			const ctx    = {
				values,
				valid:    true,
				form:     el,
				reset:    () => el.reset()
			};

			// Fire @submit — user handles the actual submission
			Instance._fireLifecycleKey(el, '@submit', ctx);

			loading.set(false);
			el.classList.remove('instance-form--loading');
			el.classList.add('instance-form--success');
		};

		// reset
		const _onReset = () => {
			_clearErrors();
			dirty.set(false);
			submitted.set(false);
			valid.set(el.checkValidity?.() ?? true);
			el.classList.remove('instance-form--success', 'instance-form--error');
			Instance._fireLifecycleKey(el, '@reset', { form: el });
			// Re-capture initial values after reset
			requestAnimationFrame(() => { _initial = _initialValues(); });
		};

		el.addEventListener('input',  _onInput,  { passive: true });
		el.addEventListener('change', _onInput,  { passive: true });
		el.addEventListener('blur',   _onBlur,   { capture: true, passive: true });
		el.addEventListener('submit', _onSubmit);
		el.addEventListener('reset',  _onReset,  { passive: true });

		// Capture initial values once form is in the DOM
		requestAnimationFrame(() => { _initial = _initialValues(); });

		// Cleanup
		_addCleanup(el, () => {
			el.removeEventListener('input',  _onInput);
			el.removeEventListener('change', _onInput);
			el.removeEventListener('blur',   _onBlur,  { capture: true });
			el.removeEventListener('submit', _onSubmit);
			el.removeEventListener('reset',  _onReset);
			_disposeClasses();
		});

		// Exposed on the namespace object AND patched onto the element directly

		const api = Object.freeze({
			// Signals
			loading,
			valid,
			dirty,
			submitted,
			errors,

			// Methods — also available as el.submit(), el.reset() etc via patch below
			validate:   () => _validateAll().then(errs => Object.keys(errs).length === 0),
			values:     () => Object.fromEntries([...new FormData(el)].map(([k,v]) => [k,v])),
			setValue:   (name, value) => { const f = el.elements[name]; if (f) { f.value = value; f.dispatchEvent(new Event('input', { bubbles: true })); } },
			setError:   (name, msg)   => { const errs = { ...errors.peek(), [name]: msg }; errors.set(errs); _showError(name, msg); },
			clearErrors: _clearErrors,
			focus:      (name) => el.elements[name]?.focus(),
		});

		return api;
	});

	// this.$.input → { value, valid, touched, dirty }

	namespaces.set('input', function initInputNamespace(el) {
		const value   = _sig(el.value ?? '');
		const valid   = _sig(el.validity?.valid ?? true);
		const touched = _sig(false);
		const dirty   = _sig(false);
		const _initial = el.value ?? '';

		const _onInput  = () => { value.set(el.value); valid.set(el.validity?.valid ?? true); dirty.set(el.value !== _initial); };
		const _onBlur   = () => touched.set(true);

		const c1 = _observed(el, value,  ['input', 'change'], e => e.value);
		el.addEventListener('blur', _onBlur, { passive: true });
		el.addEventListener('input', _onInput, { passive: true });

		_addCleanup(el, () => { c1(); el.removeEventListener('blur', _onBlur); el.removeEventListener('input', _onInput); });

		return Object.freeze({ value, valid, touched, dirty });
	});

	namespaces.set('textarea', function initTextareaNamespace(el) {
		const value   = _sig(el.value ?? '');
		const valid   = _sig(el.validity?.valid ?? true);
		const touched = _sig(false);
		const dirty   = _sig(false);
		const _initial = el.value ?? '';

		const _onInput = () => { value.set(el.value); valid.set(el.validity?.valid ?? true); dirty.set(el.value !== _initial); };
		const _onBlur  = () => touched.set(true);

		el.addEventListener('input', _onInput, { passive: true });
		el.addEventListener('blur',  _onBlur,  { passive: true });

		_addCleanup(el, () => { el.removeEventListener('input', _onInput); el.removeEventListener('blur', _onBlur); });

		return Object.freeze({ value, valid, touched, dirty });
	});

	namespaces.set('select', function initSelectNamespace(el) {
		const value   = _sig(el.value ?? '');
		const valid   = _sig(el.validity?.valid ?? true);
		const touched = _sig(false);

		const _onChange = () => { value.set(el.value); valid.set(el.validity?.valid ?? true); };
		const _onBlur   = () => touched.set(true);

		el.addEventListener('change', _onChange, { passive: true });
		el.addEventListener('blur',   _onBlur,   { passive: true });

		_addCleanup(el, () => { el.removeEventListener('change', _onChange); el.removeEventListener('blur', _onBlur); });

		return Object.freeze({ value, valid, touched });
	});

	// this.$.a → { active, external }
	// active — true when href matches current route (signal, reactive)
	// external — true when href points outside current origin (computed)

	namespaces.set('a', function initAnchorNamespace(el) {
		const active   = _sig(false);
		const external = Instance.computed(() => {
			const href = el.getAttribute('href') ?? '';
			return href.startsWith('http') || href.startsWith('//');
		});

		// Sync active state with router
		let _disposeRoute = null;
		if (Instance.route) {
			_disposeRoute = Instance.effect(() => {
				const path = Instance.route.path.get();
				const href = el.getAttribute('href') ?? '';
				active.set(href === path || (href !== '/' && path.startsWith(href)));
			});
		}

		_addCleanup(el, () => { _disposeRoute?.(); });

		return Object.freeze({ active, external });
	});

	// this.$.details → { open }

	namespaces.set('details', function initDetailsNamespace(el) {
		const open = _sig(el.open ?? false);

		const _onToggle = () => open.set(el.open);
		el.addEventListener('toggle', _onToggle, { passive: true });
		_addCleanup(el, () => el.removeEventListener('toggle', _onToggle));

		// Make open writable — setting it drives the native element
		return Object.freeze({
			get open() { return open; },
			set open(v) { el.open = v; open.set(v); }
		});
	});

	// this.$.dialog → { open, returnValue }

	namespaces.set('dialog', function initDialogNamespace(el) {
		const open        = _sig(el.open ?? false);
		const returnValue = _sig(el.returnValue ?? '');

		const _onClose = () => { open.set(false); returnValue.set(el.returnValue); };
		el.addEventListener('close', _onClose, { passive: true });
		_addCleanup(el, () => el.removeEventListener('close', _onClose));

		return Object.freeze({
			get open()        { return open; },
			get returnValue() { return returnValue; },
			show()      { el.show();      open.set(true);  return el; },
			showModal() { el.showModal(); open.set(true);  return el; },
			close(val)  { el.close(val); open.set(false); return el; }
		});
	});

	// this.$.video → { playing, paused, muted, progress, duration, volume }
	// this.$.audio → same

	function initMediaNamespace(el) {
		const playing  = _sig(!el.paused);
		const paused   = _sig(el.paused);
		const muted    = _sig(el.muted);
		const duration = _sig(el.duration ?? 0);
		const progress = _sig(el.currentTime ?? 0);
		const volume   = _sig(el.volume ?? 1);
		const ended    = _sig(el.ended ?? false);

		const _c1 = _observed(el, playing,  ['play', 'pause'],       e => !e.paused);
		const _c2 = _observed(el, paused,   ['play', 'pause'],       e => e.paused);
		const _c3 = _observed(el, muted,    ['volumechange'],         e => e.muted);
		const _c4 = _observed(el, volume,   ['volumechange'],         e => e.volume);
		const _c5 = _observed(el, duration, ['durationchange'],       e => e.duration);
		const _c6 = _observed(el, progress, ['timeupdate'],           e => e.currentTime);
		const _c7 = _observed(el, ended,    ['ended'],                () => true);

		_addCleanup(el, () => { _c1(); _c2(); _c3(); _c4(); _c5(); _c6(); _c7(); });

		return Object.freeze({
			playing, paused, muted, duration, progress, volume, ended,
			play()           { return el.play(); },
			pause()          { el.pause(); return el; },
			seek(time)       { el.currentTime = time; return el; },
			setVolume(v)     { el.volume = v; return el; },
			toggleMute()     { el.muted = !el.muted; return el; },
		});
	}

	namespaces.set('video', initMediaNamespace);
	namespaces.set('audio', initMediaNamespace);

	// this.$.button → { disabled, loading }
	// loading — convenience: sets disabled + adds loading class

	namespaces.set('button', function initButtonNamespace(el) {
		const disabled = _sig(el.disabled ?? false);
		const loading  = _sig(false);

		// Keep disabled signal in sync with attribute changes
		const _obs = new MutationObserver(() => disabled.set(el.disabled));
		_obs.observe(el, { attributes: true, attributeFilter: ['disabled'] });

		// loading drives disabled automatically
		const _disposeLoading = Instance.effect(() => {
			const l = loading.get();
			el.disabled = l;
			el.classList.toggle('instance-button--loading', l);
			disabled.set(l);
		});

		_addCleanup(el, () => { _obs.disconnect(); _disposeLoading(); });

		return Object.freeze({
			disabled,
			loading,
			enable()  { el.disabled = false; disabled.set(false); return el; },
			disable() { el.disabled = true;  disabled.set(true);  return el; },
		});
	});

	// this.$.img → { loaded, error, naturalWidth, naturalHeight }

	namespaces.set('img', function initImgNamespace(el) {
		const loaded        = _sig(el.complete && el.naturalWidth > 0);
		const error         = _sig(false);
		const naturalWidth  = _sig(el.naturalWidth  ?? 0);
		const naturalHeight = _sig(el.naturalHeight ?? 0);

		const _onLoad  = () => { loaded.set(true);  error.set(false); naturalWidth.set(el.naturalWidth); naturalHeight.set(el.naturalHeight); };
		const _onError = () => { loaded.set(false); error.set(true); };

		el.addEventListener('load',  _onLoad,  { passive: true });
		el.addEventListener('error', _onError, { passive: true });

		_addCleanup(el, () => { el.removeEventListener('load', _onLoad); el.removeEventListener('error', _onError); });

		return Object.freeze({ loaded, error, naturalWidth, naturalHeight });
	});

	// this.$.scroll → { x, y, atTop, atBottom, atLeft, atRight }
	// Available on any element, not just specific tags.
	// Accessed via this.$.scroll — 'scroll' is not a tag name collision risk.

	namespaces.set('scroll', function initScrollNamespace(el) {
		const target = el === document.body ? window : el;
		const x       = _sig(el.scrollLeft ?? 0);
		const y       = _sig(el.scrollTop  ?? 0);
		const atTop   = _sig(true);
		const atBottom = _sig(false);
		const atLeft  = _sig(true);
		const atRight = _sig(false);

		const _onScroll = () => {
			const sl = el.scrollLeft ?? 0;
			const st = el.scrollTop  ?? 0;
			const sh = el.scrollHeight ?? 0;
			const ch = el.clientHeight ?? 0;
			const sw = el.scrollWidth  ?? 0;
			const cw = el.clientWidth  ?? 0;
			x.set(sl); y.set(st);
			atTop.set(st <= 0);
			atBottom.set(st + ch >= sh - 1);
			atLeft.set(sl <= 0);
			atRight.set(sl + cw >= sw - 1);
		};

		target.addEventListener('scroll', _onScroll, { passive: true });
		_addCleanup(el, () => target.removeEventListener('scroll', _onScroll));

		return Object.freeze({ x, y, atTop, atBottom, atLeft, atRight });
	});

	// this.$.shadow — reactive shadow root state
	// Only meaningful on shadow components — returns null-safe object otherwise.

	namespaces.set('shadow', function initShadowNamespace(el) {
		const root = el[SHADOW_ROOT];

		// Non-shadow component — return inert object
		if (!root) return Object.freeze({
			root:    null,
			mode:    null,
			adopted: Instance.signal(false),
			slots:   new Proxy({}, { get() { return Instance.signal(false); } })
		});

		// Slot occupation signals — lazy per slot name
		const slotSignals = new Map();
		const getSlotSignal = (name) => {
			if (slotSignals.has(name)) return slotSignals.get(name);
			const sig  = Instance.signal(false);
			const slot = name === 'default'
				? root.querySelector('slot:not([name])')
				: root.querySelector(`slot[name="${name}"]`);
			if (slot) {
				const update = () => sig.set(slot.assignedNodes({ flatten: true }).length > 0);
				slot.addEventListener('slotchange', update, { passive: true });
				update(); // initial state
				_addCleanup(el, () => slot.removeEventListener('slotchange', update));
			}
			slotSignals.set(name, sig);
			return sig;
		};

		const adopted = Instance.signal(false);
		const onAdopt = () => adopted.set(true);
		el.addEventListener('adoptedCallback', onAdopt, { passive: true });
		_addCleanup(el, () => el.removeEventListener('adoptedCallback', onAdopt));

		return Object.freeze({
			get root()    { return root; },
			get mode()    { return root.mode; },
			get adopted() { return adopted; },
			slots: new Proxy({}, {
				get(_, name) { return getSlotSignal(String(name)); }
			})
		});
	});

	define(Instance, '_elementNamespaces', {
		value: namespaces,
		configurable: T, enumerable: F, writable: F
	});

	const formLifecycles = ['@submit', '@invalid', '@change', '@valid', '@forminvalid', '@success', '@error', '@reset'];
	formLifecycles.forEach(key => {
		Instance._LIFECYCLE_EVENTS.add(key.slice(1));
		if (!Instance.prototype[key]) {
			define(Instance.prototype, key, { value: function() {}, configurable: T, enumerable: F, writable: T });
		}
	});

	// Form is a first-class element class. Initialises the form namespace
	// automatically on @insertion — no need to access this.$.form manually.
	// Exposes programmatic API directly on the element.

	define(Instance.prototype, '_initFormNs', {
		value: function _initFormNs() {
			if (!this.tagName || this.tagName.toLowerCase() !== 'form') return;
			// Touch this.$.form to initialise the namespace
			void this.$.form;
			// Expose programmatic API directly on the element for convenience
			const ns = this[ELEMENT_NS_STORE]?.get('form');
			if (!ns) return;
			if (!this._formApiPatched) {
				this._formApiPatched = true;
				// el.values(), el.validate(), el.setError() etc
				['validate', 'values', 'setValue', 'setError', 'clearErrors', 'focus'].forEach(method => {
					if (!this[method]) {
						define(this, method, CONF(ns[method]));
					}
				});
			}
		},
		configurable: T, enumerable: F, writable: T
	});

	// Auto-init form namespace on insertion
	const _origInsertionKey = Instance._fireLifecycleKey;
	define(Instance, '_fireLifecycleKey', {
		value: function _fireLifecycleKey(el, key, context) {
			_origInsertionKey.call(Instance, el, key, context);
			if (key === '@insertion' && el.tagName?.toLowerCase() === 'form') {
				el._initFormNs?.();
			}
		},
		configurable: T, writable: T, enumerable: F
	});

	// <form data-form data-action="/api/contact" data-success="/thank-you">
	// Instance intercepts, validates, posts, navigates.

	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll('form[data-form]').forEach(form => {
			if (form[METADATA]) return; // already an Instance component — skip
			form.addEventListener('submit', async (e) => {
				e.preventDefault();
				if (!form.checkValidity()) { form.reportValidity(); return; }
				const action  = form.dataset.action  ?? form.action;
				const method  = form.dataset.method  ?? 'post';
				const success = form.dataset.success;
				const errMsg  = form.dataset.error   ?? 'Something went wrong';
				const values  = Object.fromEntries([...new FormData(form)].map(([k,v]) => [k,v]));
				try {
					const r = await fetch(action, {
						method: method.toUpperCase(),
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(values)
					});
					if (!r.ok) throw new Error(errMsg);
					if (success) Instance.router?.navigate(success);
				} catch(err) {
					const errEl = form.querySelector('[data-error]');
					if (errEl) errEl.textContent = err.message;
					else       console.warn('[Instance] form error:', err.message);
				}
			});
		});
	}, { once: true });

}

// 0.73.e — Platform gap elements
//
// These are HTML elements the spec should have included.
// Instance adds them as first-class elements with minimal, justified behaviour.
//
// Infrastructure:
//   <async src="url">   — content in flight, holds space, skeleton-able
//   <error>             — failure state / form validation error display
//   <sync src="url" interval="ms"> — auto-refreshing content
//   <static>            — immutable content, never re-processed
//
// Semantic inline:
//   <email>             — email address data → auto mailto: link
//   <tel>               — telephone number → auto tel: link
//   <website>           — external URL → auto link with rel
//   <mailto to subject> — email action element
//
// Semantic landmarks:
//   <contact>           — contact information block
//   <login>             — authentication entry point
//   <logout>            — authentication exit
//   <portal target>     — out-of-flow content rendering
//   <intl key>          — internationalised content
//   <reset>             — form reset action

{
// installSemanticElements

	const SEMANTIC_STYLES = `
		/* <async> — content in flight */
		async {
			display: block;
			min-height: 1.5rem;
		}
		async:not([data-loaded]):not([data-error]) {
			background: linear-gradient(
				90deg,
				var(--skeleton-base, #f0f0f0) 25%,
				var(--skeleton-shine, #e8e8e8) 50%,
				var(--skeleton-base, #f0f0f0) 75%
			);
			background-size: 200% 100%;
			animation: instance-skeleton 1.5s ease-in-out infinite;
			border-radius: var(--skeleton-radius, 4px);
		}
		@keyframes instance-skeleton {
			0%   { background-position:  200% 0; }
			100% { background-position: -200% 0; }
		}
		@media (prefers-reduced-motion: reduce) {
			async { animation: none !important; }
		}

		/* <error> — hidden until needed */
		error { display: none; }
		error:not(:empty),
		async[data-error] > error { display: block; }
		error { color: var(--error-color, #c00); font-size: 0.875em; }

		/* <sync> — same as async during refresh */
		sync { display: block; }
		sync[data-syncing] { opacity: var(--sync-opacity, 0.7); }

		/* <static> — no special display, semantic only */
		static { display: contents; }

		/* <contact> <login> — block landmarks */
		contact, login { display: block; }

		/* <logout> — inline action */
		logout { display: inline; cursor: pointer; }

		/* <reset> — inline action */
		reset { display: inline; cursor: pointer; }

		/* Semantic inline elements */
		email, tel, website, mailto { display: inline; }

		/* <portal> — no display, content rendered elsewhere */
		portal { display: none !important; }

		/* <intl> — inline, transparent */
		intl { display: inline; }

		/* <router> — invisible, structural */
		router { display: contents; }

		/* <route> — invisible declaration */
		route { display: none !important; }

		/* <outlet> — block render target */
		outlet { display: block; }
		outlet:empty { display: none; }
	`;

	const styleEl = document.createElement('style');
	styleEl.setAttribute('data-instance', 'semantic-elements');
	styleEl.textContent = SEMANTIC_STYLES;
	document.head.appendChild(styleEl);

	// Handles: src attribute, inert, skeleton, replaceWith on resolve,
	// error child, MutationObserver for src changes, reload(), parent @async lifecycle.

	function initAsyncElement(el) {
		if (el._instanceAsyncInit) return;
		el._instanceAsyncInit = true;

		el.setAttribute('inert', '');
		el.style.pointerEvents = 'none';

		async function doFetch(url) {
			el.removeAttribute('data-error');
			el.removeAttribute('data-loaded');
			el.setAttribute('inert', '');

			// Hide <error> child during fetch
			const errorChild = el.querySelector(':scope > error');
			if (errorChild) errorChild.style.display = 'none';

			try {
				const response = await fetch(url);

				if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

				const contentType = response.headers.get('content-type') ?? '';
				let nodes = [];

				if (contentType.includes('application/json')) {
					const data = await response.json();
					// Fire @async on parent with data
					const parent = el.parentElement;
					if (parent?.[METADATA]) {
						Instance._fireLifecycleKey(parent, '@async', { src: url, data, el, type: 'json' });
					}
					// If no parent handler replaced content — leave async el in place with data attr
					el.setAttribute('data-loaded', '');
					el.removeAttribute('inert');
					return;
				}

				if (contentType.startsWith('text/')) {
					const html = await response.text();
					const template = document.createElement('template');
					template.innerHTML = html;
					nodes = [...template.content.childNodes];
				}

				// Replace <async> with fetched nodes
				el.setAttribute('data-loaded', '');
				el.removeAttribute('inert');

				const parent = el.parentElement;
				if (nodes.length) {
					el.replaceWith(...nodes);
				} else {
					el.replaceWith();
				}

				// Fire @async on parent component
				if (parent?.[METADATA]) {
					Instance._fireLifecycleKey(parent, '@async', { src: url, nodes, el, type: 'html' });
				}

			} catch(err) {
				el.setAttribute('data-error', '');
				el.removeAttribute('inert');

				// Show <error> child if present
				const errChild = el.querySelector(':scope > error');
				if (errChild) {
					errChild.style.display = '';
				} else {
					console.warn(`[Instance] <async> fetch failed: ${err.message} (${url})`);
				}

				// Fire @async on parent with error
				const parent = el.parentElement;
				if (parent?.[METADATA]) {
					Instance._fireLifecycleKey(parent, '@async', { src: url, error: err, el, type: 'error' });
				}
			}
		}

		// Initial fetch
		const src = el.getAttribute('src');
		if (src) doFetch(src);

		// Watch src attribute changes — reactive content loading
		const attrObs = new MutationObserver(mutations => {
			mutations.forEach(m => {
				if (m.attributeName === 'src') {
					const newSrc = el.getAttribute('src');
					if (newSrc) doFetch(newSrc);
				}
			});
		});
		attrObs.observe(el, { attributes: true, attributeFilter: ['src'] });

		// .reload() — re-fetch current src
		el.reload = () => { const src = el.getAttribute('src'); if (src) doFetch(src); };

		// Cleanup
		el._instanceAsyncCleanup = () => attrObs.disconnect();
	}

	// Polls src at interval. Replaces content when response changes.

	function initSyncElement(el) {
		if (el._instanceSyncInit) return;
		el._instanceSyncInit = true;

		const interval = parseInt(el.getAttribute('interval') ?? '5000', 10);
		let   lastContent = '';
		let   timer       = null;

		async function poll() {
			const src = el.getAttribute('src');
			if (!src) return;

			el.setAttribute('data-syncing', '');
			try {
				const r    = await fetch(src, { cache: 'no-store' });
				const text = await r.text();
				if (text !== lastContent) {
					lastContent  = text;
					el.innerHTML = text;
					el.removeAttribute('data-error');
					const parent = el.parentElement;
					if (parent?.[METADATA]) {
						Instance._fireLifecycleKey(parent, '@async', { src, el, type: 'sync' });
					}
				}
			} catch(e) {
				el.setAttribute('data-error', '');
			}
			el.removeAttribute('data-syncing');
		}

		poll();
		timer = setInterval(poll, interval);

		el.stop  = () => { clearInterval(timer); timer = null; };
		el.start = () => { if (!timer) { poll(); timer = setInterval(poll, interval); } };
		el._instanceSyncCleanup = () => clearInterval(timer);
	}

	// Marks content as immutable. Instance ignores it after first paint.

	function initStaticElement(el) {
		if (el._instanceStaticInit) return;
		el._instanceStaticInit = true;
		el.setAttribute('data-static', '');
		// No MutationObserver inside — content is frozen
	}

	const initEmailElement   = el => _makeInlineLink(el, '_iE', t => `mailto:${t}`, null);
	const initTelElement     = el => _makeInlineLink(el, '_iT', t => `tel:${t.replace(/\s/g,'')}`, null);
	const initWebsiteElement = el => _makeInlineLink(el, '_iW', t => t.startsWith('http') ? t : `https://${t}`, 'external noopener noreferrer');

	function initMailtoElement(el) {
		if (el._instanceMailtoInit) return;
		el._instanceMailtoInit = true;
		const to      = el.getAttribute('to') ?? '';
		const subject = el.getAttribute('subject') ?? '';
		const body    = el.getAttribute('body') ?? '';
		const params  = new URLSearchParams();
		if (subject) params.set('subject', subject);
		if (body)    params.set('body', body);
		const query = params.toString();
		const a = document.createElement('a');
		a.href = `mailto:${to}${query ? '?' + query : ''}`;
		a.innerHTML = el.innerHTML || to;
		el.innerHTML = '';
		el.appendChild(a);
	}

	function initLogoutElement(el) {
		if (el._instanceLogoutInit) return;
		el._instanceLogoutInit = true;
		el.style.cursor = 'pointer';
		el.setAttribute('role', 'button');
		el.setAttribute('tabindex', '0');
		el.addEventListener('click', () => {
			const endpoint = el.getAttribute('href') || el.getAttribute('action') || '/api/logout';
			const redirect = el.getAttribute('redirect') || '/';
			fetch(endpoint, { method: 'POST' }).then(() => {
				Instance.router?.navigate(redirect) ?? (location.href = redirect);
			});
		});
		el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') el.click(); });
	}

	function initResetElement(el) {
		if (el._instanceResetInit) return;
		el._instanceResetInit = true;
		el.setAttribute('role', 'button');
		el.setAttribute('tabindex', '0');
		el.addEventListener('click', () => {
			const form = el.closest('form');
			form?.reset();
		});
		el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') el.click(); });
	}

	function initPortalElement(el) {
		if (el._instancePortalInit) return;
		el._instancePortalInit = true;
		const targetSel = el.getAttribute('target') ?? 'body';
		const target    = document.querySelector(targetSel);
		if (!target) return;
		// Move children to target
		const frag = document.createDocumentFragment();
		[...el.childNodes].forEach(n => frag.appendChild(n));
		target.appendChild(frag);
		// Keep reference for cleanup
		el._portalTarget = target;
	}

	function initIntlElement(el) {
		if (el._instanceIntlInit) return;
		el._instanceIntlInit = true;
		const key    = el.getAttribute('key');
		if (!key) return;
		// Look up in Instance i18n store if configured
		const locale = Instance._i18n;
		if (!locale) return;
		const val = locale[key];
		if (val) el.textContent = val;
	}

	// Intrinsic routing elements. Replace data-router / data-outlet.
	//
	// <router base="/app" history="push">
	//     <route path="/"      src="/views/home.html"></route>
	//     <route path="/about" src="/views/about.html"></route>
	//     <route path="*"      src="/views/404.html"></route>
	// </router>
	//
	// <outlet></outlet>
	//
	// Named outlets:
	// <router>
	//     <route path="/dash" main="/views/dash.html" sidebar="/views/side.html"></route>
	// </router>
	// <outlet name="main"></outlet>
	// <outlet name="sidebar"></outlet>

	function initRouterElement(el) {
		if (el._instanceRouterInit) return;
		el._instanceRouterInit = true;

		// Apply config from attributes
		const base    = el[gA]('base')    ?? '';
		const history = el[gA]('history') ?? 'push';
		Instance.router.configure({ base, history });

		// Build route map from <route> children
		function _buildRouteMap() {
			const routes    = [...el[qSA]('route')];
			const routeMap  = {};
			const namedMaps = {}; // for named outlets: { outletName: { path: src } }

			routes.forEach(route => {
				const path = route[gA]('path');
				if (!path) return;

				const src = route[gA]('src');

				// Named outlet attributes — everything except 'path' and 'src'
				const namedAttrs = [...route.attributes]
					.filter(a => a.name !== 'path' && a.name !== 'src')
					.map(a => ({ name: a.name, value: a.value }));

				if (namedAttrs.length) {
					namedAttrs.forEach(({ name: outletName, value: outletSrc }) => {
						if (!namedMaps[outletName]) namedMaps[outletName] = {};
						namedMaps[outletName][path] = outletSrc;
					});
				}

				if (src) routeMap[path] = src;
			});

			return { routeMap, namedMaps };
		}

		function _register() {
			const { routeMap, namedMaps } = _buildRouteMap();

			// Default outlet — nearest unnamed <outlet> or first in document
			const defaultOutlet = document[qS]('outlet:not([name])') ??
								  document[qS]('outlet') ??
								  document[qS]('[data-outlet]');

			if (defaultOutlet && Object.keys(routeMap).length) {
				Instance.router._register(defaultOutlet, routeMap, {});
			}

			// Named outlets
			Object.entries(namedMaps).forEach(([name, map]) => {
				const outlet = document[qS](`outlet[name="${name}"]`);
				if (outlet && Object.keys(map).length) {
					Instance.router._register(outlet, map, {});
				}
			});
		}

		// Register on init
		_register();

		// Watch for <route> children being added/removed dynamically
		const childObs = new MutationObserver(() => _register());
		childObs.observe(el, { childList: true });
		el._instanceRouterCleanup = () => {
			childObs.disconnect();
			// Unregister all outlets this router managed
			const defaultOutlet = document[qS]('outlet:not([name])') ?? document[qS]('outlet');
			if (defaultOutlet) Instance.router._unregister(defaultOutlet);
		};

		// Click interception — anchors inside this <router>
		el.addEventListener('click', e => {
			const anchor = e.target.closest('a[href]');
			if (!anchor) return;
			const href = anchor[gA]('href');
			if (!href || href.startsWith('http') || href.startsWith('//') ||
				href.startsWith('mailto:') || href.startsWith('tel:')) return;
			e.preventDefault();
			Instance.router.navigate(href);
		}, false);
	}

	function initRouteElement(el) {
		// <route> is a declarative child of <router> — no behaviour of its own.
		// The parent <router> reads its attributes. Just mark as processed.
		if (el._instanceRouteInit) return;
		el._instanceRouteInit = true;
		// If parent router exists — trigger re-registration
		const router = el.closest('router');
		if (router?._instanceRouterInit) {
			// Re-build by triggering the MutationObserver the router set up
			// (it watches childList of the router element)
		}
	}

	function initOutletElement(el) {
		if (el._instanceOutletInit) return;
		el._instanceOutletInit = true;
		// <outlet> is a render target — behaviour provided by the router system.
		// Mark with data attribute for router to find via both selector paths.
		el[sA]('data-outlet', el[gA]('name') ?? '');
	}

	const SEMANTIC_HANDLERS = {
		'async':   initAsyncElement,
		'sync':    initSyncElement,
		'static':  initStaticElement,
		'email':   initEmailElement,
		'tel':     initTelElement,
		'website': initWebsiteElement,
		'mailto':  initMailtoElement,
		'logout':  initLogoutElement,
		'reset':   initResetElement,
		'portal':  initPortalElement,
		'intl':    initIntlElement,
		'router':  initRouterElement,
		'route':   initRouteElement,
		'outlet':  initOutletElement,
	};

	function _walkForSemantic(node) {
		if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
		const tag = node.tagName.toLowerCase();
		const handler = SEMANTIC_HANDLERS[tag];
		if (handler) handler(node);
		node.childNodes.forEach(_walkForSemantic);
	}

	document.addEventListener('DOMContentLoaded', () => {
		// Router elements must be processed before outlets so route tables exist
		document[qSA]('router').forEach(initRouterElement);
		document[qSA]('outlet').forEach(initOutletElement);
		Object.keys(SEMANTIC_HANDLERS)
			.filter(t => t !== 'router' && t !== 'outlet')
			.forEach(tag => document[qSA](tag).forEach(el => SEMANTIC_HANDLERS[tag](el)));
	}, { once: true });

	const semanticObserver = new MutationObserver(mutations => {
		mutations.forEach(m => {
			m.addedNodes.forEach(node => _walkForSemantic(node));
			m.removedNodes.forEach(node => {
				if (node.nodeType !== Node.ELEMENT_NODE) return;
				node._instanceAsyncCleanup?.();
				node._instanceSyncCleanup?.();
				node._instanceRouterCleanup?.();
			});
		});
	});

	semanticObserver.observe(document.body || document.documentElement, {
		childList: true, subtree: true
	});

	define(Instance, '_i18n', CONF_W(null));

	define(Instance, 'i18n', {
		value: function i18n(translations) {
			Instance._i18n = translations;
			// Re-process any <intl> elements already in DOM
			document.querySelectorAll('intl[key]').forEach(initIntlElement);
			return Instance;
		},
		configurable: T, writable: T, enumerable: F
	});

	// So dot-access queries work: el.async, el.error etc
	// These won't be autoclass-registered (no metaclass) but querySelector works

	const SEMANTIC_TAGS = Object.keys(SEMANTIC_HANDLERS).concat([
		'error', 'contact', 'login', 'portal', 'intl', 'reset', 'static',
		'router', 'route', 'outlet'
	]);

	SEMANTIC_TAGS.forEach(tag => {
		ifndef(Instance.prototype, tag, () => {
			define(Instance.prototype, tag, {
				get() { return this.querySelector(tag) ?? null; },
				configurable: T, enumerable: F
			});
		});
	});

}

// 0.73.g — this.transition(), meta-transitions, deferred @unmount
//
// Cascade:
//   'enter'     → static transitions[name]           non-shadow
//   '::enter'   → static shadow.transitions[name]    shadow-scoped
//   'fade-in'   → built-in named transition
//   { ... }     → inline config
//
// Meta-transitions (observe transition model):
//   this.on(':enter',   fn)    → fn fires when 'enter' transition starts
//   this.off(':enter',  fn)    → fn fires when 'enter' transition ends
//   this.on(':::enter', fn)    → fn fires when '::enter' shadow transition starts
//   this.off(':::enter',fn)    → fn fires when '::enter' shadow transition ends
//   this.on(':*',       fn)    → fires when ANY transition starts on this element
//   this.off(':*',      fn)    → fires when ANY transition ends
//
// @unmount deferred removal:
//   ['@unmount']() { return this.transition('leave') }
//   → element stays in DOM until Promise resolves, then removed

{
// installTransitions

	const BUILT_INS = {
		'fade-in':    { from: { opacity: 0 },                          to: { opacity: 1 },                          duration: 200, easing: 'ease-out' },
		'fade-out':   { from: { opacity: 1 },                          to: { opacity: 0 },                          duration: 150, easing: 'ease-in'  },
		'slide-up':   { from: { opacity: 0, transform: 'translateY(12px)'  }, to: { opacity: 1, transform: 'translateY(0)'   }, duration: 250, easing: 'ease-out' },
		'slide-down': { from: { opacity: 0, transform: 'translateY(-12px)' }, to: { opacity: 1, transform: 'translateY(0)'   }, duration: 250, easing: 'ease-out' },
		'slide-left': { from: { opacity: 0, transform: 'translateX(12px)'  }, to: { opacity: 1, transform: 'translateX(0)'   }, duration: 250, easing: 'ease-out' },
		'slide-right':{ from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)'   }, duration: 250, easing: 'ease-out' },
		'scale-in':   { from: { opacity: 0, transform: 'scale(0.95)'  },      to: { opacity: 1, transform: 'scale(1)'        }, duration: 200, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
		'scale-out':  { from: { opacity: 1, transform: 'scale(1)'     },      to: { opacity: 0, transform: 'scale(0.95)'     }, duration: 150, easing: 'ease-in'  },
		'blur-in':    { from: { opacity: 0, filter: 'blur(4px)'       },      to: { opacity: 1, filter: 'blur(0px)'          }, duration: 250, easing: 'ease-out' },
		'blur-out':   { from: { opacity: 1, filter: 'blur(0px)'       },      to: { opacity: 0, filter: 'blur(4px)'          }, duration: 200, easing: 'ease-in'  },
	};

	// Resolves a transition name to a config object.
	// Resolution order:
	//   '::name' → static shadow.transitions[name]
	//   'name'   → static transitions[name]
	//   'name'   → BUILT_INS[name]
	//   { ... }  → use directly

	function _resolveTransition(el, name) {
		if (typeof name === O && name !== null) return name;

		const { shadowDepth, coreName } = _parseEventDepth(String(name));
		const Klass = el[METADATA]?.constructor;

		if (shadowDepth === 2) {
			// '::name' — shadow transitions
			const shadowCfg = parseShadowStatic(Klass?.shadow);
			const config    = shadowCfg?.transitions?.[coreName];
			if (config) return { ...config, _name: coreName, _scope: 'shadow' };
		} else {
			// 'name' — non-shadow transitions first, then built-ins
			const config = Klass?.transitions?.[coreName];
			if (config) return { ...config, _name: coreName, _scope: 'local' };
			const builtin = BUILT_INS[coreName];
			if (builtin) return { ...builtin, _name: coreName, _scope: 'builtin' };
		}

		if (Instance.debug) console.warn(`[Instance] transition '${name}' not found`);
		return null;
	}

	// Converts { opacity, transform, y, x, scale, blur, filter } shorthand
	// to proper CSS keyframe objects for Web Animations API.

	function _cssFromConfig(frame) {
		const css = {};
		for (const [k, v] of Object.entries(frame)) {
			if (k === 'y')       { css.transform = (css.transform ?? '') + ` translateY(${typeof v === 'number' ? v + 'px' : v})`; continue; }
			if (k === 'x')       { css.transform = (css.transform ?? '') + ` translateX(${typeof v === 'number' ? v + 'px' : v})`; continue; }
			if (k === 'scale')   { css.transform = (css.transform ?? '') + ` scale(${v})`;  continue; }
			if (k === 'blur')    { css.filter    = `blur(${typeof v === 'number' ? v + 'px' : v})`; continue; }
			css[k] = typeof v === 'number' && k !== 'opacity' ? v + 'px' : String(v);
		}
		if (css.transform) css.transform = css.transform.trim();
		return css;
	}

	// Fires META_TRANSITION_HANDLERS for a given transition name and phase.

	function _fireMetaTransition(el, name, phase, config) {
		if (!el[META_TRANSITION_HANDLERS]) return;
		const context = { name, phase, duration: config?.duration, scope: config?._scope ?? 'local' };

		// Specific: ':enter' start/end handlers
		const specific = el[META_TRANSITION_HANDLERS].get(name);
		if (specific) specific[phase]?.forEach(fn => { try { fn.call(el, context); } catch(e) {} });

		// Wildcard: ':*' start/end handlers
		const wildcard = el[META_TRANSITION_HANDLERS].get('*');
		if (wildcard) wildcard[phase]?.forEach(fn => { try { fn.call(el, { ...context, event: name }); } catch(e) {} });
	}

	// Runs a single transition using the Web Animations API.
	// Returns Promise<element> that resolves when complete.
	// Respects prefers-reduced-motion — skips to final state if reduced.

	function _runTransition(target, config) {
		return new Promise((resolve) => {
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			if (!config || prefersReduced) {
				// Jump to final state immediately
				if (config?.to) {
					const finalCSS = _cssFromConfig(config.to);
					for (const [k, v] of Object.entries(finalCSS)) {
						target.style[k] = v;
					}
				}
				resolve(target);
				return;
			}

			const fromCSS = _cssFromConfig(config.from ?? {});
			const toCSS   = _cssFromConfig(config.to   ?? {});
			const opts    = {
				duration:   config.duration ?? 200,
				delay:      config.delay    ?? 0,
				easing:     config.easing   ?? 'ease',
				fill:       'forwards',
			};

			try {
				const animation = target.animate([fromCSS, toCSS], opts);
				animation.onfinish  = () => resolve(target);
				animation.oncancel  = () => resolve(target);
			} catch(e) {
				// Fallback — apply final state inline
				const finalCSS = _cssFromConfig(config.to ?? {});
				for (const [k, v] of Object.entries(finalCSS)) target.style[k] = v;
				resolve(target);
			}
		});
	}

	// Main transition method. Installed on Instance.prototype.
	//
	//   this.transition('enter')           → static transitions.enter
	//   this.transition('::enter')         → static shadow.transitions.enter
	//   this.transition('fade-in')         → built-in
	//   this.transition({ from, to, ... }) → inline config
	//   this.transition({ el, from, to })  → animate a specific element
	//
	// Always returns Promise<this>.
	// Fires ':name' meta-transition observers at start and end.
	// Deduplicates — same transition running twice is a no-op (second is ignored).

	define(Instance.prototype, 'transition', {
		value: function transition(nameOrConfig) {
			const el     = this;
			const config = _resolveTransition(el, nameOrConfig);
			if (!config) return Promise.resolve(el);

			const target  = config.el ?? el;
			const name    = config._name ?? (typeof nameOrConfig === S ? nameOrConfig : 'inline');
			const scope   = config._scope ?? 'local';
			const fullKey = (scope === 'shadow' ? '::' : '') + name;

			// Deduplication — ignore if already running
			if (!el[ACTIVE_TRANSITIONS]) OBJECT_DEFINE(el, ACTIVE_TRANSITIONS, CONF(new Set()));
			if (el[ACTIVE_TRANSITIONS].has(fullKey)) return Promise.resolve(el);
			el[ACTIVE_TRANSITIONS].add(fullKey);

			// Fire ':name' meta observers — start
			_fireMetaTransition(el, fullKey, 'start', config);

			return _runTransition(target, config).then(() => {
				el[ACTIVE_TRANSITIONS].delete(fullKey);
				// Fire ':name' meta observers — end
				_fireMetaTransition(el, fullKey, 'end', config);
				return el;
			});
		},
		configurable: T, enumerable: F, writable: T
	});

	// Every shadow component gets '::transition' in its receive contract
	// if not explicitly declared. Stub does nothing — override to add behaviour.

	const _origWireInbound = Instance._ensureObserver;
	// Hook: after shadow component mounts — add ::transition to receive if missing
	const _origFireKey = Instance._fireLifecycleKey.bind(Instance);

	// Add ::transition to static events automatically for shadow classes
	// Done at class definition time via a helper
	define(Instance, '_ensureShadowTransitionContract', {
		value: function(Klass) {
			if (!Klass.shadow) return;
			if (!Klass.events) Klass.events = {};
			if (!Klass.events.transition) {
				Klass.events = { ...Klass.events, transition: { receive: true, detail: { to: 'string?' } } };
			}
		},
		configurable: T, writable: T, enumerable: F
	});

	Instance._LIFECYCLE_EVENTS.add('transition');

	if (!Instance.prototype['::transition']) {
		define(Instance.prototype, '::transition', {
			value: function(context) {
				const to = context?.detail?.to;
				if (to) return this.transition(to);
				return Promise.resolve(this);
			},
			configurable: T, enumerable: F, writable: T
		});
	}

	define(Instance, '_builtinTransitions', {
		value: BUILT_INS,
		configurable: T, enumerable: F, writable: F
	});

}

const supportsModernJS = () => {
	try { new Function("class Test { #p = 1 }"); new RegExp('', 'u'); new RegExp('\\p{ID_Start}', 'u'); return true; }
	catch (e) { return false; }
};
if (supportsModernJS()) { console.log("🚀 Instance 0.73.m — all systems go."); }
else { alert("Your browser is quite old! Please update for the best experience."); }

return Instance;

}, {});
