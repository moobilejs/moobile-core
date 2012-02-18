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
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_name: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_window: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_parent: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_children: [],

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_ready: false,

	/**
	 * @private
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
			if (value != null) {
				var number = parseFloat(value);
				if (!isNaN(number)) value = number;
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
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	build: function() {

		var className = this.options.className;
		if (className) this.addClass(className);

		var styleName = this.options.styleName
		if (styleName) this.setStyle(styleName);

		this.element.getRoleElements().each(function(element) {
			var role = element.get('data-role');
			var func = Moobile.Component.getRole(role, this);
			if (func) {
				func.call(this, element);
				return;
			}
			throw new Error('Role ' + role + ' is undefined');
		}, this);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addEvent: function(type, fn, internal) {

		if (Moobile.NativeEvents.contains(type)) this.element.addEvent(type, function(e) {
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
	 * @see    http://moobile.net/api/0.1/Component/Component#addChildInto
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildInto: function(child, context, where) {

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				context = document.id(context);
				if (this.hasElement(element) === false &&
					this.hasElement(context) === true) {
					context.grab(element, where);
				}
			}
		};

		// TODO: Maybe find the next or previous view element, compute the
		// index and add it properly

		return this._addChildAt(component, this._children.length, elementHandler);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildAfter: function(component, after) {

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

		return this._addChildAt(child, index, elementHandler);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#addChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildBefore: function(component, before) {

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
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_addChildAt: function(component, index, elementHandler) {

		if (this.hasChild(component))
			return this;

		component.removeFromParent();

		this.willAddChild(component);
		this._children.splice(index, 0, component);
		component.setParent(this);
		component.setWindow(this._window);

		if (elementHandler) {
			elementHandler.call(this);
		}

		this.didAddChild(component);

		component.setReady(this._ready);

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChild: function(name) {
		return this._children.find(function(child) {
			return child.getName() === name;
		});
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
	getChildOfTypeAt: function(index, type) {
		return this.getChildOfType(type)[index] || null;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildIndex: function(child) {
		return this._children.indexOf(child);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildren
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildren: function(type) {
		return this._children;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getChildrenOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildrenOfType: function(type) {
		return this._children.filter(function(child) { return child instanceof type })
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hasChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChild: function(child) {
		return this._children.contains(child);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hasChildOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildOfType: function(type) {
		return this.getChildrenOfType(type).length > 0;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#replaceChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChild: function(child, replacement, destroy) {
		return this.addChildBefore(child, replacement).removeChild(child, destroy);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#removeChild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChild: function(child, destroy) {

		if (!this.hasChild(child))
			return this;

		this.willRemoveChild(child);
		child.setParent(null);
		child.setWindow(null);
		child.setReady(false);

		var element = child.getElement();
		if (element) {
			element.dispose();
		}

		this._children.erase(child);

		this.didRemoveChild(child);

		if (destroy) {
			child.destroy();
			child = null;
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#removeChildren
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildren: function(destroy) {

		var children = Array.clone(this._children);
		for (var i = children.length - 1; i >= 0; i--) {
			children[i].removeFromParent(destroy);
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#removeChildrenOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildrenOfType: function(type, destoy) {

		var children = Array.clone(this._children);
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
		this._window = window;
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

		if (ready) {
			if (this._parent instanceof Moobile.Window) this._window = this._parent;
			if (this._parent instanceof Moobile.Component) this._window = this._parent.getWindow();
		}

		this._children.invoke('setReady', [ready]);

		if (ready) {
			this.didBecomeReady();
			this.fireEvent('ready');
		}

		this._ready = ready;

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

		this.willShow();
		this.element.show();
		this.didShow();

		this.fireEvent('show');

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hide: function() {

		this.willHide();
		this.element.hide();
		this.didHide();

		this.fireEvent('hide');

		return this;
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
	var context = (target || Moobile.Component).prototype;
	if (context.__roles__ === undefined) {
		context.__roles__ = {};
	}
	context.__roles__[name] = behavior;
};

/**
 * @see    http://moobile.net/api/0.1/Component/Component#getRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.getRole = function(name, target) {
	return target.__roles__
		 ? target.__roles__[name]
		 : null;
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
