/*
---

name: UI.Element

description: Provides an element handled by a view.

license: MIT-style license.

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/DOMReady
	- Core/Element
	- Core/Element.Style
	- Core/Element.Event
	- Core/Element.Dimensions
	- Core/Fx.Tween
	- Core/Fx.Morph
	- More/Class.Binds
	- More/Element.Shortcuts
	- Class-Extras/Class.Binds

provides:
	- UI.Element

...
*/

if (!window.UI) window.UI = {};

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
		
		if (this.occlude('element', this.element)) 
			return this.occluded;
		
		this.name = this.element.get('data-name');
		this.build();
		return this;
	},

	create: function() {
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
		if (this.element == null) this.element = this.create();
		return this;
	},

	getElement: function(selector) {
		return arguments.length ? this.element.getElement(arguments[0]) : this.element;
	},
	
	getElementContents: function() {
		return this.element.getContents();
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

	adopt: function() {
		this.element.adopt.apply(this.element, arguments);
		return this;
	},

	inject: function(element, where) {
		this.element.inject(element, where);
		return this;
	},

	grab: function(element, where) {
		this.element.grab(element, where);
		return this;
	},

	hook: function(element, where, context) {
		return context ? context.inject(element, where) : this.grab(element, where);
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