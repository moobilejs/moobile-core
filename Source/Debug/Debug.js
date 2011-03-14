/*
---

name: Debug

description: Provides methods for ease of debugging.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Debug

...
*/

window.trace = function() {
	if (console) Array.from(arguments).each(function(a) { console.log(a) });
}
