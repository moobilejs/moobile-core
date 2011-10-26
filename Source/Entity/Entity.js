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

	name: null,

	started: false,

	element: null,
	
	children: [],

	owner: null,

	window: null,

	options: {
		className: null,
		tagName: 'div',
	},

	initialize: function(element, options, name) {
		
		this.name = name;
		
		this.setOptions(options);

		this.element = document.id(element);
		if (this.element == null) {
			this.element = new Element(this.options.tagName);
			if (typeof element == 'string') {
				this.element.set('html', element);
				var element = this.element.getChildren();
				if (children.length == 1) {
					this.element = children[0];
				}
			}
		}
		
		this.build();
		
		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}		
		
		return this;
	},

	startup: function() {

		if (this.started)
			return this;
						
		this.setup();
		this.attachEvents();
		this.started = true;			

		return this;
	},

	destroy: function() {

		if (!this.started)
			return this;

		this.detachEvents();
		this.destroyChildren();
		this.teardown(); 

		this.removeFromParent();

		this.element.destroy();
		this.element = null;
		this.window = null;

		this.started = false;

		return this;
	},

	build: function() {
		return this;
	},

	setup: function() {
		return this;
	},

	teardown: function() {
		return this;
	},

	attachEvents: function() {
		this.element.addEvent('click', this.bound('onClick'));
		this.element.addEvent('mouseup', this.bound('onMouseUp'))
		this.element.addEvent('mousedown', this.bound('onMouseDown'));
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('click', this.bound('onClick'));
		this.element.removeEvent('mouseup', this.bound('onMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onMouseDown'));
		return this;
	},

	addChild: function(child, where, relative) {

		if (this.children.contains(child))
			return this;
		
		this.willAddChild(child);
		child.ownerWillChange(this);
		child.setOwner(this);
		child.setWindow(this.window);

		var element = child.getElement();
	
		if (!this.element.contains(element)) {
			
			var context = document.id(relative);
			if (context == null) {
				context = this.element;
			} else if (!this.element.contains(context)) {
				throw new Error('You are trying to add a child relative to an element that does not belong to this entity');
			}
			
			element.inject(context, where);
		}
			
		this.children.push(child);
		child.ownerDidChange(this);
		child.startup();
		this.didAddChild(child);

		return this;
	},

	getChild: function(name) {
		return this.children.find(function(children) {
			return children.getName() == name;
		});
	},

	getChildAt: function(index) {
		return this.children[index] || null;
	},

	replaceChild: function(replace, child) {
		return this.addChild(child, 'before', replace).removeChild(replace);
	},

	removeChild: function(child) {

		if (!this.children.contains(child))
			return this;

		this.willRemoveChild(child);
		child.ownerWillChange(null);
		child.setOwner(null);
		child.setWindow(null);
		child.ownerDidChange(null);
		
		child.getElement()
		     .dispose();
		
		this.children.erase(child);
		this.didRemoveChild(child);

		return this;
	},

	removeFromParent: function() {
		var parent = this.owner || this.window;
		if (parent) parent.removeChild(this);
		return this;
	},

	destroyChildren: function() {
		this.children.each(this.bound('destroyChild'));
		this.children.empty();
		return this;
	},

	destroyChild: function(child) {
		child.destroy();
		child = null;
		return this;
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

	setWindow: function(window) {
		this.window = window;
		return this;
	},

	getWindow: function(window) {
		return this.window;
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

	setOwner: function(owner) {
		this.owner = owner;
		return this;
	},

	getOwner: function() {
		return this.owner;
	},

	getChildren: function() {
		return this.children;
	},

	getSize: function() {
		return this.element.getSize();
	},

	ownerWillChange: function(owner) {
		return this;
	},

	ownerDidChange: function(owner) {
		return this;
	},

	willAddChild: function(child) {
		return this;
	},

	didAddChild: function(child) {
		return this;
	},

	willRemoveChild: function(child) {
		return this;
	},

	didRemoveChild: function(child) {
		return this;
	},

	willShow: function() {
		return this;
	},

	didShow: function() {
		return this;
	},

	willHide: function() {
		return this;
	},

	didHide: function() {
		return this;
	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
		return this;
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent('mouseup', e);
		return this;
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent('mousedown', e);
		return this;
	},

	toElement: function() {
		return this.element;
	}

});