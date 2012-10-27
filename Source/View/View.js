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
 * @see    http://moobilejs.com/doc/latest/View/View
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.View = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_layout: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#contentWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentWrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		layout: 'vertical'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('view');

		var content = this.getRoleElement('content') /* <0.1-compat> */ || this.getRoleElement('view-content') /* </0.1-compat> */;
		if (content === null) {
			content = document.createElement('div');
			content.ingest(this.element);
			content.inject(this.element);
			content.setRole('content');
		}

		var wrapper = this.getRoleElement('content-wrapper');
		if (wrapper === null) {
			wrapper = document.createElement('div');
			wrapper.wraps(content);
			wrapper.setRole('content-wrapper');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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

		this.setLayout(this.options.layout);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.contentElement = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#enableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enableTouch: function() {
		this.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#disableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	disableTouch: function() {
		this.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildComponent: function(component, where) {
		if (where === 'header') return this.parent(component, 'top');
		if (where === 'footer') return this.parent(component, 'bottom');
		return this.addChildComponentInside(component, this.contentElement, where);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildComponent: function(component) {
		this.parent(component);
		component.setParentView(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		component.setParentView(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentElement: function() {
		return this.contentElement;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#getContentWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentWrapperElement: function() {
		return this.contentWrapperElement;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setLayout: function(layout) {

		if (this._layout === layout)
			return this;

		this.willChangeLayout(layout);
		if (this._layout) this.removeClass('view-layout-' + this._layout);
		this._layout = layout;
		if (this._layout) this.addClass('view-layout-' + this._layout);
		this.didChangeLayout(layout);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getLayout: function() {
		return this._layout;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#willChangeLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willChangeLayout: function(layout) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#didChangeLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	didChangeLayout: function(layout) {

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
	 * @see    http://moobilejs.com/doc/latest/View/View#setParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * @see    http://moobilejs.com/doc/latest/View/View#getParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentView: function() {
		return this._parentView;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewWillChange: function(parentView) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewDidChange: function(parentView) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildComponent: function(component) {
		this.previous(component);
		component.setParentView(this._parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildComponent: function(component) {
		this.previous(component);
		component.setParentView(null);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/View/View#MoobileViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.View.at = function(path, options, name) {

	var element = Element.at(path);
	if (element) {
		return Moobile.Component.create(Moobile.View, element, 'data-view', options, name);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.View, element, 'data-view'));
});

Moobile.Component.defineRole('content', Moobile.View, {traversable: true}, function(element) {
	this.contentElement = element;
	this.contentElement.addClass('view-content');
});

Moobile.Component.defineRole('content-wrapper', Moobile.View, {traversable: true}, function(element) {
	this.contentWrapperElement = element
	this.contentWrapperElement.addClass('view-content-wrapper');
});

// <0.1-compat>
/**
 * @deprecated
 */
Moobile.Component.defineRole('view-content', Moobile.View, {traversable: true}, function(element) {
	console.log('[DEPRECATION NOTICE] The role "view-content" will be removed in 0.4, use the role "content" instead');
	this.contentElement = element;
	this.contentElement.addClass('view-content');
});
// </0.1-compat>

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Dark Style - iOS Android */
Moobile.Component.defineStyle('dark', Moobile.View, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

/* Light Style - iOS Android */
Moobile.Component.defineStyle('light', Moobile.View, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});
