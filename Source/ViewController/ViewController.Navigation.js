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

	Binds: [
		'onPushTransitionCompleted',
		'onPopTransitionCompleted',
		'onBackButtonClick'
	],

	navigationBar: null,

	startup: function() {
		this.navigationBar = this.view.navigationBar;
		return this.parent();
	},

	shutdown: function() {
		this.navigationBar = null;
		return this.parent();
	},

	loadView: function(view) {
		this.view = view || new Moobile.View.Navigation(new Element('div'));
		return this;
	},

	pushViewController: function(viewController, viewControllerTransition) {
		this.parent(viewController, viewControllerTransition);
		this.updateNavigationBar();
		return this;
	},

	popViewController: function() {
		this.parent();
		this.updateNavigationBar();
		return this;
	},

	updateNavigationBar: function() {
		var topViewControllerIndex = this.viewControllers.indexOf(this.topViewController);
		if (topViewControllerIndex > -1) {
			
			this.navigationBar.show();
			if (this.topViewController.navigationBarVisible() == false) {
				this.navigationBar.hide();
			}
			
			this.navigationBar.removeTitle();
			this.navigationBar.removeButtons();			
			
			var navigationLeftButton = this.topViewController.navigationBarLeftButton();
			if (navigationLeftButton == null) {
				var previousViewControllerIndex = topViewControllerIndex - 1;
				if (previousViewControllerIndex >= 0) {
					var backButtonTitle = this.viewControllers[previousViewControllerIndex].getTitle();
					if (backButtonTitle) {
						var navigationBackButton = new UI.BarButton();
						navigationBackButton.setStyle(UI.BarButtonStyle.BACK);
						navigationBackButton.setText(backButtonTitle);
						navigationBackButton.addEvent(Event.CLICK, this.onBackButtonClick);
						this.navigationBar.setLeftButton(navigationBackButton);
					}
				}
			} else {
				this.navigationBar.setLeftButton(navigationLeftButton);
			}

			var navigationRightButton = this.topViewController.navigationBarRightButton();
			if (navigationRightButton) {
				this.navigationBar.setRightButton(navigationRightButton);
			}

			var navigationBarTitle = this.topViewController.getTitle();
			if (navigationBarTitle) {
				this.navigationBar.setTitle(navigationBarTitle);
			}
		}

		return this;
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});