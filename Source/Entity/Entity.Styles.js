/*
---

name: Entity.Styles

description: 

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- Entity.Styles

...
*/

(function() {
	
var styles = {};

Moobile.Entity.defineStyle = function(name, target, def) {
	if (target) {
		target.prototype.$styles[name] = def
	} else {
		styles[name] = def;
	}
};	

Moobile.Entity.Styles = new Class({

	Implements: Class.Binds,

	$styles: {},

	style: null,

	options: {
		styleName: null,
	},

	loadStyle: function() {

		var styleName = this.options.styleName
		if (styleName) {
			this.setStyle(styleName);
		}

		return this;
	},

	setStyle: function(name) {

		if (this.style) {
			if (this.style.detach) {
				this.style.detach.call(this, this.element);
			}
		}

		var style = styles[name] || this.$styles[name];
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
	}

});	
	
})();