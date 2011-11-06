/*
---

name: EntityStyles

description: 

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras

provides:
	- EntityStyles

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.EntityStyles = new Class({

	Implements: Class.Binds,

	$styles: {},

	style: null,

	options: {
		styleName: null,
	},

	loadStyle: function() {
		
		this.styleWillLoad();
		
		var styleName = this.options.styleName
		if (styleName) {
			this.setStyle(styleName);
		}

		this.styleDidLoad();
	},

	setStyle: function(name) {

		if (this.style) {
			if (this.style.detach) {
				this.style.detach.call(this, this.element);
			}
		}

		var style = this.$styles[name];
		if (style) {
			if (style.attach) {
				style.attach.call(this, this.element);
			}			
		}

		this.style = style;

		return this;
	},
	
	getStyle: function() {
		return this.style;
	},
	
	styleWillLoad: function() {
		
	},
	
	styleDidLoad: function() {
		
	}

});