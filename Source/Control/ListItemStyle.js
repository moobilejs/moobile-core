/*
---

name: ListItemStyle

description: Provide styles for ListItem instances.

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

	Activity: {

		onAttach: function() {
			
			var activity = this.getElement('div.list-item-activity');
			if (activity == null) {
				activity = new Element('div.list-item-activity');
				activity.inject(this.element);
			}

			return this.addClass('style-activity');
		},

		onDetach: function() {
			
			var activity = this.getElement('div.list-item-activity');
			if (activity) {
				activity.destroy();
			}
			
			return this.removeClass('style-activity');
		}

	}

};