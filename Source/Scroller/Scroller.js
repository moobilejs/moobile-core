/*
---

name: Scroller

description: Provide a wrapper for iScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- Scroller

...
*/

Moobile.Scroller = new Class({

	Static: {
		instances: 0
	},

	Implements: [Events, Options],

	element: null,
	
	scroller: null,

	enabled: false,

	initialize: function(element) {
		this.element = element;
		return this;
	},

	setup: function() {
		if (++Moobile.Scroller.instances == 1) document.addEventListener('touchmove', this.onDocumentTouchMove);
		return this;
	},

	destroy: function() {
		if (this.enabled == true) {
			this.enabled = false;
			this.scroller.destroy();
			this.scroller = null;
			if (--Moobile.Scroller.instances == 0) document.removeEventListener('touchmove', this.onDocumentTouchMove);
		}
		return this;
	},

	enable: function() {
		if (this.enabled == false) {
			this.enabled = true;
			this.scroller = new iScroll(this.element, { desktopCompatibility: true, hScroll: false, vScroll: true });
			this.scroller.refresh();

			this.element.setStyle('overflow', 'visible');
		}
		return this;
	},

	disable: function() {
		if (this.enabled == true) {
			this.enabled = false;
			this.scroller.destroy();
			this.scroller = null;
		}
		return this;
	},

	refresh: function() {
		if (this.enabled) this.scroller.refresh();
		return this;
	},

	onDocumentTouchMove: function(e) {
		e.preventDefault();
	}

});