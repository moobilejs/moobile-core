/*
---

name: Browser.Platform

description: Provides extra indication about the current platform.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Browser
	- Mobile/Browser.Mobile
	- Mobile/Browser.Features.Touch

provides:
	- Browser.Platform

...
*/

Browser.Platform.cordova = window.Cordova && Browser.isMobile && !Browser.safari;
