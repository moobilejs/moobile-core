"use strict"

var ViewTransition = moobile.ViewTransition;

var prefix = '';
var vendor = ['Webkit',  'Moz',  'O',  'ms', 'Khtml'];

var test = document.createElement('div');

for (var i = 0; i < vendor.length; i++) {
	var name = vendor[i] + 'AnimationName';
	if (name in test.style) {
		prefix = '-' + vendor[i].toLowerCase() + '-';
		break;
	}
}

var create = function(name, x1, x2) {
	return  '@' + prefix + 'keyframes ' + name + ' { from { ' + prefix + 'transform: translate3d(' + x1 + 'px, 0, 0); } to { ' + prefix + 'transform: translate3d(' + x2 + 'px, 0, 0); }}';
};

var unique = function(name) {
	return name + '-' + String.uniqueID();
}

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Slide
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Slide = moobile.ViewTransition.Slide = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Slide#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	options: {
		enhanceBackButtonOnEnter: true,
		enhanceBackButtonOnLeave: true
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var style = null;
		var items = [];

		var onStart = function() {

			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();

			if (this.options.enhanceBackButtonOnEnter) {

				var keyframes = '';

				viewToShow.getChildComponentsByType(NavigationBar).each(function(navigationBar) {

					var width = navigationBar.getSize().x;
					if (width) {

						navigationBar.getChildComponentsByType(Button).each(function(button) {

							var style = button.getStyle();
							if (style !== 'back' &&
								style !== 'forward')
								return;

							var x1 = width / 2;
							var x2 = 0;

							var name = unique('transition-slide-enter-navigation-button-to-show');
							var anim = create(name, x1, x2);
							var elem = button.getElement();
							elem.setStyle('animation-name', name)
							items.push(elem);

							keyframes += anim;

						}, this);
					}
				}, this);

				style = document.createElement('style').set('text', keyframes).inject(document.head);
			}

		}.bind(this);

		var onEnd = function() {

			viewToShow.removeClass('transition-view-to-show');
			viewToHide.removeClass('transition-view-to-hide');
			viewToHide.hide();

			this.didEnter(viewToShow, viewToHide, parentView);

			if (items) {
				items.invoke('setStyle', 'animation-name', null);
				items = null;
			}

			if (style) {
				style.destroy();
				style = null;
			}

		}.bind(this);

		var animation = new Animation(parentElem);
		animation.setAnimationClass('transition-slide-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var style = null;
		var items = [];

		var onStart = function() {

			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();

			if (this.options.enhanceBackButtonOnLeave) {

				var keyframes = '';

				viewToHide.getChildComponentsByType(NavigationBar).each(function(navigationBar) {

					var width = navigationBar.getSize().x;
					if (width) {

						navigationBar.getChildComponentsByType(Button).each(function(button) {

							var style = button.getStyle();
							if (style !== 'back' &&
								style !== 'forward')
								return;

							var x1 = 0;
							var x2 = width / 2 - button.getSize().x / 2;

							var name = unique('transition-slide-leave-navigation-button-to-hide');
							var anim = create(name, x1, x2);
							var elem = button.getElement();
							elem.setStyle('animation-name', name)
							items.push(elem);

							keyframes += anim;
						});
					}
				});

				style = document.createElement('style').set('text', keyframes).inject(document.head);
			}

		}.bind(this);

		var onEnd = function() {

			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didLeave(viewToShow, viewToHide, parentView);

			if (items) {
				items.invoke('setStyle', 'animation-name', null);
				items = null;
			}

			if (style) {
				style.destroy();
				style = null;
			}

		}.bind(this);

		var animation = new Animation(parentElem);
		animation.setAnimationClass('transition-slide-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});