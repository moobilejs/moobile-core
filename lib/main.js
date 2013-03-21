"use strict"

// touch utilities
// require('event-util');
// require('touch-util');

// request animation frame
global.requestAnimationFrame = require('moofx/lib/frame').request;
global.cancelAnimationFrame = require('moofx/lib/frame').cancel;

// mootools
require('../Vendor/mootools-class-extras/Source/Class.Binds.js');
require('../Vendor/mootools-custom-event/Source/Element.defineCustomEvent.js');
require('../Vendor/mootools-mobile/Source/Browser/Features.Touch.js');
require('../Vendor/mootools-mobile/Source/Browser/Mobile.js')
require('../Vendor/mootools-mobile/Source/Touch/Pinch.js')
require('../Vendor/mootools-mobile/Source/Touch/Swipe.js')

// mootools utilities
require('../utils/browser');
require('../utils/class');
require('../utils/element');
require('../utils/request');
require('../utils/type/array');
require('../utils/type/string');

// core
require('./core');

// event
require('./event/emitter');
require('./event/ready');
require('./event/css');
require('./event/mouse');
require('./event/touch');
require('./event/tap');

// animation
require('./animation/animation');

// component
require('./component/component');
require('./component/overlay');

// control
require('./control/control');
require('./control/text');
require('./control/activity-indicator');
require('./control/bar');
require('./control/button-group');
require('./control/button');
require('./control/image');
require('./control/list');
require('./control/list-item');
require('./control/navigation-bar');
require('./control/slider');
require('./control/tab-bar');
require('./control/tab');

// dialog
require('./dialog/alert')

// scroller
require('./scroller/scroller');
require('./scroller/scroller-iscroll');
require('./scroller/scroller-native');

// theme
require('./theme/theme');

// view
require('./view/view');
require('./view/scroll-view');
require('./view/view-collection');
require('./view/view-queue');
require('./view/view-set');
require('./view/view-stack');

// view controller
require('./view-controller/view-controller');
require('./view-controller/view-controller-stack');
require('./view-controller/view-controller-queue');
// require('./view-controller/view-controller-collection');
// require('./view-controller/view-controller-set');

// view transition
require('./view-transition/view-transition');
require('./view-transition/view-transition-box');
require('./view-transition/view-transition-cover');
require('./view-transition/view-transition-cubic');
require('./view-transition/view-transition-drop');
require('./view-transition/view-transition-fade');
require('./view-transition/view-transition-flip');
require('./view-transition/view-transition-none');
require('./view-transition/view-transition-page');
require('./view-transition/view-transition-slide');

// window
require('./window/window')
require('./window/window-controller')

//
// aliases
//
/*
moobile.Request                   = Request;
moobile.EventFirer                = moobile.Emitter;
moobile.ViewTransition.Cover.Box  = moobile.ViewTransition.Box;
moobile.ViewTransition.Cover.Page = moobile.ViewTransition.Page;
*/

module.exports = global.Moobile = global.moobile