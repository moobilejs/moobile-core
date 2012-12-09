/*
---

name: Component

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Element
	- Element.From
	- Element.Role
	- EventFirer

provides:
	- Component

...
*/

(function() {

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
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
	 * @since  0.2.1
	 */
	_built: null,

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
	 * @since  0.2.1
	 */
	_display: true,

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
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_size: {x: 0, y: 0},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_updateLayout: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_updateLayoutTimer: null,

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
			this.element = this.create();
		}

		this._name = name || this.element.get('data-name');

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

		this.element.store('moobile:component', this);

		var marker = this.element;
		var exists = document.contains(this.element);
		if (exists) this.element = this.element.clone(true, true);

		this._willBuild();
		this._build();
		this._built = true;
		this._didBuild();

		if (exists) this.element.replaces(marker);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#create
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	create: function() {
		return document.createElement(this.options.tagName);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	_build: function() {

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
			if (handler instanceof Function) {
				handler.call(owner, element);
			}
		});

		// <deprecated>
		if (this.build) {
			this.build.call(this);
			console.log('[DEPRECATION NOTICE] The method "build" will be removed in 0.5, use the "_build" method instead');
		}
		// </deprecated>
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willBuild: function() {
		this.willBuild();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didBuild: function() {

		var components = this.options.components;
		if (components) {
			this.addChildComponents(components);
		}

		this.didBuild();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	addEvent: function(type, fn, internal) {

		var name = type.split(':')[0];

		if (this.shouldSupportNativeEvent(name)) {

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

			if (callbacks[name].length === 1) this.element.addEvent(name, listeners[name]);
		}

		return this.parent(type, fn, internal);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	removeEvent: function(type, fn) {

		if (this.shouldSupportNativeEvent(type)) {
			var listeners = this._events.listeners;
			var callbacks = this._events.callbacks;
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#shouldSupportNativeEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	shouldSupportNativeEvent: function(name) {
		return [
			'click', 'dblclick', 'mouseup', 'mousedown',
			'mouseover', 'mouseout','mousemove',
			'keydown', 'keypress', 'keyup',
			'touchstart', 'touchmove', 'touchend', 'touchcancel',
			'gesturestart', 'gesturechange', 'gestureend',
			'tap', 'tapstart', 'tapmove', 'tapend',
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
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	_addChildComponent: function(component, context, where) {

		component.removeFromParentComponent();

		if (context) {
			context = document.id(context) || this.element.getElement(context);
		} else {
			context = this.element;
		}

		this._willAddChildComponent(component);
    	this._inject(component, context, where);
		this._insert(component);
		component._setParent(this);
		component._setWindow(this._window);
		this._didAddChildComponent(component);

		if (this._ready) {
			component._setReady(true);
		}

		this._setUpdateLayout(true);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addChildComponents: function(components, where) {
		return this._addChildComponents(components, null, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentsInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addChildComponentsInside: function(component, context, where) {
		return this._addChildComponents(component,  document.id(context) || this.getElement(context), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addChildComponentsAfter: function(component, after) {
		return this._addChildComponents(component, after, 'after');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addChildComponentsBefore: function(component, before) {
		return this._addChildComponents(component, before, 'before');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_addChildComponents: function(components, context, where) {

		components.invoke('removeFromParentComponent');

		if (context) {
			context = document.id(context) || this.element.getElement(context);
		} else {
			context = this.element;
		}

		var fragment = document.createDocumentFragment();

		for (var i = 0, l = components.length; i < l; i++) {
			var component = components[i];
			this._willAddChildComponent(component);
			this._inject(component, context, null, fragment);
		}

		switch (where) {

			case 'top':

				var first = context.firstChild;
				if (first) {
					context.insertBefore(fragment, first);
					break;
				}

				context.appendChild(fragment);

				break;

			case 'after':

				var parent = context.parentNode;
				if (parent) {

					var next = context.nextSibling;
					if (next) {
						parent.insertBefore(fragment, next);
						break;
					}

					parent.appendChild(fragment);
				}

				break;

			case 'before':

				var parent = context.parentNode;
				if (parent) {
					parent.insertBefore(fragment, context);
				}

				break;

			case 'bottom':
				context.appendChild(fragment);
				break;

			default:
				context.appendChild(fragment);
				break;
		}

		for (var i = 0, l = components.length; i < l; i++) {

			var component = components[i];

			this._insert(component);
			component._setParent(this);
			component._setWindow(this._window);
			this._didAddChildComponent(component);

			if (this._ready) {
				component._setReady(true);
			}
		}

		this._setUpdateLayout(true);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willAddChildComponent: function(component) {
		this.willAddChildComponent(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didAddChildComponent: function(component) {
		this.didAddChildComponent(component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_inject: function(component, context, where, fragment) {

		var element = component.getElement();

		if (where || this.hasElement(element) === false) {
			if (fragment) {
				fragment.appendChild(element);
			} else {
				element.inject(context, where);
			}
		}

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_insert: function(component) {

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
				var found = getLastComponentIndex.call(this, node);
				if (found !== null) {
					index = found;
					break;
				}
			}

		} while (node)

		this._children.splice(index, 0, component);

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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getChildComponentByType: function(type, name) {
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
		return this._children.indexOf(component);
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentsByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since 0.3.0
	 */
	getChildComponentsByType: function(type) {
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasChildComponentByType: function(type) {
		return this._children.some(function(child) { return child instanceof type; });
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
			for (var i = 0, len = this._children.length; i < len; i++) {
				var found = this._children[i].getComponent(name);
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
			for (var i = 0, len = this._children.length; i < len; i++) {
				var found = this._children[i].getComponentByType(type, name);
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
			for (var i = 0, len = this._children.length; i < len; i++) {
				var found = this._children[i].hasComponent(name);
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
			for (var i = 0, len = this._children.length; i < len; i++) {
				var found = this._children[i].hasComponentByType(type, name);
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

		this._willRemoveChildComponent(component);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this._children.erase(component);
		component._setParent(null);
		component._setWindow(null);
		component._setReady(false);
		this._didRemoveChildComponent(component);

		if (destroy) {
			component.destroy();
		}

		this._setUpdateLayout(true);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildComponents: function(destroy) {
		return this.removeAllChildComponentsByType(Moobile.Component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponentsByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllChildComponentsByType: function(type, destroy) {

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
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willRemoveChildComponent: function(component) {
		this.willRemoveChildComponent(component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didRemoveChildComponent: function(component) {
		this.didRemoveChildComponent(component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_setParent: function(parent) {

		if (this._parent === parent)
			return this;

		this._parentComponentWillChange(parent);
		this._parent = parent;
		this._parentComponentDidChange(parent);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_parentComponentWillChange: function(parent) {
		this.parentComponentWillChange(parent);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_parentComponentDidChange: function(parent) {

		if (parent) {
			if (this._display) {
				this._visible = this._isVisible();
			}
		} else {
			this._visible = this._display;
		}

		this.parentComponentDidChange(parent);
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
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_setWindow: function(window) {

		if (this._window === window)
			return this;

		this._windowWillChange(window);
		this._window = window;
		this._windowDidChange(window);

		this._children.invoke('_setWindow', window);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_windowWillChange: function(window) {
		this.windowWillChange(window);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_windowDidChange: function(window) {
		this.windowDidChange(window);
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
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @sinde 0.3.0
	 */
	_setReady: function(ready) {

		if (this._ready === ready)
			return this;

		this._willChangeReadyState();
		this._ready = ready;
		this._didChangeReadyState();

		this._children.invoke('_setReady', ready);

		this.fireEvent('ready');

		this._setUpdateLayout(ready);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_willChangeReadyState: function() {
		// no uses yet but just in case
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_didChangeReadyState: function() {
		if (this._ready) this.didBecomeReady();
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isBuilt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	isBuilt: function() {
		return this._built;
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

		this._setUpdateLayout(true);

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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hasStyle: function(name) {
		return this._style ? this._style.name === name : false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addClass: function(name) {

		if (this.element.hasClass(name) === false) {
			this.element.addClass(name);
			this._setUpdateLayout(true);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeClass: function(name) {

		if (this.element.hasClass(name) === true) {
			this.element.removeClass(name);
			this._setUpdateLayout(true);
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
		this._setUpdateLayout(true);
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

		if (this._size.x !== x ||
			this._size.y !== y) {
			this._setUpdateLayout(true);
		}

		this._size.x = x;
		this._size.y = y;

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
		return this.element.getPosition(document.id(relative) || this._parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#show
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	show: function() {

		if (this._display === true ||
			this._visible === true)
			return this;

		this._display = true;

		this._willShow();
		this.removeClass('hidden');
		this._didShow();

		this._setUpdateLayout(true);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willShow: function() {

		if (this._display === false ||
			this._visible === true)
			return;

		this.willShow();
		this._children.invoke('_willShow');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didShow: function() {

		if (this._display === false ||
			this._visible === true)
			return;

		this._visible = true;

		this.didShow();
		this.fireEvent('show');
		this._children.invoke('_didShow');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	hide: function() {

		if (this._display === false)
			return this;

		this._willHide();
		this.addClass('hidden');
		this._didHide();

		this._display = false;

		this._setUpdateLayout(false);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willHide: function() {

		if (this._display === false ||
			this._visible === false)
			return;

		this.willHide();
		this._children.invoke('_willHide');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didHide: function() {

		if (this._display === false ||
			this._visible === false)
			return;

		this._visible = false;

		this.didHide();
		this.fireEvent('hide');
		this._children.invoke('_didHide');
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
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_isVisible: function() {

		if (this._display) {

			return this._parent
			     ? this._parent._isVisible()
			     : true;
		}

		return false;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_setUpdateLayout: function(updateLayout, dispatcher) {

		updateLayout = updateLayout && this._built && this._ready && this._display && this._visible;

		if (this._updateLayout === updateLayout)
			return this;

		this._updateLayout = updateLayout;

		if (this._updateLayoutTimer) {
			this._updateLayoutTimer = cancelAnimationFrame(this._updateLayoutTimer);
		}

		if (this._updateLayout && !dispatcher) {
			this._updateLayoutTimer = requestAnimationFrame(this._didUpdateLayout.bind(this));
		}

		this._children.invoke('_setUpdateLayout', updateLayout, this);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_didUpdateLayout: function() {

		if (this._updateLayoutTimer) {
			this._updateLayoutTimer = cancelAnimationFrame(this._updateLayoutTimer);
		}

		if (this._updateLayout) {
			this._updateLayout = false;
			this.didUpdateLayout();
			this.fireEvent('layout')
		}

		this._children.invoke('_didUpdateLayout');
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
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

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	toElement: function() {
		return this.element;
	},

	/* Deprecated */

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setParentComponent: function(parent) {
		console.log('[DEPRECATION NOTICE] The method "setParentComponent" will be removed in 0.5, this is not part of the public API anymore');
		return this._setParent(parent);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setWindow: function(window) {
		console.log('[DEPRECATION NOTICE] The method "setWindow" will be removed in 0.5, this is not part of the public API anymore');
		return this._setWindow(window);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setReady: function(ready) {
		console.log('[DEPRECATION NOTICE] The method "setReady" will be removed in 0.5, this is not part of the public API anymore');
		return this._setReady(ready);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	eventIsNative: function(name) {
		console.log('[DEPRECATION NOTICE] The method "eventIsNative" will be removed in 0.6, use the method "shouldSupportNativeEvent" instead.');
		return this.shouldSupportNativeEvent(name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentOfType: function(type, name) {
		console.log('[DEPRECATION NOTICE] The method "getChildComponentOfType" will be removed in 0.5, use the method "getChildComponentByType" instead.');
		return this.getChildComponentByType(type, name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentOfTypeAt: function(type, index) {
		console.log('[DEPRECATION NOTICE] The method "getChildComponentOfTypeAt" will be removed in 0.5, use the method "getChildComponentByTypeAt" instead.');
		return this.getChildComponentByTypeAt(type, index);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentsOfType: function(type) {
		console.log('[DEPRECATION NOTICE] The method "getChildComponentsOfType" will be removed in 0.5, use the method "getChildComponentsByType" instead.');
		return this.getChildComponentsByType(type);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasChildComponentOfType: function(type) {
		console.log('[DEPRECATION NOTICE] The method "hasChildComponentOfType" will be removed in 0.5, use the method "hasChildComponentByType" instead.');
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
		console.log('[DEPRECATION NOTICE] The method "getDescendantComponent" will be removed in 0.5, use the method "getComponent" instead.');
		return this.getComponent(name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getComponentOfType: function(type, name) {
		console.log('[DEPRECATION NOTICE] The method "getComponentOfType" will be removed in 0.5, use the method "getComponentByType" instead.');
		return this.getComponentByType(type, name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasComponentOfType: function(type, name) {
		console.log('[DEPRECATION NOTICE] The method "hasComponentOfType" will be removed in 0.5, use the method "hasComponentByType" instead.');
		return this.hasComponentByType(type, name);
	}

});

/**
 * @hidden
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var getLastComponentIndex = function(root) {

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
			var found = getLastComponentIndex.call(this, node);
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
Moobile.Component.defineRole = function(name, context, options, handler) {

	context = (context || Moobile.Component).prototype;
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
Moobile.Component.defineAttribute = function(name, context, handler) {
	context = (context || Moobile.Component).prototype;
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
Moobile.Component.defineStyle = function(name, target, handler) {
	var context = (target || Moobile.Component).prototype;
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
Moobile.Component.create = function(klass, element, descriptor, options, name) {

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
Moobile.Component.defineAttribute('data-style', null, function(value) {
	this.options.styleName = value;
});

})();