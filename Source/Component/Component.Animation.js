/*
Class.refactor(Moobile.Component, {

	_animations: null,

	initialize: function(element, options, name) {

		this.parent(element, options, name);

		this._animations = new Moobile.Animation.Set();
		this._animations.setAnimation('show', new Moobile.Animation().setAnimationClass('show-animated'));
		this._animations.setAnimation('hide', new Moobile.Animation().setAnimationClass('hide-animated'));
		this._animations.setElement(this);

		this._animations.addEvent('start', this.bound('onAnimationSetStart'));
		this._animations.addEvent('end', this.bound('onAnimationSetEnd'));

		return this;
	},

	showAnimated: function() {
		this._animations.start('show');
		return this;
	},

	hideAnimated: function() {
		this._animations.start('hide');
		return this;
	},

	onAnimationSetStart: function(animation) {
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

	onAnimationSetEnd: function(animation) {
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

})
*/