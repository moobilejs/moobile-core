/*
---

name: UI.Bar

description: Provide the base class for a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.BarStyle

provides:
	- UI.Bar

...
*/

Moobile.UI.Bar = new Class({

	Extends: Moobile.UI.Control,

	contentElement: null,

	captionElement: null,

	options: {
		className: 'ui-bar',
		styleName: Moobile.UI.BarStyle.DefaultOpaque
	},

	build: function() {
		this.parent();
		this.buildContentElement();
		this.buildCaptionElement();
		return this;
	},

	buildContentElement: function() {
		this.contentElement = new Element('div.' + this.options.className + '-content');
		this.contentElement.adopt(this.element.childElements);
		this.element.adopt(this.contentElement);
		return this;
	},

	buildCaptionElement: function() {
		this.captionElement = new Element('div.' + this.options.className + '-caption');
		this.captionElement.adopt(this.contentElement.childElements);
		this.contentElement.adopt(this.captionElement);
		return this;
	},

	release: function() {
		this.contentElement = null;
		this.captionElement = null;
		this.parent();
		return this;
	},

	setText: function(text) {
		this.captionElement.set('html', text);
		return this;
	},

	getText: function() {
		return this.captionElement.get('html');
	}
});