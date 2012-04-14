/*
---

name: EventFirer

description: Provides the base class for Moobile objects.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Class-Extras/Class.Binds

provides:
	- EventFirer

...
*/

if (!window.Moobile) window.Moobile = {};

(function() {

var fireEvent = Events.prototype.fireEvent;

/**
 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.EventFirer = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#fireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	fireEvent: function(type, args, delay) {

		args = Array.from(args).include(this);

		if (!this.shouldFireEvent(type, args))
			return this;

		this.willFireEvent(type, args);
		fireEvent.call(this, type, args, delay);
		this.didFireEvent(type, args);

		return this;
	},

	/**
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#shouldFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	shouldFireEvent: function(type, args) {
		return true;
	},

	/**
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#willFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willFireEvent: function(type, args) {

	},

	/**
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#didFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didFireEvent: function(type, args) {

	}

});

})();