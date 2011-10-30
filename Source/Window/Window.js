/*
---

name: Window

description: Provides the root container for all views.

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

var windowInstance = null;

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

		if (windowInstance == null) {
			windowInstance = this;
		} else {
			throw new Error('Only one window windowInstance is allowed.');	
		}
		
		return this;
	},

	startup: function() {
		window.$moobile.window = this;
		this.parent();
		return this;
	},

	destroy: function() {
		window.$moobile = null;
		windowInstance = null;
		this.parent();
		return;
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

	getRootView: function() {
		return this.children[0];
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
			if (this.options.showLoadingIndicator) {
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
			if (this.options.showLoadingIndicator) {
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

	position: function() {
		window.scrollTo(0, 1);
		return this;
	},

	didAddChild: function(view) {
		view.setOwner(null);
		view.setWindow(this);
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
		return windowInstance;
	}

});

})();