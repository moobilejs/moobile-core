"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerCollection
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var ViewControllerCollection = moobile.ViewControllerCollection = new Class({

	Extends: moobile.ViewController,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	loadView: function() {
		this.view = new moobile.ViewCollection();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerCollection#setViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setChildViewControllers: function(viewControllers) {
		this.removeAllChildViewControllers(true);
		for (var i = 0; i < viewControllers.length; i++) this.addChildViewController(viewControllers[i]);
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerCollection(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerCollection(null);
	}

});

Class.refactor(moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_viewControllerCollection: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerCollection#setViewControllerCollection
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setViewControllerCollection: function(viewControllerSet) {

		if (this._viewControllerCollection === viewControllerSet)
			return this;

		this.parentViewControllerCollectionWillChange(viewControllerSet);
		this._viewControllerCollection = viewControllerSet;
		this.parentViewControllerCollectionDidChange(viewControllerSet);

		if (this instanceof moobile.ViewControllerCollection)
			return this;

		var by = function(component) {
			return !(component instanceof moobile.ViewControllerCollection);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerCollection', viewControllerSet);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerCollection#getViewControllerCollection
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getViewControllerCollection: function() {
		return this._viewControllerCollection;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerCollection#parentViewControllerCollectionWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerCollectionWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerCollection#parentViewControllerCollectionDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerCollectionDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerCollection(this._viewControllerCollection);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerCollection(null);
	}

});
