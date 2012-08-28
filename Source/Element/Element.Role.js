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
 * @see    http://moobilejs.com/doc/latest/Element/Element.Role#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @eduted 0.2.0
 * @since  0.1.0
 * @deprecated 0.2.0
 */
Element.defineRole = function(name, context, behavior) {

	console.log("[DEPRECATION NOTICE] Element.defineRole will be removed in version 0.3.");

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
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRoleDefinition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	 getRoleDefinition: function(context) {
	 	console.log("[DEPRECATION NOTICE] Element.getRoleDefinition will be removed in version 0.3.");
	 	return (context || this).__roles__
	 	     ? (context || this).__roles__[this.getRole()]
	 	     : null;
	 },

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	getRoleElement: function(role) {
		console.log("[DEPRECATION NOTICE] Element.getRoleElement will be removed in version 0.3.");
		return this.getRoleElements(role)[0] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRoleElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	getRoleElements: function(role) {

		console.log("[DEPRECATION NOTICE] Element.getRoleElements will be removed in version 0.3.");

		var validate = this.ownsRoleElement.bind(this);
		var selector = role
		             ? '[data-role=' + role + ']'
		             : '[data-role]';

		return this.getElements(selector).filter(validate);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#ownsRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	ownsRoleElement: function(element) {

		console.log("[DEPRECATION NOTICE] Element.ownsRoleElement will be removed in version 0.3.");

		var parent = element.parentNode;
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
	 * @see    http://moobilejs.com/doc/latest/Element/Element#executeDefinedRoles
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	executeDefinedRoles: function(context) {

		console.log("[DEPRECATION NOTICE] Element.executeDefinedRoles will be removed in version 0.3.");

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