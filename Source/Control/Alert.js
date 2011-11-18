/*
---

name: Alert

description: Provides an Alert dialog.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- AlertStyle

provides:
	- Alert

...
*/

Moobile.Alert = new Class({

	Extends: Moobile.Overlay,

	title: null,
	
	message: null,

	dialog: null,	
	
	header: null,
	
	footer: null,
	
	content: null,
	
	buttons: [],
	
	options: {
		className: 'alert'
	},
	
	setTitle: function(title) {

		if (this.title === title) 
			return this;

		if (this.title instanceof Moobile.Entity) {
			this.title.removeFromOwner();
			this.title.destroy();
			this.title = null;
		}
				
		this.header.empty();
				
		if (title instanceof Moobile.Entity) {
			this.addChild(title, 'bottom', this.header);
		} else {
			this.header.set('html', title);
		}

		this.title = title;

		return this;
	},
	
	getTitle: function() {
		return this.title;
	},

	setMessage: function(message) {
		
		if (this.message === message)
			return this;
		
		if (this.message instanceof Moobile.Entity) {
			this.message.removeFromOwner();
			this.message.destroy();
			this.message = null;
		}
				
		this.content.empty();
				
		if (message instanceof Moobile.Entity) {
			this.addChild(message, 'bottom', this.content);
		} else {
			this.content.set('html', message);
		}

		this.message = message;

		return this;
	},
	
	getMessage: function() {
		return this.message;
	},

	addButton: function(button) {
		this.addChild(button, 'bottom', this.footer);
		return this;
	},
	
	didLoad: function() {

		this.parent();

		this.header  = new Element('div.dialog-header');
		this.footer  = new Element('div.dialog-footer');
		this.content = new Element('div.dialog-content');
		
		this.dialog = new Element('div.dialog');
		this.dialog.grab(this.header);
		this.dialog.grab(this.content);
		this.dialog.grab(this.footer);

		this.element.grab(this.dialog);
	},
	
	didAddChild: function(entity) {
		
		this.parent(entity);
		
		if (entity instanceof Moobile.Button) {
			entity.addEvent('click', this.bound('onButtonClick'));			
			entity.addEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.addEvent('mousedown', this.bound('onButtonMouseUp'));
			this.buttons.include(entity);
		}	
	},
	
	didRemoveChild: function(entity) {
		
		this.parent(entity);
		
		if (entity instanceof Moobile.Button) {
			entity.removeEvent('click', this.bound('onButtonClick'));
			entity.removeEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.removeEvent('mousedown', this.bound('onButtonMouseUp'));			
			this.button.erase(entity);
		}		
	},
	
	willShow: function() {
		
		this.parent();
		
		if (this.buttons.length == 0) {
			
			var button = new Moobile.Button();
			button.setLabel('OK');
			button.setHighlighted(true);
			
			this.addButton(button);			
		}
	},

	destroy: function() {
		
		this.dialog = null;
		this.header = null;
		this.footer = null;
		this.content = null;
		this.buttons = null;	
		this.message = null;
		this.title = null;
		
		this.parent();		
	},	

	onButtonClick: function(e) {

		this.fireEvent('buttonClick', e.target);
		
		if (this.buttons.length == 1) {
			this.hideAnimated();
		}
	},
	
	onButtonMouseUp: function() {
		this.fireEvent('buttonMouseUp');
	},
	
	onButtonMouseDown: function() {
		this.fireEvent('buttonMouseDown');
	}

});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('horizontal', Moobile.Alert, {
	attach: function() { this.element.addClass('style-horizontal'); },
	detach: function() { this.element.removeClass('style-horizontal'); }
});
