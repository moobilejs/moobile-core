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
 * @see    http://moobilejs.com/doc/0.1/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component = new Class({

	Extends: Moobile.EventFirer,

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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	element: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#initialization
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
	 * @overridden
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponent: function(component, where) {

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				if (this.hasElement(element) === false) {
					this.element.grab(element, where);
				}
			}
		}

		return this._addChildComponentAt(component, where === 'top' ? 0 : this._children.length, elementHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponentInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponentInside: function(component, context, where) {

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

		return this._addChildComponentAt(component, this._children.length, elementHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponentAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponentAfter: function(component, after) {

		var index = this._children.length;
		if (after instanceof Moobile.Component) {
			index = this.getChildComponentIndex(after) + 1;
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

		return this._addChildComponentAt(component, index, elementHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponentBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponentBefore: function(component, before) {

		var index = this._children.length;
		if (before instanceof Moobile.Component) {
			index = this.getChildComponentIndex(before);
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

		return this._addChildComponentAt(component, index, elementHandler);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_addChildComponentAt: function(component, index, handler) {

		if (this.hasChildComponent(component))
			return this;

		component.removeFromParentComponent();

		this.willAddChildComponent(component);
		this._children.splice(index, 0, component);

		if (handler) handler.call(this);

		var componentParent = component.getParentComponent();
		if (componentParent === null) {
			component.setParentComponent(this);
		}

		this.didAddChildComponent(component);

		var componentWindow = component.getWindow();
		if (componentWindow === null) {
			component.setWindow(this._window);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponent: function(name) {
		return this._children.find(function(child) { return child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentOfType: function(type, name) {
		return this._children.find(function(child) { return child instanceof type && child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentOfTypeAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentOfTypeAt: function(type, index) {
		return this.getChildComponentsOfType(type)[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentIndex: function(component) {
		return this._children.indexOf(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponents: function() {
		return this._children;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentsOfType: function(type) {
		return this._children.filter(function(child) { return child instanceof type });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildComponent: function(component) {
		return this._children.contains(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildComponentOfType: function(type) {
		return this._children.some(function(child) { return child instanceof type; });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#replaceChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChildComponent: function(component, replacement, destroy) {
		return this.addChildComponentBefore(replacement, component).removeChildComponent(component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#replaceWithComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceWithComponent: function(component, destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.replaceChildComponent(this, component, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildComponent: function(component, destroy) {

		if (!this.hasChildComponent(component))
			return this;

		this.willRemoveChildComponent(component);

		component.setParentComponent(null);
		component.setWindow(null);
		component.setReady(false);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this._children.erase(component);

		this.didRemoveChildComponent(component);

		if (destroy) {
			component.destroy();
			component = null;
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeAllChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllChildComponents: function(destroy) {
		return this.removeAllChildComponentsOfType(Moobile.Component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllChildComponentsOfType: function(type, destroy) {

		this._children.filter(function(child) {
			return child instanceof type;
		}).invoke('removeFromParent', destroy);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeFromParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeFromParentComponent: function(destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.removeChildComponent(this, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentComponent: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasParentComponent: function() {
		return !!this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setWindow
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWindow: function() {
		return this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasWindow: function() {
		return !!this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setReady
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#isReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isReady: function() {
		return this._ready;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setStyle
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getStyle: function() {
		return this._style ? this._style.name : null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#toggleClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElements: function(selector) {
		return this.element.getElements(selector || '*');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getPosition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getPosition: function(relative) {
		return this.element.getPosition(document.id(relative) || this._parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#show
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hide
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#isVisible
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isVisible: function() {
		return this._visible;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#parentComponentWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentComponentWillChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#parentComponentDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentComponentDidChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.removeFromParentComponent();
		this.removeAllChildComponents(true);

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
 * @see    http://moobilejs.com/doc/0.1/Component/Component#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.defineRole = function(name, target, behavior) {
	Element.defineRole(name, target || Moobile.Component, behavior);
};

/**
 * @see    http://moobilejs.com/doc/0.1/Component/Component#defineStyle
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
 * @see    http://moobilejs.com/doc/0.1/Component/Component#getRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.getStyle = function(name, target) {
	return target.__styles__
		 ? target.__styles__[name]
		 : null;
};

/**
 * @see    http://moobilejs.com/doc/0.1/Component/Component#create
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
