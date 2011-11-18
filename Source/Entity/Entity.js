/*
---

name: Entity

description: Provides the base class for every objects that are displayed 
             through an element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Class-Extras/Class.Binds
	- EntityRoles
	- EntityStyles

provides:
	- Entity

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.Entity = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	$roles: {},

	$styles: {},

	style: null,

	owner: null,

	name: null,

	element: null,

	children: [],

	window: null,

	ready: false,

	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	initialize: function(element, options, name) {

		this.name = name;
		
		var root = document.id(element);
		if (root == null) {
			root = new Element(this.options.tagName);
			if (typeof element == 'string') {
				root = Elements.from(element)[0];
			} 
		}
		
		this.element = root;

		options = options || {};

		for (var option in this.options) {
			var value = this.element.get('data-option-' + option.hyphenate());
			if (value != null) {
				if (options[option] == undefined) {
					options[option] = value;	
				}
			}			
		}
				
		this.setOptions(options);				

		this.element.addEvent('click', this.bound('onClick'));
		this.element.addEvent('mouseup', this.bound('onMouseUp'))
		this.element.addEvent('mousedown', this.bound('onMouseDown'));

		this.willLoad();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}		
		
		var styleName = this.options.styleName
		if (styleName) {
			this.setStyle(styleName);
		}
		
		this.element.getElements('[data-role]').each(function(element) {
			if (this.hasRoleElement(element)) {
				this.defineElementRole(element, element.get('data-role'));	
			} 
		}, this);

		this.didLoad();
		
		return this;
	},
	
	destroy: function() {
		
		this.willUnload();

		this.element.removeEvent('click', this.bound('onClick'));
		this.element.removeEvent('mouseup', this.bound('onMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onMouseDown'));

		this.removeFromParent();

		this.destroyChildren();
		
		this.element.destroy();
		this.element = null;
		this.window = null;
		this.owner = null;
		
		this.didUnload();
	},
	
	destroyChildren: function() {
		this.children.each(this.bound('destroyChild'));
		this.children.empty();
	},

	destroyChild: function(entity) {
		entity.destroy();
		entity = null;
	},

	addChild: function(entity, where, context) {

		var element = document.id(entity);
		if (element == null)
			return false;
		
		if (this.hasChild(entity))
			return false;

		this.willAddChild(entity);

		if (!this.hasElement(element)) {

			context = document.id(context);
			if (context == null) {
				context = this.element;
			} else if (!this.hasElement(context)) {
				throw new Error('You are trying to add a child relative to an element that does not belong to this entity');
			}

			element.inject(context, where);
		}

		this.children.push(entity);

		entity.ownerWillChange(this);
		entity.setOwner(this);
		entity.ownerDidChange(this);
		entity.setWindow(this.window);

		this.didAddChild(entity);

		if (this.ready == false) {
			this.addEvent('ready:once', function() {
				entity.setReady();		
			});
			return true;
		}
		
		entity.setReady();
		
		return true;
	},

	hasChild: function(entity) {
		return this.children.contains(entity);
	},
	
	getChild: function(name) {
		return this.children.find(function(children) {
			return children.getName() == name;
		});
	},
	
	getChildren: function() {
		return this.children;
	},

	replaceChild: function(replace, entity) {
		
		var success = this.addChild(entity, 'before', replace);
		if (success) {
			return this.removeChild(replace);
		}

		return false;
	},

	removeChild: function(entity) {

		var element = document.id(entity);
		if (element == null)
			return false;

		if (!this.hasElement(entity))
			return false;

		this.willRemoveChild(entity);

		entity.ownerWillChange(null);
		entity.setOwner(null);
		entity.ownerDidChange(null);
		entity.setReady(false);
		
		entity.setWindow(null);
		
		element.dispose();

		this.children.erase(entity);

		this.didRemoveChild(entity);

		return true;
	},

	removeFromParent: function() {
		var parent = this.owner || this.window;
		if (parent) return parent.removeChild(this);
		return false;
	},
	
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},	
		
	setStyle: function(name) {

		if (this.style) {
			this.style.detach.call(this, this.element);
		}

		var style = this.$styles[name];
		if (style) {
			style.attach.call(this, this.element);			
		}

		this.style = style;

		return this;
	},
	
	getStyle: function() {
		return this.style.name;
	},
		
	setOwner: function(owner) {
		this.owner = owner;
		return this;
	},

	getOwner: function() {
		return this.owner;
	},	

	hasOwner: function() {
		return !!this.owner;
	},

	setWindow: function(window) {
		this.window = window;
	},
	
	getWindow: function() {
		return this.window;
	},
	
	hasWindow: function() {
		return !!this.window;
	},

	getName: function() {
		return this.name;
	},

	getElement: function(selector) {
		return selector 
			? this.element.getElement(selector) 
			: this.element;
	},

	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	getRoleElement: function(role) {
		return this.getRoleElements(role)[0] || null;
	},

	getRoleElements: function(role) {
		return this.element.getElements('[data-role=' + role + ']').filter(this.bound('hasRoleElement'));
	},	

	hasRoleElement: function(element) {

		var parent = element.getParent();
		if (parent) {
			return this.element === parent || this.hasRoleElement(parent);
		}

		return false;
	},
	
	defineElementRole: function(element, name) {

		if (element.retrieve('entity.has-role'))
			return this;

		var role = this.$roles[name];
		if (role) {	
			role.call(this, element, element.get('data-name'));					
		} else {
			throw new Error('Role ' + name + ' does not exists.');
		}
		
		element.store('entity.has-role', true);
		
		return this;
	},	
	
	getSize: function() {
		return this.element.getSize();
	},

	setReady: function() {

		if (this.ready)
			return this;
		
		this.window = this.owner.getWindow();
			
		this.ready = true;
		this.didBecomeReady();
		this.fireEvent('ready');

		return this;
	},

	isReady: function() {
		return this.ready;
	},

	show: function() {
		this.willShow();
		this.element.show();
		this.didShow();
		return this;
	},

	hide: function() {
		this.willHide();
		this.element.hide();
		this.didHide();
		return this;
	},

	willLoad: function() {
		
	},
	
	didLoad: function() {
		
	},
	
	willUnload: function() {
		
	},
	
	didUnload: function() {
		
	},

	didBecomeReady: function() {

	},

	willAddChild: function(entity) {

	},

	didAddChild: function(entity) {

	},

	willRemoveChild: function(entity) {

	},

	didRemoveChild: function(entity) {

	},

	willShow: function() {

	},

	didShow: function() {

	},

	willHide: function() {

	},

	didHide: function() {

	},

	ownerWillChange: function(owner) {

	},

	ownerDidChange: function(owner) {

	},	

	onClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent('mouseup', e);
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent('mousedown', e);
	},

	toElement: function() {
		return this.element;
	}

});

Moobile.Entity.defineRole = function(name, target, fn) {
	(target || Moobile.Entity).prototype.$roles[name] = fn;
};

Moobile.Entity.defineStyle = function(name, target, def) {
	(target || Moobile.Entity).prototype.$styles[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, def);
};
