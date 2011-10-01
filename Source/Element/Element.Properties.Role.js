/*
---

name: Element.Properties.Role

description: Provides a role property.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Element

provides:
	- Element.Properties.Role

...
*/

Element.Properties.role={

	get: function() {

		var role = this.get('data-role');
		if (role == null)
			return null;

		role = role.trim();
		role = role.toLowerCase();

		var object = Moobile.View.Roles[role] || null;
		if (object) {
			object.name = role;
		}

		return object;
	},

	set: function(value) {
		this.set('data-role', value);
	}

};