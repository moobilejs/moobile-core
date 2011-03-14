/*
---

name: Exception

description: Provides exceptions class based on Error class.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Debug

provides:
	- Exception

...
*/

if (!window.Moobile) window.Moobile = {};

Error.prototype.explain = function() {
	Moobile.debug('Error:', this.message);
	Moobile.debug('Stack:', this.stack);
};

// Moobile.Exception

Moobile.Exception = function(message) {
	this.name = 'Moobile.Exception';
	this.message = message;
};
Moobile.Exception.prototype = new Error;

// Moobile.Exception.ViewControllerRequest

Moobile.Exception.ViewControllerRequest = function(message) {
	this.name = 'Moobile.Exception.ViewControllerRequest';
	this.message = message;
};

Moobile.Exception.ViewControllerRequest.prototype = new Moobile.Exception;

// Moobile.Exception.ViewControllerTransition

Moobile.Exception.ViewControllerTransition = function(message) {
	this.name = 'Moobile.Exception.ViewControllerTransition';
	this.message = message;
};

Moobile.Exception.ViewControllerTransition.prototype = new Moobile.Exception;

// Moobile.Exception.History

Moobile.Exception.History = function(message) {
	this.name = 'Moobile.Exception.History';
	this.message = message;
};

Moobile.Exception.History.prototype = new Moobile.Exception;