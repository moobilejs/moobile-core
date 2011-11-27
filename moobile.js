/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */

(function(){
var m = Math,
	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
		'opera' in window ? 'O' : '',

	// Browser capabilities
	has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
	hasTouch = 'ontouchstart' in window,
	hasTransform = vendor + 'Transform' in document.documentElement.style,
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isPlaybook = (/playbook/gi).test(navigator.appVersion),
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
		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
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

		if (that.options.hasTouch) {
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

		that.scrollTo(x, y, time || 400);
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

name: Browser.Platform

description: Provides extra indication about the current platform.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Browser

provides:
	- Browser.Platform

...
*/

Browser.Platform.phonegap =
	window.device &&
	window.device.phonegap;


/*
---

name: Class.Instantiate

description: Provides extra static methods to instantiate a class from a string.

license: MIT-style license.

requires:
	- Core/Class

provides:
	- Class.Instantiate

...
*/

Class.extend({

	parse: function(name) {
		name = name.trim();
		name = name.split('.');
		var func = window;
		for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
		return typeof func == 'function' ? func : null;
	},

	instantiate: function(klass) {
		if (typeof klass == 'string') klass = Class.parse(klass);
		if (klass == null) return null;
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

name: String.Extras

description: Provides extra methods to the String object.

license: MIT-style license.

requires:
	- Core/String

provides:
	- String.Extras

...
*/

String.implement({

	toCamelCase: function() {
		return this.camelCase().replace('-', '').replace(/\s\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
	}

});


/*
---

name: Array.Extras

description: Provides extra methods to the Array object.

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

	lastItemAt: function(offset) {
		offset = offset ? offset : 0;
		return this[this.length - 1 - offset] ?
			   this[this.length - 1 - offset] :
			   null;
	}
});


/*
---

name: Element.Ingest

description: Provides a method that grab all the child element from an element
             or a string.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element

provides:
	- Element.Ingest

...
*/



Element.implement({

	ingest: function(element) {
		return this.adopt(Array.from(document.id(element).childNodes));
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

name: Event.Mobile

description: Correctly translate mouse events to touch events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Custom-Event/Element.defineCustomEvent
	- Mobile/Browser.Mobile

provides:
	- Event.Mobile

...
*/

if (Browser.isMobile) {

	delete Element.NativeEvents['mousedown'];
	delete Element.NativeEvents['mousemove'];
	delete Element.NativeEvents['mouseup'];

	Element.defineCustomEvent('mousedown', {
		base: 'touchstart'
	});

	Element.defineCustomEvent('mousemove', {
		base: 'touchmove'
	});

	Element.defineCustomEvent('mouseup', {
		base: 'touchend'
	});

}


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

	Element.NativeEvents.deviceready = 1;

	var domready = Browser.Platform.phonegap ? 'deviceready' : 'domready';

	var onReady = function(e) {
		this.fireEvent('ready');
	};

	Element.defineCustomEvent('ready', {

		onSetup: function() {
			this.addEvent(domready, onReady);
		},

		onTeardown: function() {
			this.removeEvent(domready, onReady);
		}

	});

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

name: Event.Click

description: Provides a click event that is not triggered when the user clicks
             and moves the mouse. This overrides the default click event. It's
             important to include Mobile/Click before this class otherwise the
             click event will be deleted.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Custom-Event/Element.defineCustomEvent
	- Mobile/Browser.Mobile
	- Mobile/Click
	- Mobile/Touch
	- Event.Mobile

provides:
	- Event.Click

...
*/

(function(){

	var x = 0;
	var y = 0;
	var down = false;
	var valid = true;

	var onMouseDown = function(e) {
		valid = true;
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
		var xmax = x + 5;
		var xmin = x - 5;
		var ymax = y + 5;
		var ymin = y - 5;
		return (e.page.x > xmax || e.page.x < xmin || e.page.y > ymax || e.page.y < ymin);
	};

	Element.defineCustomEvent('click', {

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

	/* vendor prefix */

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

	/* events */

	Element.NativeEvents[prefix + 'TransitionEnd'] = 2;
	Element.Events.transitionend = { base: (prefix + 'TransitionEnd') };

	Element.NativeEvents[prefix + 'AnimationEnd'] = 2;
	Element.Events.animationend = { base: (prefix + 'AnimationEnd') };

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

name: Request

description: Provides a base class for requests that could be executed locally.

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

Moobile.Request = new Class({

	Extends: Request,

	Implements: [
		Class.Binds
	],

	options: {
		isSuccess: function() {
			var status = this.status;
			return (status == 0 || (status >= 200 && status < 300));
		}
	}

});


/*
---

name: Request.ViewElement

description: Provides a Request that loads a view from a remote location. This
             class will look for an element with the view data-role.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Request

provides:
	- Request.ViewElement

...
*/

Moobile.Request.ViewElement = new Class({

	Extends: Moobile.Request,

	elements: {},

	options: {
		method: 'get'
	},

	load: function(url) {

		var element = this.elements[url];
		if (element) {
			return element;
		}

		var element = null;

		this.addEvent('success:once', function(response) {
			element = Elements.from(response)[0] || null;
		});

		this.options.url = url;
		this.options.async = false
		this.send();

		if (element == null) {
			throw new Error('Cannot find an element within the response.');
		}

		this.elements[url] = element;

		return element;
	}

});


/*
---

name: Entity

description: Provides the base class for every objects that are displayed
             through an element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Class-Extras/Class.Binds
	- EntityRoles
	- EntityStyles

provides:
	- Entity

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.Entity = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	$roles: {},

	$styles: {},

	style: null,

	owner: null,

	name: null,

	element: null,

	children: [],

	window: null,

	ready: false,

	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	initialize: function(element, options, name) {

		this.name = name;

		var root = document.id(element);
		if (root == null) {
			root = new Element(this.options.tagName);
			if (typeof element == 'string') {
				root = Elements.from(element)[0];
			}
		}

		this.element = root;

		options = options || {};

		for (var option in this.options) {
			var value = this.element.get('data-option-' + option.hyphenate());
			if (value != null) {
				if (options[option] == undefined) {
					options[option] = value;
				}
			}
		}

		this.setOptions(options);

		this.element.addEvent('click', this.bound('onClick'));
		this.element.addEvent('mouseup', this.bound('onMouseUp'))
		this.element.addEvent('mousedown', this.bound('onMouseDown'));

		this.willLoad();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}

		var styleName = this.options.styleName
		if (styleName) {
			this.setStyle(styleName);
		}

		this.element.getElements('[data-role]').each(function(element) {
			if (this.hasRoleElement(element)) {
				this.defineElementRole(element, element.get('data-role'));
			}
		}, this);

		this.didLoad();

		return this;
	},

	destroy: function() {

		this.willUnload();

		this.element.removeEvent('click', this.bound('onClick'));
		this.element.removeEvent('mouseup', this.bound('onMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onMouseDown'));

		this.removeFromOwner();

		this.destroyChildren();

		this.element.destroy();
		this.element = null;
		this.window = null;
		this.owner = null;

		this.didUnload();
	},

	destroyChildren: function() {
		this.children.each(this.bound('destroyChild'));
		this.children.empty();
	},

	destroyChild: function(entity) {
		entity.destroy();
		entity = null;
	},

	addChild: function(entity, where, context) {

		var element = document.id(entity);
		if (element == null)
			return false;

		if (this.hasChild(entity))
			return false;

		this.willAddChild(entity);

		if (!this.hasElement(element)) {

			context = document.id(context);
			if (context == null) {
				context = this.element;
			} else if (!this.hasElement(context)) {
				throw new Error('You are trying to add a child relative to an element that does not belong to this entity');
			}

			element.inject(context, where);
		}

		this.children.push(entity);

		entity.ownerWillChange(this);
		entity.setOwner(this);
		entity.ownerDidChange(this);
		entity.setWindow(this.window);

		this.didAddChild(entity);

		if (this.ready == false) {
			this.addEvent('ready:once', function() {
				entity.setReady();
			});
			return true;
		}

		entity.setReady();

		return true;
	},

	hasChild: function(entity) {
		return this.children.contains(entity);
	},

	getChild: function(name) {
		return this.children.find(function(children) {
			return children.getName() == name;
		});
	},

	getChildren: function() {
		return this.children;
	},

	replaceChild: function(replace, entity) {

		var success = this.addChild(entity, 'before', replace);
		if (success) {
			return this.removeChild(replace);
		}

		return false;
	},

	removeChild: function(entity) {

		var element = document.id(entity);
		if (element == null)
			return false;

		if (!this.hasElement(entity))
			return false;

		this.willRemoveChild(entity);

		entity.ownerWillChange(null);
		entity.setOwner(null);
		entity.ownerDidChange(null);
		entity.setReady(false);

		entity.setWindow(null);

		element.dispose();

		this.children.erase(entity);

		this.didRemoveChild(entity);

		return true;
	},

	removeFromOwner: function() {
		return this.owner
		     ? this.owner.removeChild(this)
		     : false;
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

	setStyle: function(name) {

		if (this.style) {
			this.style.detach.call(this, this.element);
		}

		var style = this.$styles[name];
		if (style) {
			style.attach.call(this, this.element);
		}

		this.style = style;

		return this;
	},

	getStyle: function() {
		return this.style.name;
	},

	setOwner: function(owner) {
		this.owner = owner;
		return this;
	},

	getOwner: function() {
		return this.owner;
	},

	hasOwner: function() {
		return !!this.owner;
	},

	setWindow: function(window) {
		this.window = window;
	},

	getWindow: function() {
		return this.window;
	},

	hasWindow: function() {
		return !!this.window;
	},

	getName: function() {
		return this.name;
	},

	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	getRoleElement: function(role) {
		return this.getRoleElements(role)[0] || null;
	},

	getRoleElements: function(role) {
		return this.element.getElements('[data-role=' + role + ']').filter(this.bound('hasRoleElement'));
	},

	hasRoleElement: function(element) {

		var parent = element.getParent();
		if (parent) {
			return this.element === parent || this.hasRoleElement(parent);
		}

		return false;
	},

	defineElementRole: function(element, name) {

		if (element.retrieve('entity.has-role'))
			return this;

		var role = this.$roles[name];
		if (role) {
			role.call(this, element, element.get('data-name'));
		} else {
			throw new Error('Role ' + name + ' does not exists.');
		}

		element.store('entity.has-role', true);

		return this;
	},

	getSize: function() {
		return this.element.getSize();
	},

	setReady: function() {

		if (this.ready)
			return this;

		this.window = this.owner.getWindow();

		this.ready = true;
		this.didBecomeReady();
		this.fireEvent('ready');

		return this;
	},

	isReady: function() {
		return this.ready;
	},

	show: function() {
		this.willShow();
		this.element.show();
		this.didShow();
		return this;
	},

	hide: function() {
		this.willHide();
		this.element.hide();
		this.didHide();
		return this;
	},

	willLoad: function() {

	},

	didLoad: function() {

	},

	willUnload: function() {

	},

	didUnload: function() {

	},

	didBecomeReady: function() {

	},

	willAddChild: function(entity) {

	},

	didAddChild: function(entity) {

	},

	willRemoveChild: function(entity) {

	},

	didRemoveChild: function(entity) {

	},

	willShow: function() {

	},

	didShow: function() {

	},

	willHide: function() {

	},

	didHide: function() {

	},

	ownerWillChange: function(owner) {

	},

	ownerDidChange: function(owner) {

	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent('mouseup', e);
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent('mousedown', e);
	},

	toElement: function() {
		return this.element;
	}

});

Moobile.Entity.defineRole = function(name, target, fn) {
	(target || Moobile.Entity).prototype.$roles[name] = fn;
};

Moobile.Entity.defineStyle = function(name, target, def) {
	(target || Moobile.Entity).prototype.$styles[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, def);
};


/*
---

name: View

description: Provides the base class for every objects that are displayed
             through an element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- View

...
*/

Moobile.View = new Class({

	Extends: Moobile.Entity,

	content: null,

	options: {
		className: 'view'
	},

	enable: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},

	disable: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
	},

	addChild: function(entity, where, context) {

		if (entity instanceof Moobile.ViewContent) {
			return this.parent(entity, where, context);
		}

		switch (where) {
			case 'header': return this.parent(entity, 'top');
			case 'footer': return this.parent(entity, 'bottom');
		}

		if (this.content && this.content.hasOwner()) {

			if (this.hasChild(entity)) {
				return false;
			}

			if (this.hasElement(entity) && !this.content.hasElement(entity) ||
				this.hasElement(context) && !this.content.hasElement(context)) {
				return this.parent(entity, where, context);
			}

			return this.content.addChild(entity, where, context);
		}

		return this.parent(entity, where, context);
	},

	getChildren: function() {
		return [].concat(this.content.getChildren(), this.parent());
	},

	getChild: function(name) {
		return this.content && this.content.hasOwner()
			 ? this.content.getChild(name) || this.parent(name)
			 : this.parent(name);
	},

	hasChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.hasChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	replaceChild: function(replace, entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.replaceChild(replace, entity) || this.parent(replace, entity)
		     : this.parent(replace, entity);
	},

	removeChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.removeChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	getOwnerView: function() {

		var owner = this.owner;
		while (owner) {

			if (owner instanceof Moobile.View) {
				return owner;
			}

			owner = owner.getOwner();
		}

		return null;
	},

	getContent: function() {
		return this.content;
	},

	willLoad: function() {

		this.parent();

		var content = this.getRoleElement('content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
		}

		this.defineElementRole(content, 'content');
	},

	didLoad: function() {
		this.parent();
		this.element.addEvent('swipe', this.bound('onSwipe'));
		this.element.addEvent('pinch', this.bound('onPinch'));
	},

	destroy: function() {
		this.element.removeEvent('swipe', this.bound('onSwipe'));
		this.element.removeEvent('pinch', this.bound('onPinch'));
		this.content = null;
		this.parent();
	},

	onSwipe: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
	},

	onPinch: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
	}

});

Moobile.View.elementAtPath = function(path) {
	return new Moobile.Request.ViewElement().load(path);
};

Moobile.View.atPath = function(path) {

	var element = Moobile.View.elementAtPath(path);
	if (element) {
		return Class.instantiate(element.get('data-view') || 'Moobile.View', element, null, element.get('data-name'));
	}

	return null;
};

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.View, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewContent, element, null, name);
	if (instance instanceof Moobile.ViewContent) {
		this.addChild(instance);
		this.content = instance; // must be assigned after addChild is called
	}

	return instance;
});


/*
---

name: Control

description: Provides the base class for controls.

license: MIT-style license.

requires:
	- View
	- ControlRoles

provides:
	- Control

...
*/

Moobile.Control = new Class({

	Extends: Moobile.Entity,

	disabled: false,

	selected: false,

	selectable: true,

	highlighted: false,

	highlightable: true,

	options: {
		className: null,
		styleName: null
	},

	setDisabled: function(disabled) {
		return this._setState('disabled', disabled);
	},

	isDisabled: function() {
		return this._getState('disabled');
	},

	setSelected: function(selected) {
		return this.selectable ? this._setState('selected', selected) : this;
	},

	isSelected: function() {
		return this._getState('selected');
	},

	setSelectable: function(selectable) {
		this.selectable = selectable;
		return this;
	},

	isSelectable: function() {
		return this.selectable;
	},

	setHighlighted: function(highlighted) {
		return this.highlightable ? this._setState('highlighted', highlighted) : this;
	},

	isHighlighted: function() {
		return this._getState('highlighted');
	},

	setHighlightable: function(highlightable) {
		this.highlightable = highlightable;
	},

	isHighlightable: function() {
		return this.highlightable;
	},

	_setState: function(state, value) {

		if (this[state] == value)
			return this;

		this[state] = value;

		var klass = this.options.className + '-' + state;
		if (value)	this.element.addClass(klass);
		else		this.element.removeClass(klass);

		this.fireEvent('statechange', [state, value]);

		return this;
	},

	_getState: function(state) {
		return this.states[state] || false;
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

Moobile.Button = new Class({

	Extends: Moobile.Control,

	label: null,

	options: {
		className: 'button',
	},

	setLabel: function(label) {

		if (this.label === label)
			return this;

		this.label.setText(null);

		if (label) {
			if (typeof label == 'string') {
				this.label.setText(label);
			} else {
				this.replaceChild(this.label, label);
				this.label.destroy();
				this.label = label;
			}
		}

		return this;
	},

	getLabel: function() {
		return this.label;
	},

	willLoad: function() {

		this.parent();

		var label = this.getRoleElement('label');
		if (label == null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
		}

		this.defineElementRole('label', label);
	},

	destroy: function() {
		this.label = null;
		this.parent();
	},

	onMouseDown: function(e) {
		this.parent(e);
		this.element.addClass(this.options.className + '-down');
	},

	onMouseUp: function(e) {
		this.parent(e);
		this.element.removeClass(this.options.className + '-down');
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('button', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-button') || Moobile.Button, element, null, name);
	if (instance instanceof Moobile.Button) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('label', Moobile.Button, function(element, name) {

	var instance = Class.instantiate(element.get('data-label') || Moobile.Label, element, null, name);
	if (instance instanceof Moobile.Entity) {
		this.addChild(instance);
		this.label = instance;
	}

	return instance;
});


/*
---

name: ButtonGroup

description: Provides a wrapper for many Button controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ButtonGroupRoles
	- ButtonGroupStyle

provides:
	- ButtonGroup

...
*/

Moobile.ButtonGroup = new Class({

	Extends: Moobile.Control,

	selectedButton: null,

	selectedButtonIndex: -1,

	options: {
		className: 'button-group',
		styleName: 'horizontal',
		deselectable: false
	},

	setSelectedButton: function(selectedButton) {

		if (this.selectedButton === selectedButton) {
			if (selectedButton && this.options.deselectable) {
				selectedButton = null;
			} else {
				return this;
			}
		}

		if (this.selectedButton) {
			this.fireEvent('deselect', this.selectedButton);
			this.selectedButton.setSelected(false);
			this.selectedButton = null;
		}

		if (selectedButton) {
			this.selectedButton = selectedButton;
			this.selectedButton.setSelected(true);
			this.fireEvent('select', this.selectedButton);
		}

		this.selectedButtonIndex = selectedButton ? this.children.indexOf(selectedButton) : -1;

		return this;
	},

	getSelectedButton: function() {
		return this.selectedButton;
	},

	setSelectedButtonIndex: function(index) {
		this.setSelectedButton(this.children[index]);
		return this;
	},

	getSelectedButtonIndex: function(index) {
		return this.selectedButtonIndex;
	},

	addButton: function(button, where, context) {
		return this.addChild(button, where, context);
	},

	getButton: function(name) {
		return this.getChild(name);
	},

	removeButton: function(button) {
		return this.removeChild(button);
	},

	clearButtons: function() {
		return this.removeChildViews();
	},

	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.addEvent('click', this.bound('onButtonClick'));
			entity.addEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.addEvent('mousedown', this.bound('onButtonMouseDown'));
		}
	},

	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.removeEvent('click', this.bound('onButtonClick'));
			entity.removeEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.removeEvent('mousedown', this.bound('onButtonMouseDown'));
		}
	},

	destroy: function() {
		this.selectedButton = null;
		this.selectedButtonIndex = -1;
		this.parent();
	},

	onButtonClick: function(e) {
		this.setSelectedButton(e.target);
		this.fireEvent('buttonClick', e.target);
	},

	onButtonMouseUp: function(e) {
		this.fireEvent('buttonMouseUp', e.target);
	},

	onButtonMouseDown: function(e) {
		this.fireEvent('buttonMouseDown', e.target);
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('button-group', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-button-group') || Moobile.ButtonGroup, element, null, name);
	if (instance instanceof Moobile.ButtonGroup) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('horizontal', Moobile.ButtonGroup, {
	attach: function(element) { element.addClass('style-horizontal'); },
	detach: function(element) { element.removeClass('style-horizontal'); }
});

Moobile.Entity.defineStyle('vertical', Moobile.ButtonGroup, {
	attach: function(element) { element.addClass('style-vertical'); },
	detach: function(element) { element.removeClass('style-vertical'); }
});


/*
---

name: Bar

description: Provide the base class for a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- BarRoles
	- BarStyle

provides:
	- Bar

...
*/

Moobile.Bar = new Class({

	Extends: Moobile.Control,

	options: {
		className: 'bar'
	},

	item: null,

	addBarButton: function(item, where, context) {
		return this.item.addChild(item, where, context);
	},

	getBarButton: function(name) {
		return this.item.getChild(name);
	},

	removeBarButton: function(item) {
		return this.item.removeChild(item);
	},

	clearBarButtons: function() {
		return this.item.removeChildren();
	},

	setItem: function(item) {
		this.replaceChild(this.item, item);
		this.item.destroy();
		this.item = item;
		return this;
	},

	getItem: function() {
		return this.item;
	},

	willLoad: function() {

		this.parent();

		var item = this.getRoleElement('item');
		if (item == null) {
			item = new Element('div');
			item.ingest(this.element);
			item.inject(this.element);
		}

		this.defineElementRole(item, 'item');
	},

	destroy: function() {
		this.item = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-bar') || Moobile.Bar, element, null, name);
	if (instance instanceof Moobile.Bar) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.Bar, function(element, name) {

	var instance = Class.instantiate(element.get('data-item') || Moobile.BarItem, element, null, name);
	if (instance instanceof Moobile.BarItem) {
		this.addChild(instance);
		this.item = instance;
	}

	return instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('translucent', Moobile.Bar, {
	attach: function(element) { element.addClass('style-translucent'); },
	detach: function(element) { element.removeClass('style-translucent'); }
});

Moobile.Entity.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

Moobile.Entity.defineStyle('dark-translucent', Moobile.Bar, {
	attach: function(element) {
		element
			.addClass('style-dark')
			.addClass('style-dark-translucent');
	},
	detach: function(element) {
		element
			.removeClass('style-dark')
			.removeClass('style-dark-translucent');
	}
});


/*
---

name: BarItem

description: Provides the content of a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarItem

...
*/

Moobile.BarItem = new Class({

	Extends: Moobile.Control,

	options: {
		className: 'bar-item'
	}

});


/*
---

name: BarTitle

description: Provides a view that contains the title of a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarTitle

...
*/

Moobile.BarTitle = new Class({

	Extends: Moobile.Control,

	text: null,

	options: {
		className: 'bar-title'
	},

	setText: function(text) {

		if (this.text) {
			this.text = '';
		}

		if (text) {
			this.text = text;
		}

		this.element.set('html', this.text);

		return this;
	},

	getText: function() {
		return this.text;
	},

	destroy: function() {
		this.text = null;
		this.parent();
	}

});


/*
---

name: BarButton

description: Provides a button used inside a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Button

provides:
	- BarButton

...
*/

Moobile.BarButton = new Class({

	Extends: Moobile.Button,

	options: {
		className: 'bar-button'
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar-button', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-bar-button') || Moobile.BarButton, element, null, name);
	if (instance instanceof Moobile.BarButton) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('active', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

Moobile.Entity.defineStyle('warning', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

Moobile.Entity.defineStyle('back', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

Moobile.Entity.defineStyle('forward', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});

Moobile.Entity.defineStyle('dark', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

Moobile.Entity.defineStyle('dark-back', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark-back'); },
	detach: function(element) { element.removeClass('style-dark-back'); }
});

Moobile.Entity.defineStyle('dark-forward', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark-forward'); },
	detach: function(element) { element.removeClass('style-dark-forward'); }
});



/*
---

name: BarButtonGroup

description: Provides a wrapper for many BarButton controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ButtonGroup

provides:
	- BarButtonGroup

...
*/

Moobile.BarButtonGroup = new Class({

	Extends: Moobile.ButtonGroup,

	options: {
		className: 'bar-button-group'
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar-button-group', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-bar-button-group') || Moobile.BarButtonGroup, element, null, name);
	if (instance instanceof Moobile.BarButtonGroup) {
		this.addChild(instance);
	}

	return instance;
});


/*
---

name: NavigationBar

description: Provides a NavigationBar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar
	- NavigationBarRoles

provides:
	- NavigationBar

...
*/

Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	addLeftBarButton: function(button) {
		return this.addBarButton(button, 'top');
	},

	addRightBarButton: function(button) {
		return this.addBarButton(button, 'bottom');
	},

	setTitle: function(title) {
		this.item.setTitle(title);
	},

	getTitle: function() {
		return this.item.title;
	},

	didLoad: function() {

		this.parent();

		if (this.options.className) {
			this.element.addClass('navigation-' + this.options.className);
		}
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('navigation-bar', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-navigation-bar') || Moobile.NavigationBar, element, null, name);
	if (instance instanceof Moobile.NavigationBar) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.NavigationBar, function(element, name) {

	var instance = Class.instantiate(element.get('data-item') || Moobile.NavigationBarItem, element, null, name);
	if (instance instanceof Moobile.NavigationBarItem) {
		this.addChild(instance);
		this.item = instance;
	}

	return instance;
});


/*
---

name: NavigationBarItem

description: Provides the content of a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- BarItem

provides:
	- NavigationBarItem

...
*/

Moobile.NavigationBarItem = new Class({

	Extends: Moobile.BarItem,

	title: null,

	setTitle: function(title) {

		if (this.title === title)
			return this;

		this.title.setText(null);
		this.title.hide();

		if (title) {
			if (typeof title == 'string') {
				this.title.setText(title);
				this.title.show();
			} else {
				this.replaceChildView(this.title, title);
				this.title.destroy();
				this.title = title;
			}
		}

		return this;
	},

	getTitle: function() {
		return this.title;
	},

	willLoad: function() {

		this.parent();

		var title = this.getRoleElement('title');

		if (title == null) {
			title = new Element('div');
			title.ingest(this.element);
			title.inject(this.element);
		}

		this.defineElementRole(title, 'title');
	},

	didLoad: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass('navigation-' + className);
		}
	},

	destroy: function() {
		this.title = null;
		this.parent();
	},

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('title', Moobile.NavigationBarItem, function(element, name) {

	var instance = Class.instantiate(element.get('title') || Moobile.BarTitle, element, null, name);
	if (instance instanceof Moobile.BarTitle) {
		this.addChild(instance);
		this.title = instance;
	}

	return instance;
});


/*
---

name: Slider

description: Provides a Slider control.

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

Moobile.Slider = new Class({

	Extends: Moobile.Control,

	value: 0,

	slider: null,

	track: null,

	thumb: null,

	options: {
		className: 'slider',
		snap: false,
		mode: 'horizontal',
		min: 0,
		max: 100,
		background: true,
		backgroundSize: 2048,
		value: 0
	},

	setValue: function(value) {
		this.slider.set(this.value = value);
		return this;
	},

	getValue: function() {
		return this.value;
	},

	updateTrack: function(position) {
		this.track.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumb.getSize().x / 2)
		);
	},

	didLoad: function() {

		this.parent();

		this.thumb = new Element('div.' + this.options.className + '-thumb');
		this.track = new Element('div.' + this.options.className + '-track');
		this.track.grab(this.thumb);

		this.element.empty();
		this.element.grab(this.track);
	},

	didBecomeReady: function() {

		this.parent();

		var options = {
			snap: this.options.snap,
			steps: this.options.max - this.options.min,
			range: [this.options.min, this.options.max],
			mode: this.options.mode
		};

		this.slider = new Slider(this.track, this.thumb, options);
		this.slider.addEvent('move', this.bound('onMove'));
		this.slider.addEvent('tick', this.bound('onTick'));
		this.slider.addEvent('change', this.bound('onChange'));

		this.setValue(this.options.value);
	},

	destroy: function() {
		this.thumb = null;
		this.track = null;
		this.slider = null;
		this.parent();
	},

	onMove: function(position) {
		this.updateTrack(position);
		this.fireEvent('move', position);
	},

	onTick: function(position) {
		this.updateTrack(position);
		this.fireEvent('tick', position);
	},

	onChange: function(step) {
		this.value = step;
		this.updateTrack(this.slider.toPosition(step));
		this.fireEvent('change', step);
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('slider', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-slider') || Moobile.Slider, element, null, name);
	if (instance instanceof Moobile.Slider) {
		this.addChild(instance);
	}

	return instance;
});


/*
---

name: List

description: Provide a List control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ListRoles
	- ListStyle

provides:
	- List

...
*/

Moobile.List = new Class({

	Extends: Moobile.Control,

	selectedItem: null,

	selectedItemIndex: -1,

	options: {
		className: 'list',
		tagName: 'ul'
	},

	setSelectedItem: function(selectedItem) {

		if (selectedItem && selectedItem.isSelectable() == false)
			return this;

		if (this.selectedItem == selectedItem)
			return this;

		if (this.selectedItem) {
			this.selectedItem.setSelected(false);
			this.selectedItem = null;
			this.fireEvent('deselect', this.selectedItem);
		}

		if (selectedItem) {
			this.selectedItem = selectedItem;
			this.selectedItem.setSelected(true);
			this.fireEvent('select', this.selectedItem);
		}

		this.selectedItemIndex = selectedItem ? this.children.indexOf(selectedItem) : -1;

		return this;
	},

	setSelectedItemIndex: function(index) {
		this.setSelectedItem(this.children[index] || null);
		return this;
	},

	clearSelectedItem: function() {
		return this.setSelectedItem(null);
	},

	addItem: function(item, where, context) {
		return this.addChild(item, where, context);
	},

	getItem: function(name) {
		return this.getChild(name);
	},

	removeItem: function(item) {
		return this.removeChild(item);
	},

	clearItems: function() {
		return this.removeChildren();
	},

	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.ListItem) {
			entity.addEvent('click', this.bound('onItemClick'));
			entity.addEvent('mouseup', this.bound('onItemMouseUp'));
			entity.addEvent('mousedown', this.bound('onItemMouseDown'));
		}
	},

	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.ListItem) {
			entity.removeEvent('click', this.bound('onItemClick'));
			entity.removeEvent('mouseup', this.bound('onItemMouseUp'));
			entity.removeEvent('mousedown', this.bound('onItemMouseDown'));
		}
	},

	destroy: function() {
		this.selectedItem = null;
		this.selectedItemIndex = -1;
		this.parent();
	},

	onItemClick: function(e) {
		var item = e.target;
		if (this.selectable) this.setSelectedItem(item);
		this.fireEvent('click', e);
	},

	onItemMouseUp: function(e) {
		var item = e.target;
		if (this.selectable && this.highlightable) item.setHighlighted(false);
		this.fireEvent('mouseup', e);
	},

	onItemMouseDown: function(e) {
		var item = e.target;
		if (this.selectable && this.highlightable) item.setHighlighted(true);
		this.fireEvent('mousedown', e);
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-list') || Moobile.List, element, null, name);
	if (instance instanceof Moobile.List) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list-item', Moobile.List, function(element, name) {

	var instance = Class.instantiate(element.get('data-list-item') || Moobile.ListItem, element, null, name);
	if (instance instanceof Moobile.ListItem) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('grouped', Moobile.List, {
	attach: function(element) { element.addClass('style-grouped'); },
	detach: function(element) { element.removeClass('style-grouped'); }
});


/*
---

name: ListItem

description: Provide a ListItem control used inside a List control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ListItemRoles
	- ListItemStyle

provides:
	- ListItem

...
*/

Moobile.ListItem = new Class({

	Extends: Moobile.Control,

	label: null,

	image: null,

	infos: null,

	options: {
		className: 'list-item'
	},

	setLabel: function(label) {

		if (this.label === label)
			return this;

		this.label.setText(null);

		if (label) {
			if (typeof label == 'string') {
				this.label.setText(label);
			} else {
				this.replaceChildView(this.label, label);
				this.label.destroy();
				this.label = label;
			}
		}

		return this;
	},

	getLabel: function() {
		return this.label;
	},

	setImage: function(image) {

		if (this.image === image)
			return this;

		if (image) {

			if (typeof image == 'string') {
				this.image.setSource(image);
			} else {
				this.replaceChildView(this.image, image);
				this.image.destroy();
				this.image = image;
			}
		}

		return this;
	},

	getImage: function() {
		return this.image;
	},

	setInfos: function(infos) {

		if (this.infos === infos)
			return this;

		this.infos.setText(null);

		if (infos) {
			if (typeof infos == 'string') {
				this.infos.setText(infos);
			} else {
				this.replaceChildView(this.infos, infos);
				this.infos.destroy();
				this.infos = infos;
			}
		}

		return this;
	},

	getInfos: function() {
		return this.infos;
	},

	willLoad: function() {

		this.parent();

		var image = this.getRoleElement('image');
		var label = this.getRoleElement('label');
		var infos = this.getRoleElement('infos');

		if (label == null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
		}

		if (image == null) {
			image = new Element('div');
			image.inject(this.element, 'top');
		}

		if (infos == null) {
			infos = new Element('div');
			infos.inject(this.element);
		}

		this.defineElementRole(label, 'label');
		this.defineElementRole(image, 'image');
		this.defineElementRole(infos, 'infos');
	},

	destroy: function() {
		this.label = null;
		this.image = null;
		this.infos = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('label', Moobile.ListItem, function(element, name) {

	var instance = Class.instantiate(element.get('data-label') || Moobile.Label, element, null, name);
	if (instance instanceof Moobile.Label) {
		this.addChild(instance);
		this.label = instance;
	}

	return instance;
});


Moobile.Entity.defineRole('image', Moobile.ListItem, function(element, name) {

	var instance = Class.instantiate(element.get('data-image') || Moobile.Image, element, null, name);
	if (instance instanceof Moobile.Image) {
		this.addChild(instance);
	}

	this.image = instance;

	if (!this.image.getSource()) {
		this.image.hide();
	}

	return instance;
});

Moobile.Entity.defineRole('infos', Moobile.ListItem, function(element, name) {

	var instance = Class.instantiate(element.get('data-infos') || Moobile.Label, element, null, name);
	if (instance instanceof Moobile.Label) {
		this.addChild(instance);
	}

	this.detail = instance;
	this.detail.getElement().addClass('infos');

	return instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('checked', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

Moobile.Entity.defineStyle('disclosed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

Moobile.Entity.defineStyle('detailed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-detailed'); },
	detach: function(element) { element.removeClass('style-detailed'); }
});


/*
---

name: ActivityIndicator

description: Provide an activity indicator.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ActivityIndicatorRoles
	- ActivityIndicatorStyle

provides:
	- ActivityIndicator

...
*/

Moobile.ActivityIndicator = new Class({

	Extends: Moobile.Control,

	options: {
		className: 'activity-indicator'
	},

	start: function() {
		this.addClass('activity');
		return this;
	},

	pause: function() {
		this.removeClass('activity');
		return this;
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('activity-indicator', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-activity-indicator') || Moobile.ActivityIndicator, element, null, name);
	if (instance instanceof Moobile.ActivityIndicator) {
		this.addChild(instance);
	}

	return instance;
});


/*
---

name: Image

description: Provides a view that contains an image.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Image

...
*/

Moobile.Image = new Class({

	Extends: Moobile.Entity,

	image: null,

	options: {
		className: 'image',
		tagName: 'img'
	},

	setSource: function(source) {

		this.element.set('src', null);
		this.element.hide();

		if (source) {
			this.element.set('src', image);
			this.element.show();
		}

		return this;
	},

	getSource: function() {
		return this.element.get('src');
	},

	destroy: function() {
		this.image = null;
		this.parent();
	}

});


/*
---

name: Label

description: Provides a view that contains some text.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Label

...
*/

Moobile.Label = new Class({

	Extends: Moobile.Entity,

	options: {
		className: 'label'
	},

	setText: function(text) {
		this.element.set('html', text);
		return this;
	},

	getText: function() {
		return this.element.get('html');
	}

});


/*
---

name: Mask

description: Provides a view that creates a mask over a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Mask

...
*/

Moobile.Overlay = new Class({

	Extends: Moobile.Entity,

	options: {
		className: 'overlay'
	},

	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('present');
		return this;
	},

	hideAnimated: function() {
		this.willHide();
		this.element.addClass('dismiss');
		return this;
	},

	didLoad: function() {
		this.parent();
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
	},

	destroy: function() {
		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.parent();
	},

	onAnimationEnd: function(e) {

		if (this.element.hasClass('present')) this.didShow();
		if (this.element.hasClass('dismiss')) {
			this.element.hide();
			this.didHide();
		}

		this.element.removeClass('present');
		this.element.removeClass('dismiss');
	}

});


/*
---

name: Alert

description: Provides an Alert dialog.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- AlertStyle

provides:
	- Alert

...
*/

Moobile.Alert = new Class({

	Extends: Moobile.Overlay,

	title: null,

	message: null,

	dialog: null,

	header: null,

	footer: null,

	content: null,

	buttons: [],

	options: {
		className: 'alert'
	},

	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (this.title instanceof Moobile.Entity) {
			this.title.removeFromOwner();
			this.title.destroy();
			this.title = null;
		}

		this.header.empty();

		if (title instanceof Moobile.Entity) {
			this.addChild(title, 'bottom', this.header);
		} else {
			this.header.set('html', title);
		}

		this.title = title;

		return this;
	},

	getTitle: function() {
		return this.title;
	},

	setMessage: function(message) {

		if (this.message === message)
			return this;

		if (this.message instanceof Moobile.Entity) {
			this.message.removeFromOwner();
			this.message.destroy();
			this.message = null;
		}

		this.content.empty();

		if (message instanceof Moobile.Entity) {
			this.addChild(message, 'bottom', this.content);
		} else {
			this.content.set('html', message);
		}

		this.message = message;

		return this;
	},

	getMessage: function() {
		return this.message;
	},

	addButton: function(button) {
		this.addChild(button, 'bottom', this.footer);
		return this;
	},

	didLoad: function() {

		this.parent();

		this.header  = new Element('div.dialog-header');
		this.footer  = new Element('div.dialog-footer');
		this.content = new Element('div.dialog-content');

		this.dialog = new Element('div.dialog');
		this.dialog.grab(this.header);
		this.dialog.grab(this.content);
		this.dialog.grab(this.footer);

		this.element.grab(this.dialog);
	},

	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.addEvent('click', this.bound('onButtonClick'));
			entity.addEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.addEvent('mousedown', this.bound('onButtonMouseUp'));
			this.buttons.include(entity);
		}
	},

	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.removeEvent('click', this.bound('onButtonClick'));
			entity.removeEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.removeEvent('mousedown', this.bound('onButtonMouseUp'));
			this.button.erase(entity);
		}
	},

	willShow: function() {

		this.parent();

		if (this.buttons.length == 0) {

			var button = new Moobile.Button();
			button.setLabel('OK');
			button.setHighlighted(true);

			this.addButton(button);
		}
	},

	destroy: function() {

		this.dialog = null;
		this.header = null;
		this.footer = null;
		this.content = null;
		this.buttons = null;
		this.message = null;
		this.title = null;

		this.parent();
	},

	onButtonClick: function(e) {

		this.fireEvent('buttonClick', e.target);

		if (this.buttons.length == 1) {
			this.hideAnimated();
		}
	},

	onButtonMouseUp: function() {
		this.fireEvent('buttonMouseUp');
	},

	onButtonMouseDown: function() {
		this.fireEvent('buttonMouseDown');
	}

});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('horizontal', Moobile.Alert, {
	attach: function() { this.element.addClass('style-horizontal'); },
	detach: function() { this.element.removeClass('style-horizontal'); }
});


/*
---

name: ViewContent

description: Provides the content of a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- ViewContent

...
*/

Moobile.ViewContent = new Class({

	Extends: Moobile.Entity,

	options: {
		className: 'view-content'
	}

});


/*
---

name: ScrollView

description: Provides a view that scroll up or down when the content is larger
             that the view area.

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

Moobile.ScrollView = new Class({

	Extends: Moobile.View,

	wrapper: null,

	scroller: null,

	defaultContentOffset: {
		x: 0,
		y: 0
	},

	scrollTo: function(x, y, time, relative) {
		this.scroller.scrollTo(x, y, time, relative);
		return this;
	},

	scrollToElement: function(element, time) {
		this.scroller.scrollToElement(element, time);
		return this;
	},

	scrollToPage: function (pageX, pageY, time) {
		this.scroller.scrollToPage(pageX, pageY, time);
		return this;
	},

	getWrapper: function() {
		return this.wrapper;
	},

	getScroller: function() {
		return this.scroller;
	},

	getContentSize: function() {
		return this.content.getScrollSize();
	},

	getContentOffset: function() {
		return this.scroller.getOffset();
	},

	didLoad: function() {

		this.parent();

		this.wrapper = new Element('div.wrapper');
		this.wrapper.wraps(this.content);

		if (this.options.className) {
			this.element.addClass('scroll-' + this.options.className);
			this.wrapper.addClass('scroll-' + this.options.className + '-wrapper');
		}

		this.scroller = new Moobile.Scroller(this.wrapper, this.content);

		this.scroller.addEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.addEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.addEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.addEvent('refresh', this.bound('onViewScrollRefresh'));
	},

	didBecomeReady: function() {
		this.scroller.refresh();
	},

	didShow: function() {
		this.parent();
		this.scroller.enable();
		this.scroller.scrollTo(this.defaultContentOffset.x, this.defaultContentOffset.y);
	},

	willHide: function() {
		this.parent();
		this.defaultContentOffset = this.scroller.getOffset();
		this.scroller.disable();
	},

	destroy: function() {

		this.scroller.removeEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.removeEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.removeEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.removeEvent('refresh', this.bound('onViewScrollRefresh'));

		this.scroller.destroy();
		this.scroller = null;
		this.wrapper = null;

		this.parent();
	},

	onViewScrollRefresh: function() {
		this.fireEvent('scrollrefresh');
	},

	onViewScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	onViewScrollMove: function() {
		this.fireEvent('scrollmove');
	},

	onViewScrollEnd: function() {
		this.fireEvent('scrollend');
	}

});


/*
---

name: ViewPanel

description: Provides the view used in a ViewControllerPanel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewPanel

...
*/

Moobile.ViewPanel = new Class({

	Extends: Moobile.View,

	sidePanel: null,

	mainPanel: null,

	getSidePanel: function() {
		return this.content.getSidePanel();
	},

	getMainPanel: function() {
		return this.content.getMainPanel();
	},

	didLoad: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-panel');
		}
	},

	destroy: function() {
		this.sidePanel = null;
		this.mainPanel = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.ViewPanel, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewPanelContent, element, null, name);
	if (instance instanceof Moobile.ViewPanelContent) {
		this.addChild(instance);
		this.content = instance;
	}

	return instance;
});



/*
---

name: ViewPanelContent

description: Provides the content of a view panel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- ViewContent

...
*/

Moobile.ViewPanelContent = new Class({

	Extends: Moobile.ViewContent,

	getSidePanel: function() {
		return this.sidePanel;
	},

	getMainPanel: function() {
		return this.mainPanel;
	},

	willLoad: function() {

		this.parent();

		var main = this.getRoleElement('main-panel');
		if (main == null) {
			main = new Element('div');
			main.ingest(this.element);
			main.inject(this.element);
		}

		var side = this.getRoleElement('side-panel');
		if (side == null) {
			side = new Element('div');
			side.inject(this.element, 'top');
		}

		this.defineElementRole(main, 'main-panel');
		this.defineElementRole(side, 'side-panel');
	}

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('side-panel', Moobile.ViewPanelContent, function(element, options) {

	this.sidePanel = new Moobile.Entity(element, options);

	this.addChild(this.sidePanel);

	var className = this.options.className;
	if (className) {
		this.sidePanel.addClass('side-panel');
	}
});

Moobile.Entity.defineRole('main-panel', Moobile.ViewPanelContent, function(element, options) {

	this.mainPanel = new Moobile.Entity(element, options);

	this.addChild(this.mainPanel);

	var className = this.options.className;
	if (className) {
		this.mainPanel.addClass('main-panel');
	}
});


/*
---

name: ViewStack

description: Provides a view used in a ViewControllerStack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewStack

...
*/

Moobile.ViewStack = new Class({

	Extends: Moobile.View,

	didLoad: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-stack');
		}
	}

});


/*
---

name: Scroller

description: Provides a wrapper for the iScroll class.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Class.Mutator.Property

provides:
	- Scroller

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

Moobile.Scroller = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	ready: null,

	content: null,

	wrapper: null,

	scroller: null,

	size: null,

	options: {
		useTransform: true,
		useTransition: true,
		hideScrollbar: true,
		fadeScrollbar: true,
		checkDOMChanges: true,
		snap: false
	},

	initialize: function(wrapper, content, options) {

		this.setOptions(options);

		wrapper = document.id(wrapper);
		content = document.id(content);

		if (content == null) {
			content = new Element('div')
			content.ingest(wrapper);
			content.inject(wrapper);
		}

		this.content = content;
		this.wrapper = wrapper;

		this.scroller = new iScroll(this.wrapper, this.options);

		this.attachEvents();

		return this;
	},

	attachEvents: function() {
		this.scroller.options.onScrollStart = this.bound('onScrollStart');
		this.scroller.options.onScrollMove = this.bound('onScrollMove');
		this.scroller.options.onScrollEnd = this.bound('onScrollEnd');
		this.scroller.options.onRefresh = this.bound('onRefresh');
	},

	detachEvents: function() {
		this.scroller.options.onScrollStart = null;
		this.scroller.options.onScrollMove = null;
		this.scroller.options.onScrollEnd = null;
		this.scroller.options.onRefresh = null;
	},

	getCurrentPage: function() {
		return {
			x: this.scroller.currPageX,
			y: this.scroller.currPageY
		};
	},

	getAbsoluteDistance: function() {
		return {
			x: this.scroller.absDistX,
			y: this.scroller.absDistY
		};
	},

	getDistance: function() {
		return {
			x: this.scroller.distX,
			y: this.scroller.distY
		};
	},

	getDirection: function() {
		return {
			x: this.scroller.dirX,
			y: this.scroller.dirY
		};
	},

	getAbsoluteStart: function() {
		return {
			x: this.scroller.absStartX,
			y: this.scroller.absStartY
		};
	},

	getStart: function() {
		return {
			x: this.scroller.startX,
			y: this.scroller.startY
		};
	},

	getPages: function() {
		return {
			x: this.scroller.pagesX,
			y: this.scroller.pagesY
		};
	},

	getOffset: function() {

		// TODO: I just realized this information might be found in iscroll
		// directly, I'll have to fix this instead of using "fancy"
		// regular expressions

		var x = 0;
		var y = 0;

		var position = this.content.getStyle('-webkit-transform');
		if (position) position = position.match(/translate3d\(-*(\d+)px, -*(\d+)px, -*(\d+)px\)/);
		if (position) {
			if (position[1]) x = -position[1];
			if (position[2]) y = -position[2];
		}

		return {x: x, y: y};
	},

	isZoomed: function() {
		return this.scroller.zoomed;
	},

	isMoved: function() {
		return this.scroller.moved;
	},

	isReady: function() {
		return this.scroller.isReady();
	},

	scrollTo: function(x, y, time, relative) {
		(function() { this.scroller.scrollTo(x, y, time, relative); }).delay(5, this);
		return this;
	},

	scrollToElement: function(element, time) {
		(function() { this.scroller.scrollToElement(element, time); }).delay(5, this);
		return this;
	},

	scrollToPage: function (pageX, pageY, time) {
		(function() { this.scroller.scrollToPage(pageX, pageY, time); }).delay(5, this);
		return this;
	},

	refresh: function() {
		this.scroller.refresh();
		return this;
	},

	disable: function () {
		this.scroller.disable();
		return this;
	},

	enable: function () {
		this.scroller.enable();
		this.scroller.refresh();
		return this;
	},

	stop: function() {
		this.scroller.stop();
		return this;
	},

	destroy: function() {
		this.scroller.destroy();
		return this;
	},

	onRefresh: function() {
		this.fireEvent('refresh');
	},

	onScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	onScrollMove: function() {
		this.fireEvent('scrollmove');
	},

	onScrollEnd: function() {
		this.fireEvent('scrollend');
	}

});


/*
---

name: Scroller.Carousel

description: Creates a Scroller that snaps to elements.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller

provides:
	- Scroller.Carousel

...
*/

Moobile.Scroller.Carousel = new Class({

	Extends: Moobile.Scroller,

	elements: [],

	options: {
		layout: 'horizontal',
		momentum: false,
		hScrollbar: false,
		vScrollbar: false,
		snap: true,
		snapThreshold: 40
	},

	initialize: function(wrapper, content, options) {

		this.parent(wrapper, content, options);

		this.wrapper.addClass('carousel');
		this.wrapper.addClass('carousel-' + this.options.layout);

		this.elements = this.content.getElements('>');
		this.elements.addClass('slide');

		this.update();

		return this;
	},

	update: function() {

		var size = null;
		var style = null;

		switch (this.options.layout) {
			case 'horizontal':
				size = this.wrapper.getSize().x;
				style = 'width';
				break;
			case 'vertical':
				size = this.wrapper.getSize().y;
				style = 'height';
				break;
		}

		this.elements.setStyle(style, 100 / this.elements.length + '%');
		this.content.setStyle(style, 100 * this.elements.length + '%');

		this.scroller.options.snapThreshold = size * this.options.snapThreshold / 100;
	},

	onRefresh: function() {
		this.parent();
		this.update();
	}

});


/*
---

name: ViewTransition

description: Provides the base class for view transitions.

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

Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Chain,
		Class.Binds
	],

	subjects: [],

	options: {},

	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	animate: function(subject, className) {
		this.addSubject(subject, className);
		this.fireEvent('start');
		return this;
	},

	addSubject: function(subject, className) {

		var element = document.id(subject);
		if (element == null)
			return this;

		element.store('view-transition:transition-class', className);
		element.addClass(className);
		element.addEvent('transitionend', this.bound('onComplete'));
		element.addEvent('animationend', this.bound('onComplete'));
		this.subjects.push(element);

		return this;
	},

	removeSubject: function(subject) {

		var element = document.id(subject);
		if (element == null)
			return this;

		var className = element.retrieve('view-transition:transition-class');
		element.removeClass(className);
		element.removeEvent('transitionend', this.bound('onComplete'));
		element.removeEvent('animationend', this.bound('onComplete'));
		this.subjects.erase(element);

		return this;
	},

	clearSubjects: function() {
		this.subjects.each(this.bound('clearSubject'));
		this.subjects = [];
		return this;
	},

	clearSubject: function(subject) {
		var className = subject.retrieve('view-transition:transition-class');
		subject.removeClass(className);
		subject.removeEvent('transitionend', this.bound('onComplete'));
		subject.removeEvent('animationend', this.bound('onComplete'));
		return this;
	},

	enter: function(viewToShow, viewToHide, parentView, first) {

		if (viewToShow) {
			viewToShow.show();
			viewToShow.disable();
		}

		if (viewToHide) {
			viewToHide.disable();
		}

		this.addEvent('stop:once', this.didEnter.pass([viewToShow, viewToHide, parentView, first], this));
	},

	leave: function(viewToShow, viewToHide, parentView) {

		if (viewToShow){
			viewToShow.show();
			viewToShow.disable();
		}

		if (viewToHide) {
			viewToHide.disable();
		}

		this.addEvent('stop:once', this.didLeave.pass([viewToShow, viewToHide, parentView], this));
	},

	didEnter: function(viewToShow, viewToHide, parentView, first) {

		if (viewToShow) {
			viewToShow.enable();
		}

		if (viewToHide) {
			viewToHide.hide();
			viewToHide.enable();
		}
	},

	didLeave: function(viewToShow, viewToHide, parentView) {

		if (viewToShow) {
			viewToShow.enable();
		}

		if (viewToHide) {
			viewToHide.hide();
			viewToHide.enable();
		}
	},

	onComplete: function(e) {

		e.stop();

		if (this.subjects.contains(e.target)) {
			this.clearSubjects();
			this.fireEvent('stop');
			this.fireEvent('complete');
		}
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

Moobile.ViewTransition.Slide = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		if (first) {
			this.animate(viewToShow, 'transition-slide-enter-first');
			return this;
		}

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-slide-enter');
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-slide-leave');
	}

});


/*
---

name: ViewTransition.Cover

description: Provide a vertical slide view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cover

...
*/

Moobile.ViewTransition.Cover = new Class({

	Extends: Moobile.ViewTransition,

	options: {
		presentation: 'fullscreen' // center, box
	},

	overlay: null,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		switch (this.options.presentation) {

			case 'box':
				this.overlay = new Moobile.Overlay();
				viewToShow = new Element('div.transition-cover-view-wrapper').wraps(viewToShow);
				parentView.addClass('transition-cover-box');
				break;

			case 'center':
				this.overlay = new Moobile.Overlay();
				parentView.addClass('transition-cover-center');
				break;

			case 'fullscreen':
				this.overlay = null;
				break;
		}

		if (this.overlay) {

			this.overlay.addClass('transition-cover-overlay');

			this.overlay.addEvent('show', this.bound('onMaskShow'));
			this.overlay.addEvent('hide', this.bound('onMaskHide'));

			parentView.addChild(this.overlay)

			this.overlay.showAnimated();
		}

		if (first) {
			this.animate(viewToShow, 'transition-cover-enter-first');
			return;
		}

		viewToHide.addClass('transition-cover-background-view');
		viewToShow.addClass('transition-cover-foreground-view');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cover-enter');
	},

	didEnter: function(viewToShow, viewToHide, parentView, first) {
		this.parent(viewToShow, viewToHide, parentView, first);
		viewToHide.show();
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		if (this.overlay) {
			this.overlay.hideAnimated();
		}

		if (this.options.presentation == 'box') {
			var viewToHideElement = document.id(viewToHide);
			var viewToHideWrapper = viewToHideElement.getParent('.transition-cover-view-wrapper');
			if (viewToHideWrapper) {
				viewToHide = viewToHideWrapper;
			}
		}

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cover-leave');
	},

	didLeave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		switch (this.options.presentation) {

			case 'box':

				var viewToHideElement = document.id(viewToHide);
				var viewToHideWrapper = viewToHideElement.getParent('.transition-cover-view-wrapper');
				if (viewToHideWrapper) {
					viewToHideElement.inject(viewToHideWrapper, 'after');
					viewToHideWrapper.destroy();
					viewToHideWrapper = null;
				}

				parentView.removeClass('transition-cover-box');

				break;

			case 'center':
				parentView.removeClass('transition-cover-center');
				break;

			case 'fullscreen':
				break;
		}

		viewToHide.removeClass('transition-cover-foreground-view');
		viewToShow.removeClass('transition-cover-background-view');

	},

	onMaskShow: function() {

	},

	onMaskHide: function() {
		this.overlay.destroy();
		this.overlay = null;
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

Moobile.ViewTransition.Cubic = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		this.addSubject(parentView, 'transition-cubic-perspective');
		this.addSubject(viewToShow, 'transition-view-to-show');

		if (first) {
			this.animate(parentView.getContent(), 'transition-cubic-enter-first');
			return this;
		}

		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cubic-enter');
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(parentView, 'transition-cubic-perspective');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cubic-leave');
	}

});



/*
---

name: ViewTransition.Fade

description: Provide a fade view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Fade

...
*/

Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		if (first) {
			this.animate(parentView.getContent(), 'transition-fade-enter-first');
			return this;
		}

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-fade-enter');
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(viewToHide, 'transition-view-to-hide');
		this.addSubject(viewToShow, 'transition-view-to-show');

		this.animate(parentView.getContent(), 'transition-fade-leave');
	}

});



/*
---

name: ViewTransition.Flip

description: Provide a flip view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Flip

...
*/

Moobile.ViewTransition.Flip = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		this.addSubject(parentView, 'transition-flip-perspective');
		this.addSubject(viewToShow, 'transition-view-to-show');

		if (first) {
			this.animate(parentView.getContent(), 'transition-flip-enter-first');
			return this;
		}

		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-flip-enter');
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(parentView, 'transition-flip-perspective');

		this.addSubject(viewToHide, 'transition-view-to-hide');
		this.addSubject(viewToShow, 'transition-view-to-show');

		this.animate(parentView.getContent(), 'transition-flip-leave');
	}

});



/*
---

name: ViewTransition.None

description: Provide a non-animated view transition

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.None

...
*/

Moobile.ViewTransition.None = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {
		this.parent(viewToShow, viewToHide, parentView, first);
		this.fireEvent('stop');
		this.fireEvent('complete');
	},

	leave: function(viewToShow, viewToHide, parentView) {
		this.parent(viewToShow, viewToHide, parentView);
		this.fireEvent('stop');
		this.fireEvent('complete');
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
	- Core/Class
	- Core/Class.Extras
	- Core/Event
	- Core/Element
	- Core/Element.Event
	- Class-Extras/Class.Binds
	- Class.Instantiate
	- Class.Mutator.Property
	- Event.Loaded

provides:
	- ViewController

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.ViewController = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	name: null,

	title: null,

	image: null,

	modal: false,

	view: null,

	viewReady: false,

	viewTransition: null,

	viewControllerStack: null,

	viewControllerPanel: null,

	parentViewController: null,

	modalViewController: null,

	childViewControllers: [],

	initialize: function(options, name) {

		this.name = name;

		this.setOptions(options);

		this.loadView();

		if (this.view) {
			this.view.addEvent('ready', this.bound('onViewReady'));
		}

		return this;
	},

	loadView: function() {
		this.view = new Moobile.View();
	},

	destroy: function() {

		this.destroyChildViewControllers();

		this.view.destroy();
		this.view = null;

		this.viewTransition = null;
		this.viewControllerStack = null;
		this.viewControllerPanel = null;
		this.parentViewController = null;
	},

	destroyChildViewControllers: function() {
		this.childViewControllers.each(this.bound('destroyChildViewController'));
		this.childViewControllers.empty();
	},

	destroyChildViewController: function(viewController) {
		viewController.destroy();
		viewController = null;
	},

	addChildViewController: function(viewController, where, context) {

		if (this.childViewControllers.contains(viewController))
			return false;

		this.willAddChildViewController(viewController);

		viewController.parentViewControllerWillChange(this);

		if (!viewController.isModal()) {
			if (!viewController.getViewControllerStack()) viewController.setViewControllerStack(this.viewControllerStack);
			if (!viewController.getViewControllerPanel()) viewController.setViewControllerPanel(this.viewControllerPanel);
		}

		viewController.setParentViewController(this);
		viewController.parentViewControllerDidChange(this);

		this.childViewControllers.push(viewController);
		this.view.addChild(viewController.getView(), where, context);
		this.didAddChildViewController(viewController);

		return true;
	},

	getChildViewController: function(name) {
		return this.childViewControllers.find(function(viewController) {
			return viewController.getName() == name;
		});
	},

	getChildViewControllers: function() {
		return this.childViewControllers;
	},

	removeChildViewController: function(viewController) {

		if (!this.childViewControllers.contains(viewController))
			return false;

		this.willRemoveChildViewController(viewController);

		this.childViewControllers.erase(viewController);

		viewController.parentViewControllerWillChange(null);
		viewController.setViewControllerStack(null);
		viewController.setViewControllerPanel(null);
		viewController.setParentViewController(null);
		viewController.parentViewControllerDidChange(null);

		this.didRemoveChildViewController(viewController);

		viewController.getView().removeFromOwner();

		return true;
	},

	removeFromParentViewController: function() {
		return this.parentViewController
			 ? this.parentViewController.removeChildViewController(this)
			 : false;
	},

	presentModalViewController: function(viewController, viewTransition) {

		if (this.modalViewController)
			return this;

		this.modalViewController = viewController;
		this.modalViewController.modal = true;

		this.willPresentModalViewController();

		var viewToShow = this.modalViewController.getView();
		var viewToHide = this.view;
		var parentView = this.view.getOwnerView();

		this.addChildViewController(this.modalViewController, 'after', viewToHide);

		viewTransition = viewTransition || new Moobile.ViewTransition.Cover;
		viewTransition.addEvent('start:once', this.bound('onPresentTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPresentTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			parentView
		);

		this.modalViewController.setViewTransition(viewTransition);

		return this;
	},

	dismissModalViewController: function() {

		if (this.modalViewController == null)
			return this;

		this.willDismissModalViewController()

		var viewToShow = this.view;
		var viewToHide = this.modalViewController.getView();
		var parentView = this.view.getOwnerView();

		var viewTransition = this.modalViewController.viewTransition;
		viewTransition.addEvent('start:once', this.bound('onDismissTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onDismissTransitionCompleted'));
		viewTransition.leave(
			viewToShow,
			viewToHide,
			parentView
		);

		return this;
	},

	getName: function() {
		return this.name;
	},

	setTitle: function(title) {
		this.title = title;
		return this;
	},

	getTitle: function() {
		return this.title;
	},

	setImage: function(image) {
		this.image = image;
	},

	getImage: function() {
		return this.image;
	},

	isModal: function() {
		return this.modal;
	},

	isViewReady: function() {
		return this.viewReady;
	},

	getView: function() {
		return this.view;
	},

	setViewTransition: function(viewTransition) {
		this.viewTransition = viewTransition;
		return this;
	},

	getViewTransition: function() {
		return this.viewTransition;
	},

	setViewControllerStack: function(viewControllerStack) {
		this.viewControllerStack = viewControllerStack;
		return this;
	},

	getViewControllerStack: function() {
		return this.viewControllerStack;
	},

	setViewControllerPanel: function(viewControllerPanel) {
		this.viewControllerPanel = viewControllerPanel;
		return this
	},

	getViewControllerPanel: function(viewControllerPanel) {
		return this.viewControllerPanel;
	},

	setParentViewController: function(parentViewController) {
		this.parentViewController = parentViewController;
		return this;
	},

	getParentViewController: function() {
		return this.parentViewController;
	},

	willAddChildViewController: function(viewController) {

	},

	didAddChildViewController: function(viewController) {

	},

	willRemoveChildViewController: function(viewController) {

	},

	didRemoveChildViewController: function(viewController) {

	},

	parentViewControllerWillChange: function(viewController) {

	},

	parentViewControllerDidChange: function(viewController) {

	},

	willPresentModalViewController: function() {

	},

	didPresentModalViewController: function() {

	},

	willDismissModalViewController: function() {

	},

	didDismissModalViewController: function() {

	},

	viewDidBecomeReady: function() {

	},

	viewWillEnter: function() {

	},

	viewDidEnter: function() {

	},

	viewWillLeave: function() {

	},

	viewDidLeave: function() {

	},

	onViewReady: function() {
		this.viewReady = true;
		this.viewDidBecomeReady();
	},

	onPresentTransitionStart: function() {
		this.modalViewController.viewWillEnter();
	},

	onPresentTransitionCompleted: function() {
		this.modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	onDismissTransitionStart: function() {
		this.modalViewController.viewWillLeave();
	},

	onDismissTransitionCompleted: function() {
		this.modalViewController.viewDidLeave();
		this.modalViewController.removeFromParentViewController();
		this.modalViewController.destroy();
		this.modalViewController = null;
		this.didDismissModalViewController();
	}

});


/*
---

name: ViewControllerStack

description: Provides a ViewController that handles multiple views inside its
             own view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerStack

...
*/

Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	topViewController: null,

	loadView: function() {
		this.view = new Moobile.ViewStack();
	},

	getTopViewController: function() {
		return this.topViewController;
	},

	pushViewController: function(viewController, viewTransition) {

		if (this.topViewController == viewController)
			return;

		var viewControllerPushed = viewController; // ease of understanding

		var viewControllerExists = this.childViewControllers.contains(viewControllerPushed);
		if (viewControllerExists) {
			this.removeChildViewController(viewControllerPushed);
		}

		this.willPushViewController(viewControllerPushed);

		this.addChildViewController(viewControllerPushed);

		this.topViewController = viewControllerPushed;

		var viewControllerBefore = this.childViewControllers.lastItemAt(1);

		var viewToShow = viewControllerPushed.view;
		var viewToHide = viewControllerBefore
					   ? viewControllerBefore.view
					   : null;

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onPushTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPushTransitionComplete'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.view,
			this.childViewControllers.length == 1
		);

		viewControllerPushed.setViewTransition(viewTransition);

		return this;
	},

	onPushTransitionStart: function() {

		var viewControllerPushed = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		viewControllerPushed.viewWillEnter();
	},

	onPushTransitionComplete: function() {

		var viewControllerPushed = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
		}

		this.didPushViewController(viewControllerPushed);

		viewControllerPushed.viewDidEnter();
	},

	popViewControllerUntil: function(viewController) {

		if (this.childViewControllers.length <= 1)
			return this;

		var viewControllerIndex = this.childViewControllers.indexOf(viewController);
		if (viewControllerIndex > -1) {
			for (var i = this.childViewControllers.length - 2; i > viewControllerIndex; i--) {

				var viewControllerToRemove = this.childViewControllers[i];
				viewControllerToRemove.viewWillLeave();
				viewControllerToRemove.viewDidLeave();
				this.removeChildViewController(viewControllerToRemove);

				viewControllerToRemove.destroy();
				viewControllerToRemove = null;
			}
		}

		this.popViewController();

		return this;
	},

	popViewController: function() {

		if (this.childViewControllers.length <= 1)
			return this;

		var viewControllerPopped = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);

		this.willPopViewController(viewControllerPopped);

		this.topViewController = viewControllerBefore;

		var viewTransition = viewControllerPopped.viewTransition;
		viewTransition.addEvent('start:once', this.bound('onPopTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPopTransitionComplete'));
		viewTransition.leave(
			viewControllerBefore.view,
			viewControllerPopped.view,
			this.view
		);

		return this;
	},

	onPopTransitionStart: function() {

		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		var viewControllerPopped = this.childViewControllers.lastItemAt(0);

		viewControllerBefore.viewWillEnter();
		viewControllerPopped.viewWillLeave();
	},

	onPopTransitionComplete: function() {

		var viewControllerPopped = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		viewControllerBefore.viewDidEnter();
		viewControllerPopped.viewDidLeave();

		this.removeChildViewController(viewControllerPopped);

		this.didPopViewController(viewControllerPopped);

		viewControllerPopped.destroy();
		viewControllerPopped = null;
	},

	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	willPushViewController: function(viewController) {

	},

	didPushViewController: function(viewController) {

	},

	willPopViewController: function(viewController) {

	},

	didPopViewController: function(viewController) {

	}

});


/*
---

name: ViewControllerStack.Navigation

description: Provides a ViewControllerStack that automatically add a
             NavigationBar control to each view controller's wiew added.

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

	options: {
		backButton: true,
		backButtonLabel: 'Back'
	},

	willAddChildViewController: function(viewController) {

		this.parent(viewController);

		var view = viewController.getView();

		var navigationBar = view.getChild('navigation-bar');
		if (navigationBar == null) {
			navigationBar = new Moobile.NavigationBar(null, null, 'navigation-bar');
			view.addChild(navigationBar, 'header');
		}

		if (viewController.isModal() || this.childViewControllers.length == 0)
			return this;

		if (this.options.backButton) {

			var backButtonLabel = this.topViewController.getTitle() || this.options.backButtonLabel;
			if (backButtonLabel) {

				var backButton = new Moobile.BarButton(null, null, 'back');
				backButton.setStyle('back');
				backButton.setLabel(backButtonLabel);
				backButton.addEvent('click', this.bound('onBackButtonClick'));

				navigationBar.addLeftBarButton(backButton);
			}
		}
	},

	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		var navigationBar = viewController.getView().getChild('navigation-bar');
		if (navigationBar == null)
			return this;

		var title = viewController.getTitle();
		if (title) {
			navigationBar.setTitle(title)
		}
	},

	onBackButtonClick: function() {
		this.popViewController();
	}

});


/*
---

name: ViewControllerPanel

description: Provide a ViewController that handles two side by side view inside
             it's own view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerCollection

provides:
	- ViewControllerPanel

...
*/

Moobile.ViewControllerPanel = new Class({

	Extends: Moobile.ViewController,

	mainViewController: null,

	sideViewController: null,

	loadView: function() {
		this.view = new Moobile.ViewPanel();
	},

	setMainViewController: function(mainViewController) {

		if (this.mainViewController) {
			this.mainViewController.removeFromParentViewController();
			this.mainViewController.destroy();
			this.mainViewController = null;
		}

		this.mainViewController = mainViewController;

		this.addChildViewController(this.mainViewController, 'top', this.view.getMainPanel());

		return this;
	},

	getMainViewController: function() {
		return this.mainViewController;
	},

	setSideViewController: function(sideViewController) {

		if (this.sideViewController) {
			this.sideViewController.destroy();
			this.sideViewController = null;
		}

		this.sideViewController = sideViewController;

		this.addChildViewController(this.sideViewController, 'top', this.view.getSidePanel());

		return this;
	},

	getSideViewController: function() {
		return this.sideViewController;
	},

	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerPanel(this);
	}

});


/*
---

name: Window

description: Provides the root container for all views.

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

Moobile.Window = new Class({

	Extends: Moobile.View,

	ready: true,

	options: {
		className: 'window'
	},

	initialize: function(options) {
		var element = new Element('div#window');
		element.inject(document.body);
		this.parent(element, options);
		return this;
	},

	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return 'portrait';
			case 90: return 'landscape';
		}
	},

	position: function() {
		window.scrollTo(0, 1);
		return this;
	},

	didLoad: function() {
		window.addEvent('load', this.bound('onWindowLoad'));
		window.addEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	willUnload: function() {
		window.removeEvent('load', this.bound('onWindowLoad'));
		window.removeEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	didAddChild: function(entity) {
		entity.setWindow(this);
	},

	onWindowLoad: function(e) {
		this.position.delay(250);
		return this;
	},

	onWindowOrientationChange: function() {
		this.position();
		this.fireEvent('orientationchange', this.getOrientation());
	}
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.Window, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.WindowContent, element, null, name);

	if (instance instanceof Moobile.WindowContent) {
		this.addChild(instance);
		this.content = instance; // must be assigned after addChild is called
	}

	return instance;
});


/*
---

name: WindowContent

description: Provides the content of a window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewContent

provides:
	- WindowContent

...
*/

Moobile.WindowContent = new Class({

	Extends: Moobile.ViewContent,

	options: {
		className: 'window-content'
	}

});


/*
---

name: WindowController

description: Provides the ViewController that handles a window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- WindowController

...
*/

Moobile.WindowController = new Class({

	Extends: Moobile.ViewController,

	rootViewController: null,

	loadView: function() {
		this.view = new Moobile.Window();
	},

	setRootViewController: function(rootViewController) {

		if (this.rootViewController) {
			this.rootViewController.removeFromParentViewController();
			this.rootViewController.destroy();
			this.rootViewController = null;
		}

		if (rootViewController) {
			this.rootViewController = rootViewController;
			this.addChildViewController(rootViewController);
		}

		return this;
	},

	getRootViewController: function() {
		return this.rootViewController;
	},

	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		this.rootViewController = viewController;
		return this;
	}

});


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
