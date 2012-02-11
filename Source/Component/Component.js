/*
---

name: Component

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- Component

...
*/

Moobile.Component = new Class({

	Extends: Moobile.Entity,

	/**
	 * @private
	 */
	$roles: {},

	/**
	 * @private
	 */
	$styles: {},

	/**
	 * @private
	 */
	_window: null,

	/**
	 * @private
	 */
	_parent: null,

	/**
	 * @private
	 */
	_children: [],

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	element: null,

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#style
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	style: null,

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#ready
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	ready: false,

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#name
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	name: null,

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#options
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#initialization
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(element, options, name) {

		this.name = name;

		this.element = Element.from(element);
		if (this.element == null) {
			this.element = new Element(this.options.tagName);
		}

		options = options || {};

		for (var option in this.options) {
			var value = this.element.get('data-option-' + option.hyphenate());
			if (value != null) {
				var number = parseFloat(value);
				if (!isNaN(number)) value = number;
				if (options[option] == undefined) {
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
	 * @private
	 */
	build: function() {

		var className = this.options.className;
		if (className) this.addClass(className);

		var styleName = this.options.styleName
		if (styleName) this.setStyle(styleName);

		this.element.getRoleElements().each(function(element) {
			this.attachRole(element);
		}, this);
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChild: function(child, where, context) {

		if (this.hasChild(child))
			return this;

		child.removeFromParent();

		this.willAddChild(child);

		var element = child.getElement();
		if (element && !this.hasElement(element)) {
			context = document.id(context) || this.element;
			context = this.hasElement(context) ? context : this.element;
			element.inject(context, where || 'bottom');
		}

		this._children.push(child);
		child.setParent(this);
		this.didAddChild(child);

		this.addEvent('ready:once', function() {
			child.setWindow(this._window);
			child.setReady();
		}.bind(this));

		if (this.ready) {
			this.fireEvent('ready');
		}

		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChild: function(name) {
		return this._children.find(function(child) {
			return child.getName() == name;
		});
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getChildAt
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#hasChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChild: function(child) {
		return this._children.contains(child);
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getChildren
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildren: function(type) {
		return type
			? this._children.filter(function(child) { return child instanceof type })
			: this._children;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#replaceChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChild: function(child, replacement) {
		return this.addChild(replacement, 'before', child).removeChild(child);
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChild: function(child) {

		if (!this.hasChild(child))
			return this;

		this.willRemoveChild(child);
		child.setParent(null);
		child.setWindow(null);

		var element = document.id(child);
		if (element) {
			element.dispose();
		}

		this._children.erase(child);
		this.didRemoveChild(child);

		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#replaceChildren
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildren: function(type) {
		this.getChildren(type).each(this.bound('removeChild'));
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#removeFromParent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeFromParent: function() {
		var parent = this.getParent();
		if (parent) parent.removeChild(this);
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#setParent
	 *
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
	 * @see http://moobile.net/api/0.1/Entity/Entity#getParent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParent: function() {
		return this._parent;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#hasParent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasParent: function() {
		return !!this._parent;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#setWindow
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setWindow: function(window) {
		this._window = window;
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getWindow
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWindow: function() {
		return this._window;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#hasWindow
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasWindow: function() {
		return !!this._window;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#setReady
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setReady: function() {

		if (this.ready)
			return this;

		this.ready = true;
		this.didBecomeReady();
		this.fireEvent('ready');

		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#isReady
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isReady: function() {
		return this.ready;
	},

	/**
	 * TODO rename and explain
	 */
	attachRole: function(element, role) {

		if (element.retrieve('moobile.entity.role'))
			return this;

		if (this.element.ownsRoleElement(element)) {

			var name = role || element.get('data-role');
			if (name) {

				element.store('moobile.entity.role', name);

				var handler = this.$roles[name];
				if (handler) {
					handler.call(this, element);
					return this;
				}

				throw new Error('The role ' + name + ' has not been defined');
			}
		}

		throw new Error('The role element does not beling in this entity');
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getName
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this.name;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#setStyle
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setStyle: function(name) {

		if (this.style) {
			this.style.detach.call(this, this.element);
		}

		var style = this.$styles[name];
		if (style) {
			style.attach.call(this, this.element);
		}

		this.style = style;

		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getStyle
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getStyle: function() {
		return this.style ? this.style.name : null;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#addClass
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#addClass
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#toggleClass
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getElement
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getElements
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#hasElement
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getSize
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#getPosition
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getPosition: function(relative) {
		return this.element.getPosition(document.id(relative) || this._parent);
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#show
	 *
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
	 * @see http://moobile.net/api/0.1/Entity/Entity#hide
	 *
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
	 * @see http://moobile.net/api/0.1/Entity/Entity#willBuild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#didBuild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#didBecomeReady
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#willAddChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChild: function(entity) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#didAddChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChild: function(entity) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#willRemoveChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChild: function(entity) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#didRemoveChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChild: function(entity) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#parentWillChange
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentWillChange: function(parent) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#parentDidChange
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentDidChange: function(parent) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#willShow
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#didShow
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#willHide
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#didHide
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#destroy
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.removeFromParent();

		var entity = this._children.getLast();
		while (entity) {
			entity.destroy();
			entity = this._children.getLast();
		}

		this.element.destroy();
		this.element = null;
		this._window = null;
		this._parent = null;

		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#destroyChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroyChild: function(entity) {
		entity.destroy();
		entity = null;
	},

	/**
	 * @private
	 */
	addEvent: function(type, fn, internal) {
		if (Moobile.NativeEvents.contains(type)) {
			this.element.addEvent(type, function(e) {
				e.targetComponent = this;
				e.targetElement = this.element;
				this.fireEvent(type, e);
			}.bind(this), internal);
		}
		return this.parent(type, fn, internal);
	},

	toElement: function() {
		return this.element;
	}

});

Moobile.Component.defineRole = function(name, target, behavior) {
	(target || Moobile.Component).prototype.$roles[name] = behavior;
};

Moobile.Component.defineStyle = function(name, target, behavior) {
	(target || Moobile.Component).prototype.$styles[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, behavior);
};

Moobile.Component.fromElement = function(element, property, type) {

	var name = element.get('data-name');

	var klass = element.get(property);
	if (klass) {

		var child = Class.instantiate(klass, element, null, name);
		if (child instanceof type) {
			return child;
		}

		throw new Error('Class ' + klass + ' is not a proper instance.');
	}

	return new type(element, null, name);
};