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

(function() {

var instance = null;

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

	initialize: function(element, options, name) {

		this.parent(element, options, name);

		if (instance == null) {
			instance = this;
			return this;
		}

		throw new Error('Only one window instance is allowed.');

		return this;
	},

	startup: function() {

		window.$moobile.window = this;

		if (this.ready == true)
			return this;

		this.ready = true;
		this.init();
		this.attachEvents();

		return this;
	},

	destroy: function() {

		window.$moobile = null;

		if (this.ready == false)
			return this;

		this.ready = false;
		this.detachEvents();
		this.release();

		instance = null;

		return this;
	},

	attachEvents: function() {
		window.addEvent('load', this.bound('onWindowLoad'));
		window.addEvent('orientationchange', this.bound('onWindowOrientationChange'));
		this.parent();
		return this;
	},

	detachEvents: function() {
		window.removeEvent('load', this.bound('onWindowLoad'));
		window.removeEvent('orientationchange', this.bound('onWindowOrientationChange'));
		this.parent();
		return this;
	},

	filterElement: function(element) {
		return element.getParent('[data-role]') == null;
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
		view.setWindow(this);
		view.setParentView(null);
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

Moobile.Window.extend({

	getInstance: function() {
		return instance;
	}

});

})();