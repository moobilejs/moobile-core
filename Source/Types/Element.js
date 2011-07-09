/*
---

name: Element

description: Provides extra methods to Element.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Element

...
*/

(function() {
	
	var getChildElements = function() {
		return Array.from(this.childNodes);
	};
	
	Object.defineProperty(Element.prototype, 'childElements', {
		get: function() {
			return Array.from(this.childNodes);
		}	
	});
	
})();