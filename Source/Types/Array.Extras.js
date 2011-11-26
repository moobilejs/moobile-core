/*
---

name: Array.Extras

description: Provides extra methods to the Array prototype.

license: MIT-style license.

requires:
	- Core/Array

provides:
	- Array.Extras

...
*/

/**
 * Provides extra methods to the Array prototype.
 *
 * @name Array
 * @class Array
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Array.implement( /** @lends Array.prototype */ {

	/**
	 * Return an element based on a callback.
	 * @param {Function} fn The search function.
	 * @return {Mixed}
	 * @since 0.1
	 */
	find: function(fn) {
		for (var i = 0; i < this.length; i++) {
			var found = fn.call(this, this[i]);
			if (found == true) {
				return this[i];
			}
		}
		return null;
	},

	/**
	 * Return an item of the array at an offset starting from the last position.
	 * @param {Integer} offset The offset.
	 * @return {Mixed}
	 * @since 0.1
	 */
	lastItemAt: function(offset) {
		offset = offset ? offset : 0;
		return this[this.length - 1 - offset] ?
			   this[this.length - 1 - offset] :
			   null;
	}
});
