/*
---

name: String.Extras

description: Provides extra methods to String.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String.Extras

...
*/

String.implement({

	toJSONString: function() {
		return '{' + this.toString() + '}';
	},

	toJSONObject: function() {
		return JSON.decode(this.toJSONString());
	},

	toCamelCase: function() {
		return this.camelCase().replace('-', '').replace(/\s\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
	}

});

