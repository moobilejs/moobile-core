/*
---

name: String

description: Provides extra methods to String.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String

...
*/

String.implement({

	camelize: function() {
		return this.toString()
	    	.replace(/([A-Z]+)/g,   function(m,l) { return l.substr(0, 1).toUpperCase() + l.toLowerCase().substr(1, l.length); })
		    .replace(/[\-_\s](.)/g, function(m,l) { return l.toUpperCase(); });
	}

});

