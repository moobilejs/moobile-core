/**
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * iScroll Lite Edition based on iScroll v4.0 Beta 4
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Last updated: 2011.03.10
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 */

;(function(){
function iScroll (el, options) {
	var that = this, doc = document, i;

	that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
	that.wrapper.style.overflow = 'hidden';
	that.scroller = that.wrapper.children[0];
	that.scroller.style.cssText += '-webkit-transition-property:-webkit-transform;-webkit-transform-origin:0 0;-webkit-transform:' + trnOpen + '0,0' + trnClose;
	that.scroller.style.cssText += '-webkit-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-webkit-transition-duration:0;';

	// Default options
	that.options = {
		hScroll: true,
		vScroll: true,
		bounce: has3d,
		bounceLock: false,
		momentum: has3d,
		lockDirection: true,
		hScrollbar: true,
		vScrollbar: true,
		fixedScrollbar: isAndroid,
		fadeScrollbar: (isIDevice && has3d) || !hasTouch,
		hideScrollbar: isIDevice || !hasTouch,
		scrollbarClass: '',
		onScrollStart: null,
		onScrollEnd: null,
	};

	// User defined options
	for (i in options) {
		that.options[i] = options[i];
	}

	that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
	that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
	
	that.refresh();

	that._bind(RESIZE_EV, window);
	that._bind(START_EV);
/*	that._bind(MOVE_EV);
	that._bind(END_EV);
	that._bind(CANCEL_EV);*/
}

iScroll.prototype = {
	x: 0, y: 0,
	
	handleEvent: function (e) {
		var that = this;
		
		switch(e.type) {
			case START_EV: that._start(e); break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case 'webkitTransitionEnd': that._transitionEnd(e); break;
			case RESIZE_EV: that._resize(); break;
		}
	},
	
	_scrollbar: function (dir) {
		var that = this,
			doc = document,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				that[dir + 'ScrollbarIndicator'].style.webkitTransform = '';	// Should free some mem
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');
			if (that.options.scrollbarClass) {
				bar.className = that.options.scrollbarClass + dir.toUpperCase();
			} else {
				bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:7px' : 'width:7px;bottom:7px;top:2px;right:1px');
			}
			bar.style.cssText += 'pointer-events:none;-webkit-transition-property:opacity;-webkit-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-webkit-background-clip:padding-box;-webkit-box-sizing:border-box;' + (dir == 'h' ? 'height:100%;-webkit-border-radius:4px 3px;' : 'width:100%;-webkit-border-radius:3px 4px;');
			}
			bar.style.cssText += 'pointer-events:none;-webkit-transition-property:-webkit-transform;-webkit-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-webkit-transition-duration:0;-webkit-transform:' + trnOpen + '0,0' + trnClose;

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._indicatorPos(dir, true);
	},
	
	_resize: function () {
		var that = this;

		//if (that.options.momentum) that._unbind('webkitTransitionEnd');

		setTimeout(function () {
			that.refresh();
		}, 0);
	},
	
	_pos: function (x, y) {
		var that = this;

		that.x = that.hScroll ? x : 0;
		that.y = that.vScroll ? y : 0;

		that.scroller.style.webkitTransform = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;

		that._indicatorPos('h');
		that._indicatorPos('v');
	},
	
	_indicatorPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y;
		
		if (!that[dir + 'Scrollbar']) return;
		
		pos = that[dir + 'ScrollbarProp'] * pos;
	
		if (pos < 0) {
			pos = that.options.fixedScrollbar ? 0 : pos + pos*3;
			if (that[dir + 'ScrollbarIndicatorSize'] + pos < 9) pos = -that[dir + 'ScrollbarIndicatorSize'] + 8;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			pos = that.options.fixedScrollbar ? that[dir + 'ScrollbarMaxScroll'] : pos + (pos - that[dir + 'ScrollbarMaxScroll'])*3;
			if (that[dir + 'ScrollbarIndicatorSize'] + that[dir + 'ScrollbarMaxScroll'] - pos < 9) pos = that[dir + 'ScrollbarIndicatorSize'] + that[dir + 'ScrollbarMaxScroll'] - 8;
		}
		that[dir + 'ScrollbarWrapper'].style.webkitTransitionDelay = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style.webkitTransform = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
	},
	
	_transitionTime: function (time) {
		var that = this;
		
		time += 'ms';
		that.scroller.style.webkitTransitionDuration = time;

		if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionDuration = time;
		if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionDuration = time;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			matrix;

		that.moved = false;

		e.preventDefault();

		that.moved = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;
		that.returnTime = 0;
		
		that._transitionTime(0);
		
		if (that.options.momentum) {
			matrix = new WebKitCSSMatrix(window.getComputedStyle(that.scroller, null).webkitTransform);
			if (matrix.m41 != that.x || matrix.m42 != that.y) {
				that._unbind('webkitTransitionEnd');
				that._pos(matrix.m41, matrix.m42);
			}
		}

		that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;
		
		that.startTime = e.timeStamp;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		// Registering/unregistering of events is done to preserve resources on Android
//		setTimeout(function () {
//			that._unbind(START_EV);
			that._bind(MOVE_EV);
			that._bind(END_EV);
			that._bind(CANCEL_EV);
//		}, 0);
	},
	
	_move: function (e) {
		if (hasTouch && e.touches.length > 1) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY;

		e.preventDefault();

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2.4) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > 0 || newY < that.maxScrollY) { 
			newY = that.options.bounce ? that.y + (deltaY / 2.4) : newY >= 0 || that.maxScrollY >= 0 ? 0 : that.maxScrollY;
		}

		if (that.absDistX < 4 && that.absDistY < 4) {
			that.distX += deltaX;
			that.distY += deltaY;
			that.absDistX = m.abs(that.distX);
			that.absDistY = m.abs(that.distY);
			return;
		}
		
		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY+3) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX+3) {
				newX = that.x;
				deltaX = 0;
			}
		}
		
		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (e.timeStamp - that.startTime > 300) {
			that.startTime = e.timeStamp;
			that.startX = that.x;
			that.startY = that.y;
		}
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length != 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = e.timeStamp - that.startTime,
			newPosX = that.x, newPosY = that.y,
			newDuration;

//		that._bind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (!that.moved) {
			if (hasTouch) {
				that.doubleTapTimer = null;

				// Find the last touched element
				target = point.target;
				while (target.nodeType != 1) {
					target = target.parentNode;
				}

				ev = document.createEvent('MouseEvents');
				ev.initMouseEvent('click', true, true, e.view, 1,
					point.screenX, point.screenY, point.clientX, point.clientY,
					e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					0, null);
				ev._fake = true;
				target.dispatchEvent(ev);
			}

			that._resetPos();
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
 			if ((that.y > 0 && newPosY > 0) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

/*			if (newPosX > 0 || newPosX < that.maxScrollX || newPosY > 0 || newPosY < that.maxScrollY) {
				// Subtle change of scroller motion
				that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.5,1)';
				if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.5,1)';
				if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.5,1)';
			}*/

			that.scrollTo(newPosX, newPosY, newDuration);
			return;
		}

		that._resetPos(200);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x,
			resetY = that.y;

		if (that.x >= 0) resetX = 0;
		else if (that.x < that.maxScrollX) resetX = that.maxScrollX;

		if (that.y >= 0 || that.maxScrollY > 0) resetY = 0;
		else if (that.y < that.maxScrollY) resetY = that.maxScrollY;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
				that.moved = false;
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				that.hScrollbarWrapper.style.webkitTransitionDelay = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				that.vScrollbarWrapper.style.webkitTransitionDelay = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		// Invert ease
		if (time) {
			that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
			if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
			if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_transitionEnd: function (e) {
		var that = this;
		
		if (e) e.stopPropagation();

		that._unbind('webkitTransitionEnd');

		that._resetPos(that.returnTime);
		that.returnTime = 0;
	},


	/**
	 *
	 * Utilities
	 *
	 */
	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var that = this,
			deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries 
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			that.returnTime = 800 / size * outsideDist + 100;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			that.returnTime = 800 / size * outsideDist + 100;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: m.round(newTime) };
	},

	_offset: function (el, tree) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		if (!tree) return { x: left, y: top };

		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		} 

		return { x: left, y: top };
	},

	_bind: function (type, el) {
		(el || this.scroller).addEventListener(type, this, false);
	},

	_unbind: function (type, el) {
		(el || this.scroller).removeEventListener(type, this, false);
	},


	/**
	 *
	 * Public methods
	 *
	 */
	destroy: function () {
		var that = this;

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Free some mem
		that.scroller.style.webkitTransform = '';

		// Remove the event listeners
		that._unbind('webkitTransitionEnd');
		that._unbind(RESIZE_EV);
		that._unbind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);
	},

	refresh: function () {
		var that = this;

		that.wrapperW = that.wrapper.clientWidth;
		that.wrapperH = that.wrapper.clientHeight;
		that.scrollerW = that.scroller.offsetWidth;
		that.scrollerH = that.scroller.offsetHeight;
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH;
		that.dirX = 0;
		that.dirY = 0;

		that._transitionTime(0);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);
		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');
	
		that._resetPos();
	},

	scrollTo: function (x, y, time, relative) {
		var that = this;

		if (relative) {
			x = that.x - x;
			y = that.y - y;
		}

		time = !time || (m.round(that.x) == m.round(x) && m.round(that.y) == m.round(y)) ? 0 : time;

		that.moved = true;

		if (time) that._bind('webkitTransitionEnd');
		that._transitionTime(time);
		that._pos(x, y);
		if (!time) setTimeout(function () { that._transitionEnd(); }, 0);
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.x = pos.x > 0 ? 0 : pos.x < that.maxScrollX ? that.maxScrollX : pos.x;
		pos.y = pos.y > 0 ? 0 : pos.y < that.maxScrollY ? that.maxScrollY : pos.y;
		time = time === undefined ? m.max(m.abs(pos.x)*2, m.abs(pos.y)*2) : time;

		that.scrollTo(pos.x, pos.y, time);
	}
};


var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
	hasTouch = 'ontouchstart' in window,
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isAndroid = (/android/gi).test(navigator.appVersion),
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	trnOpen = 'translate' + (has3d ? '3d(' : '('),
	trnClose = has3d ? ',0)' : ')',
	m = Math;

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})();

/*
---

name: Console.Trace

description: Provide a trace method that allow multiple arguments and check
             if console.log exists before executing.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Console.Trace

...
*/

if (!window.console) window.console = {};

window.trace = window.console.trace = function() {
	if (console) Array.from(arguments).each(function(a) { console.log(a) });
}


/*
---

name: Class.Extras

description: Provides extra methods to the class object.

license: MIT-style license.

requires:
	- Core/Class

provides:
	- Class.Extras

...
*/

Class.extend({

	get: function(name) {
		name = name.trim();
		name = name.split('.');
		var func = window;
		for (var i = 0; i < name.length; i++) func = func[name[i]];
		return typeof func == 'function' ? func : null;
	},

	from: function(name) {
		var klass = Class.get(name);
		if (klass) {
			var params = Array.prototype.slice.call(arguments, 1);
			params.unshift(klass);
			return Class.instanciate.apply(this, params);
		}
		throw new TypeError('Class "' + name + '" not found.');
	},

	instanciate: function(klass) {
		klass.$prototyping = true;
		var instance = new klass;
		delete klass.$prototyping;
		var params = Array.prototype.slice.call(arguments, 1);
		if (instance.initialize) {
			instance.initialize.apply(instance, params);
		}		
		return instance;
	}

});



/*
---

name: Element.Extras

description: Provides extra methods for the element class.

license: MIT-style license.

requires:
	- Core/Element

provides:
	- Element.Extras

...
*/

Element.implement
({
	disposeProperty: function(property) {
		this.store('property_' + property, null);
		this.store('property_' + property, this.getProperty(property));
		this.removeProperty(property);
		return this;
	},

	getDisposedProperty: function(property) {
		return this.retrieve('property_' + property);
	},

	ingest: function(string) {
		var match = string.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		if (match) string = match[1];
		this.set('html', string);
		return this
	},
	
	getContents: function() {
		return Array.from(this.childNodes);	
	}
});


/*
---

name: Element.Properties

description: Add setter and getters for elements properties.

license: MIT-style license.

requires:
	- Core/Element

provides:
	- Element.Properties

...
*/

/**
 * Add setter and getters for elements properties.
 *
 * @author     Jean-Philippe Dery <jeanphilippe.dery@gmail.com>
 * @version    0.1.0
 */
Element.Properties.checked = {
	get: function() { return this.checked; },
	set: function(value) {
		if (this.checked != value) {
			this.checked = value;
			this.fireEvent('change', value);
		}
	},
	erase: function() {}
};

/*
---

name: Selector.Apply

description: Binds a selector to a function.

license: MIT-style license.

requires:
	- Core/DOMReady

provides:
	- Selector.Apply

...
*/

if (!window.Selector) window.Selector = {};

Object.append(Selector, {

	apply: function(rules) {
		window.addEvent('domready', function() {
			this.assign(rules);
		}.bind(this));
		return this;
	},

	assign: function(rules) {
		for (var key in rules) {
			var rule = rules[key];
			key.clean().split(',').each(function(selector) {
				var pair = selector.split('::');
				$$(pair[0]).each(function(elem, index) {
					if (pair.length == 1) return rule(elem, index);
					elem.addEvent(pair[1], rule.pass([elem, index]));
				});
			}, this);
		}
	}

});

/*
---

name: Selector.Attach

description: Binds a selector to an object that takes the selector element as
             first argument.

license: MIT-style license.

requires:
	- Core/DOMReady

provides:
	- Selector.Attach

...
*/

if (!window.Selector) window.Selector = {};

Object.append(Selector, {

	attach: function(selector, type, options) {
		window.addEvent('domready', function() {
			document.getElements(selector).each(function(element) {
				var current = element.retrieve(type);
				if (current == null) {
					element.store(type, new type(element, options));
				}
			});
		});
		return this;
	}

});

/*
---

name: Array.Extras

description: Provides extra methods to the array object.

license: MIT-style license.

requires:
	- Core/Array

provides:
	- Array.Extras

...
*/

Array.implement({

	find: function(fn) {
		for (var i = 0; i < this.length; i++) {
			var found = fn.call(this, this[i]);
			if (found == true) {
				return this[i];
			}
		}
		return null;
	},

	add: function(item) {
		this.unshift(item);
	},

	remove: function(item) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === item) {
				this.splice(i, 1);
				return true;
			}
		}
		return false;
	},

	getLast: function(offset) {
		offset = offset ? offset : 0;
		return this[this.length - 1 - offset] ?
			   this[this.length - 1 - offset] :
			   null;
	}

});

/*
---

name: String.Extras

description: Provides extra methods to the string object.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String.Extras

...
*/

String.implement({

	camelize: function() {
		return this.toString()
	    	.replace(/([A-Z]+)/g,   function(m,l) { return l.substr(0, 1).toUpperCase() + l.toLowerCase().substr(1, l.length); })
		    .replace(/[\-_\s](.)/g, function(m,l) { return l.toUpperCase(); });
	}

});



/*
---

name: Fx.CSS3

description: Provides webkit CSS 3 transitions support. Inspired by
             Fx.Tween.CSS3

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Element.Event
	- Core/Element.Style
	- Core/Fx.CSS
	- More/Class.Binds

provides:
	- Fx.CSS3

...
*/

(function() {

	/* vendor prefix */

	var prefix = '';
	if (Browser.safari || Browser.chrome) {
		prefix = 'webkit';
	} else if (Browser.firefox) {
		prefix = 'Moz';
	} else if (Browser.opera) {
		prefix = 'o';
	} else if (Browser.ie) {
		prefix = 'ms';
	}

	/* events */

	Element.NativeEvents[prefix + 'TransitionStart'] = 2;
	Element.NativeEvents[prefix + 'TransitionEnd'] = 2;
	Element.Events.transitionstart = { base: (prefix + 'TransitionStart') };
	Element.Events.transitionend = { base: (prefix + 'TransitionEnd') };

	/* styles */

	var setStyle = Element.prototype.setStyle;
	var getStyle = Element.prototype.getStyle;

	var setOpacity = Element.prototype.setOpacity;
	var getOpacity = Element.prototype.getOpacity;

	Element.implement({

		setOpacity: function(value) {
			setOpacity.call(this, value);
			this.style.visibility = 'visible';
			return this;
		},

		getOpacity: function() {
			return getOpacity.call(this);
		},

		setStyle: function(style, value) {
			var v = this.toVendor(style);
			return this.hasStyle(v) ? setStyle.call(this, v, value) : setStyle.call(this, style, value);
		},

		getStyle: function(style) {
			var v = this.toVendor(style);
			return this.hasStyle(v) ? getStyle.call(this, v) : getStyle.call(this, style);
		},

		hasStyle: function(style) {
			return this.style[style] != undefined;
		},

		toVendor: function(style) {
			return prefix + style.capitalize().camelCase();
		}

	});

})();

Fx.CSS3 = new Class({

	Extends: Fx.CSS,

	Binds: ['onComplete'],

	running: false,

	options: { transition: 'ease-in' },

	initialize: function(element, options){
		this.element = document.id(element);
		this.parent(options);
		this.duration = Fx.Durations[this.options.duration] || this.options.duration.toInt();
		this.transition = 'transition';
		return this;
	},

	attachEvents: function() {
		this.element.addEvent('transitionend', this.onComplete);
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('transitionend', this.onComplete);
		return this;
	},

	start: function() {
		this.setTransitionInitialState.delay(1, this);
		this.setTransitionParameters.delay(2, this);
		this.play.delay(3, this);
		return this;
	},

	setTransitionInitialState: function() {
		return this;
	},

	setTransitionParameters: function() {
		return this;
	},

	play: function() {
		this.running = true;
		this.time = Date.now();
		return this;
	},

	stop: function() {
		if (this.running) {
			this.running = false;
			if (this.time + this.options.duration <= Date.now()) {
				this.fireEvent('complete', this.element);
				var chain = this.callChain();
				if (chain == false) this.fireEvent('chainComplete', this.element);
			} else {
				this.fireEvent('stop', this.element);
			}
			this.detachEvents();
			this.element.setStyle(this.transition, null);
		}
		return this;
	},

	cancel: function() {
		if (this.running) {
			this.running = false;
			this.fireEvent('cancel', this.element);
			this.clearChain();
			this.detachEvents();
		}
		return this;
	},

	pause: function() {
		throw new Error('Pause is not yet supported.');
		return this;
	},

	resume: function() {
		throw new Error('Resume is not yet supported.');
		return this;
	},

	isRunning: function() {
		return this.running;
	},

	onComplete: function(e) {
		if (this.element == e.target) {
			this.stop();
		}
		return this;
	}

});

/*
---

name: Fx.CSS3.Tween

description: Provide CSS 3 tweening.

license: MIT-style license.

authors:
	- Mootools Authors (http://mootools.net)
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Fx.CSS3

provides:
	- Fx.CSS3.Tween

...
*/
Fx.CSS3.Tween = new Class({

	Extends: Fx.CSS3,

	start: function(property, from, to) {

		if (this.check(property, from, to) == false) return this;

		var args = Array.flatten(arguments);
		var prop = this.options.property || args.shift();
		var parsed = this.prepare(this.element, prop, args);

		this.property = prop;

		this.to = Array.flatten(Array.from(parsed.to))[0];
		this.to = this.to.parser.serve(this.to.value);

		this.from = Array.flatten(Array.from(parsed.from))[0];
		this.from = this.from.parser.serve(this.from.value);

		this.attachEvents();

		return this.parent();
	},

	setTransitionInitialState: function() {
		this.element.setStyle(this.transition, null);
		this.element.setStyle(this.property, this.from);
		return this.parent();
	},

	setTransitionParameters: function() {
		this.element.setStyle(this.transition, this.property + ' ' + this.options.duration + 'ms ' + this.options.transition);
		return this.parent();
	},

	play: function() {
		this.element.setStyle(this.property, this.to);
		return this.parent();
	}

});

/*
---

name: Fx.CSS3.Morph

description: Provide CSS 3 morphing.

license: MIT-style license.

authors:
	- Mootools Authors (http://mootools.net)
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Fx.CSS3

provides:
	- Fx.CSS3.Morph

...
*/

Fx.CSS3.Morph = new Class({

	Extends: Fx.CSS3,

	start: function(properties) {

		if (this.check(properties) == false) return this;

		if (typeof properties == 'string') properties = this.search(properties);

		this.from = {};
		this.to = {};

		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			this.from[p] = parsed.from;
			this.to[p] = parsed.to;
		}

		this.attachEvents();

		return this.parent();
	},

	setTransitionInitialState: function() {
		this.element.setStyle('transition', null);
		Object.each(this.from, function(value, property) {
			if (value.length) {
				value = Array.from(value);
				value = Array.flatten(value)[0];
				value = value.parser.serve(value.value);
				this.element.setStyle(property, value);
			}
		}, this);
		return this.parent();
	},

	setTransitionParameters: function() {
		this.element.setStyle('transition', 'all ' + this.options.duration + 'ms ' + this.options.transition)
		return this.parent();
	},

	play: function() {
		Object.each(this.to, function(value, property) {
			if (value.length) {
				value = Array.from(value);
				value = Array.flatten(value)[0];
				value = value.parser.serve(value.value);
				this.element.setStyle(property, value);
			}
		}, this);
		return this.parent();
	}

});

/*
---

name: Class.Binds

description: A clean Class.Binds Implementation

authors: Scott Kyle (@appden), Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class, Core/Function]

provides: Class.Binds

...
*/

Class.Binds = new Class({

	$bound: {},

	bound: function(name){
		return this.$bound[name] ? this.$bound[name] : this.$bound[name] = this[name].bind(this);
	}

});

/*
---

name: Element.defineCustomEvent

description: Allows to create custom events based on other custom events.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Element.Event]

provides: Element.defineCustomEvent

...
*/

(function(){

[Element, Window, Document].invoke('implement', {hasEvent: function(event){
	var events = this.retrieve('events'),
		list = (events && events[event]) ? events[event].values : null;
	if (list){
		for (var i = list.length; i--;) if (i in list){
			return true;
		}
	}
	return false;
}});

var wrap = function(custom, method, extended, name){
	method = custom[method];
	extended = custom[extended];

	return function(fn, customName){
		if (!customName) customName = name;

		if (extended && !this.hasEvent(customName)) extended.call(this, fn, customName);
		if (method) method.call(this, fn, customName);
	};
};

var inherit = function(custom, base, method, name){
	return function(fn, customName){
		base[method].call(this, fn, customName || name);
		custom[method].call(this, fn, customName || name);
	};
};

var events = Element.Events;

Element.defineCustomEvent = function(name, custom){

	var base = events[custom.base];

	custom.onAdd = wrap(custom, 'onAdd', 'onSetup', name);
	custom.onRemove = wrap(custom, 'onRemove', 'onTeardown', name);

	events[name] = base ? Object.append({}, custom, {

		base: base.base,

		condition: function(event){
			return (!base.condition || base.condition.call(this, event)) &&
				(!custom.condition || custom.condition.call(this, event));
		},

		onAdd: inherit(custom, base, 'onAdd', name),
		onRemove: inherit(custom, base, 'onRemove', name)

	}) : custom;

	return this;

};

var loop = function(name){
	var method = 'on' + name.capitalize();
	Element[name + 'CustomEvents'] = function(){
		Object.each(events, function(event, name){
			if (event[method]) event[method].call(event, name);
		});
	};
	return loop;
};

loop('enable')('disable');

})();


/*
---

name: Browser.Features.Touch

description: Checks whether the used Browser has touch events

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Browser]

provides: Browser.Features.Touch

...
*/

Browser.Features.Touch = (function(){
	try {
		document.createEvent('TouchEvent').initTouchEvent('touchstart');
		return true;
	} catch (exception){}
	
	return false;
})();

// Chrome 5 thinks it is touchy!
// Android doesn't have a touch delay and dispatchEvent does not fire the handler
Browser.Features.iOSTouch = (function(){
	var name = 'cantouch', // Name does not matter
		html = document.html,
		hasTouch = false;

	var handler = function(){
		html.removeEventListener(name, handler, true);
		hasTouch = true;
	};

	try {
		html.addEventListener(name, handler, true);
		var event = document.createEvent('TouchEvent');
		event.initTouchEvent(name);
		html.dispatchEvent(event);
		return hasTouch;
	} catch (exception){}

	handler(); // Remove listener
	return false;
})();


/*
---

name: Touch

description: Provides a custom touch event on mobile devices

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Element.Event, Custom-Event/Element.defineCustomEvent, Browser.Features.Touch]

provides: Touch

...
*/

(function(){

var preventDefault = function(event){
	event.preventDefault();
};

var disabled;

Element.defineCustomEvent('touch', {

	base: 'touchend',

	condition: function(event){
		if (disabled || event.targetTouches.length != 0) return false;

		var touch = event.changedTouches[0],
			target = document.elementFromPoint(touch.clientX, touch.clientY);

		do {
			if (target == this) return true;
		} while ((target = target.parentNode) && target);

		return false;
	},

	onSetup: function(){
		this.addEvent('touchstart', preventDefault);
	},

	onTeardown: function(){
		this.removeEvent('touchstart', preventDefault);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
	}

});

})();


/*
---

name: Click

description: Provides a replacement for click events on mobile devices

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Touch]

provides: Click

...
*/

if (Browser.Features.iOSTouch) (function(){

var name = 'click';
delete Element.NativeEvents[name];

Element.defineCustomEvent(name, {

	base: 'touch'

});

})();


/*
---

name: Pinch

description: Provides a custom pinch event for touch devices

authors: Christopher Beloch (@C_BHole), Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Element.Event, Custom-Event/Element.defineCustomEvent, Browser.Features.Touch]

provides: Pinch

...
*/

if (Browser.Features.Touch) (function(){

var name = 'pinch',
	thresholdKey = name + ':threshold',
	disabled, active;

var events = {

	touchstart: function(event){
		if (event.targetTouches.length == 2) active = true;
	},

	touchmove: function(event){
		event.preventDefault();

		if (disabled || !active) return;

		var threshold = this.retrieve(thresholdKey, 0.5);
		if (event.scale < (1 + threshold) && event.scale > (1 - threshold)) return;

		active = false;
		event.pinch = (event.scale > 1) ? 'in' : 'out';
		this.fireEvent(name, event);
	}

};

Element.defineCustomEvent(name, {

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
	}

});

})();


/*
---

name: Swipe

description: Provides a custom swipe event for touch devices

authors: Christopher Beloch (@C_BHole), Christoph Pojer (@cpojer), Ian Collins (@3n)

license: MIT-style license.

requires: [Core/Element.Event, Custom-Event/Element.defineCustomEvent, Browser.Features.Touch]

provides: Swipe

...
*/

(function(){

var name = 'swipe',
	distanceKey = name + ':distance',
	cancelKey = name + ':cancelVertical',
	dflt = 50;

var start = {}, disabled, active;

var clean = function(){
	active = false;
};

var events = {

	touchstart: function(event){
		if (event.touches.length > 1) return;

		var touch = event.touches[0];
		active = true;
		start = {x: touch.pageX, y: touch.pageY};
	},
	
	touchmove: function(event){
		event.preventDefault();
		if (disabled || !active) return;
		
		var touch = event.changedTouches[0];
		var end = {x: touch.pageX, y: touch.pageY};
		if (this.retrieve(cancelKey) && Math.abs(start.y - end.y) > Math.abs(start.x - end.x)){
			active = false;
			return;
		}
		
		var distance = this.retrieve(distanceKey, dflt),
			diff = end.x - start.x,
			isLeftSwipe = diff < -distance,
			isRightSwipe = diff > distance;

		if (!isRightSwipe && !isLeftSwipe)
			return;
		
		active = false;
		event.direction = (isLeftSwipe ? 'left' : 'right');
		event.start = start;
		event.end = end;
		
		this.fireEvent(name, event);
	},

	touchend: clean,
	touchcancel: clean

};

Element.defineCustomEvent(name, {

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
		clean();
	}

});

})();


/*
---

name: Touchhold

description: Provides a custom touchhold event for touch devices

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Element.Event, Custom-Event/Element.defineCustomEvent, Browser.Features.Touch]

provides: Touchhold

...
*/

(function(){

var name = 'touchhold',
	delayKey = name + ':delay',
	disabled, timer;

var clear = function(e){
	clearTimeout(timer);
};

var events = {

	touchstart: function(event){
		if (event.touches.length > 1){
			clear();
			return;
		}
		
		timer = (function(){
			this.fireEvent(name, event);
		}).delay(this.retrieve(delayKey) || 750, this);
	},

	touchmove: clear,
	touchcancel: clear,
	touchend: clear

};

Element.defineCustomEvent(name, {

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
		clear();
	}

});

})();


/*
---

name: Browser.Platform

description: Provides extra indication about the current platform such as
             desktop, mobile, phonegap.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Browser.Platform

...
*/

Browser.Platform.desktop =
	Browser.Platform.mac ||
	Browser.Platform.win ||
	Browser.Platform.linux ||
	Browser.Platform.other;

Browser.Platform.mobile =
	Browser.Platform.ios ||
	Browser.Platform.webos ||
	Browser.Platform.android;

Browser.Platform.phonegap =
	window.device &&
	window.device.phonegap;

Browser.Platform.simulator = false;

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

Event.CLICK			= Browser.Platform.desktop ? 'clickover' : 'touchover';
Event.MOUSE_DOWN	= Browser.Platform.desktop ? 'mousedown' : 'touchstart';
Event.MOUSE_MOVE	= Browser.Platform.desktop ? 'mousemove' : 'touchmove';
Event.MOUSE_UP		= Browser.Platform.desktop ? 'mouseup'   : 'touchend';

Event.TOUCH_HOLD	= 'touchhold';
Event.TOUCH_CANCEL	= 'touchcancel';

Event.ORIENTATION_CHANGE = 'orientationchange';

Event.GESTURE_START		= 'gesturestart';
Event.GESTURE_CHANGE	= 'gesturechange';
Event.GESTURE_END		= 'gestureend';

Event.SELECT			= 'select';
Event.DESELECT			= 'deselect';

if (Browser.Platform.phonegap) Element.NativeEvents.deviceready = 1;

/*
---

name: Event.ClickOver

description: Provide a click event that is not triggered when the user clicks
             and move the mouse.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Event.ClickOver

...
*/

(function(){

	var x = 0;
	var y = 0;
	var down = false;
	var valid = true;

	var onMouseDown = function(e) {
		down = true;
		x = e.page.x;
		y = e.page.y;
	};

	var onMouseMove = function(e) {
		if (down) {
			valid = !moved(e);
			if (valid == false) {
				this.removeEvent('mouseup', onMouseUp).fireEvent('mouseup', e).addEvent('mouseup', onMouseUp);
			}
		}
	};

	var onMouseUp = function(e) {
		if (down) {
			down = false;
			valid = !moved(e);
		}
	};

	var moved = function(e) {
		var xmax = x + 3;
		var xmin = x - 3;
		var ymax = y + 3;
		var ymin = y - 3;
		return (e.page.x > xmax || e.page.x < xmin || e.page.y > ymax || e.page.y < ymin);
	};

	Element.Events.clickover = {

		base: 'click',

		onAdd: function() {
			this.addEvent('mousedown', onMouseDown);
			this.addEvent('mousemove', onMouseMove);
			this.addEvent('mouseup', onMouseUp);
		},

		onRemove: function() {
			this.removeEvent('mousedown', onMouseDown);
			this.removeEvent('mousemove', onMouseMove);
			this.removeEvent('mouseup', onMouseUp);
		},

		condition: function(e) {
			return valid;
		}

	};

})();

/*
---

name: Event.TouchOver

description: Provide a touch event that is not triggered when the user touch
             and moves.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Event.TouchOver

...
*/

(function(){

	var x = 0;
	var y = 0;
	var down = false;
	var valid = true;

	var onTouchStart = function(e) {
		x = e.page.x;
		y = e.page.y;
		down = true;
	};

	var onTouchMove = function(e) {
		if (down) {
			valid = !moved(e);
			if (valid == false) {
				this.removeEvent('touchend', onTouchEnd).fireEvent('touchend', e).addEvent('touchend', onTouchEnd);
			}
		}
	};

	var onTouchEnd = function(e) {
		if (down) {
			down = false;
			valid = !moved(e);
		}
	};

	var moved = function(e) {
		var xmax = x + 3;
		var xmin = x - 3;
		var ymax = y + 3;
		var ymin = y - 3;
		return (e.page.x > xmax || e.page.x < xmin || e.page.y > ymax || e.page.y < ymin);
	};

	Element.Events.touchover = {

		base: 'touchend',

		onAdd: function() {
			this.addEvent('touchstart', onTouchStart);
			this.addEvent('touchmove', onTouchMove);
			this.addEvent('touchend', onTouchEnd);
		},

		onRemove: function() {
			this.removeEvent('touchstart', onTouchStart);
			this.removeEvent('touchmove', onTouchMove);
			this.removeEvent('touchend', onTouchEnd);
		},

		condition: function(e) {
			return valid;
		}

	};

})();

/*
---

name: Core

description: Provide the mobile namespace and requires all components from
             Core, More, Extras and Moobile that are required globally.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Array
	- Core/String
	- Core/Number
	- Core/Function
	- Core/Object
	- Core/Event
	- Core/Browser
	- Core/Class
	- Core/Class.Extras
	- Core/Element
	- Core/Element.Style
	- Core/Element.Event
	- Core/Element.Dimensions
	- Core/Fx
	- Core/Fx.CSS
	- Core/Fx.Tween
	- Core/Fx.Morph
	- Core/Request
	- Core/Request.HTML
	- Core/Request.JSON
	- Core/Cookie
	- Core/JSON
	- Core/DOMReady
	- More/Events.Pseudos
	- More/Class.Refactor
	- More/Class.Binds
	- More/Array.Extras
	- More/Date.Extras
	- More/Object.Extras
	- More/String.Extras
	- Extras/Console.Trace
	- Extras/Class.Extras
	- Extras/Element.Extras
	- Extras/Element.Properties
	- Extras/Selector.Apply
	- Extras/Selector.Attach
	- Extras/Array.Extras
	- Extras/String.Extras
	- Extras/Fx.CSS3
	- Extras/Fx.CSS3.Tween
	- Extras/Fx.CSS3.Morph
	- Class-Extras/Class.Binds
	- Mobile/Click
	- Mobile/Pinch
	- Mobile/Swipe
	- Mobile/Touch
	- Mobile/Touchhold
	- Browser.Platform
	- Event
	- Event.ClickOver
	- Event.TouchOver

provides:
	- Core

...
*/

if (!window.Moobile) window.Moobile = {};
window.Moobile.version = '0.1.0dev';
window.Moobile.build = '%build%';

window.Moobile.UI = {};

/*
---

name: Application

description: Provide the base class for an application container.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- Application

...
*/

Moobile.Application = new Class({

	Implements: [Events, Options, Class.Binds],

	viewControllerStack: null,

	window: null,

	options: {
		window: 'window'
	},

	initialize: function(options) {
		this.setOptions(options);
		this.attachEvents();
		return this;
	},

	startup: function() {
		this.viewControllerStack = this.createViewControllerStack();
		this.window = this.createWindow();
		this.window.setViewController(this.viewControllerStack);
		return this;
	},

	shutdown: function() {
		this.destroyViewControllerStack();
		this.destroyWindow();
		return this;
	},

	createWindow: function() {
		return new Moobile.Window(this.options.window);
	},

	createViewControllerStack: function() {
		return new Moobile.ViewControllerStack();
	},

	destroyWindow: function() {
		this.window.destroy();
		return this;
	},

	destroyViewControllerStack: function() {
		this.viewControllerStack.shutdown();
		return this;
	},

	attachEvents: function() {
		window.addEvent(Event.READY, this.bound('onReady'));
		return this;
	},

	detachEvents: function() {
		window.removeEvent(Event.READY, this.bound('onReady'));
		return this;
	},

	onReady: function() {
		this.startup();
		this.fireEvent(Event.READY);
		return this;
	}
});

/*
---

name: Application.iPhone

description: Provide an application container for an iPhone application.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Application

provides:
	- Application.iPhone

...
*/
Moobile.Application.iPhone = new Class({

	Extends: Moobile.Application,

	createViewControllerStack: function() {
		return new Moobile.ViewControllerStack.Navigation();
	}

})

/*
---

name: Request

description: Provides a base class for ajax request.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- Request

...
*/

Moobile.Request = new Class({

	Extends: Request,

	Implements: [Class.Binds],

	options: {
		isSuccess: function() {
			var status = this.status;
			return (status == 0 || (status >= 200 && status < 300));
		}
	}

});

/*
---

name: Request.ViewController

description: Provides a method to load a view controller from a remote location.
             Instanciate the view controller based on data properties stored
             on the requested element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Request

provides:
	- Request.ViewController

...
*/

if (!window.Moobile.Request) Moobile.Request = {};

Moobile.Request.ViewController = new Class({

	Extends: Moobile.Request,

	viewControllerStack: null,

	options: {
		method: 'get',
		defaultView: 'Moobile.View.Scroll',
		defaultController: 'Moobile.ViewController',
		defaultTransition: 'Moobile.ViewControllerTransition.Slide'
	},

	initialize: function(viewControllerStack, options) {
		this.parent(options);
		this.viewControllerStack = viewControllerStack;
		this.attachEvents();
		return this;
	},

	attachEvents: function() {
		this.addEvent('success', this.bound('gotViewController'));
		return this;
	},

	detachEvents: function() {
		this.removeEvent('success', this.bound('gotViewController'));
		return this;
	},

	getViewController: function(remote, fn) {
		this.options.url = remote;
		this.send();
		return this;
	},

	gotViewController: function(response) {

		var element = new Element('div')
			.ingest(response)
			.getElement('[data-role=view]');

		if (element) {

			var v = this.createInstanceFrom(element, 'data-view', this.options.defaultView, element);
			var c = this.createInstanceFrom(element, 'data-view-controller', this.options.defaultController, v);
			var t = this.createInstanceFrom(element, 'data-view-controller-transition', this.options.defaultTransition);

			c.setTransition(t);

			this.viewControllerStack.pushViewController(c, t);

			return this;
		}

		throw new Error('Cannot find a view element from the response');

		return this;
	},

	createInstanceFrom: function(element, attribute, defaults) {
		var property = element.getProperty(attribute) || defaults;
		var args = Array.prototype.slice.call(arguments, 3);
		args.add(property);
		var instance = Class.from.apply(Class, args);
		return instance;
	}

});

/*
---

name: UI.Element

description: Provide a refactorized UI.Element class where the initialize call
             the setup method before attaching events.

license: MIT-style license.

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/DOMReady
	- Core/Element
	- Core/Element.Style
	- Core/Element.Event
	- Core/Element.Dimensions
	- Core/Fx.Tween
	- Core/Fx.Morph
	- More/Class.Binds
	- More/Element.Shortcuts
	- Class-Extras/Class.Binds

provides:
	- UI.Element

...
*/

if (!window.UI) window.UI = {};

Moobile.UI.Element = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	element: null,

	name: null,

	options: {
		className: ''
	},

	initialize: function(element, options) {
		this.setElement(element);
		this.setElementOptions();
		this.setOptions(options);
		this.element.addClass(this.options.className);
		this.setup();
		this.attachEvents();
		return this;
	},

	create: function() {
		return new Element('div');
	},

	setup: function() {
		this.name = this.element.getProperty('data-name');
		return this;
	},

	destroy: function() {
		this.detachEvents();
		this.element.destroy();
		this.element = null;
		return this;
	},

	attachEvents: function() {
		return this;
	},

	detachEvents: function() {
		return this;
	},

	setElementOptions: function() {
		var options = this.element.getProperty('data-options');
		if (options) {
			options = JSON.decode('{' + options + '}');
			Object.append(this.options, options);
		}
		return this;
	},

	setElement: function(element) {
		if (this.element == null) this.element = document.id(element);
		if (this.element == null) this.element = document.getElement(element);
		if (this.element == null) this.element = this.create();
		return this;
	},

	getElement: function(selector) {
		return arguments.length ? this.element.getElement(arguments[0]) : this.element;
	},

	toElement: function() {
		return this.element;
	},

	show: function() {
		this.element.show();
		return this;
	},

	hide: function() {
		this.element.hide();
		return this;
	},

	fade: function(how) {
		this.element.fade(how);
		return this;
	},

	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	inject: function(element, where) {
		this.element.inject(element, where);
		return this;
	},

	adopt: function() {
		this.element.adopt.apply(this.element, arguments);
		return this;
	},

	grab: function(element, where) {
		this.element.grab(element, where);
		return this;
	},

	empty: function() {
		this.element.empty();
		return this;
	},

	dispose: function() {
		this.element.dispose();
		return this;
	}

});

/*
---

name: UI.Control

description: Provides the base class for any types of controls.

license: MIT-style license.

requires:
	- Core/Class
	- Core/Class.Extras
	- UI.Element

provides:
	- UI.Control

...
*/

Moobile.UI.Control = new Class({

	Extends: Moobile.UI.Element,

	style: null,

	disabled: false,
		
	options: {
		className: '',
		styleName: null
	},

	setup: function() {
		if (this.options.styleName) this.setStyle(this.options.styleName);
		return this.parent();
	},

	setStyle: function(style) {
		this.removeStyle();
		this.style = style;
		this.style.attach.call(this);
		this.addClass(this.style.className);
		return this;
	},

	getStyle: function() {
		return this.style;
	},

	removeStyle: function() {
		if (this.style) {
			this.style.detach.call(this);
			this.removeClass(this.style.className);
			this.style = null;
		}
		return this;
	},

	setDisabled: function(disabled) {
		if (this.disabled != disabled) {
			this.disabled = disabled;
			if (this.disabled) {
				this.addClass(this.options.className + '-disabled');
				this.attachEvents();
			} else {
				this.removeClass(this.options.className + '-disabled');
				this.detachEvents();
			}
		}
		return this;
	},

	isDisabled: function() {
		return this.disabled;
	},

	isNative: function() {
		return ['input', 'textarea', 'select', 'button'].contains(this.element.get('tag'));
	}

});

/*
---

name: UI.ButtonStyle

description: Provide constants for button styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- UI.ButtonStyle

...
*/

Moobile.UI.ButtonStyle = {

	Default: {
		className: 'style-default',
		attach: function() {},
		detach: function() {}
	}
	
};


/*
---

name: UI.Button

description: Provides a button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.ButtonStyle

provides:
	- UI.Button

...
*/

Moobile.UI.Button = new Class({

	Extends: Moobile.UI.Control,

	content: null,

	options: {
		className: 'ui-button',
		styleName: Moobile.UI.ButtonStyle.Default
	},

	setup: function() {
		if (!this.isNative()) this.injectContent();
		return this.parent();
	},

	destroy: function() {
		if (!this.isNative()) this.destroyContent();
		return this.parent();
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
		return this;
	},

	attachEvents: function() {
		this.element.addEvent(Event.CLICK, this.bound('onClick'));
		this.element.addEvent(Event.MOUSE_UP, this.bound('onMouseUp'))
		this.element.addEvent(Event.MOUSE_DOWN, this.bound('onMouseDown'));
		return this.parent();
	},

	detachEvents: function() {
		this.element.removeEvent(Event.CLICK, this.bound('onClick'));
		this.element.removeEvent(Event.MOUSE_UP, this.bound('onMouseUp'));
		this.element.removeEvent(Event.MOUSE_DOWN, this.bound('onMouseDown'));
		return this.parent();
	},

	setText: function(text) {
		if (this.isNative()) {
			this.element.set('value', text);
		} else {
			this.content.set('html', text);
		}
		return this;
	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent(Event.CLICK, e);
		return this;
	},

	onMouseDown: function(e) {
		e.target = this;
		this.element.addClass(this.options.className + '-down');
		this.fireEvent(Event.MOUSE_DOWN, e);
		return this;
	},

	onMouseUp: function(e) {
		e.target = this;
		this.element.removeClass(this.options.className + '-down');
		this.fireEvent(Event.MOUSE_UP, e);
		return this;
	}

});

/*
---

name: UI.BarStyle

description: Provide constants for bar styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- UI.BarStyle

...
*/

Moobile.UI.BarStyle = {

	DefaultOpaque: {
		className: 'style-blue-opaque',
		attach: function() {},
		detach: function() {}
	},

	DefaultTranslucent: {
		className: 'style-blue-translucent',
		attach: function() {},
		detach: function() {}
	},

	BlackOpaque: {
		className: 'style-black-opaque',
		attach: function() {},
		detach: function() {}
	},

	BlackTranslucent: {
		className: 'style-black-translucent',
		attach: function() {},
		detach: function() {}
	}

};

/*
---

name: UI.Bar

description: Provide the base class for a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.BarStyle

provides:
	- UI.Bar

...
*/

Moobile.UI.Bar = new Class({

	Extends: Moobile.UI.Control,

	content: null,

	options: {
		className: 'ui-bar',
		styleName: Moobile.UI.BarStyle.DefaultOpaque
	},

	setup: function() {
		this.injectContent();
		return this.parent();
	},

	destroy: function() {
		this.destroyContent();
		return this.parent();
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
		return this;
	},

	show: function() {
		this.view.addClass(this.options.className + '-visible');
		this.parent();
		return this;
	},

	hide: function() {
		this.view.removeClass(this.options.className + '-visible');
		this.parent();
		return this;
	}

});

/*
---

name: UI.Bar.Navigation

description: Provide the navigation bar control that contains a title and two
             areas for buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Bar

provides:
	- UI.Bar.Navigation

...
*/

Moobile.UI.Bar.Navigation = new Class({

	Extends: Moobile.UI.Bar,

	caption: null,

	leftButton: null,

	rightButton: null,

	options: {
		className: 'ui-navigation-bar'
	},

	setup: function() {
		this.injectCaption();
		return this.parent();
	},

	destroy: function() {
		this.destroyCaption();
		return this.parent();
	},

	injectCaption: function() {
		this.caption = new Element('div.' + this.options.className + '-caption').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.caption);
		return this;
	},

	destroyCaption: function() {
		this.caption.destroy();
		this.caption = null;
		return this;
	},

	setTitle: function(title) {
		this.caption.set('html', title);
		return this;
	},

	getTitle: function() {
		return this.caption.get('html');
	},

	setLeftButton: function(button) {
		this.removeLeftButton();
		this.leftButton = button;
		this.leftButton.addClass(this.options.className + '-left');
		this.leftButton.inject(this.content);
		return this;
	},

	removeLeftButton: function() {
		if (this.leftButton) {
			this.leftButton.destroy();
			this.leftButton = null;
		}
		return this;
	},

	setRightButton: function(button) {
		this.removeRightButton();
		this.rightButton = button;
		this.rightButton.addClass(this.options.className + '-right');
		this.rightButton.inject(this.content);
		return this;
	},

	removeRightButton: function() {
		if (this.rightButton) {
			this.rightButton.destroy();
			this.rightButton = null;
		}
		return this;
	}

});

/*
---

name: UI.BarButtonStyle

description: Provide constants for bar button styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- UI.BarButtonStyle

...
*/

Moobile.UI.BarButtonStyle = {

	Default: {
		className: 'style-default',
		attach: function() {},
		detach: function() {}
	},

	Active: {
		className: 'style-active',
		attach: function() {},
		detach: function() {}
	},

	Black: {
		className: 'style-black',
		attach: function() {},
		detach: function() {}
	},

	Warning: {
		className: 'style-warning',
		attach: function() {},
		detach: function() {}
	},

	Back: {
		className: 'style-back',
		attach: function() {},
		detach: function() {}
	},

	Forward: {
		className: 'style-forward',
		attach: function() {},
		detach: function() {}
	}

};

/*
---

name: UI.BarButton

description: Provides a button used inside a bar such as the navigation bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Button
	- UI.BarButtonStyle

provides:
	- UI.BarButton

...
*/

Moobile.UI.BarButton = new Class({

	Extends: Moobile.UI.Button,

	options: {
		className: 'ui-bar-button',
		styleName: Moobile.UI.BarButtonStyle.Default
	}	

});

/*
---

name: UI.ListItem

description: Provide an item of a list.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control

provides:
	- UI.ListItem

...
*/

Moobile.UI.ListItem = new Class({

	Extends: Moobile.UI.Control,

	wrapper: null,

	selected: false,

	options: {
		className: 'ui-list-item',
		selectable: true
	},

	initialize: function(element, options) {
		this.parent(element, options);
		this.selectable = this.options.selectable;
		return this;
	},

	setup: function() {
		this.injectWrapper();
		return this.parent();
	},

	destroy: function() {
		this.injectWrapper();
		return this.parent();
	},

	injectWrapper: function() {
		this.wrapper = new Element('div.' + this.options.className + '-wrapper').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.wrapper);
		return this;
	},

	destroyWrapper: function() {
		this.wrapper.destroy();
		this.wrapper = null;
		return this;
	},

	attachEvents: function() {
		this.element.addEvent(Event.CLICK, this.bound('onClick'));
		this.element.addEvent(Event.MOUSE_UP, this.bound('onMouseUp'))
		this.element.addEvent(Event.MOUSE_DOWN, this.bound('onMouseDown'));
		return this.parent();
	},

	detachEvents: function() {
		this.element.removeEvent(Event.CLICK, this.bound('onClick'));
		this.element.removeEvent(Event.MOUSE_UP, this.bound('onMouseUp'));
		this.element.removeEvent(Event.MOUSE_DOWN, this.bound('onMouseDown'));
		return this.parent();
	},

	setSelectable: function(selectable) {
		this.options.selectable = selectable;
	},

	toggleSelected: function() {
		return this.setSelected(!this.selected);
	},

	setSelected: function(selected) {
		if (this.selected != selected) {
			this.selected = selected;
			if (this.selected) {
				this.addClass(this.options.className + '-selected');
				this.fireEvent(Event.SELECT, this);
			} else {
				this.removeClass(this.options.className + '-selected');
				this.fireEvent(Event.DESELECT, this);
			}			
		}
		return this;
	},

	isSelected: function() {
		return this.selected;
	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent(Event.CLICK, e);
		if (this.options.selectable) this.toggleSelected();
		return this;
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent(Event.MOUSE_DOWN, e);		
		if (this.options.selectable) this.element.addClass(this.options.className + '-down');
		return this;
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent(Event.MOUSE_UP, e);		
		if (this.options.selectable) this.element.removeClass(this.options.className + '-down');
		return this;
	}

});

/*
---

name: UI.List

description: Provide a list of items.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.ListItem

provides:
	- UI.List

...
*/

Moobile.UI.List = new Class({

	Extends: Moobile.UI.Control,

	items: [],

	selectedItems: [],

	options: {
		className: 'ui-list',
		selectable: true,
		multiple: false
	},

	setup: function() {
		this.attachItems();
		return this.parent();
	},

	destroy: function() {
		this.destroyItems();
		return this.parent();
	},

	destroyItems: function() {
		this.items.each(function(item) { item.destroy(); });
		this.items = null;
		this.items = [];
		return this;
	},

	attachItems: function() {
		this.element.getElements('[data-role=list-item]').each(this.attachItem.bind(this));
		return this;
	},

	attachItem: function(element) {
		var item = new Moobile.UI.ListItem(element);
		item.setSelectable(this.options.selectable);
		item.addEvent(Event.SELECT, this.bound('onSelect'));
		item.addEvent(Event.DESELECT, this.bound('onDeselect'));
		this.items.push(item);
		return this;
	},

	detachItems: function() {
		this.item = null;
		this.item = [];
		return this;
	},

	detachItem:function(item) {
		this.item.remove(item);
		return this;
	},

	setSelectable: function(selectable) {
		this.options.selectable = selectable;
		this.items.each(function(item) { item.setSelectable(selectable) });
		return this;
	},

	setSelectedItem: function(item) {
		this.setItemAsSelected(item.setSelected(true));
		return this;
	},

	setSelectedItems: function() {
		Array.each(arguments, function(item) { this.setSelectedItem(item) }.bind(this));
		return this;
	},

	removeSelectedItem: function(item) {
		this.setItemAsDeselected(item.setSelected(false));
	},

	removeSelectedItems: function() {
		Array.each(arguments, function(item) { this.removeSelectedItem(item) }.bind(this));
		return this;
	},

	clearSelectedItems: function() {
		this.removeSelectedItems.apply(this, this.selectedItems);
	},

	setItemAsSelected: function(item) {
		if (this.options.multiple == false) {
			this.selectedItems.each(function(item) { item.setSelected(false); });
			this.selectedItems = null;
			this.selectedItems = []
		}
		this.selectedItems.push(item);
		this.fireEvent(Event.SELECT, item);
		return this;
	},

	setItemAsDeselected: function(item) {
		this.selectedItems.remove(item);
		this.fireEvent(Event.DESELECT, item);
		return this;
	},

	getSelectedItem: function() {
		return this.selectedItems.getLast();
	},

	getSelectedItems: function() {
		return this.selectedItems;
	},

	onSelect: function(item) {
		return this.setItemAsSelected(item);
	},

	onDeselect: function(item) {
		return this.setItemAsDeselected(item);
	}

});

/*
---

name: View

description: Provides an element on the screen and the interfaces for managing
             the content in that area.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- View

...
*/

Moobile.View = new Class({

	Extends: Moobile.UI.Element,

	window: null,

	parentView: null,

	wrapper: null,

	content: null,

	childViews: [],

	childElements: [],

	childControls: [],

	options: {
		title: 'View',
		className: 'view',
		wrapper: true,
		content: true
	},

	setup: function() {
		if (this.options.wrapper) this.injectContent();
		if (this.options.content) this.injectWrapper();
		this.attachChildElements();
		this.attachChildControls();
		return this.parent();
	},

	destroy: function() {
		if (this.options.content) this.destroyContent();
		if (this.options.wrapper) this.destroyWrapper();
		this.destroyChildViews();
		this.destroyChildElements();
		this.destroyChildControls();
		this.parent();
		return this;
	},

	attachEvents: function() {
  		return this;
	},

	detachEvents: function() {
		return this;
	},

	destroyChildViews: function() {
		this.childViews.each(function(view) { view.destroy(); });
		this.childViews = null;
		this.childViews = [];
		return this;
	},

	destroyChildElements: function() {
		this.childElements.each(function(element) { element.destroy(); });
		this.childElements = null;
		this.childElements = [];
		return this;
	},

	destroyChildControls: function() {
		this.childControls.each(function(control) { control.destroy(); });
		this.childControls = null;
		this.childControls = [];
		return this;
	},

	injectWrapper: function() {
		this.wrapper = new Element('div.' + this.options.className + '-wrapper').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.wrapper);
		return this;
	},

	destroyWrapper: function() {
		this.wrapper.destroy();
		this.wrapper = null;
		return this;
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
		return this;
	},

	addChildView: function(view, where, context) {
		this.childViews.push(view);
		view.setParentView(this);
		view.setWindow(this.window);
		this.grab(view, where, context);
		return this;
	},

	removeChildViews: function() {
		this.childViews.each(this.removeChildView.bind(this));
		this.childViews = null;
		this.childViews = [];
		return this;
	},

	removeChildView: function(view) {
		var removed = this.childViews.remove(view);
		if (removed) view.dispose();
		return this;
	},

	removeFromParentView: function() {
		var parent = this.parentView || this.window;
		if (parent) parent.removeChildView(this);
		return this;
	},

	attachChildControls: function() {
		this.element.getElements('[data-role=control]').each(this.attachChildControl.bind(this));
		return this;
	},

	attachChildControl: function(element) {
		var control = Class.from(element.getProperty('data-control') || 'UI.Control', element);
		this.pushChildControl(control);
		this.bindChildControl(control);
		return this;
	},

	detachChildControls: function() {
		this.childControls = null;
		this.childControls = [];
		return this;
	},

	detachChildControl: function(control) {
		this.childControls.remove(control);
		return this;
	},

	addChildControl: function(control, where, context) {
		this.pushChildControl(control);
		this.bindChildControl(control);
		this.grab(control, where, context);
		return this;
	},

	pushChildControl: function(control) {
		control.view = this;
		control.window = this.window;
		this.childControls.push(control);
		return this;
	},

	bindChildControl: function(control) {
		if (control.name) {
			control.member = control.name.camelize();
			if (this[control.member] == null || this[control.member] == undefined) {
				this[control.member] = control;
			}
		}
		return this;
	},

	getChildControl: function(name) {
		return this.childControls.find(function(control) { return control.name == name; });
	},

	removeChildControls: function() {
		this.childControls.each(this.removeChildElement.bind(this));
		this.childControls = null;
		this.childControls = [];
		return this;
	},

	removeChildControl: function(control) {
		var removed = this.childControls.remove(control);
		if (removed) control.dispose();
		return this;
	},

	attachChildElements: function() {
		this.element.getElements('[data-role=element]').each(this.attachChildElement.bind(this));
		return this;
	},

	attachChildElement: function(element) {
		this.childElements.push(element);
		return this;
	},

	detachChildElements: function() {
		this.childElements = null;
		this.childElements = [];
		return this;
	},

	detachChildElement: function(element) {
		this.childElements.remove(element);
		return this;
	},

	addChildElement: function(element, where, context) {
		this.attachChildElement(element);
		this.grab(element, where, context);
		return this;
	},

	getChildElement: function(name) {
		return this.childElements.find(function(element) { return element.getProperty('data-name') == name; });
	},

	removeChildElements: function() {
		this.childElements.each(this.removeChildElement.bind(this));
		this.childElements = null;
		this.childElements = [];
		return this;
	},

	removeChildElement: function(element) {
		var removed = this.childElements.remove(element);
		if (removed) element.dispose();
		return this;
	},

	setWindow: function(window) {
		this.window = window;
		return this;
	},

	getWindow: function() {
		return this.window;
	},

	setParentView: function(parentView) {
		this.parentView = parentView;
		return this;
	},

	getParentView: function() {
		return this.parentView;
	},

	getTitle: function() {
		return this.element.getProperty('data-title') || this.options.title;
	},

	getWrapper: function() {
		return this.wrapper;
	},

	getContent: function() {
		return this.content;
	},

	getSize: function() {
		return this.element.getSize();
	},

	getContentSize: function() {
		return this.content.getSize();
	},

	getContentExtent: function() {
		var prev = this.wrapper.getPrevious();
		var next = this.wrapper.getNext();
		var size = this.getSize();
		if (prev) size.y = size.y - prev.getPosition().y - prev.getSize().y;
		if (next) size.y = size.y - next.getPosition().y;
		return size;
	},

	adopt: function() {
		var content = this.content || this.element;
		content.adopt.apply(content, arguments);
		return this;
	},

	grab: function(element, where, context) {

		if (context) {
			context = document.id(context);
			context.inject(element, where);
			return this;
		}

		(where == 'top' || where == 'bottom' ? this.element : this.content || this.element).grab(element, where);

		return this;
	},

	orientationDidChange: function() {
		return this;
	},

	willEnter: function() {
		return this;
	},

	didEnter: function() {
		return this;
	},

	willLeave: function() {
		return this;
	},

	didLeave: function() {
		return this;
	},

	didRemove: function() {
		return this;
	}

});

/*
---

name: View.Scroll

description: Provide a view that scrolls when the content is larger that the
             window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- View.Scroll

...
*/

Moobile.View.Scroll = new Class({

	Static: {
		scrollers: 0
	},

	Extends: Moobile.View,
		
	contentSize: null,

	scroller: null,
	
	scrollerUpdateInterval: null,
	
	scrolled: null,

	setup: function() {
		this.parent();
		this.attachScroller();
		return this;
	},

	destroy: function() {
		this.detachScroller();
		this.parent();
		return this;
	},

	attachScroller: function() {
		if (++Moobile.View.Scroll.scrollers == 1) document.addEventListener('touchmove', this.onDocumentTouchMove);
		return this;
	},

	detachScroller: function() {
		if (--Moobile.View.Scroll.scrollers == 0) document.removeEventListener('touchmove', this.onDocumentTouchMove);
		return this;
	},

	createScroller: function() {
		return new iScroll(this.wrapper, { desktopCompatibility: true, hScroll: false, vScroll: true });
	},

	enableScroller: function() {
		if (this.scroller == null) {
			this.scroller = this.createScroller();
			this.wrapper.setStyle('overflow', 'visible');
			this.updateScroller();
			this.updateScrollerAutomatically(true);
			if (this.scrolled) this.scroller.scrollTo(0, -this.scrolled);
		}
		return this;
	},

	disableScroller: function() {
		if (this.scroller) {
			this.updateScrollerAutomatically(false);
			this.scrolled = this.content.getStyle('transform');
			this.scrolled = this.scrolled.match(/translate3d\(-*(\d+)px, -*(\d+)px, -*(\d+)px\)/)
			this.scrolled = this.scrolled[2];
			this.scroller.destroy();
			this.scroller = null;
		}
		return this;
	},

	updateScroller: function() {
		if (this.scroller) {
			if (this.contentSize != this.content.getScrollSize().y) {
				this.contentSize = this.content.getScrollSize().y;
				var extent = this.getContentExtent();				
				this.wrapper.setStyle('height', extent.y);
				this.wrapper.setStyle('min-height', extent.y);
				this.content.setStyle('min-height', extent.y);
				this.scroller.refresh();
			}
		}
		return this;
	},

	updateScrollerAutomatically: function(automatically) {
		clearInterval(this.scrollerUpdateInterval);
		if (automatically) this.scrollerUpdateInterval = this.updateScroller.periodical(250, this);
		return this;
	},

	willEnter: function() {
		this.enableScroller();
		return this.parent();
	},

	didLeave: function() {
		this.disableScroller();
		return this.parent();
	},

	onDocumentTouchMove: function(e) {
		e.preventDefault();
	}
   
});

/*
---

name: ViewStack

description: Provide the view that will contains the view controller stack
             child views. This view must have a wrapper that will be double
             size of the original view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View

provides:
	- ViewStack

...
*/

Moobile.ViewStack = new Class({

	Extends: Moobile.View,

	options: {
		className: 'view-stack'
	},

	setup: function() {
		this.parent();
		this.element.addClass('view-stack');
		this.wrapper.addClass('view-stack-wrapper');
		this.content.addClass('view-stack-content');
		return this;
	}

});

/*
---

name: NavigationView

description: Provide a view for the navigation view controller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewStack

provides:
	- NavigationView

...
*/

Moobile.ViewStack.Navigation = new Class({

	Extends: Moobile.ViewStack,

	options: {
		className: 'navigation-view-stack'
	}

});

/*
---

name: ViewController

description: Provides a way to handle the different states and events of a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- ViewController

...
*/

Moobile.ViewController = new Class({

	Implements: [Events, Options, Class.Binds],

	window: null,

	view: null,

	modalViewController: null,

	transition: null,

	identifier: null,

	started: false,

	initialize: function(view) {
		this.loadView(view);
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.View.Scroll(new Element('div'));
		return this;
	},

	attachEvents: function() {
  		return this;
	},

	detachEvents: function() {
		return this;
	},

	doStartup: function() {
		if (this.started == false) {
			this.started = true;
			this.startup();
			this.attachEvents();
		}
		return this;
	},

	doShutdown: function() {
		if (this.started == true) {
			this.started = false;
			this.detachEvents();
			this.shutdown();
		}
		return this;
	},

	startup: function() {
		this.window = this.view.getWindow();
		return this;
	},

	shutdown: function() {
		this.view.destroy();
		this.view = null;
		this.modalViewController = null;
		this.transition = null;
		this.window = null;
		return this;
	},

	getId: function() {
		if (this.identifier == null) {
			this.identifier = String.uniqueID();
		}
		return this.identifier;
	},

	getHash: function() {
		return this.getTitle().length ? this.getTitle().slug() : this.getId();
	},

	getTitle: function() {
		return this.view.getTitle();
	},

	presetModalViewControllerFrom: function(url) {
		return this;
	},

	presentModalViewController: function(viewController, viewControllerTransition) {
		// TODO: implementation
		return this;
	},

	dismissModalViewController: function() {
		// TODO: implementation
		return this;
	},

	setTransition: function(transition) {
		this.transition = transition;
		return this;
	},

	getTransition: function() {
		return this.transition;
	},

	orientationDidChange: function(orientation) {
		this.view.orientationDidChange(orientation);
		return this;
	},

	viewWillEnter: function() {
		this.view.show();
		this.view.willEnter();
		return this;
	},

	viewDidEnter: function() {
		this.view.didEnter();
		return this;
	},

	viewWillLeave: function() {
		this.view.willLeave();
		return this;
	},

	viewDidLeave: function() {
		this.view.didLeave();
		this.view.hide();
		return this;
	},

	viewDidRemove: function() {
		this.view.removeFromParentView();
		this.view.didRemove();
		return this;
	}

});

/*
---

name: ViewControllerStack

description: Provides a way to navigate from view to view and comming back.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Request.ViewController
	- ViewController

provides:
	- ViewControllerStack

...
*/

Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	topViewController: null,

	viewControllers: [],
	
	viewControllerRequest: null,

	initialize: function(view) {
		this.parent(view);
		this.viewControllerRequest = new Moobile.Request.ViewController(this);
		this.view.hide();
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.ViewStack(new Element('div'));
	},
	
	pushViewControllerFrom: function(remote) {
		this.viewControllerRequest.cancel();
		this.viewControllerRequest.getViewController(remote);
		return this;
	},

	pushViewController: function(viewController, viewControllerTransition) {
		viewController.viewControllerStack = this;
		viewController.viewControllerPanel = this.viewControllerPanel;
		this.viewControllers.push(viewController);
		
		if (this.viewControllers.length == 1) {
			
			this.view.fade('hide');
			this.view.show();

			this.view.addChildView(viewController.view);
			viewController.doStartup();
			viewController.viewWillEnter();
			viewController.viewDidEnter();

			this.view.fade('show');

			this.window.position();

		} else {

			this.window.disableUserInput();

			var transition = viewControllerTransition || viewController.getTransition();
			if (transition && typeOf(transition) == 'class') {
				transition = Class.instanciate(transition);
			}
			
			this.view.addChildView(viewController.view);
			viewController.setTransition(transition);
			viewController.doStartup();
			viewController.viewWillEnter();

			this.viewControllers.getLast(1).viewWillLeave();

			if (transition) {
				transition.startup(viewController, this);
				transition.chain(this.bound('onPushTransitionCompleted'));
				transition.prepare('enter');
				transition.execute('enter');
			} else {
				this.onPushTransitionCompleted();
			}
		}

		this.topViewController = viewController;

		return this;
	},

	onPushTransitionCompleted: function() {
		this.viewControllers.getLast()
			.viewDidEnter();
		this.viewControllers.getLast(1)
			.viewDidLeave();

		this.window.enableUserInput();

		return this;
	},

	popViewController: function() {
		if (this.viewControllers.length) {
			this.viewControllers.getLast(1).viewWillEnter();
			this.viewControllers.getLast(0).viewWillLeave();

			this.window.disableUserInput();

			var transition = this.viewControllers.getLast().getTransition();
			if (transition) {
				transition.chain(this.bound('onPopTransitionCompleted'));
				transition.prepare('leave');
				transition.execute('leave');
			} else {
				this.onPopTransitionCompleted();
			}

			this.topViewController = this.viewControllers.getLast(1);
		}
		return this;
	},

	onPopTransitionCompleted: function() {
		this.viewControllers.getLast(1)
			.viewDidEnter();
		this.viewControllers.getLast()
			.viewDidLeave();
		this.viewControllers.pop()
			.viewDidRemove()
			.doShutdown();

		this.window.enableUserInput();
		
		return this;
	},

	getViewControllers: function() {
		return this.viewControllers;
	},

	getViewControllerAt: function(offset) {
		return this.viewControllers.getLast(offset);
	},

	getTopViewController: function() {
		return this.topViewController;
	},

	orientationDidChange: function(orientation) {
		this.viewControllers.each(function(viewController) { viewController.orientationDidChange(orientation) });
		return this.parent();
	},

	/* Prevent default behavior */

	viewWillEnter: function() {
		return this;
	},

	viewDidEnter: function() {
		return this;
	}

});

/*
---

name: ViewControllerStack.Navigation

description: Provide navigation function to the view controller stack such as
             a navigation bar and navigation bar buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerStack

provides:
	- ViewControllerStack.Navigation

...
*/

Moobile.ViewControllerStack.Navigation = new Class({

	Extends: Moobile.ViewControllerStack,

	loadView: function(view) {
		this.view = view || new Moobile.ViewStack.Navigation(new Element('div'));
	},

	pushViewController: function(viewController, viewControllerTransition) {

		var navigationBar = new Moobile.UI.Bar.Navigation();

		viewController.view.addChildControl(navigationBar, 'top');

		if (this.viewControllers.length > 0) {
			var backButtonTitle = this.viewControllers[this.viewControllers.length - 1].getTitle();
			if (backButtonTitle) {
				var navigationBackButton = new Moobile.UI.BarButton();
				navigationBackButton.setStyle(Moobile.UI.BarButtonStyle.Back);
				navigationBackButton.setText(backButtonTitle);
				navigationBackButton.addEvent(Event.CLICK, this.bound('onBackButtonClick'));
				navigationBar.setLeftButton(navigationBackButton);
			}
		}

		var navigationBarTitle = viewController.getTitle();
		if (navigationBarTitle) {
			navigationBar.setTitle(navigationBarTitle);
		}

		viewController.navigationBar = viewController.view.navigationBar = navigationBar;

		return this.parent(viewController, viewControllerTransition);
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});

/*
---

name: ViewControllerTransition

description: Provides the base class for view controller transition effects.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- ViewControllerTransition

...
*/

Moobile.ViewControllerTransition = new Class({

	Implements: [Chain, Class.Binds],
	
	running: false,

	viewController: null,

	viewControllerStack: null,

	startup: function(viewController, viewControllerStack) {
		this.viewController = viewController;
		this.viewControllerStack = viewControllerStack;
		this.attachEvents();
		return this;
	},

	attachEvents: function() {
		return this;
	},

	detachEvents: function() {
		return this;
	},

	prepare: function(direction) {
		return this.setup(direction);
	},

	execute: function(direction) {
		if (this.running == false) {
			this.running = true;
			this.attachEvents();
			this.start.delay(5, this, direction);
		}
		return this;
	},

	setup: function(direction) {
		return this;
	},

	start: function(direction) {
		return this.complete();
	},

	complete: function() {
		if (this.running == true) {
			this.running = false;
			this.detachEvents();
			this.callChain();
		}
		return this;
	}

});

/*
---

name: ViewControllerTransition.Slide

description: Provide a slide view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewControllerTransition

provides:
	- ViewControllerTransition.Slide

...
*/

Moobile.ViewControllerTransition.Slide = new Class({

	Extends: Moobile.ViewControllerTransition,

	wrapper: null,

	startup: function(viewController, viewControllerStack) {
		this.wrapper = viewControllerStack.view.getContent();
		return this.parent(viewController, viewControllerStack);
	},

	attachEvents: function() {
		this.wrapper.addEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	detachEvents: function() {
		this.wrapper.removeEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	setup: function(direction) {

		if (direction == 'enter') {
			this.wrapper.addClass('transition-slide');
			this.wrapper.addClass('transition-slide-enter');
			this.viewControllerStack.getViewControllerAt(0).view.addClass('transition-slide-element-to-enter');
			this.viewControllerStack.getViewControllerAt(1).view.addClass('transition-slide-element-to-leave');
			return this;
		}

		if (direction == 'leave') {
			this.wrapper.addClass('transition-slide');
			this.wrapper.addClass('transition-slide-leave');
			this.viewControllerStack.getViewControllerAt(0).view.addClass('transition-slide-element-to-leave');
			this.viewControllerStack.getViewControllerAt(1).view.addClass('transition-slide-element-to-enter');
			return this;
		}

		throw new Error('Unsupported direction');

		return this;
	},

	start: function(direction) {
		this.wrapper.addClass('commit-transition');
		return this;
	},

	onTransitionComplete: function(e) {
		if (this.running && e.target == this.wrapper) {
			this.wrapper.removeClass('transition-slide');
			this.wrapper.removeClass('transition-slide-enter');
			this.wrapper.removeClass('transition-slide-leave');
			this.wrapper.removeClass('commit-transition');
			this.viewControllerStack.getViewControllerAt(0).view
				.removeClass('transition-slide-element-to-leave')
				.removeClass('transition-slide-element-to-enter');
			this.viewControllerStack.getViewControllerAt(1).view
				.removeClass('transition-slide-element-to-leave')
				.removeClass('transition-slide-element-to-enter');
			this.complete();
		}
		return this;
	}

});

/*
---

name: ViewControllerTransition.Cubic

description: Provide a cubic view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewControllerTransition

provides:
	- ViewControllerTransition.Cubic

...
*/

Moobile.ViewControllerTransition.Cubic = new Class({

	Extends: Moobile.ViewControllerTransition,

	wrapper: null,

	startup: function(viewController, viewControllerStack) {
		this.wrapper = viewControllerStack.view.getContent();
		return this.parent(viewController, viewControllerStack);
	},

	attachEvents: function() {
		this.wrapper.addEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	detachEvents: function() {
		this.wrapper.removeEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	setup: function(direction) {

		this.viewControllerStack.view.addClass('transition-cubic-viewport');

		if (direction == 'enter') {
			this.wrapper.addClass('transition-cubic');
			this.wrapper.addClass('transition-cubic-enter');
			this.viewControllerStack.getViewControllerAt(0).view.addClass('cubic-face-enter');
			this.viewControllerStack.getViewControllerAt(1).view.addClass('cubic-face-leave');
			return this;
		}

		if (direction == 'leave') {
			this.wrapper.addClass('transition-cubic');
			this.wrapper.addClass('transition-cubic-leave');
			this.viewControllerStack.getViewControllerAt(0).view.addClass('cubic-face-leave');
			this.viewControllerStack.getViewControllerAt(1).view.addClass('cubic-face-enter');
			return this;
		}

		throw new Error('Unsupported direction');

		return this;
	},

	start: function(direction) {
		this.wrapper.addClass('commit-transition');
		return this;
	},

	onTransitionComplete: function(e) {
		if (this.running && e.target == this.wrapper) {
			this.wrapper.removeClass('transition-cubic');
			this.wrapper.removeClass('transition-cubic-enter');
			this.wrapper.removeClass('transition-cubic-leave');
			this.wrapper.removeClass('commit-transition');
			this.viewControllerStack.view.removeClass('transition-cubic-viewport');
			this.viewControllerStack.getViewControllerAt(0).view
				.removeClass('cubic-face-enter')
				.removeClass('cubic-face-leave');
			this.viewControllerStack.getViewControllerAt(1).view
				.removeClass('cubic-face-enter')
				.removeClass('cubic-face-leave');
			this.complete();
		}
		return this;
	}

});

/*
---

name: ViewControllerTransition.Fade

description: Provide a fade-in fade-out view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewControllerTransition

provides:
	- ViewControllerTransition.Fade

...
*/

Moobile.ViewControllerTransition.Fade = new Class({

	Extends: Moobile.ViewControllerTransition,

	element: null,

	startup: function(viewController, viewControllerStack) {
		this.element = viewControllerStack.getViewControllerAt(1).view.getElement();
		return this.parent(viewController, viewControllerStack);
	},

	attachEvents: function() {
		this.element.addEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	setup: function(direction) {

		if (direction == 'enter') {
			this.element.addClass('transition-fade');
			this.element.addClass('transition-fade-enter');
			return this;
		}

		if (direction == 'leave') {
			this.element.addClass('transition-fade');
			this.element.addClass('transition-fade-leave');
			return this;
		}

		throw new Error('Unsupported direction');

		return this;
	},

	start: function(direction) {
		this.element.addClass('commit-transition');
		return this;
	},

	onTransitionComplete: function(e) {
		if (this.running && e.target == this.element) {
			this.element.removeClass('transition-fade');
			this.element.removeClass('transition-fade-enter');
			this.element.removeClass('transition-fade-leave');
			this.element.removeClass('commit-transition');
			this.complete();
		}
		return this;
	}

});

/*
---

name: Window

description: Provides the area where the views will be stored and displayed.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View

provides:
	- Window

...
*/

Moobile.Window = new Class({

	Static: {
		PORTRAIT: 2,
		LANDSCAPE: 3
	},

	Extends: Moobile.View,

	viewController: null,

	userInputEnabled: true,

	userInputMask: null,

	options: {
		className: 'window'
	},

	setup: function() {
		this.options.wrapper = false;
		this.options.content = false;
		return this.parent();
	},

	attachEvents: function() {
		document.body.addEvent(Event.ORIENTATION_CHANGE, this.bound('onOrientationChange'));
		return this.parent();
	},

	detachEvents: function() {
		document.body.removeEvent(Event.ORIENTATION_CHANGE, this.bound('onOrientationChange'));
		return this;
	},

	setViewController: function(viewController) {
		this.viewController = viewController;
		this.addChildView(this.viewController.view);
		this.viewController.view.setParentView(null);
		this.viewController.view.setWindow(this);
		this.viewController.doStartup();
		this.viewController.viewWillEnter();
		this.viewController.viewDidEnter();
		return this;
	},

	getViewController: function() {
		return this.viewController;
	},

	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return Moobile.Window.PORTRAIT;
			case 90: return Moobile.Window.LANDSCAPE;
		}
	},

	enableUserInput: function() {
		if (this.userInputEnabled == false) {
			this.userInputEnabled = true;
			this.destroyUserInputMask();
		}
		return this;
	},

	disableUserInput: function() {
		if (this.userInputEnabled == true) {
			this.userInputEnabled = false;
			this.injectUserInputMask();
		}
	},

	isUserInputEnabled: function() {
		return this.userInputEnabled;
	},

	injectUserInputMask: function() {
		this.userInputMask = new Element('div.' + this.options.className + '-mask');
		this.userInputMask.inject(this.element);
		return this;
	},

	destroyUserInputMask: function() {
		this.userInputMask.destroy();
		this.userInputMask = null;
		return this;
	},

	position: function() {
		var fn = function() { window.scrollTo(0, 0) };
		fn.delay(100);
		return this;
	},

	onOrientationChange: function(e) {
		this.viewController.orientationDidChange(this.getOrientation());
		this.position();
		return this;
	}

});
