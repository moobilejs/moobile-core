/*
---

name: UI.Element

description: Provides an element handled by a view.

license: MIT-style license.

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Event
	- Core/DOMReady
	- Core/Element
	- Core/Element.Style
	- Core/Element.Event
	- Core/Element.Dimensions
	- More/Element.Shortcuts
	- More/Class.Occlude
	- Class-Extras/Class.Binds
	- Object.Extras
	- String.Extras
	- Array.Extras
	- Class.Instanciate
	- Element.Extras

provides:
	- UI.Element

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.UI) window.Moobile.UI = {};

Moobile.UI.Element = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds,
		Class.Occlude
	],

	element: null,

	name: null,

	options: {
		className: ''
	},

	initialize: function(element, options) {
		this.setElement(element);
		this.setElementOptions();
		this.setOptions(options);
		this.name = this.element.get('data-name');
		this.build();
		return this;
	},

	createElement: function() {
		return new Element('div');
	},

	build: function() {
		this.element.addClass(this.options.className);
		return this;
	},

	setElementOptions: function() {
		var options = this.element.get('data-options');
		if (options) {
			options = '{' + options + '}';
			options = JSON.decode(options);
			Object.append(this.options, options);
		}
		return this;
	},

	setElement: function(element) {
		if (this.element == null) this.element = document.id(element);
		if (this.element == null) this.element = document.getElement(element);
		if (this.element == null) this.element = this.createElement();
		return this;
	},

	getElement: function(selector) {
		return this.element.getElement(selector);
	},

	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	toElement: function() {
		return this.element;
	},

	show: function() {
		this.element.show();
		this.fireEvent('show');
		return this;
	},

	hide: function() {
		this.element.hide();
		this.fireEvent('hide');
		return this;
	},

	fade: function(how) {
		this.element.fade(how);
		this.fireEvent('fade', how);
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

	getStyle: function(style) {
		return this.element.getStyle(style);
	},

	removeStyle: function(style) {
		this.element.setStyle(style, null);
	},

	getProperty: function(name) {
		return this.element.get(name);
	},

	setProperty: function(name, value) {
		this.element.set(name, value);
		return this;
	},

	removeProperty: function(name) {
		this.element.erase(name);
		return this;
	},

	isChild: function() {
		return this.element.isChild();
	},

	isOrphan: function() {
		return this.element.isOrphan();
	},

	adopt: function() {
		this.element.adopt.apply(this.element, arguments);
		return this;
	},

	inject: function(element, where) {
		if (where == 'header') where = 'top';
		if (where == 'footer') where = 'bottom';
		this.element.inject(element, where);
		return this;
	},

	grab: function(element, where) {
		if (where == 'header') where = 'top';
		if (where == 'footer') where = 'bottom';
		this.element.grab(element, where);
		return this;
	},

	hook: function(element, where, context) {

		if (element.isChild())
			return this;

		if (context) {
			if (where == 'header') where = 'top';
			if (where == 'footer') where = 'bottom';
		}

		return context ? element.inject(context, where) : this.grab(element, where);
	},

	empty: function() {
		this.element.empty();
		return this;
	},

	dispose: function() {
		this.element.dispose();
		return this;
	},

	destroy: function() {
		this.element.destroy();
		this.element = null;
		return this;
	}

});