/*
---

name: History.ViewController

description: Provide an history stack of view controller that handles the
             browser back and forward button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- History

provides:
	- History.ViewController

...
*/

Moobile.History.ViewController = new Class({

	Extends: Moobile.History,

	viewControllers: {},

	push: function(viewController) {
		this.viewControllers[viewController.getId()] = viewController;
		var id = viewController.getId();
		var hash = viewController.getHash();
		var data = viewController.getId();
		this.parent(id, hash, data);
		return this;
	},

	garbage: function() {
		for (var i = this.index; i < this.stack.length; i++) {
			var viewController = this.viewControllers[this.stack[i].data];
			if (viewController) {
				viewController.doShutdown();
				viewController = null;
				delete this.viewControllers[this.stack[i].data];
			}
			this.stack[i] = null;
		}
		this.stack = this.stack.clean();
		return this;
	},

	onBack: function(state) {
		var viewController = this.viewControllers[state.data];
		if (viewController) this.fireEvent('back', viewController);
		return this;
	},

	onForward: function(state) {
		var viewController = this.viewControllers[state.data];
		if (viewController) this.fireEvent('forward', viewController);
		return this;
	}

});