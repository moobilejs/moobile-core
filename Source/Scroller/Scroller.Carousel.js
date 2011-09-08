/*
---

name: Scroller.Carousel

description: Creates snap to element carousel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller

provides:
	- Scroller.Carousel

...
*/

Moobile.Scroller.Carousel = new Class({

	Extends: Moobile.Scroller,

	options: {
		element: 'li',
		momentum: false,
		hScrollbar: false,
		vScrollbar: false,
		orientation: 'horizontal',
		snap: true,
		snapThreshold: 50
	},

	initialize: function(wrapper, content, options) {

		if (options) {
			options.snap = options.element || this.options.element;
		} else {
			options = {
				snap: this.options.element
			};
		}

		this.parent(wrapper, content, options);

		this.wrapper.addClass('carousel');
		this.wrapper.addClass('carousel-' + this.options.orientation);

		var size = this.wrapper.getSize();

		var elements = this.wrapper.getElements(this.options.element);

		var element = this.wrapper.getElement(this.options.element);
		if (element) {
			var parent = element.getParent();
			if (parent) {
				parent.addClass('carousel-content');

				var key = '';
				var val = 0;

				switch (this.options.orientation) {
					case 'vertical':
						key = 'height';
						val = size.y * elements.length;
						this.scroller.options.snapThreshold = size.y / 2;
						break;

					case 'horizontal':
						key = 'width';
						val = size.x * elements.length
						this.scroller.options.snapThreshold = size.x / 2;
						break;
				}

				parent.setStyle(key, val);

				if (this.content !== parent) {
					this.content.setStyle(key, val);
				}
			}
		}

		return this;
	}

});