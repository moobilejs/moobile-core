"use strict"

Class.parse = function(name) {
	name = name.trim();
	name = name.split('.');
	var func = window;
	for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
	return typeof func === 'function' ? func : null;
},

Class.instantiate = function(klass) {
	if (typeof klass === 'string') klass = Class.parse(klass);
	if (klass === null) return null;
	klass.$prototyping = true;
	var instance = new klass;
	delete klass.$prototyping;
	var params = Array.prototype.slice.call(arguments, 1);
	if (instance.initialize) instance.initialize.apply(instance, params);
	return instance;
}