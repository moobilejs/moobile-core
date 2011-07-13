/*
---

name: ViewTransition.Cubic

description: Provide a cubic view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cubic

...
*/

Moobile.ViewTransition.Cubic = new Class({

	/**
	 * Unfortunately, this transition cannot be handled only with css, 
	 * because translateZ does not handle percentage, and it's quite
	 * comprehensible.
	 */

	Extends: Moobile.ViewTransition,

	mode: null,

	size: null,

	content: null,
	
	enter: function(viewToShow, viewToHide, parentView, firstViewIn) {
	
		this.mode = 'enter';
		this.size = parentView.getSize();
		
		this.content = parentView.content;
	
		this.setTransitionElement(parentView.content);

		parentView.addClass('transition-cubic-viewport');
		parentView.content.addClass('transition-cubic');
		parentView.content.addClass('transition-cubic-enter');
		parentView.content.setStyle('-webkit-transform', 'translateZ(-' + this.size.x / 2 + 'px)');

		viewToShow.addClass('transition-cubic-view-to-show');
		viewToShow.setStyle('-webkit-transform', 'rotateY(90deg) translateX(-' + this.size.x + 'px) translateZ(' + this.size.x / 2 + 'px)');

		if (firstViewIn) {
			viewToShow.setStyle('-webkit-transform', 'rotateY(90deg) translateZ(' + this.size.x / 2 + 'px)');
		} else {
			viewToHide.addClass('transition-cubic-view-to-hide');
			viewToHide.setStyle('-webkit-transform', 'rotateY(0deg)  translateZ(' + this.size.x / 2 + 'px)');
			viewToShow.setStyle('-webkit-transform', 'rotateY(90deg) translateZ(' + this.size.x / 2 + 'px) translateY(-' + this.size.y + 'px)');			
		}
			
		this.start(function() {
			
			parentView.removeClass('transition-cubic-viewport');				
			parentView.content.removeClass('transition-cubic');
			parentView.content.removeClass('transition-cubic-enter');
			parentView.content.removeStyle('-webkit-transform');
			
			viewToShow.removeClass('transition-cubic-view-to-show');
			viewToShow.removeStyle('-webkit-transform');
			
			if (firstViewIn == false) {
				viewToHide.removeClass('transition-cubic-view-to-hide');
				viewToHide.removeStyle('-webkit-transform', null);
			}
			
		});

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.mode = 'leave';
		this.size = parentView.getSize();
		
		this.content = parentView.content;

		this.setTransitionElement(parentView.content);

		parentView.addClass('transition-cubic-viewport');
		parentView.content.addClass('transition-cubic');
		parentView.content.addClass('transition-cubic-leave');
		parentView.content.setStyle('-webkit-transform', 'translateZ(-' + this.size.x / 2 + 'px)');
		
		viewToHide.addClass('transition-cubic-view-to-hide');
		viewToHide.setStyle('-webkit-transform', 'rotateY(0deg) translateZ(' + this.size.x / 2 + 'px) translateY(-' + this.size.y + 'px)');
				
		viewToShow.addClass('transition-cubic-view-to-show');
		viewToShow.setStyle('-webkit-transform', 'rotateY(-90deg) translateZ(' + this.size.x / 2 + 'px)');

		this.start(function() {
			
			parentView.removeClass('transition-cubic-viewport');
			parentView.content.removeClass('transition-cubic');
			parentView.content.removeClass('transition-cubic-leave');
			parentView.content.removeStyle('-webkit-transform');
			
			viewToHide.removeClass('transition-cubic-view-to-hide');
			viewToHide.removeStyle('-webkit-transform');
			
			viewToShow.removeClass('transition-cubic-view-to-show');			
			viewToShow.removeStyle('-webkit-transform');
		});

		return this;
	},

	play: function() {
	
		switch (this.mode) {
			case 'enter': this.content.setStyle('-webkit-transform', 'translateZ(-' + this.size.x / 2 + 'px) rotateY(-90deg)'); break;
			case 'leave': this.content.setStyle('-webkit-transform', 'translateZ(-' + this.size.x / 2 + 'px) rotateY(90deg)'); break;
		}
		
		return this.parent();
	}	

});