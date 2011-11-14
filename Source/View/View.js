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

	addChild: function(entity, where, context) {

		if (entity instanceof Moobile.ViewContent) {
			return this.parent(entity, where, context); 
		}
	
		switch (where) {
			case 'header': return this.parent(entity, 'top'); 
			case 'footer': return this.parent(entity, 'bottom'); 
		}

		if (this.content && this.content.hasOwner()) {
		
			if (this.hasChild(entity)) {
				return false;
			}
				
			if (this.hasElement(entity) && !this.content.hasElement(entity) || 
				this.hasElement(context) && !this.content.hasElement(context)) {
				return this.parent(entity, where, context);
			}		
			
			return this.content.addChild(entity, where, context);
		}
				
		return this.parent(entity, where, context); 
	},

	getChild: function(name) {	
		return this.content && this.content.hasOwner()
			 ? this.content.getChild(name) || this.parent(name)
			 : this.parent(name);
	},
	
	hasChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.hasChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	replaceChild: function(replace, entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.replaceChild(replace, entity) || this.parent(replace, entity)
		     : this.parent(replace, entity);
	},

	removeChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.removeChild(entity) || this.parent(entity)
		     : this.parent(entity);
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
	var elements = [];
	path = Array.from(path);
	path.each(function(source) {
		new Moobile.Request.ViewElement().load(source, function(element) {
			elements.push(element);
			if (elements.length == path.length) {
				callback.apply(this, elements);
			}
		});
	});	
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
