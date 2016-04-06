/*
---

name: Init

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Init

...
*/

var ViewController = {
	Component: {},
	Event: {}
};


/*
---

name: ViewController.Section

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Init

provides:
	- ViewController.Section

...
*/

ViewController.Section = new Class({

	Extends: Moobile.ViewController,

	backButton: null,

	viewDidLoad: function() {
		this.backButton = this.view.getDescendantComponent('back-button');
		this.backButton.addEvent('tap', this.bound('onBackButtonTap'));
	},

	destroy: function() {
		this.backButton.removeEvent('onBackButtonTap');
		this.backButton = null;
		this.parent();
	},

	onBackButtonTap: function() {
		this.getViewControllerStack().popViewController();
	}

});

/*
---

name: ViewController.Home

description:

license:

authors:
	- Your name

requires:
	- ViewController.Section

provides:
	- ViewController.Home

...
*/

ViewController.Home = new Class({

	Extends: Moobile.ViewController,

	list: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/home-view.html');
	},

	viewDidLoad: function() {
		this.list = this.view.getChildComponent('list');
		this.list.addEvent('select', this.bound('onListSelect'));
	},

	viewWillEnter: function() {
		this.list.clearSelectedItem();
	},

	destroy: function() {
		this.list.remove('select', this.bound('onListSelect'));
		this.list = null;
		this.parent();
	},

	onListSelect: function(item) {

		var viewControllerStack = this.getViewControllerStack();

		switch (item.getName()) {

			//
			// Components
			//

			case 'component-activity-indicator':
				viewControllerStack.pushViewController(new ViewController.Component.ActivityIndicator, new Moobile.ViewTransition.Slide);
				return;
			case 'component-alert':
				viewControllerStack.pushViewController(new ViewController.Component.Alert, new Moobile.ViewTransition.Slide);
				return;
			case 'component-slider':
				viewControllerStack.pushViewController(new ViewController.Component.Slider, new Moobile.ViewTransition.Slide);
				return;
			case 'component-bar':
				viewControllerStack.pushViewController(new ViewController.Component.Bar, new Moobile.ViewTransition.Slide);
				return;
			case 'component-button':
				viewControllerStack.pushViewController(new ViewController.Component.Button, new Moobile.ViewTransition.Slide);
				return;
			case 'component-list':
				viewControllerStack.pushViewController(new ViewController.Component.List, new Moobile.ViewTransition.Slide);
				return;
			case 'component-slider':
				viewControllerStack.pushViewController(new ViewController.Component.Slider, new Moobile.ViewTransition.Slide);
				return;
			case 'component-scroll-view':
				viewControllerStack.pushViewController(new ViewController.Component.ScrollView, new Moobile.ViewTransition.Slide);
				return;

			//
			// Transitions
			//

			case 'transition-fade':
				viewControllerStack.pushViewController(new ViewController.Transition, new Moobile.ViewTransition.Fade);
				return;
			case 'transition-flip':
				viewControllerStack.pushViewController(new ViewController.Transition, new Moobile.ViewTransition.Flip);
				return;
			case 'transition-slide':
				viewControllerStack.pushViewController(new ViewController.Transition, new Moobile.ViewTransition.Slide);
				return;
			case 'transition-cubic':
				viewControllerStack.pushViewController(new ViewController.Transition, new Moobile.ViewTransition.Cubic);
				return;
			case 'transition-cover':
				viewControllerStack.pushViewController(new ViewController.Transition, new Moobile.ViewTransition.Cover);
				return;
			case 'transition-cover-page':
				viewControllerStack.pushViewController(new ViewController.Transition, new Moobile.ViewTransition.Cover.Page);
				return;
			case 'transition-cover-box':
				viewControllerStack.pushViewController(new ViewController.Transition, new Moobile.ViewTransition.Cover.Box);
				return;

			//
			// Events
			//

			case 'event-tap':
				viewControllerStack.pushViewController(new ViewController.Event.Tap, new Moobile.ViewTransition.Slide);
				return;
			case 'event-swipe':
				viewControllerStack.pushViewController(new ViewController.Event.Swipe, new Moobile.ViewTransition.Slide);
				return;
			case 'event-pinch':
				viewControllerStack.pushViewController(new ViewController.Event.Pinch, new Moobile.ViewTransition.Slide);
				return;
		}
	}

});

/*
---

name: ViewController.Transition

description:

license:

authors:
	- Your name

requires:

provides:
	- ViewController.Transition

...
*/

if (!window.ViewController) window.ViewController = {};

ViewController.Transition = new Class({

	Extends: Moobile.ViewController,

	backButton: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/transition-view.html');
	},

	viewDidLoad: function() {
		this.backButton = this.view.getDescendantComponent('back-button');
		this.backButton.addEvent('tap', this.bound('onBackButtonTap'));
	},

	destroy: function() {
		this.backButton.removeEvent('tap', this.bound('onBackButtonTap'));
		this.backButton = null;
		this.parent();
	},

	onBackButtonTap: function() {
		this.getViewControllerStack().popViewController();
	}

});

/*
---

name: ViewController.Event.Tap

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Event.Tap

...
*/

ViewController.Event.Tap = new Class({

	Extends: ViewController.Section,

	zone: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/event-tap-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.zone = this.view.getElement('.zone');
		this.zone.addEvent('tap', this.bound('onZoneTap'));
		this.zone.addEvent('ownanimationend', this.bound('onZoneAnimationEnd'));
	},

	destroy: function() {
		this.zone.removeEvent('tap', this.bound('onZoneTap'));
		this.zone.removeEvent('ownanimationend', this.bound('onZoneAnimationEnd'));
		this.zone = null;
		this.parent();
	},

	onZoneTap: function() {
		if (this.zone.hasClass('flash') === false) {
			this.zone.addClass('flash');
		}
	},

	onZoneAnimationEnd: function(e) {
		this.zone.removeClass('flash');
	}

});

/*
---

name: ViewController.Event.Swipe

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Event.Swipe

...
*/

ViewController.Event.Swipe = new Class({

	Extends: ViewController.Section,

	zone: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/event-swipe-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.zone = this.view.getElement('.zone');
		this.zone.addEvent('swipe', this.bound('onZoneSwipe'));
		this.zone.addEvent('ownanimationend', this.bound('onZoneAnimationEnd'));
	},

	destroy: function() {
		this.zone.removeEvent('swipe', this.bound('onZoneSwipe'));
		this.zone.removeEvent('ownanimationend', this.bound('onZoneAnimationEnd'));
		this.zone = null;
		this.parent();
	},

	onZoneSwipe: function() {
		if (this.zone.hasClass('flash') === false) {
			this.zone.addClass('flash');
		}
	},

	onZoneAnimationEnd: function(e) {
		this.zone.removeClass('flash');
	}

});

/*
---

name: ViewController.Event.Pinch

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Event.Pinch

...
*/

ViewController.Event.Pinch = new Class({

	Extends: ViewController.Section,

	zone: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/event-pinch-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.zone = this.view.getElement('.zone');
		this.zone.addEvent('pinch', this.bound('onZonePinch'));
		this.zone.addEvent('ownanimationend', this.bound('onZoneAnimationEnd'));
	},

	destroy: function() {
		this.zone.removeEvent('pinch', this.bound('onZonePinch'));
		this.zone.removeEvent('ownanimationend', this.bound('onZoneAnimationEnd'));
		this.zone = null;
		this.parent();
	},

	onZonePinch: function() {
		if (this.zone.hasClass('flash') === false) {
			this.zone.addClass('flash');
		}
	},

	onZoneAnimationEnd: function(e) {
		this.zone.removeClass('flash');
	}

});

/*
---

name: ViewController.Component.ActivityIndicator

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.ActivityIndicator

...
*/

ViewController.Component.ActivityIndicator = new Class({

	Extends: ViewController.Section,

	activityIndicator: null,

	startButton: null,

	stopButton: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-activity-indicator-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.activityIndicator = this.view.getChildComponent('activity-indicator');
		this.startButton = this.view.getChildComponent('start-button');
		this.stopButton = this.view.getChildComponent('stop-button');
		this.startButton.addEvent('tap', this.bound('onStartButtonTap'));
		this.stopButton.addEvent('tap', this.bound('onStopButtonTap'));
	},

	destroy: function() {
		this.startButton.removeEvent('tap', this.bound('onStartButtonTap'));
		this.stopButton.removeEvent('tap', this.bound('onStopButtonTap'));
		this.activityIndicator = null;
		this.startButton = null;
		this.stopButton = null;
		this.parent();
	},

	onStartButtonTap: function() {
		this.activityIndicator.start();
	},

	onStopButtonTap: function() {
		this.activityIndicator.stop();
	}

});

/*
---

name: ViewController.Component.Alert

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.Alert

...
*/

ViewController.Component.Alert = new Class({

	Extends: ViewController.Section,

	verticalLayoutButton: null,

	horizontalLayoutAlert: null,

	verticalLayoutAlert: null,

	horizontalLayoutButton: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-alert-view.html');
	},

	viewDidLoad: function() {

		this.parent();

		this.verticalLayoutButton = this.view.getChildComponent('vertical-layout-button');
		this.horizontalLayoutButton = this.view.getChildComponent('horizontal-layout-button');
		this.verticalLayoutButton.addEvent('tap', this.bound('onVerticalLayoutButtonTap'));
		this.horizontalLayoutButton.addEvent('tap', this.bound('onHorizontalLayoutButtonTap'));

		this.verticalLayoutAlert = new Moobile.Alert(null, {layout: 'vertical'});
		this.verticalLayoutAlert.setTitle('Lorem');
		this.verticalLayoutAlert.setMessage('Lorem ipsum dolor sit amet');
		this.verticalLayoutAlert.addButton('OK');
		this.verticalLayoutAlert.addButton('Cancel');
		this.verticalLayoutAlert.setDefaultButtonIndex(0);

		this.horizontalLayoutAlert = new Moobile.Alert();
		this.horizontalLayoutAlert.setTitle('Lorem');
		this.horizontalLayoutAlert.setMessage('Lorem ipsum dolor sit amet');
		this.horizontalLayoutAlert.addButton('OK');
		this.horizontalLayoutAlert.addButton('Cancel');
		this.horizontalLayoutAlert.setDefaultButtonIndex(0);
	},

	destroy: function() {
		this.verticalLayoutButton.removeEvent('tap', this.bound('onVerticalLayoutButtonTap'));
		this.horizontalLayoutButton.removeEvent('tap', this.bound('onHorizontalLayoutButtonTap'));
		this.verticalLayoutButton = null;
		this.horizontalLayoutButton = null;
		this.verticalLayoutAlert.destroy();
		this.verticalLayoutAlert = null;
		this.horizontalLayoutAlert.destroy();
		this.horizontalLayoutAlert = null;
		this.parent();
	},

	onVerticalLayoutButtonTap: function() {
		this.verticalLayoutAlert.showAnimated();
	},

	onHorizontalLayoutButtonTap: function() {
		this.horizontalLayoutAlert.showAnimated();
	}

});

/*
---

name: ViewController.Component.Bar

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.Bar

...
*/

ViewController.Component.Bar = new Class({

	Extends: ViewController.Section,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-bar-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.list = this.view.getChildComponent('list');
		this.list.addEvent('select', this.bound('onListSelect'));
	},

	viewWillEnter: function() {
		this.parent();
		this.list.clearSelectedItem();
	},

	destroy: function() {
		this.list.removeEvent('select', this.bound('onListSelect'));
		this.list = null;
		this.parent();
	},

	onListSelect: function(item) {
		var name = item.getName();
		if (name) {
			this.getViewControllerStack().pushViewController(new ViewController.Component.Bar.Style({style: name}), new Moobile.ViewTransition.Slide);
		}
	}

});

/*
---

name: ViewController.Component.Bar.Style

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.Bar.Style

...
*/

ViewController.Component.Bar.Style = new Class({

	Extends: ViewController.Section,

	options: {
		style: 'default'
	},

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-bar-' + this.options.style + '-view.html');
	},

	viewDidLoad: function() {
		this.parent();
	},

	destroy: function() {
		this.parent();
	}

});

/*
---

name: ViewController.Component.Button

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.Button

...
*/

ViewController.Component.Button = new Class({

	Extends: ViewController.Section,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-button-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.list = this.view.getChildComponent('list');
		this.list.addEvent('select', this.bound('onListSelect'));
	},

	viewWillEnter: function() {
		this.parent();
		this.list.clearSelectedItem();
	},

	destroy: function() {
		this.list.removeEvent('select', this.bound('onListSelect'));
		this.list = null;
		this.parent();
	},

	onListSelect: function(item) {
		var name = item.getName();
		if (name) {
			this.getViewControllerStack().pushViewController(new ViewController.Component.Button.Style({style: name}), new Moobile.ViewTransition.Slide);
		}
	}
});

/*
---

name: ViewController.Component.Button.Style

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.Button.Style

...
*/

ViewController.Component.Button.Style = new Class({

	Extends: ViewController.Section,

	options: {
		style: 'default'
	},

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-button-' + this.options.style + '-view.html');
	},

	viewDidLoad: function() {
		this.parent();
	},

	destroy: function() {
		this.parent();
	}

});

/*
---

name: ViewController.Component.List

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.List

...
*/

ViewController.Component.List = new Class({

	Extends: ViewController.Section,

	list: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-list-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.list = this.view.getChildComponent('list');
		this.list.addEvent('select', this.bound('onListSelect'));
	},

	viewWillEnter: function() {
		this.parent();
		this.list.clearSelectedItem();
	},

	destroy: function() {
		this.list.removeEvent('select', this.bound('onListSelect'));
		this.list = null;
		this.parent();
	},

	onListSelect: function(item) {
		var name = item.getName();
		if (name) {
			this.getViewControllerStack().pushViewController(new ViewController.Component.List.Style({style: name}), new Moobile.ViewTransition.Slide);
		}
	}

});

/*
---

name: ViewController.Component.List.Style

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.List.Style

...
*/

ViewController.Component.List.Style = new Class({

	Extends: ViewController.Section,

	options: {
		style: 'default'
	},

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-list-' + this.options.style + '-view.html');
	}

});

/*
---

name: ViewController.Component.ScrollView

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.ScrollView

...
*/

if (!window.ViewController) window.ViewController = {};
if (!window.ViewController.Component) window.ViewController.Component = {};

ViewController.Component.ScrollView = new Class({

	Extends: ViewController.Section,

	errorAlert: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-scroll-view-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.list = this.view.getChildComponent('list');
		this.list.addEvent('select', this.bound('onListSelect'));
	},

	viewWillEnter: function() {
		this.parent();
		this.list.clearSelectedItem();
	},

	destroy: function() {
		this.list.removeEvent('select', this.bound('onListSelect'));
		this.list = null;
		this.parent();
	},

	onListSelect: function(item) {

		var viewController = null;

		var name = item.getName();

		var engine = null;
		if (name.match('iscroll')) engine = 'IScroll';
		if (name.match('native')) engine = 'Native';

		try {

			switch (name) {

				case 'iscroll-h-paging':
				case 'native-h-paging':
					viewController = new ViewController.Component.ScrollView.HPaging({
						engine: engine
					});
					break;

				case 'iscroll-v-paging':
				case 'native-v-paging':
					viewController = new ViewController.Component.ScrollView.VPaging({
						engine: engine
					});
					break;

				case 'iscroll-grid':
				case 'native-grid':
					viewController = new ViewController.Component.ScrollView.Grid({
						engine: engine
					});
					break;
			}

		} catch (e) {

			if (this.errorAlert === null) {
				this.errorAlert = new Moobile.Alert();
				this.errorAlert.setTitle('Error');
				this.errorAlert.setMessage('The selected engine is not available on this platform.');
			}

			this.errorAlert.showAnimated();

			this.list.clearSelectedItem();
		}

		if (viewController) this.getViewControllerStack().pushViewController(viewController, new Moobile.ViewTransition.Slide);
	}

});

/*
---

name: ViewController.Component.ScrollView.HPaging

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.ScrollView.HPaging

...
*/

ViewController.Component.ScrollView.HPaging = new Class({

	Extends: ViewController.Section,

	options: {
		engine: 'IScroll'
	},

	loadView: function() {
		console.log(this.options);
		this.view = Moobile.ScrollView.at('templates/views/component-scroll-view-h-paging-view.html', {
			scroller: this.options.engine,
			scroll: 'horizontal',
			scrollbar: 'none',
			snapToPage: true,
		});
	},

	viewDidLoad: function() {
		this.parent();
		this.view.setLayout('horizontal');
	},

	viewDidBecomeReady: function() {
		this.parent();
		this.update();
	},

	viewDidRotate: function(orientation) {
		this.parent(orientation);
		this.update();
	},

	update: function() {
		var size = this.view.getContentWrapperSize();
		this.view.setContentSize(10 * size.x);
		this.view.getElements('.page').setStyle('width', size.x);
	}

});

/*
---

name: ViewController.Component.ScrollView.VPaging

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.ScrollView.VPaging

...
*/

ViewController.Component.ScrollView.VPaging = new Class({

	Extends: ViewController.Section,

	options: {
		engine: 'IScroll'
	},

	loadView: function() {
		this.view = Moobile.ScrollView.at('templates/views/component-scroll-view-v-paging-view.html', {
			scroller: this.options.engine,
			scroll: 'vertical',
			scrollbar: 'none',
			snapToPage: true,
		});
	},

	viewDidBecomeReady: function() {
		this.parent();
		this.update();
	},

	viewDidRotate: function(orientation) {
		this.parent(orientation);
		this.update();
	},

	update: function() {
		this.view.getElements('.page').setStyle('height', this.view.getContentWrapperSize().y);
	}

});

/*
---

name: ViewController.Component.ScrollView.Grid

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.ScrollView.Grid

...
*/

ViewController.Component.ScrollView.Grid = new Class({

	Extends: ViewController.Section,

	options: {
		engine: 'IScroll'
	},

	loadView: function() {
		this.view = Moobile.ScrollView.at('templates/views/component-scroll-view-grid-view.html', {
			scroller: this.options.engine,
			scroll: 'both',
			scrollbar: 'none',
			snapToPage: true,
			snapToPageSizeX: 150,
			snapToPageSizeY: 150,
		});
	},

	viewDidLoad: function() {
		this.parent();
		this.view.setContentSize(1500, 1500);
	}

});

/*
---

name: ViewController.Component.Slider

description:

license:

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController.Section

provides:
	- ViewController.Component.Slider

...
*/

ViewController.Component.Slider = new Class({

	Extends: ViewController.Section,

	hSlider: null,

	hValue: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/component-slider-view.html');
	},

	viewDidLoad: function() {

		this.parent();

		this.hValue = this.view.getChildComponent('h-value');
		this.hSlider = this.view.getChildComponent('h-slider');
		this.hSlider.addEvent('change', this.bound('onHorizontalSliderChange'));

		this.vValue = this.view.getChildComponent('v-value');
		this.vSlider = this.view.getChildComponent('v-slider');
		this.vSlider.addEvent('change', this.bound('onVerticalSliderChange'));
	},

	destroy: function() {

		this.hSlider.removeEvent('change', this.bound('onHorizontalSliderChange'));
		this.hSlider = null;
		this.hValue = null;

		this.vSlider.removeEvent('change', this.bound('onVerticalSliderChange'));
		this.vSlider = null;
		this.vValue = null;

		this.parent();
	},

	onHorizontalSliderChange: function(value) {
		this.hValue.setText(Math.round(value));
	},

	onVerticalSliderChange: function(value) {
		this.vValue.setText(Math.round(value));
	}

});
