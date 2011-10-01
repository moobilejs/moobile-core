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

		this.empty();

		var type = typeOf(element);
		if (type == 'element') {
			this.adopt(Array.from(element.childNodes));
			return this;
		}

		if (type == 'string') {
			var match = element.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
			if (match) element = match[1];
			this.set('html', element);
		}

		return this;
	}

});