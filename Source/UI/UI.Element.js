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
		Class.Binds
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
		this.element.addClass(this.options.className);
		this.name = this.element.getProperty('data-name');
		this.build();
		return this;
	},

	create: function() {
		return new Element('div');
	},

	build: function() {
		return this;
	},

	setElementOptions: function() {
		var options = this.element.getProperty('data-options');
		if (options) {
			Object.append(this.options,  JSON.decode('{' + options + '}'));
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

	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	toElement: function() {
		return this.element;
	},

	show: function() {
		this.element.show();
		return this;
	},

	hide: function() {
		this.element.hide();
		return this;
	},

	fade: function(how) {
		this.element.fade(how);
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

	inject: function(element, where) {
		this.element.inject(element, where);
		return this;
	},

	adopt: function() {
		this.element.adopt.apply(this.element, arguments);
		return this;
	},

	grab: function(element, where) {
		this.element.grab(element, where);
		return this;
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