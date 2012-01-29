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
 * @name  ViewControllerStack.Navigation
 * @class Provides a view controller stack that also handles a navigation bar
 *        and its back button.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @extends ViewControllerStack
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewControllerStack.Navigation = new Class( /** @lends ViewControllerStack.Navigation.prototype */ {

	Extends: Moobile.ViewControllerStack,

	/**
	 * @var    {Object} The class options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
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

				var backButton = new Moobile.BarButton(null, null, 'back');
				backButton.setStyle('back');
				backButton.setLabel(backButtonLabel);
				backButton.addEvent('tap', this.bound('onBackButtonClick'));

				navigationBar.getItem().addLeftBarButton(backButton);
			}
		}
	},

	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		var navigationBar = viewController.getView().getChild('navigation-bar');
		if (navigationBar == null)
			return this;

		var title = viewController.getTitle();
		if (title) {
			navigationBar.getItem().setTitle(title)
		}
	},

	onBackButtonClick: function(e) {
		this.popViewController();
	}

});
