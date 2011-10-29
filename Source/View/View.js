/*
---

name: View

description: Provides the base class for every objects that are displayed 
             through an element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity
	
provides:
	- View

...
*/

Moobile.View = new Class({

	Extends: Moobile.Entity,

	Implements: [
		Moobile.Entity.Roles
	],

	content: null,

	options: {
		className: 'view'
	},

	setup: function() {
		
		this.parent();

		var content = this.getRoleElement('content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
			this.setRole('content', content);			
		}
		
		this.loadRoles();

		return this;
	},
	
	teardown: function() {
		this.parent();
		this.content = null;
		return this;
	},

	attachEvents: function() {
		this.parent();
		this.element.addEvent('swipe', this.bound('onSwipe'));
		return this;
	},

	detachEvents: function() {
		this.parent();
		this.element.removeEvent('swipe', this.bound('onSwipe'));
		return this;
	},

	addChild: function(child, where, relative) {
		
		switch (where) {
			
			case 'header': 
				this.addChild(child, 'top'); 
				return this;
			
			case 'footer': 
				this.addChild(child, 'bottom'); 
				return this;
				
			case 'content':
				this.addChild(child);
				return this;
		}

		this.content.addChild(child, where, relative);
		
		return this;
	},

	getChild: function(name) {
		return this.content.getChild(name) || this.parent(name);
	},

	getChildAt: function(index) {
		return this.content.getChildAt(index) || this.parent(index);
	},

	replaceChild: function(replace, child) {
		return this.content.replaceChild(replace, child) || this.parent(replace, child);
	},

	removeChild: function(child) {
		return this.content.removeChild(child) || this.parent(child);
	},

	getContent: function() {
		return this.content;
	},

	onSwipe: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
	}

});

Moobile.View.elementFromPath = function(path, callback) {
	new Moobile.Request.View().load(path, callback);
};

/**
 * @role content
 */
Moobile.Entity.defineRole('content', Moobile.View, function(element, options, name) {
	
	this.content = new Moobile.Entity(element, options);
	
	this.addChild(this.content, 'content');
	
	var className = this.options.className;
	if (className) {
		this.content.getElement().addClass(className + '-content');
	}
	
	return this.content;
});
