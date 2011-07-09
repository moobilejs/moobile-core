/*
---

name: Object

description: Provides extra methods to Object.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Object

...
*/

Object.extend({

	defineMember: function(source, reference, name) {
		if (name) {
			name = name.camelize();
			if (source[name] == null || source[name] == undefined) {
				source[name] = reference;
			}
		}
		return source;
	}

})