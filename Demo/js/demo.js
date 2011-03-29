
window.Demo = {};
window.Demo.ViewController = {}

Demo.ViewController.Home = new Class({

	Extends: Moobile.ViewController,

	list: null,

	startup: function() {
		this.list = this.view.list;
		return this.parent();
	},

	shutdown: function() {
		this.list = null;
		return this.parent();
	},

	attachEvents: function() {
		this.list.addEvent(Event.SELECT, this.bound('onListItemSelect'));
		return this.parent();
	},

	detachEvents: function() {
		this.list.removeEvent(Event.DESELECT, this.bound('onListItemSelect'));
		return this.parent();
	},

	onListItemSelect: function(item) {

		var from = '';

		switch (item.name) {

			case 'transition-slide':
				this.viewControllerStack.pushViewControllerFrom('transition-slide.html');
				break;

			case 'transition-cubic': 
				this.viewControllerStack.pushViewControllerFrom('transition-cubic.html');
				break;

			case 'ui': 
				this.viewControllerStack.pushViewControllerFrom('ui.html');
				break;

			case 'fx':
				this.viewControllerStack.pushViewControllerFrom('fx.html');
				break;
			
			case 'licence':
				this.viewControllerStack.pushViewControllerFrom('licence.html');
				break;
		}
		
		this.list.clearSelectedItems();
	}
});

Demo.ViewController.Fx = new Class({

	Extends: Moobile.ViewController,

	fxTween: null,

	fxMorph: null,

	tween: null,

	tweenSelected: false,

	morph: null,

	morphSelected: false,

	startup: function() {
		this.tween = this.view.getChildElement('tween');
		this.morph = this.view.getChildElement('morph');
		return this.parent();
	},

	attachEvents: function() {
		this.tween.addEvent(Event.CLICK, this.bound('onTweenButtonClick'));
		this.morph.addEvent(Event.CLICK, this.bound('onMorphButtonClick'));
		return this.parent();
	},

	detachEvents: function() {
		this.tween.removeEvent(Event.CLICK, this.bound('onTweenButtonClick'));
		this.morph.removeEvent(Event.CLICK, this.bound('onMorphButtonClick'));
		return this.parent();
	},

	onTweenButtonClick: function() {
		if (this.fxTween == null) this.fxTween = new Fx.CSS3.Tween(this.tween);
		if (this.tweenSelected) {
			this.tweenSelected = false;
			this.fxTween.start('background-color', '#ffffff');
		} else {
			this.tweenSelected = true;
			this.fxTween.start('background-color', '#3f7ce4');
		}
	},

	onMorphButtonClick: function() {
		if (this.fxMorph == null) this.fxMorph = new Fx.CSS3.Morph(this.morph);
		if (this.morphSelected) {
			this.morphSelected = false;
			this.fxMorph.start({
				'background-color':		'#ffffff',
				'color':				'#000000',
				'padding-left':         0
			});
		} else {
			this.morphSelected = true;
			this.fxMorph.start({
				'background-color':		'#3f7ce4',
				'color':				'#ffffff',
				'padding-left':         25
			});
		}
	}
});