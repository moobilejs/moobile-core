/*
---

name: EntityRoles

description: 

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras

provides:
	- EntityRoles

...
*/

if (!window.Moobile) window.Moobile = {};

(function() {

var filter = function(element) {

	var parent = element.getParent();
	if (parent) {
		return this.element === parent || filter.call(this, parent);
	}
	
	return false;
};

Moobile.EntityRoles = new Class({

	Implements: Class.Binds,

	$roles: {},

	loadRoles: function() {
		
		this.rolesWillLoad();

		var attach = function(element) {
			var role = element.get('data-role');
			if (role) {
				this.setRole(role, element);
			}
		};
		
		var f = filter.bind(this);
		var a = attach.bind(this);
		this.element.getElements('[data-role]').filter(f).each(a);
		
		this.rolesDidLoad();
		
		return this;
	},
		
	setRole: function(role, element) {

		if (element.retrieve('entity.roles.role'))
			return this;

		var res = true;
		var def = this.$roles[role];
		if (def) {

			var options = element.get('data-options');
			if (options) {
				
				if (!options.match(/^\{/)) options = '{' + options;
				if (!options.match(/\}$/)) options = options + '}';

				try {
					options = JSON.decode(options);	
				} catch (e) {
					throw new Error('Error parsing JSON string: ' + options);
				}
									
			} else {
				options = {};
			}

			res = def.call(this, element, options, name || element.get('data-name'));
			
			element.store('entity.roles.role', res);					
		}
		
		return this;
	},
	
	getRole: function(element) {
		return element.retrieve('entity.roles.role');
	},
	
	getRoleElement: function(role) {
		role = role.clean();
		return this.element.getElements('[data-role="' + role + '"]').filter(filter.bind(this))[0] || null;
	},
	
	getRoleElements: function(role) {
		role = role.clean();
		return this.element.getElements('[data-role="' + role + '"]').filter(filter.bind(this));
	},	
	
	rolesWillLoad: function() {

	},
	
	rolesDidLoad: function() {

	}
	
});
	
})();