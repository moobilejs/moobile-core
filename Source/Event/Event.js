/*
---

name: Event

description: Provide contants for each events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Event

...
*/

Event.READY = Browser.Platform.phonegap ? 'deviceready' : 'domready';

Event.PINCH = 'pinch';
Event.SWIPE = 'swipe';

Event.CLICK			= Browser.Platform.desktop ? 'clickin'   : 'touchin';
Event.MOUSE_DOWN	= Browser.Platform.desktop ? 'mousedown' : 'touchstart';
Event.MOUSE_MOVE	= Browser.Platform.desktop ? 'mousemove' : 'touchmove';
Event.MOUSE_UP		= Browser.Platform.desktop ? 'mouseup'   : 'touchend';

Event.TOUCH_HOLD	= 'touchhold';
Event.TOUCH_CANCEL	= 'touchcancel';

Event.ORIENTATION_CHANGE = 'orientationchange';

Event.GESTURE_START		= 'gesturestart';
Event.GESTURE_CHANGE	= 'gesturechange';
Event.GESTURE_END		= 'gestureend';

if (Browser.Platform.phonegap) Element.NativeEvents.deviceready = 1;