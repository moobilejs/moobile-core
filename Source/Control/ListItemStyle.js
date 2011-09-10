/*
---

name: ListItemStyle

description: Provide constants for list item styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- ListItemStyle

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.ListItemStyle = {

	Checked: {

		onAttach: function() {
			return this.addClass('style-checked');
		},

		onDetach: function() {
			return this.removeClass('style-checked');
		}

	},

	Disclosed: {

		onAttach: function() {
			return this.addClass('style-disclosed');
		},

		onDetach: function() {
			return this.removeClass('style-disclosed');
		}

	},

	Detailed: {

		onAttach: function() {
			return this.addClass('style-detailed');
		},

		onDetach: function() {
			return this.removeClass('style-detailed');
		}

	},

	Active: {

		onAttach: function() {
			var indicator = new Element('div.list-item-active-indicator');
			indicator.inject(this.content, 'after');
			return this.addClass('style-active');
		},

		onDetach: function() {
			var element = this.getElement('div.list-item-active-indicator');
			if (element) {
				element.destroy();
			}
			return this.removeClass('style-active');
		}

	}

};