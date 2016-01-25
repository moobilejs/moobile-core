"use strict"

var onReady = function() {
	window.fireEvent('ready');
};

Element.defineCustomEvent('ready', {

	onSetup: function() {

		if (Browser.Platform.cordova) {
			document.onListener('deviceready', onReady);
			return;
		}

		window.addEvent('domready', onReady);
	},

	onTeardown: function() {

		if (Browser.Platform.cordova) {
			document.offListener('deviceready', onReady);
			return;
		}

		window.removeEvent('domready', onReady);
	}

});

// simulator hook
window.addEvent('ready', function() {
	if (parent &&
		parent.fireEvent) {
		parent.fireEvent('appready');
	}
});
