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
		back: true
	},

	willAddChildViewController: function(viewController) {

		this.parent(viewController);

		var view = viewController.getView();

		var navigationItem = null;
		var navigationBar = view.getChildView('navigation-bar');
		if (navigationBar == null) {
			navigationBar = new Moobile.NavigationBar(null, null, 'navigation-bar');
			navigationItem = new Moobile.NavigationItem();
			navigationBar.setNavigationItem(navigationItem);
			view.addChildView(navigationBar, 'header');
		} else {
			navigationItem = navigationBar.getNavigationItem();
		}

		if (viewController.isModal() || !this.childViewControllers.length)
			return this;

		if (this.options.back) {

			var title = this.topViewController.getTitle();
			if (title) {

				var backButton = new Moobile.BarButton();
				backButton.setStyle(Moobile.BarButtonStyle.Back);
				backButton.setLabel(title);
				backButton.addEvent('click', this.bound('onBackButtonClick'));

				navigationItem.setLeftBarButton(backButton);
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

			var navigationItem = navigationBar.getNavigationItem();
			if (navigationItem) {
				navigationItem.setLabel(title)
			}
		}

		return this;
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});