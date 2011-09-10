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

	text: {
		stop: false
	},

	content: {
		stop: false,
		onAttach: function() {
			this.addClass('content');
		}
	},

	wrapper: {
		stop: false,
		onDetach: function() {
			this.addClass('wrapper');
		}
	},

	label: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-label') || Moobile.Label;
			return Class.instanciate(c, this, o, n);
		}
	},

	image: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-image') || Moobile.Image;
			return Class.instanciate(c, this, o, n);
		}
	},

	view: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-view') || Moobile.View;
			return Class.instanciate(c, this, o, n);
		}
	},

	control: {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-control') || Moobile.Control;
			return Class.instanciate(c, this, o, n);
		}
	},

	'list-item': {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-list-item') || Moobile.ListItem;
			return Class.instanciate(c, this, o, n);
		}
	},

	'bar-title': {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-bar-title') || Moobile.BarTitle;
			return Class.instanciate(c, this, o, n);
		}
	},

	'bar-button': {
		stop: true,
		apply: function() {
			var n = this.get('name');
			var o = this.get('options');
			var c = this.get('data-bar-button') || Moobile.BarButton;
			return Class.instanciate(c, this, o, n);
		}
	}

};