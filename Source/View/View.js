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
	
	content: null,

	options: {
		className: 'view'
	},

	teardown: function() {
		this.parent();
		this.content = null;
	},

	attachEvents: function() {
		this.parent();
		this.element.addEvent('swipe', this.bound('onSwipe'));
	},

	detachEvents: function() {
		this.parent();
		this.element.removeEvent('swipe', this.bound('onSwipe'));
	},

	addChild: function(child, where, context) {

		if (child instanceof Moobile.ViewContent) {
			return this.parent(child, where, context); 
		}
	
		switch (where) {
			case 'header': return this.parent(child, 'top'); 
			case 'footer': return this.parent(child, 'bottom'); 
		}

		if (this.content && this.content.hasOwner()) {
		
			if (this.hasChild(child)) {
				return false;
			}
				
			if (this.hasElement(child) && !this.content.hasElement(child) || 
				this.hasElement(context) && !this.content.hasElement(context)) {
				return this.parent(child, where, context);
			}		
			
			return this.content.addChild(child, where, context);
		}
				
		return this.parent(child, where, context); 
	},

	getChild: function(name) {	
		return this.content && this.content.hasOwner()
			 ? this.content.getChild(name) || this.parent(name)
			 : this.parent(name);
	},
	
	hasChild: function(child) {
		return this.content && this.content.hasOwner()
		     ? this.content.hasChild(child) || this.parent(child)
		     : this.parent(child);
	},

	replaceChild: function(replace, child) {
		return this.content && this.content.hasOwner()
		     ? this.content.replaceChild(replace, child) || this.parent(replace, child)
		     : this.parent(replace, child);
	},

	removeChild: function(child) {
		return this.content && this.content.hasOwner()
		     ? this.content.removeChild(child) || this.parent(child)
		     : this.parent(child);
	},

	getOwnerView: function() {
		
		var owner = this.owner;
		while (owner) {
			
			if (owner instanceof Moobile.View) {
				return owner;
			}
			
			owner = owner.getOwner();			
		}				

		return null;
	},

	getContent: function() {
		return this.content;
	},

	rolesWillLoad: function() {
		
		this.parent();
	
		var content = this.getRoleElement('content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
		}
		
		this.setRole('content', content);
	},
	
	onSwipe: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
	}

});

Moobile.View.elementFromPath = function(path, callback) {
	new Moobile.Request.View().load(path, callback);
};

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.View, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewContent, element, options, name);
	if (instance instanceof Moobile.ViewContent) {
		this.addChild(instance);
		this.content = instance;		
	}
		
	return instance;
});
