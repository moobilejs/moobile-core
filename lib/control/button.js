"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var Button = moobile.Button = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__label: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#hitAreaElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	hitAreaElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		label: null
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('button');

		var label = this.getRoleElement('label');
		if (label === null) {
			label = document.createElement('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		this.on('tapcancel', this.bound('__onTapCancel'));
		this.on('tapstart', this.bound('__onTapStart'));
		this.on('tapend', this.bound('__onTapEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	didBuild: function() {

		this.parent();

		this.hitAreaElement = new Element('div.hit-area');
		this.hitAreaElement.inject(this.element);

		var label = this.options.label;
		if (label) this.setLabel(label);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.off('tapcancel', this.bound('__onTapCancel'));
		this.off('tapstart', this.bound('__onTapStart'));
		this.off('tapend', this.bound('__onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this.__label === label)
			return this;

		label = moobile.Text.from(label);

		if (this.__label) {
			this.__label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this.__label = label;
		this.__label.addClass('button-label');
		this.toggleClass('button-label-empty', this.__label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this.__label;
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onTapCancel: function(e) {
		if (this.isSelected()) this.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onTapStart: function(e) {
		if (!this.isSelected()) this.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onTapEnd: function(e) {
		if (!this.isSelected()) this.setHighlighted(false);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Button.from = function(source) {
	if (source instanceof Button) return source;
	var button = new Button();
	button.setLabel(source);
	return button;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('button', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(Button, element, 'data-button'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('label', Button, null, function(element) {
	this.setLabel(moobile.Component.create(moobile.Text, element, 'data-label'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Active Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('active', Button, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

/**
 * Warning Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('warning', Button, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

/**
 * Back Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('back', Button, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

/**
 * Forward Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('forward', Button, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});
