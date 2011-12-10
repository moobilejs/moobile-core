/*
---

name: String.Extras

description: Provides extra methods to the String prototype.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String.Extras

...
*/

String.implement({

	toCamelCase: function() {
		return this.camelCase().replace('-', '').replace(/\s\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
	}

});
