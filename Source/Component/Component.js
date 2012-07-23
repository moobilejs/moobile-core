/*
---

name: Component

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Element
	- Element.From
	- Element.Role
	- EventFirer

provides:
	- Component

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_window: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_children: [],

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_visible: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_ready: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_style: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_events: {
		listeners: {},
		callbacks: {}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	element: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#initialization
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	initialize: function(element, options, name) {

		this.element = Element.from(element);
		if (this.element === null) {
			this.element = document.createElement(this.options.tagName);
		}

		this._name = name || this.element.get('data-name');

		options = options || {};

		for (var option in this.options) {
			if (options[option] !== undefined) break;
			var attrb = option.hyphenate();
			var value = this.element.get('data-option-' + attrb);
			if (value != null) {
				if (value === 'null') {
					value = null;
				} else if (value === 'false') {
					value = false;
				} else if (value === 'true') {
					value = true
				} else if (/^-{0,1}\d*\.{0,1}\d+$/.test(value)) {
					value = Number(value);
				}
				options[option] = value;
			}
		}

		this.setOptions(options);

		var placeholder = this.element;
		var contains = document.contains(this.element);
		if (contains) this.element = this.element.clone(true, true);

		this.willBuild();
		this.build();
		this.didBuild();

		if (contains) this.element.replaces(placeholder);

		this.element.store('moobile:component', this);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	build: function() {

		var className = this.options.className;
		if (className) this.addClass(className);

		var styleName = this.options.styleName
		if (styleName) this.setStyle(styleName);

		var owner = this;
		var roles = this.__roles__;

		var build = function(element) {

			var nodes = element.childNodes;
			for (var i = 0, len = nodes.length; i < len; i++) {

				var node = nodes[i];
				if (node.nodeType !== 1)
					continue;

				var role = node.getRole();
				if (role === null) {
					build(node);
					continue;
				}

				var behavior = roles[role] || null;
				if (behavior && behavior instanceof Function) {
					behavior.call(owner, node);

					// stops here if the role created a component with this node
					var component = node.retrieve('moobile:component');
					if (component === null) {
						build(node);
					}

				} else {
					throw new Error('Role ' + role + ' has not beed defined for this component.');
				}
			}
		};

		build(this.element);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addEvent: function(type, fn, internal) {

		var name = type.split(':')[0];

		if (Moobile.Component.hasNativeEvent(name)) {

			var self = this;
			var listeners = this._events.listeners;
			var callbacks = this._events.callbacks;

			if (callbacks[name] === undefined) {
				callbacks[name] = [];
				listeners[name] = function(e) {
					self.fireEvent(name, e);
				};
			}

			callbacks[name].include(fn);

			this.element.addEvent(name, listeners[name]);
		}

		return this.parent(type, fn, internal);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeEvent: function(type, fn) {

		var name = type.split(':')[0];

		if (Moobile.Component.hasNativeEvent(name)) {
			var listeners = this._events.listeners;
			var callbacks = this._events.callbacks;
			if (callbacks[name] && callbacks[name].contains(fn)) {
				callbacks[name].erase(fn);
				if (callbacks[name].length === 0) {
					this.element.removeEvent(name, listeners[name]);
					delete listeners[name];
				}
			}
		}

		return this.parent(fn, type);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponent: function(component, where) {
		return this._addChildComponent(component, null, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentInside: function(component, context, where) {
		return this._addChildComponent(component,  document.id(context) || this.getElement(context), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentAfter: function(component, after) {
		return this._addChildComponent(component, after, 'after');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentBefore: function(component, before) {
		return this._addChildComponent(component, before, 'before');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_addChildComponent: function(component, context, where) {

		component.removeFromParentComponent();

		this.willAddChildComponent(component);

		if (context) {
			context = document.id(context) || this.element.getElement(context);
		} else {
			context = this.element;
		}

		var found = this.hasElement(component);
		if (found === false || where) {
			document.id(component).inject(context, where);
		}

		var index = this._getChildComponentIndexForElement(component);
		if (index === null) {
			index = 0;
		}

		this._children.splice(index, 0, component);
		component.setParentComponent(this);
		component.setWindow(this._window);
		this.didAddChildComponent(component);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponent: function(name) {
		return this._children.find(function(child) { return child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentOfType: function(type, name) {
		return this._children.find(function(child) { return child instanceof type && child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentOfTypeAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentOfTypeAt: function(type, index) {
		return this.getChildComponentsOfType(type)[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentIndex: function(component) {
		return this._children.indexOf(component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_getChildComponentIndexForElement: function(element) {

		element = document.id(element);

		var index = -1;
		var nodes = this.element.querySelectorAll('*');
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node === element) {
				return index + 1;
			} else {
				var component = node.retrieve('moobile:component');
				if (component) {
					var value = this.getChildComponentIndex(component);
					if (index < value) {
						index = value;
					}
				}
			}
		}

		return null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponents: function() {
		return this._children;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentsOfType: function(type) {
		return this._children.filter(function(child) { return child instanceof type });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildComponent: function(component) {
		return this._children.contains(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildComponentOfType: function(type) {
		return this._children.some(function(child) { return child instanceof type; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getDescendantComponent
	 * @author Tin LE GALL (imbibinebe@gmail.com)
	 * @since  0.1.1
	 */
	getDescendantComponent: function(name) {
	    var component = null;
	    var comparator = function(child) {
	        if (child.getName() === name) {component = child;return true;} else if (child.getChildComponents().length > 0) {return child.getChildComponents().find(comparator);} else return false;
	    }
	    this._children.find(comparator);
	    return component;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#replaceChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	replaceChildComponent: function(component, replacement, destroy) {
		return this.addChildComponentBefore(replacement, component).removeChildComponent(component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#replaceWithComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	replaceWithComponent: function(component, destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.replaceChildComponent(this, component, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeChildComponent: function(component, destroy) {

		if (!this.hasChildComponent(component))
			return this;

		this.willRemoveChildComponent(component);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this._children.erase(component);

		component.setParentComponent(null);
		component.setWindow(null);
		component.setReady(false);

		this.didRemoveChildComponent(component);

		if (destroy) {
			component.destroy();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildComponents: function(destroy) {
		return this.removeAllChildComponentsOfType(Moobile.Component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildComponentsOfType: function(type, destroy) {

		this._children.filter(function(child) {
			return child instanceof type;
		}).invoke('removeFromParentComponent', destroy);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeFromParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeFromParentComponent: function(destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.removeChildComponent(this, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParentComponent: function(parent) {

		if (this._parent === parent)
			return this;

		this.parentComponentWillChange(parent);
		this._parent = parent;
		this.parentComponentDidChange(parent);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentComponent: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasParentComponent: function() {
		return !!this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setWindow: function(window) {

		if (this._window === window)
			return this;

		this.windowWillChange(window);
		this._window = window;
		this.windowDidChange(window);

		this._children.invoke('setWindow', window);

		if (this._window) {
			this.setReady(true);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWindow: function() {
		return this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasWindow: function() {
		return !!this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setReady: function(ready) {

		if (this._ready === ready)
			return this;

		this._ready = ready;

		this._children.invoke('setReady', ready);

		if (this._ready) {
			this.didBecomeReady();
			this.fireEvent('ready');
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isReady: function() {
		return this._ready;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setStyle: function(name) {

		if (this._style) {
			this._style.detach.call(this, this.element);
			this._style = null;
		}

		var style = Moobile.Component.getStyle(name, this);
		if (style) {
			style.attach.call(this, this.element);
		}

		this._style = style;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getStyle: function() {
		return this._style ? this._style.name : null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#toggleClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getElements: function(selector) {
		return this.element.getElements(selector || '*');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getPosition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getPosition: function(relative) {
		return this.element.getPosition(document.id(relative) || this._parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#show
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	show: function() {

		if (this._visible)
			return this;

		this.willShow();
		this._visible = true;
		this.element.show();
		this.element.removeClass('hidden');
		this.didShow();

		return this.fireEvent('show');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hide: function() {

		if (this._visible === false)
			return this;

		this.willHide();
		this._visible = false;
		this.element.hide();
		this.element.addClass('hidden');
		this.didHide();

		return this.fireEvent('hide');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isVisible
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isVisible: function() {
		return this._visible;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#parentComponentWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentComponentWillChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#parentComponentDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentComponentDidChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#windowWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	windowWillChange: function(window) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#windowDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	windowDidChange: function(window) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.removeAllChildComponents(true);
		this.removeFromParentComponent();
		this.element.destroy();
		this.element = null;
		this._window = null;
		this._parent = null;
		return this;
	},

	toElement: function() {
		return this.element;
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @update 0.2.0
 * @since  0.1.0
 */
Moobile.Component.defineRole = function(name, context, func) {
	context = (context || Moobile.Component).prototype;
	if (context.__roles__ === undefined) {
	 	context.__roles__ = {};
	}
	// <0.1-compat>
	if (func.behavior) func = func.behavior;
	// </0.1-compat>
	context.__roles__[name] = func;
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineStyle
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.defineStyle = function(name, target, behavior) {
	var context = (target || Moobile.Component).prototype;
	if (context.__styles__ === undefined) {
		context.__styles__ = {};
	}
	context.__styles__[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, behavior);
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#getRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.getStyle = function(name, target) {
	return target.__styles__
		 ? target.__styles__[name]
		 : null;
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#create
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.create = function(klass, element, descriptor) {

	element = Element.from(element);

	if (descriptor) {
		var subclass = element.get(descriptor);
		if (subclass) {
			var instance = Class.instantiate(subclass, element);
			if (instance instanceof klass) {
				return instance;
			}
		}
	}

	return new klass(element);
};

(function() {

// TODO: Also add native events to Element.NativeEvent when using addNativeEvent

var events = Object.keys(Element.NativeEvents);

Moobile.Component.addNativeEvent = function(name) {
	events.include(name);
};

Moobile.Component.hasNativeEvent = function(name) {
	return events.contains(name);
};

Moobile.Component.removeNativeEvent = function(name) {
	events.erase(name);
};

Moobile.Component.addNativeEvent('tapstart');
Moobile.Component.addNativeEvent('tapmove');
Moobile.Component.addNativeEvent('tapend');
Moobile.Component.addNativeEvent('tap');
Moobile.Component.addNativeEvent('pinch');
Moobile.Component.addNativeEvent('swipe');
Moobile.Component.addNativeEvent('animationend');
Moobile.Component.addNativeEvent('transitionend');

})();

//<pre-0.1-compat>

Moobile.Component.prototype.addChild = Moobile.Component.prototype.addChildComponent;
Moobile.Component.prototype.addChildInside = Moobile.Component.prototype.addChildComponentInside;
Moobile.Component.prototype.addChildAfter = Moobile.Component.prototype.addChildComponentAfter;
Moobile.Component.prototype.addChildBefore = Moobile.Component.prototype.addChildComponentBefore;
Moobile.Component.prototype.getChild = Moobile.Component.prototype.getChildComponent;
Moobile.Component.prototype.getChildOfType = Moobile.Component.prototype.getChildComponentOfType;
Moobile.Component.prototype.getChildAt = Moobile.Component.prototype.getChildComponentAt;
Moobile.Component.prototype.getChildOfTypeAt = Moobile.Component.prototype.getChildComponentOfTypeAt;
Moobile.Component.prototype.getChildIndex = Moobile.Component.prototype.getChildComponentIndex;
Moobile.Component.prototype.getChildren = Moobile.Component.prototype.getChildComponents;
Moobile.Component.prototype.getChildrenOfType = Moobile.Component.prototype.getChildComponentsOfType;
Moobile.Component.prototype.hasChild = Moobile.Component.prototype.hasChildComponent;
Moobile.Component.prototype.hasChildOfType = Moobile.Component.prototype.hasChildComponentOfType;
Moobile.Component.prototype.replaceChild = Moobile.Component.prototype.replaceChildComponent;
Moobile.Component.prototype.replaceWith = Moobile.Component.prototype.replaceWithComponent;
Moobile.Component.prototype.removeChild = Moobile.Component.prototype.removeChildComponent;
Moobile.Component.prototype.removeChildren = Moobile.Component.prototype.removeAllChildComponents;
Moobile.Component.prototype.removeChildrenOfType = Moobile.Component.prototype.removeAllChildComponentsOfType;
Moobile.Component.prototype.removeFromParent = Moobile.Component.prototype.removeFromParentComponent;
Moobile.Component.prototype.setParent = Moobile.Component.prototype.setParentComponent;
Moobile.Component.prototype.getParent = Moobile.Component.prototype.getParentComponent;
Moobile.Component.prototype.hasParent = Moobile.Component.prototype.hasParentComponent;

Moobile.Component.prototype.willAddChild = function() {
	throw new Error('This method is deprecated, use "willAddChildComponent" instead');
};

Moobile.Component.prototype.didAddChild = function() {
	throw new Error('This method is deprecated, use "didAddChildComponent" instead');
};

Moobile.Component.prototype.willRemoveChild = function() {
	throw new Error('This method is deprecated, use "willRemoveChildComponent" instead');
};

Moobile.Component.prototype.didRemoveChild = function() {
	throw new Error('This method is deprecated, use "didRemoveChildComponent" instead');
};

Moobile.Component.prototype.parentWillChange = function() {
	throw new Error('This method is deprecated, use "parentComponentWillChange" instead');
};

Moobile.Component.prototype.parentDidChange = function() {
	throw new Error('This method is deprecated, use "parentComponentDidChange" instead');
};

//</pre-0.1-compat>
