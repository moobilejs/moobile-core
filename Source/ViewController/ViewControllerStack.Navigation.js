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

	options: {
		showBackButton: true
	},

	willAddChildViewController: function(viewController) {

		this.parent(viewController);

		var view = viewController.getView();

		var navigationBar = view.getChildView('navigation-bar');
		if (navigationBar == null) {
			navigationBar = new Moobile.NavigationBar(null, null, 'navigation-bar');
			view.addChildView(navigationBar, 'header');
		}

		if (viewController.isModal() || this.childViewControllers.length == 0)
			return this;

		if (this.options.showBackButton) {

			var title = this.topViewController.getTitle();
			if (title) {

				var backButton = new Moobile.BarButton();
				backButton.setStyle(Moobile.BarButtonStyle.Back);
				backButton.setLabel(title);
				backButton.addEvent('click', this.bound('onBackButtonClick'));

				navigationBar.setLeftBarButton(backButton);
			}
		}

		return this;
	},

	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		var navigationBar = viewController.getView().getChildView('navigation-bar');
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