/*
---

name: Entity.Roles

description: 

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Entity

provides:
	- Entity.Roles

...
*/

(function() {
	
var roles = {};
	
Moobile.Entity.defineRole = function(name, target, fn) {
	if (target) {
		target.prototype.$roles[name] = fn;
	} else  {
		roles[name] = fn;
	}
};	


Moobile.Entity.Roles = new Class({

	Implements: Class.Binds,

	$roles: {},

	getRoleElement: function(role) {
		role = role.clean();
		return this.element.getElements('[data-role="' + role + '"]').filter(filter.bind(this)).pop();
	},
	
	getRoleElements: function(role) {
		role = role.clean();
		return this.element.getElements('[data-role="' + role + '"]').filter(filter.bind(this));
	},

	loadRoles: function() {
		var f = filter.bind(this);
		var a = attach.bind(this);
		this.element.getElements('[data-role]').filter(f).each(a);
		return this;
	},
		
	setRole: function(role, element) {

		if (element.retrieve('entity.roles.role'))
			return this;
		
		var res = true;
		var def = roles[role] || this.$roles[role];
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
	}
	
});
	
var filter = function(element) {
	
	var parent = element.getParent('[data-role]');
	if (parent) {
		return parent.contains(this.element) || parent === this.element;
	}
	
	return true;
};

var attach = function(element) {
	var role = element.get('data-role');
	if (role) {
		this.setRole(role, element);
	}
};
	
})();