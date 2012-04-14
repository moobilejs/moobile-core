/*
---

name: Class.Instantiate

description:

license: MIT-style license.

requires:
	- Core/Class

provides:
	- Class.Parse
	- Class.Instantiate

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/Class/Class
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Class.extend({

	/**
	 * @see    http://moobilejs.com/doc/0.1/Class/Class.Instantiate#parse
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parse: function(name) {
		name = name.trim();
		name = name.split('.');
		var func = window;
		for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
		return typeof func === 'function' ? func : null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Class/Class.Instantiate#instantiate
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	instantiate: function(klass) {
		if (typeof klass === 'string') klass = Class.parse(klass);
		if (klass === null) return null;
		klass.$prototyping = true;
		var instance = new klass;
		delete klass.$prototyping;
		var params = Array.prototype.slice.call(arguments, 1);
		if (instance.initialize) instance.initialize.apply(instance, params);
		return instance;
	}

});
