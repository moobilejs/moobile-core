/*
---

name: Popover

description: Provides a Popover control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Popover

...
*/

Moobile.Popover = new Class({

	Extends: Moobile.Control,

	content: null,

	visible: false,

	showAnimation: null,

	hideAnimation: null,

	options: {
		autoHide: true,
		autoHideAnimated: true,
		direction: 'top',
		alignment: 'center'
	},

	willBuild: function() {

		this.parent();

		this.element.addClass('popover');
		this.element.addClass('popover-direction-' + this.options.direction);
		this.element.addClass('popover-alignment-' + this.options.alignment);

		this.content = new Element('div.popover-content');
		this.content.inject(this.element);

		this.animations = new Moobile.Animation.Set();
		this.animations.setAnimation('show', new Moobile.Animation().setAnimationClass('show-animated'));
		this.animations.setAnimation('hide', new Moobile.Animation().setAnimationClass('hide-animated'));
		this.animations.setElement(this);

		this.animations.addEvent('start', this.bound('onAnimationStart'));
		this.animations.addEvent('end', this.bound('onAnimationEnd'));
	},

	addChild: function(child, where, context) {

		if (this.hasChild(child))
			return false;

		if (where == 'header') return this.parent(child, 'top', context);
		if (where == 'footer') return this.parent(child, 'bottom', context);

		if (context == undefined)
			context = this.content;

		this.parent(child, where, context);
	},

	position: function(x, y) {

		this.element.show();
		var size = this.element.getSize();
		this.element.hide();

		if (x instanceof Element || x instanceof Moobile.Entity) {

			var s = x.getSize();
			var p = x.getPosition();

			switch (this.options.direction) {
				case 'top':
					x = p.x + s.x / 2;
					y = p.y + s.y;
					break;
				case 'bottom':
					x = p.x + s.x / 2;
					y = p.y;
					break;
				case 'left':
					x = p.x + s.x;
					y = p.y + s.y / 2;
					break;
				case 'right':
					x = p.x;
					y = p.y + s.y / 2;
					break;
			}
		}

		switch (this.options.direction) {
			case 'top':
				// y = y;
				break;
			case 'bottom':
				y = y - size.y;
				break;
			case 'left':
				// x = x;
				break;
			case 'right':
				x = x - size.x;
				break;
		}

		switch (this.options.alignment) {
			case 'left':
				// x = x;
				break;
			case 'right':
				x = x - size.x;
				break;
			case 'center':
				x = x - size.x / 2;
				break;
			case 'top':
				// y = y;
				break;
			case 'bottom':
				y = y - size.y;
				break;
			case 'middle':
				y = y - size.y / 2;
				break;
		}

		this.element.setStyle('top', Math.round(y));
		this.element.setStyle('left', Math.round(x));
	},

	showAnimated: function() {
		this.animations.start('show');
		return this;
	},

	hideAnimated: function() {
		this.animations.start('hide');
		return this;
	},

	didBecomeReady: function() {
		console.log(this.getWindow());
		console.log(this);
	},

	didShow: function() {
		this.parent();
		this.visible = true;
		if (this.options.autoHide) {
			var win = this.getWindow();
			if (win) {
				win.addEvent('tap', this.bound('onTapOut'));
			}
		}
	},

	didHide: function() {
		this.parent();
		this.visible = false;
	},

	onTapOut: function() {
		if (this.options.autoHide) {
			if (this.options.autoHideAnimated) {
				this.hideAnimated();
			} else {
				this.hide();
			}
		}
	},

	onAnimationStart: function(animation) {
		switch (animation.getName()) {
			case 'show':
				this.willShow();
				this.element.show();
				break;
			case 'hide':
				this.willHide();
				break;
		}
	},

	onAnimationEnd: function(animation) {
		switch (animation.getName()) {
			case 'show':
				this.element.addClass('visible');
				this.didShow();
				this.fireEvent('show');
				break;
			case 'hide':
				this.element.hide();
				this.element.removeClass('visible');
				this.didHide();
				this.fireEvent('hide');
				break;
		}
	}

});
