/*
---

name: View

description: Provides the base class for every objects that are displayed 
             through an element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Array
	- Core/String
	- Core/Number
	- Core/Function
	- Core/Object
	- Core/Event
	- Core/DOMReady
	- Core/Element
	- Core/Element.Style
	- Core/Element.Event
	- Core/Element.Dimensions
	- More/Element.Shortcuts
	- Class-Extras/Class.Binds
	- Class-Extras/Class.Singleton
	- Event.ViewLoad
	- Event.ViewReady
	- Object.Extras
	- Element.Properties.Name
	- Element.Properties.Role
	- Element.Properties.Options
	- Element.Ingest
	- Element.Styles
	- String.Extras
	- Array.Extras
	- Class.Instanciate

provides:
	- View

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.View = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	window: null,

	name: null,

	ready: null,

	element: null,

	content: null,

	childViews: [],

	parentView: null,

	options: {
		className: 'view'
	},

	initialize: function(element, options, name) {

		this.setOptions(options);

		this.name = name || null;

		this.build(element);

		return this;
	},

	build: function(element) {

		this.element = document.id(element) || new Element('div');

		this.element.set('role', 'view');

		var content = this.getElement('[data-role=content]');
		if (content == null) {
			content = new Element('div[data-role=content]');
			content.ingest(this.element);
			content.inject(this.element);
		}

		this.content = content;

		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
			this.content.addClass(className + '-content');
		}

		return this;
	},

	startup: function() {

		if (this.ready == true)
			return this;

		this.ready = true;

		this.attachRoleElements();
		this.init();
		this.attachEvents();

		return this;
	},

	destroy: function() {

		if (this.ready == false)
			return this;

		this.detachRoleElements();
		this.detachEvents();
		this.destroyChildViews();
		this.release();

		this.removeFromParentView();

		this.element.destroy();
		this.element = null;
		this.content = null;
		this.window = null;

		this.ready = false;

		return this;
	},

	init: function() {
		return this;
	},

	release: function() {
		return this;
	},

	attachEvents: function() {
		this.element.addEvent('swipe', this.bound('onViewSwipe'));
		this.element.addEvent('click', this.bound('onViewClick'));
		this.element.addEvent('mouseup', this.bound('onViewMouseUp'))
		this.element.addEvent('mousedown', this.bound('onViewMouseDown'));
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('swipe', this.bound('onViewSwipe'));
		this.element.removeEvent('click', this.bound('onViewClick'));
		this.element.removeEvent('mouseup', this.bound('onViewMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onViewMouseDown'));
		return this;
	},

	attachRoleElements: function() {
		this.getElements('[data-role]').each(this.bound('attachRoleElement'));
		return this;
	},

	attachRoleElement: function(element) {
		var role = element.get('role');
		if (role) {

			var instance = this.getRoleInstance(element);
			if (instance instanceof Moobile.View) {
				this.addChildView(instance);
			}

			if (role.onAttach) {
				role.onAttach.call(element);
			}
		}
		return this;
	},

	detachRoleElements: function() {
		this.getElements('[data-role]').each(this.bound('detachRoleElement'));
		return this;
	},

	detachRoleElement: function(element) {
		var role = element.get('role');
		if (role) {
			if (role.onDetach) {
				role.onDetach.call(element);
			}
		}
		return this;
	},

	getRoleInstance: function(element) {

		var role = element.get('role');
		if (role) {
			var instance = element.retrieve('moobile:role-instance');
			if (instance == null) {
				if (role.apply) {
					instance = role.apply.call(element);
					element.store('moobile:role-instance', instance);
				}
			}
			return instance;
		}

		return null;
	},

	addChildView: function(view, where, context) {

		var exists = this.childViews.contains(view);
		if (exists == true)
			return this;

		var element = view.getElement();

		this.willAddChildView(view);
		view.parentViewWillChange(this);
		view.setParentView(this);
		view.setWindow(this.window);
		this.childViews.push(view);

		var contains = this.element.contains(element);
		if (contains == false) {
			if (context) {
				element.inject(context, where);
			} else {
				switch (where) {
					case 'header': this.element.grab(element, 'top');    break;
					case 'footer': this.element.grab(element, 'bottom'); break;
					default:	   this.content.grab(element, where);	 break;
				}
			}
		}

		view.parentViewDidChange(this);
		view.startup();
		this.didAddChildView(view);

		Object.defineMember(this, view, view.name);

		return this;
	},

	getChildView: function(name) {
		return this.childViews.find(function(childView) {
			return childView.getName() == name;
		});
	},

	getChildViewAt: function(index) {
		return this.childViews[index] || null;
	},

	replaceChildView: function(replace, view) {
		return this.addChildView(view, 'before', replace).removeChildView(replace);
	},

	removeChildView: function(view) {

		var exists = this.childViews.contains(view);
		if (exists == false)
			return this;

		var element = view.getElement();

		this.willRemoveChildView(view);
		view.parentViewWillChange(null);
		view.setParentView(null);
		view.setWindow(null);
		view.parentViewDidChange(null);
		element.dispose();
		this.childViews.erase(view);
		this.didRemoveChildView(view);

		return this;
	},

	removeFromParentView: function() {
		var parent = this.parentView || this.window;
		if (parent) parent.removeChildView(this);
		return this;
	},

	destroyChildViews: function() {
		this.childViews.each(this.bound('destroyChildView'));
		this.childViews.empty();
		return this;
	},

	destroyChildView: function(view) {
		view.destroy();
		view = null;
		return this;
	},

	show: function() {
		this.willShow();
		this.element.show();
		this.didShow();
		return this;
	},

	hide: function() {
		this.willHide();
		this.element.hide();
		this.didHide();
		return this;
	},

	setWindow: function(window) {
		this.window = window;
		return this;
	},

	getWindow: function(window) {
		return this.window;
	},

	getName: function() {
		return this.name;
	},

	isReady: function() {
		return this.ready;
	},

	getElement: function(selector) {
		return selector ? this.element.getElements(selector)[0] || null : this.element;
	},

	getElements: function(selector) {
		return this.element.getElements(selector).filter(this.bound('filterElement'));
	},

	filterElement: function(element) {

		var roles = [];

		var keys = Moobile.View.Roles;
		for (var key in keys) {
			if (keys[key].stop) roles.push(key);
		}

		var parent = element.getParent('[data-role]');
		while (true) {

			if (parent == null) {
				return true
			}

			var role = parent.get('role');
			if (role && role.stop) {
				if (roles.contains(role.name)) {
					return parent === this.element;
				}
			}

			parent = parent.getParent('[data-role]');
		}

		return false;
	},

	getContent: function() {
		return this.content;
	},

	setParentView: function(parentView) {
		this.parentView = parentView;
		return this;
	},

	getParentView: function() {
		return this.parentView;
	},

	getChildViews: function() {
		return this.childViews;
	},

	get: function(name) {
		
		switch (name) {
			case 'html':
			case 'text':
				return this.content.get(name);
			default:
				return this.element.get(name);
		}
		
		return t;
	},

	set: function(name, value) {
		
		switch (name) {
			case 'html':
			case 'text':
				this.content.set(name, value);
				break;
			default:
				this.element.set(name, value);
				break;
		}
						
		return this;
	},

	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	setStyle: function(style, value) {
		this.element.setStyle(style, value);
		return this;
	},

	setStyles: function(styles) {
		this.element.setStyles(styles);
		return this;
	},

	getStyle: function(style) {
		return this.element.getStyle(style);
	},

	getStyles: function(styles) {
		return this.element.getStyles(styles);
	},

	removeStyle: function(style) {
		this.element.removeStyle(style);
		return this;
	},

	removeStyles: function(styles) {
		this.element.removeStyles(styles);
		return this;
	},

	getSize: function() {
		return this.element.getSize();
	},

	parentViewWillChange: function(parentView) {
		return this;
	},

	parentViewDidChange: function(parentView) {
		return this;
	},

	willAddChildView: function(childView) {
		return this;
	},

	didAddChildView: function(childView) {
		return this;
	},

	willRemoveChildView: function(childView) {
		return this;
	},

	didRemoveChildView: function(childView) {
		return this;
	},

	willAddChildElement: function(childElement) {
		return this;
	},

	didAddChildElement: function(childElement) {
		return this;
	},

	willRemoveChildElement: function(childElement) {
		return this;
	},

	didRemoveChildElement: function(childElement) {
		return this;
	},

	willShow: function() {
		return this;
	},

	didShow: function() {
		return this;
	},

	willHide: function() {
		return this;
	},

	didHide: function() {
		return this;
	},

	onViewSwipe: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
		return this;
	},

	onViewClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
		return this;
	},

	onViewMouseUp: function(e) {
		e.target = this;
		this.fireEvent('mouseup', e);
		return this;
	},

	onViewMouseDown: function(e) {
		e.target = this;
		this.fireEvent('mousedown', e);
		return this;
	},

	toElement: function() {
		return this.element;
	}

});