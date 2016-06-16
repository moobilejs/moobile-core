(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.moobile = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function (global){
/*
requestFrame / cancelFrame
*/"use strict"

var array = require("prime/es5/array")

var requestFrame = global.requestAnimationFrame ||
                   global.webkitRequestAnimationFrame ||
                   global.mozRequestAnimationFrame ||
                   global.oRequestAnimationFrame ||
                   global.msRequestAnimationFrame ||
                   function(callback){
                       return setTimeout(callback, 1e3 / 60)
                   }

var callbacks = []

var iterator = function(time){
    var split = callbacks.splice(0, callbacks.length)
    for (var i = 0, l = split.length; i < l; i++) split[i](time || (time = +(new Date)))
}

var cancel = function(callback){
    var io = array.indexOf(callbacks, callback)
    if (io > -1) callbacks.splice(io, 1)
}

var request = function(callback){
    var i = callbacks.push(callback)
    if (i === 1) requestFrame(iterator)
    return function(){
        cancel(callback)
    }
}

exports.request = request
exports.cancel = cancel

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"prime/es5/array":3}],3:[function(require,module,exports){
/*
array
 - array es5 shell
*/"use strict"

var array = require("../shell")["array"]

var names = (
    "pop,push,reverse,shift,sort,splice,unshift,concat,join,slice,toString,indexOf,lastIndexOf,forEach,every,some" +
    ",filter,map,reduce,reduceRight"
).split(",")

for (var methods = {}, i = 0, name, method; name = names[i++];) if ((method = Array.prototype[name])) methods[name] = method

if (!methods.filter) methods.filter = function(fn, context){
    var results = []
    for (var i = 0, l = this.length >>> 0; i < l; i++) if (i in this){
        var value = this[i]
        if (fn.call(context, value, i, this)) results.push(value)
    }
    return results
}

if (!methods.indexOf) methods.indexOf = function(item, from){
    for (var l = this.length >>> 0, i = (from < 0) ? Math.max(0, l + from) : from || 0; i < l; i++){
        if ((i in this) && this[i] === item) return i
    }
    return -1
}

if (!methods.map) methods.map = function(fn, context){
    var length = this.length >>> 0, results = Array(length)
    for (var i = 0, l = length; i < l; i++){
        if (i in this) results[i] = fn.call(context, this[i], i, this)
    }
    return results
}

if (!methods.every) methods.every = function(fn, context){
    for (var i = 0, l = this.length >>> 0; i < l; i++){
        if ((i in this) && !fn.call(context, this[i], i, this)) return false
    }
    return true
}

if (!methods.some) methods.some = function(fn, context){
    for (var i = 0, l = this.length >>> 0; i < l; i++){
        if ((i in this) && fn.call(context, this[i], i, this)) return true
    }
    return false
}

if (!methods.forEach) methods.forEach = function(fn, context){
    for (var i = 0, l = this.length >>> 0; i < l; i++){
        if (i in this) fn.call(context, this[i], i, this)
    }
}

var toString = Object.prototype.toString

array.isArray = Array.isArray || function(self){
    return toString.call(self) === "[object Array]"
}

module.exports = array.implement(methods)

},{"../shell":5}],4:[function(require,module,exports){
/*
prime
 - prototypal inheritance
*/"use strict"

var has = function(self, key){
    return Object.hasOwnProperty.call(self, key)
}

var each = function(object, method, context){
    for (var key in object) if (method.call(context, object[key], key, object) === false) break
    return object
}

if (!({valueOf: 0}).propertyIsEnumerable("valueOf")){ // fix for stupid IE enumeration bug

    var buggy = "constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(",")
    var proto = Object.prototype

    each = function(object, method, context){
        for (var key in object) if (method.call(context, object[key], key, object) === false) return object
        for (var i = 0; key = buggy[i]; i++){
            var value = object[key]
            if ((value !== proto[key] || has(object, key)) && method.call(context, value, key, object) === false) break
        }
        return object
    }

}

var create = Object.create || function(self){
    var constructor = function(){}
    constructor.prototype = self
    return new constructor
}

var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
var define = Object.defineProperty

try {
    var obj = {a: 1}
    getOwnPropertyDescriptor(obj, "a")
    define(obj, "a", {value: 2})
} catch (e){
    getOwnPropertyDescriptor = function(object, key){
        return {value: object[key]}
    }
    define = function(object, key, descriptor){
        object[key] = descriptor.value
        return object
    }
}

var implement = function(proto){
    each(proto, function(value, key){
        if (key !== "constructor" && key !== "define" && key !== "inherits")
            this.define(key, getOwnPropertyDescriptor(proto, key) || {
                writable: true,
                enumerable: true,
                configurable: true,
                value: value
            })
    }, this)
    return this
}

var prime = function(proto){

    var superprime = proto.inherits

    // if our nice proto object has no own constructor property
    // then we proceed using a ghosting constructor that all it does is
    // call the parent's constructor if it has a superprime, else an empty constructor
    // proto.constructor becomes the effective constructor
    var constructor = (has(proto, "constructor")) ? proto.constructor : (superprime) ? function(){
        return superprime.apply(this, arguments)
    } : function(){}

    if (superprime){

        var superproto = superprime.prototype
        // inherit from superprime
        var cproto = constructor.prototype = create(superproto)

        // setting constructor.parent to superprime.prototype
        // because it's the shortest possible absolute reference
        constructor.parent = superproto
        cproto.constructor = constructor
    }

    // inherit (kindof inherit) define
    constructor.define = proto.define || (superprime && superprime.define) || function(key, descriptor){
        define(this.prototype, key, descriptor)
        return this
    }

    // copy implement (this should never change)
    constructor.implement = implement

    // finally implement proto and return constructor
    return constructor.implement(proto)

}

prime.has    = has
prime.each   = each
prime.create = create
prime.define = define

module.exports = prime

},{}],5:[function(require,module,exports){
/*
shell
*/"use strict"

var prime = require("./index"),
    type  = require("./type")

var slice = Array.prototype.slice

var ghost = prime({

    constructor: function ghost(self){

        this.valueOf = function(){
            return self
        }

        this.toString = function(){
            return self + ""
        }

        this.is = function(object){
            return self === object
        }
    }

})

var shell = function(self){
    if (self == null || self instanceof ghost) return self
    var g = shell[type(self)]
    return (g) ? new g(self) : self
}

var register = function(){

    var g = prime({inherits: ghost})

    return prime({

        constructor: function(self){
            return new g(self)
        },

        define: function(key, descriptor){
            var method = descriptor.value

            this[key] = function(self){
                return (arguments.length > 1) ? method.apply(self, slice.call(arguments, 1)) : method.call(self)
            }

            g.prototype[key] = function(){
                return shell(method.apply(this.valueOf(), arguments))
            }

            prime.define(this.prototype, key, descriptor)

            return this
        }

    })

}

for (var types = "string,number,array,object,date,function,regexp".split(","), i = types.length; i--;) shell[types[i]] = register()

module.exports = shell

},{"./index":4,"./type":6}],6:[function(require,module,exports){
/*
type
*/"use strict"

var toString = Object.prototype.toString,
    types = /number|object|array|string|function|date|regexp|boolean/

var type = function(object){
    if (object == null) return "null"
    var string = toString.call(object).slice(8, -1).toLowerCase()
    if (string === "number" && isNaN(object)) return "null"
    if (types.test(string)) return string
    return "object"
}

module.exports = type

},{}],7:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/0.1/Animation/Animation
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
moobile.Animation = new Class({

	Extends: moobile.Firer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	__name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	__running: false,

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
		'animation-delay': null,
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	options: {
		validate: null
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
		this.__name = name;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this.__name;
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

		this.element.addEvent('ownanimationend', this.bound('__onAnimationEnd'));
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

		this.element.removeEvent('ownanimationend', this.bound('__onAnimationEnd'));
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

		if (this.__running)
			return this;

		this.__running = true;
		this.attach();
		this.fireEvent('start');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Animation/Animation#stop
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	stop: function() {

		if (this.__running === false)
			return this;

		this.__running = false;
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
		return this.__running;
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	__onAnimationEnd: function(e) {

		if (this.__running === false)
			return;

		var valid = true;

		var validate = this.options.validate;
		if (validate) {
			valid = validate(e, this.element)
		} else {
			valid = e.target === this.element;
		}

		if (!valid) return;

		e.stop();

		this.__running = false;
		this.fireEvent('end');
		this.detach();
	}

});
},{}],8:[function(require,module,exports){
"use strict"

var updateLayoutTime = null;
var updateLayoutRoot = null;

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Component = moobile.Component = new Class({

	Extends: moobile.Firer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__ready: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__window: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__children: [],

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__display: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__visible: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__visibleAnimation: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__style: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__listeners: {},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__callbacks: {},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__size: {
		x: 0,
		y: 0
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__updateLayout: false,

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
		tagName: 'div',
		components: null
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#initialization
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	initialize: function(element, options, name) {

		this.setElement(element);
		this.setOptions(options);

		this.__name = name || this.element.get('data-name');

		var marker = this.element;
		var exists = document.contains(this.element);
		if (exists) this.element = this.element.clone(true, true);

		this.__willBuild();
		this.__build();
		this.__didBuild();

		if (exists) this.element.replaces(marker);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	destroy: function() {

		this.removeEvents();
		this.removeFromParentComponent();
		this.removeAllChildComponents(true);

		this.element.destroy();
		this.element = null;

		this.__window = null;
		this.__parent = null;
		this.__children = null;
		this.__callbacks = null;
		this.__listeners = null;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setElement: function(element) {

		if (this.element) {
			this.element.destroy();
			this.element = null;
		}

		this.element = Element.from(element);
		if (this.element === null) {
			this.element = document.createElement(this.options.tagName);
		}

		this.element.store('moobile:component', this);

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setOptions: function(options) {

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

		return this.parent(options)
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	addEvent: function(type, fn, internal) {

		var name = type.split(':')[0];

		if (this.supportNativeEvent(name)) {

			var self = this;
			var listeners = this.__listeners;
			var callbacks = this.__callbacks;
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
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	removeEvent: function(type, fn) {

		if (this.supportNativeEvent(type)) {
			var listeners = this.__listeners;
			var callbacks = this.__callbacks;
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#supportNativeEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	supportNativeEvent: function(name) {
		return [
			'click', 'dblclick', 'mouseup', 'mousedown',
			'mouseover', 'mouseout','mousemove',
			'keydown', 'keypress', 'keyup',
			'touchstart', 'touchmove', 'touchend', 'touchcancel',
			'gesturestart', 'gesturechange', 'gestureend',
			'tap', 'tapstart', 'tapmove', 'tapend', 'tapcancel',
			'pinch', 'swipe', 'touchold',
			'animationend', 'transitionend', 'owntransitionend', 'ownanimationend'
		].contains(name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponent: function(component, where, context) {

		component.removeFromParentComponent();

		if (context) {
			context = document.id(context) || this.element.getElement(context);
		} else {
			context = this.element;
		}

		this.__willAddChildComponent(component);

		var element = document.id(component)
		if (where || !this.hasElement(element)) {
			element.inject(context, where);
		}

		setComponentIndex.call(this, component);
		component.__setParent(this);
		component.__setWindow(this.__window);
		this.__didAddChildComponent(component);

		this.updateLayout();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentInside
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentInside: function(component, context, where) {
		return this.addChildComponent(component,  where, document.id(context) || this.getElement(context));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentAfter: function(component, after) {
		return this.addChildComponent(component, 'after', after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	addChildComponentBefore: function(component, before) {
		return this.addChildComponent(component, 'before', before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addChildComponentAt: function(component, index) {

		var children = this.__children;

		if (index > children.length) {
			index = children.length;
		} else if (index < 0) {
			index = 0;
		}

		var before = this.getChildComponentAt(index);
		if (before) {
			return this.addChildComponentBefore(component, before);
		}

		return this.addChildComponent(component, 'bottom');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponent: function(name) {
		return this.__children.find(function(child) { return child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getChildComponentByType: function(type, name) {
		return this.__children.find(function(child) { return child instanceof type && child.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentAt: function(index) {
		return this.__children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentByTypeAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getChildComponentByTypeAt: function(type, index) {
		return this.getChildComponentsByType(type)[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponentIndex: function(component) {
		return this.__children.indexOf(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildComponents: function() {
		return this.__children;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getChildComponentsByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since 0.3.0
	 */
	getChildComponentsByType: function(type) {
		return this.__children.filter(function(child) { return child instanceof type });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildComponent: function(component) {
		return this.__children.contains(component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasChildComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasChildComponentByType: function(type) {
		return this.__children.some(function(child) { return child instanceof type; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getComponent
	 * @author Tin LE GALL (imbibinebe@gmail.com)
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getComponent: function(name) {

	    var component = this.getChildComponent(name);
	    if (component === null) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].getComponent(name);
				if (found) return found;
			}
		}

	    return component;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getComponentByType: function(type, name) {

	    var component = this.getChildComponentByType(type, name);
	    if (component === null) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].getComponentByType(type, name);
				if (found) return found;
			}
		}

		return component;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasComponent: function(name) {

	    var exists = this.hasChildComponent(name);
	    if (exists === false) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].hasComponent(name);
				if (found) return found;
			}
		}

	    return exists;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasComponentByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasComponentByType: function(type, name) {

	    var exists = this.hasChildComponentByType(type, name);
	    if (exists === false) {
			for (var i = 0, len = this.__children.length; i < len; i++) {
				var found = this.__children[i].hasComponentByType(type, name);
				if (found) return found;
			}
		}

	    return exists;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#replaceChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	replaceChildComponent: function(component, replacement, destroy) {
		return this.addChildComponentBefore(replacement, component).removeChildComponent(component, destroy);
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
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	removeChildComponent: function(component, destroy) {

		if (this.hasChildComponent(component) === false)
			return this;

		this.__willRemoveChildComponent(component);

		var element = component.getElement();
		if (element) {
			element.dispose();
		}

		this.__children.erase(component);
		component.__setParent(null);
		component.__setWindow(null);
		this.__didRemoveChildComponent(component);

		if (destroy) {
			component.destroy();
		}

		this.updateLayout();

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponents
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildComponents: function(destroy) {
		return this.removeAllChildComponentsByType(Component, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#removeAllChildComponentsByType
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllChildComponentsByType: function(type, destroy) {

		this.__children.filter(function(child) {
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setParentComponent
	 * @author Yannick Gagnon (yannick.gagnon@gmail.com)
	 * @since  0.3.0
	 */
	setParentComponent: function(parentComponent) {
		this.__setParent(parentComponent);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentComponent: function() {
		return this.__parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasParentComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasParentComponent: function() {
		return !!this.__parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setWindow
	 * @author Yannick Gagnon (yannick.gagnon@gmail.com)
	 * @since  0.3.0
	 */
	setWindow: function(window) {
		this.__setWindow(window);
		this.getChildComponents().each(function(component) {
			component.setWindow(window);
		}, this);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWindow: function() {
		return this.__window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasWindow
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasWindow: function() {
		return !!this.__window;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isReady: function() {
		return this.__ready;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this.__name;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#setStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setStyle: function(name) {

		if (arguments.length === 2) {

			this.element.setStyle(
				arguments[0],
				arguments[1]
			);

			return this.updateLayout();
		}

		if (this.__style) {
			this.__style.detach.call(this, this.element);
			this.__style = null;
		}

		var style = Component.getStyle(name, this);
		if (style) {
			style.attach.call(this, this.element);
		}

		this.__style = style;

		return this.updateLayout();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#getStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getStyle: function() {
		return arguments.length === 1 ? this.element.getStyle(arguments[0]) : this.__style && this.__style.name || null
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hasStyle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hasStyle: function(name) {
		return this.__style ? this.__style.name === name : false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addClass: function(name) {

		var element = this.element;
		if (element.hasClass(name) === false) {
			element.addClass(name);
			this.updateLayout();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#addClass
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeClass: function(name) {

		var element = this.element;
		if (element.hasClass(name) === true) {
			element.removeClass(name);
			this.updateLayout();
		}

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
		this.updateLayout();
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

		if (this.__size.x !== x ||
			this.__size.y !== y) {
			this.updateLayout();
		}

		this.__size.x = x;
		this.__size.y = y;

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
		return this.element.getPosition(document.id(relative) || this.__parent);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#show
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	show: function(animation) {

		if (this.__display === true ||
			this.__visible === true)
			return this;

		if (this.__visibleAnimation) {
			this.__visibleAnimation.stop();
			this.__visibleAnimation.removeEvents();
		}

		if (animation) {

			if (typeof animation === 'string') {
				animation = new moobile.Animation(this.element).setAnimationClass(animation);
			}

			this.__visibleAnimation = animation;
			this.__visibleAnimation.addEvent('start', this.bound('__willShow'));
			this.__visibleAnimation.addEvent('end', this.bound('__didShow'));
			this.__visibleAnimation.start()

		} else {
			this.__willShow();
			this.__didShow();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#hide
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	hide: function(animation) {

		if (this.__display === false)
			return this;

		if (this.__visibleAnimation) {
			this.__visibleAnimation.stop();
			this.__visibleAnimation.removeEvents();
		}

		if (animation && this.__visible) {

			if (typeof animation === 'string') {
				animation = new moobile.Animation(this.element).setAnimationClass(animation);
			}

			this.__visibleAnimation = animation;
			this.__visibleAnimation.addEvent('start', this.bound('__willHide'));
			this.__visibleAnimation.addEvent('end', this.bound('__didHide'));
			this.__visibleAnimation.start()

		} else {
			this.__willHide();
			this.__didHide();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#isVisible
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isVisible: function() {
		return this.__display && this.__visible;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	updateLayout: function(update) {

		update = update === false
			? false
			: true;

		if (this.__updateLayout === update)
			return this;

		this.__updateLayout = update;

		if (update) {

			var parent = this.getParentComponent();
			if (parent && parent.__updateLayout)
				return this;

			if (this instanceof moobile.Window) {

				if (updateLayoutTime === null) {
					updateLayoutTime = requestAnimationFrame(triggerLayoutUpdate);
				}

				updateLayoutRoot = this;

				return this;
			}

			if (this.hasWindow() === false)
				return this;

			if (updateLayoutTime === null) {
				updateLayoutTime = requestAnimationFrame(triggerLayoutUpdate);
			}

			if (updateLayoutRoot === null) {
				updateLayoutRoot = this;
				return this;
			}

			var parent = this.getParentComponent();
			while (parent) {
				if (parent === updateLayoutRoot) return this;
				parent = parent.getParentComponent();
			}

			updateLayoutRoot = this;
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#cascade
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	cascade: function(func) {
		func.call(this, this);
		this.__children.invoke('cascade', func)
		return this;
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
	 * @see    http://moobilejs.com/doc/latest/Component/Component#willChangeReadyState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willChangeReadyState: function(ready) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didChangeReadyState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didChangeReadyState: function(ready) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didUpdateLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

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
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	toElement: function() {
		return this.element;
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__setParent: function(parent) {

		if (this.__parent === parent)
			return this;

		this.__parentComponentWillChange(parent);
		this.__parent = parent;
		this.__parentComponentDidChange(parent);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__setWindow: function(window) {

		if (this.__window === window)
			return this;

		this.cascade(function() {

			if (this.__window === window)
				return;

			this.__windowWillChange(window);
			this.__window = window;
			this.__windowDidChange(window);

		});

		var ready = !!window;

		this.cascade(function() {

			if (this.__ready === ready)
				return;

			this.__willChangeReadyState(ready);
			this.__ready = ready;
			this.__didChangeReadyState(ready);

			if (ready) this.__didBecomeReady();

		});

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.1.0
	 */
	__build: function() {

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
			if (typeof handler === 'function') {
				handler.call(owner, element);
			}
		});
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willBuild: function() {
		this.willBuild();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didBuild: function() {

		var components = this.options.components;
		if (components) {
			this.addChildComponents(components);
		}

		this.didBuild();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willAddChildComponent: function(component) {
		this.willAddChildComponent(component);
		this.fireEvent('willaddchildcomponent', component);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Component/Component#didAddChildComponent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didAddChildComponent: function(component) {
		this.didAddChildComponent(component);
		this.fireEvent('didaddchildcomponent', component);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__willRemoveChildComponent: function(component) {
		this.willRemoveChildComponent(component);
		this.fireEvent('willremovechildcomponent', component)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didRemoveChildComponent: function(component) {
		this.didRemoveChildComponent(component);
		this.fireEvent('didremovechildcomponent', component)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__parentComponentWillChange: function(parent) {
		this.parentComponentWillChange(parent);
		this.fireEvent('parentcomponentwillchange', parent)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__parentComponentDidChange: function(parent) {
		this.parentComponentDidChange(parent);
		this.fireEvent('parentcomponentdidchange', parent);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__windowWillChange: function(window) {
		this.windowWillChange(window);
		this.fireEvent('windowwillchange', window);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__windowDidChange: function(window) {
		this.windowDidChange(window);
		this.fireEvent('windowdidchange', window);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__willChangeReadyState: function(ready) {
		this.willChangeReadyState(ready);
		this.fireEvent('willchangereadystate', ready)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__didChangeReadyState: function(ready) {
		this.didChangeReadyState(ready)
		this.fireEvent('didchangereadystate', ready);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__didBecomeReady: function() {
		this.didBecomeReady();
		this.fireEvent('didbecomeready')
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__didUpdateLayout: function() {
		if (this.__updateLayout) {
			this.__updateLayout = false;
			this.didUpdateLayout();
			this.fireEvent('didupdatelayout')
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.1
	 */
	__willShow: function() {

		var visible = this.__parent
		            ? this.__parent.isVisible()
		            : this instanceof moobile.Window;

		if (visible) {

			this.willShow();

			var self = this;
			this.cascade(function() {
				if (this === self) return;
				if (this.__display === true &&
					this.__visible === false) {
					this.willShow();
				}
			});
		}

		this.removeClass('hidden');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.1
	 */
	__didShow: function() {

		var visible = this.__parent
		            ? this.__parent.isVisible()
		            : this instanceof moobile.Window;

		this.__display = true;
		this.__visible = visible;

		if (visible) {

			this.didShow();

			var self = this
			this.cascade(function() {
				if (this === self) return;
				if (this.__display === true &&
					this.__visible === false) {
					this.__visible = true;
					this.__updateLayout = true;
					this.didShow();
				}
			});

			this.updateLayout();
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.1
	 */
	__willHide: function() {

		var visible = this.__parent
		            ? this.__parent.isVisible()
		            : this instanceof moobile.Window;

		if (visible) {

			this.willHide();

			var self = this;
			this.cascade(function() {
				if (this === self) return;
				if (this.__visible === true &&
					this.__display === true) {
					this.willHide();
				}
			});
		}

		this.addClass('hidden');
		this.__display = false;
		this.__visible = false;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	__didHide: function() {

		var visible = this.__parent
		            ? this.__parent.isVisible()
		            : this instanceof moobile.Window;

		if (visible) {

			this.didHide();

			var self = this;
			this.cascade(function() {
				if (this === self) return;
				if (this.__display === true &&
					this.__visible === true) {
					this.__visible = false;
					this.didHide();
				}
			});

			this.fireEvent('hide');
		}
	},

	/* Deprecated */

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentOfType: function(type, name) {
		return this.getChildComponentByType(type, name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentOfTypeAt: function(type, index) {
		return this.getChildComponentByTypeAt(type, index);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	getChildComponentsOfType: function(type) {
		return this.getChildComponentsByType(type);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasChildComponentOfType: function(type) {
		return this.hasChildComponentByType(type);
	},

	/**
	 * @deprecated
	 * @author Tin LE GALL (imbibinebe@gmail.com)
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.1
	 */
	getDescendantComponent: function(name) {
		return this.getComponent(name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getComponentOfType: function(type, name) {
		return this.getComponentByType(type, name);
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	hasComponentOfType: function(type, name) {
		return this.hasComponentByType(type, name);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#defineRole
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Component.defineRole = function(name, context, options, handler) {
	context = (context || Component).prototype;
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
Component.defineAttribute = function(name, context, handler) {
	context = (context || Component).prototype;
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
Component.defineStyle = function(name, target, handler) {
	var context = (target || Component).prototype;
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
Component.getStyle = function(name, target) {
	return target.__styles__
		 ? target.__styles__[name]
		 : null;
};

/**
 * @see    http://moobilejs.com/doc/latest/Component/Component#create
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Component.create = function(klass, element, descriptor, options, name) {

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

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Component.defineAttribute('data-style', null, function(value) {
	this.options.styleName = value;
});

// rethink/refactor
var setComponentIndex = function(component) {

	var index = 0;

	var node = document.id(component);

	do {

		var prev = node.previousSibling;
		if (prev === null) {
			node = node.parentNode;
			if (node === this.element) break;
			continue;
		}

		node = prev;

		if (node.nodeType !== 1)
			continue;

		var previous = node.retrieve('moobile:component');
		if (previous) {
			index = this.getChildComponentIndex(previous) + 1;
			break;
		}

		var children = node.childNodes;
		if (children.length) {
			var found = getComponentIndex.call(this, node);
			if (found !== null) {
				index = found;
				break;
			}
		}

	} while (node)

	this.__children.splice(index, 0, component);

	return this;
};

// rethink/refactor
var getComponentIndex = function(root) {

	var node = root.lastChild;

	do {

		if (node.nodeType !== 1) {
			node = node.previousSibling;
			if (node === null) return 0;
			continue;
		}

		var component = node.retrieve('moobile:component');
		if (component) {
			return this.getChildComponentIndex(component) + 1;
		}

		var children = node.childNodes;
		if (children.length) {
			var found = getComponentIndex.call(this, node);
			if (found >= 0) {
				return found;
			}
		}

		node = node.previousSibling;

	} while (node);

	return null;
};

var triggerLayoutUpdate = function() {
	if (updateLayoutRoot) {
		updateLayoutRoot.cascade(function() {
			this.__didUpdateLayout();
		})
		updateLayoutRoot = null;
		updateLayoutTime = null;
	}
}


},{}],9:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Util/Overlay
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var Overlay = moobile.Overlay = new Class({

	Extends: moobile.Component,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('overlay');
		this.addEvent('animationend', this.bound('__onAnimationEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.removeEvent('animationend', this.bound('__onAnimationEnd'))
		this.parent()
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {
		this.parent();
		this.hide();
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

	/* Private API */

	/**
	 * @see    http://moobilejs.com/doc/latest/Util/Overlay#__onAnimationEnd
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onAnimationEnd: function(e) {

		e.stop();

		if (this.hasClass('show-animated')) {
			this.removeClass('show-animated');
		}

		if (this.hasClass('hide-animated')) {
			this.removeClass('hide-animated');
			this.hide();
		}
	}

});

},{}],10:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/ActivityIndicator
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var ActivityIndicator = moobile.ActivityIndicator = new Class({

	Extends: moobile.Control,

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
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ActivityIndicator#start
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	start: function() {
		return this.addClass('active');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ActivityIndicator#stop
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

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('activity-indicator', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(ActivityIndicator, element, 'data-activity-indicator'));
});

},{}],11:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Bar = moobile.Bar = new Class({

	Extends: moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('bar');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('bar', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(Bar, element, 'data-bar'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Dark Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('dark', Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

/**
 * Light Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.Component.defineStyle('light', Bar, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});

},{}],12:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var ButtonGroup = moobile.ButtonGroup = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedButton: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedButtonIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		layout: 'horizontal',
		buttons: null,
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

		var buttons = this.options.buttons;
		if (buttons) this.addButtons(buttons);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__selectedButton = null;
		this.__selectedButtonIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#setSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setSelectedButton: function(selectedButton) {

		if (this.__selectable === false)
			return this;

		if (this.__selectedButton === selectedButton)
			return this;

		if (this.__selectedButton) {
			this.__selectedButton.setSelected(false);
			this.fireEvent('deselect', this.__selectedButton);
			this.__selectedButton = null;
		}

		this.__selectedButtonIndex = selectedButton ? this.getChildComponentIndex(selectedButton) : -1;

		if (selectedButton) {
			this.__selectedButton = selectedButton;
			this.__selectedButton.setSelected(true);
			this.fireEvent('select', this.__selectedButton);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButton: function() {
		return this.__selectedButton;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#setSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedButtonIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentByTypeAt(moobile.Button, index);
		}

		return this.setSelectedButton(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButtonIndex: function() {
		return this.__selectedButtonIndex;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#clearSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedButton: function() {
		this.setSelectedButton(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button, where) {
		return this.addChildComponent(moobile.Button.from(button), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(moobile.Button.from(button), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(moobile.Button.from(button), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtons: function(buttons, where) {
		return this.addChildComponents(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsAfter: function(buttons, after) {
		return this.addChildComponentsAfter(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsBefore: function(buttons, before) {
		return this.addChildComponentsBefore(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButtons: function() {
		return this.getChildComponentsByType(moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButton: function(name) {
		return this.getChildComponentByType(moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentByTypeAt(moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponentsByType(moobile.Button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setSelectable: function(selectable) {
		this.__selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isSelectable: function() {
		return this.__selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this.__selectedButton === component) {
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
		if (child instanceof moobile.Button) {
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
		if (child instanceof moobile.Button) {
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

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('button-group', null, function(element) {
	this.addChildComponent(moobile.Component.create(ButtonGroup, element, 'data-button-group'));
});


},{}],13:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var Button = moobile.Button = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__label: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#hitAreaElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	hitAreaElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		label: null
	},

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

		this.addEvent('tapcancel', this.bound('__onTapCancel'));
		this.addEvent('tapstart', this.bound('__onTapStart'));
		this.addEvent('tapend', this.bound('__onTapEnd'));
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

		var label = this.options.label;
		if (label) this.setLabel(label);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.removeEvent('tapcancel', this.bound('__onTapCancel'));
		this.removeEvent('tapstart', this.bound('__onTapStart'));
		this.removeEvent('tapend', this.bound('__onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this.__label === label)
			return this;

		label = moobile.Text.from(label);

		if (this.__label) {
			this.__label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this.__label = label;
		this.__label.addClass('button-label');
		this.toggleClass('button-label-empty', this.__label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this.__label;
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onTapCancel: function(e) {
		if (this.isSelected()) this.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onTapStart: function(e) {
		if (!this.isSelected()) this.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onTapEnd: function(e) {
		if (!this.isSelected()) this.setHighlighted(false);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Button#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Button.from = function(source) {
	if (source instanceof Button) return source;
	var button = new Button();
	button.setLabel(source);
	return button;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('button', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(Button, element, 'data-button'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('label', Button, null, function(element) {
	this.setLabel(moobile.Component.create(moobile.Text, element, 'data-label'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Active Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('active', Button, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

/**
 * Warning Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('warning', Button, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

/**
 * Back Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('back', Button, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

/**
 * Forward Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('forward', Button, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});

},{}],14:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Control/Control
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var Control = moobile.Control = new Class({

	Extends: moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__state: null,

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
	 * @see    http://moobilejs.com/doc/latest/Control/Control#setDisabled
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDisabled: function(disabled) {
		return this.__setState(disabled !== false ? 'disabled' : null);
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
		return this.__setState(selected !== false ? 'selected' : null);
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
		return this.__setState(highlighted !== false ? 'highlighted' : null);
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
	 * @see    http://moobilejs.com/doc/latest/Control/Control#shouldAllowState
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	shouldAllowState: function(state) {
		return ['highlighted', 'selected', 'disabled'].contains(state);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	shouldFireEvent: function(type, args) {
		return !this.isDisabled();
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__setState: function(state, value) {

		if (this.__state === state)
			return this;

		if (this.shouldAllowState(state) || state == null) {
			this.willChangeState(state)
			if (this.__state) this.removeClass('is-' + this.__state);
			this.__state = state;
			if (this.__state) this.addClass('is-' + this.__state);
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
		return this.__state;
	}

});

},{}],15:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Image = moobile.Image = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__source: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__loaded: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__originalSize: {
		x: 0,
		y: 0
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'img',
		preload: false,
		source: null
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
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {
		this.parent();
		var source = this.options.source || this.element.get('src');
		if (source) this.setSource(source);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		if (this.__image) {
			this.__image.removeEvent('load', this.bound('__onLoad'));
			this.__image.src = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
			this.__image = null;
		}

		this.element.set('src', 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#setSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSource: function(source, media) {

		if (media &&
			window.matchMedia &&
			window.matchMedia(media).matches === false)
			return this;

		this.__source = source || '';

		if (this.__image) {
			this.__image.removeEvent('load', this.bound('__onLoad'));
			this.__image = null;
		}

		if (source) {
			if (this.options.preload) {
				this.__loaded = false;
				this.__image = new Image();
				this.__image.src = source;
				this.__image.addEvent('load', this.bound('__onLoad'));
			} else {
				this.__load();
			}
		} else {
			this.__unload();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#getSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSource: function() {
		return this.__source;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.__image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#getOriginalSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getOriginalSize: function() {
		return this.__originalSize;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#isLoaded
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isLoaded: function() {
		return this.__loaded;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#isEmpty
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

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__load: function() {

		this.__loaded = true;

		if (this.options.preload) {
			this.__originalSize.x = this.__image.width;
			this.__originalSize.y = this.__image.height;
		}

		this.element.set('src', this.__source);
		this.show();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__unload: function() {

		this.__loaded = false;

		if (this.options.preload) {
			this.__originalSize.x = 0;
			this.__originalSize.y = 0;
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
	__onLoad: function() {
		this.fireEvent('preload');
		this.__load();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Image.from = function(source) {
	if (source instanceof Image) return source;
	var image = new Image();
	image.setSource(source);
	return image;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('image', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(Image, element, 'data-image'));
});
},{}],16:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var ListItem = moobile.ListItem = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__detail: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'li',
		image: null,
		label: null,
		detail: null,
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
	 * @since  0.3.0
	 */
	didBuild: function() {

		this.parent();

		var image = this.options.image;
		var label = this.options.label;
		var detail = this.options.detail;

		if (image) this.setImage(image);
		if (label) this.setLabel(label);
		if (detail) this.setDetail(detail);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__label = null;
		this.__image = null;
		this.__detail = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this.__label === label)
			return this;

		label = moobile.Text.from(label);

		if (this.__label) {
			this.__label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this.__label = label;
		this.__label.addClass('list-item-label');
		this.toggleClass('list-item-label-empty', this.__label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this.__label;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this.__image === image)
			return this;

		image = moobile.Image.from(image);

		if (this.__image) {
			this.__image.replaceWithComponent(image, true);
		} else {
			this.addChildComponent(image);
		}

		this.__image = image;
		this.__image.addClass('list-item-image');
		this.toggleClass('list-item-image-empty', this.__image.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.__image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#setDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setDetail: function(detail) {

		if (this.__detail === detail)
			return this;

		detail = moobile.Text.from(detail);

		if (this.__detail) {
			this.__detail.replaceWithComponent(detail, true);
		} else {
			this.addChildComponent(detail);
		}

		this.__detail = detail;
		this.__detail.addClass('list-item-detail');
		this.toggleClass('list-item-detail-empty', this.__detail.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#getDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getDetail: function() {
		return this.__detail;
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
 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.ListItem.from = function(source) {
	if (source instanceof moobile.ListItem) return source;
	var item = new moobile.ListItem();
	item.setLabel(source);
	return item;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('item', moobile.List, null, function(element) {
	this.addItem(moobile.Component.create(moobile.ListItem, element, 'data-item'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.Component.defineRole('header', moobile.List, null, function(element) {
	this.addItem(moobile.Component.create(moobile.ListItem, element, 'data-item').setStyle('header'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('image', moobile.ListItem, null, function(element) {
	this.setImage(moobile.Component.create(moobile.Image, element, 'data-image'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('label', moobile.ListItem, null, function(element) {
	this.setLabel(moobile.Component.create(moobile.Text, element, 'data-label'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('detail', moobile.ListItem, null, function(element) {
	this.setDetail(moobile.Component.create(moobile.Text, element, 'data-detail'));
});

// <0.1-compat>

/**
 * @deprecated
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
moobile.Component.defineRole('list-item', moobile.List, null, function(element) {
	console.log('[DEPRECATION NOTICE] The role "list-item" will be removed in 0.4, use the role "item" instead');
	this.addItem(moobile.Component.create(moobile.ListItem, element, 'data-list-item'));
});

// </0.1-compat>

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Header Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.Component.defineStyle('header', moobile.ListItem, {
	attach: function(element) { element.addClass('style-header'); },
	detach: function(element) { element.removeClass('style-header'); }
});

/**
 * Checked Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('checked', moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

/**
 * Disclosed Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('disclosed', moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

/**
 * Detailed Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('detailed', moobile.ListItem, {
	attach: function(element) { element.addClass('style-detailed'); },
	detach: function(element) { element.removeClass('style-detailed'); }
});

},{}],17:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/List
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var List = moobile.List = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectable: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedItem: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedItemIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'ul',
		selectable: true,
		selectedItemIndex: -1,
		items: null,
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
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.setSelectable(this.options.selectable);
		this.setSelectedItemIndex(this.options.selectedItemIndex);

		var items = this.options.items;
		if (items) this.addItems(items);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__selectedItem = null;
		this.__selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#setSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItem: function(selectedItem) {

		if (this.__selectable == false)
			return this;

		if (this.__selectedItem === selectedItem)
			return this;

		if (this.__selectedItem) {
			this.__selectedItem.setSelected(false);
			this.fireEvent('deselect', this.__selectedItem);
			this.__selectedItem = null;
		}

		this.__selectedItemIndex = selectedItem ? this.getChildComponentIndex(selectedItem) : -1;

		if (selectedItem) {
			this.__selectedItem = selectedItem;
			this.__selectedItem.setSelected(true);
			this.fireEvent('select', this.__selectedItem);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItem: function() {
		return this.__selectedItem;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#setSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItemIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentByTypeAt(moobile.ListItem, index);
		}

		return this.setSelectedItem(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItemIndex: function() {
		return this.__selectedItemIndex
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#clearSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItem: function(item, where) {
		return this.addChildComponent(moobile.ListItem.from(item), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemAfter: function(item, after) {
		return this.addChildComponentAfter(moobile.ListItem.from(item), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemBefore: function(item, before) {
		return this.addChildComponentBefore(moobile.ListItem.from(item), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addItems: function(items, where) {
		return this.addChildComponents(items.map(function(item) {
			return moobile.ListItem.from(item);
		}), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addItemsAfter: function(items, after) {
		return this.addChildComponentsAfter(items.map(function(item) {
			return moobile.ListItem.from(item);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addItemsBefore: function(items, before) {
		return this.addChildComponentsBefore(items.map(function(item) {
			return moobile.ListItem.from(item);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function(name) {
		return this.getChildComponentByType(moobile.ListItem, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItemAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemAt: function(index) {
		return this.getChildComponentByTypeAt(moobile.ListItem, index)
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemIndex: function(item) {
		return this.getChildComponentIndex(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItems: function() {
		return this.getChildComponentsByType(moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#removeItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeItem: function(item) {
		return this.removeChildComponent(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#removeAllItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllItems: function() {
		return this.removeAllChildComponentsByType(moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ListItem#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(selectable) {
		this.__selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ListItem#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this.__selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {

		this.parent(component);

		if (component instanceof moobile.ListItem) {
			component.addEvent('tapcancel', this.bound('__onItemTapCancel'));
			component.addEvent('tapstart', this.bound('__onItemTapStart'));
			component.addEvent('tapend', this.bound('__onItemTapEnd'));
			component.addEvent('tap', this.bound('__onItemTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this.__selectedItem === component) {
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
		if (component instanceof moobile.ListItem) {
			component.removeEvent('tapcancel', this.bound('__onItemTapCancel'));
			component.removeEvent('tapstart', this.bound('__onItemTapStart'));
			component.removeEvent('tapend', this.bound('__onItemTapEnd'));
			component.removeEvent('tap', this.bound('__onItemTap'));
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
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

		this.parent();

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

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTapCancel: function(e, sender) {
		// checker plus ici
		sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTapStart: function(e, sender) {
		if (this.__selectable && !sender.isSelected()) sender.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTapEnd: function(e, sender) {
		if (this.__selectable && !sender.isSelected()) sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTap: function(e, sender) {
		if (this.__selectable) this.setSelectedItem(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('list', null, function(element) {
	this.addChildComponent(moobile.Component.create(List, element, 'data-list'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Grouped - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('grouped', List, {
	attach: function(element) { element.addClass('style-grouped'); },
	detach: function(element) { element.removeClass('style-grouped'); }
});

},{}],18:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var NavigationBar = moobile.NavigationBar = new Class({

	Extends: moobile.Bar,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__title: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	options: {
		title: null,
		titleCentered: true // moobile.Theme.getName() === 'ios'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('navigation-bar');

		// <deprecated>
		var item = this.getRoleElement('item');
		if (item) {
			console.log('[REMOVAL NOTICE] The role "item" has been removed in 0.3, use the role "content" instead and refer to the documentation.');
			return;
		}
		// </deprecated>

		var content = this.getRoleElement('content');
		if (content === null) {
			content = document.createElement('div');
			content.ingest(this.element);
			content.inject(this.element);
			content.setRole('content');
		}

		// creates a title element if the content is text only
		var fc = content.firstChild;
		var lc = content.lastChild;
		if (fc && fc.nodeType === 3 &&
			lc && lc.nodeType === 3) {
			var title = this.getRoleElement('title');
			if (title === null) {
				title = document.createElement('div');
				title.ingest(content);
				title.inject(content);
				title.setRole('title');
			}
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {

		this.parent();

		var title = this.options.title;
		if (title) {
			this.setTitle(title);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this.__title = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setTitle: function(title) {

		if (this.__title === title)
			return this;

		title = moobile.Text.from(title);

		if (this.__title) {
			this.__title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.contentElement);
		}

		this.__title = title;
		this.__title.addClass('navigation-bar-title');
		this.toggleClass('navigation-bar-title-empty', this.__title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTitle: function() {
		return this.__title;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

		this.parent();

		if (this.options.titleCentered === false)
			return this;

		var element = this.element;
		var content = this.contentElement;

		content.setStyle('padding-left', 0);
		content.setStyle('padding-right', 0);

		var elementSize = element.offsetWidth;
		var contentSize = content.offsetWidth;
		var contentPosition = content.offsetLeft;

		var offset = ((elementSize / 2) - (contentPosition + contentSize / 2)) * 2;

		var fc = content.firstChild;
		var lc = content.lastChild;

		if (fc && fc.getPosition) {
			var pos = fc.offsetLeft + offset;
			if (pos < 0) {
				offset += Math.abs(pos);
			}
		}

		if (lc && lc.getPosition) {
			var pos = lc.offsetLeft + lc.offsetWidth + offset;
			if (pos > contentSize) {
				offset -= Math.abs(contentSize - pos);
			}
		}

		content.setStyle(offset < 0 ? 'padding-right' : 'padding-left', Math.abs(offset));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#addLeftButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addLeftButton: function(button) {
		return this.addChildComponent(button, 'top');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#addRightButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addRightButton: function(button) {
		return this.addChildComponent(button, 'bottom');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getButton: function(name) {
		return this.getChildComponentByType(moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentByTypeAt(moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/NavigationBar#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponents(moobile.Button, destroy);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('navigation-bar', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(NavigationBar, element, 'data-navigation-bar'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('content', NavigationBar, {traversable: true}, function(element) {
	this.contentElement = element;
	this.contentElement.addClass('navigation-bar-content');
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('title', NavigationBar, null, function(element) {
	this.setTitle(moobile.Component.create(moobile.Text, element, 'data-title'));
});


},{}],19:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Slider = moobile.Slider = new Class({

	// TODO ajouter les importations de yannick

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchOffsetX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchOffsetY: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchInitialThumbX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchInitialThumbY: null,

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
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#trackElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	trackElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#thumbElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	thumbElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#rangeElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	rangeElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#valueElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	valueElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#hitAreaElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hitAreaElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#options
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

		// <deprecated>
		if ('min' in this.options || 'max' in this.options) {
			if ('min' in this.options) this.options.minimum = this.options.min;
			if ('max' in this.options) this.options.maximum = this.options.max;
			console.log('[DEPRECATION NOTICE] The options "min" and "max" will be removed in 0.4, use the "minimum" and "maximum" options instead');
		}
		// </deprecated>

		var mode = this.options.mode;
		if (mode) {
			this.addClass('slider-mode-' + mode);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
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

		this.setMinimum(this.options.minimum);
		this.setMaximum(this.options.maximum);

		var value = this.options.value;
		if (value !== null) {
			this.setValue(value);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

		this.parent();

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

		var pos = this._positionFromValue(this._value);
		if (pos.x === this._position.x &&
			pos.y === this._position.y)
			return;

		this._move(pos.x, pos.y);
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
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setValue: function(value) {

		value = this.options.snap ? value.round() : value;

		if (this._value === value)
			return this;

		if( value > this._maximum ) {
			value = this._maximum;
		} else if( value < this._minimum ) {
			value = this._minimum;
		}

		this._value = value;

		var pos = this._positionFromValue(value);
		if (pos.x !== this._position.x ||
			pos.y !== this._position.y) {
			this._move(pos.x, pos.y);
		}

		this.fireEvent('change', value);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getValue: function() {
		return this._value;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	setMinimum: function(minimum) {
		this._minimum = minimum;
		if (this._value < minimum) this.setValue(minimum);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#getMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	getMinimum: function() {
		return this._minimum;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	setMaximum: function(maximum) {
		this._maximum = maximum;
		if (this._value > maximum) this.setValue(maximum);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	getMaximum: function() {
		return this._maximum;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	_move: function(x, y) {

		if (!this.isReady() ||
			!this.isVisible())
			return this;

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

		this._position.x = x;
		this._position.y = y;
		this.thumbElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
		this.valueElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

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
		this.__activeTouch = null;
		this.__activeTouchOffsetX = null;
		this.__activeTouchOffsetY = null;
		this.__activeTouchInitialThumbX = null;
		this.__activeTouchInitialThumbY = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchStart: function(e) {
		var touch = e.changedTouches[0];
		if (this.__activeTouch === null) {
			this.__activeTouch = touch
			this.__activeTouchOffsetX = touch.pageX;
			this.__activeTouchOffsetY = touch.pageY;
			this.__activeTouchInitialThumbX = this._position.x;
			this.__activeTouchInitialThumbY = this._position.y;
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	_onThumbTouchMove: function(e) {
		var touch = e.changedTouches[0];
		if (this.__activeTouch.identifier === touch.identifier) {
			var x = touch.pageX - this.__activeTouchOffsetX + this.__activeTouchInitialThumbX;
			var y = touch.pageY - this.__activeTouchOffsetY + this.__activeTouchInitialThumbY;
			this.setValue(this._valueFromPosition(x, y));
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchEnd: function(e) {
		if (this.__activeTouch.identifier === e.changedTouches[0].identifier) {
			this.__activeTouch = null;
			this.__activeTouchOffsetX = null;
			this.__activeTouchOffsetY = null;
			this.__activeTouchInitialThumbX = null;
			this.__activeTouchInitialThumbY = null;
		}
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('slider', null, function(element) {
	this.addChildComponent(moobile.Component.create(Slider, element, 'data-slider'));
});

},{}],20:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var TabBar = moobile.TabBar = new Class({

	Extends: moobile.Bar,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__selectedTab: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__selectedTabIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	options: {
		selectedTabIndex: -1,
		tabs: null,
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('tab-bar');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {
		this.parent();
		var tabs = this.options.tabs;
		if (tabs) this.addTabs(tabs);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#setSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedTab: function(selectedTab) {

		if (this.__selectedTab === selectedTab)
			return this;

		if (this.__selectedTab) {
			this.__selectedTab.setSelected(false);
			this.fireEvent('deselect', this.__selectedTab);
			this.__selectedTab = null;
		}

		this.__selectedTabIndex = selectedTab ? this.getChildComponentIndex(selectedTab) : -1;

		if (selectedTab) {
			this.__selectedTab = selectedTab;
			this.__selectedTab.setSelected(true);
			this.fireEvent('select', this.__selectedTab);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedTab: function() {
		return this.__selectedTab;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#setSelectedTabIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedTabIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentByTypeAt(moobile.Tab, index);
		}

		return this.setSelectedTab(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getSelectedTabIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedTabIndex: function() {
		return this.__selectedTabIndex;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#clearSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	clearSelectedTab: function() {
		this.setSelectedTab(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTab: function(tab, where) {
		return this.addChildComponent(Tab.from(tab), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabAfter: function(tab, after) {
		return this.addChildComponentAfter(Tab.from(tab), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabBefore: function(tab, before) {
		return this.addChildComponentBefore(Tab.from(tab), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabs: function(tabs, where) {
		return this.addChildComponents(tabs.map(function(tab) {
			return Moobile.Tab.from(tab);
		}), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabsAfter: function(tabs, after) {
		return this.addChildComponentsAfter(tabs.map(function(tab) {
			return moobile.Tab.from(tab);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabsBefore: function(tabs, before) {
		return this.addChildComponentsBefore(tabs.map(function(tab) {
			return moobile.Tab.from(tab);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabs: function() {
		return this.getChildComponentsByType(Tab);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTab: function(name) {
		return this.getChildComponentByType(moobile.Tab, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getTabAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabAt: function(index) {
		return this.getChildComponentByTypeAt(moobile.Tab, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#removeTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeTab: function(tab, destroy) {
		return this.removeChildComponent(tab, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#removeAllTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllTabs: function(destroy) {
		return this.removeAllChildComponentsByType(Tab, destroy);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this.__selectedTab === component) {
			this.clearSelectedTab();
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didAddChildComponent: function(child) {
		this.parent(child);
		if (child instanceof moobile.Tab) {
			child.addEvent('tap', this.bound('__onTabTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof moobile.Tab) {
			child.removeEvent('tap', this.bound('__onTabTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didChangeState: function(state) {
		this.parent(state)
		if (state === 'disabled' || state == null) {
			this.getChildComponents().invoke('setDisabled', state);
		}
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__onTabTap: function(e, sender) {
		this.setSelectedTab(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('tab-bar', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(Tabmoobile.Bar, element, 'data-tab-bar'));
});

},{}],21:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var Tab = moobile.Tab = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__image: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		label: null,
		image: null
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('tab');

		var image = this.getRoleElement('image');
		var label = this.getRoleElement('label');

		if (label === null) {
			label = document.createElement('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		if (image === null) {
			image = document.createElement('div');
			image.inject(this.element, 'top');
			image.setRole('image');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {

		this.parent();

		var image = this.options.image;
		var label = this.options.label;

		if (image) this.setImage(image);
		if (label) this.setLabel(label);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this.__label = null;
		this.__image = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this.__label === label)
			return this;

		label = moobile.Text.from(label);

		if (this.__label) {
			this.__label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this.__label = label;
		this.__label.addClass('tab-label');
		this.toggleClass('tab-label-empty', this.__label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this.__label;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setImage: function(image) {

		if (this.__image === image)
			return this;

		image = moobile.Image.from(image);

		if (this.__image) {
			this.__image.replaceWithComponent(image, true);
		} else {
			this.addChildComponent(image);
		}

		this.__image = image;
		this.__image.addClass('tab-image');
		this.toggleClass('tab-image-empty', this.__image.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getImage: function() {
		return this.__image;
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Tab.from = function(source) {
	if (source instanceof Tab) return source;
	var tab = new Tab();
	tab.setLabel(source);
	return tab;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('tab', moobile.TabBar, null, function(element) {
	this.addTab(moobile.Component.create(Tab, element, 'data-tab'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('label', Tab, null, function(element) {
	this.setLabel(moobile.Component.create(moobile.Text, element, 'data-label'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('image', Tab, null, function(element) {
	this.setImage(moobile.Component.create(moobile.Image, element, 'data-image'));
});


},{}],22:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var Text = moobile.Text = new Class({

	Extends: moobile.Control,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'span',
		text: null,
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
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	didBuild: function() {
		this.parent();
		var text = this.options.text;
		if (text) this.setText(text);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#setText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setText: function(text) {
		this.element.set('html',  text instanceof Text ? text.getText() : (text || typeof text === 'number' ? text + '' : ''));
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#getText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getText: function() {
		return this.element.get('html');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#isEmpty
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isEmpty: function() {
		return !this.getText();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Text.from = function(source) {
	if (source instanceof Text) return source;
	var text = new Text();
	text.setText(source);
	return text;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('text', null, function(element) {
	this.addChildComponent(moobile.Component.create(Text, element, 'data-text'));
});

},{}],23:[function(require,module,exports){
(function (global){
"use strict"

var moobile = global.moobile = global.Moobile = {
	version: '0.3.3'
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Dialog/Alert
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var Alert = moobile.Alert = new Class({

	Extends: moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__message: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__buttons: [],

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
		layout: 'horizontal',
		title: null,
		message: null,
		buttons: null
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
		this.addEvent('animationend', this.bound('__onAnimationEnd'))

		this.overlay = new moobile.Overlay();
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

		this.setTitle(this.options.title);
		this.setMessage(this.options.message);

		var buttons = this.options.buttons;
		if (buttons) {
			this.addButtons(buttons);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.removeEvent('animationend', this.bound('__onAnimationEnd'));

		this.__title = null;
		this.__message = null;

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

		if (this.__title !== null && this.__title === title)
			return this;

		title = moobile.Text.from(title);

		if (this.__title) {
			this.__title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.headerElement);
		}

		this.__title = title;
		this.__title.addClass('alert-title');
		this.toggleClass('alert-title-empty', this.__title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.__title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setMessage: function(message) {

		if (this.__message !== null && this.__message === message)
			return this;

		message = moobile.Text.from(message);

		if (this.__message) {
			this.__message.replaceWithComponent(message, true);
		} else {
			this.addChildComponentInside(message, this.contentElement);
		}

		this.__message = message;
		this.__message.addClass('alert-message');
		this.toggleClass('alert-message-empty', this.__message.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getMessage: function() {
		return this.__message;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button, where) {
		return this.addChildComponentInside(moobile.Button.from(button), this.footerElement, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(moobile.Button.from(button), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(moobile.Button.from(button), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtons: function(buttons, where) {
		return this.addChildComponentsInside(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), this.footerElement, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsAfter: function(buttons, after) {
		return this.addChildComponentsAfter(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsBefore: function(buttons, before) {
		return this.addChildComponentBefore(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtons: function() {
		return this.getChildComponentsByType(moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButton: function(name) {
		return this.getChildComponentByType(moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentByTypeAt(moobile.Button, index);
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
		return this.removeAllChildComponentsByType(moobile.Button, destroy);
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
		return this.setDefaultButton(this.getChildComponentByTypeAt(moobile.Button, index));
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
		if (component instanceof moobile.Button) {
			component.addEvent('tap', this.bound('__onButtonTap'));
			this.__buttons.include(component);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(component) {
		this.parent(component);
		if (component instanceof moobile.Button) {
			component.removeEvent('tap', this.bound('__onButtonTap'));
			this.__buttons.erase(component);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willShow: function() {

		if (this.getParentView() === null) {
			var instance = moobile.Window.getCurrentInstance();
			if (instance) {
				instance.addChildComponent(this);
			}
		}

		if (this.__buttons.length === 0) this.addButton('OK');

		this.parent();
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

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onButtonTap: function(e, sender) {

		var index = this.getChildComponentsByType(moobile.Button).indexOf(sender);
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
	__onAnimationEnd: function(e) {

		e.stop()

		if (this.hasClass('show-animated')) {
			this.removeClass('show-animated')
			this.didShow()
		}

		if (this.hasClass('hide-animated')) {
			this.addClass('hidden').removeClass('hide-animated')
			this.didHide()
		}
	}

});

},{}],25:[function(require,module,exports){
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
	var dummyStyle = document.createElement('div').style,
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
		})();

	function prefixStyle (style) {
		if ( vendor === '' ) return style;

		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	}

var a = prefixStyle('AnimationEnd');
var t = prefixStyle('TransitionEnd');

Element.NativeEvents[a] = 2;
Element.NativeEvents[t] = 2;
Element.Events['transitionend'] = { base: t, onAdd: function(){}, onRemove: function(){} };
Element.Events['animationend'] = { base: a, onAdd: function(){}, onRemove: function(){} };

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

},{}],26:[function(require,module,exports){
"use strict"

var fireEvent = Events.prototype.fireEvent

/**
 * @see http://moobilejs.com/doc/latest/Event/EventFirer
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var Firer = moobile.Firer = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see http://moobilejs.com/doc/latest/event/Firer#on
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	on: function() {
		return this.addEvent.apply(this, arguments)
	},

	/**
	 * @see http://moobilejs.com/doc/latest/event/Firer#off
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	off: function() {
		return this.removeEvent.apply(this, arguments)
	},

	/**
	 * @see http://moobilejs.com/doc/latest/event/Firer#emit
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	emit: function() {
		return this.fireEvent.apply(this, arguments)
	},

	/**
	 * @see http://moobilejs.com/doc/latest/event/Firer#fireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	fireEvent: function(type, args, delay) {

		args = Array.convert(args).include(this);

		if (!this.shouldFireEvent(type, args))
			return this;

		this.willFireEvent(type, args);
		fireEvent.call(this, type, args, delay);
		this.didFireEvent(type, args);

		return this;
	},

	/**
	 * @see http://moobilejs.com/doc/latest/event/Firer#shouldFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	shouldFireEvent: function(type, args) {
		return true;
	},

	/**
	 * @see http://moobilejs.com/doc/latest/event/Firer#willFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willFireEvent: function(type, args) {

	},

	/**
	 * @see http://moobilejs.com/doc/latest/event/Firer#didFireEvent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didFireEvent: function(type, args) {

	}

});

},{}],27:[function(require,module,exports){
"use strict"

var onReady = function() {
	window.fireEvent('ready');
};

Element.defineCustomEvent('ready', {

	onSetup: function() {

		if (Browser.platform.cordova) {
			document.onListener('deviceready', onReady);
			return;
		}

		window.addEvent('domready', onReady);
	},

	onTeardown: function() {

		if (Browser.platform.cordova) {
			document.offListener('deviceready', onReady);
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

},{}],28:[function(require,module,exports){
"use strict"

var tapValid = true;
var tapTouch = null;

var onTapTouchStart = function(e) {
	tapTouch = e.changedTouches[0]
	tapValid = true;
};

var onTapTouchCancel = function(e) {
	tapValid = false;
};

Element.defineCustomEvent('tap', {

	base: 'touchend',

	condition: function(e) {

		if (tapValid) {

			var element = tapTouch ? document.elementFromPoint(tapTouch.pageX, tapTouch.pageY) : null;
			if (element) {
				return this === element || this.contains(element);
			}

			return false;
		}

		return tapValid;
	},

	onSetup: function() {
		this.addEvent('touchcancel', onTapTouchCancel);
		this.addEvent('touchstart', onTapTouchStart);
	},

	onTeardown: function() {
		this.removeEvent('touchcancel', onTapTouchCancel);
		this.removeEvent('touchstart', onTapTouchStart);
	}

});

// pasmal de truc à réfléchir avec ça...

Element.defineCustomEvent('tapstart', {

	base: 'touchstart',

	condition: function(e) {
		return e.touches.length === 1;
	}

});

Element.defineCustomEvent('tapmove', {

	base: 'touchmove',

	condition: function(e) {
		return e.touches.length === 1;
	}

});

Element.defineCustomEvent('tapend', {

	base: 'touchend',

	condition: function(e) {
		return e.touches.length === 0;
	}

});

Element.defineCustomEvent('tapcancel', {
	base: 'touchcancel',
});

},{}],29:[function(require,module,exports){
(function (global){
"use strict"

var hasTouchEvent = 'ontouchstart' in global
var hasTouchList  = hasTouchEvent && 'TouchList' in global
var hasTouch      = hasTouchEvent && 'Touch' in global

if (!hasTouchList) {

	var TouchList = function() {
		this.length = 0
	}

	TouchList.prototype.identifiedTouch = function(id) {
		return this[0] && this[0].identifier === id ? this[0] : null
	}

	TouchList.prototype.item = function(index) {
		return this[index] || null;
	}
}

if (!hasTouch) {
	var Touch = function() {}
}

var touch = null
var target = null

var onDocumentMouseDown = function(e) {

	if (target === null) {
		target = e.target

		touch = new Touch()
		touch.identifier = Date.now()
		touch.screenX = e.screenX
		touch.screenY = e.screenY
		touch.clientX = e.clientX
		touch.clientY = e.clientY
		touch.pageX = e.pageX
		touch.pageY = e.pageY
		touch.radiusX = 0
		touch.radiusY = 0
		touch.rotationAngle = 0
		touch.force = 0
		touch.target = target

		var list = new TouchList
		list.length = 1
		list[0] = touch

		var event = document.createEvent('CustomEvent')
		event.initCustomEvent('touchstart', true, true, null)
		event.touches = list
		event.targetTouches = list
		event.changedTouches = list

		target.dispatchEvent(event)
	}
};

var onDocumentMouseMove = function(e) {

	if (target) {

		touch.screenX = e.screenX
		touch.screenY = e.screenY
		touch.clientX = e.clientX
		touch.clientY = e.clientY
		touch.pageX = e.pageX
		touch.pageY = e.pageY

		var list = new TouchList
		list.length = 1
		list[0] = touch

		var event = document.createEvent('CustomEvent')
		event.initCustomEvent('touchmove', true, true, null)
		event.touches = list
		event.targetTouches = list
		event.changedTouches = list

		target.dispatchEvent(event)
	}
};

var onDocumentMouseUp = function(e) {

	if (target) {

		touch.screenX = e.screenX
		touch.screenY = e.screenY
		touch.clientX = e.clientX
		touch.clientY = e.clientY
		touch.pageX = e.pageX
		touch.pageY = e.pageY

		var list = new TouchList
		list.length = 1
		list[0] = touch

		var event = document.createEvent('CustomEvent')
		event.initCustomEvent('touchend', true, true, null)
		event.touches = new TouchList
		event.targetTouches = new TouchList
		event.changedTouches = list

		target.dispatchEvent(event)
		target = null
	}
};

if (!hasTouchEvent) {
	document.addEventListener('mousedown', onDocumentMouseDown)
	document.addEventListener('mousemove', onDocumentMouseMove)
	document.addEventListener('mouseup', onDocumentMouseUp)
} else {
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
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],30:[function(require,module,exports){
"use strict"

var iScroll = require('iscroll').iScroll;

var touch = null;

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
var IScroll = moobile.Scroller.IScroll = new Class({

	Extends: moobile.Scroller,

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

		if (!Browser.Features.Touch) {

			touch = {
				identifier: String.uniqueID(),
				target: e.target,
				pageX: e.pageX,
				pageY: e.pageY,
				clientX: e.clientX,
				clientY: e.clientY
			};

			e.touches = e.targetTouches = e.changedTouches = [touch];
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

		if (!Browser.Features.Touch) {

			touch.pageX = e.pageX;
			touch.pageY = e.pageY;
			touch.clientX = e.clientX;
			touch.clientY = e.clientY;

			e.touches = e.targetTouches = e.changedTouches = [touch];
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

		if (!Browser.Features.Touch) {

			touch.pageX = e.pageX;
			touch.pageY = e.pageY;
			touch.clientX = e.clientX;
			touch.clientY = e.clientY;

			e.touches = [];
			e.targetTouches = [];
			e.changedTouches = [touch];

			touch = null;
		}

		this.fireEvent('touchend', e);
	}

});

moobile.Scroller.IScroll.supportsCurrentPlatform = function() {
	return true;
};

},{"iscroll":1}],31:[function(require,module,exports){
"use strict"

var requestFrame = require('moofx/lib/frame').request;
var cancelFrame  = require('moofx/lib/frame').cancel;

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
var Native = moobile.Scroller.Native = new Class({

	Extends: moobile.Scroller,

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
		this.contentScrollerElement.addEvent('scroll', this.bound('_onScroll'));

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
		this.contentScrollerElement.removeEvent('touchmove', this.bound('_onTouchMove'));
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
			cancelFrame(this._animation);
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
			self._animation = requestFrame(update);
		};

		this._animation = requestFrame(update);

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

moobile.Scroller.Native.supportsCurrentPlatform = function() {
	return Browser.platform === 'ios' && 'WebkitOverflowScrolling' in document.createElement('div').style;
};

},{"moofx/lib/frame":2}],32:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
var Scroller = moobile.Scroller = new Class({

	Extends: moobile.Firer,

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

Scroller.create = function(contentElement, contentWrapperElement, scrollers, options) {

	var scroller = null;

	scrollers = scrollers ? Array.convert(scrollers) : ['IScroll.Android', 'Native', 'IScroll'];

	for (var i = 0; i < scrollers.length; i++) {

		var candidate = Class.parse('moobile.Scroller.' + scrollers[i]);
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

			if (target === undefined || target.tagName === undefined || target.tagName.match(/input|textarea|select|a/i)) {
				scrolls[identifier] = false;
				return;
			}

			if (target.hasClass('scrollable') ||
				target.getParent('.scrollable')) {
				scrolls[identifier] = true;
			} else {
				scrolls[identifier] = false;
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

},{}],33:[function(require,module,exports){
"use strict"

var element = null;
var configs = {};

var Theme = moobile.Theme = {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	init: function() {
		var content = element.getStyle('content');
		if (content) {
			content = content.replace(/^\'/, '');
			content = content.replace(/\'$/, '');
			configs = JSON.decode(content);
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Theme/Theme#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getName: function() {
		return configs['name'] || null;
	}

};

document.addEvent('domready', function() {
	element = document.createElement('div');
	element.addClass('theme');
	element.inject(document.body);
	Theme.init();
})


},{}],34:[function(require,module,exports){
"use strict"

Class.parse = function(name) {
	name = name.trim();
	name = name.split('.');
	var func = window;
	for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
	return typeof func === 'function' ? func : null;
},

Class.instantiate = function(klass) {
	if (typeof klass === 'string') klass = Class.parse(klass);
	if (klass === null) return null;
	klass.$prototyping = true;
	var instance = new klass;
	delete klass.$prototyping;
	var params = Array.prototype.slice.call(arguments, 1);
	if (instance.initialize) instance.initialize.apply(instance, params);
	return instance;
}
},{}],35:[function(require,module,exports){
"use strict"

var setStyle = Element.prototype.setStyle;
var getStyle = Element.prototype.getStyle;

var vendors = ['Khtml', 'O', 'Ms', 'Moz', 'Webkit'];
var prefixes = {};

var prefix = function(property) {

	property = property.camelCase();

	if (property in this.style)
		return property;

	if (prefixes[property] !== undefined)
		return prefixes[property];

	var suffix = property.charAt(0).toUpperCase() + property.slice(1);

	for (var i = 0; i < vendors.length; i++) {
		var prefixed = vendors[i] + suffix;
		if (prefixed in this.style) {
			prefixes[property] = prefixed;
			break
		}
	}

	if (prefixes[property] === undefined)
		prefixes[property] = property;

	return prefixes[property];
};

Element.implement({

	 setRole: function(role) {
	 	return this.set('data-role', role);
	 },

	 getRole: function(role) {
	 	return this.get('data-role');
	 },

	setStyle: function (property, value) {
		return setStyle.call(this, prefix.call(this, property), value);
	},

	getStyle: function (property) {
		return getStyle.call(this, prefix.call(this, property));
	},

	ingest: function(element) {
		return this.adopt(document.id(element).childNodes);
	}

});

var cache = {};

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element#from
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

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element#at
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
Element.at = function(path, callback) {

	var dispatch = function(element) {
		if (callback) callback(element);
	};

	var element = cache[path] || null;
	if (element) {
		element = element.clone(true, true);
		dispatch(element);
		return element;
	}

	var onSuccess = function(response) {
		var el = Element.from(response);
		if (el) {
			cache[path] = el;
			element = cache[path].clone(true, true);
			dispatch(element);
		}
	};

	var onFailure = function() {
		dispatch(null);
	};

	var async = typeof callback === 'function';

	new Request({
		url: path,
		async: async,
		method: 'get',
		onSuccess: onSuccess,
		onFailure: onFailure
	}).send();

	return element;
};

},{}],36:[function(require,module,exports){
"use strict"
Events.prototype.on = Events.prototype.addEvent;
Events.prototype.off = Events.prototype.removeEvent;
Events.prototype.emit = Events.prototype.fireEvent;
},{}],37:[function(require,module,exports){
"use strict"

Request.prototype.options.isSuccess = function() {
	var status = this.status;
	return (status === 0 || (status >= 200 && status < 300) || status === 304);
}
},{}],38:[function(require,module,exports){
"use strict"

Array.implement({

	find: function(fn) {
		for (var i = 0; i < this.length; i++) {
			var found = fn.call(this, this[i]);
			if (found === true) {
				return this[i];
			}
		}
		return null;
	},

	getLastItemAtOffset: function(offset) {
		offset = offset ? offset : 0;
		return this[this.length - 1 - offset] ?
			   this[this.length - 1 - offset] :
			   null;
	},

	last: function() {
		return this.getLastItemAtOffset.apply(this, arguments);
	}

});

},{}],39:[function(require,module,exports){
"use strict"

String.implement({

	toCamelCase: function() {
		return this.camelCase().replace('-', '').replace(/\s\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
	}

});

},{}],40:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var ViewControllerSet = moobile.ViewControllerSet = new Class({

	Extends: moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_animating: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_tabBar: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_selectedViewController: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_enteringViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	options: {
		viewTransition: null,
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	loadView: function() {
		this.view = new moobile.ViewSet();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	viewDidLoad: function() {
		this.parent();
		this._tabBar = this.view.getTabBar();
		this._tabBar.addEvent('select', this.bound('_onTabSelect'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this._tabBar.removeEvent('select', this.bound('_onTabSelect'));
		this._tabBar = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#setViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setChildViewControllers: function(viewControllers) {

		this._selectedmoobile.ViewController = null;
		this._enteringmoobile.ViewController = null;
		this.removeAllChildViewControllers(true);

		for (var i = 0; i < viewControllers.length; i++) this.addChildViewController(viewControllers[i]);

		return this.showmoobile.ViewController(viewControllers[0]);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#showmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	showViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		var index = this.getChildViewControllerIndex(viewController);
		if (index === -1)
			return this;

		this._tabBar.setSelectedTabIndex(index);

		if (this._selectedmoobile.ViewController === null) {
			this.willSelectmoobile.ViewController(viewController);
			this._selectedmoobile.ViewController = viewController;
			this._selectedmoobile.ViewController.showView();
			this._selectedmoobile.ViewController.viewWillEnter();
			this._selectedmoobile.ViewController.viewDidEnter();
			this.didSelectmoobile.ViewController(viewController);
			return this;
		}

		if (this._selectedmoobile.ViewController === viewController)
			return this;

		this._enteringmoobile.ViewController = viewController;

		var enteringViewIndex = this.getChildViewControllerIndex(this._enteringmoobile.ViewController);
		var selectedViewindex = this.getChildViewControllerIndex(this._selectedmoobile.ViewController);

		var method = enteringViewIndex > selectedViewindex
		           ? 'enter'
		           : 'leave';

		var viewToShow = this._enteringmoobile.ViewController.getView();
		var viewToHide = this._selectedmoobile.ViewController.getView();

		this._animating = true; // needs to be set before the transition happens

		viewTransition = viewTransition || new moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onSelectTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onSelectTransitionComplete'));
		viewTransition[method].call(
			viewTransition,
			viewToShow,
			viewToHide
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#showmoobile.ViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	showViewControllerAt: function(index, viewTransition) {

		var viewController = this.getChildViewControllerAt(index);
		if (viewController) {
			this.showmoobile.ViewController(viewController, viewTransition)
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#getSelectedmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedViewController: function() {
		return this._selectedmoobile.ViewController;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#getTabBar
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabBar: function() {
		return this._tabBar;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onSelectTransitionStart: function(e) {
		this.willSelectmoobile.ViewController(this._enteringmoobile.ViewController);
		this._selectedmoobile.ViewController.viewWillLeave();
		this._enteringmoobile.ViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onSelectTransitionComplete: function(e) {

		this._selectedmoobile.ViewController.viewDidLeave();
		this._enteringmoobile.ViewController.viewDidEnter();
		this.didSelectmoobile.ViewController(this._enteringmoobile.ViewController);

		this._selectedmoobile.ViewController = this._enteringmoobile.ViewController;
		this._enteringmoobile.ViewController = null;
		this._animating = false;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		viewController.hideView();

		var tab = new moobile.Tab;
		tab.setLabel(viewController.getTitle());
		tab.setImage(viewController.getImage());
		this._tabBar.addTab(tab);

		viewController.setViewControllerSet(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didRemoveChildViewController: function(viewController) {

		this.parent(viewController);

		viewController.setViewControllerSet(null);
		viewController.showView();

		var index = this.getChildViewControllerIndex(viewController);

		if (this._selectedmoobile.ViewController === viewController) {
			this._selectedmoobile.ViewController = null;
		}

		if (this._tabBar) {
			// the tab bar might be destroyed at this point when the view is
			// going to be destroyed
			var tab = this._tabBar.getTabAt(index);
			if (tab) {
				tab.removeFromParentComponent();
			}
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#willSelectmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willSelectViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#didSelectmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didSelectViewController: function(viewController) {

	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_onTabSelect: function(tab) {

		var index = this._tabBar.getChildComponentIndex(tab);

		var viewController = this.getChildViewControllerAt(index);
		if (viewController !== this._selectedmoobile.ViewController) {
			this.showmoobile.ViewController(viewController, this.options.viewTransition);
		}
	}

});

Class.refactor(moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_viewControllerSet: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#setViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setViewControllerSet: function(viewControllerSet) {

		if (this._viewControllerSet === viewControllerSet)
			return this;

		this.parentViewControllerSetWillChange(viewControllerSet);
		this._viewControllerSet = viewControllerSet;
		this.parentViewControllerSetDidChange(viewControllerSet);

		if (this instanceof moobile.ViewControllerSet)
			return this;

		var by = function(component) {
			return !(component instanceof moobile.ViewControllerSet);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerSet', viewControllerSet);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#getViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getViewControllerSet: function() {
		return this._viewControllerSet;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#parentViewControllerSetWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerSetWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#parentViewControllerSetDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerSetDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerSet(this._viewControllerSet);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerSet(null);
	}

});

},{}],41:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var ViewControllerStack = moobile.ViewControllerStack = new Class({

	Extends: moobile.ViewController,

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
		this.view = new moobile.ViewStack();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#pushmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	pushViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		if (this.getTopViewController() === viewController)
			return this;

		var childViewControllers = this.getChildViewControllers();

		this.willPushViewController(viewController);
		this.addChildViewController(viewController);

		var viewControllerPushed = viewController;
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);

		var viewToShow = viewControllerPushed.getView();
		var viewToHide = viewControllerBefore
					   ? viewControllerBefore.getView()
					   : null;

		this._animating = true; // needs to be set before the transition happens

		if (childViewControllers.length === 1) {
			this._onPushTransitionStart();
			this._onPushTransitionComplete();
			return this;
		}

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('_onPushTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('_onPushTransitionComplete'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.view
		);

		viewControllerPushed.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onPushTransitionStart: function() {

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
	_onPushTransitionComplete: function() {

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
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#popViewController
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
		viewTransition.addEvent('start:once', this.bound('_onPopTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('_onPopTransitionComplete'));
		viewTransition.leave(
			viewControllerBefore.getView(),
			viewControllerPopped.getView(),
			this.view
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#popViewControllerUntil
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
	_onPopTransitionStart: function(e) {
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
	_onPopTransitionComplete: function(e) {

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
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#getTopViewController
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
	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#willPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#didPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#willPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPopViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#didPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPopViewController: function(viewController) {

	}

});

Class.refactor(moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_viewControllerStack: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#setViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewControllerStack: function(viewControllerStack) {

		if (this._viewControllerStack === viewControllerStack)
			return this;

		this.parentViewControllerStackWillChange(viewControllerStack);
		this._viewControllerStack = viewControllerStack;
		this.parentViewControllerStackDidChange(viewControllerStack);

		if (this instanceof moobile.ViewControllerStack)
			return this;

		var by = function(component) {
			return !(component instanceof moobile.ViewControllerStack);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerStack', viewControllerStack);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#getViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewControllerStack: function() {
		return this._viewControllerStack;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#parentViewControllerStackWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerStackWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerStack#parentViewControllerStackDidChange
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

},{}],42:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var ViewController = moobile.ViewController = new Class({

	Extends: moobile.Firer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__id: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__viewReady: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__viewTransition: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__children: [],

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#modal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__modal: false,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#modalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__modalViewController: null,

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

		this.__name = name;

		this.setOptions(options);

		this.loadView();
		if (this.view) {
			this.view.addEvent('didbecomeready', this.bound('__onViewDidBecomeReady'));
			this.view.addEvent('didupdatelayout', this.bound('__onViewDidUpdateLayout'));
			this.viewDidLoad();
		}

		window.addEvent('orientationchange', this.bound('__onWindowOrientationChange'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#loadView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {
		if (this.view === null) {
			this.view = new moobile.View();
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
		return this._addChildViewController(viewController);
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

		return this._addChildViewController(viewController, after, 'after');
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

		return this._addChildViewController(viewController, before, 'before');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewControllerAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewControllerAt: function(viewController, index) {

		if (index > this.__children.length) {
			index = this.__children.length;
		} else if (index < 0) {
			index = 0;
		}

		var before = this.getChildViewControllerAt(index);
		if (before) {
			return this.addChildViewControllerBefore(viewController, before);
		}

		return this.addChildViewController(viewController);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_addChildViewController: function(viewController, context, where) {

		viewController.removeFromParentViewController();

		this.willAddChildViewController(viewController);

		if (context) {

			switch (where) {
				case 'before':
					this.__children.splice(this.getChildViewControllerIndex(context), 1, viewController, context);
					this.view.addChildComponentBefore(viewController.view, context.view);
					break;
				case 'after':
					this.__children.splice(this.getChildViewControllerIndex(context), 1, context, viewController);
					this.view.addChildComponentAfter(viewController.view, context.view);
					break;
			}

		} else {
			this.__children.push(viewController);
			this.view.addChildComponent(viewController.view);
		}

		viewController.setParentViewController(this);

		this.didAddChildViewController(viewController);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewController: function(name) {
		return this.__children.find(function(viewController) { return viewController.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllerAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllerAt: function(index) {
		return this.__children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllerIndex: function(viewController) {
		return this.__children.indexOf(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllers: function() {
		return this.__children;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#hasChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildViewController: function(viewController) {
		return this.__children.contains(viewController);
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
		this.__children.erase(viewController);
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
		if (this.__parent) this.__parent.removeChildViewController(this, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#removeAllChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildViewControllers: function(destroy) {

		this.__children.filter(function() {
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

		if (this.__modalViewController)
			return this;

		var parentView = this.view.getWindow();
		if (parentView === null)
			throw new Error('The view to present is not ready');

		this.willPresentModalViewController(viewController);

		this.__modalViewController = viewController;
		this.__modalViewController.setParentViewController(this);
		this.__modalViewController.setModal(true);

		var viewToShow = this.__modalViewController.getView();
		var viewToHide = parentView.getChildComponentsByType(moobile.View).getLastItemAtOffset(0);

		parentView.addChildComponent(viewToShow);

		viewTransition = viewTransition || new moobile.ViewTransition.Cover;
		viewTransition.addEvent('start:once', this.bound('__onPresentTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('__onPresentTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			parentView
		);

		viewController.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#dismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	dismissModalViewController: function() {

		if (this.__modalViewController === null)
			return this;

		var parentView = this.view.getWindow();
		if (parentView === null)
			throw new Error('The view to dismiss is not ready');

		this.willDismissModalViewController()

		var viewToShow = parentView.getChildComponentsByType(moobile.View).getLastItemAtOffset(1);
		var viewToHide = this.__modalViewController.getView();

		var viewTransition = this.__modalViewController.getViewTransition();
		viewTransition.addEvent('start:once', this.bound('__onDismissTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('__onDismissTransitionCompleted'));
		viewTransition.leave(
			viewToShow,
			viewToHide,
			parentView
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this.__name;
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

		if (this.__id === null) {
			this.__id = String.uniqueID();
		}

		return this.__id;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this.__title === title)
			return this;

		title = moobile.Text.from(title);

		if (this.__title &&
			this.__title.hasParentComponent()) {
			this.__title.replaceWithComponent(title, true);
		}

		this.__title = title;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.__title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this.__image === image)
			return this;

		image = moobile.Image.from(image);

		if (this.__image &&
			this.__image.hasParentComponent()) {
			this.__image.replaceWithComponent(image, true);
		}

		this.__image = image;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.__image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setModal: function(modal) {
		this.__modal = modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#isModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isModal: function() {
		return this.__modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#isViewReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isViewReady: function() {
		return this.__viewReady;
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
		this.__viewTransition = viewTransition;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewTransition: function() {
		return this.__viewTransition;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParentViewController: function(viewController) {
		this.parentViewControllerWillChange(viewController);
		this.__parent = viewController;
		this.parentViewControllerDidChange(viewController);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentViewController: function() {
		return this.__parent;
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
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidUpdateLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	viewDidUpdateLayout: function() {

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

		window.removeEvent('orientationchange', this.bound('__onWindowOrientationChange'));

		this.removeAllChildViewControllers(true);

		this.removeFromParentViewController();

		if (this.__modalViewController) {
			this.__modalViewController.destroy();
			this.__modalViewController = null;
		}

		this.view.removeEvent('didbecomeready', this.bound('__onViewDidBecomeReady'));
		this.view.removeEvent('didupdatelayout', this.bound('__onViewDidUpdateLayout'));
		this.view.destroy();
		this.view = null;

		if (this.__title) {
			this.__title.destroy();
			this.__title = null;
		}

		if (this.__image) {
			this.__image.destroy();
			this.__image = null;
		}

		this.__parent = null;
		this.__children = null
		this.__viewTransition = null;
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onPresentTransitionStart: function() {
		this.__modalViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onPresentTransitionCompleted: function() {
		this.__modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onDismissTransitionStart: function() {
		this.__modalViewController.viewWillLeave();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	__onDismissTransitionCompleted: function() {
		this.__modalViewController.viewDidLeave();
		this.__modalViewController.setParentViewController(this);
		this.__modalViewController.setModal(false);
		this.__modalViewController.destroy();
		this.__modalViewController = null;
		this.didDismissModalViewController();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onViewDidBecomeReady: function() {
		this.viewDidBecomeReady();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__onViewDidUpdateLayout: function() {
		this.viewDidUpdateLayout();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__onWindowOrientationChange: function(e) {

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

},{}],43:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Cover.Box
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var CoverBox = moobile.ViewTransition.Box = new Class({

	Extends: moobile.ViewTransition,

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
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		this.overlay = new moobile.Overlay();
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
			viewToShow.show();
			this.overlay.showAnimated();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-box-enter');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(this.wrapper);
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
			viewToHide.hide();

			this.overlay.removeFromParentComponent();
			this.overlay.destroy();
			this.overlay = null;

			this.didLeave(viewToShow, viewToHide, parentView);

			this.wrapper.destroy();
			this.wrapper = null;

		}.bind(this);

		var animation = new moobile.Animation(this.wrapper);
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

},{}],44:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Cover
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Cover = moobile.ViewTransition.Cover = new Class({

	Extends: moobile.ViewTransition,

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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToShow);
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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-leave');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});

},{}],45:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Cubic
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Cubic = moobile.ViewTransition.Cubic = new Class({

	Extends: moobile.ViewTransition,

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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(parentElem);
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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.removeClass('transition-view-to-hide');
			viewToHide.hide();
			this.didLeave(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cubic-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});

},{}],46:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Drop
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.1
 */
var Drop = moobile.ViewTransition.Drop = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.1
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

		var animation = new moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-drop-leave');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-drop-leave');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});

},{}],47:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Fade
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Fade = moobile.ViewTransition.Fade = new Class({

	Extends: moobile.ViewTransition,

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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-fade-enter');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToShow);
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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-fade-leave');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});

},{}],48:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Flip
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Flip = moobile.ViewTransition.Flip = new Class({

	Extends: moobile.ViewTransition,

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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-flip-perspective');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.removeClass('transition-view-to-hide');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(parentElem);
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
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-flip-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didLeave(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(parentElem);
		animation.setAnimationClass('transition-flip-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});

},{}],49:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.None
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var None = moobile.ViewTransition.None = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		viewToShow.show();
		viewToHide.hide();
		this.didEnter.delay(50, this, [viewToShow, viewToHide, parentView]);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		viewToShow.show();
		viewToHide.hide();
		this.didLeave.delay(50, this, [viewToShow, viewToHide, parentView]);
	}

});

},{}],50:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Cover.Page
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Page = moobile.ViewTransition.Page = new Class({

	Extends: moobile.ViewTransition,

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
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		this.overlay = new moobile.Overlay();
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
			viewToShow.show();
			this.overlay.showAnimated();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-page-enter');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(this.wrapper);
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
			viewToHide.hide();

			this.overlay.removeFromParentComponent();
			this.overlay.destroy();
			this.overlay = null;

			this.didLeave(viewToShow, viewToHide, parentView);

			this.wrapper.destroy();
			this.wrapper = null;

		}.bind(this);

		var animation = new moobile.Animation(this.wrapper);
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

},{}],51:[function(require,module,exports){
"use strict"

var ViewTransition = moobile.ViewTransition;

var prefix = '';
var vendor = ['Webkit',  'Moz',  'O',  'ms', 'Khtml'];

var test = document.createElement('div');

for (var i = 0; i < vendor.length; i++) {
	var name = vendor[i] + 'AnimationName';
	if (name in test.style) {
		prefix = '-' + vendor[i].toLowerCase() + '-';
		break;
	}
}

var create = function(name, x1, x2) {
	return  '@' + prefix + 'keyframes ' + name + ' { from { ' + prefix + 'transform: translate3d(' + x1 + 'px, 0, 0); } to { ' + prefix + 'transform: translate3d(' + x2 + 'px, 0, 0); }}';
};

var unique = function(name) {
	return name + '-' + String.uniqueID();
}

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Slide
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Slide = moobile.ViewTransition.Slide = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Slide#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	options: {
		enhanceBackButtonOnEnter: true,
		enhanceBackButtonOnLeave: true
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var style = null;
		var items = [];

		var onStart = function() {

			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();

			// if (this.options.enhanceBackButtonOnEnter) {

			// 	var keyframes = '';

			// 	viewToShow.getChildComponentsByType(NavigationBar).each(function(navigationBar) {

			// 		var width = navigationBar.getSize().x;
			// 		if (width) {

			// 			navigationBar.getChildComponentsByType(Button).each(function(button) {

			// 				var style = button.getStyle();
			// 				if (style !== 'back' &&
			// 					style !== 'forward')
			// 					return;

			// 				var x1 = width / 2;
			// 				var x2 = 0;

			// 				var name = unique('transition-slide-enter-navigation-button-to-show');
			// 				var anim = create(name, x1, x2);
			// 				var elem = button.getElement();
			// 				elem.setStyle('animation-name', name)
			// 				items.push(elem);

			// 				keyframes += anim;

			// 			}, this);
			// 		}
			// 	}, this);

			// 	style = document.createElement('style').set('text', keyframes).inject(document.head);
			// }

		}.bind(this);

		var onEnd = function() {

			viewToShow.removeClass('transition-view-to-show');
			viewToHide.removeClass('transition-view-to-hide');
			viewToHide.hide();

			this.didEnter(viewToShow, viewToHide, parentView);

			if (items) {
				items.invoke('setStyle', 'animation-name', null);
				items = null;
			}

			if (style) {
				style.destroy();
				style = null;
			}

		}.bind(this);

		var animation = new moobile.Animation(parentElem);
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

		var style = null;
		var items = [];

		var onStart = function() {

			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();

			// if (this.options.enhanceBackButtonOnLeave) {

			// 	var keyframes = '';

			// 	viewToHide.getChildComponentsByType(NavigationBar).each(function(navigationBar) {

			// 		var width = navigationBar.getSize().x;
			// 		if (width) {

			// 			navigationBar.getChildComponentsByType(Button).each(function(button) {

			// 				var style = button.getStyle();
			// 				if (style !== 'back' &&
			// 					style !== 'forward')
			// 					return;

			// 				var x1 = 0;
			// 				var x2 = width / 2 - button.getSize().x / 2;

			// 				var name = unique('transition-slide-leave-navigation-button-to-hide');
			// 				var anim = create(name, x1, x2);
			// 				var elem = button.getElement();
			// 				elem.setStyle('animation-name', name)
			// 				items.push(elem);

			// 				keyframes += anim;
			// 			});
			// 		}
			// 	});

			// 	style = document.createElement('style').set('text', keyframes).inject(document.head);
			// }

		}.bind(this);

		var onEnd = function() {

			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didLeave(viewToShow, viewToHide, parentView);

			if (items) {
				items.invoke('setStyle', 'animation-name', null);
				items = null;
			}

			if (style) {
				style.destroy();
				style = null;
			}

		}.bind(this);

		var animation = new moobile.Animation(parentElem);
		animation.setAnimationClass('transition-slide-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});
},{}],52:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var ViewTransition = moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#enter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enter: function(viewToShow, viewToHide, parentView) {
		viewToHide.disableTouch();
		viewToShow.disableTouch();
		this.enterAnimation(viewToShow, viewToHide, parentView);
		this.fireEvent('start');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#leave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leave: function(viewToShow, viewToHide, parentView) {
		viewToShow.disableTouch();
		viewToHide.disableTouch();
		this.leaveAnimation(viewToShow, viewToHide, parentView);
		this.fireEvent('start');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#didEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didEnter: function(viewToShow, viewToHide, parentView) {
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#didLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didLeave: function(viewToShow, viewToHide, parentView) {
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#enterAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#leaveAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	}

});

},{}],53:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.1
 * @since  0.1.0
 */
var ScrollView = moobile.ScrollView = new Class({

	Extends: moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchTime: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchScroll: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchDuration: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__activeTouchCanceled: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__scroller: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__offset: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__page: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__pageOffset: {
		x: 0,
		y: 0,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__scrollToPageTimer: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__contentSize: {
		x: null,
		y: null
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		scroller: ['Native', 'IScroll'],
		scroll: 'vertical',
		scrollbar: 'vertical',
		bounce: Browser.platform.ios,
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
		initialScrollY: 0,
		cancelTouchThresholdX: 10,
		cancelTouchThresholdY: 10
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

		// <deprecated>
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
		// </deprecated>

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

		this.__scroller = moobile.Scroller.create(this.contentElement, this.contentWrapperElement, this.options.scroller, options);
		this.__scroller.addEvent('scroll', this.bound('__onScroll'));
		this.__scroller.addEvent('scrollend', this.bound('__onScrollEnd'));
		this.__scroller.addEvent('scrollstart', this.bound('__onScrollStart'));
		this.__scroller.addEvent('touchcancel', this.bound('__onTouchCancel'));
		this.__scroller.addEvent('touchstart', this.bound('__onTouchStart'));
		this.__scroller.addEvent('touchend', this.bound('__onTouchEnd'));

		var name = this.__scroller.getName();
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

		this.__scroller.refresh();

		this[s].call(this, x, y);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jean-philippe.dery@lemieuxbedard.com)
	 * @since 3.0.0
	 */
	didUpdateLayout: function() {
		this.parent();
		this.__scroller.refresh();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__scroller.removeEvent('scroll', this.bound('__onScroll'));
		this.__scroller.removeEvent('scrollend', this.bound('__onScrollEnd'));
		this.__scroller.removeEvent('scrollstart', this.bound('__onScrollStart'));
		this.__scroller.removeEvent('touchcancel', this.bound('__onTouchCancel'));
		this.__scroller.removeEvent('touchstart', this.bound('__onTouchStart'));
		this.__scroller.removeEvent('touchend', this.bound('__onTouchEnd'));
		this.__scroller.destroy();
		this.__scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#setContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	setContentSize: function(x, y) {

		if (x >= 0 || x === null) this.contentElement.setStyle('width', x);
		if (y >= 0 || y === null) this.contentElement.setStyle('height', y);

		if (this.__contentSize.x !== x ||
			this.__contentSize.y !== y) {
			this.updateLayout();
		}

		this.__contentSize.x = x;
		this.__contentSize.y = y;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getContentWrapperSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentWrapperSize: function() {
		return this.contentWrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getContentScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentScroll: function() {
		return this.__scroller.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this.__scroller.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this.__scroller.scrollToElement(element);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#scrollToPage
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

		if (this.__scrollToPageTimer) {
			clearTimeout(this.scrolltopage);
			this.__scrollToPageTimer = null;
		}

		if (this.__page.x !== pageX ||
			this.__page.y !== pageY) {
			this.__pageOffset.x = Math.abs(x - pageX * pageSizeX);
			this.__pageOffset.y = Math.abs(y - pageY * pageSizeY);
			this.__scrollToPageTimer = this.fireEvent.delay(time + 5, this, ['scrolltopage', [pageX, pageY]]);
		}

		this.__page.x = pageX;
		this.__page.y = pageY;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getPage
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
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getPageOffset
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPageOffset: function() {
		return this.__pageOffset;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getScroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroller: function() {
		return this.__scroller;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willHide: function() {
		this.parent();
		this.__offset = this.__scroller.getScroll();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didShow: function() {
		this.parent();
		this.__scroller.refresh();
		this.__scroller.scrollTo(this.__offset.x, this.__offset.y);
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__snapToPage: function() {

		var size = this.getContentSize();
		var scroll = this.getContentScroll();
		scroll.x = scroll.x > 0 ? scroll.x : 0;
		scroll.y = scroll.y > 0 ? scroll.y : 0;

		var moveX = scroll.x - this.__activeTouchScroll.x;
		var moveY = scroll.y - this.__activeTouchScroll.y;
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

		if (moveX < 0 || this.__pageOffset.x > 0) page.x += 1;
		if (moveY < 0 || this.__pageOffset.y > 0) page.y += 1;

		if (absMoveX >= 10 && (pageMoveX >= snapToPageAt || this.__activeTouchDuration < snapToPageDelay)) page.x += moveX > 0 ? 1 : -1;
		if (absMoveY >= 10 && (pageMoveY >= snapToPageAt || this.__activeTouchDuration < snapToPageDelay)) page.y += moveY > 0 ? 1 : -1;

		if (page.x < 0) page.x = 0;
		if (page.y < 0) page.y = 0;
		if ((page.x + 1) * pageSizeX > size.x) page.x = Math.floor(size.x / pageSizeX) - 1;
		if ((page.y + 1) * pageSizeY > size.y) page.y = Math.floor(size.y / pageSizeY) - 1;

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
	__onTouchCancel: function() {
		this.__activeTouch = null;
		this.__activeTouchTime = null;
		this.__activeTouchScroll = null;
		this.__activeTouchDuration = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	__onTouchStart: function(e) {

		var touch = e.changedTouches[0];

		if (this.__activeTouch === null) {
			this.__activeTouch = touch;
			this.__activeTouchTime = Date.now();
			this.__activeTouchScroll = this.getContentScroll();
			this.__activeTouchCanceled = false;
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	__onTouchEnd: function(e) {

		if (e.touches.length > 0)
			return;

		this.__activeTouchDuration = Date.now() - this.__activeTouchTime;

		if (this.options.snapToPage) this.__snapToPage();

		this.__activeTouch = null;
		this.__activeTouchTime = null;
		this.__activeTouchScroll = null;
		this.__activeTouchDuration = null;
		this.__activeTouchCanceled = false;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onScroll: function() {

		if (this.__activeTouch &&
			this.__activeTouchCanceled === false) {
			var scroll = this.getContentScroll();
			var x = Math.abs(this.__activeTouchScroll.x - scroll.x);
			var y = Math.abs(this.__activeTouchScroll.y - scroll.y);
			if (x >= this.options.cancelTouchThresholdX ||
				y >= this.options.cancelTouchThresholdY) {
				this.__activeTouchCanceled = true
				this.contentElement.getElements('*').each(function(element) {
					var event = document.createEvent('CustomEvent');
					event.initCustomEvent('touchcancel', false, false);
					element.dispatchEvent(event);
				});
			}
		}

		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__onScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__onScrollEnd: function() {
		this.fireEvent('scrollend');
	},

	/* Deprecated */

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		console.log('[DEPRECATION NOTICE] The method "getScrollSize" will be removed in 0.4, use the method "getContentSize" instead');
		return this.getContentSize();
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		console.log('[DEPRECATION NOTICE] The method "getScroll" will be removed in 0.4, use the method "getContentScroll" instead');
		return this.getContentScroll();
	},

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.View#Moobilemoobile.ViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
ScrollView.at = function(path, options, name) {

	var element = Element.at(path);
	if (element) {
		return moobile.Component.create(ScrollView, element, 'data-view', options, name);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('scroll-view', null, function(element) {
	this.addChildComponent(moobile.Component.create(ScrollView, element, 'data-scroll-view'));
});


},{}],54:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewSet
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var ViewSet = moobile.ViewSet = new Class({

	Extends: moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_tabBar: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('view-set');

		var bar = this.getRoleElement('tab-bar');
		if (bar === null) {
			bar = document.createElement('div');
			bar.inject(this.element);
			bar.setRole('tab-bar');
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewSet#setTabBar
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setTabBar: function(tabBar) {

		if (this._tabBar === tabBar || !tabBar)
			return this;

		if (this._tabBar) {
			this._tabBar.replaceWithmoobile.Component(tabBar, true);
		} else {
			this.addChildComponent(tabBar, 'footer');
		}

		this._tabBar = tabBar;
		this._tabBar.addClass('view-set-tab-bar');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewSet#getTabBar
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabBar: function() {
		return this._tabBar;
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('view-set', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(moobile.ViewSet, element, 'data-view-set'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('tab-bar', moobile.ViewSet, null, function(element) {
	this.setTabBar(moobile.Component.create(moobile.TabBar, element, 'data-tab-bar'));
});

},{}],55:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var ViewStack = moobile.ViewStack = new Class({

	Extends: moobile.View,

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

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('view-stack', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(moobile.ViewStack, element, 'data-view-stack'));
});

},{}],56:[function(require,module,exports){
"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/View/View
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var View = moobile.View = new Class({

	Extends: moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__layout: null,

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

		var content = this.getRoleElement('content');
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
	addChildComponent: function(component, where, context) {
		if (where === 'header') return this.parent(component, 'top');
		if (where === 'footer') return this.parent(component, 'bottom');
		return this.parent(component, where, context || this.contentElement);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addChildComponents: function(components, where) {
		if (where === 'header') return this.parent(components, 'top');
		if (where === 'footer') return this.parent(components, 'bottom');
		return this.addChildComponentsInside(components, this.contentElement, where);
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

		if (this.__layout === layout)
			return this;

		this.willChangeLayout(layout);
		if (this.__layout) this.removeClass('view-layout-' + this.__layout);
		this.__layout = layout;
		if (this.__layout) this.addClass('view-layout-' + this.__layout);
		this.didChangeLayout(layout);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getLayout: function() {
		return this.__layout;
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

Class.refactor(moobile.Component, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__parentView: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParentView: function(parentView) {

		if (this.__parentView === parentView)
			return this;

		this.parentViewWillChange(parentView);
		this.__parentView = parentView;
		this.parentViewDidChange(parentView);

		if (this instanceof View)
			return this;

		var by = function(component) {
			return !(component instanceof View);
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
		return this.__parentView;
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
		component.setParentView(this.__parentView);
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
View.at = function(path, options, name) {

	var element = Element.at(path);
	if (element) {
		return moobile.Component.create(View, element, 'data-view', options, name);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('view', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(View, element, 'data-view'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.Component.defineRole('content', View, {traversable: true}, function(element) {
	this.contentElement = element;
	this.contentElement.addClass('view-content');
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.Component.defineRole('content-wrapper', View, {traversable: true}, function(element) {
	this.contentWrapperElement = element
	this.contentWrapperElement.addClass('view-content-wrapper');
});

// <0.1-compat>

/**
 * @deprecated
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
moobile.Component.defineRole('view-content', View, {traversable: true}, function(element) {
	console.log('[DEPRECATION NOTICE] The role "view-content" will be removed in 0.4, use the role "content" instead');
	this.contentElement = element;
	this.contentElement.addClass('view-content');
});

// </0.1-compat>

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Dark Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('dark', View, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

/**
 * Light Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('light', View, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});

},{}],57:[function(require,module,exports){
"use strict"

var ViewController = moobile.ViewController;

/**
 * @see    http://moobilejs.com/doc/latest/Window/WindowController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var WindowController = moobile.WindowController = new Class({

	Extends: ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__rootViewController: null,

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

		this.view = new moobile.Window(element);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Window/WindowController#setRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setRootViewController: function(rootViewController) {

		if (this.__rootViewController) {
			this.__rootViewController.destroy();
			this.__rootViewController = null;
		}

		if (rootViewController) {
 			this.addChildViewController(rootViewController);
		}

		this.__rootViewController = rootViewController;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Window/WindowController#getRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRootViewController: function() {
		return this.__rootViewController;
	}

});

},{}],58:[function(require,module,exports){
"use strict"

var View = moobile.View;

/**
 * @see    http://moobilejs.com/doc/latest/Window/Window
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Window = moobile.Window = new Class({

	Extends: View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(element, options, name) {
		instance = this;
		window.addEvent('orientationchange', this.bound('__onWindowOrientationChange'));
		return this.parent(element, options, name);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		instance = null;
		window.removeEvent('orientationchange', this.bound('__onWindowOrientationChange'));
		this.parent();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('window');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didAddChildComponent: function(component) {
		this.parent();
		component.__setParent(this)
		component.__setWindow(this)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onWindowOrientationChange: function(e) {
		this.updateLayout()
	}

});

var instance = null;

Window.getCurrentInstance = function() {
	return instance;
};

},{}],59:[function(require,module,exports){
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
},{}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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
	return true == ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
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

},{}],62:[function(require,module,exports){
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

if (Browser.ios){
	var device = navigator.userAgent.toLowerCase().match(/(ip(ad|od|hone))/)[0];
	
	Browser.Device[device] = true;
	Browser.Device.name = device;
}

if (this.devicePixelRatio == 2)
	Browser.hasHighResolution = true;

Browser.isMobile = !['mac', 'linux', 'win'].contains(Browser.name);

}).call(this);

},{}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{}],"/src/main.js":[function(require,module,exports){
(function (global){
"use strict"

// Requires Mootools Core/More 1.5.x and up
if(parseFloat(MooTools.version) < 1.5) {
	console.log('[ERROR] Moobile now requires Mootools v1.6+');
}

// request animation frame
global.requestAnimationFrame = require('moofx/lib/frame').request;
global.cancelAnimationFrame = require('moofx/lib/frame').cancel;

// iscroll
require('../node_modules/iscroll/src/iscroll.js');

// mootools class extra
require('../vendor/mootools-class-extras/Source/Class.Binds.js');

// mootools define custom event
require('../vendor/mootools-custom-event/Source/Element.defineCustomEvent.js');

// mootools mobile
require('../vendor/mootools-mobile/Source/Browser/Features.Touch.js');
require('../vendor/mootools-mobile/Source/Browser/Mobile.js');
require('../vendor/mootools-mobile/Source/Touch/Pinch.js');
require('../vendor/mootools-mobile/Source/Touch/Swipe.js');

// mootools utilities
// require('./utils/browser');
require('./utils/event');
require('./utils/class');
require('./utils/element');
require('./utils/request');
require('./utils/type/array');
require('./utils/type/string');

// core
require('./core');

// event
require('./event/firer');
require('./event/ready');
require('./event/touch');
require('./event/tap');
require('./event/css');

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
// require('./view/view-collection');
// require('./view/view-queue');
require('./view/view-set');
require('./view/view-stack');

// view controller
require('./view-controller/view-controller');
require('./view-controller/view-controller-stack');
// require('./view-controller/view-controller-queue');
// require('./view-controller/view-controller-collection');
require('./view-controller/view-controller-set');

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

// aliases
moobile.Request = Request;
moobile.EventFirer = moobile.Firer;
moobile.ViewTransition.Cover.Box = moobile.ViewTransition.Box;
moobile.ViewTransition.Cover.Page = moobile.ViewTransition.Page;

module.exports = global.Moobile = global.moobile
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../node_modules/iscroll/src/iscroll.js":1,"../vendor/mootools-class-extras/Source/Class.Binds.js":59,"../vendor/mootools-custom-event/Source/Element.defineCustomEvent.js":60,"../vendor/mootools-mobile/Source/Browser/Features.Touch.js":61,"../vendor/mootools-mobile/Source/Browser/Mobile.js":62,"../vendor/mootools-mobile/Source/Touch/Pinch.js":63,"../vendor/mootools-mobile/Source/Touch/Swipe.js":64,"./animation/animation":7,"./component/component":8,"./component/overlay":9,"./control/activity-indicator":10,"./control/bar":11,"./control/button":13,"./control/button-group":12,"./control/control":14,"./control/image":15,"./control/list":17,"./control/list-item":16,"./control/navigation-bar":18,"./control/slider":19,"./control/tab":21,"./control/tab-bar":20,"./control/text":22,"./core":23,"./dialog/alert":24,"./event/css":25,"./event/firer":26,"./event/ready":27,"./event/tap":28,"./event/touch":29,"./scroller/scroller":32,"./scroller/scroller-iscroll":30,"./scroller/scroller-native":31,"./theme/theme":33,"./utils/class":34,"./utils/element":35,"./utils/event":36,"./utils/request":37,"./utils/type/array":38,"./utils/type/string":39,"./view-controller/view-controller":42,"./view-controller/view-controller-set":40,"./view-controller/view-controller-stack":41,"./view-transition/view-transition":52,"./view-transition/view-transition-box":43,"./view-transition/view-transition-cover":44,"./view-transition/view-transition-cubic":45,"./view-transition/view-transition-drop":46,"./view-transition/view-transition-fade":47,"./view-transition/view-transition-flip":48,"./view-transition/view-transition-none":49,"./view-transition/view-transition-page":50,"./view-transition/view-transition-slide":51,"./view/scroll-view":53,"./view/view":56,"./view/view-set":54,"./view/view-stack":55,"./window/window":58,"./window/window-controller":57,"moofx/lib/frame":2}]},{},[])("/src/main.js")
});