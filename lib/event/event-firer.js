"use strict"

require('../class/class-binds');
console.log(Class.Binds)
var fireEvent = Events.prototype.fireEvent

/**
 * @see http://moobilejs.com/doc/latest/Event/EventFirer
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var EventFirer = module.exports = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#on
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	on: function() {
		return this.addEvent.apply(this, arguments)
	},

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#off
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	off: function() {
		return this.removeEvent.apply(this, arguments)
	},

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#fireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#shouldFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	shouldFireEvent: function(type, args) {
		return true;
	},

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#willFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willFireEvent: function(type, args) {

	},

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#didFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didFireEvent: function(type, args) {

	}

});
