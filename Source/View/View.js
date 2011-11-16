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

	enable: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},
	
	disable: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
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

	getChildren: function() {
		return [].concat(this.content.getChildren(), this.parent());
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

Moobile.View.elementAtPath = function(path) {
	return new Moobile.Request.ViewElement().load(path);
};

Moobile.View.atPath = function(path) {
	
	var element = Moobile.View.elementAtPath(path);
	if (element) {
		return Class.instantiate(element.get('data-view') || 'Moobile.View', element, null, element.get('data-name'));
	}
	
	return null;
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
