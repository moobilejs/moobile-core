/*
---

name: UI.Control

description: Provides base events for the UI control object.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Extras/UI.Control

provides:
	- UI.Control

...
*/

(function() {

var setElement = UI.Control.prototype.setElement;

Class.refactor(UI.Control, {

	style: null,

	options: {
		className: '',
		styleName: ''
	},

	initialize: function(element, options) {
		this.setElement(element);
		this.setOptions(options);
		this.setStyle(this.options.styleName);
		return this.parent(element, options);
	},

	setElement: function(element) {
		setElement.call(this, element);
		if (this.element == null) this.element = this.create()
		return this;
	},

	create: function() {
		return new Element('div');
	},

	setStyle: function(style) {
		this.removeClass(this.style);
		this.addClass(style);
		this.style = style;
		return this;
	},

	getStyle: function() {
		return this.style;
	}

});

})();