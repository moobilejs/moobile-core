/*
---

name: Event.ViewReady

description: Provides an event that indicates the view is ready to be 
             manipulated. This event is instanly triggered when added once it's
             been triggered one.

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