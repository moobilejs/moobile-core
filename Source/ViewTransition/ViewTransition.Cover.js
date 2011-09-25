/*
---

name: ViewTransition.Cover

description: Provide a view transition that covers the previous view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cover

...
*/

Moobile.ViewTransition.Cover = new Class({

	Extends: Moobile.ViewTransition,

	options: {
		presentation: 'fullscreen' // center, box
	},

	mask: null,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		switch (this.options.presentation) {
			
			case 'box':					
				this.mask = new Moobile.Mask();
				viewToShow = new Element('div.transition-cover-view-wrapper').wraps(viewToShow);
				parentView.addClass('transition-cover-box');				
				break;
			
			case 'center':
				this.mask = new Moobile.Mask();
				parentView.addClass('transition-cover-center');		
				break;
			
			case 'fullscreen':
				this.mask = null;
				break;
		}
		
		if (this.mask) {

			this.mask.addClass('transition-cover-mask');
			this.mask.addEvent('show', this.bound('onMaskShow'));
			this.mask.addEvent('hide', this.bound('onMaskHide'));
			
			parentView.addChildView(this.mask)
			
			this.mask.show();			
		}

		if (first) {			
			this.animate(viewToShow, 'transition-cover-enter-first');
			return this;
		}

		viewToHide.addClass('transition-cover-background-view');
		viewToShow.addClass('transition-cover-foreground-view');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cover-enter');

		return this;
	},

	onEnter: function(viewToShow, viewToHide, parentView, first) {
		
		this.parent(viewToShow, viewToHide, parentView, first);
		
		viewToHide.show();
		
		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);
		
		if (this.mask) {
			this.mask.hide();
		}
		
		if (this.options.presentation == 'box') {
			var viewToHideElement = document.id(viewToHide);
			var viewToHideWrapper = viewToHideElement.getParent('.transition-cover-view-wrapper');
			if (viewToHideWrapper) {
				viewToHide = viewToHideWrapper;
			}				
		}
		
		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cover-leave');

		return this;
	},
	
	onLeave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);
		
		switch (this.options.presentation) {
			
			case 'box':	
								
				var viewToHideElement = document.id(viewToHide);
				var viewToHideWrapper = viewToHideElement.getParent('.transition-cover-view-wrapper');
				if (viewToHideWrapper) {
					viewToHideElement.inject(viewToHideWrapper, 'after');
					viewToHideWrapper.destroy();
					viewToHideWrapper = null;
				}
					
				parentView.removeClass('transition-cover-box');
				
				break;
			
			case 'center':
				parentView.removeClass('transition-cover-center');		
				break;
			
			case 'fullscreen':
				break;
		}	
		
		viewToHide.removeClass('transition-cover-foreground-view');
		viewToShow.removeClass('transition-cover-background-view');		
		
		return this;		
	},
	
	onMaskShow: function() {
		
	},
	
	onMaskHide: function() {
		this.mask.destroy();
		this.mask = null;
	}

});