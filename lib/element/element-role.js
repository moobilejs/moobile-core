"use strict"

Element.implement({

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#setRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 */
	 setRole: function(role) {
	 	return this.set('data-role', role);
	 },

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 getRole: function(role) {
	 	return this.get('data-role');
	 },

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#ingest
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	ingest: function(element) {
		return this.adopt(document.id(element).childNodes);
	}

});