/*
---

name: Element

description: Provides extra methods to Element.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

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

Element.implement
({
	ingest: function(string) {
		var match = string.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		if (match) string = match[1];
		this.set('html', string);
		return this
	}
});