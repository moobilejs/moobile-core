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

	didAddViewController: function(viewController) {

		this.parent(viewController);

		if (viewController.navigationBar)
			return this;

		var navigationBar = new Moobile.UI.NavigationBar();
		var navigationItem = new Moobile.UI.NavigationBarItem();
		navigationBar.setNavigationItem(navigationItem);

		if (this.viewControllers.length > 1) {

			var text = this.viewControllers.lastItemAt(1).getTitle() || 'Back';

			var backBarButton = new Moobile.UI.BarButton();
			backBarButton.setStyle(Moobile.UI.BarButtonStyle.Back);
			backBarButton.setText(text);
			backBarButton.addEvent('click', this.bound('onBackButtonClick'));

			navigationItem.setLeftBarButton(backBarButton);
		}

		navigationItem.setTitle(viewController.getTitle());

		viewController.view.addChildControl(navigationBar, 'header');

		viewController.navigationBar = navigationBar;

		return this;
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});