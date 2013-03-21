"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Util/Overlay
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var Overlay = moobile.Overlay = new Class({

	Extends: moobile.Component,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('overlay');
		this.on('animationend', this.bound('__onAnimationEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.off('animationend', this.bound('__onAnimationEnd'));
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Util/Overlay#showAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.addClass('show-animated').removeClass('hidden');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Util/Overlay#hideAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		return this;
	},

	/* Private API */

	/**
	 * @see    http://moobilejs.com/doc/latest/Util/Overlay#__onAnimationEnd
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onAnimationEnd: function(e) {

		e.stop();

		if (this.hasClass('show-animated')) {
			this.removeClass('show-animated');
			this.didShow();
		}

		if (this.hasClass('hide-animated')) {
			this.removeClass('hide-animated');
			this.addClass('hidden');
			this.didHide();
		}
	}

});
