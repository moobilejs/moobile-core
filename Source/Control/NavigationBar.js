/*
---

name: NavigationBar

description: Provides a bar control used to navigate between views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar

provides:
	- NavigationBar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_title: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	contentElement: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('navigation-bar');

		// <0.2-compat>
		var item = this.getRoleElement('item');
		if (item === null) {
		// </0.2-compat>

			var content = this.getRoleElement('content');
			if (content === null) {
				content = document.createElement('div');
				content.ingest(this.element);
				content.inject(this.element);
				content.setRole('content');
			}

			// contains only text
			var fc = content.firstChild;
			var lc = content.lastChild;
			if (fc && fc.nodeType === 3 &&
				lc && lc.nodeType === 3) {
				var title = this.getRoleElement('title');
				if (title === null) {
					title = document.createElement('div');
					title.ingest(content);
					title.inject(content);
					title.setRole('title');
				}
			}

		// <0.2-compat>
		}

		if (item) {
			item.dispose();
			item.ingest(this.element);
			item.inject(this.element);
		}
		// </0.2-compat>
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this._title = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		title = Moobile.Text.from(title);

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.contentElement);
		}

		this._title = title;
		this._title.addClass('navigation-bar-title');
		this.toggleClass('navigation-bar-title-empty', this._title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	shouldCenterTitle: function() {
		return Moobile.Theme.getName() === 'ios';
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

		this.parent();

		if (this.shouldCenterTitle() === false)
			return this;

		var element = this.element;
		var content = this.contentElement;

		var elementSize = element.getSize().x;
		var contentSize = content.getSize().x;
		var contentPosition = content.getPosition(element).x;

		var offset = ((elementSize / 2) - (contentPosition + contentSize / 2)) * 2;

		var fc = content.firstChild;
		var lc = content.lastChild;

		if (fc && fc.getPosition) {
			var pos = fc.getPosition(element).x + offset;
			if (pos < contentPosition) {
				offset += Math.abs(contentPosition - pos);
			}
		}

		if (lc && lc.getPosition) {
			var pos = lc.getPosition(element).x + lc.getSize().x + offset;
			if (pos > contentPosition + contentSize) {
				offset -= Math.abs(contentPosition + contentSize - pos);
			}
		}

		content.setStyle(offset < 0 ? 'padding-right' : 'padding-left', Math.abs(offset));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#addLeftButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addLeftButton: function(button) {
		return this.addChildComponent(button, 'top');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#addRightButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addRightButton: function(button) {
		return this.addChildComponent(button, 'bottom');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponents(Moobile.Button, destroy);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.defineRole('navigation-bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.NavigationBar, element, 'data-navigation-bar'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('content', Moobile.NavigationBar, {traversable: true}, function(element) {
	this.contentElement = element;
	this.contentElement.addClass('navigation-bar-content');
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('title', Moobile.NavigationBar, null, function(element) {
	this.setTitle(Moobile.Component.create(Moobile.Text, element, 'data-title'));
});

