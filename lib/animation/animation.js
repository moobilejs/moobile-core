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

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onAnimationEnd: function(e) {

		if (this.__running === false)
			return;

		if (this.element !== e.target)
			return;

		e.stop();

		this.__running = false;
		this.fireEvent('end');
		this.detach();
	}

});