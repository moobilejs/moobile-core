/*
---

name: NavigationBarItem

description: Provides the content of a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- BarItem

provides:
	- NavigationBarItem

...
*/

Moobile.NavigationBarItem = new Class({

	Extends: Moobile.BarItem,
	
	title: null,
	
	setup: function() {
		
		this.parent();
		
		var className = this.options.className;
		if (className) {
			this.element.addClass('navigation-' + className);
		}
	},
	
	teardown: function() {
		this.parent();
		this.title = null;
	},
	
	setTitle: function(title) {

		if (this.title === title)
			return this;

		this.title.setText(null);
		this.title.hide();

		if (title) {
			if (typeof title == 'string') {
				this.title.setText(title);
				this.title.show();
			} else {
				this.replaceChildView(this.title, title);
				this.title.destroy();
				this.title = title;				
			}
		}

		return this;
	},

	getTitle: function() {
		return this.title;
	},
		
	rolesWillLoad: function() {

		this.parent();

		var title = this.getRoleElement('title');

		if (title == null) {
			title = new Element('div');
			title.ingest(this.element);
			title.inject(this.element);
		}
		
		this.setRole('title', title);
	}
	
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('title', Moobile.NavigationBarItem, function(element, options, name) {

	var instance = Class.instantiate(element.get('title') || Moobile.BarTitle, element, options, name);
	if (instance instanceof Moobile.BarTitle) {
		this.addChild(instance);
		this.title = instance;
	}
	
	return instance;
});
