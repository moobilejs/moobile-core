/*
---

name: Popover

description: Provides a Popover control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Component

provides:
	- Popover

...
*/

Moobile.Popover = new Class({

	Extends: Moobile.Component,

	content: null,

	visible: false,

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

		this.contentElement = new Element('div.popover-content');
		this.contentElement.inject(this.element);

		this.animations = new Moobile.Animation.Set();
		this.animations.setAnimation('show', new Moobile.Animation().setAnimationClass('show-animated'));
		this.animations.setAnimation('hide', new Moobile.Animation().setAnimationClass('hide-animated'));
		this.animations.setElement(this);

		this.animations.addEvent('start', this.bound('_onAnimationSetStart'));
		this.animations.addEvent('end', this.bound('_onAnimationSetEnd'));

		this.hide();
	},

	didBecomeReady: function() {
		this.parent();
		if (this.options.autoHide) this.getWindow().addEvent('tap', this.bound('_onTapOut'));
	},

	destroy: function() {
		if (this.options.autoHide) {
			var window = this.getWindow();
			if (window) {
				window.removeEvent('tap', this.bound('_onTapOut'));
			}
		}
		this.parent();
	},

	addChild: function(component, where) {
		if (where === 'header') return this.parent(child, 'top');
		if (where === 'footer') return this.parent(child, 'bottom');
		return this.addChildComponentInside(component, this.contentElement, where);
	},

	position: function(x, y) {

		if (!this.isReady()) throw new Error('Popover is not ready therefore cannot be positionned');

		this.element.show();
		var size = this.element.getSize();
		this.element.hide();

		if (x instanceof Element || x instanceof Moobile.Component) {

			var relative = y instanceof Element || y instanceof Moobile.Component ? y : null;

			var s = x.getSize();
			var p = x.getPosition(relative);

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

	_onTapOut: function(e, sender) {
		if (this.options.autoHide && this.isVisible() && !this.element.contains(e.target)) {
			if (this.options.autoHideAnimated) {
				this.hideAnimated();
			} else {
				this.hide();
			}
		}
	},

	_onAnimationSetStart: function(animation) {
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

	_onAnimationSetEnd: function(animation) {
		switch (animation.getName()) {
			case 'show':
				this._visible = true;
				this.element.removeClass('hidden');
				this.didShow();
				this.fireEvent('show');
				break;
			case 'hide':
				this._visible = false;
				this.element.hide();
				this.element.addClass('hidden');
				this.didHide();
				this.fireEvent('hide');
				break;
		}
	}

});
