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

	options: {
		className: 'ui-bar',
		styleName: Moobile.UI.BarStyle.DefaultOpaque
	},

	addBarButton: function(button, where, context) {
		return this.addChildControl(button, where, context);
	},

	getBarButton: function(name) {
		return this.getChildControl(name);
	},

	getBarButtons: function() {
		return this.getChildControls();
	},

	removeBarButton: function(button) {
		return this.removeChildControl(button);
	},

	removeBarButtons: function() {
		return this.removeChildControls();
	},

	viewWillChange: function(view) {
		if (this.view) this.view.removeClass('with-' + this.options.className);
		this.parent();
		return this;
	},

	viewDidChange: function(view) {
		if (this.view) this.view.addClass('with-' + this.options.className);
		this.parent();
		return this;
	},

	willShow: function() {
		if (this.view) this.view.addClass('with-' + this.options.className);
		this.parent();
		return this;
	},

	willHide: function() {
		if (this.view) this.view.removeClass('with-' + this.options.className);
		this.parent();
		return this;
	}

});