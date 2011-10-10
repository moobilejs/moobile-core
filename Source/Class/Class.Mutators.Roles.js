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

(function() {

var expand = function(object) {
    for (var key in object) {
        var val = object[key];
        if (key.match(',')) {
            key.split(',').each(function(k) {
                object[k.trim()] = val;
            });
            delete object[key];
        }
    }
    return object;
};
	
Class.Mutators.Roles = function(roles) {
	this.prototype.$roles = Object.append(this.prototype.$roles || {}, expand(roles) || {});
};	
	
})();