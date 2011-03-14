/*
---

name: Application.iPhone

description: Provide an application container for an iPhone application.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Application

provides:
	- Application.iPhone

...
*/
Moobile.Application.iPhone = new Class({

	Extends: Moobile.Application,

	startup: function() {
		this.parent();
		this.viewControllerWindow.addClass('iphone');
		if (Browser.Platform.desktop) this.viewControllerWindow.addClass('desktop');
		if (Browser.Platform.phonegap) this.viewControllerWindow.addClass('phonegap');
		return this;
	}

})