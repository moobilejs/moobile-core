/*
---

name: Window

description: Provides the root container for all views.

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

Moobile.Window = new Class({

	Extends: Moobile.View,

	ready: true,

	options: {
		className: 'window'
	},

	initialize: function(options) {
		var element = new Element('div#window');
		element.inject(document.body);
		this.parent(element, options);
		return this;
	},

	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return 'portrait';
			case 90: return 'landscape';
		}
	},

	position: function() {
		window.scrollTo(0, 1);
		return this;
	},

	didLoad: function() {		
		window.addEvent('load', this.bound('onWindowLoad'));
		window.addEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	willUnload: function() {
		window.removeEvent('load', this.bound('onWindowLoad'));
		window.removeEvent('orientationchange', this.bound('onWindowOrientationChange'));		
	},

	didAddChild: function(entity) {
		entity.setWindow(this);
	},

	onWindowLoad: function(e) {
		this.position.delay(250);
		return this;
	},

	onWindowOrientationChange: function() {
		this.position();
		this.fireEvent('orientationchange', this.getOrientation());
	}
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.Window, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.WindowContent, element, null, name);

	if (instance instanceof Moobile.WindowContent) {
		this.addChild(instance);
		this.content = instance; // must be assigned after addChild is called		
	}

	return instance;
});
