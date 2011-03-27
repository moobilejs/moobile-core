/*
---

name: Fx.CSS3

description: Provides webkit CSS 3 transitions support. Inspired by
             Fx.Tween.CSS3

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Element.Event
	- Core/Element.Style
	- Core/Fx.CSS
	- More/Class.Binds

provides:
	- Fx.CSS3

...
*/

(function() {

	/* vendor prefix */

	var prefix = '';
	if (Browser.safari || Browser.chrome) {
		prefix = 'webkit';
	} else if (Browser.firefox) {
		prefix = 'Moz';
	} else if (Browser.opera) {
		prefix = 'o';
	} else if (Browser.ie) {
		prefix = 'ms';
	}

	/* events */

	Element.NativeEvents[prefix + 'TransitionStart'] = 2;
	Element.NativeEvents[prefix + 'TransitionEnd'] = 2;
	Element.Events.transitionstart = { base: (prefix + 'TransitionStart') };
	Element.Events.transitionend = { base: (prefix + 'TransitionEnd') };

	/* styles */

	var setStyle = Element.prototype.setStyle;
	var getStyle = Element.prototype.getStyle;

	var setOpacity = Element.prototype.setOpacity;
	var getOpacity = Element.prototype.getOpacity;

	Element.implement({

		setOpacity: function(value) {
			setOpacity.call(this, value);
			this.style.visibility = 'visible';
			return this;
		},

		getOpacity: function() {
			return getOpacity.call(this);
		},

		setStyle: function(style, value) {
			var v = this.toVendor(style);
			return this.hasStyle(v) ? setStyle.call(this, v, value) : setStyle.call(this, style, value);
		},

		getStyle: function(style) {
			var v = this.toVendor(style);
			return this.hasStyle(v) ? getStyle.call(this, v) : getStyle.call(this, style);
		},

		hasStyle: function(style) {
			return this.style[style] != undefined;
		},

		toVendor: function(style) {
			return prefix + style.capitalize().camelCase();
		}

	});

})();

Fx.CSS3 = new Class({

	Extends: Fx.CSS,

	Implements: [Class.Binds],

	running: false,

	options: { transition: 'ease-in' },

	initialize: function(element, options){
		this.element = document.id(element);
		this.parent(options);
		this.duration = Fx.Durations[this.options.duration] || this.options.duration.toInt();
		this.transition = 'transition';
		return this;
	},

	attachEvents: function() {
		this.element.addEvent('transitionend', this.bound('onComplete'));
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('transitionend', this.bound('onComplete'));
		return this;
	},

	start: function() {
		this.setTransitionInitialState.delay(1, this);
		this.setTransitionParameters.delay(2, this);
		this.play.delay(3, this);
		return this;
	},

	setTransitionInitialState: function() {
		return this;
	},

	setTransitionParameters: function() {
		return this;
	},

	play: function() {
		this.running = true;
		this.time = Date.now();
		return this;
	},

	stop: function() {
		if (this.running) {
			this.running = false;
			if (this.time + this.options.duration <= Date.now()) {
				this.fireEvent('complete', this.element);
				var chain = this.callChain();
				if (chain == false) this.fireEvent('chainComplete', this.element);
			} else {
				this.fireEvent('stop', this.element);
			}
			this.detachEvents();
			this.element.setStyle(this.transition, null);
		}
		return this;
	},

	cancel: function() {
		if (this.running) {
			this.running = false;
			this.fireEvent('cancel', this.element);
			this.clearChain();
			this.detachEvents();
		}
		return this;
	},

	pause: function() {
		throw new Error('Pause is not yet supported.');
		return this;
	},

	resume: function() {
		throw new Error('Resume is not yet supported.');
		return this;
	},

	isRunning: function() {
		return this.running;
	},

	onComplete: function(e) {
		if (this.element == e.target) {
			this.stop();
		}
		return this;
	}

});