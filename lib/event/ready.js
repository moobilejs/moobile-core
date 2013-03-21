"use strict"

var onReady = function() {
	window.emit('ready');
};

Element.defineCustomEvent('ready', {

	onSetup: function() {

		if (Browser.Platform.cordova) {
			document.onListener('deviceready', onReady);
			return;
		}

		window.on('domready', onReady);
	},

	onTeardown: function() {

		if (Browser.Platform.cordova) {
			document.offListener('deviceready', onReady);
			return;
		}

		window.off('domready', onReady);
	}

});

// simulator hook
window.on('ready', function() {
	if (parent &&
		parent.emit) {
		parent.emit('appready');
	}
});
