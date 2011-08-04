/*
---

name: Window

description: Provides the area where the views will be stored and displayed.

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

	inputEnabled: true,

	inputMask: null,

	loadingIndicator: null,

	loadingIndicatorTimeout: null,

	options: {
		className: 'window',
		showLoadingIndicator: false,
		showLoadingIndicatorDelay: 0
	},

	startup: function() {

		window.$moobile.window = this;

		if (this.$started == false) {
			this.$started = true;
			this.init();
			this.attachEvents();
		}

		return this;
	},

	destroy: function() {

		window.$moobile = null;

		if (this.$started == true) {
			this.$started = false;
			this.detachEvents();
			this.release();
			this.content = null;
		}

		return this;
	},

	attachEvents: function() {
		window.addEvent('orientationchange', this.bound('onWindowOrientationChange'));
		window.addEvent('load', this.bound('onWindowLoad'));
		this.parent();
		return this;
	},

	detachEvents: function() {
		window.removeEvent('orientationchange', this.bound('onWindowOrientationChange'));
		window.removeEvent('load', this.bound('onWindowLoad'));
		this.parent();
		return this;
	},

	filterChildView: function(element) {
		return element.getParent('[data-role=view]') == null;
	},

	position: function() {
		window.scrollTo(0, 1);
		return this;
	},

	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return 'portrait';
			case 90: return 'landscape';
		}
	},

	enableInput: function() {
		if (this.inputEnabled == false) {
			this.inputEnabled = true;
			if (this.options.showLoadingIndicator) {
				this.hideLoadingIndicator();
				clearTimeout(this.loadingIndicatorTimeout);
			}
			this.hideMask();
		}
		return this;
	},

	disableInput: function() {
		if (this.inputEnabled == true) {
			this.inputEnabled = false;
			this.showMask();
			if (this.options.showLoadingIndicator) {
				this.loadingIndicatorTimeout = this.showLoadingIndicator.delay(this.options.showLoadingIndicatorDelay, this);
			}
		}
		return this;
	},

	showMask: function() {
		this.inputMask = new Element('div.' + this.options.className + '-mask');
		this.inputMask.inject(this.content);
		return this;
	},

	hideMask: function() {
		this.inputMask.destroy();
		this.inputMask = null;
		return this;
	},

	showLoadingIndicator: function() {
		if (this.inputMask) {
			this.inputMask.addClass('loading');
			this.loadingIndicator = new Element('div.' + this.options.className + '-loading-indicator');
			this.loadingIndicator.fade('hide');
			this.loadingIndicator.inject(this.inputMask);
			this.loadingIndicator.position()
			this.loadingIndicator.fade('show');
		}
		return this;
	},

	hideLoadingIndicator: function() {
		if (this.inputMask) {
			this.inputMask.removeClass('loading');

			if (this.loadingIndicator) {
				this.loadingIndicator.destroy();
				this.loadingIndicator = null;
			}
		}
		return this;
	},

	didAddChildView: function(view) {
		view.window = this;
		view.parentView = null;
		this.parent(view);
		return this;
	},

	onWindowOrientationChange: function() {
		this.position();
		this.fireEvent('orientationchange', this.getOrientation());
	},

	onWindowLoad: function(e) {
		this.position.delay(250);
		return this;
	}

});