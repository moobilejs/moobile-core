/*
---

name: Element.Properties.Options

description: Provides an option property used to retrieve stored options in a 
             JSON format.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element.Properties.Options

...
*/

Element.Properties['data-options'] = {

	get: function() {
		var options = this.getProperty('data-options');
		if (options) {
			if (!options.match(/^\{/)) options = '{' + options;
			if (!options.match(/\}$/)) options = options + '}';
			options = JSON.decode(options);
		}
		return options;
	}


};