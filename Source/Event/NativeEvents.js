/*
---

name: NativeEvents

description: Provides an array that contains all the events applicable to a DOM
             element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- NativeEvents

...
*/

Moobile.NativeEvents = Array.append(

	Object.keys(Element.NativeEvents), [

	'tapstart',
	'tapmove',
	'tapend',
	'tap',

	'pinch',
	'swipe',

	'transitionEnd',
	'animationEnd'

]);