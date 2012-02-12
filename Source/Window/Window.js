/*
---

name: Window

description: Provides the root of a view hierarchy.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Window

...
*/

if (!window.$moobile) window.$moobile = {};

/**
 * @name  Window
 * @class Provides the root view of the entire view hierarchy.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @extends View
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Window = new Class( /** @lends Window.prototype */ {

	Extends: Moobile.View,

	willBuild: function() {
		this.parent();
		this.element.set('class', 'window');
		window.addEvent('load', this.bound('onWindowLoad'));
		window.addEvent('rotate', this.bound('onWindowRotate'));
		this.window = this; // weird but important
	},

	destroy: function() {
		window.removeEvent('load', this.bound('onWindowLoad'));
		window.removeEvent('rotate', this.bound('onWindowRotate'));
		this.parent();
	},

	didAddChild: function(entity) {
		this.parent(entity);
		entity.setWindow(this);
		entity.setParent(this);
	},

	onWindowLoad: function(e) {
		(function() { window.scrollTo(0, 1) }).delay(250);
	},

	onWindowRotate: function(e) {
		(function() { window.scrollTo(0, 1) }).delay(250);
	}
});
