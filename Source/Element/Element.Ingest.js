/*
---

name: Element.Ingest

description: Provides a method that grab all the child element from an element
             or a string.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element.Ingest

...
*/



Element.implement({

	ingest: function(element) {
		return this.adopt(Array.from(document.id(element).childNodes));
	}

});