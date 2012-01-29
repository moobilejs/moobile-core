/*
---

name: Entity.NativeEvents

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Class-Extras/Class.Binds

provides:
	- Entity.NativeEvents

...
*/

(function() {

Moobile.Entity.NativeEvents = Array.append(

	Object.keys(Element.NativeEvents), [

	'tapstart',
	'tapmove',
	'tapend',
	'tap',

	'transitionEnd',
	'animationEnd'

]);

})();