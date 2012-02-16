/*
---

name: Entity

description: Provides the base class for Moobile objects.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Class-Extras/Class.Binds

provides:
	- Entity

...
*/

if (!window.Moobile) window.Moobile = {};

(function() {

var fireEvent = Events.prototype.fireEvent;

/**
 * @see http://moobile.net/api/0.1/Entity/Entity
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Entity = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#fireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	fireEvent: function(type, args, delay) {

		args = Array.from(args).include(this);

		if (!this.eventShouldFire(type, args))
			return this;

		this.willFireEvent(type, args);
		fireEvent.call(this, type, args, delay);
		this.didFireEvent(type, args);

		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#eventShouldFire
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	eventShouldFire: function(type, args) {
		return true;
	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#willFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willFireEvent: function(type, args) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Entity/Entity#didFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didFireEvent: function(type, args) {

	}

});

})();