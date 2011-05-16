
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

			case 'transition-fade':
				this.viewControllerStack.pushViewControllerFrom('transition-fade.html');
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
				'padding-top':          0,
				'padding-bottom':       0
			});
		} else {
			this.morphSelected = true;
			this.fxMorph.start({
				'background-color':		'#3f7ce4',
				'color':				'#ffffff',
				'padding-top':          550,
				'padding-bottom':       550
			});
		}
	}
});

Demo.ViewController.UI = new Class({

	Extends: Moobile.ViewController,

	barStyleList: null,

	barButtonStyleList: null,

	barButton: null,

	startup: function() {
		this.barStyleList = this.view.barStyleList;
		this.barButtonStyleList = this.view.barButtonStyleList;

		this.barButton = new Moobile.UI.BarButton();
		this.barButton.setText('Button');
		this.navigationBar.setRightButton(this.barButton);

		return this.parent();
	},

	shutdown: function() {
		this.barStyleList = null;
		this.barButtonStyleList = null;
		return this.parent();
	},

	attachEvents: function() {
		this.barStyleList.addEvent(Event.SELECT, this.bound('onBarStyleListSelect'));
		this.barButtonStyleList.addEvent(Event.SELECT, this.bound('onBarButtonStyleListSelect'));
		return this.parent();
	},

	detachEvents: function() {
		this.barStyleList.removeEvent(Event.SELECT, this.bound('onBarStyleListSelect'));
		this.barButtonStyleList.removeEvent(Event.SELECT, this.bound('onBarButtonStyleListSelect'));
		return this.parent();
	},

	onBarStyleListSelect: function(item) {
		switch (item.name) {
			case 'default-opaque':
				this.navigationBar.setStyle(Moobile.UI.BarStyle.DefaultOpaque);
				break;
			case 'default-translucent':
				this.navigationBar.setStyle(Moobile.UI.BarStyle.DefaultTranslucent);
				break;
			case 'black-opaque':
				this.navigationBar.setStyle(Moobile.UI.BarStyle.BlackOpaque);
				break;
			case 'black-translucent':
				this.navigationBar.setStyle(Moobile.UI.BarStyle.BlackTranslucent);
				break;
		}
	},

	onBarButtonStyleListSelect: function(item) {
		switch (item.name) {
			case 'default':
				this.barButton.setStyle(Moobile.UI.BarButtonStyle.Default);
				break;
			case 'active':
				this.barButton.setStyle(Moobile.UI.BarButtonStyle.Active);
				break;
			case 'black':
				this.barButton.setStyle(Moobile.UI.BarButtonStyle.Black);
				break;
			case 'warning':
				this.barButton.setStyle(Moobile.UI.BarButtonStyle.Warning);
				break;
			case 'back':
				this.barButton.setStyle(Moobile.UI.BarButtonStyle.Back);
				break;
			case 'forward':
				this.barButton.setStyle(Moobile.UI.BarButtonStyle.Forward);
				break;
		}
	}

})