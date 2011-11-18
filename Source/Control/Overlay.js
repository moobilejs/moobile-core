/*
---

name: Mask

description: Provides a view that creates a mask over a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Mask

...
*/

Moobile.Overlay = new Class({

	Extends: Moobile.Entity,

	options: {
		className: 'overlay'
	},

	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('present');
		return this;
	},

	hideAnimated: function() {
		this.willHide();
		this.element.addClass('dismiss');
		return this;
	},

	didLoad: function() {
		this.parent();
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
	},

	willUnload: function() {
		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.parent();		
	},

	onAnimationEnd: function(e) {
		
		if (this.element.hasClass('present')) this.didShow();
		if (this.element.hasClass('dismiss')) {
			this.element.hide();
			this.didHide();		
		}
		
		this.element.removeClass('present');
		this.element.removeClass('dismiss');
	}

});
