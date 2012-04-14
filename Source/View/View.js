/*
---

name: View

description: Provides an child that handles an area in which a user can
             interract.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Component

provides:
	- View

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/View/View
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.View = new Class({

	Extends: Moobile.Component,

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#content
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	contentElement: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('view');

		var content = this.element.getRoleElement('view-content');
		if (content === null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
			content.setRole('view-content');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		var classes = this.element.get('class');
		if (classes) {
			classes.split(' ').each(function(klass) {
				klass = klass.trim();
				if (klass) this.contentElement.addClass(klass + '-content');
			}, this);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.contentElement = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#enableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enableTouch: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#disableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	disableTouch: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponent: function(component, where) {
		if (where === 'header') return this.parent(component, 'top');
		if (where === 'footer') return this.parent(component, 'bottom');
		return this.addChildComponentInside(component, this.contentElement, where);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildComponent: function(component) {
		this.parent(component);
		component.setParentView(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		component.setParentView(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#setContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setContentElement: function(content) {

		if (this.contentElement === content)
			return this;

		if (this.element.contains(content) === false) {
			if (this.contentElement) {
				this.contentElement.grab(content, 'after');
				this.contentElement.destroy();
			} else {
				this.element.grab(content);
			}
		}

		this.contentElement = content;
		this.contentElement.addClass('view-content');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getContentElement: function() {
		return this.contentElement;
	}

});

Class.refactor(Moobile.Component, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_parentView: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#setParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParentView: function(parentView) {

		if (this._parentView === parentView)
			return this;

		this.parentViewWillChange(parentView);
		this._parentView = parentView;
		this.parentViewDidChange(parentView);

		if (this instanceof Moobile.View)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.View);
		};

		this.getChildComponents().filter(by).invoke('setParentView', parentView);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#getParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentView: function() {
		return this._parentView;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewWillChange: function(parentView) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewDidChange: function(parentView) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildComponent: function(component) {
		this.previous(component);
		component.setParentView(this._parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildComponent: function(component) {
		this.previous(component);
		component.setParentView(null);
	}

});

/**
 * @see    http://moobilejs.com/doc/0.1/View/View#MoobileViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.View.at = function(path) {

	var element = Element.at(path);
	if (element) {
		return Moobile.Component.create(Moobile.View, element, 'data-view');
	}

	return null;
};

//<pre-0.1-compat>
Moobile.View.prototype.addChild = Moobile.View.prototype.addChildComponent;
//</pre-0.1-compat>

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.View, element, 'data-view'));
});

Moobile.Component.defineRole('view-content', Moobile.View, {traversable: true,	behavior: function(element) {
	this.setContentElement(element);
}});
