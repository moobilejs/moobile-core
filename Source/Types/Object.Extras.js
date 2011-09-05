/*
---

name: Object.Extras

description: Provides extra methods to Object.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Object
	- String.Extras

provides:
	- Object.Extras

...
*/

Object.extend({

	defineMember: function(source, reference, name, readonly) {
		if (name) {
			var member = name.toCamelCase();
			if (source[member] == null || source[member] == undefined) {
				source[member] = reference;
				var getter = 'get' + member.capitalize();
				var setter = 'set' + member.capitalize();
				if (source[getter] == undefined) {
					source[getter] = function() {
						return this[member];
					}.bind(source);
				}
				if (source[setter] && !readonly) {
					source[setter] = function(value) {
						this[member] = value;
						return this;
					}.bind(source);
				}
			}
		}
		return source;
	}

})