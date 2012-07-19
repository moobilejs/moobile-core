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
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack.Navigation
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewControllerStack.Navigation = new Class({

	Extends: Moobile.ViewControllerStack,

	/**
	 * The class options.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		backButton: true,
		backButtonLabel: 'Back'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {

		this.parent(viewController);

		var view = viewController.getView();

		var navigationBar = view.getChildComponent('navigation-bar');
		if (navigationBar === null) {
			navigationBar = new Moobile.NavigationBar(null, null, 'navigation-bar');
			view.addChildComponent(navigationBar, 'header');
		}

		if (viewController.isModal() || this.childViewControllers.length === 0)
			return this;

		if (this.options.backButton) {

			var backButtonLabel = this.topViewController.getTitle() || this.options.backButtonLabel;
			if (backButtonLabel) {

				var backButton = new Moobile.Button(null, null, 'back');
				backButton.setStyle('back');
				backButton.setLabel(backButtonLabel);
				backButton.addEvent('tap', this.bound('_onBackButtonTap'));

				navigationBar.getItem().addLeftButton(backButton);
			}
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		var navigationBar = viewController.getView().getChildComponent('navigation-bar');
		if (navigationBar === null)
			return this;

		var title = viewController.getTitle();
		if (title) {
			navigationBar.getItem().setTitle(title)
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onBackButtonTap: function(e) {
		this.popViewController();
	}

});
