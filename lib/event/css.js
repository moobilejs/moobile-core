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

var prefix = '';
if (Browser.safari || Browser.chrome || Browser.Platform.ios) {
	prefix = 'webkit';
} else if (Browser.firefox) {
	prefix = 'Moz';
} else if (Browser.opera) {
	prefix = 'o';
} else if (Browser.ie) {
	prefix = 'ms';
}

Element.NativeEvents[prefix + 'TransitionEnd'] = 2;
Element.Events['transitionend'] = { base: (prefix + 'TransitionEnd'), onAdd: function(){}, onRemove: function(){} };

Element.NativeEvents[prefix + 'AnimationEnd'] = 2;
Element.Events['animationend'] = { base: (prefix + 'AnimationEnd'), onAdd: function(){}, onRemove: function(){} };

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
