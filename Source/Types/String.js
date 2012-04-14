/*
---

name: String

description: Provides extra methods to the String prototype.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/Types/String
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
String.implement({

	/**
	 * @see    http://moobilejs.com/doc/0.1/Types/String#toCamelCase
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	toCamelCase: function() {
		return this.camelCase().replace('-', '').replace(/\s\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
	}

});
