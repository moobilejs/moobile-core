/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){
var m = Math,
	mround = function (r) { return r >> 0; },
	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
		'opera' in window ? 'O' : '',

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isPlaybook = (/playbook/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor + 'Transform' in document.documentElement.style,
    hasTransitionEnd = isIDevice || isPlaybook,

	nextFrame = (function() {
	    return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback) { return setTimeout(callback, 1); }
	})(),
	cancelFrame = (function () {
	    return window.cancelRequestAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.msCancelRequestAnimationFrame
			|| clearTimeout
	})(),

	// Events
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',

	// Helpers
	trnOpen = 'translate' + (has3d ? '3d(' : '('),
	trnClose = has3d ? ',0)' : ')',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			doc = document,
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
		that.options.useTransform = hasTransform ? that.options.useTransform : false;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together!
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			trnOpen = 'translate(';
			trnClose = ')';
		}

		// Set some default styles
		that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';
		that.scroller.style[vendor + 'TransitionDuration'] = '0';
		that.scroller.style[vendor + 'TransformOrigin'] = '0 0';
		if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';

		if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			that._bind('mouseout', that.wrapper);
			if (that.options.wheelAction != 'none')
				that._bind(WHEEL_EV);
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
			case WHEEL_EV: that._wheel(e); break;
			case 'mouseout': that._mouseout(e); break;
			case 'webkitTransitionEnd': that._transitionEnd(e); break;
		}
	},

	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},

	_scrollbar: function (dir) {
		var that = this,
			doc = document,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';
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

			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;
			if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(mround(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(mround(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
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
		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
		} else {
			x = mround(x);
			y = mround(y);
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
				size = that[dir + 'ScrollbarIndicatorSize'] + mround(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - mround((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
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
				matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
				x = matrix[4] * 1;
				y = matrix[5] * 1;
			} else {
				x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
				y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
			}

			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind('webkitTransitionEnd');
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
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

		that._bind(MOVE_EV);
		that._bind(END_EV);
		that._bind(CANCEL_EV);
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

			this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';

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

		if (that.absDistX < 6 && that.absDistY < 6) {
			that.distX += deltaX;
			that.distY += deltaY;
			that.absDistX = m.abs(that.distX);
			that.absDistY = m.abs(that.distY);

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
		if (hasTouch && e.touches.length != 0) return;

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

		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;

			that.scroller.style[vendor + 'TransitionDuration'] = '200ms';
			that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';

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
				} else {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = document.createEvent('MouseEvents');
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

			that._resetPos(200);

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

			that.scrollTo(mround(newPosX), mround(newPosY), newDuration);

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
				if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
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
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			wheelDeltaX = wheelDeltaY = -e.wheelDelta;
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

		that.scrollTo(deltaX, deltaY, 0);
	},

	_mouseout: function (e) {
		var t = e.relatedTarget;

		if (!t) {
			this._end(e);
			return;
		}

		while (t = t.parentNode) if (t == this.wrapper) return;

		this._end(e);
	},

	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind('webkitTransitionEnd');

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
			if (step.time) that._bind('webkitTransitionEnd');
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
		this.scroller.style[vendor + 'TransitionDuration'] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
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

		return { dist: newDist, time: mround(newTime) };
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
		time = mround(m.max(sizeX, sizeY)) || 200;

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

		that.scroller.style[vendor + 'Transform'] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (!that.options.hasTouch) {
			that._unbind('mouseout', that.wrapper);
			that._unbind(WHEEL_EV);
		}

		if (that.options.useTransition) that._unbind('webkitTransitionEnd');

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
		that.scrollerW = mround(that.scroller.offsetWidth * that.scale);
		that.scrollerH = mround((that.scroller.offsetHeight + that.minScrollY) * that.scale);
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
			that.scroller.style[vendor + 'TransitionDuration'] = '0';
			that._resetPos(200);
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
		this._unbind(MOVE_EV);
		this._unbind(END_EV);
		this._unbind(CANCEL_EV);
	},

	enable: function () {
		this.enabled = true;
	},

	stop: function () {
		if (this.options.useTransition) this._unbind('webkitTransitionEnd');
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

		that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';
		that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';
		that.zoomed = false;
	},

	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})();


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
 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.EventFirer = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#fireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#shouldFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	shouldFireEvent: function(type, args) {
		return true;
	},

	/**
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#willFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willFireEvent: function(type, args) {

	},

	/**
	 * @see http://moobilejs.com/doc/0.1/EventFirer/EventFirer#didFireEvent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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

		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
		this.element.addClass(this.animationClass);

		Object.each(this.animationProperties, function(val, key) {
			this.element.setStyle('-webkit-animation-' + key, val);
		}, this);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	detach: function() {

		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.element.removeClass(this.animationClass);

		Object.each(this.animationProperties, function(val, key) {
			this.element.setStyle('-webkit-animation-' + key, null);
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
		this.detach();
		this.fireEvent('stop');

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
		this.detach();
		this.fireEvent('end');
	}

});


/*
---

name: Animation.Set

description: Provides a container for multiple animations.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Animation

provides:
	- Animation.Set

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Animation.Set = new Class({

	Extends: Moobile.Animation,



	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	element: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#animations
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	animations: [],

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#currentAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	currentAnimation: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(element, options) {

		this.parent(element, options);

		delete this.animationClass;
		delete this.animationProperties;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimation: function(name, animation) {

		animation.setName(name);
		animation.setOptions(this.options);

		this.removeAnimation(name);

		animation.addEvent('start', this.bound('onAnimationStart'));
		animation.addEvent('stop', this.bound('onAnimationStop'));
		animation.addEvent('end', this.bound('onAnimationEnd'));

		if (this.element) {
			animation.setElement(this.element);
		}

		this.animations.include(animation);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimation: function(name) {
		return this.animations.find(function(animation) {
			return animation.getName() === name;
		});
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#removeAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAnimation: function(name) {

		var animation = this.getAnimation(name);
		if (animation) {
			animation.cancel();
			animation.removeEvent('start', this.bound('onAnimationStart'));
			animation.removeEvent('stop', this.bound('onAnimationStop'));
			animation.removeEvent('end', this.bound('onAnimationEnd'));

			if (this.currentAnimation === animation) {
				this.currentAnimation = null;
			}

			this.animations.erase(animation);

			animation = null;
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setElement: function(element) {
		this.element = document.id(element);
		this.animations.invoke('setElement', this.element);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElement: function() {
		return this.animations.invoke('getElement');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationClass: function(value) {
		this.animations.invoke('setAnimationClass', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationClass: function() {
		return this.animations.invoke('getAnimationClass');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationName: function(value) {
		this.animations.invoke('setAnimationName', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationName: function() {
		return this.animations.invoke('getAnimationName');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationDuration
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationDuration: function(value) {
		this.animations.invoke('setAnimationDuration', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationDuration
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationDuration: function() {
		return this.animations.invoke('getAnimationDuration');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationIterationCount
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationIterationCount: function(value) {
		this.animations.invoke('setAnimationIterationCount', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationIterationCount
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationIterationCount: function() {
		return this.animations.invoke('getAnimationIterationCount');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationDirection
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationDirection: function(value) {
		this.animations.invoke('setAnimationDirection', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationDirection
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationDirection: function() {
		return this.animations.invoke('getAnimationDirection');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationTimingFunction
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationTimingFunction: function(value) {
		this.animations.invoke('setAnimationTimingFunction', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationTimingFunction
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationTimingFunction: function() {
		return this.animations.invoke('getAnimationTimingFunction');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationFillMode
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationFillMode: function(value) {
		this.animations.invoke('setAnimationFillMode', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationFillMode
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationFillMode: function() {
		return this.animations.invoke('getAnimationFillMode');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#setAnimationDelay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setAnimationDelay: function(value) {
		this.animations.invoke('setAnimationDelay', value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#getAnimationDelay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getAnimationDelay: function() {
		return this.animations.invoke('getAnimationDelay');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#attach
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	attach: function() {
		this.animations.invoke('attach');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#detach
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	detach: function() {
		this.animations.invoke('detach');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#start
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	start: function(name) {

		this.stop();

		var animation = this.getAnimation(name);
		if (animation) {
			this.currentAnimation = animation;
			this.currentAnimation.start();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#stop
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	stop: function() {

		if (this.currentAnimation) {
			this.currentAnimation.stop()
			this.currentAnimation = null;
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation.Set#isRunning
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isRunning: function() {
		return this.animations.some(function(animation) {
			return animation.isRunning();
		});
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onAnimationStart: function() {
		this.fireEvent('start', this.currentAnimation);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onAnimationStop: function() {
		this.fireEvent('stop', this.currentAnimation);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onAnimationEnd: function() {
		this.fireEvent('end', this.currentAnimation);
		this.currentAnimation = null;
	},

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

Browser.Platform.cordova = window.Cordova && Browser.isMobile && !Browser.safari;


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
 * @see    http://moobilejs.com/doc/0.1/Class/Class
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Class.extend({

	/**
	 * @see    http://moobilejs.com/doc/0.1/Class/Class.Instantiate#parse
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parse: function(name) {
		name = name.trim();
		name = name.split('.');
		var func = window;
		for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
		return typeof func === 'function' ? func : null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Class/Class.Instantiate#instantiate
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#ingest
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	ingest: function(element) {
		return this.adopt(Array.from(document.id(element).childNodes));
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#adopt
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
 * @see    http://moobilejs.com/doc/0.1/Element/Element.From#Element-from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Element.from = function(text) {

	switch (typeof text) {
		case 'object': return document.id(text);
		case 'string': return Elements.from(text).pop();
	}

	return null;
};

var elements = {};

/**
 * @see    http://moobilejs.com/doc/0.1/Element/Element.From#Element-at
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
 * @see    http://moobilejs.com/doc/0.1/Element/Element.Role#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Element.defineRole = function(name, context, behavior) {

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
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#setRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 setRole: function(role) {
	 	return this.set('data-role', role);
	 },

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRole
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 getRole: function(role) {
	 	return this.get('data-role');
	 },

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRoleDefinition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	 getRoleDefinition: function(context) {
	 	return (context || this).__roles__
	 	     ? (context || this).__roles__[this.getRole()]
	 	     : null;
	 },

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRoleElement: function(role) {
		return this.getRoleElements(role)[0] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#getRoleElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRoleElements: function(role) {

		var validate = this.ownsRoleElement.bind(this);
		var selector = role
		             ? '[data-role=' + role + ']'
		             : '[data-role]';

		return this.getElements(selector).filter(validate);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#ownsRoleElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	ownsRoleElement: function(element) {

		var parent = element.getParent();
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
	 * @see    http://moobilejs.com/doc/0.1/Element/Element#executeDefinedRoles
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	executeDefinedRoles: function(context) {

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
 * @see    http://moobilejs.com/doc/0.1/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component = new Class({

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
	_window: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_children: [],

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_visible: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_ready: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_style: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	element: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#initialization
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(element, options, name) {

		this.element = Element.from(element);
		if (this.element === null) {
			this.element = new Element(this.options.tagName);
		}

		this._name = name || this.element.get('data-name');

		options = options || {};

		for (var option in this.options) {
			if (options[option] !== undefined) break;
			var attrb = option.hyphenate();
			var value = this.element.get('data-option-' + attrb);
			if (value != null) {
				if (value === 'null') {
					value = null;
				} else if (value === 'false') {
					value = false;
				} else if (value === 'true') {
					value = true
				} else if (/^-{0,1}\d*\.{0,1}\d+$/.test(value)) {
					value = Number(value);
				}
				options[option] = value;
			}
		}

		this.setOptions(options);

		this.willBuild();
		this.build();
		this.didBuild();

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	build: function() {

		var className = this.options.className;
		if (className) this.addClass(className);

		var styleName = this.options.styleName
		if (styleName) this.setStyle(styleName);

		this.element.executeDefinedRoles(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addEvent: function(type, fn, internal) {

		if (Moobile.Component.hasNativeEvent(type))
			this.element.addEvent(type, function(e) {
				this.fireEvent(type, e);
			}.bind(this), internal);

		return this.parent(type, fn, internal);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponent: function(component, where) {

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				if (this.hasElement(element) === false) {
					this.element.grab(element, where);
				}
			}
		}

		return this._addChildComponentAt(component, where === 'top' ? 0 : this._children.length, elementHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponentInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponentInside: function(component, context, where) {

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				context = document.id(context) || this.getElement(context);
				if (this.hasElement(element) === false &&
					this.hasElement(context) === true) {
					context.grab(element, where);
				}
			}
		};

		return this._addChildComponentAt(component, this._children.length, elementHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponentAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponentAfter: function(component, after) {

		var index = this._children.length;
		if (after instanceof Moobile.Component) {
			index = this.getChildComponentIndex(after) + 1;
		}

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				var context = document.id(after);
				if (context) {
					if (this.hasElement(element) === false &&
						this.hasElement(context) === true) {
						element.inject(context, 'after');
					}
				}
			}
		};

		return this._addChildComponentAt(component, index, elementHandler);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addChildComponentBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponentBefore: function(component, before) {

		var index = this._children.length;
		if (before instanceof Moobile.Component) {
			index = this.getChildComponentIndex(before);
		}

		var elementHandler = function() {
			var element = component.getElement();
			if (element) {
				var context = document.id(before);
				if (context) {
					if (this.hasElement(element) === false &&
						this.hasElement(context) === true) {
						element.inject(context, 'before');
					}
				}
			}
		};

		return this._addChildComponentAt(component, index, elementHandler);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_addChildComponentAt: function(component, index, handler) {

		component.removeFromParentComponent();

		this.willAddChildComponent(component);

		this._children.splice(index, 0, component);

		if (handler) handler.call(this);

		var componentParent = component.getParentComponent();
		if (componentParent === null) {
			component.setParentComponent(this);
		}

		this.didAddChildComponent(component);

		var componentWindow = component.getWindow();
		if (componentWindow === null) {
			component.setWindow(this._window);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponent: function(name) {
		return this._children.find(function(child) { return child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentOfType: function(type, name) {
		return this._children.find(function(child) { return child instanceof type && child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentOfTypeAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentOfTypeAt: function(type, index) {
		return this.getChildComponentsOfType(type)[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentIndex: function(component) {
		return this._children.indexOf(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponents: function() {
		return this._children;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildComponentsOfType: function(type) {
		return this._children.filter(function(child) { return child instanceof type });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildComponent: function(component) {
		return this._children.contains(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasChildComponentOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildComponentOfType: function(type) {
		return this._children.some(function(child) { return child instanceof type; });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#replaceChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChildComponent: function(component, replacement, destroy) {
		return this.addChildComponentBefore(replacement, component).removeChildComponent(component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#replaceWithComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceWithComponent: function(component, destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.replaceChildComponent(this, component, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildComponent: function(component, destroy) {

		if (!this.hasChildComponent(component))
			return this;

		this.willRemoveChildComponent(component);

		component.setParentComponent(null);
		component.setWindow(null);
		component.setReady(false);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this._children.erase(component);

		this.didRemoveChildComponent(component);

		if (destroy) {
			component.destroy();
			component = null;
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeAllChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllChildComponents: function(destroy) {
		return this.removeAllChildComponentsOfType(Moobile.Component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeChildComponentsOfType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllChildComponentsOfType: function(type, destroy) {

		this._children.filter(function(child) {
			return child instanceof type;
		}).invoke('removeFromParent', destroy);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#removeFromParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeFromParentComponent: function(destroy) {
		var parent = this.getParentComponent();
		if (parent) parent.removeChildComponent(this, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParentComponent: function(parent) {

		if (this._parent === parent)
			return this;

		this.parentComponentWillChange(parent);
		this._parent = parent;
		this.parentComponentDidChange(parent);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentComponent: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasParentComponent: function() {
		return !!this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setWindow: function(window) {

		if (this._window === window)
			return this;

		this._window = window;

		this._children.invoke('setWindow', window);

		if (this._window) {
			this.setReady(true);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWindow: function() {
		return this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasWindow: function() {
		return !!this._window;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setReady: function(ready) {

		if (this._ready === ready)
			return this;

		this._ready = ready;

		this._children.invoke('setReady', ready);

		if (this._ready) {
			this.didBecomeReady();
			this.fireEvent('ready');
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#isReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isReady: function() {
		return this._ready;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#setStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getStyle: function() {
		return this._style ? this._style.name : null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#toggleClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getElements
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElements: function(selector) {
		return this.element.getElements(selector || '*');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hasElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#getPosition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getPosition: function(relative) {
		return this.element.getPosition(document.id(relative) || this._parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#show
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	show: function() {

		if (this._visible)
			return this;

		this.willShow();
		this._visible = true;
		this.element.show();
		this.element.removeClass('hidden');
		this.didShow();

		return this.fireEvent('show');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hide: function() {

		if (this._visible === false)
			return this;

		this.willHide();
		this._visible = false;
		this.element.hide();
		this.element.addClass('hidden');
		this.didHide();

		return this.fireEvent('hide');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#isVisible
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isVisible: function() {
		return this._visible;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didBuild
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didRemoveChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildComponent: function(component) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#parentComponentWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentComponentWillChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#parentComponentDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentComponentDidChange: function(parent) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didShow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#willHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#didHide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.removeFromParentComponent();
		this.removeAllChildComponents(true);

		this.element.destroy();
		this.element = null;
		this._window = null;
		this._parent = null;

		return this;
	},

	toElement: function() {
		return this.element;
	}

});

/**
 * @see    http://moobilejs.com/doc/0.1/Component/Component#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.defineRole = function(name, target, behavior) {
	Element.defineRole(name, target || Moobile.Component, behavior);
};

/**
 * @see    http://moobilejs.com/doc/0.1/Component/Component#defineStyle
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.defineStyle = function(name, target, behavior) {
	var context = (target || Moobile.Component).prototype;
	if (context.__styles__ === undefined) {
		context.__styles__ = {};
	}
	context.__styles__[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, behavior);
};

/**
 * @see    http://moobilejs.com/doc/0.1/Component/Component#getRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.getStyle = function(name, target) {
	return target.__styles__
		 ? target.__styles__[name]
		 : null;
};

/**
 * @see    http://moobilejs.com/doc/0.1/Component/Component#create
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Component.create = function(klass, element, descriptor) {

	element = Element.from(element);

	if (descriptor) {
		var subclass = element.get(descriptor);
		if (subclass) {
			var instance = Class.instantiate(subclass, element);
			if (instance instanceof klass) {
				return instance;
			}
		}
	}

	return new klass(element);
};

(function() {

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

})();

//<pre-0.1-compat>

Moobile.Component.prototype.addChild = Moobile.Component.prototype.addChildComponent;
Moobile.Component.prototype.addChildInside = Moobile.Component.prototype.addChildComponentInside;
Moobile.Component.prototype.addChildAfter = Moobile.Component.prototype.addChildComponentAfter;
Moobile.Component.prototype.addChildBefore = Moobile.Component.prototype.addChildComponentBefore;
Moobile.Component.prototype.getChild = Moobile.Component.prototype.getChildComponent;
Moobile.Component.prototype.getChildOfType = Moobile.Component.prototype.getChildComponentOfType;
Moobile.Component.prototype.getChildAt = Moobile.Component.prototype.getChildComponentAt;
Moobile.Component.prototype.getChildOfTypeAt = Moobile.Component.prototype.getChildComponentOfTypeAt;
Moobile.Component.prototype.getChildIndex = Moobile.Component.prototype.getChildComponentIndex;
Moobile.Component.prototype.getChildren = Moobile.Component.prototype.getChildComponents;
Moobile.Component.prototype.getChildrenOfType = Moobile.Component.prototype.getChildComponentsOfType;
Moobile.Component.prototype.hasChild = Moobile.Component.prototype.hasChildComponent;
Moobile.Component.prototype.hasChildOfType = Moobile.Component.prototype.hasChildComponentOfType;
Moobile.Component.prototype.replaceChild = Moobile.Component.prototype.replaceChildComponent;
Moobile.Component.prototype.replaceWith = Moobile.Component.prototype.replaceWithComponent;
Moobile.Component.prototype.removeChild = Moobile.Component.prototype.removeChildComponent;
Moobile.Component.prototype.removeChildren = Moobile.Component.prototype.removeAllChildComponents;
Moobile.Component.prototype.removeChildrenOfType = Moobile.Component.prototype.removeAllChildComponentsOfType;
Moobile.Component.prototype.removeFromParent = Moobile.Component.prototype.removeFromParentComponent;
Moobile.Component.prototype.setParent = Moobile.Component.prototype.setParentComponent;
Moobile.Component.prototype.getParent = Moobile.Component.prototype.getParentComponent;
Moobile.Component.prototype.hasParent = Moobile.Component.prototype.hasParentComponent;

Moobile.Component.prototype.willAddChild = function() {
	throw new Error('This method is deprecated, use "willAddChildComponent" instead');
};

Moobile.Component.prototype.didAddChild = function() {
	throw new Error('This method is deprecated, use "didAddChildComponent" instead');
};

Moobile.Component.prototype.willRemoveChild = function() {
	throw new Error('This method is deprecated, use "willRemoveChildComponent" instead');
};

Moobile.Component.prototype.didRemoveChild = function() {
	throw new Error('This method is deprecated, use "didRemoveChildComponent" instead');
};

Moobile.Component.prototype.parentWillChange = function() {
	throw new Error('This method is deprecated, use "parentComponentWillChange" instead');
};

Moobile.Component.prototype.parentDidChange = function() {
	throw new Error('This method is deprecated, use "parentComponentDidChange" instead');
};

//</pre-0.1-compat>


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
 * @see    http://moobilejs.com/doc/0.1/Control/Control
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Control = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_state: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		className: null,
		styleName: null
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	_getState: function() {
		return this._state;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#shouldAllowState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	shouldAllowState: function(state) {
		return ['highlighted', 'selected', 'disabled'].contains(state);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#setDisabled
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDisabled: function(disabled) {
		return this._setState(disabled ? 'disabled' : null);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#isDisabled
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isDisabled: function() {
		return this._getState() == 'disabled';
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#setSelected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelected: function(selected) {
		return this._setState(selected ? 'selected' : null);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#isSelected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isSelected: function() {
		return this._getState() == 'selected';
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#setHighlighted
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setHighlighted: function(highlighted) {
		return this._setState(highlighted ? 'highlighted' : null);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#isHighlighted
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isHighlighted: function() {
		return this._getState() == 'highlighted';
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#willChangeState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willChangeState: function(state) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Control#didChangeState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didChangeState: function(state) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
 * @see    http://moobilejs.com/doc/0.1/Control/Button
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Button = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_label: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('button');

		var label = this.element.getRoleElement('label');
		if (label === null) {
			label = new Element('div');
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
	 * @since  0.1
	 */
	destroy: function() {
		this.removeEvent('tapstart', this.bound('_onTapStart'));
		this.removeEvent('tapend', this.bound('_onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Button#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		if (typeof label === 'string') {
			label = new Moobile.Text().setText(label);
		}

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('button-label');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Button#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTapStart: function(e) {
		if (!this.isSelected()) this.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTapEnd: function(e) {
		if (!this.isSelected()) this.setHighlighted(false);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('button', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Button, element, 'data-button'));
});

Moobile.Component.defineRole('label', Moobile.Button, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('active', Moobile.Button, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

Moobile.Component.defineStyle('warning', Moobile.Button, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

Moobile.Component.defineStyle('back', Moobile.Button, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

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
 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ButtonGroup = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectedButton: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectedButtonIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		deselectable: false,
		selectedButtonIndex: -1
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('button-group');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.setSelectedButtonIndex(this.options.selectedButtonIndex);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._selectedButton = null;
		this._selectedButtonIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#setSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectedButton: function(selectedButton) {

		if (this._selectedButton === selectedButton) {
			if (selectedButton && this.options.deselectable) {
				selectedButton = null;
			} else {
				return this;
			}
		}

		if (this._selectedButton) {
			this.fireEvent('deselect', this._selectedButton);
			this._selectedButton.setSelected(false);
			this._selectedButton = null;
		}

		if (selectedButton) {
			this._selectedButton = selectedButton;
			this._selectedButton.setSelected(true);
			this.fireEvent('select', this._selectedButton);
		}

		this._selectedButtonIndex = selectedButton ? this.getChildComponentIndex(selectedButton) : -1;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#getSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedButton: function() {
		return this._selectedButton;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#setSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectedButtonIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentOfTypeAt(Moobile.Button, index);
		}

		return this.setSelectedButton(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#getSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedButtonIndex: function() {
		return this._selectedButtonIndex;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#clearSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	clearSelectedButton: function() {
		this.setSelectedButton(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addButton: function(button, where) {
		return this.addChildComponent(button, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(button, after);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(button, before);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getButtons: function() {
		return this.getChildComponentsOfType(Moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ButtonGroup#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponentsOfType(Moobile.Button, destroy);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.removeEvent('tap', this.bound('onButtonTap'));
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('vertical', Moobile.ButtonGroup, {
	attach: function(element) { element.addClass('style-vertical'); },
	detach: function(element) { element.removeClass('style-vertical'); }
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
 * @see    http://moobilejs.com/doc/0.1/Control/Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Bar = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_item: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('bar');

		var item = this.element.getRoleElement('item');
		if (item === null) {
			item = new Element('div');
			item.ingest(this.element);
			item.inject(this.element);
			item.setRole('item');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._item = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Bar#setItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/Control/Bar#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItem: function() {
		return this._item;
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('bar', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Bar, element, 'data-bar'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
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
 * @see    http://moobilejs.com/doc/0.1/Control/BarItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.BarItem = new Class({

	Extends: Moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('bar-item');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.Bar, function(element) {
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
 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('navigation-bar');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('navigation-bar', null, function(element) {
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
 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.NavigationBarItem = new Class({

	Extends: Moobile.BarItem,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_title: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('navigation-bar-item');

		var title = this.element.getRoleElement('title');
		if (title === null) {
			title = new Element('div');
			title.ingest(this.element);
			title.inject(this.element);
			title.setRole('title');
		}

		var wrapper = this.element.getElement('.bar-title');
		if (wrapper == null) {
			wrapper = new Element('div.bar-title');
			wrapper.wraps(title);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._title = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		if (typeof title === 'string') {
			title = new Moobile.Text().setText(title);
		}

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, null, '.bar-title');
		}

		this._title = title;
		this._title.addClass('title');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#addLeftButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addLeftButton: function(button) {
		return this.addChildComponent(button, 'top');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#addRightButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addRightButton: function(button) {
		return this.addChildComponent(button, 'bottom');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/NavigationBarItem#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponents(Moobile.Button, destroy);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.NavigationBar, function(element) {
	this.setItem(Moobile.Component.create(Moobile.NavigationBarItem, element, 'data-item'));
});

Moobile.Component.defineRole('title', Moobile.NavigationBarItem, function(element) {
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

Class.refactor(Slider, {

	draggedKnob: function() {
		this.fireEvent('move', this.drag.value.now[this.axis]);
		this.previous();
	}

});

/**
 * @see    http://moobilejs.com/doc/0.1/Control/Slider
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Slider = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_value: 0,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#slider
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	slider: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#track
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	trackElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#thumb
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	thumbElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		snap: false,
		mode: 'horizontal',
		min: 0,
		max: 100,
		background: true,
		backgroundSize: 2048,
		value: 0
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('slider');
		this.thumbElement = new Element('div.slider-thumb');
		this.trackElement = new Element('div.slider-track');
		this.trackElement.grab(this.thumbElement);

		this.element.empty();
		this.element.grab(this.trackElement);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {

		this.parent();

		var options = {
			snap: this.options.snap,
			steps: this.options.max - this.options.min,
			range: [this.options.min, this.options.max],
			mode: this.options.mode
		};

		this.slider = new Slider(this.trackElement, this.thumbElement, options);
		this.slider.addEvent('move', this.bound('_onMove'));
		this.slider.addEvent('tick', this.bound('_onTick'));
		this.slider.addEvent('change', this.bound('_onChange'));

		this.setValue(this.options.value);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.thumbElement = null;
		this.trackElement = null;
		this.slider = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setValue: function(value) {
		this.slider.set(this._value = value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getValue: function() {
		return this._value;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_updateTrack: function(position) {
		this.trackElement.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumbElement.getSize().x / 2)
		);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onMove: function(position) {
		this._updateTrack(position);
		this.fireEvent('move', position);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTick: function(position) {
		this._updateTrack(position);
		this.fireEvent('tick', position);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onChange: function(step) {
		this._value = step;
		this._updateTrack(this.slider.toPosition(step));
		this.fireEvent('change', step);
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
 * @see    http://moobilejs.com/doc/0.1/Control/List
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.List = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectable: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectedItem: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectedItemIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'ul',
		selectable: true,
		selectedItemIndex: -1
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('list');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.setSelectable(this.options.selectable);
		this.setSelectedItemIndex(this.options.selectedItemIndex);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._selectedItem = null;
		this._selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#setSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectedItem: function(selectedItem) {

		if (this._selectable == false)
			return this;

		if (this._selectedItem === selectedItem)
			return this;

		if (this._selectedItem) {
			this._selectedItem.setSelected(false);
			this._selectedItem = null;
			this.fireEvent('deselect', this._selectedItem);
		}

		if (selectedItem) {
			this._selectedItem = selectedItem;
			this._selectedItem.setSelected(true);
			this.fireEvent('select', this._selectedItem);
		}

		this._selectedItemIndex = selectedItem ? this.getChildComponentIndex(selectedItem) : -1;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedItem: function() {
		return this._selectedItem;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#setSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectedItemIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentOfTypeAt(Moobile.ListItem, index);
		}

		return this.setSelectedItem(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedItemIndex: function() {
		return this._selectedItemIndex
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#clearSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#addItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItem: function(item, where) {
		return this.addChildComponent(item, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#addItemAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItemAfter: function(item, after) {
		return this.addChildComponentAfter(item, after);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#addItemBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItemBefore: function(item, before) {
		return this.addChildComponentBefore(item, before);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItem: function(name) {
		return this.getChildComponentOfType(Moobile.ListItem, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItemAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItemAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.ListItem, index)
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItemIndex: function(item) {
		return this.getChildComponentIndex(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItems: function() {
		return this.getChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#removeItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeItem: function(item) {
		return this.removeChildComponent(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#removeAllItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllItems: function() {
		return this.removeAllChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(selectable) {
		this._selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this._selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildComponent: function(component) {
		this.parent(component);
		if (component instanceof Moobile.ListItem) {
			component.addEvent('tapstart', this.bound('_onItemTapStart'));
			component.addEvent('tapend', this.bound('_onItemTapEnd'));
			component.addEvent('tap', this.bound('_onItemTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
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
	 * @since  0.1
	 */
	_onItemTapStart: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onItemTapEnd: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
 * @see    http://moobilejs.com/doc/0.1/Control/ListItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ListItem = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_detail: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'li'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('list-item');

		var image  = this.element.getRoleElement('image');
		var label  = this.element.getRoleElement('label');
		var detail = this.element.getRoleElement('detail');

		if (label === null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		if (image === null) {
			image = new Element('img');
			image.inject(this.element, 'top');
			image.setRole('image');
		}

		if (detail === null) {
			detail = new Element('div');
			detail.inject(this.element);
			detail.setRole('detail');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._label = null;
		this._image = null;
		this._detail = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		if (typeof label === 'string') {
			label = new Moobile.Text().setText(label);
		}

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('list-item-label');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setImage: function(image) {

		if (this._image === image)
			return this;

		if (typeof image === 'string') {
			image = new Moobile.Image().setSource(image);
		}

		if (this._image) {
			this._image.replaceWithComponent(image, true);
		} else {
			this.addChildComponent(image);
		}

		this._image = image;
		this._image.addClass('list-item-image');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#setDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDetail: function(detail) {

		if (this._detail === detail)
			return this;

		if (typeof detail === 'string') {
			detail = new Moobile.Text().setText(detail);
		}

		if (this._detail) {
			this._detail.replaceWithComponent(detail, true);
		} else {
			this.addChildComponent(detail);
		}

		this._detail = detail;
		this._detail.addClass('list-item-detail');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#getDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getDetail: function() {
		return this._detail;
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('list-item', Moobile.List, function(element) {
	this.addItem(Moobile.Component.create(Moobile.ListItem, element, 'data-list-item'));
});

Moobile.Component.defineRole('image', Moobile.ListItem, function(element) {
	this.setImage(Moobile.Component.create(Moobile.Image, element, 'data-image'));
});

Moobile.Component.defineRole('label', Moobile.ListItem, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});

Moobile.Component.defineRole('detail', Moobile.ListItem, function(element) {
	this.setDetail(Moobile.Component.create(Moobile.Text, element, 'data-detail'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('checked', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

Moobile.Component.defineStyle('disclosed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

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
 * @see    http://moobilejs.com/doc/0.1/Control/ActivityIndicator
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ActivityIndicator = new Class({

	Extends: Moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('activity-indicator');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ActivityIndicator#start
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	start: function() {
		return this.addClass('activity');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ActivityIndicator#stop
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	stop: function() {
		return this.removeClass('activity');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('activity-indicator', null, function(element) {
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
 * @see    http://moobilejs.com/doc/0.1/Control/Image
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Image = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_source: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_loaded: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_originalSize: {
		x: 0,
		y: 0
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'img',
		preload: false
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		if (this.element.get('tag') !== 'img')
			throw new Error('Moobile.Image requires an <img> element.');

		this.element.addClass('image');

		this.hide();

		var source = this.element.get('src');
		if (source) {
			this.setSource(source);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._image = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#setSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSource: function(source) {

		this._source = source;

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
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#getSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSource: function() {
		return this._source;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#getOriginalSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getOriginalSize: function() {
		return this._originalSize;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#isLoaded
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isLoaded: function() {
		return this._loaded;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_load: function() {

		this._loaded = true;

		if (this.options.preload) {
			this._originalSize.x = 0;
			this._originalSize.y = 0;
		}

		this.element.set('src', this._source);
		this.fireEvent('load');
		this.show();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_unload: function() {

		this._loaded = false;

		if (this.options.preload) {
			this._originalSize.x = this._image.width;
			this._originalSize.y = this._image.height;
		}

		this.element.erase('src');
		this.fireEvent('unload');
		this.hide();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onLoad: function() {
		this._load();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('image', null, function(element) {
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
 * @see    http://moobilejs.com/doc/0.1/Control/Text
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Text = new Class({

	Extends: Moobile.Control,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Text#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'span'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('text');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Text#setText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setText: function(text) {
		this.element.set('html', text);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Text#getText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getText: function() {
		return this.element.get('html');
	}

});

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
 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Alert = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_message: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_buttons: [],

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#wrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	wrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#headerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	headerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#footerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	footerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#overlay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	overlay: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		buttonLayout: 'vertical'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('alert');
		this.element.addEvent('animationend', this.bound('_onAnimationEnd'));

		this.overlay = new Moobile.Overlay();
		this.overlay.setStyle('radial');
		this.addChildComponent(this.overlay);

		this.headerElement  = new Element('div.alert-header');
		this.footerElement  = new Element('div.alert-footer');
		this.contentElement = new Element('div.alert-content');

		this.wrapperElement = new Element('div.alert-wrapper');
		this.wrapperElement.grab(this.headerElement);
		this.wrapperElement.grab(this.contentElement);
		this.wrapperElement.grab(this.footerElement);

		this.element.grab(this.wrapperElement);

		var buttonLayout = this.options.buttonLayout;
		if (buttonLayout) {
			this.element.addClass('button-layout-' + buttonLayout);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.element.addEvent('animationend', this.bound('_onAnimationEnd'));

		this._title = null;
		this._message = null;

		this.wrapperElement = null;
		this.headerElement = null;
		this.footerElement = null;
		this.contentElement = null;

		this.overlay.destroy();
		this.overlay = null;

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		if (typeof title === 'string') {
			title = new Moobile.Text().setText(title);
		}

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.headerElement);
		}

		this._title = title;
		this._title.addClass('title');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#setMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setMessage: function(message) {

		if (this._message === message)
			return this;

		if (typeof message === 'string') {
			message = new Moobile.Text().setText(message);
		}

		if (this._message) {
			this._message.replaceWithComponent(message, true);
		} else {
			this.addChildComponentInside(message, this.contentElement);
		}

		this._message = message;
		this._message.addClass('message');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#getMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMessage: function() {
		return this._message;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addButton: function(button) {

		if (typeof button === 'string') {
			button = new Moobile.Button().setLabel(button);
		}

		return this.addChildComponentInside(button, this.footerElement);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#setDefaultButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDefaultButton: function(button) {
		if (this.hasChildComponent(button)) button.addClass('default');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#setDefaultButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDefaultButtonIndex: function(index) {
		return this.setDefaultButton(this.getChildComponentOfTypeAt(Moobile.Button, index));
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#showAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('show-animated');
		this.overlay.showAnimated();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert#hideAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	didAddChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.addEvent('tap', this.bound('_onButtonTap'));
			this._buttons.include(child);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.removeEvent('tap', this.bound('_onButtonTap'));
			this._buttons.erase(child);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {
		this.parent();
		if (this._buttons.length === 0) {
			var button = new Moobile.Button();
			button.setLabel('OK');
			this.addButton(button);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {
		this.parent();
		this.destroy();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	_onAnimationEnd: function(e) {

		e.stop();

		if (this.element.hasClass('show-animated')) {
			this.element.removeClass('show-animated');
			this.didShow();
		}

		if (this.element.hasClass('hide-animated')) {
			this.element.removeClass('hide-animated');
			this.element.hide();
			this.didHide();
		}
	}

});


/*
---

name: Popover

description: Provides a Popover control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Component

provides:
	- Popover

...
*/

Moobile.Popover = new Class({

	Extends: Moobile.Component,

	content: null,

	visible: false,

	options: {
		autoHide: true,
		autoHideAnimated: true,
		direction: 'top',
		alignment: 'center'
	},

	willBuild: function() {

		this.parent();

		this.element.addClass('popover');
		this.element.addClass('popover-direction-' + this.options.direction);
		this.element.addClass('popover-alignment-' + this.options.alignment);

		this.contentElement = new Element('div.popover-content');
		this.contentElement.inject(this.element);

		this.animations = new Moobile.Animation.Set();
		this.animations.setAnimation('show', new Moobile.Animation().setAnimationClass('show-animated'));
		this.animations.setAnimation('hide', new Moobile.Animation().setAnimationClass('hide-animated'));
		this.animations.setElement(this);

		this.animations.addEvent('start', this.bound('_onAnimationSetStart'));
		this.animations.addEvent('end', this.bound('_onAnimationSetEnd'));

		this.hide();
	},

	didBecomeReady: function() {
		this.parent();
		if (this.options.autoHide) this.getWindow().addEvent('tap', this.bound('_onTapOut'));
	},

	destroy: function() {
		if (this.options.autoHide) {
			var window = this.getWindow();
			if (window) {
				window.removeEvent('tap', this.bound('_onTapOut'));
			}
		}
		this.parent();
	},

	addChild: function(component, where) {
		if (where === 'header') return this.parent(child, 'top');
		if (where === 'footer') return this.parent(child, 'bottom');
		return this.addChildComponentInside(component, this.contentElement, where);
	},

	position: function(x, y) {

		if (!this.isReady()) throw new Error('Popover is not ready therefore cannot be positionned');

		this.element.show();
		var size = this.element.getSize();
		this.element.hide();

		if (x instanceof Element || x instanceof Moobile.Component) {

			var relative = y instanceof Element || y instanceof Moobile.Component ? y : null;

			var s = x.getSize();
			var p = x.getPosition(relative);

			switch (this.options.direction) {
				case 'top':
					x = p.x + s.x / 2;
					y = p.y + s.y;
					break;
				case 'bottom':
					x = p.x + s.x / 2;
					y = p.y;
					break;
				case 'left':
					x = p.x + s.x;
					y = p.y + s.y / 2;
					break;
				case 'right':
					x = p.x;
					y = p.y + s.y / 2;
					break;
			}
		}

		switch (this.options.direction) {
			case 'top':
				// y = y;
				break;
			case 'bottom':
				y = y - size.y;
				break;
			case 'left':
				// x = x;
				break;
			case 'right':
				x = x - size.x;
				break;
		}

		switch (this.options.alignment) {
			case 'left':
				// x = x;
				break;
			case 'right':
				x = x - size.x;
				break;
			case 'center':
				x = x - size.x / 2;
				break;
			case 'top':
				// y = y;
				break;
			case 'bottom':
				y = y - size.y;
				break;
			case 'middle':
				y = y - size.y / 2;
				break;
		}

		this.element.setStyle('top', Math.round(y));
		this.element.setStyle('left', Math.round(x));
	},

	showAnimated: function() {
		this.animations.start('show');
		return this;
	},

	hideAnimated: function() {
		this.animations.start('hide');
		return this;
	},

	_onTapOut: function(e, sender) {
		if (this.options.autoHide && this.isVisible() && !this.element.contains(e.target)) {
			if (this.options.autoHideAnimated) {
				this.hideAnimated();
			} else {
				this.hide();
			}
		}
	},

	_onAnimationSetStart: function(animation) {
		switch (animation.getName()) {
			case 'show':
				this.willShow();
				this.element.show();
				break;
			case 'hide':
				this.willHide();
				break;
		}
	},

	_onAnimationSetEnd: function(animation) {
		switch (animation.getName()) {
			case 'show':
				this._visible = true;
				this.element.removeClass('hidden');
				this.didShow();
				this.fireEvent('show');
				break;
			case 'hide':
				this._visible = false;
				this.element.hide();
				this.element.addClass('hidden');
				this.didHide();
				this.fireEvent('hide');
				break;
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

	getPrefixed: function (property) {

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
		if (parent) {
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
	- Core/Event
	- Core/Element
	- Core/Element.Event

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
Element.Events['transitionend'] = { base: (prefix + 'TransitionEnd') };

Element.NativeEvents[prefix + 'AnimationEnd'] = 2;
Element.Events['animationend'] = { base: (prefix + 'AnimationEnd') };

})();


/*
---

name: Event.Rotate

description: Provides an event that indicates the window rotated.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Custom-Event/Element.defineCustomEvent

provides:
	- Event.Rotate

...
*/

(function() {

if (!window.orientation) window.orientation = 0;
if (!window.orientationName) window.orientationName = 'portrait';

var orientation = function() {
	window.orientationName = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
};

Element.defineCustomEvent('rotate', {

	base: 'orientationchange',

	condition: function(e) {
		orientation();
		return true;
	}

});

orientation();

})();

/*
---

name: Mouse

description: Maps mouse events to their touch counterparts

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Custom-Event/Element.defineCustomEvent, Browser.Features.Touch]

provides: Mouse

...
*/

if (!Browser.Features.Touch) (function(){

var condition = function(event){
	event.targetTouches = [];
	event.changedTouches = event.touches = [{
		pageX: event.page.x, pageY: event.page.y,
		clientX: event.client.x, clientY: event.client.y
	}];

	return true;
};

Element.defineCustomEvent('touchstart', {

	base: 'mousedown',

	condition: condition

}).defineCustomEvent('touchmove', {

	base: 'mousemove',

	condition: condition

}).defineCustomEvent('touchend', {

	base: 'mouseup',

	condition: condition

});

})();


/*
---

name: Event.Mouse

description: Correctly translate the touchmove using mouse events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Mobile/Mouse

provides:
	- Event.Mouse

...
*/

if (!Browser.Features.Touch) (function() {

var mouseDown = false;

var onMouseMoveStart = function(e) {
	mouseDown = true;
};

var onMouseMoveEnd = function(e) {
	mouseDown = false;
};

Element.defineCustomEvent('touchmove', {

	base: 'touchmove',

	condition: function(e) {

		e.targetTouches = [];
		e.changedTouches = e.touches = [{
			pageX: e.page.x,
			pageY: e.page.y,
			clientX: e.client.x,
			clientY: e.client.y
		}];

		return mouseDown;
	},

	onSetup: function() {
		this.addEvent('mousedown', onMouseMoveStart);
		this.addEvent('mouseup', onMouseMoveEnd);
	},

	onTeardown: function() {
		this.removeEvent('mousedown', onMouseMoveStart);
		this.removeEvent('mouseup', onMouseMoveEnd);
	}

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
 * @see    http://moobilejs.com/doc/0.1/Request/Request
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Request = new Class({

	Extends: Request,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Request/Request#options
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

description: Provides a wrapper for the iScroll scroller.

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
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_startScroll: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_startTime: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_startPage: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#page
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_page: {
		x: 0,
		y: 0
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#engine
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	engine: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#wrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		engine: ['Native', 'IScroll'],
		momentum: true,
		scrollX: true,
		scrollY: true,
		snapToPage: false,
		snapToPageAt: 35,
		snapToPageDuration: 150,
		snapToPageDelay: 150
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		this.setOptions(options);

		if (this.options.snapToPage)
			this.options.momentum = false;

		var engine  = null;
		var engines = Array.from(this.options.engine);

		for (var i = 0; i < engines.length; i++) {

			var candidate = Moobile.Scroller.Engine[engines[i]];
			if (candidate === undefined) {
				throw new Error('The scroller engine ' + candidate + ' does not exists');
			}

			if (candidate.supportsCurrentPlatform === undefined ||
				candidate.supportsCurrentPlatform &&
				candidate.supportsCurrentPlatform.call(this)) {
				engine = candidate;
				break;
			}
		}

		if (engine === null) {
			throw new Error('There are no scrolling engine available');
		}

		var options = {
			momentum: this.options.momentum,
			scrollX: this.options.scrollX,
			scrollY: this.options.scrollY
		};

		this.engine = new engine(content, options);
		this.engine.addEvent('dragstart', this.bound('_onDragStart'));
		this.engine.addEvent('dragend', this.bound('_onDragEnd'));
		this.engine.addEvent('scroll', this.bound('_onScroll'));

		this.wrapperElement = this.getWrapperElement();
		this.contentElement = this.getContentElement();

		var classes = this.contentElement.get('class');
		if (classes) {
			classes.split(' ').each(function(klass) {
				this.wrapperElement.addClass(klass + '-wrapper');
			}, this);
		}

		this.wrapperElement.addClass('scroll');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.engine.destroy();
		this.engine = null;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this.engine.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#scrollToPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToPage: function(pageX, pageY, time) {

		pageX = pageX || 0;
		pageY = pageY || 0;

		var frame = this.getSize();
		var scroll = this.getScrollSize();

		var maxPageX = Math.ceil(scroll.x / frame.x) - 1;
		var maxPageY = Math.ceil(scroll.y / frame.y) - 1;

		if (pageX < 0) pageX = 0;
		if (pageY < 0) pageY = 0;

		if (pageX > maxPageX) pageX = maxPageX;
		if (pageY > maxPageY) pageY = maxPageY;

		var x = frame.x * pageX;
		var y = frame.y * pageY;

		if (pageX === maxPageX) x = scroll.x - frame.x;
		if (pageY === maxPageY) y = scroll.y - frame.y;

		this.scrollTo(x, y, time);

		this._page.x = pageX;
		this._page.y = pageY;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this.engine.scrollToElement(document.id(element), time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#snap
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	snap: function() {

		var frame = this.getSize();
		var scroll = this.getScroll();

		var time = Date.now() - this._startTime;

		var pageX = this._startPage.x;
		var pageY = this._startPage.y;

		var moveX = Math.round((scroll.x - this._startScroll.x) * 100 / frame.x);
		var moveY = Math.round((scroll.y - this._startScroll.y) * 100 / frame.y);

		var dirX = moveX >= 0 ? 1 : -1;
		var dirY = moveY >= 0 ? 1 : -1;

		if (Math.abs(this._startScroll.x - scroll.x) < 10) dirX = 0;
		if (Math.abs(this._startScroll.y - scroll.y) < 10) dirY = 0;

		if (Math.abs(moveX) >= this.options.snapToPageAt || time <= this.options.snapToPageDelay) pageX += dirX;
		if (Math.abs(moveY) >= this.options.snapToPageAt || time <= this.options.snapToPageDelay) pageY += dirY;

		this.scrollToPage(pageX, pageY, this.options.snapToPageDuration);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		this.engine.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.engine.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return this.engine.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this.engine.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getPage: function() {
		return this._page;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentElement: function() {
		return this.engine.getContentElement();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWrapperElement: function() {
		return this.engine.getWrapperElement();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onDragStart: function() {
		this._startScroll = this.getScroll();
		this._startPage = this.getPage();
		this._startTime = Date.now();
		this.fireEvent('dragstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onDragEnd: function() {

		if (this.options.snapToPage)
			this.snap();

		this._startScroll = null;
		this._startPage = null;
		this._startTime = null;

		this.fireEvent('dragend');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScroll: function() {
		this._page.x = Math.floor(this.getScroll().x / this.getSize().x);
		this._page.y = Math.floor(this.getScroll().y / this.getSize().y);
		this.fireEvent('scroll');
	}

});

(function() {

window.addEvent('domready', function(e) {

	var pos = null;

	document.addEvent('touchstart', function(e) {
		pos = e.client;
	});

	document.addEvent('touchmove', function(e) {

		if (e.target.getParent('.scroll') === null) {
			e.preventDefault();
		} else {

			//
			// TODO
			// This part has to be improved, right now only a pure horizontal
			// move will allow the whole thing to move
			//

			//if (Math.abs(e.client.y - pos.y) > Math.abs(e.client.x - pos.x))
			//	e.preventDefault();
		}
	});
});

})();


/*
---

name: Scroller.Engine

description: Provides the base class for scroller engines.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventFirer

provides:
	- Scroller.Engine

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.Scroller) window.Moobile.Scroller = {};

/**
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller.Engine = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#wrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		momentum: true,
		scrollX: true,
		scrollY: true,
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		content = document.id(content);

		this.setOptions(options);

		this.wrapperElement = new Element('div');
		this.wrapperElement.wraps(content);
		this.contentElement = content;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.contentElement.wraps(this.wrapperElement);
		this.contentElement = null;

		this.wrapperElement.destroy();
		this.wrapperElement = null;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentElement: function() {
		return this.contentElement;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWrapperElement: function() {
		return this.wrapperElement;
	}

});


/*
---

name: Scroller.Engine.scroller

description: Provides a wrapper for the scroller scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.scroller

...
*/

(function() {

iScroll.prototype._currentSize = {x: 0, y: 0};

var _checkDOMChanges = iScroll.prototype._checkDOMChanges;

iScroll.prototype._checkDOMChanges = function() {

	_checkDOMChanges.call(this);

	var size = this.wrapper.getSize();
	if (this._currentSize.x != size.x || this._currentSize.y != size.y) {
		this._currentSize = size;
		this.refresh();
	}
};

})();

/**
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller.Engine.IScroll = new Class({

	Extends: Moobile.Scroller.Engine,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scroller: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		this.parent(content, options);

		this.wrapperElement.addClass('scroll-engine-iscroll');

		var options = {
			hScroll: this.options.scrollX,
			vScroll: this.options.scrollY,
			momentum: this.options.momentum,
			bounce: this.options.momentum,
			hScrollbar: this.options.momentum,
			vScrollbar: this.options.momentum,
			useTransform: true,
			useTransition: true,
			hideScrollbar: true,
			fadeScrollbar: true,
			checkDOMChanges: true,
			snap: false,
			onScrollMove: this.bound('_onScrollMove'),
			onScrollEnd: this.bound('_onScrollEnd')
		};

		this.scroller = new iScroll(this.wrapperElement, options);

		this.wrapperElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.wrapperElement.addEvent('touchend', this.bound('_onTouchEnd'));

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.scroller.destroy();
		this.parent();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		(function() { this.scroller.scrollTo(-x, -y, time); }).delay(5, this);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		var p = element.getPosition(this.contentElement);
		this.scrollTo(p.x, p.y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		this.scroller.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.wrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return {x: -this.scroller.x, y: -this.scroller.y};
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchStart: function() {
		this.fireEvent('dragstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchEnd: function() {
		this.fireEvent('dragend');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScrollMove: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScrollEnd: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onOrientationChange: function() {
		this.refresh();
	}

});

Moobile.Scroller.Engine.IScroll.supportsCurrentPlatform = function() {
	return true;
};


/*
---

name: Scroller.Engine.Native

description: Provides a native scroller engine.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.Native

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller.Engine.Native = new Class({

	Extends: Moobile.Scroller.Engine,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scroller: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scrolling
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrolling: false,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		this.parent(content, options);

		this.wrapperElement.addClass('scroll-engine-native');

		this.wrapperElement.setStyle('overflow-x', this.options.scrollX ? 'scroll' : 'hidden');
		this.wrapperElement.setStyle('overflow-y', this.options.scrollY ? 'scroll' : 'hidden');
		this.wrapperElement.setStyle('-webkit-overflow-scrolling', this.options.momentum ? 'touch' : 'auto');

		this.scroller = new Fx.Scroll(this.wrapperElement);

		this.wrapperElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.wrapperElement.addEvent('touchend', this.bound('_onTouchEnd'));
		this.wrapperElement.addEvent('scroll', this.bound('_onScroll'));

		window.addEvent('rotate', this.bound('_onWindowRotate'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		window.removeEvent('rotate', this.bound('_onWindowRotate'));
		this.scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {

		time = time || 0;

		this.scroller.setOptions({duration: time});
		this.scroller.start(x, y);
		// TODO: proper events
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {

		time = time || 0;

		element = document.id(element);

		this.scroller.setOptions({duration: time});
		this.scroller.toElement(element);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {

		var wrapperSize = this.getSize();
		var contentSize = this.getScrollSize();

		if (contentSize.y <= wrapperSize.y) {
			this.contentElement.setStyle('min-height', wrapperSize.y + 2);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.wrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return this.wrapperElement.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchStart: function() {

		var scroll = this.wrapperElement.getScroll();
		if (scroll.x === 0) {

			if (scroll.y <= 0) {

				// offset scroll top
				this.wrapperElement.scrollTo(0, 1);

			} else {

				// offset scroll bottom
				var totalSize = this.wrapperElement.getScrollSize();
				var frameSize = this.wrapperElement.getSize();
				if (frameSize.y + scroll.y >= totalSize.y) {
					this.wrapperElement.scrollTo(0, scroll.y - 1);
				}
			}
		}

		this.fireEvent('dragstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchEnd: function() {
		this.fireEvent('dragend');
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
	 * @since  0.1.0
	 */
	_onWindowRotate: function(e) {
		this.refresh();
	}

});

Moobile.Scroller.Engine.Native.supportsCurrentPlatform = function() {
	return 'WebkitOverflowScrolling' in new Element('div').style;
};


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

/**
 * @see    http://moobilejs.com/doc/0.1/Util/Overlay
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
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
		this.element.addClass('overlay');
		this.element.addEvent('animationend', this.bound('_onAnimationEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.element.removeEvent('animationend', this.bound('_onAnimationEnd'));
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Util/Overlay#showAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('show-animated');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Util/Overlay#hideAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Util/Overlay#_onAnimationEnd
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onAnimationEnd: function(e) {

		e.stop();

		if (this.element.hasClass('show-animated')) {
			this.element.removeClass('show-animated');
			this.didShow();
		}

		if (this.element.hasClass('hide-animated')) {
			this.element.removeClass('hide-animated');
			this.element.hide();
			this.didHide();
		}
	}

});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('radial', Moobile.Bar, {
	attach: function(element) { element.addClass('style-radial'); },
	detach: function(element) { element.removeClass('style-radial'); }
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
 * @see    http://moobilejs.com/doc/0.1/Types/String
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
String.implement({

	/**
	 * @see    http://moobilejs.com/doc/0.1/Types/String#toCamelCase
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
 * @see    http://moobilejs.com/doc/0.1/Types/Array
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Array.implement({

	/**
	 * @see    http://moobilejs.com/doc/0.1/Types/Array#find
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
	 * @see    http://moobilejs.com/doc/0.1/Types/Array#getLastItemAtOffset
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
 * @see    http://moobilejs.com/doc/0.1/View/View
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.View = new Class({

	Extends: Moobile.Component,

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#content
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	contentElement: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('view');

		var content = this.element.getRoleElement('view-content');
		if (content === null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
			content.setRole('view-content');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.contentElement = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#enableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enableTouch: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#disableTouch
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	disableTouch: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildComponent: function(component, where) {
		if (where === 'header') return this.parent(component, 'top');
		if (where === 'footer') return this.parent(component, 'bottom');
		return this.addChildComponentInside(component, this.contentElement, where);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildComponent: function(component) {
		this.parent(component);
		component.setParentView(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		component.setParentView(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#setContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setContentElement: function(content) {

		if (this.contentElement === content)
			return this;

		if (this.element.contains(content) === false) {
			if (this.contentElement) {
				this.contentElement.grab(content, 'after');
				this.contentElement.destroy();
			} else {
				this.element.grab(content);
			}
		}

		this.contentElement = content;
		this.contentElement.addClass('view-content');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getContentElement: function() {
		return this.contentElement;
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
	 * @see    http://moobilejs.com/doc/0.1/View/View#setParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/View/View#getParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentView: function() {
		return this._parentView;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewWillChange: function(parentView) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/View#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewDidChange: function(parentView) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildComponent: function(component) {
		this.previous(component);
		component.setParentView(this._parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildComponent: function(component) {
		this.previous(component);
		component.setParentView(null);
	}

});

/**
 * @see    http://moobilejs.com/doc/0.1/View/View#MoobileViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.View.at = function(path) {

	var element = Element.at(path);
	if (element) {
		return Moobile.Component.create(Moobile.View, element, 'data-view');
	}

	return null;
};

//<pre-0.1-compat>
Moobile.View.prototype.addChild = Moobile.View.prototype.addChildComponent;
//</pre-0.1-compat>

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.View, element, 'data-view'));
});

Moobile.Component.defineRole('view-content', Moobile.View, {traversable: true,	behavior: function(element) {
	this.setContentElement(element);
}});


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
	- ScrollViewRoles

provides:
	- ScrollView

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/View/ScrollView
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ScrollView = new Class({

	Extends: Moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_scroller: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	wrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		momentum: true,
		scrollX: false,
		scrollY: true,
		snapToPage: false,
		snapToPageAt: 35,
		snapToPageDuration: 150,
		snapToPageDelay: 150,
		offset: {
			x: 0,
			y: 0
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('scroll-view');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {

		this.parent();

		var options = {
			momentum: this.options.momentum,
			scrollX: this.options.scrollX,
			scrollY: this.options.scrollY,
			snapToPage: this.options.snapToPage,
			snapToPageAt: this.options.snapToPageAt,
			snapToPageDuration: this.options.snapToPageDuration,
			snapToPageDelay: this.options.snapToPageDelay
		};

		this._scroller = new Moobile.Scroller(this.contentElement, options);
		this._scroller.addEvent('dragstart', this.bound('_onDragStart'));
		this._scroller.addEvent('dragend', this.bound('_onDragEnd'));
		this._scroller.addEvent('scroll', this.bound('_onScroll'));

		this.wrapperElement = this._scroller.getWrapperElement();
		this.wrapperElement.addClass('view-content-wrapper');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {
		this.parent();
		this._scroller.refresh();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._scroller.removeEvent('dragstart', this.bound('_onDragStart'));
		this._scroller.removeEvent('dragend', this.bound('_onDragEnd'));
		this._scroller.removeEvent('scroll', this.bound('_onScroll'));
		this._scroller.destroy();
		this._scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollTo: function(x, y, time) {
		this._scroller.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#scrollToPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToPage: function(pageX, pageY, time) {
		this._scroller.scrollToPage(pageX, pageY, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToElement: function(element, time) {
		this._scroller.scrollToElement(element, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScroll: function() {
		return this._scroller.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScrollSize: function() {
		return this._scroller.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#getScroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScroller: function() {
		return this._scroller;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#getWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWrapperElement: function() {
		return this.wrapperElement;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {
		this.parent();
		this.options.offset = this._scroller.getScroll();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {
		this.parent();
		var offset = this.options.offset;
		if (offset.x >= 0 || offset.y >= 0) {
		//	this._scroller.scrollTo(offset.x, offset.y);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onDragStart: function() {
		this.fireEvent('dragstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onDragEnd: function() {
		this.fireEvent('dragend');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onScroll: function() {
		this.fireEvent('scroll');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('scroll-view', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ScrollView, element, 'data-scroll-view'));
});


/*
---

name: ViewPanel

description: Provides a view that handles a panel with two panes.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewPanel

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewPanel = new Class({

	Extends: Moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_mainPanel: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_sidePanel: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('view-panel');

		var content = this.element.getRoleElement('view-content');

		var main = content.getRoleElement('main-panel');
		if (main === null) {
			main = new Element('div');
			main.ingest(content);
			main.inject(content);
			main.setRole('main-panel');
		}

		var side = content.getRoleElement('side-panel');
		if (side === null) {
			side = new Element('div');
			side.inject(content, 'top');
			side.setRole('side-panel');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.contentElement.addClass('view-panel-content');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._sidePanel = null;
		this._mainPanel = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#setSidePanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSidePanel: function(sidePanel) {

		if (this._sidePanel === sidePanel)
			return this;

		if (this._sidePanel === null) {
			this.contentElement.grab(sidePanel);
			this._sidePanel = sidePanel;
		} else {
			sidePanel.replaces(this._sidePanel);
			this._sidePanel.destroy();
			this._sidePanel = sidePanel;
		}

		this._sidePanel.addClass('side-panel');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#getSidePanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSidePanel: function() {
		return this.contentElement.getSidePanel();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#setMainPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setMainPanel: function(mainPanel) {

		if (this._mainPanel === mainPanel)
			return this;

		if (this._mainPanel === null) {
			this.contentElement.grab(mainPanel);
			this._mainPanel = mainPanel;
		} else {
			mainPanel.replaces(this._mainPanel);
			this._mainPanel.destroy();
			this._mainPanel = mainPanel;
		}

		this._mainPanel.addClass('main-panel');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#getMainPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainPanel: function() {
		return this.contentElement.getMainPanel();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-panel', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewPanel, element, 'data-view-panel'));
});

Moobile.Component.defineRole('side-panel', Moobile.ViewPanel, {traversable: true, behavior: function(element) {
	this.setSidePanel(element);
}});

Moobile.Component.defineRole('main-panel', Moobile.ViewPanel, {traversable: true, behavior: function(element) {
	this.setMainPanel(element);
}});


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
 * @see    http://moobilejs.com/doc/0.1/View/ViewStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewStack = new Class({

	Extends: Moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('view-stack');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.contentElement.addClass('view-stack-content');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-stack', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewStack, element, 'data-view-stack'));
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
 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewController = new Class({

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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#modal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_modal: false,

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#modalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_modalViewController: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#view
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	view: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(options, name) {

		this._name = name;

		this.setOptions(options);

		this.loadView();
		if (this.view) {
			this.view.addEvent('ready', this.bound('_onViewReady'));
			this.viewDidLoad();
		}

		window.addEvent('rotate', this.bound('_onWindowRotate'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#loadView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {
		if (this.view === null) {
			this.view = new Moobile.View();
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#addChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#addChildViewControllerAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#addChildViewControllerBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewController: function(name) {
		return this._children.find(function(viewController) { return viewController.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getChildViewControllerAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewControllerAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getChildViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewControllerIndex: function(viewController) {
		return this._children.indexOf(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewControllers: function() {
		return this._children;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#hasChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildViewController: function(viewController) {
		return this._children.contains(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#removeChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#removeFromParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeFromParentViewController: function(destroy) {
		return this._parent
			 ? this._parent.removeChildViewController(this, destroy)
			 : false;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#removeAllChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllChildViewControllers: function(destroy) {

		this._children.filter(function() {
			return true;
		}).invoke('removeFromParentViewController', destroy);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#presentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	presentModalViewController: function(viewController, viewTransition) {

		if (this._modalViewController)
			return this;

		this.willPresentModalViewController(viewController);

		viewController.setParentViewController(this);
		viewController.setModal(true);

		this._modalViewController = viewController;

		var viewToShow = viewController.getView();
		var viewToHide = this.view;
		var parentView = this.view.getParentView();

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
	 * @since  0.1
	 */
	_onPresentTransitionStart: function() {
		this._modalViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onPresentTransitionCompleted: function() {
		this._modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#dismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dismissModalViewController: function() {

		if (this._modalViewController === null)
			return this;

		this.willDismissModalViewController()

		var viewToShow = this.view;
		var viewToHide = this._modalViewController.getView();
		var parentView = this.view.getParentView();

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
	 * @since  0.1
	 */
	_onDismissTransitionStart: function() {
		this._modalViewController.viewWillLeave();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onDismissTransitionCompleted: function() {
		this._modalViewController.viewDidLeave();
		this._modalViewController.destroy();
		this._modalViewController = null;
		this.didDismissModalViewController();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#setModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setModal: function(modal) {
		this._modal = modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#isModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isModal: function() {
		return this._modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#isViewReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isViewReady: function() {
		return this._viewReady;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getView: function() {
		return this.view;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#setViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setViewTransition: function(viewTransition) {
		this._viewTransition = viewTransition;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getViewTransition: function() {
		return this._viewTransition;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#setParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParentViewController: function(viewController) {
		this.parentViewControllerWillChange(viewController);
		this._parent = viewController;
		this.parentViewControllerDidChange(viewController);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#getParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentViewController: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#willAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#didAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#willRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#didRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#parentViewControllerWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewControllerWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#parentViewControllerDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewControllerDidChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#willPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#didPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#willDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#didDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#didRotate
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRotate: function(orientation) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#viewDidLoad
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidLoad: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#viewDidBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#viewWillEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewWillEnter: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#viewDidEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidEnter: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#viewWillLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewWillLeave: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#viewDidLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidLeave: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewController#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		window.removeEvent('rotate', this.bound('_onWindowRotate'));

		this.removeFromParentViewController();
		this.removeAllChildViewControllers(true);

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

	_onWindowRotate: function(e) {
		this.didRotate(window.orientationName);
	},

	_onViewReady: function() {
		if (this._viewReady === false) {
			this._viewReady = true;
			this.viewDidBecomeReady();
		}
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
 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_animating: false,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {
		this.view = new Moobile.ViewStack();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#pushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
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
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#popViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#popViewControllerUntil
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
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
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#getTopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTopViewController: function() {
		return this.getChildViewControllers().getLast();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#willPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#didPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#willPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willPopViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#didPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didPopViewController: function(viewController) {

	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_viewControllerStack: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#setViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#getViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getViewControllerStack: function() {
		return this._viewControllerStack;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#parentViewControllerStackWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewControllerStackWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack#parentViewControllerStackDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewControllerStackDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerStack(this._viewControllerStack);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerStack.Navigation
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
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
	 * @since  0.1
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
	 * @since  0.1
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
	 * @since  0.1
	 */
	_onBackButtonTap: function(e) {
		this.popViewController();
	}

});


/*
---

name: ViewControllerPanel

description: Manages a view panel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerCollection

provides:
	- ViewControllerPanel

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewControllerPanel = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_mainViewController: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_sideViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {
		this.view = new Moobile.ViewPanel();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#setMainViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setMainViewController: function(mainViewController) {

		if (this._mainViewController) {
			this._mainViewController.destroy();
			this._mainViewController = null;
		}

		var view = mainViewController.getView();
		if (view) {
			this.view.addChildComponentInside(view, this.view.getMainPanel());
		}

		viewController.setViewControllerPanel(this);

		this.addChildViewController(mainViewController);

		this._mainViewController = mainViewController;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#getMainViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainViewController: function() {
		return this._mainViewController;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#setSideViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSideViewController: function(sideViewController) {

		if (this._sideViewController) {
			this._sideViewController.destroy();
			this._sideViewController = null;
		}

		var view = sideViewController.getView();
		if (view) {
			this.view.addChildComponentInside(view, this.view.getSidePanel())
		}

		viewController.setViewControllerPanel(this);

		this.addChildViewController(sideViewController);

		this._sideViewController = _sideViewController;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#getSideViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSideViewController: function() {
		return this._sideViewController;
	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_viewControllerPanel: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#setViewControllerPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setViewControllerPanel: function(viewControllerPanel) {
		this._viewControllerPanel = viewControllerPanel;
		return this
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#getViewControllerPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getViewControllerPanel: function(viewControllerPanel) {
		return this._viewControllerPanel;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		if (viewController.getViewControllerPanel() === null) {
			viewController.setViewControllerPanel(this._viewControllerPanel);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerPanel(null);
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#enter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enter: function(viewToShow, viewToHide, parentView, isFirstView) {

		if (viewToHide) {
			viewToHide.disableTouch();
		}

		viewToShow.show();
		viewToShow.disableTouch();

		this.fireEvent('start');

		if (isFirstView) {
			this.firstAnimation(viewToShow, parentView)
		} else {
			this.enterAnimation(viewToShow, viewToHide, parentView);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#leave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	leave: function(viewToShow, viewToHide, parentView) {

		viewToShow.show();
		viewToShow.disableTouch();
		viewToHide.disableTouch();

		this.fireEvent('start');
		this.leaveAnimation(viewToShow, viewToHide, parentView);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#didEnterFirst
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didEnterFirst: function(viewToShow, parentView) {
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#didEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didEnter: function(viewToShow, viewToHide, parentView) {
		viewToHide.hide();
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#didLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLeave: function(viewToShow, viewToHide, parentView) {
		viewToHide.hide();
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#firstAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#enterAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition#leaveAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Slide
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Slide = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
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
	 * @since  0.1
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Cover
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Cover = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-cover-perspective');
			parentElem.addClass('transition-cover-enter');
			viewToHide.addClass('transition-view-to-hide');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-cover-perspective');
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
	 * @since  0.1
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Cover.Box
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Cover.Box = new Class({

	Extends: Moobile.ViewTransition,

	overlay: null,

	viewToShowWrapper: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {
		throw new Error('You cannot use this transition for the first view of a stack');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentElem.removeClass('transition-cover-box-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		this.overlay = new Moobile.Overlay();
		this.overlay.hide();
		this.overlay.showAnimated();

		viewToHide.addChildComponent(this.overlay, 'header');

		this.viewToShowWrapper = new Moobile.View();
		this.viewToShowWrapper.addChildComponent(viewToShow);
		this.viewToShowWrapper.addClass('transition-cover-box-foreground-view-wrapper');

		parentView.addChildComponent(this.viewToShowWrapper);

		parentElem.addClass('transition-cover-box-enter');
		viewToHide.addClass('transition-cover-box-background-view');
		viewToShow.addClass('transition-cover-box-foreground-view');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentElem.removeClass('transition-cover-box-leave');
			viewToHide.removeClass('transition-cover-box-background-view');
			viewToShow.removeClass('transition-cover-box-foreground-view');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			viewToHide.removeFromParentComponent();

			this.didLeave(viewToShow, viewToHide, parentView);

			this.viewToShowWrapper.removeFromParentComponent();
			this.viewToShowWrapper.destroy();
			this.viewToShowWrapper = null;

			this.overlay.removeFromParentComponent();
			this.overlay.destroy();
			this.overlay = null;

		}.bind(this));

		this.overlay.hideAnimated();

		parentElem.addClass('transition-cover-box-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Cover.Page
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Cover.Page = new Class({

	Extends: Moobile.ViewTransition,

	overlay: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {
		throw new Error('You cannot use this transition for the first view of a stack');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentElem.removeClass('transition-cover-page-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		this.overlay = new Moobile.Overlay();
		this.overlay.hide();
		this.overlay.showAnimated();

		viewToHide.addChildComponent(this.overlay, 'header');

		parentElem.addClass('transition-cover-page-enter');
		viewToHide.addClass('transition-cover-page-background-view');
		viewToShow.addClass('transition-cover-page-foreground-view');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentElem.removeClass('transition-cover-page-leave');
			viewToShow.removeClass('transition-cover-page-background-view');
			viewToHide.removeClass('transition-cover-page-foreground-view');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

			this.overlay.removeFromParentComponent();
			this.overlay.destroy();
			this.overlay = null;

		}.bind(this));

		this.overlay.hideAnimated();

		parentElem.addClass('transition-cover-page-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Cubic
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Cubic = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-cubic-perspective');
			parentElem.addClass('first');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-cubic-perspective');
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
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-cubic-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-cubic-perspective');
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
	 * @since  0.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-cubic-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-cubic-perspective');
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Fade
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
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
	 * @since  0.1
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Flip
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Flip = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-flip-perspective');
			parentElem.addClass('first');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-flip-perspective');
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
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-flip-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-flip-perspective');
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
	 * @since  0.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-flip-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-flip-perspective');
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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.None
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.None = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {
		this.didEnterFirst(viewToShow, parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		this.didEnter(viewToShow, viewToHide, parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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

/**
 * @see    http://moobilejs.com/doc/0.1/Window/Window
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Window = new Class({

	Extends: Moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.set('class', 'window');
		window.addEvent('load', this.bound('_onWindowLoad'));
		window.addEvent('rotate', this.bound('_onWindowRotate'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.contentElement.addClass('window-content');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		window.removeEvent('load', this.bound('_onWindowLoad'));
		window.removeEvent('rotate', this.bound('_onWindowRotate'));
		this.parent();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildComponent: function(component) {
		this.parent(component);
		component.setWindow(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildComponent: function(component) {
		this.parent(component);
		component.setWindow(null);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onWindowLoad: function(e) {
		(function() { window.scrollTo(0, 1) }).delay(250);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onWindowRotate: function(e) {
		(function() { window.scrollTo(0, 1) }).delay(250);
	}

});


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
 * @see    http://moobilejs.com/doc/0.1/Window/WindowController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.WindowController = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_rootViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {

		var element = document.id('window');
		if (element === null) {
			element = new Element('div');
			element.inject(document.body);
		}

		this.view = new Moobile.Window(element);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Window/WindowController#setRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @see    http://moobilejs.com/doc/0.1/Window/WindowController#getRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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

var preventDefault = function(event){
	if (!event.target || event.target.tagName.toLowerCase() != 'select')
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
		} while (target && (target = target.parentNode));

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
