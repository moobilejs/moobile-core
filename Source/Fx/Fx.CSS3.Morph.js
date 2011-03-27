/*
---

name: Fx.CSS3.Morph

description: Provide CSS 3 morphing.

license: MIT-style license.

authors:
	- Mootools Authors (http://mootools.net)
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Fx.CSS3

provides:
	- Fx.CSS3.Morph

...
*/

Fx.CSS3.Morph = new Class({

	Extends: Fx.CSS3,

	start: function(properties) {
		if (this.check(properties) == false) return this;

		if (typeof properties == 'string') properties = this.search(properties);

		this.from = {};
		this.to = {};

		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			this.from[p] = parsed.from;
			this.to[p] = parsed.to;
		}

		this.attachEvents();

		return this.parent();
	},

	setTransitionInitialState: function() {
		this.element.setStyle('transition', null);
		Object.each(this.from, function(value, property) {
			if (value.length) {
				value = Array.from(value);
				value = Array.flatten(value)[0];
				value = value.parser.serve(value.value);
				this.element.setStyle(property, value);
			}
		}, this);
		return this.parent();
	},

	setTransitionParameters: function() {
		this.element.setStyle('transition', 'all ' + this.options.duration + 'ms ' + this.options.transition)
		return this.parent();
	},

	play: function() {
		Object.each(this.to, function(value, property) {
			if (value.length) {
				value = Array.from(value);
				value = Array.flatten(value)[0];
				value = value.parser.serve(value.value);
				this.element.setStyle(property, value);
			}
		}, this);
		return this.parent();
	}

});