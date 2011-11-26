/*
---

name: ViewControllerStack.Navigation

description: Provides a view controller stack that also handles a navigation
             bar and its back button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerStack

provides:
	- ViewControllerStack.Navigation

...
*/

/**
 * Provides a view controller stack that also handles a navigation bar and
 * its back button.
 *
 * @name ViewControllerStack.Navigation
 * @class ViewControllerStack.Navigation
 * @extends ViewControllerStack
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewControllerStack.Navigation = new Class( /** @lends ViewControllerStack.Navigation.prototype */ {

	Extends: Moobile.ViewControllerStack,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		backButton: true,
		backButtonLabel: 'Back'
	},

	/**
	 * @see ViewController#willAddChildViewController
	 */
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

				var backButton = new Moobile.BarButton(null, null, 'back');
				backButton.setStyle('back');
				backButton.setLabel(backButtonLabel);
				backButton.addEvent('click', this.bound('onBackButtonClick'));

				navigationBar.addLeftBarButton(backButton);
			}
		}
	},

	/**
	 * @see ViewController#didAddChildViewController
	 */
	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		var navigationBar = viewController.getView().getChild('navigation-bar');
		if (navigationBar == null)
			return this;

		var title = viewController.getTitle();
		if (title) {
			navigationBar.setTitle(title)
		}
	},

	/**
	 * The back button click event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @private
	 */
	onBackButtonClick: function(e) {
		this.popViewController();
	}

});
