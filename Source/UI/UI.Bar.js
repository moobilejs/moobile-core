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

	options: {
		className: 'ui-bar',
		styleName: Moobile.UI.BarStyle.DefaultOpaque
	},

	setup: function() {
		this.parent();
		this.injectContent();
		return this;
	},

	teardown: function() {
		this.destroyContent();
		this.parent();
		return this;
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
		return this;
	},

	show: function() {
		this.view.addClass(this.options.className + '-visible');
		this.parent();
		return this;
	},

	hide: function() {
		this.view.removeClass(this.options.className + '-visible');
		this.parent();
		return this;
	}

});