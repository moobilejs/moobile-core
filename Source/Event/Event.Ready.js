/*
---

name: Event.Ready

description: Provides an event that indicates the app is loaded. This event is
             based on the domready event or other third party events such as
             deviceready on phonegap.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Core/DOMReady
	- Custom-Event/Element.defineCustomEvent
	- Browser.Platform

provides:
	- Event.Ready

...
*/

(function() {

	var onReady = function() {
		window.fireEvent('ready');
	};

	Element.defineCustomEvent('ready', {

		onSetup: function() {

			if (Browser.Platform.cordova) {
				document.addEventListener('deviceready', onReady);
				return;
			}

			window.addEvent('domready', onReady);
		},

		onTeardown: function() {

			if (Browser.Platform.cordova) {
				document.removeEventListener('deviceready', onReady);
				return;
			}

			window.removeEvent('domready', onReady);
		}

	});

	// simulator hook
	window.addEvent('ready', function() {
		if (parent) {
			parent.fireEvent('appready');
		}
	});

})();
