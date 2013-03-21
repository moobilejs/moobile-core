"use strict"

var hasTouchEvent = 'ontouchstart' in global
var hasTouchList  = 'TouchList' in global
var hasTouch      = 'Touch' in global

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
		event.initCustomEvent('touchstart', true, true)
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
		event.initCustomEvent('touchmove', true, true)
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
		event.initCustomEvent('touchend', true, true)
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
