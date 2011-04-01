/*
---

name: ViewController.Navigation

description: Provide navigation function to the view controller stack such as
             a navigation bar and navigation bar buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Stack

provides:
	- ViewController.Navigation

...
*/

Moobile.ViewController.Navigation = new Class({

	Extends: Moobile.ViewController.Stack,

	pushViewController: function(viewController, viewControllerTransition) {
		
		var navigationBar = new UI.NavigationBar();

		viewController.view.addChildControl(navigationBar, 'top');

		navigationBar.show();
		if (viewController.navigationBarVisible() == false) {
			navigationBar.hide();
		}

		var navigationLeftButton = viewController.getNavigationBarLeftButton();
		if (navigationLeftButton == null) {
			if (this.viewControllers.length > 0) {
				var backButtonTitle = this.viewControllers[this.viewControllers.length - 1].getTitle();
				if (backButtonTitle) {
					var navigationBackButton = new UI.BarButton();
					navigationBackButton.setStyle(UI.BarButtonStyle.BACK);
					navigationBackButton.setText(backButtonTitle);
					navigationBackButton.addEvent(Event.CLICK, this.bound('onBackButtonClick'));
					navigationBar.setButton(navigationBackButton, 'left');
				}
			}
		} else {
			navigationBar.setButton(navigationLeftButton, 'left');
		}

		var navigationRightButton = viewController.getNavigationBarRightButton();
		if (navigationRightButton) {
			navigationBar.setButton(navigationRightButton, 'right');
		}

		var navigationBarTitle = viewController.getTitle();
		if (navigationBarTitle) {
			navigationBar.setTitle(navigationBarTitle);
		}
		
		viewController.navigationBar = navigationBar;

		this.parent(viewController, viewControllerTransition);

		return this;
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});