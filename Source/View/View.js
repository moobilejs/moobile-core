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

	window: null,

	parentView: null,

	wrapper: null,

	content: null,

	childViews: [],

	childElements: [],

	childControls: [],

	activated: false,

	options: {
		title: 'View',
		className: 'view',
		createWrapper: false,
		createContent: true
	},

	initialize: function(element, options) {
		this.parent(element, options);
		this.setup();
		return this;
	},

	setup: function() {
		if (this.options.createContent) this.injectContent();
		if (this.options.createWrapper) this.injectWrapper();
		return this;
	},

	teardown: function() {
		if (this.options.createContent) this.destroyContent();
		if (this.options.createWrapper) this.destroyWrapper();
		return this;
	},

	activate: function() {
		if (this.activated == false) {
			this.activated = true;
			this.startup();
			this.attachEvents();
		}
		return this;
	},

	deactivate: function() {
		if (this.activated == true) {
			this.activated = false;
			this.detachEvents();
			this.shutdown();
		}
		return this;
	},

	startup: function() {
		this.attachChildElements();
		this.attachChildControls();
		return this;
	},

	shutdown: function() {
		this.destroyChildElements();
		this.destroyChildControls();
		this.destroyChildViews();
		this.destroy();
		return this;
	},

	attachEvents: function() {
		return this;
	},

	detachEvents: function() {
		return this;
	},

	destroyChildViews: function() {
		this.childViews.each(function(view) { view.deactivate(); });
		this.childViews = null;
		this.childViews = [];
		return this;
	},

	destroyChildElements: function() {
		this.childElements.each(function(element) { element.destroy(); });
		this.childElements = null;
		this.childElements = [];
		return this;
	},

	destroyChildControls: function() {
		this.childControls.each(function(control) { control.destroy(); });
		this.childControls = null;
		this.childControls = [];
		return this;
	},

	injectWrapper: function() {
		this.wrapper = new Element('div.' + this.options.className + '-wrapper').adopt(this.element.getContents());
		this.element.adopt(this.wrapper);
		return this;
	},

	destroyWrapper: function() {
		this.wrapper.destroy();
		this.wrapper = null;
		return this;
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content').adopt(this.element.getContents());
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
		return this;
	},

	addChildView: function(view, where, context) {
		this.childViews.push(view);
		view.setParentView(this);
		view.setWindow(this.window);
		this.grab(view, where, context);
		return this;
	},

	removeChildViews: function() {
		this.childViews.each(this.removeChildView.bind(this));
		this.childViews = null;
		this.childViews = [];
		return this;
	},

	removeChildView: function(view) {
		var removed = this.childViews.remove(view);
		if (removed) view.dispose();
		return this;
	},

	removeFromParentView: function() {
		var parent = this.parentView || this.window;
		if (parent) parent.removeChildView(this);
		return this;
	},

	attachChildControls: function() {
		this.element.getElements('[data-role=control]').each(this.attachChildControl.bind(this));
		return this;
	},

	attachChildControl: function(element) {
		var control = Class.from(element.getProperty('data-control') || 'UI.Control', element);
		this.childControls.push(control);
		this.memberize(control);
		return this;
	},

	detachChildControls: function() {
		this.childControls = null;
		this.childControls = [];
		return this;
	},

	detachChildControl: function(control) {
		this.childControls.remove(control);
		return this;
	},

	addChildControl: function(control, where, context) {
		this.grab(control, where, context);
		this.memberize(control);
		return this;
	},

	getChildControl: function(name) {
		return this.childControls.find(function(control) { return control.name == name; });
	},

	removeChildControls: function() {
		this.childControls.each(this.removeChildElement.bind(this));
		this.childControls = null;
		this.childControls = [];
		return this;
	},

	removeChildControl: function(control) {
		var removed = this.childControls.remove(control);
		if (removed) control.dispose();
		return this;
	},

	attachChildElements: function() {
		this.element.getElements('[data-role=element]').each(this.attachChildElement.bind(this));
		return this;
	},

	attachChildElement: function(element) {
		this.childElements.push(element);
		this.memberize(element);
		return this;
	},

	detachChildElements: function() {
		this.childElements = null;
		this.childElements = [];
		return this;
	},

	detachChildElement: function(element) {
		this.childElements.remove(element);
		return this;
	},

	addChildElement: function(element, where, context) {
		this.attachChildElement(element);
		this.grab(element, where, context);
		return this;
	},

	getChildElement: function(name) {
		return this.childElements.find(function(element) { return element.getProperty('data-name') == name; });
	},

	removeChildElements: function() {
		this.childElements.each(this.removeChildElement.bind(this));
		this.childElements = null;
		this.childElements = [];
		return this;
	},

	removeChildElement: function(element) {
		var removed = this.childElements.remove(element);
		if (removed) element.dispose();
		return this;
	},

	memberize: function(element) {
		if (element.name) {
			element._prop = element.name.camelize();
			if (this[element._prop] == null || this[element._prop] == undefined) {
				this[element._prop] = element;
			}
		}
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
		return this.element.getProperty('data-title') || this.options.title;
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

	getContentSize: function() {
		return this.content.getSize();
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

	destroy: function() {
		this.detachEvents();
		this.teardown();
		this.parent();
		return this;
	},

	orientationDidChange: function() {
		return this;
	},

	willEnter: function() {
		return this;
	},

	didEnter: function() {
		return this;
	},

	willLeave: function() {
		return this;
	},

	didLeave: function() {
		return this;
	},

	didRemove: function() {
		return this;
	}

});