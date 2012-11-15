/*
---

name: ViewTransition.Slide

description: Provide an horizontal slide view transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Slide

...
*/

(function() {

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
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Slide
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
Moobile.ViewTransition.Slide = new Class({

	Extends: Moobile.ViewTransition,

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
		}.bind(this);

		var onEnd = function() {

			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
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

		if (Moobile.Theme.getName() === 'ios') {

			viewToShow.addEvent('show:once', function() {

				var kf = '';

				viewToShow.getChildComponentsOfType(Moobile.NavigationBar).each(function(navigationBar) {

					var width = navigationBar.getSize().x;
					if (width) {

						navigationBar.getChildComponentsOfType(Moobile.Button).each(function(button) {

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

							kf += anim;

						}, this);
					}
				}, this);

				style = document.createElement('style').set('text', kf).inject(document.head);

			}.bind(this));
		}

		var animation = new Moobile.Animation(parentElem);
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
		}.bind(this);

		var onEnd = function() {

			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
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

		if (Moobile.Theme.getName() === 'ios') {

			viewToShow.addEvent('show:once', function() {

				var kf = '';

				viewToHide.getChildComponentsOfType(Moobile.NavigationBar).each(function(navigationBar) {

					var width = navigationBar.getSize().x;
					if (width) {

						navigationBar.getChildComponentsOfType(Moobile.Button).each(function(button) {

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

							kf += anim;
						});
					}
				});

				style = document.createElement('style').set('text', kf).inject(document.head);

			}.bind(this));
		}

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-slide-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});

})();