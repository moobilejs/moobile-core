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

	Element.NativeEvents.deviceready = 1;

	var domready = Browser.Platform.phonegap ? 'deviceready' : 'domready';

	var onReady = function(e) {
		this.fireEvent('ready');
	};

	Element.defineCustomEvent('ready', {

		onSetup: function() {
			this.addEvent(domready, onReady);
		},

		onTeardown: function() {
			this.removeEvent(domready, onReady);
		}

	});

})();
