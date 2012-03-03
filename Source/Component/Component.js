/*
---

name: Component

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventDispatcher

provides:
	- Component

...
*/

/**
 * @see    http://moobile.net/api/0.1/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component = new Class({

	Extends: Moobile.EventDispatcher,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_window: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_children: [],

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_visible: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_ready: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_style: null,

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	element: null,

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#initialization
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(element, options, name) {

		this.element = Element.from(element);
		if (this.element === null) {
			this.element = new Element(this.options.tagName);
		}

		this._name = name || this.element.get('data-name');

		options = options || {};

		for (var option in this.options) {
			var value = this.element.get('data-option-' + option.hyphenate());
			if (value !== null) {
				var number = Number(value);
				if (isFinite(number)) value = number;
				if (options[option] === undefined) {
					options[option] = value;
				}
			}
		}

		this.setOptions(options);

		this.willBuild();
		this.build();
		this.didBuild();

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	build: function() {

		var className = this.options.className;
		if (className) this.addClass(className);

		var styleName = this.options.styleName
		if (styleName) this.setStyle(styleName);

		this.element.executeDefinedRoles(this);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addEvent: function(type, fn, internal) {

		if (Moobile.Component.hasNativeEvent(type))
			this.element.addEvent(type, function(e) {
				this.fireEvent(type, e);
			}.bind(this), internal);

		return this.parent(type, fn, internal);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChild: function(component, where) {

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				if (this.hasElement(element) === false) {
					this.element.grab(element, where);
				}
			}
		}

		return this._addChildAt(component, where === 'top' ? 0 : this._children.length, elementHandler);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addChildInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildInside: function(component, context, where) {

		component.removeFromParent();

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				context = document.id(context) || this.getElement(context);
				if (this.hasElement(element) === false &&
					this.hasElement(context) === true) {
					context.grab(element, where);
				}
			}
		};

		return this._addChildAt(component, this._children.length, elementHandler);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildAfter: function(component, after) {

		component.removeFromParent();

		var index = this._children.length;
		if (after instanceof Moobile.Component) {
			index = this.getChildIndex(after) + 1;
		}

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				var context = document.id(after);
				if (context) {
					if (this.hasElement(element) === false &&
						this.hasElement(context) === true) {
						element.inject(context, 'after');
					}
				}
			}
		};

		return this._addChildAt(component, index, elementHandler);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildBefore: function(component, before) {

		component.removeFromParent();

		var index = this._children.length;
		if (before instanceof Moobile.Component) {
			index = this.getChildIndex(before);
		}

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				var context = document.id(before);
				if (context) {
					if (this.hasElement(element) === false &&
						this.hasElement(context) === true) {
						element.inject(context, 'before');
					}
				}
			}
		};

		return this._addChildAt(component, index, elementHandler);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_addChildAt: function(component, index, handler) {

		if (this.hasChild(component))
			return this;

		component.removeFromParent();

		this.willAddChild(component);
		this._children.splice(index, 0, component);

		var componentParent = component.getParent();
		if (componentParent === null) {
			component.setParent(this);
		}

		if (handler) handler.call(this);

		this.didAddChild(component);

		var componentWindow = component.getWindow();
		if (componentWindow === null) {
			component.setWindow(this._window);
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChild: function(name) {
		return this._children.find(function(child) { return child.getName() === name; });
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildOfType: function(type, name) {
		return this._children.find(function(child) { return child instanceof type && child.getName() === name; });
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildOfTypeAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildOfTypeAt: function(type, index) {
		return this.getChildrenOfType(type)[index] || null;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildIndex: function(component) {
		return this._children.indexOf(component);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildren
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildren: function() {
		return this._children;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildrenOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildrenOfType: function(type) {
		return this._children.filter(function(child) { return child instanceof type });
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hasChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChild: function(component) {
		return this._children.contains(component);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hasChildOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildOfType: function(type) {
		return this._children.some(function(child) { return child instanceof type; });
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#replaceChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChild: function(component, replacement, destroy) {
		return this.addChildBefore(replacement, component).removeChild(component, destroy);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#replaceWith
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceWith: function(component, destroy) {
		if (this._parent) {
			this._parent.replaceChild(this, component, destroy);
		}
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#removeChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChild: function(component, destroy) {

		if (!this.hasChild(component))
			return this;

		this.willRemoveChild(component);

		component.setParent(null);
		component.setWindow(null);
		component.setReady(false);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this._children.erase(component);

		this.didRemoveChild(component);

		if (destroy) {
			component.destroy();
			component = null;
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#removeChildren
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildren: function(destroy) {
		return this.removeChildrenOfType(Moobile.Component, destroy);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#removeChildrenOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildrenOfType: function(type, destroy) {

		var children = [];
		for (var i = 0; i < this._children.length; i++) {
			children[i] = this._children[i];
		}

		for (var i = children.length - 1; i >= 0; i--) {
			if (children[i] instanceof type) {
				children[i].removeFromParent(destroy);
			}
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#removeFromParent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeFromParent: function(destroy) {
		var parent = this.getParent();
		if (parent) parent.removeChild(this, destroy);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#setParent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParent: function(parent) {

		if (this._parent === parent)
			return this;

		this.parentWillChange(parent);
		this._parent = parent;
		this.parentDidChange(parent);

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getParent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParent: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hasParent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasParent: function() {
		return !!this._parent;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#setWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setWindow: function(window) {

		if (this._window === window)
			return this;

		this._window = window;

		this._children.invoke('setWindow', window);

		if (this._window) {
			this.setReady(true);
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWindow: function() {
		return this._window;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hasWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasWindow: function() {
		return !!this._window;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#setReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobile.net/api/0.1/Component/Component#isReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isReady: function() {
		return this._ready;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#setStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobile.net/api/0.1/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getStyle: function() {
		return this._style ? this._style.name : null;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#toggleClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hasElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getPosition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getPosition: function(relative) {
		return this.element.getPosition(document.id(relative) || this._parent);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#show
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobile.net/api/0.1/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobile.net/api/0.1/Component/Component#isVisible
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isVisible: function() {
		return this._visible;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#willBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#didBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#didBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#willAddChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChild: function(child) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#didAddChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChild: function(child) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#willRemoveChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChild: function(child) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#didRemoveChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChild: function(child) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#parentWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentWillChange: function(parent) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#parentDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentDidChange: function(parent) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#willShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#didShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#willHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#didHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.removeFromParent();
		this.removeChildren(true);

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
 * @see    http://moobile.net/api/0.1/Component/Component#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.defineRole = function(name, target, behavior) {
	Element.defineRole(name, target || Moobile.Component, behavior);
};

/**
 * @see    http://moobile.net/api/0.1/Component/Component#defineStyle
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
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
 * @see    http://moobile.net/api/0.1/Component/Component#getRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.getStyle = function(name, target) {
	return target.__styles__
		 ? target.__styles__[name]
		 : null;
};

/**
 * @see    http://moobile.net/api/0.1/Component/Component#create
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
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
Moobile.Component.addNativeEvent('animationEnd');
Moobile.Component.addNativeEvent('transitionEnd');

})();
