/*
---

name: Element

description: Provides extra methods to the Element prototype.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element

...
*/


(function() {

var adopt = Element.prototype.adopt;

Element.implement({

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#ingest
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	ingest: function(element) {
		return this.adopt(document.id(element).childNodes);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#adopt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	adopt: function() {
		if (arguments.length === 1) {
			var arg = arguments[0];
			if (typeof arg === 'string') {
				var args = Elements.from(arg);
				if (args.length) {
					return adopt.apply(this, args);
				}
			}
		}
		return adopt.apply(this, arguments);
	}

});

})();