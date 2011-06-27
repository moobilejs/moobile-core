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

	content: null,

	caption: null,

	options: {
		className: 'ui-bar',
		styleName: Moobile.UI.BarStyle.DefaultOpaque
	},

	build: function() {
		this.parent();
		this.buildContent();
		this.buildCaption();
		return this;
	},

	buildContent: function() {
		this.content = new Element('div.' + this.options.className + '-content');
		this.content.adopt(this.element.getContents());
		this.element.adopt(this.content);
		return this;
	},

	buildCaption: function() {
		this.caption = new Element('div.' + this.options.className + '-caption');
		this.caption.adopt(this.content.getContents());
		this.content.adopt(this.caption);
		return this;
	},

	release: function() {
		this.content = null;
		this.caption = null;
		this.parent();
		return this;
	}
});