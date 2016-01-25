/*
---

name: Event.CSS3

description: Provides CSS3 events.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Custom-Event/Element.defineCustomEvent

provides:
	- Event.CSS3

...
*/

(function() {

// TODO: Property detect if a prefix-less version is available

var a = '';
var t = '';

if (Browser.safari || Browser.chrome || Browser.Platform.ios) {
	a = 'webkitAnimationEnd';
	t = 'webkitTransitionEnd';
} else if (Browser.firefox) {
	a = 'animationend';
	t = 'transitionend';
} else if (Browser.opera) {
	a = 'oAnimationEnd';
	t = 'oTransitionEnd';
} else if (Browser.ie) {
	a = 'msAnimationEnd';
	t = 'msTransitionEnd';
}

Element.NativeEvents[a] = 2;
Element.NativeEvents[t] = 2;
Element.Events['transitionend'] = { base: t, onAdd: function(){}, onRemove: function(){} };
Element.Events['animationend'] = { base: a, onAdd: function(){}, onRemove: function(){} };

Element.defineCustomEvent('owntransitionend', {
	base: 'transitionend',
	condition: function(e) {
		e.stop();
		return e.target === this;
	}
});

Element.defineCustomEvent('ownanimationend', {
	base: 'animationend',
	condition: function(e) {
		e.stop();
		return e.target === this;
	}
})

})();
