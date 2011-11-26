/*
---

name: Class.Instantiate

description: Provides extra static methods to instantiate a class from a string.

license: MIT-style license.

requires:
	- Core/Class

provides:
	- Class.Instantiate

...
*/


/**
 * Transforms the name of a class stored in a string into an object that
 * can be instantiated.
 * @param {String} name The class name.
 * @return {Object}
 * @since 0.1
 */
Class.parse = function(name) {
	name = name.trim();
	name = name.split('.');
	var func = window;
	for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
	return typeof func == 'function' ? func : null;
},

/**
 * Creates an instance of the class given as a string or an object. Extra
 * parameters passed to this method will be transfered to the class
 * constructor.
 * @param {Object} klass The object to instantiate.
 * @return {Object}
 * @since 0.1
 */
Class.instantiate = function(klass) {
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
