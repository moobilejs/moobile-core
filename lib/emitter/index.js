"use strict"

var fireEvent = Events.prototype.fireEvent

/**
 * @see http://moobilejs.com/doc/latest/EventFirer/EventEmitter
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var Emitter = new Class({

	Implements: [
		Events,
		Options
	],

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__bound: {},

	/**
	 * http://moobilejs.com/doc/latest/EventFirer/EventFirer#bound
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	bound: function(name) {
		var func = this[name];
		if (typeof func === 'function') return this.__bound[name] ? this.__bound[name] : this.__bound[name] = func.bind(this)
		throw new Error('Cannot bind function ' + name);
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

module.exports = Emitter;