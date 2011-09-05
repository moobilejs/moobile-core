/*
---

name: Class.Instanciate

description: Provides a method to instanciate classes based on the class name
             stored as a string.

license: MIT-style license.

requires:
	- Core/Class

provides:
	- Class.Instanciate

...
*/

Class.extend({

	parse: function(name) {
		name = name.trim();
		name = name.split('.');
		var func = window;
		for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
		return typeof func == 'function' ? func : null;
	},

	instanciate: function(klass) {
		if (typeof klass == 'string') klass = Class.parse(klass);
		if (klass == null) return null;
		klass.$prototyping = true;
		var instance = new klass;
		delete klass.$prototyping;
		var params = Array.prototype.slice.call(arguments, 1);
		if (instance.initialize) {
			instance.initialize.apply(instance, params);
		}
		return instance;
	}

});

