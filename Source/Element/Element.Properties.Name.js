/*
---

name: Element.Properties.Name

description: Provides a name element properties.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element.Properties.Name

...
*/

Element.Properties.name = {

	set: function(name) {

		var role = this.get('data-role');
		if (role) {
			return this.set('data-name', name);
		}

		return this.setProperty('name', name);
	},

	get: function() {

		var role = this.get('data-role');
		if (role) {
			var name = this.get('data-name');
			if (name == null) {
				name = role + '-' + String.uniqueID();
				this.set('name', name);
			}
			return name;
		}

		return this.getProperty(name);
	}

};