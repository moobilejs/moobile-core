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

	elements: [],

	options: {
		layout: 'horizontal',
		momentum: false,
		hScrollbar: false,
		vScrollbar: false,
		snap: true,
		snapThreshold: 40
	},

	initialize: function(wrapper, content, options) {

		this.parent(wrapper, content, options);

		this.wrapper.addClass('carousel');
		this.wrapper.addClass('carousel-' + this.options.layout);

		this.elements = this.content.getElements('>');
		this.elements.addClass('slide');

		this.update();

		return this;
	},

	update: function() {

		var size = null;
		var style = null;

		switch (this.options.layout) {
			case 'horizontal':
				size = this.wrapper.getSize().x;
				style = 'width';
				break;
			case 'vertical':
				size = this.wrapper.getSize().y;
				style = 'height';
				break;
		}

		this.elements.setStyle(style, 100 / this.elements.length + '%');
		this.content.setStyle(style, 100 * this.elements.length + '%');

		this.scroller.options.snapThreshold = size * this.options.snapThreshold / 100;

		return this;
	},

	onRefresh: function() {
		this.parent();
		this.update();
		return this;
	}

});