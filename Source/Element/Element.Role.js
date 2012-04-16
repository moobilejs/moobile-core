/*
---

name: Element.Role

description: Provides extra methods to the Element prototype.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Element

provides:
	- Element.Role

...
*/

(function() {

/**
 * @see    http://moobilejs.com/doc/0.1/Element/Element.Role#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Element.defineRole = function(name, context, behavior) {

	context = (context || Element).prototype;
	if (context.__roles__ === undefined) {
		context.__roles__ = {};
	}

	if (behavior instanceof Function) {
		behavior = {behavior: behavior};
	}

	context.__roles__[name] = Object.append({traversable: false}, behavior);
};

Element.implement({

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#setRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 setRole: function(role) {
	 	return this.set('data-role', role);
	 },

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 getRole: function(role) {
	 	return this.get('data-role');
	 },

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRoleDefinition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 getRoleDefinition: function(context) {
	 	return (context || this).__roles__
	 	     ? (context || this).__roles__[this.getRole()]
	 	     : null;
	 },

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRoleElement: function(role) {
		return this.getRoleElements(role)[0] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRoleElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRoleElements: function(role) {

		var validate = this.ownsRoleElement.bind(this);
		var selector = role
		             ? '[data-role=' + role + ']'
		             : '[data-role]';

		return this.getElements(selector).filter(validate);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#ownsRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#executeDefinedRoles
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	executeDefinedRoles: function(context) {

		context = context || this;

		this.getRoleElements().each(function(element) {
			var role = element.getRoleDefinition(context);
			if (role) {
				var func = role.behavior;
				if (func instanceof Function) {
					func.call(context, element);
				}
				if (role.traversable) {
					element.executeDefinedRoles(context);
				}
			} else {
				throw new Error('Role ' + element.getRole() + ' is undefined');
			}
		}, this);

		return this;
	}

});

})();