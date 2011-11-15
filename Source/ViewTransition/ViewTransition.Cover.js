/*
---

name: ViewTransition.Cover

description: Provide a vertical slide view transition.

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

	overlay: null,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);
		
		switch (this.options.presentation) {
			
			case 'box':					
				this.overlay = new Moobile.Overlay();
				viewToShow = new Element('div.transition-cover-view-wrapper').wraps(viewToShow);
				parentView.addClass('transition-cover-box');				
				break;
			
			case 'center':
				this.overlay = new Moobile.Overlay();
				parentView.addClass('transition-cover-center');		
				break;
			
			case 'fullscreen':
				this.overlay = null;
				break;
		}
		
		if (this.overlay) {

			this.overlay.addClass('transition-cover-overlay');
			
			this.overlay.addEvent('show', this.bound('onMaskShow'));
			this.overlay.addEvent('hide', this.bound('onMaskHide'));
			
			parentView.addChild(this.overlay)
			
			this.overlay.showAnimated();			
		}

		if (first) {			
			this.animate(viewToShow, 'transition-cover-enter-first');
			return;
		}

		viewToHide.addClass('transition-cover-background-view');
		viewToShow.addClass('transition-cover-foreground-view');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cover-enter');
	},

	didEnter: function(viewToShow, viewToHide, parentView, first) {
		this.parent(viewToShow, viewToHide, parentView, first);
		viewToHide.show();
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);
		
		if (this.overlay) {
			this.overlay.hideAnimated();
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
	},
	
	didLeave: function(viewToShow, viewToHide, parentView) {

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
	
	},
	
	onMaskShow: function() {
		
	},
	
	onMaskHide: function() {
		this.overlay.destroy();
		this.overlay = null;
	}

});
