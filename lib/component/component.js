"use strict"

require('event-util')
require('touch-util')
require('../type/array')
require('../type/string')
require('../element/element-from')
require('../element/element-role')
require('../element/element-style')

var requestAnimationFrame = require('moofx/lib/frame').request
var cancelAnimationFrame = require('moofx/lib/frame').cancel
var EventFirer = require('../event/event-firer')

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Component = module.exports = new Class({

	Extends: EventFirer,

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
	 * @since  0.2.1
	 */
	__display: true,

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
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__updateTimeout: null,

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

		this.element = Element.from(element);
		if (this.element === null) {
			this.element = document.createElement(this.options.tagName);
		}

		this.__name = name || this.element.get('data-name');

		this.element.store('moobile:component', this);

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

		this.setOptions(options);

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

		this.__updateTimeout = clearTimeout(this.__updateTimeout);

		return this;
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeEvent
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
			'tap', 'tapstart', 'tapmove', 'tapend', // TODO add tapcancel, tapover, tapout, tapenter, tapleave
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

		insert.call(this, component);
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

		var children = this.__children

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
		this.addChildComponentBefore(replacement, component).removeChildComponent(component, destroy);
		return this;
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
			var key = arguments[0];
			var val = arguments[1];
			this.element.setStyle(key, val);
		} else {

			if (this.__style) {
				this.__style.detach.call(this, this.element);
				this.__style = null;
			}

			var style = Component.getStyle(name, this);
			if (style) {
				style.attach.call(this, this.element);
			}

			this.__style = style;
		}

		this.updateLayout();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getStyle: function() {
		return this.__style ? this.__style.name : null;
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
	show: function() {

		// already displayed
		if (this.__display === true)
			return

		// already displayed but parent hidden
		if (this.__display === true &&
			this.__visible === false)
			return

		var items = []

		var filter = function(child) {

			if (child === this || child.__display) {
				items.push(child)
				return true
			}

		}.bind(this);

		invokeSome.call(this, filter, '__willShow')

		this.removeClass('hidden');
		this.__display = true;
		this.__visible = true;

		var children = function(child) {
			return items.contains(child)
		}

		assignSome.call(this, children, '__visible', true);
		invokeSome.call(this, children, '__didShow');

		this.updateLayout();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	hide: function() {

		if (this.__display === false)
			return this;

		var items = []

		var filter = function(child) {

			if (child === this || (
				child.__display === true && child.__visible === true)) {
				items.push(child)
				return true
			}

		}.bind(this);

		var children = function(child) {
			return items.contains(child)
		}

		invokeSome.call(this, filter, '__willHide');

		this.addClass('hidden');
		this.__visible = false;
		this.__display = false;

		assignSome.call(this, children, '__visible', false);
		invokeSome.call(this, children, '__didHide');

		this.updateLayout(false);

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
	updateLayout: function(update, dispatcher) {

		update = update && this.__ready && this.__display && this.__visible;

		if (this.__updateLayout === update)
			return this;

		this.__updateLayout = update;

		if (this.__updateTimeout) {
			this.__updateTimeout = cancelAnimationFrame(this.__updateTimeout);
		}

		if (this.__updateLayout && !dispatcher) {
			this.__updateTimeout = requestAnimationFrame(this.__didUpdateLayout.bind(this));
		}

		this.__children.invoke('updateLayout', update, this);

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

		if (parent) {
			if (this.__display) {
				this.__visible = this.__isVisible();
			}
		} else {
			this.__visible = this.__display;
		}

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

		invokeAll.call(this, '__windowWillChange', [window])
		assignAll.call(this, '__window', window)
		invokeAll.call(this, '__windowDidChange', [window])

		var ready = !!window
		invokeAll.call(this, '__willChangeReadyState', [ready])
		assignAll.call(this, '__ready', ready)
		invokeAll.call(this, '__didChangeReadyState', [ready])

		if (ready) invokeAll.call(this, '__didBecomeReady');

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

		if (this.__updateTimeout) {
			this.__updateTimeout = cancelAnimationFrame(this.__updateTimeout);
		}

		if (this.__updateLayout) {
			this.__updateLayout = false;
			this.didUpdateLayout();
			this.fireEvent('didupdatelayout')
		}

		this.__children.invoke('__didUpdateLayout');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willShow: function() {
		this.willShow();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didShow: function() {
		this.didShow();
		this.fireEvent('show')
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willHide: function() {
		this.willHide();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didHide: function() {
		this.didHide();
		this.fireEvent('hide');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__isVisible: function() {

		if (this.__display) {

			return this.__parent
			     ? this.__parent.__isVisible()
			     : true;
		}

		return false;
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
 * @hidden
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var invokeAll = function(method, args) {

	this[method].apply(this, args)

	var each = function(child) {
		invokeAll.apply(child, [method, args])
	}

	this.__children.each(each)
}

/**
 * @hidden
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var assignAll = function(key, val) {

	this[key] = val;

	var each = function(child) {
		assignAll.apply(child, [key, val])
	}

	this.__children.each(each)
}

/**
 * @hidden
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var invokeSome = function(filter, method, args) {

	if (filter(this)) this[method].apply(this, args)

	var each = function(child) {
		invokeSome.apply(child, [filter, method, args])
	}

	this.__children.each(each)
}

/**
 * @hidden
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var assignSome = function(filter, key, val) {

	if (filter(this)) this[key] = val;

	var each = function(child) {
		assignSome.apply(child, [filter, key, val])
	}

	this.__children.each(each)
}

/**
 * @hidden
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var insert = function(component) {

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
			var found = position.call(this, node);
			if (found !== null) {
				index = found;
				break;
			}
		}

	} while (node)

	this.__children.splice(index, 0, component);

	return this;
};

/**
 * @hidden
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var position = function(root) {

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
			var found = position.call(this, node);
			if (found >= 0) {
				return found;
			}
		}

		node = node.previousSibling;

	} while (node);

	return null;
};

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
