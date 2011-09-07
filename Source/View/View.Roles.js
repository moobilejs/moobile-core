/*
---

name: View.Roles

description: Provides the behavior of differents roles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- View.Roles

...
*/

Moobile.View.Roles = {

	content: {
		stop: false,
		apply: function() {},
		onAttach: function() {},
		onDetach: function() {}
	},

	text: {
		stop: false,
		apply: function() {},
		onAttach: function() {},
		onDetach: function() {}
	},

	view: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-view') || Moobile.View;
			return Class.instanciate(c, this, o, n);
		},
		onAttach: function() {},
		onDetach: function() {}
	},

	control: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-control') || Moobile.Control;
			return Class.instanciate(c, this, o, n);
		},
		onAttach: function() {},
		onDetach: function() {}
	},

	label: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-label') || Moobile.Label;
			return Class.instanciate(c, this, o, n);
		},
		onAttach: function() {},
		onDetach: function() {}
	},

	image: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-image') || Moobile.Image;
			return Class.instanciate(c, this, o, n);
		},
		onAttach: function() {},
		onDetach: function() {}
	},

	'navigation-item': {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-navigation-item') || Moobile.NavigationItem;
			return Class.instanciate(c, this, o, n);
		},
		onAttach: function() {},
		onDetach: function() {}
	},

	'left-bar-button': {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-left-bar-button') || Moobile.BarButton;
			return Class.instanciate(c, this, o, n);
		},
		onAttach: function() {},
		onDetach: function() {}
	},

	'right-bar-button': {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-right-bar-button') || Moobile.BarButton;
			return Class.instanciate(c, this, o, n);
		},
		onAttach: function() {},
		onDetach: function() {}
	}

};