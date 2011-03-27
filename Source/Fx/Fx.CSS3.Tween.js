/*
---

name: Fx.CSS3.Tween

description: Provide CSS 3 tweening.

license: MIT-style license.

authors:
	- Mootools Authors (http://mootools.net)
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Fx.CSS3

provides:
	- Fx.CSS3.Tween

...
*/
Fx.CSS3.Tween = new Class({

	Extends: Fx.CSS3,

	start: function(property, from, to) {
		if (this.check(property, from, to) == false) return this;

		var args = Array.flatten(arguments);
		var prop = this.options.property || args.shift();
		var parsed = this.prepare(this.element, prop, args);

		this.property = prop;

		this.to = Array.flatten(Array.from(parsed.to))[0];
		this.to = this.to.parser.serve(this.to.value);

		this.from = Array.flatten(Array.from(parsed.from))[0];
		this.from = this.from.parser.serve(this.from.value);

		this.attachEvents();

		return this.parent();
	},

	setTransitionInitialState: function() {
		this.element.setStyle(this.transition, null);
		this.element.setStyle(this.property, this.from);
		return this.parent();
	},

	setTransitionParameters: function() {
		this.element.setStyle(this.transition, this.property + ' ' + this.options.duration + 'ms ' + this.options.transition);
		return this.parent();
	},

	play: function() {
		this.element.setStyle(this.property, this.to);
		return this.parent();
	}

});