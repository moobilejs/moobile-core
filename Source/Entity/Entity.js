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

	element: null,
	
	children: [],

	owner: null,

	window: null,
	
	ready: false,

	options: {
		className: null,
		tagName: 'div',
	},

	initialize: function(element, options, name) {

		this.name = name;
		
		this.setOptions(options);
		this.setElement(element);
	
		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}		

		this.setup();
		this.attachEvents();
		
		return this;
	},

	setup: function() {
		return this;
	},

	teardown: function() {
		return this;
	},

	destroy: function() {

		this.detachEvents();
		
		this.children.each(function(child){child.destroy()});
		this.children = null;
		
		this.teardown(); 

		this.removeFromParent();

		this.element.destroy();
		this.element = null;
		this.window = null;
		this.ready = false;

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
			return false;
		
		this.willAddChild(child);
		
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
		
		child.ownerWillChange(this);
		child.setOwner(this);
		child.setWindow(this.window);			
		child.ownerDidChange(this);
		
		this.didAddChild(child);

		var ready = function() {
			child.setReady(true);
			child.didBecomeReady();
		};

		if (this.ready == false) {
			this.addEvent('ready:once', ready);
		} else {
			ready();
		}

		return true;
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
			return false;

		var element = child.getElement();

		this.willRemoveChild(child);
		
		child.ownerWillChange(null);
		child.setOwner(null);
		child.setWindow(null);
		child.ownerDidChange(null);
		child.setReady(false);
		
		element.dispose();
		
		this.children.erase(child);
		
		this.didRemoveChild(child);

		return true;
	},

	removeFromParent: function() {
		var parent = this.owner || this.window;
		if (parent) return parent.removeChild(this);
		return false;
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

	setElement: function(element) {
	
		if (this.element)
			return;
	
		var root = document.id(element);
		if (root == null) {
			root = new Element(this.options.tagName);
			if (typeof element == 'string' && element.trim().match(/^<\s*([^ >]+)[^>]*>.*?<\/\s*\1\s*>$/mig)) {
				root = root.set('html', element).getElement(':first-child');
			} 
		}
	
		this.element = root;
		
		return this;
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

	willAddChild: function(child) {
		
	},

	didAddChild: function(child) {
		
	},

	willRemoveChild: function(child) {
		
	},

	didRemoveChild: function(child) {
		
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