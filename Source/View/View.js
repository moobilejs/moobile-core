/*
---

name: View

description: Provides an element on the screen and the interfaces for managing
             the content in that area.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- View

...
*/

Moobile.View = new Class({

	Extends: Moobile.UI.Element,

	parentView: null,

	window: null,

	wrapper: null,

	content: null,

	childViews: [],

	childControls: [],

	childElements: [],

	navigationBar: null,

	started: false,

	options: {
		className: 'view',
		withContent: true,
		withWrapper: false
	},

	build: function() {
		if (this.options.withContent) this.buildContent();
		if (this.options.withWrapper) this.buildWrapper();
		this.parent();
		return this;
	},

	buildWrapper: function() {
		this.wrapper = new Element('div.' + this.options.className + '-wrapper');
		this.wrapper.adopt(this.element.getContents());
		this.element.adopt(this.wrapper);
		return this;
	},

	buildContent: function() {
		this.content = new Element('div.' + this.options.className + '-content');
		this.content.adopt(this.element.getContents());
		this.element.adopt(this.content);
		return this;
	},

	startup: function() {
		if (this.started == false) {
			this.started = true;
			this.attachChildViews();
			this.attachChildControls();
			this.attachChildElements();
			this.init();
			this.attachEvents();
		}
		return this;
	},

	isStarted: function() {
		return this.started;
	},

	destroy: function() {
		this.started = false;
		this.detachEvents();
		this.destroyChildViews();
		this.destroyChildControls();
		this.destroyChildElements();
		this.release();
		this.parentView = null;
		this.window = null;
		this.content = null;
		this.wrapper = null;
		this.navigationBar = null;
		this.parent();
		return this;
	},

	init: function() {
		return this;
	},

	release: function() {
		return this;
	},

	attachEvents: function() {
		return this;
	},

	detachEvents: function() {
		return this;
	},

	addChildView: function(view, where, context) {
		this.willAddChildView(view);
		this.grab(view, where, context);
		this.bindChildView(view);
		this.didAddChildView(view);
		return this;
	},

	getChildView: function(name) {
		return this.childViews.find(function(childView) {
			return childView.name == name;
		});
	},

	getChildViews: function() {
		return this.childViews;
	},

	removeChildView: function(view) {
		var removed = this.childViews.remove(view);
		if (removed) {
			this.willRemoveChildView(view);
			view.setParentView(null);
			view.setWindow(null);
			view.dispose();
			this.didRemoveChildView(view);
		}
		return this;
	},

	removeFromParentView: function() {
		var parent = this.parentView || this.window;
		if (parent) parent.removeChildView(this);
		return this;
	},

	bindChildView: function(view) {
		Object.assertInstanceOf(view, Moobile.View, 'Views must inherit Moobile.View');
		this.childViews.push(view);
		view.parentViewWillChange(this);
		view.setWindow(this.window);
		view.setParentView(this);
		view.parentViewDidChange(this);
		view.startup();
		view.attachEvents();
		this.didBindChildView(view);
		Object.member(this, view, view.name);
		return this;
	},

	attachChildViews: function() {
		var attach = this.bound('attachChildView');
		var filter = this.bound('filterChildView');
		this.getElements('[data-role=view]').filter(filter).each(attach);
		return this;
	},

	attachChildView: function(element) {
		var view = element.get('data-view');
		if (view == null) throw new Error('You have to define the view class using the data-view attribute.');
		this.bindChildView(Class.from(view, element));
		return this;
	},

	filterChildView: function(element) {
		return element.getParent('[data-role=view]') == this.element;
	},

	destroyChildViews: function() {
		this.childViews.each(this.bound('destroyChildView'));
		this.childViews = [];
		return this;
	},

	destroyChildView: function(view) {
		view.destroy();
		view = null;
		return this;
	},

	addChildControl: function(control, where, context) {
		this.willAddChildControl(control);
		this.grab(control, where, context);
		this.bindChildControl(control);
		this.didAddChildControl(control);
		return this;
	},

	getChildControl: function(name) {
		return this.childControls.find(function(control) {
			return control.name == name;
		});
	},

	getChildControls: function() {
		return this.childControls;
	},

	removeChildControl: function(control) {
		var removed = this.childControls.remove(control);
		if (removed) {
			this.willRemoveChildControl(control);
			control.dispose();
			this.didRemoveChildControl(control);
		}
		return this;
	},

	bindChildControl: function(control) {
		Object.assertInstanceOf(control, Moobile.UI.Control, 'Controls must inherit Moobile.UI.Control.');
		this.childControls.push(control);
		this.didBindChildControl(control);
		Object.member(this, control, control.name);
		return this;
	},

	attachChildControls: function() {
		var attach = this.bound('attachChildControl');
		var filter = this.bound('filterChildControl');
		this.getElements('[data-role=control]').filter(filter).each(attach);
		return this;
	},

	attachChildControl: function(element) {
		var control = element.get('data-control');
		if (control == null) throw new Error('You have to define the control class using the data-control attribute.');
		this.bindChildControl(Class.from(control, element));
		return this;
	},

	filterChildControl: function(element) {
		return element.getParent('[data-role=view]') == this.element;
	},

	destroyChildControls: function() {
		this.childControls.each(this.bound('destroyChildControl'));
		this.childControls = [];
		return this;
	},

	destroyChildControl: function(control) {
		control.destroy();
		control = null;
		return this;
	},

	addChildElement: function(element, where, context) {
		this.willAddChildElement(element);
		this.grab(element, where, context);
		this.bindChildElement(element);
		this.didAddChildElement(element);
		return this;
	},

	getChildElement: function(name) {
		return this.childElements.find(function(element) {
			return (element.name || element.get('data-name')) == name;
		});
	},

	getChildElements: function() {
		return this.childElements;
	},

	bindChildElement: function(element) {
		this.childElements.push(element);
		this.didBindChildElement(element);
		Object.member(this, element, element.get('data-name'));
		return this;
	},

	removeChildElement: function(element) {
		var removed = this.childElements.remove(element);
		if (removed) {
			this.willRemoveChildElement(element);
			element.dispose();
			this.didRemoveChildElement(element);
		}
		return this;
	},

	attachChildElements: function() {
		var attach = this.bound('attachChildElement');
		var filter = this.bound('filterChildElement');
		this.getElements('[data-role=element]').filter(filter).each(attach);
		return this;
	},

	attachChildElement: function(element) {
		this.bindChildElement(element);
		return this;
	},

	filterChildElement: function(element) {
		return element.getParent('[data-role=view]') == this.element;
	},

	destroyChildElements: function() {
		this.childControls.each(this.bound('destroyChildElement'));
		this.childControls = [];
		return this;
	},

	destroyChildElement: function(element) {
		element.destroy();
		element = null;
		return this;
	},

	setWindow: function(window) {
		this.window = window;
		return this;
	},

	getWindow: function() {
		return this.window;
	},

	setParentView: function(parentView) {
		this.parentView = parentView;
		return this;
	},

	getParentView: function() {
		return this.parentView;
	},

	getTitle: function() {
		return this.element.get('data-title') || 'Untitled';
	},

	getWrapper: function() {
		return this.wrapper;
	},

	getContent: function() {
		return this.content;
	},

	getSize: function() {
		return this.element.getSize();
	},

	getWrapperSize: function() {
		return this.wrapper ? this.wrapper.getSize() : null;
	},

	getContentSize: function() {
		return this.content ? this.content.getSize() : null;
	},

	getContentExtent: function() {
		var prev = this.wrapper.getPrevious();
		var next = this.wrapper.getNext();
		var size = this.getSize();
		if (prev) size.y = size.y - prev.getPosition().y - prev.getSize().y;
		if (next) size.y = size.y - next.getPosition().y;
		return size;
	},

	adopt: function() {
		var content = this.content || this.element;
		content.adopt.apply(content, arguments);
		return this;
	},

	grab: function(element, where, context) {
		if (context) {
			context = document.id(context);
			element.inject(context, where);
			return this;
		}
		(where == 'top' || where == 'bottom' ? this.element : this.content || this.element).grab(element, where);
		return this;
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

	didBindChildView: function(childView) {
		return this;
	},

	willRemoveChildView: function(childView) {
		return this;
	},

	didRemoveChildView: function(childView) {
		return this;
	},

	willAddChildControl: function(childControl) {
		return this;
	},

	didAddChildControl: function(childControl) {
		return this;
	},

	didBindChildControl: function(childControl) {
		return this;
	},

	willRemoveChildControl: function(childControl) {
		return this;
	},

	didRemoveChildControl: function(childControl) {
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

	didBindChildElement: function(childElement) {
		return this;
	}

});