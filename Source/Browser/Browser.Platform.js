/*
---

name: Browser.Platform

description: Provides extra indication about the current platform such as
             desktop, mobile, phonegap.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Browser.Platform

...
*/

Browser.Platform.desktop =
	Browser.Platform.mac ||
	Browser.Platform.win ||
	Browser.Platform.linux ||
	Browser.Platform.other;

Browser.Platform.mobile =
	Browser.Platform.ios ||
	Browser.Platform.webos ||
	Browser.Platform.android;

Browser.Platform.phonegap =
	window.device &&
	window.device.phonegap;

Browser.Platform.simulator = false;