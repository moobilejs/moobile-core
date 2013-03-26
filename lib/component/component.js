"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Component = moobile.Component = new Class({

	Extends: moobile.Firer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__ready: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__window: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__children: [],

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__visible: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__visibleAnimation: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__style: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__listeners: {},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__callbacks: {},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__size: {
		x: 0,
		y: 0
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__updateLayout: false,

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
		tagName: 'div',
		components: null
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#initialization
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	initialize: function(element, options, name) {

		this.setElement(element);
		this.setOptions(options);

		this.__name = name || this.element.get('data-name');

		var marker = this.element;
		var exists = document.contains(this.element);
		if (exists) this.element = this.element.clone(true, true);

		this.__willBuild();
		this.__build();
		this.__didBuild();

		if (exists) this.element.replaces(marker);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	destroy: function() {

		this.removeEvents();
		this.removeFromParentComponent();
		this.removeAllChildComponents(true);

		this.element.destroy();
		this.element = null;

		this.__window = null;
		this.__parent = null;
		this.__children = null;
		this.__callbacks = null;
		this.__listeners = null;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	setElement: function(element) {

		if (this.element) {
			this.element.destroy();
			this.element = null;
		}

		this.element = Element.from(element);
		if (this.element === null) {
			this.element = document.createElement(this.options.tagName);
		}

		this.element.store('moobile:component', this);

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setOptions: function(options) {

		options = options || {};

		for (var option in this.options) {
			if (options[option] === undefined) {
				var value = this.element.get('data-option-' + option.hyphenate());
				if (value !== null) {
					try { value = JSON.parse(value) } catch (e) {}
					options[option] = value;
				}
			}
		}

		return this.parent(options)
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	addEvent: function(type, fn, internal) {

		var name = type.split(':')[0];

		if (this.supportNativeEvent(name)) {

			var self = this;
			var listeners = this.__listeners;
			var callbacks = this.__callbacks;
			if (callbacks[name] === undefined) {
				callbacks[name] = [];
				listeners[name] = function(e) {
					self.fireEvent(name, e);
				};
			}

			callbacks[name].include(fn);

			if (callbacks[name].length === 1) this.element.addEvent(name, listeners[name]);
		}

		return this.parent(type, fn, internal);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	removeEvent: function(type, fn) {

		if (this.supportNativeEvent(type)) {
			var listeners = this.__listeners;
			var callbacks = this.__callbacks;
			if (callbacks[type] && callbacks[type].contains(fn)) {
				callbacks[type].erase(fn);
				if (callbacks[type].length === 0) {
					this.element.removeEvent(type, listeners[type]);
					delete listeners[type];
					delete callbacks[type];
				}
			}
		}

		return this.parent(type, fn);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#supportNativeEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	supportNativeEvent: function(name) {
		return [
			'click', 'dblclick', 'mouseup', 'mousedown',
			'mouseover', 'mouseout','mousemove',
			'keydown', 'keypress', 'keyup',
			'touchstart', 'touchmove', 'touchend', 'touchcancel',
			'gesturestart', 'gesturechange', 'gestureend',
			'tap', 'tapstart', 'tapmove', 'tapend', 'tapcancel',
			'pinch', 'swipe', 'touchold',
			'animationend', 'transitionend', 'owntransitionend', 'ownanimationend'
		].contains(name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponent: function(component, where, context) {

		component.removeFromParentComponent();

		if (context) {
			context = document.id(context) || this.element.getElement(context);
		} else {
			context = this.element;
		}

		this.__willAddChildComponent(component);

		var element = document.id(component)
		if (where || !this.hasElement(element)) {
			element.inject(context, where);
		}

		setComponentIndex.call(this, component);
		component.__setParent(this);
		component.__setWindow(this.__window);
		this.__didAddChildComponent(component);

		this.updateLayout();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentInside: function(component, context, where) {
		return this.addChildComponent(component,  where, document.id(context) || this.getElement(context));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentAfter: function(component, after) {
		return this.addChildComponent(component, 'after', after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentBefore: function(component, before) {
		return this.addChildComponent(component, 'before', before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addChildComponentAt: function(component, index) {

		var children = this.__children;

		if (index > children.length) {
			index = children.length;
		} else if (index < 0) {
			index = 0;
		}

		var before = this.getChildComponentAt(index);
		if (before) {
			return this.addChildComponentBefore(component, before);
		}

		return this.addChildComponent(component, 'bottom');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponent: function(name) {
		return this.__children.find(function(child) { return child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getChildComponentByType: function(type, name) {
		return this.__children.find(function(child) { return child instanceof type && child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentAt: function(index) {
		return this.__children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentByTypeAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getChildComponentByTypeAt: function(type, index) {
		return this.getChildComponentsByType(type)[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentIndex: function(component) {
		return this.__children.indexOf(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponents: function() {
		return this.__children;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentsByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since 0.3.0
	 */
	getChildComponentsByType: function(type) {
		return this.__children.filter(function(child) { return child instanceof type });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildComponent: function(component) {
		return this.__children.contains(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasChildComponentByType: function(type) {
		return this.__children.some(function(child) { return child instanceof type; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getComponent
	 * @author Tin LE GALL (imbibinebe@gmail.com)
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getComponent: function(name) {

	    var component = this.getChildComponent(name);
	    if (component === null) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].getComponent(name);
				if (found) return found;
			}
		}

	    return component;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getComponentByType: function(type, name) {

	    var component = this.getChildComponentByType(type, name);
	    if (component === null) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].getComponentByType(type, name);
				if (found) return found;
			}
		}

		return component;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasComponent: function(name) {

	    var exists = this.hasChildComponent(name);
	    if (exists === false) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].hasComponent(name);
				if (found) return found;
			}
		}

	    return exists;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasComponentByType: function(type, name) {

	    var exists = this.hasChildComponentByType(type, name);
	    if (exists === false) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].hasComponentByType(type, name);
				if (found) return found;
			}
		}

	    return exists;
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
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	removeChildComponent: function(component, destroy) {

		if (this.hasChildComponent(component) === false)
			return this;

		this.__willRemoveChildComponent(component);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this.__children.erase(component);
		component.__setParent(null);
		component.__setWindow(null);
		this.__didRemoveChildComponent(component);

		if (destroy) {
			component.destroy();
		}

		this.updateLayout();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildComponents: function(destroy) {
		return this.removeAllChildComponentsByType(Component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponentsByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllChildComponentsByType: function(type, destroy) {

		this.__children.filter(function(child) {
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentComponent: function() {
		return this.__parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasParentComponent: function() {
		return !!this.__parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWindow: function() {
		return this.__window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasWindow: function() {
		return !!this.__window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isReady: function() {
		return this.__ready;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this.__name;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setStyle: function(name) {

		if (arguments.length === 2) {

			this.element.setStyle(
				arguments[0],
				arguments[1]
			);

			return this.updateLayout();
		}

		if (this.__style) {
			this.__style.detach.call(this, this.element);
			this.__style = null;
		}

		var style = Component.getStyle(name, this);
		if (style) {
			style.attach.call(this, this.element);
		}

		this.__style = style;

		return this.updateLayout();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getStyle: function() {
		return arguments.length === 1 ? this.element.getStyle(arguments[0]) : this.__style && this.__style.name || null
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hasStyle: function(name) {
		return this.__style ? this.__style.name === name : false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addClass: function(name) {

		var element = this.element;
		if (element.hasClass(name) === false) {
			element.addClass(name);
			this.updateLayout();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeClass: function(name) {

		var element = this.element;
		if (element.hasClass(name) === true) {
			element.removeClass(name);
			this.updateLayout();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#toggleClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	toggleClass: function(name, force) {
		this.element.toggleClass(name, force);
		this.updateLayout();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hasClass: function(name) {
		return this.element.hasClass(name);
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	getRoleElement: function(name) {
		return this.getRoleElements(name, 1)[0] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getRoleElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	getRoleElements: function(name, limit) {

		var roles = this.__roles__;
		var found = [];

		var walk = function(element) {

			if (limit && limit <= found.length)
				return;

			var nodes = element.childNodes;
			for (var i = 0, len = nodes.length; i < len; i++) {

				var node = nodes[i];
				if (node.nodeType !== 1)
					continue;

				var role = node.getRole();
				if (role === null) {
					walk(node);
					continue;
				}

				var behavior = roles[role];
				if (behavior) {

					if (name === role || !name) found.push(node);

					if (behavior.options.traversable) {
						walk(node);
						continue;
					}
				}
			}
		};

		walk(this.element);

		return found;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	setSize: function(x, y) {

		if (x > 0 || x === null) this.element.setStyle('width', x);
		if (y > 0 || y === null) this.element.setStyle('height', y);

		if (this.__size.x !== x ||
			this.__size.y !== y) {
			this.updateLayout();
		}

		this.__size.x = x;
		this.__size.y = y;

		return this;
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
		return this.element.getPosition(document.id(relative) || this.__parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#show
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	show: function(animation) {

		if (this.__visible === true)
			return this;

		if (this.__visibleAnimation) {
			this.__visibleAnimation.stop();
			this.__visibleAnimation.removeEvents();
		}

		if (animation) {

			if (typeof animation === 'string') {
				animation = new moobile.Animation(this.element, {
					validate: function(e, element) {
						return e.target === this.boxElement;
					}.bind(this)
				}).setAnimationClass(animation);
			}

			this.__visibleAnimation = animation;
			this.__visibleAnimation.addEvent('start', this.bound('__willShow'));
			this.__visibleAnimation.addEvent('end', this.bound('__didShow'));
			this.__visibleAnimation.start()

		} else {
			this.__willShow();
			this.__didShow();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	hide: function(animation) {

		if (this.__visible === false)
			return this;

		if (this.__visibleAnimation) {
			this.__visibleAnimation.stop();
			this.__visibleAnimation.removeEvents();
		}

		if (animation) {

			if (typeof animation === 'string') {
				animation = new moobile.Animation(this.element, {
					validate: function(e, element) {
						return e.target === this.boxElement;
					}.bind(this)
				}).setAnimationClass(animation);
			}

			this.__visibleAnimation = animation;
			this.__visibleAnimation.addEvent('start', this.bound('__willHide'));
			this.__visibleAnimation.addEvent('end', this.bound('__didHide'));
			this.__visibleAnimation.start()

		} else {
			this.__willHide();
			this.__didHide();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isVisible
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isVisible: function() {
		return this.__visible;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	updateLayout: function(update) {

		update = update === false
			? false
			: true;

		if (this.__updateLayout !== update) {
			this.__updateLayout = update;
			if (update) updateLayout(this);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#cascade
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	cascade: function(func) {
		func.call(this, this);
		this.__children.invoke('cascade', func)
		return this;
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willChangeReadyState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willChangeReadyState: function(ready) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didChangeReadyState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didChangeReadyState: function(ready) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didUpdateLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didHide: function() {

	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	toElement: function() {
		return this.element;
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__setParent: function(parent) {

		if (this.__parent === parent)
			return this;

		this.__parentComponentWillChange(parent);
		this.__parent = parent;
		this.__parentComponentDidChange(parent);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__setWindow: function(window) {

		if (this.__window === window)
			return this;

		var ready = !!window;

		// Would it be better to call windowWillChange for all child and then
		// call windowDidChange ?


		this.cascade(function(component) {

			if (component.__window !== window) {
				component.__windowWillChange(window);
				component.__window = window;
				component.__windowDidChange(window);
			}

			if (component.__ready !== ready) {
				component.__willChangeReadyState(ready);
				component.__ready = ready;
				component.__didChangeReadyState(ready);
				if (ready) component.__didBecomeReady();
			}
		});

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	__build: function() {

		var owner = this;
		var roles = this.__roles__;
		var attrs = this.__attributes__;

		for (var key in attrs) {
			var value = this.element.get(key);
			if (value !== null) {
				var handler = attrs[key];
				if (handler instanceof Function) {
					handler.call(this, value);
				}
			}
		}

		var className = this.options.className;
		if (className) this.addClass(className);

		var styleName = this.options.styleName
		if (styleName) this.setStyle(styleName);

		this.getRoleElements().each(function(element) {
			var handler = roles[element.getRole()].handler;
			if (typeof handler === 'function') {
				handler.call(owner, element);
			}
		});
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willBuild: function() {
		this.willBuild();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didBuild: function() {

		var components = this.options.components;
		if (components) {
			this.addChildComponents(components);
		}

		this.didBuild();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willAddChildComponent: function(component) {
		this.willAddChildComponent(component);
		this.fireEvent('willaddchildcomponent', component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didAddChildComponent: function(component) {
		this.didAddChildComponent(component);
		this.fireEvent('didaddchildcomponent', component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willRemoveChildComponent: function(component) {
		this.willRemoveChildComponent(component);
		this.fireEvent('willremovechildcomponent', component)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didRemoveChildComponent: function(component) {
		this.didRemoveChildComponent(component);
		this.fireEvent('didremovechildcomponent', component)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__parentComponentWillChange: function(parent) {
		this.parentComponentWillChange(parent);
		this.fireEvent('parentcomponentwillchange', parent)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__parentComponentDidChange: function(parent) {
		this.parentComponentDidChange(parent);
		this.fireEvent('parentcomponentdidchange', parent);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__windowWillChange: function(window) {
		this.windowWillChange(window);
		this.fireEvent('windowwillchange', window);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__windowDidChange: function(window) {
		this.windowDidChange(window);
		this.fireEvent('windowdidchange', window);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__willChangeReadyState: function(ready) {
		this.willChangeReadyState(ready);
		this.fireEvent('willchangereadystate', ready)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__didChangeReadyState: function(ready) {
		this.didChangeReadyState(ready)
		this.fireEvent('didchangereadystate', ready);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__didBecomeReady: function() {
		this.didBecomeReady();
		this.fireEvent('didbecomeready')
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__didUpdateLayout: function() {
		if (this.__updateLayout) {
			this.__updateLayout = false;
			this.didUpdateLayout();
			this.fireEvent('didupdatelayout')
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willShow: function() {

		this.willShow();
		this.removeClass('hidden');

		var self = this;

		this.cascade(function(component) {
			if (component !== self) {
				component.__willShow();
			}
		});
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didShow: function() {

		this.didShow();

		var self = this

		this.cascade(function(component) {
			component.__visible = true;
			if (component !== self) {
				component.__didShow();
				component.updateLayout();
			}
		});

		this.fireEvent('show');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willHide: function() {

		this.willHide();

		var self = this;

		this.cascade(function(component) {
			if (component !== self) {
				component.__willHide();
			}
		});
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didHide: function() {

		this.addClass('hidden');
		this.didHide();

		var self = this;

		this.cascade(function(component) {
			component.__visible = false;
			if (component !== self) {
				component.__didHide();
			}
		});

		this.fireEvent('hide');
	},

	/* Deprecated */

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentOfType: function(type, name) {
		return this.getChildComponentByType(type, name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentOfTypeAt: function(type, index) {
		return this.getChildComponentByTypeAt(type, index);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentsOfType: function(type) {
		return this.getChildComponentsByType(type);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasChildComponentOfType: function(type) {
		return this.hasChildComponentByType(type);
	},

	/**
	 * @deprecated
	 * @author Tin LE GALL (imbibinebe@gmail.com)
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.1
	 */
	getDescendantComponent: function(name) {
		return this.getComponent(name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getComponentOfType: function(type, name) {
		return this.getComponentByType(type, name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasComponentOfType: function(type, name) {
		return this.hasComponentByType(type, name);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Component.defineRole = function(name, context, options, handler) {
	context = (context || Component).prototype;
	if (context.__roles__ === undefined) {
	 	context.__roles__ = {};
	}
	if (options) {
		switch (typeof options) {
			case 'function':
				handler = options;
				options = {};
				break;
			case 'object':
				if (typeof options.behavior === 'function') handler = options.behavior;
				break;
		}
	}
	context.__roles__[name] = {
		handler: handler || function() {},
		options: options || {}
	};
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineAttribute
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Component.defineAttribute = function(name, context, handler) {
	context = (context || Component).prototype;
	if (context.__attributes__ === undefined) {
		context.__attributes__ = {};
	}
	context.__attributes__[name] = handler;
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineStyle
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Component.defineStyle = function(name, target, handler) {
	var context = (target || Component).prototype;
	if (context.__styles__ === undefined) {
		context.__styles__ = {};
	}
	context.__styles__[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, handler);
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#getRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Component.getStyle = function(name, target) {
	return target.__styles__
		 ? target.__styles__[name]
		 : null;
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#create
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Component.create = function(klass, element, descriptor, options, name) {

	element = Element.from(element);

	if (descriptor) {
		var subclass = element.get(descriptor);
		if (subclass) {
			var instance = Class.instantiate(subclass, element, options, name);
			if (instance instanceof klass) {
				return instance;
			}
		}
	}

	return new klass(element, options, name);
};

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Component.defineAttribute('data-style', null, function(value) {
	this.options.styleName = value;
});

var setComponentIndex = function(component) {

	var index = 0;

	var node = document.id(component);

	do {

		var prev = node.previousSibling;
		if (prev === null) {
			node = node.parentNode;
			if (node === this.element) break;
			continue;
		}

		node = prev;

		if (node.nodeType !== 1)
			continue;

		var previous = node.retrieve('moobile:component');
		if (previous) {
			index = this.getChildComponentIndex(previous) + 1;
			break;
		}

		var children = node.childNodes;
		if (children.length) {
			var found = getComponentIndex.call(this, node);
			if (found !== null) {
				index = found;
				break;
			}
		}

	} while (node)

	this.__children.splice(index, 0, component);

	return this;
};

var getComponentIndex = function(root) {

	var node = root.lastChild;

	do {

		if (node.nodeType !== 1) {
			node = node.previousSibling;
			if (node === null) return 0;
			continue;
		}

		var component = node.retrieve('moobile:component');
		if (component) {
			return this.getChildComponentIndex(component) + 1;
		}

		var children = node.childNodes;
		if (children.length) {
			var found = getComponentIndex.call(this, node);
			if (found >= 0) {
				return found;
			}
		}

		node = node.previousSibling;

	} while (node);

	return null;
};

var updateLayoutTime = null;
var updateLayoutRoot = null;

var updateLayout = function(component) {

	if (!(component instanceof moobile.Window) && component.hasWindow() === false)
		return;

	updateLayoutTime = cancelAnimationFrame(updateLayoutTime);
	updateLayoutTime = requestAnimationFrame(onUpdateLayout);

	if (updateLayoutRoot === null) {
		updateLayoutRoot = component;
		return;
	} else if (
		updateLayoutRoot instanceof moobile.Window ||
		updateLayoutRoot === component) {
		return;
	}

	var parent = component.getParentComponent();
	while (parent) {
		if (parent !== updateLayoutRoot) {
			parent = parent.getParentComponent();
			continue;
		}
		return
	}

	updateLayoutRoot = component;
}

var onUpdateLayout = function() {
	if (updateLayoutRoot) {
		updateLayoutRoot.cascade(function(component) {
			if (component.__updateLayout && component.__visible) {
				component.__didUpdateLayout();
				component.__updateLayout = false;
			}
		})
		updateLayoutRoot = null;
	}
}