/*
---

name: Element.Ingest

description: Provides extra methods to the Element prototype.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element.Ingest

...
*/


/**
 * Provides extra methods to the Element prototype.
 *
 * @name Element
 * @class Element
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Element.implement( /** @lends Element.prototype */ {

	/**
	 * Adopt all the child elements of an element.
	 * @param Element element The element.
	 * @return Element
	 * @since 0.1
	 */
	ingest: function(element) {
		return this.adopt(Array.from(document.id(element).childNodes));
	}

});
