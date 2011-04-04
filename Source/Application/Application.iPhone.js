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

	createViewControllerStack: function() {
		return new Moobile.ViewController.Navigation();
	}

})