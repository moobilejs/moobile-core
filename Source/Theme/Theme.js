/*
---

name: Theme

description:

license: MIT-style license.

requires:
	- Core/Class

provides:
	- Theme

...
*/

(function() {

var element = null;
var configs = null;

Moobile.Theme = {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	init: function() {
		var content = element.getStyle('content');
		if (content) {
			configs = JSON.decode(content);
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Theme/Theme#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getName: function() {
		return configs[name] || null;
	}

};

document.addEvent('domready', function() {
	element = document.createElement('div');
	element.addClass('theme');
	element.inject(document.body);
	Moobile.Theme.init();
})

})();
