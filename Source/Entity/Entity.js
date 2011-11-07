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

(function() {

var roles = {};
var styles = {};

Moobile.Entity = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds,
		Moobile.EntityRoles,
		Moobile.EntityStyles
	],

	name: null,

	element: null,

	children: [],

	owner: null,

	window: null,

	ready: false,

	options: {
		className: null,
		styleName: null,
		tagName: 'div',
	},

	initialize: function(element, options, name) {

		this.name = name;
		
		this.window = Moobile.Window.getInstance();
		
		this.setOptions(options);
		
		var entityElement = document.id(element);
		if (entityElement == null) {
			entityElement = new Element(this.options.tagName);
			if (typeof element == 'string' && element.trim().match(/^<\s*([^ >]+)[^>]*>.*?<\/\s*\1\s*>$/mig)) {
				entityElement = entityElement.set('html', element).getElement(':first-child');
			} 
		}
		
		this.element = entityElement;

		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}		
		
		this.loadStyle();		
		this.loadRoles();

		this.setup();
		this.attachEvents();

		return this;
	},

	setup: function() {

	},

	teardown: function() {

	},

	destroy: function() {
		
		this.removeFromParent();
		
		this.detachEvents();

		this.children.each(function(entity){entity.destroy()});
		this.children = null;

		this.teardown(); 
		
		this.element.destroy();
		this.element = null;
		this.window = null;
		this.owner = null;
		this.ready = false;
		
		return this;
	},

	attachEvents: function() {
		this.element.addEvent('click', this.bound('onClick'));
		this.element.addEvent('mouseup', this.bound('onMouseUp'))
		this.element.addEvent('mousedown', this.bound('onMouseDown'));
	},

	detachEvents: function() {
		this.element.removeEvent('click', this.bound('onClick'));
		this.element.removeEvent('mouseup', this.bound('onMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onMouseDown'));
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

		this.didAddChild(entity);

		if (this.ready == false) {
			this.addEvent('ready:once', function() {
				entity.setReady(true);
				entity.didBecomeReady();				
			});
			return true;
		}
		
		entity.setReady(true);
		entity.didBecomeReady();		
		
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
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	getSize: function() {
		return this.element.getSize();
	},

	setReady: function(ready) {

		if (this.ready != ready) {
			this.ready = ready;
			if (this.ready) {
				this.fireEvent('ready');
			}
		}

		return this;
	},

	isReady: function() {
		return this.ready;
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
	(target || Moobile.Entity).prototype.$roles[name] = fn;
};

Moobile.Entity.defineStyle = function(name, target, def) {
	(target || Moobile.Entity).prototype.$styles[name] = def;
};

})();
