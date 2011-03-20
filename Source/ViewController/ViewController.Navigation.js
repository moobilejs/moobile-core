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
		'pushTransitionCompleted',
		'popTransitionCompleted',
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

		if (viewController.navigationBarVisible()) {
			this.navigationBar.show();
		} else {
			this.navigationBar.hide();
		}

		this.navigationBar.removeTitle();
		this.navigationBar.removeButtons();

		var navigationLeftButton = viewController.navigationBarLeftButton();
		if (navigationLeftButton == null) {

			if (this.viewControllers.length > 0) {

				var text = this.viewControllers.getLast().getTitle();

				navigationLeftButton = new UI.BarButton();
				navigationLeftButton.setStyle(UI.BarButtonStyle.BACK);
				navigationLeftButton.setText(text);
				navigationLeftButton.addEvent(Event.CLICK, this.onBackButtonClick);
			}
		}

		if (navigationLeftButton) {
			this.navigationBar.setLeftButton(navigationLeftButton);
		}

		var navigationRightButton = viewController.navigationBarRightButton();
		if (navigationRightButton) {
			this.navigationBar.setRightButton(navigationRightButton);
		}

		this.navigationBar.setTitle(viewController.getTitle());

		return this.parent(viewController, viewControllerTransition);
	},

	popViewController: function() {
		
		var viewController = this.viewControllers.getLast(1);
		
		if (viewController.navigationBarVisible()) {
			this.navigationBar.show();
		} else {
			this.navigationBar.hide();
		}

		this.navigationBar.removeTitle();
		this.navigationBar.removeButtons();

		var navigationLeftButton = viewController.navigationBarLeftButton();
		if (navigationLeftButton == null) {

			if (this.viewControllers.length > 2) {

				var text = this.viewControllers.getLast().getTitle();

				navigationLeftButton = new UI.BarButton();
				navigationLeftButton.setStyle(UI.BarButtonStyle.BACK);
				navigationLeftButton.setText(text);
				navigationLeftButton.addEvent(Event.CLICK, this.onBackButtonClick);
			}
		}

		if (navigationLeftButton) {
			this.navigationBar.setLeftButton(navigationLeftButton);
		}

		var navigationRightButton = viewController.navigationBarRightButton();
		if (navigationRightButton) {
			this.navigationBar.setRightButton(navigationRightButton);
		}

		this.navigationBar.setTitle(viewController.getTitle());

		return this.parent();
	},

	onBackButtonClick: function(e) {
		this.popViewController();
	}

});