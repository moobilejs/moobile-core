/*
---

name: View.Roles

description: Provides the behavior for roles used inside views.

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
		stop: false
	},

	wrapper: {
		stop: false
	},

	label: {
		stop: true,
		apply: function(element) {
			var n = element.get('name');
			var o = element.get('options');
			var c = element.get('data-label') || Moobile.Label;
			return Class.instanciate(c, element, o, n);
		}
	},

	image: {
		stop: true,
		apply: function(element) {
			var n = element.get('name');
			var o = element.get('options');
			var c = element.get('data-image') || Moobile.Image;
			return Class.instanciate(c, element, o, n);
		}
	},

	view: {
		stop: true,
		apply: function(element) {
			var n = element.get('name');
			var o = element.get('options');
			var c = element.get('data-view') || Moobile.View;
			return Class.instanciate(c, element, o, n);
		}
	},

	control: {
		stop: true,
		apply: function(element) {
			var n = element.get('name');
			var o = element.get('options');
			var c = element.get('data-control') || Moobile.Control;
			return Class.instanciate(c, element, o, n);
		}
	},

	'list-item': {
		stop: true,
		apply: function(element) {
			var n = element.get('name');
			var o = element.get('options');
			var c = element.get('data-list-item') || Moobile.ListItem;
			return Class.instanciate(c, element, o, n);
		}
	},

	'bar-title': {
		stop: true,
		apply: function(element) {
			var n = element.get('name');
			var o = element.get('options');
			var c = element.get('data-bar-title') || Moobile.BarTitle;
			return Class.instanciate(c, element, o, n);
		}
	},

	'bar-button': {
		stop: true,
		apply: function(element) {
			var n = element.get('name');
			var o = element.get('options');
			var c = element.get('data-bar-button') || Moobile.BarButton;
			return Class.instanciate(c, element, o, n);
		}
	}

};