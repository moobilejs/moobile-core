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
	
	content: null,

	element: null,

	wrapper: null,
	
	scroller: null,

	enabled: true,

	initialize: function(content) {
		this.content = content;
		return this;
	},

	setup: function() {
		this.enabled = true;
		this.wrapper = new Element('div.scroller-wrapper').set('html', this.content.get('html'));
		this.element = new Element('div.scroller-element');
		this.element.adopt(this.wrapper);
		this.content.empty();
		this.content.adopt(this.element);
		this.scroller = new iScroll(this.content, {desktopCompatibility: true, hScroll: false, vScroll: true});
		this.scroller.refresh();
		if (++Moobile.Scroller.instances == 1) document.addEventListener('touchmove', this.onDocumentTouchMove);
		return this;
	},

	destroy: function() {
		if (this.enabled == true) {
			this.enabled = false;
			this.scroller.destroy();
			this.scroller = null;
			this.wrapper.destroy();
			this.wrapper = null;
			this.element.destroy();
			this.element = null;
			if (--Moobile.Scroller.instances == 0) document.removeEventListener('touchmove', this.onDocumentTouchMove);
		}
		return this;
	},

	enable: function() {
		if (this.enabled == false) {
			this.enabled = true;
			this.scroller = new iScroll(this.content, { desktopCompatibility: true, hScroll: false, vScroll: true });
			this.scroller.refresh();
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