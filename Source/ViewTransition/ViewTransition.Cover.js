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
				document.id(parentView).addClass('transition-cover-box');				
				break;
			
			case 'center':
				this.overlay = new Moobile.Overlay();
				document.id(parentView).addClass('transition-cover-center');		
				break;
			
			case 'fullscreen':
				this.overlay = null;
				break;
		}
		
		if (this.overlay) {

			document.id(this.overlay).addClass('transition-cover-overlay');
			
			this.overlay.addEvent('show', this.bound('onMaskShow'));
			this.overlay.addEvent('hide', this.bound('onMaskHide'));
			
			parentView.addChild(this.overlay)
			
			this.overlay.showAnimated();			
		}

		if (first) {			
			this.animate(viewToShow, 'transition-cover-enter-first');
			return this;
		}

		document.id(viewToHide).addClass('transition-cover-background-view');
		document.id(viewToShow).addClass('transition-cover-foreground-view');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cover-enter');

		return this;
	},

	didEnter: function(viewToShow, viewToHide, parentView, first) {
		
		this.parent(viewToShow, viewToHide, parentView, first);
		
		viewToHide.show();
		
		return this;
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

		return this;
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
					
				document.id(parentView).removeClass('transition-cover-box');
				
				break;
			
			case 'center':
				document.id(parentView).removeClass('transition-cover-center');		
				break;
			
			case 'fullscreen':
				break;
		}	
		
		document.id(viewToHide).removeClass('transition-cover-foreground-view');
		document.id(viewToShow).removeClass('transition-cover-background-view');		
		
		return this;		
	},
	
	onMaskShow: function() {
		
	},
	
	onMaskHide: function() {
		this.overlay.destroy();
		this.overlay = null;
	}

});