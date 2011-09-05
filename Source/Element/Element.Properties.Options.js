/*
---

name: Element.Properties.Options

description: Provides an options element properties.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element.Properties.Options

...
*/

Element.Properties.options = {

	get: function() {
		var options = this.get('data-options');
		if (options) {
			if (!options.match(/^\{/)) options = '{' + options;
			if (!options.match(/\}$/)) options = options + '}';
			options = JSON.decode(options);
		}
		return options;
	}


};