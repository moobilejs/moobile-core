/*
---

name: ViewControllerStack.Navigation

description: Provide navigation function to the view controller stack such as
             a navigation bar and navigation bar buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerStack

provides:
	- ViewControllerStack.Navigation

...
*/

Moobile.ViewControllerStack.Navigation = new Class({

	Extends: Moobile.ViewControllerStack,

	loadView: function(view) {
		this.view = view || new Moobile.ViewStack.Navigation();
		return this;
	},

	willPushViewController: function(viewController) {

		trace(viewController.view);

		viewController.navigationBar = viewController.view.navigationBar;

		if (this.viewControllers.length > 1) {

			var backButton = viewController.navigationBar.getLeftButton();
			if (backButton == null) {

				var text = this.viewControllers.getLast(1).getTitle() || 'Back';

				backButton = new Moobile.UI.BarButton();
				backButton.setStyle(Moobile.UI.BarButtonStyle.Back);
				backButton.setText(text);
				backButton.addEvent('click', this.bound('onBackButtonClick'));

				viewController.navigationBar.setLeftButton(backButton);
			}
		}

		viewController.navigationBar.setTitle(viewController.getTitle());

		return this;
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});