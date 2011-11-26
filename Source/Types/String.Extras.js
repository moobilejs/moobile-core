/*
---

name: String.Extras

description: Provides extra methods to the String prototype.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String.Extras

...
*/

/**
 * Provides extra methods to the String prototype.
 *
 * @name String
 * @class String
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
String.implement({

	/**
	 * Enhance the current camelCase method.
	 * @return {String}
	 * @since 0.1
	 */
	toCamelCase: function() {
		return this.camelCase().replace('-', '').replace(/\s\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
	}

});
