/*
---

name: Object

description: Provides extra methods to the object class.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Object

...
*/

Object.extend({

	member: function(source, reference, name) {
		if (name) {
			name = name.camelize();
			if (source[name] == null || source[name] == undefined) {
				source[name] = reference;
			}
		}
		return source;
	},

	assertTypeOf: function(object, type, error) {
		if (!typeOf(object, type)) throw new Error(error);
	},

	assertInstanceOf: function(object, instance, error) {
		if (!instanceOf(object, instance)) throw new Error(error);
	}

})