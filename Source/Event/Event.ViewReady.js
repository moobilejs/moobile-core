/*
---

name: Event.ViewReady

description: Provide an element that will be automatically fired when added
             after being fired for the first time.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Custom-Event/Element.defineCustomEvent

provides:
	- Event.ViewReady

...
*/

(function() {

var executed = false;

Element.defineCustomEvent('viewready', {

	condition: function(e) {
		executed = true;
		return true;
	},

	onSetup: function() {
		if (executed) {
			this.fireEvent('viewready');
		}
	}

});

})();