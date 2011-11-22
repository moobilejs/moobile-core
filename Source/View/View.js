/*
---

name: View

description: Provides the base class for every objects that are displayed
             through an element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- View

...
*/

Moobile.View = new Class({

	Extends: Moobile.Entity,

	/**
	 * The view content.
	 * @type {ViewContent}
	 */
	content: null,

	/**
	 * Options.
	 * @type {Object}
	 */
	options: {
		className: 'view'
	},

	/**
	 * Enable the user interaction of the view.
	 * @return {View}
	 * @since 0.1
	 */
	enable: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * Disable the user interaction of the view.
	 * @return {View}
	 * @since 0.1
	 */
	disable: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * Add a child to the view content or the view itself. Use
	 * <code>header</code> or <code>footer</code> as second parameter to add a
	 * child at the top or bottom of the view itself.
	 * @since 0.1
	 * @see Entity#addChild
	 */
	addChild: function(entity, where, context) {

		if (entity instanceof Moobile.ViewContent) {
			return this.parent(entity, where, context);
		}

		switch (where) {
			case 'header': return this.parent(entity, 'top');
			case 'footer': return this.parent(entity, 'bottom');
		}

		if (this.content && this.content.hasOwner()) {

			if (this.hasChild(entity)) {
				return false;
			}

			if (this.hasElement(entity) && !this.content.hasElement(entity) ||
				this.hasElement(context) && !this.content.hasElement(context)) {
				return this.parent(entity, where, context);
			}

			return this.content.addChild(entity, where, context);
		}

		return this.parent(entity, where, context);
	},

	/**
	 * Get a child from the view or the view content.
	 * @since 0.1
	 * @see Entity#getChild
	 */
	getChild: function(name) {
		return this.content && this.content.hasOwner()
			 ? this.content.getChild(name) || this.parent(name)
			 : this.parent(name);
	},

	/**
	 * Indicate whether child exists in the view or the view content.
	 * @since 0.1
	 * @see Entity#hasChild
	 */
	hasChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.hasChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	/**
	 * Replace a child from the view or the view content.
	 * @since 0.1
	 * @see Entity#replaceChild
	 */
	replaceChild: function(replace, entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.replaceChild(replace, entity) || this.parent(replace, entity)
		     : this.parent(replace, entity);
	},

	/**
	 * Remove a child from the view or the view content.
	 * @since 0.1
	 * @see Entity#removeChild
	 */
	removeChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.removeChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	/**
	 * Return the children of the view and the view content.
	 * @since 0.1
	 * @see Entity#getChildren
	 */
	getChildren: function() {
		return [].concat(this.content.getChildren(), this.parent());
	},

	/**
	 * Return the view who owns this view.
	 * @return {View}
	 * @since 0.1
	 */
	getOwnerView: function() {

		var owner = this.owner;
		while (owner) {

			if (owner instanceof Moobile.View) {
				return owner;
			}

			owner = owner.getOwner();
		}

		return null;
	},

	/**
	 * Return the view content.
	 * @return {ViewContent}
	 * @since 0.1
	 */
	getContent: function() {
		return this.content;
	},

	/**
	 * Build required elements before roles are applied.
	 * @since 0.1
	 * @see Entity#willLoad
	 */
	willLoad: function() {

		this.parent();

		var content = this.getRoleElement('content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
		}

		this.defineElementRole(content, 'content');
	},

	/**
	 * @since 0.1
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.addEvent('swipe', this.bound('onSwipe'));
		this.element.addEvent('pinch', this.bound('onPinch'));
	},

	/**
	 * Destroy the view.
	 * @since 0.1
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.element.removeEvent('swipe', this.bound('onSwipe'));
		this.element.removeEvent('pinch', this.bound('onPinch'));
		this.content = null;
		this.parent();
	},

	/**
	 * Swipe event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @ignore
	 */
	onSwipe: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
	},

	/**
	 * Pinch event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @ignore
	 */
	onPinch: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
	}

});

/**
 * Return the view element of a file at a given path.
 * @param {String} path The file path.
 * @return {Element}
 * @since 0.1
 */
Moobile.View.elementAtPath = function(path) {
	return new Moobile.Request.ViewElement().load(path);
};

/**
 * Return the view of a file at a given path.
 * @param {String} path The file path.
 * @return {View}
 * @since 0.1
 */
Moobile.View.atPath = function(path) {

	var element = Moobile.View.elementAtPath(path);
	if (element) {
		return Class.instantiate(element.get('data-view') || 'Moobile.View', element, null, element.get('data-name'));
	}

	return null;
};

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-content', Moobile.View, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewContent, element, null, name);
	if (instance instanceof Moobile.ViewContent) {
		this.addChild(instance);
		this.content = instance; // must be assigned after addChild is called
	}

	return instance;
});
