
window.Demo = {};
window.Demo.ViewController = {}

Demo.ViewController.Home = new Class({

	Extends: Moobile.ViewController,

	list: null,

	init: function() {
		this.list = this.view.list;
		this.parent();
		return this;
	},

	release: function() {
		this.list = null;
		this.parent();
		return this;
	},

	attachEvents: function() {
		this.list.addEvent('select', this.bound('onListItemSelect'));
		return this.parent();
	},

	detachEvents: function() {
		this.list.removeEvent('deselect', this.bound('onListItemSelect'));
		return this.parent();
	},

	onListItemSelect: function(item) {

		var from = '';

		switch (item.name) {

			case 'transition-slide':
				this.viewControllerStack.pushViewControllerFrom('views/transition-slide.html', new Moobile.ViewTransition.Slide);
				break;

			case 'transition-cubic':
				this.viewControllerStack.pushViewControllerFrom('views/transition-cubic.html', new Moobile.ViewTransition.Cubic);
				break;

			case 'transition-fade':
				this.viewControllerStack.pushViewControllerFrom('views/transition-fade.html' , new Moobile.ViewTransition.Fade);
				break;

			case 'ui':
				this.viewControllerStack.pushViewControllerFrom('views/ui.html');
				break;

			case 'licence':
				this.viewControllerStack.pushViewControllerFrom('views/licence.html');
				break;

			case 'chained':
				this.viewControllerStack.pushViewControllerFrom('views/chained.html');
				break;
		}

	},

	viewWillEnter: function() {
		this.list.removeSelectedItems();
	}
});

Demo.ViewController.UI = new Class({

	Extends: Moobile.ViewController,

	barStyleList: null,

	barButtonStyleList: null,

	barButton: null,

	init: function() {
		this.barStyleList = this.view.barStyleList;
		this.barButtonStyleList = this.view.barButtonStyleList;
		this.barButton = new Moobile.UI.BarButton();
		this.barButton.setText('Button');
		this.navigationBar.setRightButton(this.barButton);
		this.parent();
		return this;
	},

	release: function() {
		this.barStyleList = null;
		this.barButtonStyleList = null;
		this.parent();
		return this;
	},

	attachEvents: function() {
		this.barStyleList.addEvent('select', this.bound('onBarStyleListSelect'));
		this.barButtonStyleList.addEvent('select', this.bound('onBarButtonStyleListSelect'));
		return this.parent();
	},

	detachEvents: function() {
		this.barStyleList.removeEvent('select', this.bound('onBarStyleListSelect'));
		this.barButtonStyleList.removeEvent('select', this.bound('onBarButtonStyleListSelect'));
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

});

Demo.ViewController.Chained = new Class({

	Extends: Moobile.ViewController,

	button: null,

	init: function() {
		this.button = this.view.button;
		this.parent();
		return this;
	},

	attachEvents: function() {
		this.button.addEvent('click', this.bound('onButtonClick'));
		return this.parent();
	},

	detachEvents: function() {
		this.button.removeEvent('click', this.bound('onButtonClick'));
		return this.parent();
	},

	onButtonClick: function() {
		this.viewControllerStack.pushViewControllerFrom('views/default.html');
	}

});