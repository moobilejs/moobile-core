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
 * @see    http://moobile.net/api/0.1/View/View
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.View = new Class({

	Extends: Moobile.Component,

	/**
	 * @see    http://moobile.net/api/0.1/View/View#content
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	content: null,

	/**
	 * @overrides
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
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		var classes = this.element.get('class');
		if (classes) {
			classes.split(' ').each(function(klass) {
				klass = klass.trim();
				if (klass) this.content.addClass(klass + '-content');
			}, this);
		}
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.content = null;
		this.parent();
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/View#enableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enableTouch: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/View#disableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	disableTouch: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChild: function(component, where) {
		if (where === 'header') return this.parent(component, 'top');
		if (where === 'footer') return this.parent(component, 'bottom');
		return this.addChildInside(component, this.content, where);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChild: function(component) {
		this.parent(component);
		component.setParentView(this);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChild: function(component) {
		this.parent(component);
		component.setParentView(null);
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/View#setContent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setContent: function(content) {

		if (this.content === content)
			return this;

		if (this.element.contains(content) === false) {
			if (this.content) {
				this.content.grab(content, 'after');
				this.content.destroy();
			} else {
				this.element.grab(content);
			}
		}

		this.content = content;
		this.content.addClass('view-content');

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/View#getContent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getContent: function() {
		return this.content;
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
	 * @see    http://moobile.net/api/0.1/Component/Component#setParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParentView: function(parentView) {

		if (this._parentView === parentView)
			return this;

		this.parentViewWillChange(parentView);
		this._parentView = parentView;
		this.parentViewDidChange(parentView);

		this._children.invoke('setParentView', parentView);

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentView: function() {
		return this._parentView;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewWillChange: function(parentView) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewDidChange: function(parentView) {

	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChild: function(component) {
		this.previous(component);
		component.setParentView(this._parentView);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChild: function(component) {
		this.previous(component);
		component.setParentView(null);
	}

});

/**
 * @see    http://moobile.net/api/0.1/View/View#MoobileViewAt
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

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view', null, function(element) {
	this.addChild(Moobile.Component.create(Moobile.View, element, 'data-view'));
});

Moobile.Component.defineRole('view-content', Moobile.View, {traversable: true,	behavior: function(element) {
	this.setContent(element);
}});
