/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
var m = Math,
	dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

	// Style properties
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})(),

	nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),

	// Helpers
	translateZ = has3d ? ' translateZ(0)' : '',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental
			handleClick: true,

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform && that.options.useTransform;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together!
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			translateZ = '';
		}
		
		// Set some default styles
		that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
		that.scroller.style[transitionDuration] = '0';
		that.scroller.style[transformOrigin] = '0 0';
		if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			if (that.options.wheelAction != 'none') {
				that._bind('DOMMouseScroll');
				that._bind('mousewheel');
			}
		}

		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			case TRNEND_EV: that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
			if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

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
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
	},
	
	_pos: function (x, y) {
		if (this.zoomed) return;

		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
		} else {
			x = m.round(x);
			y = m.round(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
				y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind(TRNEND_EV);
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV, window);
		that._bind(END_EV, window);
		that._bind(CANCEL_EV, window);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

			that.lastScale = scale / this.scale;

			newX = this.originX - this.originX * that.lastScale + this.x,
			newY = this.originY - this.originY * that.lastScale + this.y;

			this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

			if (that.options.onZoom) that.options.onZoom.call(that, e);
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) {
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length !== 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			
			that.scroller.style[transitionDuration] = '200ms';
			that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
			
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else if (this.options.handleClick) {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = doc.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true;
							target.dispatchEvent(ev);
						}
					}, that.options.zoom ? 250 : 0);
				}
			}

			that._resetPos(400);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}

			that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}
		
		if (that.options.wheelAction == 'zoom') {
			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			if (deltaScale != that.scale) {
				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				that.wheelZoomCount++;
				
				that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				setTimeout(function() {
					that.wheelZoomCount--;
					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				}, 400);
			}
			
			return;
		}
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
		if (that.maxScrollY < 0) {
			that.scrollTo(deltaX, deltaY, 0);
		}
	},
	
	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind(TRNEND_EV);
		
		that._startAni();
	},


	/**
	*
	* Utilities
	*
	*/
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		
		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind(TRNEND_EV);
			else that._resetPos(0);
			return;
		}

		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[transitionDuration] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: m.round(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = m.round(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	*
	* Public methods
	*
	*/
	destroy: function () {
		var that = this;

		that.scroller.style[transform] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);
		
		if (!that.options.hasTouch) {
			that._unbind('DOMMouseScroll');
			that._unbind('mousewheel');
		}
		
		if (that.options.useTransition) that._unbind(TRNEND_EV);
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[transitionDuration] = '0';
			that._resetPos(400);
		}
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? 400 : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV, window);
		this._unbind(END_EV, window);
		this._unbind(CANCEL_EV, window);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind(TRNEND_EV);
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		that.scroller.style[transitionDuration] = time + 'ms';
		that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

dummyStyle = null;	// for the sake of it

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})(window, document);


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

name: EventFirer

description: Provides the base class for Moobile objects.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Class-Extras/Class.Binds

provides:
	- EventFirer

...
*/

if (!window.Moobile) window.Moobile = {};

(function() {

var fireEvent = Events.prototype.fireEvent;

/**
 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.EventFirer = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#fireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	fireEvent: function(type, args, delay) {

		args = Array.from(args).include(this);

		if (!this.shouldFireEvent(type, args))
			return this;

		this.willFireEvent(type, args);
		fireEvent.call(this, type, args, delay);
		this.didFireEvent(type, args);

		return this;
	},

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#shouldFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	shouldFireEvent: function(type, args) {
		return true;
	},

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#willFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willFireEvent: function(type, args) {

	},

	/**
	 * @see http://moobilejs.com/doc/latest/EventFirer/EventFirer#didFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didFireEvent: function(type, args) {

	}

});

})();

/*
---

name: Animation

description: Provides a wrapper for a CSS animation.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventFirer

provides:
	- Animation

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @see    http://moobilejs.com/doc/0.1/Animation/Animation
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Animation = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_running: false,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	element: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#animationClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	animationClass: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#animationProperties
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	animationProperties: {
		'name': null,
		'duration': null,
		'iteration-count': null,
		'animation-direction': null,
		'animation-timing-function': null,
		'animation-fill-mode': null,
		'animation-delay': null
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(element, options) {
		this.setElement(element);
		this.setOptions(options);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setName: function(name) {
		this._name = name;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setElement: function(element) {
		this.element = document.id(element);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElement: function() {
		return this.element;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationClass: function(value) {
		this.animationClass = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationClass: function() {
		return this.animationClass;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationName: function(value) {
		this.animationProperties['name'] = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationName: function() {
		return this.animationProperties['name'];
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationDuration
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationDuration: function(value) {
		this.animationProperties['duration'] = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationDuration
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationDuration: function() {
		return this.animationProperties['duration'];
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationIterationCount
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationIterationCount: function(value) {
		this.animationProperties['iteration-count'] = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationIterationCount
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationIterationCount: function() {
		return this.animationProperties['iteration-count'];
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationDirection
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationDirection: function(value) {
		this.animationProperties['direction'] = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationDirection
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationDirection: function() {
		return this.animationProperties['direction'];
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationTimingFunction
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationTimingFunction: function(value) {
		this.animationProperties['timing-function'] = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationTimingFunction
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationTimingFunction: function() {
		return this.animationProperties['timing-function'];
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationFillMode
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationFillMode: function(value) {
		this.animationProperties['fill-mode'] = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationFillMode
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationFillMode: function() {
		return this.animationProperties['fill-mode'];
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#setAnimationDelay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationDelay: function(value) {
		this.animationProperties['delay'] = value;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getAnimationDelay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationDelay: function() {
		return this.animationProperties['delay'];
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	attach: function() {

		this.element.addEvent('ownanimationend', this.bound('onAnimationEnd'));
		this.element.addClass(this.animationClass);

		Object.each(this.animationProperties, function(val, key) {
			this.element.setStyle('animation-' + key, val);
		}, this);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	detach: function() {

		this.element.removeEvent('ownanimationend', this.bound('onAnimationEnd'));
		this.element.removeClass(this.animationClass);

		Object.each(this.animationProperties, function(val, key) {
			this.element.setStyle('animation-' + key, null);
		}, this);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#start
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	start: function() {

		if (this._running)
			return this;

		this._running = true;
		this.fireEvent('start');
		this.attach();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#stop
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	stop: function() {

		if (this._running === false)
			return this;

		this._running = false;
		this.fireEvent('stop');
		this.detach();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#isRunning
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isRunning: function() {
		return this._running;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onAnimationEnd: function(e) {

		if (this._running === false)
			return;

		if (this.element !== e.target)
			return;

		e.stop();

		this._running = false;
		this.fireEvent('end');
		this.detach();
	}

});

/*
---

name: Browser.Mobile

description: Provides useful information about the browser environment

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Browser]

provides: Browser.Mobile

...
*/

(function(){

Browser.Device = {
	name: 'other'
};

if (Browser.Platform.ios){
	var device = navigator.userAgent.toLowerCase().match(/(ip(ad|od|hone))/)[0];
	
	Browser.Device[device] = true;
	Browser.Device.name = device;
}

if (this.devicePixelRatio == 2)
	Browser.hasHighResolution = true;

Browser.isMobile = !['mac', 'linux', 'win'].contains(Browser.Platform.name);

}).call(this);


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

// Android doesn't have a touch delay and dispatchEvent does not fire the handler
Browser.Features.iOSTouch = (function(){
	var name = 'cantouch', // Name does not matter
		html = document.html,
		hasTouch = false;

	if (!html.addEventListener) return false;

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

name: Browser.Platform

description: Provides extra indication about the current platform.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Browser
	- Mobile/Browser.Mobile
	- Mobile/Browser.Features.Touch

provides:
	- Browser.Platform

...
*/

Browser.Platform.cordova = (window.Phonegap || window.Cordova || window.cordova) && Browser.isMobile && !Browser.safari;


/*
---

name: Class.Instantiate

description:

license: MIT-style license.

requires:
	- Core/Class

provides:
	- Class.Parse
	- Class.Instantiate

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Class/Class
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Class.extend({

	/**
	 * @see    http://moobilejs.com/doc/latest/Class/Class.Instantiate#parse
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parse: function(name) {
		name = name.trim();
		name = name.split('.');
		var func = window;
		for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
		return typeof func === 'function' ? func : null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Class/Class.Instantiate#instantiate
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	instantiate: function(klass) {
		if (typeof klass === 'string') klass = Class.parse(klass);
		if (klass === null) return null;
		klass.$prototyping = true;
		var instance = new klass;
		delete klass.$prototyping;
		var params = Array.prototype.slice.call(arguments, 1);
		if (instance.initialize) instance.initialize.apply(instance, params);
		return instance;
	}

});


/*
---

name: Element

description: Provides extra methods to the Element prototype.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element

...
*/


(function() {

var adopt = Element.prototype.adopt;

Element.implement({

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#ingest
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	ingest: function(element) {
		return this.adopt(document.id(element).childNodes);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#adopt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	adopt: function() {
		if (arguments.length === 1) {
			var arg = arguments[0];
			if (typeof arg === 'string') {
				var args = Elements.from(arg);
				if (args.length) {
					return adopt.apply(this, args);
				}
			}
		}
		return adopt.apply(this, arguments);
	}

});

})();

/*
---

name: Element.From

description:

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Element

provides:
	- Element.From
	- Element.At

...
*/

(function() {

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element.From#Element-from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Element.from = function(text) {

	switch (typeof text) {
		case 'object': return document.id(text);
		case 'string':
			var element = document.createElement('div');
			element.innerHTML = text;
			return element.childNodes[0] || null;
	}

	return null;
};

var elements = {};

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element.From#Element-at
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Element.at = function(path, async, fn) {

	var element = elements[path];
	if (element) {
		var clone = element.clone(true, true);
		if (fn) fn(clone);
		return clone;
	}

	async = async || false;

	new Moobile.Request({
		method: 'get',
		async: async,
		url: path
	}).addEvent('success', function(response) {
		element = Element.from(response);
		if (fn) fn(element.clone(true, true));
	}).addEvent('failure', function(request) {
		if (fn) fn(null);
	}).send();

	if (element) elements[path] = element;

	return !async ? element.clone(true, true) : null;
};

})();

/*
---

name: Element.Role

description: Provides extra methods to the Element prototype.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Element

provides:
	- Element.Role

...
*/

(function() {

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element.Role#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @eduted 0.2.0
 * @since  0.1.0
 * @deprecated 0.2.0
 */
Element.defineRole = function(name, context, behavior) {

	console.log("[DEPRECATION NOTICE] Element.defineRole will be removed in version 0.3.");

	context = (context || Element).prototype;
	if (context.__roles__ === undefined) {
		context.__roles__ = {};
	}

	if (behavior instanceof Function) {
		behavior = {behavior: behavior};
	}

	context.__roles__[name] = Object.append({traversable: false}, behavior);
};

Element.implement({

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#setRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 */
	 setRole: function(role) {
	 	return this.set('data-role', role);
	 },

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 getRole: function(role) {
	 	return this.get('data-role');
	 },

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRoleDefinition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	 getRoleDefinition: function(context) {
	 	console.log("[DEPRECATION NOTICE] Element.getRoleDefinition will be removed in version 0.3.");
	 	return (context || this).__roles__
	 	     ? (context || this).__roles__[this.getRole()]
	 	     : null;
	 },

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	getRoleElement: function(role) {
		console.log("[DEPRECATION NOTICE] Element.getRoleElement will be removed in version 0.3.");
		return this.getRoleElements(role)[0] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#getRoleElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	getRoleElements: function(role) {

		console.log("[DEPRECATION NOTICE] Element.getRoleElements will be removed in version 0.3.");

		var validate = this.ownsRoleElement.bind(this);
		var selector = role
		             ? '[data-role=' + role + ']'
		             : '[data-role]';

		return this.getElements(selector).filter(validate);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#ownsRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	ownsRoleElement: function(element) {

		console.log("[DEPRECATION NOTICE] Element.ownsRoleElement will be removed in version 0.3.");

		var parent = element.parentNode;
		if (parent) {

			if (parent === this)
				return true;

			if (parent.get('data-role'))
				return false;

			return this.ownsRoleElement(parent);
		}

		return false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Element/Element#executeDefinedRoles
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
 	 * @deprecated 0.2.0
	 */
	executeDefinedRoles: function(context) {

		console.log("[DEPRECATION NOTICE] Element.executeDefinedRoles will be removed in version 0.3.");

		context = context || this;

		this.getRoleElements().each(function(element) {
			var role = element.getRoleDefinition(context);
			if (role) {
				var func = role.behavior;
				if (func instanceof Function) {
					func.call(context, element);
				}
				if (role.traversable) {
					element.executeDefinedRoles(context);
				}
			} else {
				throw new Error('Role ' + element.getRole() + ' is undefined');
			}
		}, this);

		return this;
	}

});

})();

/*
---

name: Component

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Element
	- Element.From
	- Element.Role
	- EventFirer

provides:
	- Component

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.1
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Component = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_built: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_ready: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_window: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_children: [],

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_visible: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_display: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_style: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_events: {
		listeners: {},
		callbacks: {}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	element: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#initialization
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	initialize: function(element, options, name) {

		this.element = Element.from(element);
		if (this.element === null) {
			this.element = document.createElement(this.options.tagName);
		}

		this._name = name || this.element.get('data-name');

		options = options || {};

		for (var option in this.options) {
			if (options[option] === undefined) {
				var value = this.element.get('data-option-' + option.hyphenate());
				if (value !== null) {
					try { value = JSON.parse(value) } catch (e) {}
					options[option] = value;
				}
			}
		}

		this.setOptions(options);

		var marker = this.element;
		var exists = document.contains(this.element);
		if (exists) this.element = this.element.clone(true, true);

		this._willBuild();
		this._build();
		this._didBuild();

		if (exists) this.element.replaces(marker);

		this.element.store('moobile:component', this);

		this._built = true;

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	_build: function() {

		var owner = this;
		var roles = this.__roles__;
		var attrs = this.__attributes__;

		for (var key in attrs) {
			var value = this.element.get(key);
			if (value !== null) {
				var handler = attrs[key];
				if (handler instanceof Function) {
					handler.call(this, value);
				}
			}
		}

		var className = this.options.className;
		if (className) this.addClass(className);

		var styleName = this.options.styleName
		if (styleName) this.setStyle(styleName);

		this.getRoleElements().each(function(element) {
			var handler = roles[element.getRole()].handler;
			if (handler instanceof Function) {
				handler.call(owner, element);
			}
		});

		// <0.2-compat>
		if (this.build) {
			this.build.call(this);
			console.log('[DEPRECATION NOTICE] The method "build" will be removed in 0.5, use the "_build" method instead');
		}
		// </0.2-compat>
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willBuild: function() {
		this.willBuild();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didBuild: function() {
		this.didBuild();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addEvent: function(type, fn, internal) {

		var name = type.split(':')[0];

		if (this.eventIsNative(name)) {

			var self = this;
			var listeners = this._events.listeners;
			var callbacks = this._events.callbacks;
			if (callbacks[name] === undefined) {
				callbacks[name] = [];
				listeners[name] = function(e) {
					self.fireEvent(name, e);
				};
			}

			callbacks[name].include(fn);

			if (callbacks[name].length === 1) this.element.addEvent(name, listeners[name]);
		}

		return this.parent(type, fn, internal);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeEvent: function(type, fn) {

		if (Moobile.Component.hasNativeEvent(type) && this.eventIsNative(type)) {
			var listeners = this._events.listeners;
			var callbacks = this._events.callbacks;
			if (callbacks[type] && callbacks[type].contains(fn)) {
				callbacks[type].erase(fn);
				if (callbacks[type].length === 0) {
					this.element.removeEvent(type, listeners[type]);
					delete listeners[type];
					delete callbacks[type];
				}
			}
		}

		return this.parent(type, fn);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#eventIsNative
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	eventIsNative: function(name) {
		return Moobile.Component.hasNativeEvent(name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponent: function(component, where) {
		return this._addChildComponent(component, null, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentInside: function(component, context, where) {
		return this._addChildComponent(component,  document.id(context) || this.getElement(context), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentAfter: function(component, after) {
		return this._addChildComponent(component, after, 'after');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentBefore: function(component, before) {
		return this._addChildComponent(component, before, 'before');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	_addChildComponent: function(component, context, where) {

		component.removeFromParentComponent();

		this._willAddChildComponent(component);

		if (context) {
			context = document.id(context) || this.element.getElement(context);
		} else {
			context = this.element;
		}

		var found = this.hasElement(component);
		if (found === false || where) {
			document.id(component).inject(context, where);
		}

		this._children.splice(this._getChildComponentIndexForElement(component) || 0, 0, component);
		component.setParentComponent(this);
		component.setWindow(this._window);
		this._didAddChildComponent(component);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willAddChildComponent: function(component) {
		this.willAddChildComponent(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didAddChildComponent: function(component) {
		this.didAddChildComponent(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponent: function(name) {
		return this._children.find(function(child) { return child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentOfType: function(type, name) {

		var types = Array.from(type);

		var by = function(child) {
			return types.some(function(type) {
				return child instanceof type && child.getName() === name;
			});
		};

		return this._children.find(by);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentOfTypeAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentOfTypeAt: function(type, index) {
		return this.getChildComponentsOfType(type)[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentIndex: function(component) {
		return this._children.indexOf(component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_getChildComponentIndexForElement: function(element) {

		element = document.id(element);

		var index = -1;
		var nodes = this.element.querySelectorAll('*');
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node === element) {
				return index + 1;
			} else {
				var component = node.retrieve('moobile:component');
				if (component) {
					var value = this.getChildComponentIndex(component);
					if (index < value) {
						index = value;
					}
				}
			}
		}

		return null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponents: function() {
		return this._children;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	getChildComponentsOfType: function(type) {

		var types = Array.from(type);

		var by = function(child) {
			return types.some(function(type) {
				return child instanceof type;
			});
		};

		return this._children.filter(by);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildComponent: function(component) {
		return this._children.contains(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildComponentOfType: function(type) {
		return this._children.some(function(child) { return child instanceof type; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getDescendantComponent
	 * @author Tin LE GALL (imbibinebe@gmail.com)
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.1
	 */
	getDescendantComponent: function(name) {

	    var component = this.getChildComponent(name);
	    if (component === null) {
			for (var i = 0, len = this._children.length; i < len; i++) {
				var found = this._children[i].getDescendantComponent(name);
				if (found) return found;
			}
		}

	    return component;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#replaceChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	replaceChildComponent: function(component, replacement, destroy) {
		this.addChildComponentBefore(replacement, component).removeChildComponent(component, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#replaceWithComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	replaceWithComponent: function(component, destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.replaceChildComponent(this, component, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	removeChildComponent: function(component, destroy) {

		if (this.hasChildComponent(component) === false)
			return this;

		this._willRemoveChildComponent(component);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this._children.erase(component);

		component.setParentComponent(null);
		component.setWindow(null);
		component.setReady(false);

		this._didRemoveChildComponent(component);

		if (destroy) {
			component.destroy();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildComponents: function(destroy) {
		return this.removeAllChildComponentsOfType(Moobile.Component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildComponentsOfType: function(type, destroy) {

		this._children.filter(function(child) {
			return child instanceof type;
		}).invoke('removeFromParentComponent', destroy);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeFromParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeFromParentComponent: function(destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.removeChildComponent(this, destroy);
		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willRemoveChildComponent: function(component) {
		this.willRemoveChildComponent(component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didRemoveChildComponent: function(component) {
		this.didRemoveChildComponent(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	setParentComponent: function(parent) {

		if (this._parent === parent)
			return this;

		this._parentComponentWillChange(parent);
		this._parent = parent;
		this._parentComponentDidChange(parent);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_parentComponentWillChange: function(parent) {
		this.parentComponentWillChange(parent);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_parentComponentDidChange: function(parent) {

		if (parent) {
			if (this._display) {
				this._visible = this._isVisible();
			}
		} else {
			this._visible = this._display;
		}

		this.parentComponentDidChange(parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentComponent: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasParentComponent: function() {
		return !!this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	setWindow: function(window) {

		if (this._window === window)
			return this;

		this._windowWillChange(window);
		this._window = window;
		this._windowDidChange(window);

		this._children.invoke('setWindow', window);

		if (this._window) {
			this.setReady(true);
		}

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_windowWillChange: function(window) {
		this.windowWillChange(window);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_windowDidChange: function(window) {
		this.windowDidChange(window);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWindow: function() {
		return this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasWindow: function() {
		return !!this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	setReady: function(ready) {

		if (this._ready === ready)
			return this;

		this._ready = ready;

		if (this._ready) {
			this._didBecomeReady();
		}

		this._children.invoke('setReady', ready);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isReady: function() {
		return this._ready;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setStyle: function(name) {

		if (this._style) {
			this._style.detach.call(this, this.element);
			this._style = null;
		}

		var style = Moobile.Component.getStyle(name, this);
		if (style) {
			style.attach.call(this, this.element);
		}

		this._style = style;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getStyle: function() {
		return this._style ? this._style.name : null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hasStyle: function(name) {
		return this._style ? this._style.name === name : false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#toggleClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	toggleClass: function(name, force) {
		this.element.toggleClass(name, force);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hasClass: function(name) {
		return this.element.hasClass(name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getElements: function(selector) {
		return this.element.getElements(selector || '*');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	getRoleElement: function(name) {
		return this.getRoleElements(name, 1)[0] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getRoleElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	getRoleElements: function(name, limit) {

		var roles = this.__roles__;
		var found = [];

		var walk = function(element) {

			if (limit && limit <= found.length)
				return;

			var nodes = element.childNodes;
			for (var i = 0, len = nodes.length; i < len; i++) {

				var node = nodes[i];
				if (node.nodeType !== 1)
					continue;

				var role = node.getRole();
				if (role === null) {
					walk(node);
					continue;
				}

				var behavior = roles[role];
				if (behavior) {

					if (name === role || !name) found.push(node);

					if (behavior.options.traversable) {
						walk(node);
						continue;
					}
				}
			}
		};

		walk(this.element);

		return found;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	setSize: function(x, y) {
		if (x > 0 || x === null) this.element.setStyle('width', x);
		if (y > 0 || y === null) this.element.setStyle('height', y);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getPosition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getPosition: function(relative) {
		return this.element.getPosition(document.id(relative) || this._parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#show
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	show: function() {

		if (this._display === true ||
			this._visible === true)
			return this;

		this._display = true;

		this._willShow();
		this.removeClass('hidden');
		this._didShow();

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willShow: function() {

		if (this._display === false ||
			this._visible === true)
			return;

		this.willShow();

		this._children.invoke('_willShow');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didShow: function() {

		if (this._display === false ||
			this._visible === true)
			return;

		this._visible = true;
		this.didShow();
		this.fireEvent('show');

		this._children.invoke('_didShow');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	hide: function() {

		if (this._display === false)
			return this;

		this._willHide();
		this.addClass('hidden');
		this._didHide();

		this._display = false;

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_willHide: function() {

		if (this._display === false ||
			this._visible === false)
			return;

		this.willHide();

		this._children.invoke('_willHide');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didHide: function() {

		if (this._display === false ||
			this._visible === false)
			return;

		this._visible = false;
		this.didHide();
		this.fireEvent('hide');

		this._children.invoke('_didHide');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isVisible
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isVisible: function() {
		return this._visible;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_isVisible: function() {

		if (this._display) {

			return this._parent
			     ? this._parent._isVisible()
			     : true;
		}

		return false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {

	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	_didBecomeReady: function() {
		this.didBecomeReady();
		this.fireEvent('ready');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#parentComponentWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentComponentWillChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#parentComponentDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentComponentDidChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#windowWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	windowWillChange: function(window) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#windowDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	windowDidChange: function(window) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	destroy: function() {

		this.removeAllChildComponents(true);
		this.removeFromParentComponent();
		this.element.destroy();
		this.element = null;
		this._window = null;
		this._parent = null;

		return this;
	},

	toElement: function() {
		return this.element;
	},

	// <0.1-compat>

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChild: function() {
		console.log('[DEPRECATION NOTICE] The method "addChild" will be removed in 0.3, use the method "addChildComponent" instead');
		return this.addChildComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildInside: function() {
		console.log('[DEPRECATION NOTICE] The method "addChildInside" will be removed in 0.3, use the method "addChildComponentInside" instead');
		return this.addChildComponentInside.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildAfter: function() {
		console.log('[DEPRECATION NOTICE] The method "addChildAfter" will be removed in 0.3, use the method "addChildComponentAfter" instead');
		return this.addChildComponentAfter.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildBefore: function() {
		console.log('[DEPRECATION NOTICE] The method "addChildBefore" will be removed in 0.3, use the method "addChildComponentBefore" instead');
		return this.addChildComponentBefore.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChild: function() {
		console.log('[DEPRECATION NOTICE] The method "getChild" will be removed in 0.3, use the method "getChildComponent" instead');
		return this.getChildComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildOfType: function() {
		console.log('[DEPRECATION NOTICE] The method "getChildOfType" will be removed in 0.3, use the method "getChildComponentOfType" instead');
		return this.getChildComponentOfType.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildAt: function() {
		console.log('[DEPRECATION NOTICE] The method "getChildAt" will be removed in 0.3, use the method "getChildComponentAt" instead');
		return this.getChildComponentAt.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildOfTypeAt: function() {
		console.log('[DEPRECATION NOTICE] The method "getChildOfTypeAt" will be removed in 0.3, use the method "getChildComponentOfTypeAt" instead');
		return this.getChildComponentOfTypeAt.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildIndex: function() {
		console.log('[DEPRECATION NOTICE] The method "getChildIndex" will be removed in 0.3, use the method "getChildComponentIndex" instead');
		return this.getChildComponentIndex.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildren: function() {
		console.log('[DEPRECATION NOTICE] The method "getChildren" will be removed in 0.3, use the method "getChildComponents" instead');
		return this.getChildComponents.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildrenOfType: function() {
		console.log('[DEPRECATION NOTICE] The method "getChildrenOfType" will be removed in 0.3, use the method "getChildComponentsOfType" instead');
		return this.getChildComponentsOfType.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChild: function() {
		console.log('[DEPRECATION NOTICE] The method "hasChild" will be removed in 0.3, use the method "hasChildComponent" instead');
		return this.hasChildComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildOfType: function() {
		console.log('[DEPRECATION NOTICE] The method "hasChildOfType" will be removed in 0.3, use the method "hasChildComponentOfType" instead');
		return this.hasChildComponentOfType.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	replaceChild: function() {
		console.log('[DEPRECATION NOTICE] The method "replaceChild" will be removed in 0.3, use the method "replaceChildComponent" instead');
		return this.replaceChildComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	replaceWith: function() {
		console.log('[DEPRECATION NOTICE] The method "replaceWith" will be removed in 0.3, use the method "replaceWithComponent" instead');
		return this.replaceWithComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeChild: function() {
		console.log('[DEPRECATION NOTICE] The method "removeChild" will be removed in 0.3, use the method "removeChildComponent" instead');
		return this.removeChildComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeChildren: function() {
		console.log('[DEPRECATION NOTICE] The method "removeChildren" will be removed in 0.3, use the method "removeAllChildComponents" instead');
		return this.removeAllChildComponents.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeChildrenOfType: function() {
		console.log('[DEPRECATION NOTICE] The method "removeChildrenOfType" will be removed in 0.3, use the method "removeAllChildComponentsOfType" instead');
		return this.removeAllChildComponentsOfType.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeFromParent: function() {
		console.log('[DEPRECATION NOTICE] The method "removeFromParent" will be removed in 0.3, use the method "removeFromParentComponent" instead');
		return this.removeFromParentComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParent: function() {
		console.log('[DEPRECATION NOTICE] The method "setParent" will be removed in 0.3, use the method "setParentComponent" instead');
		return this.setParentComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParent: function() {
		console.log('[DEPRECATION NOTICE] The method "getParent" will be removed in 0.3, use the method "getParentComponent" instead');
		return this.getParentComponent.apply(this, arguments);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasParent: function() {
		console.log('[DEPRECATION NOTICE] The method "hasParent" will be removed in 0.3, use the "hasParentComponent" instead');
		return this.hasParentComponent.apply(this, arguments);
	}

	// </0.1-compat>

});

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Component.defineRole = function(name, context, options, handler) {

	context = (context || Moobile.Component).prototype;
	if (context.__roles__ === undefined) {
	 	context.__roles__ = {};
	}

	if (options) {

		switch (typeof options) {

			case 'function':
				handler = options;
				options = {};
				break;

			case 'object':
				if (typeof options.behavior === 'function') handler = options.behavior;
				break;
		}
	}

	context.__roles__[name] = {
		handler: handler || function() {},
		options: options || {}
	};
};


/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineAttribute
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Component.defineAttribute = function(name, context, handler) {
	context = (context || Moobile.Component).prototype;
	if (context.__attributes__ === undefined) {
		context.__attributes__ = {};
	}
	context.__attributes__[name] = handler;
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineStyle
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Component.defineStyle = function(name, target, handler) {
	var context = (target || Moobile.Component).prototype;
	if (context.__styles__ === undefined) {
		context.__styles__ = {};
	}
	context.__styles__[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, handler);
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#getRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.getStyle = function(name, target) {
	return target.__styles__
		 ? target.__styles__[name]
		 : null;
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#create
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.create = function(klass, element, descriptor, options, name) {

	element = Element.from(element);

	if (descriptor) {
		var subclass = element.get(descriptor);
		if (subclass) {
			var instance = Class.instantiate(subclass, element, options, name);
			if (instance instanceof klass) {
				return instance;
			}
		}
	}

	return new klass(element, options, name);
};

(function() {

// TODO: Also add native events to Element.NativeEvent when using addNativeEvent

var events = Object.keys(Element.NativeEvents);

Moobile.Component.addNativeEvent = function(name) {
	events.include(name);
};

Moobile.Component.hasNativeEvent = function(name) {
	return events.contains(name);
};

Moobile.Component.removeNativeEvent = function(name) {
	events.erase(name);
};

Moobile.Component.addNativeEvent('tapstart');
Moobile.Component.addNativeEvent('tapmove');
Moobile.Component.addNativeEvent('tapend');
Moobile.Component.addNativeEvent('tap');
Moobile.Component.addNativeEvent('pinch');
Moobile.Component.addNativeEvent('swipe');
Moobile.Component.addNativeEvent('animationend');
Moobile.Component.addNativeEvent('transitionend');
Moobile.Component.addNativeEvent('owntransitionend');
Moobile.Component.addNativeEvent('ownanimationend');

})();

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Component.defineAttribute('data-style', null, function(value) {
	this.options.styleName = value;
});


/*
---

name: Control

description: Provides the base class for controls.

license: MIT-style license.

requires:
	- Component

provides:
	- Control

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Control
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Control = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_state: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		className: null,
		styleName: null
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_setState: function(state, value) {

		if (this._state === state)
			return this;

		if (this.shouldAllowState(state) || state == null) {
			this.willChangeState(state)
			if (this._state) this.removeClass('is-' + this._state);
			this._state = state;
			if (this._state) this.addClass('is-' + this._state);
			this.didChangeState(state)
		}

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_getState: function() {
		return this._state;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#shouldAllowState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	shouldAllowState: function(state) {
		return ['highlighted', 'selected', 'disabled'].contains(state);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#setDisabled
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDisabled: function(disabled) {
		return this._setState(disabled !== false ? 'disabled' : null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#isDisabled
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isDisabled: function() {
		return this._getState() == 'disabled';
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#setSelected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelected: function(selected) {
		return this._setState(selected !== false ? 'selected' : null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#isSelected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelected: function() {
		return this._getState() == 'selected';
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#setHighlighted
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setHighlighted: function(highlighted) {
		return this._setState(highlighted !== false ? 'highlighted' : null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#isHighlighted
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isHighlighted: function() {
		return this._getState() == 'highlighted';
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#willChangeState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willChangeState: function(state) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Control#didChangeState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didChangeState: function(state) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	shouldFireEvent: function(type, args) {
		return !this.isDisabled();
	}

});


/*
---

name: Button

description: Provides a Button control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Button

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Button
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Button = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_label: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Button#hitAreaElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	hitAreaElement: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('button');

		var label = this.getRoleElement('label');
		if (label === null) {
			label = document.createElement('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		this.addEvent('tapstart', this.bound('_onTapStart'));
		this.addEvent('tapend', this.bound('_onTapEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	didBuild: function() {
		this.parent();
		this.hitAreaElement = new Element('div.hit-area');
		this.hitAreaElement.inject(this.element);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.removeEvent('tapstart', this.bound('_onTapStart'));
		this.removeEvent('tapend', this.bound('_onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Button#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		label = Moobile.Text.from(label);

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('button-label');
		this.toggleClass('button-label-empty', this._label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Button#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTapStart: function(e) {
		if (!this.isSelected()) this.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTapEnd: function(e) {
		if (!this.isSelected()) this.setHighlighted(false);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/Button#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Button.from = function(source) {
	if (source instanceof Moobile.Button) return source;
	var button = new Moobile.Button();
	button.setLabel(source);
	return button;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('button', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Button, element, 'data-button'));
});

Moobile.Component.defineRole('label', Moobile.Button, null, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Active Style - iOS */
Moobile.Component.defineStyle('active', Moobile.Button, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

/* Warning Style - iOS */
Moobile.Component.defineStyle('warning', Moobile.Button, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

/* Back Style - iOS Android */
Moobile.Component.defineStyle('back', Moobile.Button, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

/* Forward Style - iOS Android */
Moobile.Component.defineStyle('forward', Moobile.Button, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});



/*
---

name: ButtonGroup

description: Provides a control that groups button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ButtonGroup

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ButtonGroup = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectedButton: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectedButtonIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		layout: 'horizontal',
		selectable: true,
		selectedButtonIndex: -1
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('button-group');

		var layout = this.options.layout;
		if (layout) {
			this.addClass('button-group-layout-' + layout);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBuild: function() {
		this.parent();
		this.setSelectable(this.options.selectable);
		this.setSelectedButtonIndex(this.options.selectedButtonIndex);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._selectedButton = null;
		this._selectedButtonIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#setSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setSelectedButton: function(selectedButton) {

		if (this._selectable === false)
			return this;

		if (this._selectedButton === selectedButton)
			return this;

		if (this._selectedButton) {
			this._selectedButton.setSelected(false);
			this.fireEvent('deselect', this._selectedButton);
			this._selectedButton = null;
		}

		this._selectedButtonIndex = selectedButton ? this.getChildComponentIndex(selectedButton) : -1;

		if (selectedButton) {
			this._selectedButton = selectedButton;
			this._selectedButton.setSelected(true);
			this.fireEvent('select', this._selectedButton);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#getSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButton: function() {
		return this._selectedButton;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#setSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedButtonIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentOfTypeAt(Moobile.Button, index);
		}

		return this.setSelectedButton(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#getSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButtonIndex: function() {
		return this._selectedButtonIndex;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#clearSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedButton: function() {
		this.setSelectedButton(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button, where) {
		return this.addChildComponent(Moobile.Button.from(button), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(Moobile.Button.from(button), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(Moobile.Button.from(button), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButtons: function() {
		return this.getChildComponentsOfType(Moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponentsOfType(Moobile.Button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setSelectable: function(selectable) {
		this._selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isSelectable: function() {
		return this._selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this._selectedButton === component) {
			this.clearSelectedButton();
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.addEvent('tap', this.bound('onButtonTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.removeEvent('tap', this.bound('onButtonTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	didChangeState: function(state) {
		this.parent(state)
		if (state === 'disabled' || state == null) {
			this.getChildComponents().invoke('setDisabled', state);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onButtonTap: function(e, sender) {
		this.setSelectedButton(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('button-group', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ButtonGroup, element, 'data-button-group'));
});



/*
---

name: Bar

description: Provides a control that displays a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Bar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Bar = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_item: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('bar');

		var item = this.getRoleElement('item');
		if (item === null) {
			item = document.createElement('div');
			item.ingest(this.element);
			item.inject(this.element);
			item.setRole('item');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._item = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Bar#setItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setItem: function(item) {

		if (this._item === item)
			return this;

		if (this._item) {
			this._item.replaceWithComponent(item, true);
		} else {
			this.addChildComponent(item);
		}

		this._item = item;
		this._item.addClass('bar-item');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Bar#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function() {
		return this._item;
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Bar, element, 'data-bar'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Dark Style - iOS - Android */
Moobile.Component.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

/* Light Style - iOS - Android */
Moobile.Component.defineStyle('light', Moobile.Bar, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});


/*
---

name: BarItem

description: Provides a control that represents the content of a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarItem

...
*/

 /**
 * @see    http://moobilejs.com/doc/latest/Control/BarItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.BarItem = new Class({

	Extends: Moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('bar-item');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.Bar, null, function(element) {
	this.setItem(Moobile.Component.create(Moobile.BarItem, element, 'data-item'));
});


/*
---

name: NavigationBar

description: Provides a bar control used to navigate between views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar

provides:
	- NavigationBar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('navigation-bar');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('navigation-bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.NavigationBar, element, 'data-navigation-bar'));
});


/*
---

name: NavigationBarItem

description: Provides the navigation bar item that contains the title and
             buttons at the left and right of it.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- BarItem

provides:
	- NavigationBarItem

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.NavigationBarItem = new Class({

	Extends: Moobile.BarItem,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_title: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('navigation-bar-item');

		var title = this.getRoleElement('title');
		if (title === null) {
			title = document.createElement('div');
			title.ingest(this.element);
			title.inject(this.element);
			title.setRole('title');
		}

		var wrapper = document.createElement('div');
		wrapper.addClass('bar-title-wrapper');
		wrapper.wraps(title);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._title = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		title = Moobile.Text.from(title);

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponent(title);
		}

		this._title = title;
		this._title.addClass('bar-title');
		this.toggleClass('bar-title-empty', this._title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#addLeftButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addLeftButton: function(button) {
		return this.addChildComponent(button, 'top');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#addRightButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addRightButton: function(button) {
		return this.addChildComponent(button, 'bottom');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBarItem#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponents(Moobile.Button, destroy);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.NavigationBar, null, function(element) {
	this.setItem(Moobile.Component.create(Moobile.NavigationBarItem, element, 'data-item'));
});

Moobile.Component.defineRole('title', Moobile.NavigationBarItem, null, function(element) {
	this.setTitle(Moobile.Component.create(Moobile.Text, element, 'data-title'));
});


/*
---

name: Slider

description: Provides a slider control with a knob.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- More/Class.Refactor
	- More/Slider
	- Control

provides:
	- Slider

...
*/


/*
---

name: Scale

description:

license:

authors:
	- Jean-Philippe Dery (jean-philippe.dery@lemieuxbedard.com)

requires:
	- Init

provides:
	- Scale

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Slider
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Slider = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchOffsetX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchOffsetY: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchInitialThumbX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchInitialThumbY: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_position: {x: -1, y: -1},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_value: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_minimum: 0,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_maximum: 0,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_valueRange: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_trackRange: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_trackLimit: {min: 0, max: 0},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#trackElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	trackElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#thumbElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	thumbElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#rangeElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	rangeElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#valueElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	valueElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#hitAreaElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hitAreaElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		mode: 'horizontal',
		snap: false,
		value: 0,
		minimum: 0,
		maximum: 100
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('slider');

		this.trackElement = document.createElement('div');
		this.trackElement.addClass('slider-track');
		this.trackElement.inject(this.element);

		this.thumbElement = document.createElement('div')
		this.thumbElement.addClass('slider-thumb');
		this.thumbElement.inject(this.trackElement);

		this.rangeElement = document.createElement('div');
		this.rangeElement.addClass('slider-range');
		this.rangeElement.inject(this.trackElement);

		this.valueElement = document.createElement('div');
		this.valueElement.addClass('slider-value');
		this.valueElement.inject(this.rangeElement);

		this.hitAreaElement = new Element('div.hit-area').inject(this.thumbElement);

		// <0.1 compat>
		if ('min' in this.options || 'max' in this.options) {
			console.log('[DEPRECATION NOTICE] The options "min" and "max" will be removed in 0.4, use the "minimum" and "maximum" options instead');
			if ('min' in this.options) this.options.minimum = this.options.min;
			if ('max' in this.options) this.options.maximum = this.options.max;
		}
		// </0.1 compat>

		var mode = this.options.mode;
		if (mode) {
			this.addClass('slider-mode-' + mode);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.element.addEvent('touchstart', this.bound('_onTouchStart'));
		this.element.addEvent('touchmove', this.bound('_onTouchMove'));
		this.element.addEvent('touchend', this.bound('_onTouchEnd'));

		this.thumbElement.addEvent('touchcancel', this.bound('_onThumbTouchCancel'));
		this.thumbElement.addEvent('touchstart', this.bound('_onThumbTouchStart'));
		this.thumbElement.addEvent('touchmove', this.bound('_onThumbTouchMove'));
		this.thumbElement.addEvent('touchend', this.bound('_onThumbTouchEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBecomeReady: function() {
		this.parent();
		this.refresh();
		this.setMinimum(this.options.minimum);
		this.setMaximum(this.options.maximum);
		this.setValue(this.options.value);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.element.removeEvent('touchstart', this.bound('_onTouchStart'));
		this.element.removeEvent('touchmove', this.bound('_onTouchMove'));
		this.element.removeEvent('touchend', this.bound('_onTouchEnd'));

		this.thumbElement.removeEvent('touchcancel', this.bound('_onThumbTouchCancel'));
		this.thumbElement.removeEvent('touchstart', this.bound('_onThumbTouchStart'));
		this.thumbElement.removeEvent('touchmove', this.bound('_onThumbTouchMove'));
		this.thumbElement.removeEvent('touchend', this.bound('_onThumbTouchEnd'));

		this.thumbElement = null;
		this.trackElement = null;
		this.valueElement = null;
		this.rangeElement = null;

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setValue: function(value) {
		var pos = this._positionFromValue(value);
		this._move(pos.x, pos.y);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getValue: function() {
		return this._value;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setMinimum: function(minimum) {
		if (this._value < minimum) this.setValue(minimum);
		this._minimum = minimum;
		this.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#getMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getMinimum: function() {
		return this._minimum;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setMaximum: function(maximum) {
		if (this._value > maximum) this.setValue(maximum);
		this._maximum = maximum;
		this.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getMaximum: function() {
		return this._maximum;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {

		var trackSize = this.trackElement.getSize();
		var thumbSize = this.thumbElement.getSize();

		var range = 0;

		switch (this.options.mode) {
			case 'horizontal':
				range = trackSize.x - thumbSize.x;
				break;
			case 'vertical':
				range = trackSize.y - thumbSize.y;
				break;
		}


		this._valueRange = this._maximum - this._minimum;
		this._trackRange = range;
		this._trackLimit = {
			min: 0,
			max: range
		};

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_move: function(x, y) {

		switch (this.options.mode) {
			case 'horizontal':
				y = 0;
				if (x < this._trackLimit.min) x = this._trackLimit.min;
				if (x > this._trackLimit.max) x = this._trackLimit.max;
				break;
			case 'vertical':
				x = 0;
				if (y < this._trackLimit.min) y = this._trackLimit.min;
				if (y > this._trackLimit.max) y = this._trackLimit.max;
				break;
		}

		var value = this._valueFromPosition(x, y);

		if (this.options.snap) {
			value = value.round();
			var pos = this._positionFromValue(value);
			x = pos.x;
			y = pos.y;
		}

		if (this._position.x === x &&
			this._position.y === y) {
			return this;
		}

		this._value = value;

		this._position.x = x;
		this._position.y = y;
		this.thumbElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
		this.valueElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

		this.fireEvent('change', value);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_valueFromPosition: function(x, y) {
		return (this.options.mode === 'horizontal' ? x : y) * this._valueRange / this._trackRange + this._minimum;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_positionFromValue: function(value) {

		var x = 0;
		var y = 0;

		var pos = (value - this._minimum) * this._trackRange / this._valueRange;

		switch (this.options.mode) {
			case 'horizontal': x = pos.round(2); break;
			case 'vertical':   y = pos.round(2); break;
		}

		return {x: x, y: y};
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchStart: function(e) {
		e.stop();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchMove: function(e) {
		e.stop();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {
		e.stop();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchCancel: function(e) {
		this._activeTouch = null;
		this._activeTouchOffsetX = null;
		this._activeTouchOffsetY = null;
		this._activeTouchInitialThumbX = null;
		this._activeTouchInitialThumbY = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchStart: function(e) {
		var touch = e.changedTouches[0];
		if (this._activeTouch === null) {
			this._activeTouch = touch
			this._activeTouchOffsetX = touch.pageX;
			this._activeTouchOffsetY = touch.pageY;
			this._activeTouchInitialThumbX = this._position.x;
			this._activeTouchInitialThumbY = this._position.y;
			this._bounds = {
				min: 0,
				max: this._trackRange
			};
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchMove: function(e) {
		var touch = e.changedTouches[0];
		if (this._activeTouch.identifier === touch.identifier) {
			var x = touch.pageX - this._activeTouchOffsetX + this._activeTouchInitialThumbX;
			var y = touch.pageY - this._activeTouchOffsetY + this._activeTouchInitialThumbY;
			this._move(x, y);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchEnd: function(e) {
		if (this._activeTouch.identifier === e.changedTouches[0].identifier) {
			this._activeTouch = null;
			this._activeTouchOffsetX = null;
			this._activeTouchOffsetY = null;
			this._activeTouchInitialThumbX = null;
			this._activeTouchInitialThumbY = null;
		}
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('slider', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Slider, element, 'data-slider'));
});


/*
---

name: List

description: Provides a control that handles a list of items.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- List

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/List
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.List = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectable: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectedItem: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectedItemIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'ul',
		selectable: true,
		selectedItemIndex: -1
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('list');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {
		this.parent();
		this.setSelectable(this.options.selectable);
		this.setSelectedItemIndex(this.options.selectedItemIndex);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._selectedItem = null;
		this._selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#setSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItem: function(selectedItem) {

		if (this._selectable == false)
			return this;

		if (this._selectedItem === selectedItem)
			return this;

		if (this._selectedItem) {
			this._selectedItem.setSelected(false);
			this.fireEvent('deselect', this._selectedItem);
			this._selectedItem = null;
		}

		this._selectedItemIndex = selectedItem ? this.getChildComponentIndex(selectedItem) : -1;

		if (selectedItem) {
			this._selectedItem = selectedItem;
			this._selectedItem.setSelected(true);
			this.fireEvent('select', this._selectedItem);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItem: function() {
		return this._selectedItem;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#setSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItemIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentOfTypeAt(Moobile.ListItem, index);
		}

		return this.setSelectedItem(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItemIndex: function() {
		return this._selectedItemIndex
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#clearSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#addItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItem: function(item, where) {
		return this.addChildComponent(Moobile.ListItem.from(item), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#addItemAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemAfter: function(item, after) {
		return this.addChildComponentAfter(Moobile.ListItem.from(item), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#addItemBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemBefore: function(item, before) {
		return this.addChildComponentBefore(Moobile.ListItem.from(item), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function(name) {
		return this.getChildComponentOfType(Moobile.ListItem, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItemAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.ListItem, index)
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemIndex: function(item) {
		return this.getChildComponentIndex(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItems: function() {
		return this.getChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#removeItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeItem: function(item) {
		return this.removeChildComponent(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#removeAllItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllItems: function() {
		return this.removeAllChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(selectable) {
		this._selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this._selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {

		this.parent(component);

		if (component instanceof Moobile.ListItem) {
			component.addEvent('tapstart', this.bound('_onItemTapStart'));
			component.addEvent('tapend', this.bound('_onItemTapEnd'));
			component.addEvent('tap', this.bound('_onItemTap'));
		}

		var components = this.getChildComponents();
		for (var i = 0; i < components.length; i++) {
			var prev = components[i - 1];
			var next = components[i + 1];
			var curr = components[i];
			if (curr.hasStyle('header')) {
				if (next) next.addClass('list-section-header');
				if (prev) prev.addClass('list-section-footer');
			} else {
				if (next && next.hasStyle('header') ||
					prev && prev.hasStyle('header')) {
					continue;
				}
				curr.removeClass('list-section-header');
				curr.removeClass('list-section-footer');
			}
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this._selectedItem === component) {
			this.clearSelectedItem();
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(component) {
		this.parent(component);
		if (component instanceof Moobile.ListItem) {
			component.removeEvent('tapstart', this.bound('_onItemTapStart'));
			component.removeEvent('tapend', this.bound('_onItemTapEnd'));
			component.removeEvent('tap', this.bound('_onItemTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didChangeState: function(state) {
		this.parent(state)
		if (state === 'disabled' || state == null) {
			this.getChildComponents().invoke('setDisabled', state);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onItemTapStart: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onItemTapEnd: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onItemTap: function(e, sender) {
		if (this._selectable) this.setSelectedItem(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('list', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.List, element, 'data-list'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('grouped', Moobile.List, {
	attach: function(element) { element.addClass('style-grouped'); },
	detach: function(element) { element.removeClass('style-grouped'); }
});


/*
---

name: ListItem

description: Provides a list item control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ListItem

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/ListItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ListItem = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_detail: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'li'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('list-item');

		var image  = this.getRoleElement('image');
		var label  = this.getRoleElement('label');
		var detail = this.getRoleElement('detail');

		if (label === null) {
			label = document.createElement('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		if (image === null) {
			image = document.createElement('img');
			image.inject(this.element, 'top');
			image.setRole('image');
		}

		if (detail === null) {
			detail = document.createElement('div');
			detail.inject(this.element);
			detail.setRole('detail');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._label = null;
		this._image = null;
		this._detail = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		label = Moobile.Text.from(label);

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('list-item-label');
		this.toggleClass('list-item-label-empty', this._label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this._image === image)
			return this;

		image = Moobile.Image.from(image);

		if (this._image) {
			this._image.replaceWithComponent(image, true);
		} else {
			this.addChildComponent(image);
		}

		this._image = image;
		this._image.addClass('list-item-image');
		this.toggleClass('list-item-image-empty', this._image.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setDetail: function(detail) {

		if (this._detail === detail)
			return this;

		detail = Moobile.Text.from(detail);

		if (this._detail) {
			this._detail.replaceWithComponent(detail, true);
		} else {
			this.addChildComponent(detail);
		}

		this._detail = detail;
		this._detail.addClass('list-item-detail');
		this.toggleClass('list-item-detail-empty', this._detail.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#getDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getDetail: function() {
		return this._detail;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	shouldAllowState: function(state) {

		if (this.hasStyle('header') && (state === 'highlighted' || state === 'selected' || state === 'disabled')) {
			return false;
		}

		return this.parent(state);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/ListItem#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.ListItem.from = function(source) {
	if (source instanceof Moobile.ListItem) return source;
	var item = new Moobile.ListItem();
	item.setLabel(source);
	return item;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.List, null, function(element) {
	this.addItem(Moobile.Component.create(Moobile.ListItem, element, 'data-item'));
});

Moobile.Component.defineRole('header', Moobile.List, null, function(element) {
	this.addItem(Moobile.Component.create(Moobile.ListItem, element, 'data-item').setStyle('header'));
});

Moobile.Component.defineRole('image', Moobile.ListItem, null, function(element) {
	this.setImage(Moobile.Component.create(Moobile.Image, element, 'data-image'));
});

Moobile.Component.defineRole('label', Moobile.ListItem, null, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});

Moobile.Component.defineRole('detail', Moobile.ListItem, null, function(element) {
	this.setDetail(Moobile.Component.create(Moobile.Text, element, 'data-detail'));
});

// <0.1-compat>
/**
 * @deprecated
 */
Moobile.Component.defineRole('list-item', Moobile.List, null, function(element) {
	console.log('[DEPRECATION NOTICE] The role "list-item" will be removed in 0.4, use the role "item" instead');
	this.addItem(Moobile.Component.create(Moobile.ListItem, element, 'data-list-item'));
});
// </0.1-compat>

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Header Style - iOS Android */
Moobile.Component.defineStyle('header', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-header'); },
	detach: function(element) { element.removeClass('style-header'); }
});

/* Checked Style - iOS */
Moobile.Component.defineStyle('checked', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

/* Disclosed Style - iOS */
Moobile.Component.defineStyle('disclosed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

/* Detailed Style - iOS */
Moobile.Component.defineStyle('detailed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-detailed'); },
	detach: function(element) { element.removeClass('style-detailed'); }
});


/*
---

name: ActivityIndicator

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ActivityIndicator

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/ActivityIndicator
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ActivityIndicator = new Class({

	Extends: Moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('activity-indicator');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ActivityIndicator#start
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	start: function() {
		return this.addClass('active');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ActivityIndicator#stop
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	stop: function() {
		return this.removeClass('active');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('activity-indicator', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ActivityIndicator, element, 'data-activity-indicator'));
});


/*
---

name: Image

description: Provides a control that display an image.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Image

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Image
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Image = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_source: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_loaded: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_originalSize: {
		x: 0,
		y: 0
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'img',
		preload: false
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.hide();
		this.addClass('image');

		var source = this.element.get('src');
		if (source) {
			this.setSource(source);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		if (this._image) {
			this._image.removeEvent('load', this.bound('_onLoad'));
			this._image.src = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
			this._image = null;
		}

		this.element.set('src', 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

		this.parent();
	},


	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#setSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSource: function(source) {

		this._source = source || '';

		if (this._image) {
			this._image.removeEvent('load', this.bound('_onLoad'));
			this._image = null;
		}

		if (source) {
			if (this.options.preload) {
				this._loaded = false;
				this._image = new Image();
				this._image.src = source;
				this._image.addEvent('load', this.bound('_onLoad'));
			} else {
				this._load();
			}
		} else {
			this._unload();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#getSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSource: function() {
		return this._source;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#getOriginalSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getOriginalSize: function() {
		return this._originalSize;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#isLoaded
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isLoaded: function() {
		return this._loaded;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#isEmpty
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isEmpty: function() {
		return !this.getSource();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	show: function() {
		return this.isEmpty() ? this : this.parent();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_load: function() {

		this._loaded = true;

		if (this.options.preload) {
			this._originalSize.x = this._image.width;
			this._originalSize.y = this._image.height;
		}

		this.element.set('src', this._source);
		this.show();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_unload: function() {

		this._loaded = false;

		if (this.options.preload) {
			this._originalSize.x = 0;
			this._originalSize.y = 0;
		}

		this.element.erase('src');
		this.fireEvent('unload');
		this.hide();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onLoad: function() {
		this.fireEvent('preload');
		this._load();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/Image#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Image.from = function(source) {
	if (source instanceof Moobile.Image) return source;
	var image = new Moobile.Image();
	image.setSource(source);
	return image;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('image', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Image, element, 'data-image'));
});

/*
---

name: Text

description: Provides the base class for managing text.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Text

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Text
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Text = new Class({

	Extends: Moobile.Control,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'span'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('text');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#setText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setText: function(text) {
		this.element.set('html',  text instanceof Moobile.Text ? text.getText() : (text || typeof text === 'number' ? text + '' : ''));
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#getText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getText: function() {
		return this.element.get('html');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#isEmpty
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isEmpty: function() {
		return !this.getText();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/Text#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Text.from = function(source) {
	if (source instanceof Moobile.Text) return source;
	var text = new Moobile.Text();
	text.setText(source);
	return text;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('text', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Text, element, 'data-text'));
});


/*
---

name: Alert

description: Provides a control that displays a modal alert message.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Component

provides:
	- Alert

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Dialog/Alert
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Alert = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_message: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_buttons: [],

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#boxElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	boxElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#headerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	headerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#footerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	footerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#overlay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	overlay: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		layout: 'horizontal'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('alert');
		this.addEvent('animationend', this.bound('_onAnimationEnd'));

		this.overlay = new Moobile.Overlay();
		this.overlay.hide();
		this.addChildComponent(this.overlay);

		this.headerElement = document.createElement('div');
		this.headerElement.addClass('alert-header');

		this.footerElement = document.createElement('div');
		this.footerElement.addClass('alert-footer');

		this.contentElement = document.createElement('div');
		this.contentElement.addClass('alert-content');

		this.boxElement = document.createElement('div');
		this.boxElement.addClass('alert-box');
		this.boxElement.grab(this.headerElement);
		this.boxElement.grab(this.contentElement);
		this.boxElement.grab(this.footerElement);

		this.element.grab(this.boxElement);

		var layout = this.options.layout;
		if (layout) {
			this.addClass('alert-layout-' + layout);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {
		this.parent();
		this.setTitle('');
		this.setMessage('');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.removeEvent('animationend', this.bound('_onAnimationEnd'));

		this._title = null;
		this._message = null;

		this.boxElement = null;
		this.headerElement = null;
		this.footerElement = null;
		this.contentElement = null;

		this.overlay.destroy();
		this.overlay = null;

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		title = Moobile.Text.from(title);

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.headerElement);
		}

		this._title = title;
		this._title.addClass('alert-title');
		this.toggleClass('alert-title-empty', this._title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setMessage: function(message) {

		if (this._message === message)
			return this;

		message = Moobile.Text.from(message);

		if (this._message) {
			this._message.replaceWithComponent(message, true);
		} else {
			this.addChildComponentInside(message, this.contentElement);
		}

		this._message = message;
		this._message.addClass('alert-message');
		this.toggleClass('alert-message-empty', this._message.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getMessage: function() {
		return this._message;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button, where) {
		return this.addChildComponentInside(Moobile.Button.from(button), this.footerElement, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(Moobile.Button.from(button), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(Moobile.Button.from(button), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtons: function() {
		return this.getChildComponentsOfType(Moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponentsOfType(Moobile.Button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setDefaultButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDefaultButton: function(button) {
		if (this.hasChildComponent(button)) button.addClass('is-default');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setDefaultButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDefaultButtonIndex: function(index) {
		return this.setDefaultButton(this.getChildComponentOfTypeAt(Moobile.Button, index));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#showAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.element.addClass('show-animated').removeClass('hidden');
		this.overlay.showAnimated();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#hideAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		this.overlay.hideAnimated();
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {
		this.parent(component);
		if (component instanceof Moobile.Button) {
			component.addEvent('tap', this.bound('_onButtonTap'));
			this._buttons.include(component);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(component) {
		this.parent(component);
		if (component instanceof Moobile.Button) {
			component.removeEvent('tap', this.bound('_onButtonTap'));
			this._buttons.erase(component);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willShow: function() {

		this.parent();

		if (this.getParentView() === null) {
			var instance = Moobile.Window.getCurrentInstance();
			if (instance) {
				instance.addChildComponent(this);
			}
		}

		if (this._buttons.length === 0) this.addButton('OK');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didHide: function() {
		this.parent();
		this.removeFromParentComponent();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onButtonTap: function(e, sender) {

		var index = this.getChildComponentsOfType(Moobile.Button).indexOf(sender);
		if (index >= 0) {
			this.fireEvent('dismiss', [sender, index]);
		}

		this.hideAnimated();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onAnimationEnd: function(e) {

		e.stop();

		if (this.hasClass('show-animated')) {
			this.removeClass('show-animated');
			this.didShow();
		}

		if (this.hasClass('hide-animated')) {
			this.addClass('hidden').removeClass('hide-animated');
			this.didHide();
		}
	}

});


/*
---

name: Element.Style.Vendor

description: Automatically adds vendor prefix to styles

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element
	- Core/Element.Event

provides:
	- Element.Style.Vendor

...
*/

(function() {

var setStyle = Element.prototype.setStyle;
var getStyle = Element.prototype.getStyle;

var prefixes = ['Khtml', 'O', 'Ms', 'Moz', 'Webkit'];

var cache = {};

Element.implement({

	getPrefixed: function(property) {

		property = property.camelCase();

		if (property in this.style)
			return property;

		if (cache[property] !== undefined)
			return cache[property];

		var suffix = property.charAt(0).toUpperCase() + property.slice(1);

		for (var i = 0; i < prefixes.length; i++) {
			var prefixed = prefixes[i] + suffix;
			if (prefixed in this.style) {
				cache[property] = prefixed;
				break
			}
		}

		if (cache[property] === undefined)
			cache[property] = property;

		return cache[property];
	},

	setStyle: function (property, value) {
		return setStyle.call(this, this.getPrefixed(property), value);
	},

	getStyle: function (property) {
		return getStyle.call(this, this.getPrefixed(property));
	}

});

})();


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

name: Event.Ready

description: Provides an event that indicates the app is loaded. This event is
             based on the domready event or other third party events such as
             deviceready on phonegap.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Core/DOMReady
	- Custom-Event/Element.defineCustomEvent
	- Browser.Platform

provides:
	- Event.Ready

...
*/

(function() {

	var onReady = function() {
		window.fireEvent('ready');
	};

	Element.defineCustomEvent('ready', {

		onSetup: function() {

			if (Browser.Platform.cordova) {
				document.addEventListener('deviceready', onReady);
				return;
			}

			window.addEvent('domready', onReady);
		},

		onTeardown: function() {

			if (Browser.Platform.cordova) {
				document.removeEventListener('deviceready', onReady);
				return;
			}

			window.removeEvent('domready', onReady);
		}

	});

	// simulator hook
	window.addEvent('ready', function() {
		if (parent &&
			parent.fireEvent) {
			parent.fireEvent('appready');
		}
	});

})();


/*
---

name: Event.CSS3

description: Provides CSS3 events.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Custom-Event/Element.defineCustomEvent

provides:
	- Event.CSS3

...
*/

(function() {

var prefix = '';
if (Browser.safari || Browser.chrome || Browser.Platform.ios) {
	prefix = 'webkit';
} else if (Browser.firefox) {
	prefix = 'Moz';
} else if (Browser.opera) {
	prefix = 'o';
} else if (Browser.ie) {
	prefix = 'ms';
}

Element.NativeEvents[prefix + 'TransitionEnd'] = 2;
Element.Events['transitionend'] = { base: (prefix + 'TransitionEnd'), onAdd: function(){}, onRemove: function(){} };

Element.NativeEvents[prefix + 'AnimationEnd'] = 2;
Element.Events['animationend'] = { base: (prefix + 'AnimationEnd'), onAdd: function(){}, onRemove: function(){} };

Element.defineCustomEvent('owntransitionend', {
	base: 'transitionend',
	condition: function(e) {
		e.stop();
		return e.target === this;
	}
});

Element.defineCustomEvent('ownanimationend', {
	base: 'animationend',
	condition: function(e) {
		e.stop();
		return e.target === this;
	}
})

})();


/*
---

name: Event.Mouse

description: Correctly translate mouse events to touch events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Event.Mouse

...
*/

if (!Browser.Features.Touch) (function() {

var target = null;
var uniqid = null;

var redispatch = function(e) {

	if (e.fake)
		return;

	var faked = document.createEvent('MouseEvent');
	faked.fake = true;
	faked.initMouseEvent(
		e.type, true, true, window, 0,
    	e.screenX, e.screenY,
    	e.clientX, e.clientY,
    	false, false, false, false, 0, null);

	target.dispatchEvent(faked);
};

var onDocumentMouseDown = function(e) {
	if (target === null) {
		target = e.target;
		uniqid = e.event.timeStamp;
		redispatch(e.event);
	}
};

var onDocumentMouseMove = function(e) {
	if (target) redispatch(e.event);
};

var onDocumentMouseUp = function(e) {
	if (target) {
		redispatch(e.event);
		target = null
		uniqid = null;
	}
};

document.addEvent('mousedown', onDocumentMouseDown);
document.addEvent('mousemove', onDocumentMouseMove);
document.addEvent('mouseup', onDocumentMouseUp);

var condition = function(e) {

	var touch = {
		identifier: uniqid,
		target: target,
		pageX: e.page.x,
		pageY: e.page.y,
		clientX: e.client.x,
		clientY: e.client.y
	};

	e.touches = e.targetTouches = e.changedTouches = [touch];

	if (e.event.fake) {
		return true;
	}

	return false;
};

Element.defineCustomEvent('touchstart', {
	base: 'mousedown',
	condition: condition
});

Element.defineCustomEvent('touchmove', {
	base: 'mousemove',
	condition: condition
});

Element.defineCustomEvent('touchend', {
	base: 'mouseup',
	condition: condition
});

})();

/*
---

name: Event.Tap

description: Provides tap, tapstart, tapmove, tapend events. Tap events use only
             one touch.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Mobile/Browser.Features.Touch
	- Event.Mouse

provides:
	- Event.Tap

...
*/

(function(){

var tapStartX = 0;
var tapStartY = 0;

var tapMaxX = 0;
var tapMinX = 0;
var tapMaxY = 0;
var tapMinY = 0;

var tapValid = true;

var onTapTouchStart = function(e) {

	if (e.changedTouches.length > 1) {
		tapValid = false;
		return;
	}

	tapValid = true;

	tapStartX = e.changedTouches[0].clientX;
	tapStartY = e.changedTouches[0].clientY;

	tapMaxX = tapStartX + 10;
	tapMinX = tapStartX - 10;
	tapMaxY = tapStartY + 10;
	tapMinY = tapStartY - 10;
};

var onTapTouchMove = function(e) {

	if (e.changedTouches.length > 1) {
		tapValid = false;
		return;
	}

	if (tapValid) {

		var x = e.changedTouches[0].clientX;
		var y = e.changedTouches[0].clientY;

		tapValid = !(x > tapMaxX || x < tapMinX || y > tapMaxY || y < tapMinY);

	} else {
		this.fireEvent('tapend', e);
	}
};

Element.defineCustomEvent('tap', {

	base: 'touchend',

	condition: function(e) {
		return tapValid;
	},

	onSetup: function() {
		this.addEvent('touchstart', onTapTouchStart);
		this.addEvent('touchmove', onTapTouchMove);
	},

	onTeardown: function() {
		this.removeEvent('touchstart', onTapTouchStart);
		this.removeEvent('touchmove', onTapTouchMove);
	}

});

Element.defineCustomEvent('tapstart', {

	base: 'touchstart',

	condition: function(e) {
		return e.changedTouches.length === 1;
	}

});

Element.defineCustomEvent('tapmove', {

	base: 'touchmove',

	condition: function(e) {
		return e.changedTouches.length === 1;
	}

});

Element.defineCustomEvent('tapend', {

	base: 'touchend',

	condition: function(e) {
		return e.changedTouches.length === 1;
	}

});

})();


/*
---

name: Event.Touch

description: Provides several touch events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Mobile/Browser.Features.Touch
	- Event.Mouse

provides:
	- Event.Touch

...
*/

if (Browser.Features.Touch) (function() {

// fixes stuff that still uses mouse events such as Drag.Move

delete Element.NativeEvents['mousedown'];
delete Element.NativeEvents['mousemove'];
delete Element.NativeEvents['mouseup'];

Element.defineCustomEvent('mousedown', {
	base: 'touchstart',
}).defineCustomEvent('mousemove', {
	base: 'touchmove'
}).defineCustomEvent('mouseup', {
	base: 'touchend',
});

})();


/*
---

name: Request

description: Provides a request that allow loading files locally.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Request
	- Class-Extras/Class.Binds

provides:
	- Request

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @see    http://moobilejs.com/doc/latest/Request/Request
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Request = new Class({

	Extends: Request,

	/**
	 * @see    http://moobilejs.com/doc/latest/Request/Request#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		isSuccess: function() {
			var status = this.status;
			return (status === 0 || (status >= 200 && status < 300));
		}
	}

});


/*
---

name: Scroller

description: Provides the base class for scrollers.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventFirer

provides:
	- Scroller

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Scroller = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#contentWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentWrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		scroll: 'vertial',
		scrollbar: 'vertical',
		momentum: true,
		bounce: true
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(contentElement, contentWrapperElement, options) {
		this.contentElement = document.id(contentElement);
		this.contentWrapperElement = document.id(contentWrapperElement);
		this.contentWrapperElement.addClass('scrollable');
		this.setOptions(options);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {
		this.contentElement = null;
		this.contentWrapperElement = null;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		throw new Error('You must override this method');
	}

});

Moobile.Scroller.create = function(contentElement, contentWrapperElement, scrollers, options) {

	var scroller = null;

	scrollers = scrollers ? Array.from(scrollers) : ['IScroll.Android', 'Native', 'IScroll'];

	for (var i = 0; i < scrollers.length; i++) {

		var candidate = Class.parse('Moobile.Scroller.' + scrollers[i]);
		if (candidate === null) {
			throw new Error('The scroller scroller ' + scrollers[i] + ' does not exists');
		}

		if (candidate.supportsCurrentPlatform === undefined ||
			candidate.supportsCurrentPlatform &&
			candidate.supportsCurrentPlatform.call(this)) {
			scroller = candidate;
			break;
		}
	}

	if (scroller === null) {
		throw new Error('A proper scroller was not found');
	}

	return new scroller(contentElement, contentWrapperElement, options);
};

window.addEvent('domready', function(e) {

	var scrolls = {};

	document.addEvent('touchstart', function(e) {

		var touches = e.changedTouches;

		for (var i = 0, l = touches.length; i < l; i++) {

			var touch = touches[i];
			var target = touch.target;
			var identifier = touch.identifier;

			if (target.tagName.match(/input|textarea|select/i)) {
				scrolls[identifier] = false;
				return;
			}

			if (target.hasClass('scrollable') ||
				target.getParent('.scrollable')) {
				scrolls[identifier] = true;
			} else {
				scroll[identifier] = false;
				e.preventDefault();
			}
		}
	});

	document.addEvent('touchmove', function(e) {
		var touches = e.changedTouches;
		for (var i = 0, l = touches.length; i < l; i++) {
			if (scrolls[touches[i].identifier] === false) e.preventDefault();
		}
	});

	document.addEvent('touchend', function(e) {
		var touches = e.changedTouches;
		for (var i = 0, l = touches.length; i < l; i++) {
			delete scrolls[touches[i].identifier];
		}
	});

});


/*
---

name: Scroller.IScroll

description: Provides a scroller that uses the iScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller

provides:
	- Scroller.IScroll

...
*/

(function() {

var touchid = null;

var fixtouch = function(e) {

	var touch = {
		identifier: touchid,
		target: e.target,
		pageX: e.pageX,
		pageY: e.pageY,
		clientX: e.clientX,
		clientY: e.clientY
	};

	e.touches = e.targetTouches = e.changedTouches = [touch];
};

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Scroller.IScroll = new Class({

	Extends: Moobile.Scroller,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scroller: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(contentElement, contentWrapperElement, options) {

		this.parent(contentElement, contentWrapperElement, options)

		this.scroller = new iScroll(contentWrapperElement, {
			scrollbarClass: 'scrollbar-',
			hScroll: this.options.scroll === 'both' || this.options.scroll === 'horizontal',
			vScroll: this.options.scroll === 'both' || this.options.scroll === 'vertical',
			hScrollbar: this.options.scrollbar === 'both' || this.options.scrollbar === 'horizontal',
			vScrollbar: this.options.scrollbar === 'both' || this.options.scrollbar === 'vertical',
			momentum: this.options.momentum,
			bounce: this.options.bounce,
			hideScrollbar: true,
			fadeScrollbar: true,
			checkDOMChanges: true,
			onBeforeScrollStart: this.bound('_onBeforeScrollStart'),
			onScrollStart: this.bound('_onScrollStart'),
			onScrollMove: this.bound('_onScrollMove'),
			onScrollEnd: this.bound('_onScrollEnd'),
			onTouchEnd: this.bound('_onTouchEnd')
		});

		window.addEvent('resize', this.bound('refresh'));

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {
		window.removeEvent('resize', this.bound('refresh'));
		this.scroller.destroy();
		this.scroller = null;
		return this.parent();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		return 'iscroll';
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {
		this.scroller.scrollTo(-x, -y, time || 0);
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {
		this.scroller.scrollToElement(document.id(element), time || 0);
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {
		this.scroller.refresh();
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		return {
			x: -this.scroller.x,
			y: -this.scroller.y
		};
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onBeforeScrollStart: function(e) {
		var target = e.target.get('tag');
		if (target !== 'input' &&
			target !== 'select' &&
			target !== 'textarea') {
			e.preventDefault();
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollStart: function(e) {

		if (!('touches' in e)) {

			if (touchid)
				return this;

			if (touchid === null) {
				touchid = String.uniqueID();
				fixtouch(e);
			}
		}


		this.fireEvent('touchstart', e);
		this.fireEvent('scrollstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollMove: function(e) {

		if (touchid) {
			fixtouch(e);
		}

		this.fireEvent('touchmove', e);
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollEnd: function() {
		this.fireEvent('scroll');
		this.fireEvent('scrollend');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchEnd:  function(e) {

		if (touchid) {
			fixtouch(e);
			touchid = null;
		}

		this.fireEvent('touchend', e);
	}

});

Moobile.Scroller.IScroll.supportsCurrentPlatform = function() {
	return true;
};

})();

/*
---

name: Scroller.Native

description: Provides a scroller that uses the native scrolling capabilities.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller

provides:
	- Scroller.Native

...
*/

(function() {

//
// Note:
// requestAnimationFrame polyfill by Erik Möller
//

var requestAnimationFrame;
var cancelAnimationFrame;

var lastTime = 0;

var vendors = ['ms', 'moz', 'webkit', 'o'];

for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (requestAnimationFrame == undefined) {
    requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

if (cancelAnimationFrame === undefined) {
    cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Scroller.Native = new Class({

	Extends: Moobile.Scroller,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_animating: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_animation: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#contentScrollerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentScrollerElement: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(contentElement, contentWrapperElement, options) {

		this.parent(contentElement, contentWrapperElement, options);

		if (this.options.snapToPage) {
			this.options.momentum = false;
			this.options.bounce = false;
		}

		this.contentWrapperElement.setStyle('overflow', 'auto');
		this.contentWrapperElement.setStyle('overflow-scrolling', 'touch');

		var styles = {
			'top': 0, 'left': 0, 'bottom': 0, 'right': 0,
			'position': 'absolute',
			'overflow': 'auto',
			'overflow-scrolling': this.options.momentum ? 'touch' : 'auto'
		};

		this.contentScrollerElement = document.createElement('div');
		this.contentScrollerElement.setStyles(styles);
		this.contentScrollerElement.wraps(contentElement);

		this.contentScrollerElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.contentScrollerElement.addEvent('touchmove', this.bound('_onTouchMove'));
		this.contentScrollerElement.addEvent('touchend', this.bound('_onTouchEnd'));

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {

		this.contentScrollerElement.removeEvent('touchstart', this.bound('_onTouchStart'));
		this.contentScrollerElement.removeEvent('touchend', this.bound('_onTouchMove'));
		this.contentScrollerElement.removeEvent('touchend', this.bound('_onTouchEnd'));
		this.contentScrollerElement.removeEvent('scroll', this.bound('_onScroll'));
		this.contentScrollerElement = null;

		this.contentScroller = null;

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		this.parent();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		return 'native';
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {

		x = x || 0;
		y = y || 0;
		time = time || 0;

		if (this._animating) {
			this._animating = false;
			cancelAnimationFrame(this._animation);
		}

		var now = Date.now();

		var self = this;
		var elem = this.contentScrollerElement;

		var absX = Math.abs(x);
		var absY = Math.abs(y);

		var currX = elem.scrollLeft;
		var currY = elem.scrollTop;

		var dirX = x - currX;
		var dirY = y - currY;

		var update = function() {

			if (elem.scrollLeft === x &&
				elem.scrollTop === y) {
				self.fireEvent('scroll');
				self._animating = false;
				self._animation = null;
				return;
			}

			var valueX = ((Date.now() - now) * (x - currX) / time);
			var valueY = ((Date.now() - now) * (y - currY) / time);
			var scrollX = valueX + currX;
			var scrollY = valueY + currY;

			if ((scrollX >= x && dirX >= 0) || (scrollX < x && dirX < 0)) scrollX = x;
			if ((scrollY >= y && dirY >= 0) || (scrollY < y && dirY < 0)) scrollY = y;

			elem.scrollLeft = scrollX;
			elem.scrollTop  = scrollY;

			self._animating = true;
			self._animation = requestAnimationFrame(update);
		};

		this._animation = requestAnimationFrame(update);

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {

		var elem = document.id(element);
		if (elem) {
			var p = element.getPosition(this.contentElement);
			this.scrollTo(p.x, p.y, time);
		}

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {

		var wrapperSize = this.contentWrapperElement.getSize();
		var contentSize = this.contentElement.getScrollSize();

		if (this.options.momentum) {
			var scrollX = this.options.scroll === 'both' || this.options.scroll === 'horizontal';
			var scrollY = this.options.scroll === 'both' || this.options.scroll === 'vertical';
			if (scrollY && contentSize.y <= wrapperSize.y) this.contentElement.setStyle('min-height', wrapperSize.y + 1);
			if (scrollX && contentSize.x <= wrapperSize.x) this.contentElement.setStyle('min-width',  wrapperSize.x + 1);
		}

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_attachEvents: function() {
		this.contentScrollerElement.addEvent('scroll', this.bound('_onScroll'));
		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_detachEvents: function() {
		this.contentScrollerElement.removeEvent('scroll', this.bound('_onScroll'));
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getSize: function() {
		return this.contentScrollerElement.getSize();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		return this.contentScrollerElement.getScroll();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScroll: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchStart: function(e) {
		this.fireEvent('touchstart', e);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchMove: function(e) {
		this.fireEvent('touchmove', e);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {
		this.fireEvent('touchend', e);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onOrientationChange: function() {
		this.refresh();
	}

});

Moobile.Scroller.Native.supportsCurrentPlatform = function() {
	return Browser.Platform.ios && 'WebkitOverflowScrolling' in document.createElement('div').style;
};

})();

/*
---

name: Mask

description: Provides an overlay control used to mask an child.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Mask

...
*/

// TODO: This component might be buggy since the change on how show/hide works

/**
 * @see    http://moobilejs.com/doc/latest/Util/Overlay
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Overlay = new Class({

	Extends: Moobile.Component,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('overlay');
		this.addEvent('animationend', this.bound('_onAnimationEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.removeEvent('animationend', this.bound('_onAnimationEnd'));
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Util/Overlay#showAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.addClass('show-animated').removeClass('hidden');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Util/Overlay#hideAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Util/Overlay#_onAnimationEnd
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onAnimationEnd: function(e) {

		e.stop();

		if (this.hasClass('show-animated')) {
			this.removeClass('show-animated');
			this.didShow();
		}

		if (this.hasClass('hide-animated')) {
			this.removeClass('hide-animated');
			this.addClass('hidden');
			this.didHide();
		}
	}

});


/*
---

name: String

description: Provides extra methods to the String prototype.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Types/String
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
String.implement({

	/**
	 * @see    http://moobilejs.com/doc/latest/Types/String#toCamelCase
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	toCamelCase: function() {
		return this.camelCase().replace('-', '').replace(/\s\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
	}

});


/*
---

name: Array

description: Provides extra methods to the Array prototype.

license: MIT-style license.

requires:
	- Core/Array

provides:
	- Array

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Types/Array
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Array.implement({

	/**
	 * @see    http://moobilejs.com/doc/latest/Types/Array#find
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	find: function(fn) {
		for (var i = 0; i < this.length; i++) {
			var found = fn.call(this, this[i]);
			if (found === true) {
				return this[i];
			}
		}
		return null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Types/Array#getLastItemAtOffset
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLastItemAtOffset: function(offset) {
		offset = offset ? offset : 0;
		return this[this.length - 1 - offset] ?
			   this[this.length - 1 - offset] :
			   null;
	}
});


/*
---

name: View

description: Provides an child that handles an area in which a user can
             interract.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Component

provides:
	- View

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/View
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.View = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_layout: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#contentWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentWrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		layout: 'vertical'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('view');

		var content = this.getRoleElement('content') /* <0.1-compat> */ || this.getRoleElement('view-content') /* </0.1-compat> */;
		if (content === null) {
			content = document.createElement('div');
			content.ingest(this.element);
			content.inject(this.element);
			content.setRole('content');
		}

		var wrapper = this.getRoleElement('content-wrapper');
		if (wrapper === null) {
			wrapper = document.createElement('div');
			wrapper.wraps(content);
			wrapper.setRole('content-wrapper');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		var classes = this.element.get('class');
		if (classes) {
			classes.split(' ').each(function(klass) {
				klass = klass.trim();
				if (klass) this.contentElement.addClass(klass + '-content');
			}, this);
		}

		this.setLayout(this.options.layout);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.contentElement = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#enableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enableTouch: function() {
		this.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#disableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	disableTouch: function() {
		this.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildComponent: function(component, where) {
		if (where === 'header') return this.parent(component, 'top');
		if (where === 'footer') return this.parent(component, 'bottom');
		return this.addChildComponentInside(component, this.contentElement, where);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildComponent: function(component) {
		this.parent(component);
		component.setParentView(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		component.setParentView(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentElement: function() {
		return this.contentElement;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#getContentWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentWrapperElement: function() {
		return this.contentWrapperElement;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setLayout: function(layout) {

		if (this._layout === layout)
			return this;

		this.willChangeLayout(layout);
		if (this._layout) this.removeClass('view-layout-' + this._layout);
		this._layout = layout;
		if (this._layout) this.addClass('view-layout-' + this._layout);
		this.didChangeLayout(layout);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getLayout: function() {
		return this._layout;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#willChangeLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willChangeLayout: function(layout) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#didChangeLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	didChangeLayout: function(layout) {

	}

});

Class.refactor(Moobile.Component, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_parentView: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParentView: function(parentView) {

		if (this._parentView === parentView)
			return this;

		this.parentViewWillChange(parentView);
		this._parentView = parentView;
		this.parentViewDidChange(parentView);

		if (this instanceof Moobile.View)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.View);
		};

		this.getChildComponents().filter(by).invoke('setParentView', parentView);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#getParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentView: function() {
		return this._parentView;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewWillChange: function(parentView) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewDidChange: function(parentView) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildComponent: function(component) {
		this.previous(component);
		component.setParentView(this._parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildComponent: function(component) {
		this.previous(component);
		component.setParentView(null);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/View/View#MoobileViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.View.at = function(path, options, name) {

	var element = Element.at(path);
	if (element) {
		return Moobile.Component.create(Moobile.View, element, 'data-view', options, name);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.View, element, 'data-view'));
});

Moobile.Component.defineRole('content', Moobile.View, {traversable: true}, function(element) {
	this.contentElement = element;
	this.contentElement.addClass('view-content');
});

Moobile.Component.defineRole('content-wrapper', Moobile.View, {traversable: true}, function(element) {
	this.contentWrapperElement = element
	this.contentWrapperElement.addClass('view-content-wrapper');
});

// <0.1-compat>
/**
 * @deprecated
 */
Moobile.Component.defineRole('view-content', Moobile.View, {traversable: true}, function(element) {
	console.log('[DEPRECATION NOTICE] The role "view-content" will be removed in 0.4, use the role "content" instead');
	this.contentElement = element;
	this.contentElement.addClass('view-content');
});
// </0.1-compat>

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Dark Style - iOS Android */
Moobile.Component.defineStyle('dark', Moobile.View, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

/* Light Style - iOS Android */
Moobile.Component.defineStyle('light', Moobile.View, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});


/*
---

name: ViewStack

description: Provides a view that handles an infinite number of views arrenged
             as a stack, one on the top of each others.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewStack

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/ViewStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewStack = new Class({

	Extends: Moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('view-stack');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-stack', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewStack, element, 'data-view-stack'));
});


/*
---

name: ScrollView

description: Provides a view that scrolls when its content is larger than the
			 view area.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ScrollView

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/ScrollView
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.1
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ScrollView = new Class({

	Extends: Moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchTime: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchScroll: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchDuration: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_scroller: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_offset: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_page: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_pageOffset: {
		x: 0,
		y: 0,
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		scroller: ['Native', 'IScroll'],
		scroll: 'vertical',
		scrollbar: 'vertical',
		bounce: Browser.Platform.ios,
		momentum: true,
		snapToPage: false,
		snapToPageAt: 20,
		snapToPageSizeX: null,
		snapToPageSizeY: null,
		snapToPageDuration: 150,
		snapToPageDelay: 150,
		initialPageX: 0,
		initialPageY: 0,
		initialScrollX: 0,
		initialScrollY: 0
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('scroll-view');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		// <0.1 compat>
		if ('scrollX' in this.options || 'scrollY' in this.options) {
			console.log('[DEPRECATION NOTICE] The options "scrollX" and "scrollY" will be removed in 0.4, use the "scroll" option instead');
			if (this.options.scrollX &&
				this.options.scrollY) {
				this.options.scroll = 'both';
			} else {
				if (this.options.scrollX) this.options.scroll = 'horizontal';
				if (this.options.scrollY) this.options.scroll = 'vertical';
			}
		}
		// </0.1 compat>

		var options = {
			scroll: this.options.scroll,
			scrollbar: this.options.scrollbar,
			bounce: this.options.bounce,
			momentum: this.options.momentum,
			snapToPage: this.options.snapToPage,
			snapToPageAt: this.options.snapToPageAt,
			snapToPageSizeX: this.options.snapToPageSizeX,
			snapToPageSizeY: this.options.snapToPageSizeY,
			snapToPageDuration: this.options.snapToPageDuration,
			snapToPageDelay: this.options.snapToPageDelay
		};

		this._scroller = Moobile.Scroller.create(this.contentElement, this.contentWrapperElement, this.options.scroller, options);
		this._scroller.addEvent('scroll', this.bound('_onScroll'));
		this._scroller.addEvent('scrollend', this.bound('_onScrollEnd'));
		this._scroller.addEvent('scrollstart', this.bound('_onScrollStart'));
		this._scroller.addEvent('touchcancel', this.bound('_onTouchCancel'));
		this._scroller.addEvent('touchstart', this.bound('_onTouchStart'));
		this._scroller.addEvent('touchend', this.bound('_onTouchEnd'));

		var name = this._scroller.getName();
		if (name) {
			this.addClass(name + '-engine');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBecomeReady: function() {

		this.parent();

		var x = this.options.initialScrollX;
		var y = this.options.initialScrollY;
		var s = 'scrollTo';

		if (this.options.snapToPage) {
			x = this.options.initialPageX;
			y = this.options.initialPageY;
			s = 'scrollToPage';
		}

		this._scroller.refresh();

		this[s].call(this, x, y);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	destroy: function() {
		this._scroller.removeEvent('scroll', this.bound('_onScroll'));
		this._scroller.removeEvent('scrollend', this.bound('_onScrollEnd'));
		this._scroller.removeEvent('scrollstart', this.bound('_onScrollStart'));
		this._scroller.removeEvent('touchcancel', this.bound('_onTouchCancel'));
		this._scroller.removeEvent('touchstart', this.bound('_onTouchStart'));
		this._scroller.removeEvent('touchend', this.bound('_onTouchEnd'));
		this._scroller.destroy();
		this._scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#setContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	setContentSize: function(x, y) {
		if (x >= 0 || x === null) this.contentElement.setStyle('width', x);
		if (y >= 0 || y === null) this.contentElement.setStyle('height', y);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getContentWrapperSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentWrapperSize: function() {
		return this.contentWrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getContentScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentScroll: function() {
		return this._scroller.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this._scroller.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this._scroller.scrollToElement(element);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#scrollToPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	scrollToPage: function(pageX, pageY, time) {

		pageX = pageX || 0;
		pageY = pageY || 0;

		if (pageX < 0) pageX = 0;
		if (pageY < 0) pageY = 0;

		var frame = this.getContentWrapperSize();
		var total = this.getContentSize();

		var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;

		var xmax = total.x - frame.x;
		var ymax = total.y - frame.y;
		var x = pageSizeX * pageX;
		var y = pageSizeY * pageY;
		if (x > xmax) x = xmax;
		if (y > ymax) y = ymax;

		var scroll = this.getContentScroll();
		if (scroll.x !== x ||
			scroll.y !== y) {
			this.scrollTo(x, y, time);
		}

		if (this._page.x !== pageX ||
			this._page.y !== pageY) {
			this._pageOffset.x = Math.abs(x - pageX * pageSizeX);
			this._pageOffset.y = Math.abs(y - pageY * pageSizeY);
			this.fireEvent('scrolltopage', [pageX, pageY], time);
		}

		this._page.x = pageX;
		this._page.y = pageY;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPage: function() {

		var x = 0;
		var y = 0;

		var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;

		if (pageSizeX && pageSizeY) {

			var scroll = this.getContentScroll();
			scroll.x = scroll.x > 0 ? scroll.x : 0;
			scroll.y = scroll.y > 0 ? scroll.y : 0;

			x = Math.floor(scroll.x / pageSizeX);
			y = Math.floor(scroll.y / pageSizeY);
		}

		return {x: x, y: y};
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getPageOffset
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPageOffset: function() {
		return this._pageOffset;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getScroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroller: function() {
		return this._scroller;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willHide: function() {
		this.parent();
		this._offset = this._scroller.getScroll();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didShow: function() {
		this.parent();
		this._scroller.refresh();
		this._scroller.scrollTo(this._offset.x, this._offset.y);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_snapToPage: function() {

		var scroll = this.getContentScroll();
		scroll.x = scroll.x > 0 ? scroll.x : 0;
		scroll.y = scroll.y > 0 ? scroll.y : 0;

		var moveX = scroll.x - this._activeTouchScroll.x;
		var moveY = scroll.y - this._activeTouchScroll.y;
		var absMoveX = Math.abs(moveX);
		var absMoveY = Math.abs(moveY);

		if (moveX === 0 && moveY === 0)
			return this;

		var scrollX = this.options.scroll === 'both' || this.options.scroll === 'horizontal';
		var scrollY = this.options.scroll === 'both' || this.options.scroll === 'vertical';

		var snapToPageAt = this.options.snapToPageAt;
		var snapToPageDelay = this.options.snapToPageDelay;
		var snapToPageDuration = this.options.snapToPageDuration

		var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;
		var pageMoveX = (absMoveX - Math.floor(absMoveX / pageSizeX) * pageSizeX) * 100 / pageSizeX;
		var pageMoveY = (absMoveY - Math.floor(absMoveY / pageSizeY) * pageSizeY) * 100 / pageSizeY;

		var page = this.getPage();

		if (moveX < 0 || this._pageOffset.x > 0) page.x += 1;
		if (moveY < 0 || this._pageOffset.y > 0) page.y += 1;

		if (absMoveX >= 10 && (pageMoveX >= snapToPageAt || this._activeTouchDuration < snapToPageDelay)) page.x += moveX > 0 ? 1 : -1;
		if (absMoveY >= 10 && (pageMoveY >= snapToPageAt || this._activeTouchDuration < snapToPageDelay)) page.y += moveY > 0 ? 1 : -1;

		this.scrollToPage(page.x, page.y, this.options.snapToPageDuration);

		this.fireEvent('snaptopage', [page.x, page.y]);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	_onTouchCancel: function() {
		this._activeTouch = null;
		this._activeTouchTime = null;
		this._activeTouchScroll = null;
		this._activeTouchDuration = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	_onTouchStart: function(e) {

		var touch = e.changedTouches[0];

		if (this._activeTouch === null) {
			this._activeTouch = touch;
			this._activeTouchTime = Date.now();
			this._activeTouchScroll = this.getContentScroll();
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {

		if (e.touches.length > 0)
			return;

		this._activeTouchDuration = Date.now() - this._activeTouchTime;

		if (this.options.snapToPage) this._snapToPage();

		this._activeTouch = null;
		this._activeTouchTime = null;
		this._activeTouchScroll = null;
		this._activeTouchDuration = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScroll: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollEnd: function() {
		this.fireEvent('scrollend');
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		console.log('[DEPRECATION NOTICE] The method "getScrollSize" will be removed in 0.3, use the method "getContentSize" instead');
		return this.getContentSize();
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		console.log('[DEPRECATION NOTICE] The method "getScroll" will be removed in 0.3, use the method "getContentScroll" instead');
		return this.getContentScroll();
	},

});

/**
 * @see    http://moobilejs.com/doc/latest/View/View#MoobileViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.ScrollView.at = function(path, options, name) {

	var element = Element.at(path);
	if (element) {
		return Moobile.Component.create(Moobile.ScrollView, element, 'data-view', options, name);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('scroll-view', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ScrollView, element, 'data-scroll-view'));
});


/*
---

name: ViewController

description: Manages a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventFirer

provides:
	- ViewController

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.1
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ViewController = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_id: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_viewReady: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_viewTransition: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_children: [],

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#modal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_modal: false,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#modalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_modalViewController: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#view
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	view: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(options, name) {

		this._name = name;

		this.setOptions(options);

		this.loadView();
		if (this.view) {
			this.view.addEvent('ready', this.bound('_onViewReady'));
			this.viewDidLoad();
		}

		window.addEvent('orientationchange', this.bound('_onWindowOrientationChange'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#loadView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {
		if (this.view === null) {
			this.view = new Moobile.View();
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#showView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	showView: function() {
		this.view.show();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#hideView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	hideView: function() {
		this.view.hide();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewController: function(viewController) {

		var viewHandler = function() {
			var view = viewController.getView();
			if (view) {
				this.view.addChildComponent(view);
			}
		};

		return this._addChildViewControllerAt(viewController, this._children.length, viewHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewControllerAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewControllerAfter: function(viewController, after) {

		var index = this.getChildViewControllerIndex(after);
		if (index === -1)
			return this;

		var viewHandler = function() {
			var view = viewController.getView();
			if (view) {
				var afterView = after.getView();
				if (afterView) {
					this.view.addChildComponentAfter(view, afterView);
				}
			}
		};

		return this._addChildViewControllerAt(viewController, index + 1, viewHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewControllerBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewControllerBefore: function(viewController, before) {

		var index = this.getChildViewControllerIndex(before);
		if (index === -1)
			return this;

		var viewHandler = function() {
			var view = viewController.getView();
			if (view) {
				var beforeView = before.getView();
				if (beforeView) {
					this.view.addChildComponentBefore(view, beforeView);
				}
			}
		};

		return this._addChildViewControllerAt(viewController, index, viewHandler);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_addChildViewControllerAt: function(viewController, index, viewHandler) {

		if (this.hasChildViewController(viewController))
			return this;

		viewController.removeFromParentViewController();

		this.willAddChildViewController(viewController);
		this._children.splice(index, 0, viewController);
		viewController.setParentViewController(this);

		if (viewHandler) {
			viewHandler.call(this)
		}

		this.didAddChildViewController(viewController);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewController: function(name) {
		return this._children.find(function(viewController) { return viewController.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllerAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllerAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllerIndex: function(viewController) {
		return this._children.indexOf(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllers: function() {
		return this._children;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#hasChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildViewController: function(viewController) {
		return this._children.contains(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#removeChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeChildViewController: function(viewController, destroy) {

		if (!this.hasChildViewController(viewController))
			return this;

		this.willRemoveChildViewController(viewController);
		this._children.erase(viewController);
		viewController.setParentViewController(null);

		var view = viewController.getView();
		if (view) {
			view.removeFromParentComponent();
		}

		this.didRemoveChildViewController(viewController);

		if (destroy) {
			viewController.destroy();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#removeFromParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	removeFromParentViewController: function(destroy) {
		if (this._parent) this._parent.removeChildViewController(this, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#removeAllChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildViewControllers: function(destroy) {

		this._children.filter(function() {
			return true;
		}).invoke('removeFromParentViewController', destroy);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#presentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	presentModalViewController: function(viewController, viewTransition) {

		if (this._modalViewController)
			return this;

		var parentView = this.view.getWindow();
		if (parentView === null)
			throw new Error('The view to present is not ready');

		this.willPresentModalViewController(viewController);

		this._modalViewController = viewController;
		this._modalViewController.setParentViewController(this);
		this._modalViewController.setModal(true);

		var viewToShow = this._modalViewController.getView();
		var viewToHide = parentView.getChildComponentsOfType(Moobile.View).getLastItemAtOffset(0);

		parentView.addChildComponent(viewToShow);

		viewTransition = viewTransition || new Moobile.ViewTransition.Cover;
		viewTransition.addEvent('start:once', this.bound('_onPresentTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('_onPresentTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			parentView
		);

		viewController.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onPresentTransitionStart: function() {
		this._modalViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onPresentTransitionCompleted: function() {
		this._modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#dismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	dismissModalViewController: function() {

		if (this._modalViewController === null)
			return this;

		var parentView = this.view.getWindow();
		if (parentView === null)
			throw new Error('The view to dismiss is not ready');

		this.willDismissModalViewController()

		var viewToShow = parentView.getChildComponentsOfType(Moobile.View).getLastItemAtOffset(1);
		var viewToHide = this._modalViewController.getView();

		var viewTransition = this._modalViewController.getViewTransition();
		viewTransition.addEvent('start:once', this.bound('_onDismissTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('_onDismissTransitionCompleted'));
		viewTransition.leave(
			viewToShow,
			viewToHide,
			parentView
		);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onDismissTransitionStart: function() {
		this._modalViewController.viewWillLeave();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	_onDismissTransitionCompleted: function() {
		this._modalViewController.viewDidLeave();
		this._modalViewController.setParentViewController(this);
		this._modalViewController.setModal(false);
		this._modalViewController.destroy();
		this._modalViewController = null;
		this.didDismissModalViewController();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getId
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getId: function() {

		var name = this.getName();
		if (name) {
			return name;
		}

		if (this._id === null) {
			this._id = String.uniqueID();
		}

		return this._id;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		if (typeof title === 'string') {
			var text = title;
			title = new Moobile.Text();
			title.setText(text);
		}

		// Not totally sure about that yet
		// var parent = this._title ? this._title.getParentComponent() : null;
		// if (parent) {
		// 	parent.replaceChildComponent(this._title, title);
		// }


		this._title = title;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this._image === image)
			return this;

		if (typeof image === 'string') {
			var source = image;
			image = new Moobile.Image();
			image.setSource(source);
		}

		// Not totally sure about that yet
		// var parent = this._image ? this._image.getParentComponent() : null;
		// if (parent) {
		//	parent.replaceChildComponent(this._image, image);
		// }

		this._image = image;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setModal: function(modal) {
		this._modal = modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#isModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isModal: function() {
		return this._modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#isViewReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isViewReady: function() {
		return this._viewReady;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getView: function() {
		return this.view;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewTransition: function(viewTransition) {
		this._viewTransition = viewTransition;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewTransition: function() {
		return this._viewTransition;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParentViewController: function(viewController) {
		this.parentViewControllerWillChange(viewController);
		this._parent = viewController;
		this.parentViewControllerDidChange(viewController);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentViewController: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#parentViewControllerWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#parentViewControllerDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerDidChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidLoad
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidLoad: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewWillEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewWillEnter: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidEnter: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewWillLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewWillLeave: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidLeave: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidRotate
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	viewDidRotate: function(orientation) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		window.removeEvent('orientationchange', this.bound('_onWindowOrientationChange'));

		this.removeAllChildViewControllers(true);

		this.removeFromParentViewController();

		if (this._modalViewController) {
			this._modalViewController.destroy();
			this._modalViewController = null;
		}

		this.view.destroy();
		this.view = null;

		if (this._title) {
			this._title.destroy();
			this._title = null;
		}

		if (this._image) {
			this._image.destroy();
			this._image = null;
		}

		this._parent = null;
		this._children = null
		this._viewTransition = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onViewReady: function() {
		if (this._viewReady === false) {
			this._viewReady = true;
			this.viewDidBecomeReady();
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onWindowOrientationChange: function(e) {

		var name = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';

		// <0.1-compat>
		if (this.didRotate) {
			this.didRotate(name);
			console.log('[DEPRECATION NOTICE] The method "didRotate" will be removed in 0.4, use the method "viewDidRotate" instead');
		}
		// </0.1-compat>

		this.viewDidRotate(name);
	}

});


/*
---

name: ViewControllerStack

description: Manages a view stack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerStack

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_animating: false,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {
		this.view = new Moobile.ViewStack();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#pushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	pushViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		if (this.getTopViewController() === viewController)
			return this;

		var childViewControllers = this.getChildViewControllers();

		viewController.removeFromParentViewController();
		viewController.setViewControllerStack(this);
		this.willPushViewController(viewController);
		this.addChildViewController(viewController);

		var viewControllerPushed = viewController;
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);

		var viewToShow = viewControllerPushed.getView();
		var viewToHide = viewControllerBefore
					   ? viewControllerBefore.getView()
					   : null;

		this._animating = true; // needs to be set before the transition happens

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onPushTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPushTransitionComplete'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.view,
			childViewControllers.length === 1
		);

		viewControllerPushed.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPushTransitionStart: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPushed = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		viewControllerPushed.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPushTransitionComplete: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPushed = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
		}

		this.didPushViewController(viewControllerPushed);

		viewControllerPushed.viewDidEnter();

		this._animating = false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#popViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	popViewController: function() {

		if (this._animating)
			return this;

		var childViewControllers = this.getChildViewControllers();
		if (childViewControllers.length <= 1)
			return this;

		var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);

		this.willPopViewController(viewControllerPopped);

		this._animating = true; // needs to be set before the transition happens

		var viewTransition = viewControllerPopped.getViewTransition();
		viewTransition.addEvent('start:once', this.bound('onPopTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPopTransitionComplete'));
		viewTransition.leave(
			viewControllerBefore.getView(),
			viewControllerPopped.getView(),
			this.view
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#popViewControllerUntil
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	popViewControllerUntil: function(viewController) {

		if (this._animating)
			return this;

		var childViewControllers = this.getChildViewControllers();
		if (childViewControllers.length <= 1)
			return this;

		var viewControllerIndex = this.getChildViewControllerIndex(viewController);
		if (viewControllerIndex > -1) {
			for (var i = childViewControllers.length - 2; i > viewControllerIndex; i--) {
				var viewControllerToRemove = this.getChildViewControllerAt(i);
				viewControllerToRemove.viewWillLeave();
				viewControllerToRemove.viewDidLeave();
				viewControllerToRemove.removeFromParentViewController();
				viewControllerToRemove.destroy();
				viewControllerToRemove = null;
			}
		}

		this.popViewController();

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPopTransitionStart: function(e) {
		var childViewControllers = this.getChildViewControllers();
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
		viewControllerBefore.viewWillEnter();
		viewControllerPopped.viewWillLeave();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPopTransitionComplete: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		viewControllerBefore.viewDidEnter();
		viewControllerPopped.viewDidLeave();
		viewControllerPopped.removeFromParentViewController();

		this.didPopViewController(viewControllerPopped);

		viewControllerPopped.destroy();
		viewControllerPopped = null;

		this._animating = false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#getTopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTopViewController: function() {
		return this.getChildViewControllers().getLast();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#willPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#didPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#willPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPopViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#didPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPopViewController: function(viewController) {

	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_viewControllerStack: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#setViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewControllerStack: function(viewControllerStack) {

		if (this._viewControllerStack === viewControllerStack)
			return this;

		this.parentViewControllerStackWillChange(viewControllerStack);
		this._viewControllerStack = viewControllerStack;
		this.parentViewControllerStackDidChange(viewControllerStack);

		if (this instanceof Moobile.ViewControllerStack)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.ViewControllerStack);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerStack', viewControllerStack);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#getViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewControllerStack: function() {
		return this._viewControllerStack;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#parentViewControllerStackWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerStackWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#parentViewControllerStackDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerStackDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerStack(this._viewControllerStack);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerStack(null);
	}

});


/*
---

name: ViewControllerStack.Navigation

description: Provides a view controller stack that also handles a navigation
             bar and its back button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerStack

provides:
	- ViewControllerStack.Navigation

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack.Navigation
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewControllerStack.Navigation = new Class({

	Extends: Moobile.ViewControllerStack,

	/**
	 * The class options.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		backButton: true,
		backButtonLabel: 'Back'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {

		this.parent(viewController);

		var view = viewController.getView();

		var navigationBar = view.getChildComponent('navigation-bar');
		if (navigationBar === null) {
			navigationBar = new Moobile.NavigationBar(null, null, 'navigation-bar');
			view.addChildComponent(navigationBar, 'header');
		}

		if (viewController.isModal() || this.childViewControllers.length === 0)
			return this;

		if (this.options.backButton) {

			var backButtonLabel = this.topViewController.getTitle() || this.options.backButtonLabel;
			if (backButtonLabel) {

				var backButton = new Moobile.Button(null, null, 'back');
				backButton.setStyle('back');
				backButton.setLabel(backButtonLabel);
				backButton.addEvent('tap', this.bound('_onBackButtonTap'));

				navigationBar.getItem().addLeftButton(backButton);
			}
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		var navigationBar = viewController.getView().getChildComponent('navigation-bar');
		if (navigationBar === null)
			return this;

		var title = viewController.getTitle();
		if (title) {
			navigationBar.getItem().setTitle(title)
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onBackButtonTap: function(e) {
		this.popViewController();
	}

});


/*
---

name: ViewTransition

description: Provides the base class that applies view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Element
	- Core/Element.Event
	- Core/Element.Style
	- Class-Extras/Class.Binds
	- Event.CSS3

provides:
	- ViewTransition

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#enter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enter: function(viewToShow, viewToHide, parentView, isFirstView) {

		viewToShow.disableTouch();
		if (viewToHide) {
			viewToHide.disableTouch();
		}

		this.fireEvent('start');

		if (isFirstView) {
			this.firstAnimation(viewToShow, parentView)
		} else {
			this.enterAnimation(viewToShow, viewToHide, parentView);
		}

		viewToShow.show();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#leave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leave: function(viewToShow, viewToHide, parentView) {

		viewToShow.disableTouch();
		viewToHide.disableTouch();

		this.fireEvent('start');
		this.leaveAnimation(viewToShow, viewToHide, parentView);

		viewToShow.show();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#didEnterFirst
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didEnterFirst: function(viewToShow, parentView) {
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#didEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didEnter: function(viewToShow, viewToHide, parentView) {
		if (this.shouldHideViewToHideOnEnter(viewToShow, viewToHide, parentView)) viewToHide.hide();
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#didLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didLeave: function(viewToShow, viewToHide, parentView) {
		if (this.shouldHideViewToHideOnEnter(viewToShow, viewToHide, parentView)) viewToHide.hide();
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#shouldHideViewToHideOnEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	shouldHideViewToHideOnEnter: function(viewToShow, viewToHide, parentView) {
		return true;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#shouldHideViewToHideOnLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	shouldHideViewToHideOnLeave: function(viewToShow, viewToHide, parentView) {
		return true;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#firstAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#enterAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#leaveAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	}

});


/*
---

name: ViewTransition.Slide

description: Provide an horizontal slide view transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Slide

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Slide
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition.Slide = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('first');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('first');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-slide-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-slide-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didLeave(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-slide-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});


/*
---

name: ViewTransition.Cover

description: Provides a view transition that covers the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cover

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Cover
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition.Cover = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-cover-enter');
			parentElem.addClass('first');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-enter');
			parentElem.removeClass('first');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-cover-enter');
			viewToHide.addClass('transition-view-to-hide');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-enter');
			viewToHide.removeClass('transition-view-to-hide');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-cover-leave');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-leave');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});


/*
---

name: ViewTransition.Cover.Box

description: Provides a view transition that covers the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition.Cover

provides:
	- ViewTransition.Cover

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Cover.Box
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ViewTransition.Cover.Box = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	overlay: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	wrapper: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {
		throw new Error('You cannot use this transition for the first view of a stack');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		this.overlay = new Moobile.Overlay();
		this.overlay.addClass('transition-cover-box-overlay');
		this.overlay.hide();

		parentView.addChildComponent(this.overlay);

		this.wrapper = document.createElement('div');
		this.wrapper.addClass('transition-cover-box-foreground-view-wrapper');
		this.wrapper.wraps(viewToShow);

		var onStart = function() {
			parentElem.addClass('transition-cover-box-enter');
			viewToHide.addClass('transition-cover-box-background-view');
			viewToShow.addClass('transition-cover-box-foreground-view');
			this.overlay.showAnimated();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-box-enter');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(this.wrapper);
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-cover-box-leave');
			this.overlay.hideAnimated();
		}.bind(this);

		var onEnd = function() {

			parentElem.removeClass('transition-cover-box-leave');
			viewToShow.removeClass('transition-cover-box-background-view');
			viewToHide.removeClass('transition-cover-box-foreground-view');

			this.overlay.removeFromParentComponent();
			this.overlay.destroy();
			this.overlay = null;

			this.didLeave(viewToShow, viewToHide, parentView);

			this.wrapper.destroy();
			this.wrapper = null;

		}.bind(this);

		var animation = new Moobile.Animation(this.wrapper);
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	shouldHideViewToHideOnEnter: function(viewToShow, viewToHide, parentView) {
		return false;
	}

});


/*
---

name: ViewTransition.Cover.Page

description: Provides a view transition that covers the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition.Cover

provides:
	- ViewTransition.Cover

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Cover.Page
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ViewTransition.Cover.Page = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	overlay: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	wrapper: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {
		throw new Error('You cannot use this transition for the first view of a stack');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		this.overlay = new Moobile.Overlay();
		this.overlay.addClass('transition-cover-page-overlay');
		this.overlay.hide();

		parentView.addChildComponent(this.overlay);

		this.wrapper = document.createElement('div');
		this.wrapper.addClass('transition-cover-page-foreground-view-wrapper');
		this.wrapper.wraps(viewToShow);

		var onStart = function() {
			parentElem.addClass('transition-cover-page-enter');
			viewToHide.addClass('transition-cover-page-background-view');
			viewToShow.addClass('transition-cover-page-foreground-view');
			this.overlay.showAnimated();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-page-enter');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(this.wrapper);
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-cover-page-leave');
			this.overlay.hideAnimated();
		}.bind(this);

		var onEnd = function() {

			parentElem.removeClass('transition-cover-page-leave');
			viewToShow.removeClass('transition-cover-page-background-view');
			viewToHide.removeClass('transition-cover-page-foreground-view');

			this.overlay.removeFromParentComponent();
			this.overlay.destroy();
			this.overlay = null;

			this.didLeave(viewToShow, viewToHide, parentView);

			this.wrapper.destroy();
			this.wrapper = null;

		}.bind(this);

		var animation = new Moobile.Animation(this.wrapper);
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	shouldHideViewToHideOnEnter: function(viewToShow, viewToHide, parentView) {
		return false;
	}

});


/*
---

name: ViewTransition.Cubic

description: Provide a cubic view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cubic

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Cubic
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition.Cubic = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-cubic-perspective');
			parentElem.addClass('first');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			parentElem.removeClass('first');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cubic-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-cubic-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cubic-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-cubic-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didLeave(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cubic-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});


/*
---

name: ViewTransition.Drop

description: Provides a view transition that covers the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Drop

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Drop
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.ViewTransition.Drop = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-drop-enter');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-drop-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-drop-leave');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-drop-leave');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});



/*
---

name: ViewTransition.Fade

description: Provides a transition that fade under the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Fade

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Fade
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-fade-enter');
			parentElem.addClass('first');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-fade-enter');
			parentElem.removeClass('first');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-fade-enter');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-fade-enter');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-fade-leave');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-fade-leave');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});



/*
---

name: ViewTransition.Flip

description: Provides a transition that flips the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Flip

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Flip
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition.Flip = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-flip-perspective');
			parentElem.addClass('first');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-flip-perspective');
			parentElem.removeClass('first');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-flip-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-flip-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-flip-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-flip-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-flip-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-flip-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didLeave(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-flip-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});



/*
---

name: ViewTransition.None

description: Provide a non-animated view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.None

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.None
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition.None = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {
		this.didEnterFirst(viewToShow, parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		this.didEnter(viewToShow, viewToHide, parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		this.didLeave(viewToShow, viewToHide, parentView);
	}

});


/*
---

name: Window

description: Provides the root of a view hierarchy.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Window

...
*/

if (!window.$moobile) window.$moobile = {};

(function() {

var instance = null;

/**
 * @see    http://moobilejs.com/doc/latest/Window/Window
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Window = new Class({

	Extends: Moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(element, options, name) {
		instance = this;
		return this.parent(element, options, name);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.element.set('class', 'window');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {
		this.parent();
		this.contentElement.addClass('window-content');
		this.contentWrapperElement.addClass('window-content-wrapper');
		this.setReady(true);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {
		this.parent(component);
		component.setWindow(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(component) {
		this.parent(component);
		component.setWindow(null);
	}

});

Moobile.Window.getCurrentInstance = function() {
	return instance;
};

})()


/*
---

name: WindowController

description: Manages a window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- WindowController

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Window/WindowController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.WindowController = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_rootViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {

		var element = document.id('window');
		if (element === null) {
			element = document.createElement('div');
			element.inject(document.body);
		}

		this.view = new Moobile.Window(element);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Window/WindowController#setRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setRootViewController: function(rootViewController) {

		if (this._rootViewController) {
			this._rootViewController.destroy();
			this._rootViewController = null;
		}

		if (rootViewController) {
 			this.addChildViewController(rootViewController);
		}

		this._rootViewController = rootViewController;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Window/WindowController#getRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRootViewController: function() {
		return this._rootViewController;
	}

});


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

var disabled;

Element.defineCustomEvent('touch', {

	base: 'touchend',

	condition: function(event){
		if (disabled || event.targetTouches.length !== 0) return false;

		var touch = event.changedTouches[0],
			target = document.elementFromPoint(touch.clientX, touch.clientY);

		do {
			if (target == this) return true;
		} while (target && (target = target.parentNode));

		return false;
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
		if (disabled || !active) return;

		event.preventDefault();

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
		if (disabled || !active) return;
		
		var touch = event.changedTouches[0],
			end = {x: touch.pageX, y: touch.pageY};
		if (this.retrieve(cancelKey) && Math.abs(start.y - end.y) > 10){
			active = false;
			return;
		}
		
		var distance = this.retrieve(distanceKey, dflt),
			delta = end.x - start.x,
			isLeftSwipe = delta < -distance,
			isRightSwipe = delta > distance;

		if (!isRightSwipe && !isLeftSwipe)
			return;
		
		event.preventDefault();
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

name: Class.Instantiate

description: Simple Wrapper for Mass-Class-Instantiation

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class]

provides: Class.Instantiate

...
*/

Class.Instantiate = function(klass, options){
	var create = function(object){
		if (object.getInstanceOf && object.getInstanceOf(klass)) return;
		new klass(object, options);
	};
	
	return function(objects){
		objects.each(create);
	};
};

/*
---

name: Class.Singleton

description: Beautiful Singleton Implementation that is per-context or per-object/element

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class]

provides: Class.Singleton

...
*/

(function(){

var storage = {

	storage: {},

	store: function(key, value){
		this.storage[key] = value;
	},

	retrieve: function(key){
		return this.storage[key] || null;
	}

};

Class.Singleton = function(){
	this.$className = String.uniqueID();
};

Class.Singleton.prototype.check = function(item){
	if (!item) item = storage;

	var instance = item.retrieve('single:' + this.$className);
	if (!instance) item.store('single:' + this.$className, this);
	
	return instance;
};

var gIO = function(klass){

	var name = klass.prototype.$className;

	return name ? this.retrieve('single:' + name) : null;

};

if (('Element' in this) && Element.implement) Element.implement({getInstanceOf: gIO});

Class.getInstanceOf = gIO.bind(storage);

}).call(this);
