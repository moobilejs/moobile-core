/*
---

name: ViewControllerStack.Navigation

description: Provides a ViewControllerStack that automatically add a 
             NavigationBar control to each view controller's wiew added.

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

	options: {
		backButton: true,
		backButtonLabel: 'Back'
	},

	willAddChildViewController: function(viewController) {

		this.parent(viewController);

		var view = viewController.getView();

		var navigationBar = view.getChild('navigation-bar');
		if (navigationBar == null) {
			navigationBar = new Moobile.NavigationBar(null, null, 'navigation-bar');
			view.addChild(navigationBar, 'header');
		}

		if (viewController.isModal() || this.childViewControllers.length == 0)
			return this;

		if (this.options.backButton) {

			var backButtonLabel = this.topViewController.getTitle() || this.options.backButtonLabel;
			if (backButtonLabel) {

				var backButton = new Moobile.BarButton();
				backButton.setStyle('back');
				backButton.setLabel(backButtonLabel);
				backButton.addEvent('click', this.bound('onBackButtonClick'));

				navigationBar.setLeftBarButton(backButton);
			}
		}

		return this;
	},

	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		var navigationBar = viewController.getView().getChild('navigation-bar');
		if (navigationBar == null)
			return this;

		var title = viewController.getTitle();
		if (title) {
			navigationBar.setTitle(title)
		}

		return this;
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});