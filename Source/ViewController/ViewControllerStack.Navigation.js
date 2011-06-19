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
		this.view = view || new Moobile.ViewStack.Navigation(new Element('div'));
		return this;
	},

	pushViewController: function(viewController, viewControllerTransition) {

		var navigationBar = new Moobile.UI.Bar.Navigation();

		viewController.view.addChildControl(navigationBar, 'top');

		if (this.viewControllers.length > 0) {
			var backButtonTitle = this.viewControllers[this.viewControllers.length - 1].getTitle();
			if (backButtonTitle) {
				var navigationBackButton = new Moobile.UI.BarButton();
				navigationBackButton.setStyle(Moobile.UI.BarButtonStyle.Back);
				navigationBackButton.setText(backButtonTitle);
				navigationBackButton.addEvent('click', this.bound('onBackButtonClick'));
				navigationBar.setLeftButton(navigationBackButton);
			}
		}

		var navigationBarTitle = viewController.getTitle();
		if (navigationBarTitle) {
			navigationBar.setTitle(navigationBarTitle);
		}

		viewController.navigationBar = viewController.view.navigationBar = navigationBar;

		return this.parent(viewController, viewControllerTransition);
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});