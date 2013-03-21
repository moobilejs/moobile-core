"use strict"

var element = null;
var configs = {};

var Theme = moobile.Theme = {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	init: function() {
		var content = element.getStyle('content');
		if (content) {
			content = content.replace(/^\'/, '');
			content = content.replace(/\'$/, '');
			configs = JSON.decode(content);
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Theme/Theme#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getName: function() {
		return configs['name'] || null;
	}

};

document.on('domready', function() {
	element = document.createElement('div');
	element.addClass('theme');
	element.inject(document.body);
	Theme.init();
})

