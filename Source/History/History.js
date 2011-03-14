/*
---

name: History

description: Provides history manager for browsers that handles the push state
             method.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- History

...
*/

Element.NativeEvents['popstate'] = 2;

Moobile.History = new Class({

	Implements: [Events, Options],

	Binds: [
		'onChange',
		'onForward',
		'onBack'
	],

	group: 'history',

	stack: [],

	index: -1,

	marker: -1,

	initialize: function() {
		this.attachEvents();
		return this;
	},

	attachEvents: function() {
		window.addEvent('popstate', this.onChange);
		return this;
	},

	detachEvents: function() {
		window.removeEvent('popstate', this.onChange);
		return this;
	},

	setGroup: function(group) {
		this.group = group;
		return this;
	},

	getGroup: function() {
		return this.group;
	},

	push: function(id, hash, data) {
		if (this.index == this.marker) {
			this.index++;

			this.garbage();

			var state = {};
			state.id = id;
			state.group = this.group;
			state.index = this.index;
			state.hash = hash;
			state.data = data;

			this.stack[this.index] = state;

			if (history.pushState) {
				history.pushState(state, null, '#' + hash);
			}

			this.marker = this.index;
		} else {
			this.index = this.marker;
		}

		return this;
	},

	pop: function() {
		if (this.index > 0) {
			if (this.marker == this.index) {
				this.marker = --this.index;
				var state = this.stack[this.index];
				if (history.replaceState) {
					history.replaceState(state, null, '#' + state.hash);
				}
			} else {
				this.index = this.marker;
			}
		}
		return this;
	},

	garbage: function() {
		for (var i = this.index; i < this.stack.length; i++) this.stack[i] = null;
		this.stack = this.stack.clean();
		return this;
	},

	onChange: function(e) {
		var state = e.event.state;
		if (state && state.group == this.group) {
			for (var i = 0; i < this.stack.length; i++) {
				if (this.stack[i].id == state.id) {
					if (this.marker < i) {
						this.marker = i;
						this.onForward(state);
					}
					if (this.marker > i) {
						this.marker = i;
						this.onBack(state);
					}
					break;
				}
			}
			this.fireEvent('change', state.data);
		}
		return this;
	},

	onForward: function(state) {
		this.fireEvent('forward', state.data);
		return this;
	},

	onBack: function(state) {
		this.fireEvent('back', state.data);
		return this;
	}


});