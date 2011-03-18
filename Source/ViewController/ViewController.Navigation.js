/*
---

name: ViewController.Navigation

description: Provide navigation function to the view controller stack such as
             a navigation bar and navigation bar buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Request.ViewController
	- ViewController

provides:
	- ViewController.Navigation

...
*/

Moobile.ViewController.Navigation = new Class({

	Extends: Moobile.ViewController.Stack,

	loadView: function(view) {
		this.view = view || new Moobile.View.Navigation(new Element('div'));
	}

});