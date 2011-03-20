
window.Demo = {};
window.Demo.ViewController = {}

Demo.ViewController.Home = new Class({

	Extends: Moobile.ViewController,

	Binds: [
		'onTransitionSlideButtonClick',
		'onTransitionCubicButtonClick',
		'onButton1Click',
		'onButton2Click',
		'onFxClick'
	],

	transitionSlideButton: null,
	transitionCubicButton: null,
	button1: null,
	button2: null,

	test: null,

	startup: function() {
		this.transitionSlideButton = this.view.transitionSlideButton;
		this.transitionCubicButton = this.view.transitionCubicButton;
		this.button1 = this.view.button1;
		this.button2 = this.view.button2;
		this.fx = this.view.fx;
		return this.parent();
	},

	shutdown: function() {
		this.transitionSlideButton = null;
		this.transitionCubicButton = null;
		return this.parent();
	},

	attachEvents: function() {
		this.transitionSlideButton.addEvent(Event.CLICK, this.onTransitionSlideButtonClick);
		this.transitionCubicButton.addEvent(Event.CLICK, this.onTransitionCubicButtonClick);
		this.button1.addEvent(Event.CLICK, this.onButton1Click);
		this.button2.addEvent(Event.CLICK, this.onButton2Click);
		this.fx.addEvent(Event.CLICK, this.onFxClick);
		return this.parent();
	},

	detachEvents: function() {
		this.transitionSlideButton.removeEvent(Event.CLICK, this.onTransitionSlideButtonClick);
		this.transitionCubicButton.removeEvent(Event.CLICK, this.onTransitionCubicButtonClick);
		this.button1.removeEvent(Event.CLICK, this.onButton1Click);
		this.button2.removeEvent(Event.CLICK, this.onButton2Click);
		return this.parent();
	},

	onTransitionSlideButtonClick: function() {
		this.viewControllerStack.pushViewControllerFrom('transition-slide.html');
		return this;
	},

	onTransitionCubicButtonClick: function() {
		this.viewControllerStack.pushViewControllerFrom('transition-cubic.html');
		return this;
	},

	onButton1Click: function() {
		this.viewControllerStack.pushViewControllerFrom('scroll.html');
		return this;
	},

	onButton2Click: function() {
		this.viewControllerStack.pushViewControllerFrom('licence.html');
		return this;
	},

	onFxClick: function() {
		this.viewControllerStack.pushViewControllerFrom('fx.html');
	}

});

Demo.ViewController.Back = new Class({

	Extends: Moobile.ViewController,

	back: null,

	startup: function() {
		this.back = this.view.back;
		this.back.addEvent(Event.CLICK, function() {
			this.viewControllerStack.popViewController();
		}.bind(this));

		return this.parent();
	}

});

Demo.ViewController.Fx = new Class({

	Extends: Demo.ViewController.Back,

	Binds: [
		'onTweenButtonClick',
		'onMorphButtonClick'
	],

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
		this.tween.addEvent(Event.CLICK, this.onTweenButtonClick);
		this.morph.addEvent(Event.CLICK, this.onMorphButtonClick);
		return this.parent();
	},

	detachEvents: function() {
		this.tween.removeEvent(Event.CLICK, this.onTweenButtonClick);
		this.morph.removeEvent(Event.CLICK, this.onMorphButtonClick);
		return this.parent();
	},

	onTweenButtonClick: function() {
		if (this.fxTween == null) {
			this.fxTween = new Fx.CSS3.Tween(this.tween);
		}
		if (this.tweenSelected) {
			this.tweenSelected = false;
			this.fxTween.start('background-color', '#ffffff');
		} else {
			this.tweenSelected = true;
			this.fxTween.start('background-color', '#3f7ce4');
		}
	},

	onMorphButtonClick: function() {
		if (this.fxMorph == null) {
			this.fxMorph = new Fx.CSS3.Morph(this.morph);
		}
		if (this.morphSelected) {
			this.morphSelected = false;
			this.fxMorph.start({
				'background-color':		'#ffffff',
				'color':				'#000000'
			});
		} else {
			this.morphSelected = true;
			this.fxMorph.start({
				'background-color':		'#3f7ce4',
				'color':				'#ffffff'
			});
		}
	}

})