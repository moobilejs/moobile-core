/*
---

name: Class.Mutators.Roles

description: Provides the Roles class mutator.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras

provides:
	- Class.Mutators.Roles

...
*/

Class.Mutators.Roles = function(roles) {
	this.prototype.$roles = Object.append(this.prototype.$roles || {} ,roles || {});
};