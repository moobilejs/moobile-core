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


Element.implement({

	ingest: function(element) {
		return this.adopt(Array.from(document.id(element).childNodes));
	},

	/**
	 * Returns an element with a given `data-role` attribute.
	 *
	 * This method will discard any element with a `data-role` attribue that
	 * are child of another element with a `data-role` attribute unless the
	 * latter is this entity's lement.
	 *
	 * @param {String} role The role name.
	 *
	 * @return {Element} The element or `null` if no elements were found.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getRoleElement: function(role) {
		return this.getRoleElements(role)[0] || null;
	},

	/**
	 * Returns a collection of element with a given `data-role` attribute.
	 *
	 * This method will discard any element with a `data-role` attribue that
	 * are child of another element with a `data-role` attribute unless the
	 * latter is this entity's lement.
	 *
	 * @param {String} role The role name.
	 *
	 * @return {Elements} A collection of elements.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getRoleElements: function(role) {

		var validate = this.ownsRoleElement.bind(this);
		var selector = role
		             ? '[data-role=' + role + ']'
		             : '[data-role]';

		return this.getElements(selector).filter(validate);
	},

	/**
	 * Indicate whether an element is owned by this element.
	 *
	 * This method will indicate whether the given element not is a child
	 * element with a `data-role` attribute unless the element with the
	 * `data-role` attribute is the element itself.
	 *
	 * @param {Element} element The element.
	 *
	 * @return {Boolean} Whether an element is owned by this element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	ownsRoleElement: function(element) {

		var parent = element.getParent();
		if (parent) {

			if (parent === this)
				return true;

			if (parent.get('data-role'))
				return false;

			return this.ownsRoleElement(parent);
		}

		return false;
	},

});
