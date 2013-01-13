"use strict"

var expect = require('expect.js')
var sinon  = require('sinon')

var Component = require('../lib/component')
var Window = require('../lib/window')

describe('Component/Component', function() {

	// TODO: Set style via data-style

	var MyComponent = new Class({
		Extends: Component
	})

	var ComponentOne = new Class({
		Extends: Component
	})

	var ComponentTwo = new Class({
		Extends: Component
	})

	// -------------------------------------------------------------------------
	// Initialize
	// -------------------------------------------------------------------------

	describe('initialize', function() {

		it('should create a component with a div element from a string', function() {
			var c = new Component('<div></div>')
			expect(c.element.get('tag')).to.be('div')
		})

		it('should create a component with a div element from an element', function() {
			var c = new Component(new Element('div'))
			expect(c.element.get('tag')).to.be('div')
		})

		it('should create a component with a div element by default', function() {
			var c = new Component()
			expect(c.element.get('tag')).to.be('div')
		})

		it('should read string options using data-attribute', function() {
			var c = new Component('<div data-option-style-name="foo"></div>')
			expect(c.options.styleName).to.be('foo')
		})

		it('should read numeric options using data-attribute', function() {
			var c = new Component('<div data-option-style-name="1"></div>')
			expect(c.options.styleName).to.be(1)
		})

		it('should read boolean options using data-attribute', function() {
			var c = new Component('<div data-option-style-name="true"></div>')
			expect(c.options.styleName).to.be(true)
		})

		it('should read array options using data-attribute', function() {
			var c = new Component('<div data-option-style-name="[1]"></div>')
			expect(c.options.styleName).to.contain(1)
		})

		// TODO TEST components options

	})

	// -------------------------------------------------------------------------
	// addEvent
	// -------------------------------------------------------------------------

	describe('addEvent', function() {

		it('should add some native event to the element', function() {

			[
				'click', 'dblclick', 'mouseup', 'mousedown',
				'mouseover', 'mouseout','mousemove',
				'keydown', 'keypress', 'keyup',
				'touchstart', 'touchmove', 'touchend', 'touchcancel',
				'gesturestart', 'gesturechange', 'gestureend',
				'tap', 'tapstart', 'tapmove', 'tapend',
				'pinch', 'swipe', 'touchold',
				'animationend', 'transitionend', 'owntransitionend', 'ownanimationend'
			].each(function(event) {

				var c  = new Component()
				var f1 = function(){};
				var f2 = function(){};
				var f3 = function(){};

				sinon.spy(c.element, 'addEvent')

				c.addEvent(event, f1)
				c.addEvent(event, f2)
				c.addEvent(event, f3)
				expect(c.element.addEvent.called).to.be.ok()
				expect(c.element.addEvent.calledOnce).to.be.ok()
			})
		})

	})

	// -------------------------------------------------------------------------
	// removeEvent
	// -------------------------------------------------------------------------

	describe('removeEvent', function() {

		it('should remove some native event from the element', function() {

			[
				'click', 'dblclick', 'mouseup', 'mousedown',
				'mouseover', 'mouseout','mousemove',
				'keydown', 'keypress', 'keyup',
				'touchstart', 'touchmove', 'touchend', 'touchcancel',
				'gesturestart', 'gesturechange', 'gestureend',
				'tap', 'tapstart', 'tapmove', 'tapend',
				'pinch', 'swipe', 'touchold',
				'animationend', 'transitionend', 'owntransitionend', 'ownanimationend'
			].each(function(event) {

				var c  = new Component()
				var f1 = function(){};
				var f2 = function(){};
				var f3 = function(){};

				sinon.spy(c.element, 'removeEvent')

				c.addEvent(event, f1)
				c.addEvent(event, f2)
				c.addEvent(event, f3)
				c.removeEvent(event, f1)
				c.removeEvent(event, f2)
				c.removeEvent(event, f3)

				expect(c.element.removeEvent.called).to.be.ok()
				expect(c.element.removeEvent.calledOnce).to.be.ok()
			})
		})

	})

	// -------------------------------------------------------------------------
	// addChildComponent
	// -------------------------------------------------------------------------

	describe('addChildComponent', function() {

		it('should add a child component', function() {

			var p = new Component()
			var c = new Component()

			p.addChildComponent(c)

			var child = p.getChildComponentAt(0)

			expect(child).to.be(c)
			expect(child.element).to.be(p.element.childNodes[0])
		})

		it('should add a child component after another by default', function() {

			var p  = new Component()
			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)

			expect(child1).to.be(c1)
			expect(child1.element).to.be(p.element.childNodes[0])

			expect(child2).to.be(c2)
			expect(child2.element).to.be(p.element.childNodes[1])
		})

		it('should add a child component at the top of its parent', function() {

			var p  = new Component()
			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1, 'top')
			p.addChildComponent(c2, 'top')
			p.addChildComponent(c3, 'top')

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c3)
			expect(child1.element).to.be(p.element.childNodes[0])

			expect(child2).to.be(c2)
			expect(child2.element).to.be(p.element.childNodes[1])

			expect(child3).to.be(c1)
			expect(child3.element).to.be(p.element.childNodes[2])
		})

		it('should add a child component at the bottom of its parent', function() {

			var p  = new Component()
			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1, 'bottom')
			p.addChildComponent(c2, 'bottom')
			p.addChildComponent(c3, 'bottom')

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c1)
			expect(child1.element).to.be(p.element.childNodes[0])

			expect(child2).to.be(c2)
			expect(child2.element).to.be(p.element.childNodes[1])

			expect(child3).to.be(c3)
			expect(child3.element).to.be(p.element.childNodes[2])
		})

		it('should add a child component without moving its element when it is already present in the DOM and the where parameter is unspecified', function() {

			var p = new Component(
				'<div>' +
					'<div class="el3"></div>' +
					'<div class="el2"></div>' +
					'<div class="el1"></div>' +
				'</div>'
			)

			var c1 = new Component(p.element.getElement('.el1'))
			var c2 = new Component(p.element.getElement('.el2'))
			var c3 = new Component(p.element.getElement('.el3'))

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c3)
			expect(child1.element).to.be(p.element.childNodes[0])

			expect(child2).to.be(c2)
			expect(child2.element).to.be(p.element.childNodes[1])

			expect(child3).to.be(c1)
			expect(child3.element).to.be(p.element.childNodes[2])
		})

	})

	// -------------------------------------------------------------------------
	// addChildComponentInside
	// -------------------------------------------------------------------------

	describe('addChildComponentInside', function() {

		it('should add a child component inside an element of another child component', function() {

			var p = new Component(
				'<div>' +
					'<div class="target"></div>' +
				'</div>'
			)

			var target = p.getElement('.target')

			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponentInside(c3, target)

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c3)
			expect(child1.element).to.be(p.element.childNodes[0].childNodes[0])

			expect(child2).to.be(c1)
			expect(child2.element).to.be(p.element.childNodes[1])

			expect(child3).to.be(c2)
			expect(child3.element).to.be(p.element.childNodes[2])
		})

		it('should add a child component inside an element specified by a selector of another child component', function() {

			var p = new Component(
				'<div>' +
					'<div class="target"></div>' +
				'</div>'
			)

			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponentInside(c3, '.target')

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c3)
			expect(child1.element).to.be(p.element.childNodes[0].childNodes[0])

			expect(child2).to.be(c1)
			expect(child2.element).to.be(p.element.childNodes[1])

			expect(child3).to.be(c2)
			expect(child3.element).to.be(p.element.childNodes[2])
		})

		it('should add a child component at the top an element of another child component', function() {

			var p = new Component(
				'<div>' +
					'<div class="target"></div>' +
				'</div>'
			)

			var target = p.getElement('.target')

			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponentInside(c2, target, 'top')
			p.addChildComponentInside(c3, target, 'top')

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c3)
			expect(child1.element).to.be(p.element.childNodes[0].childNodes[0])

			expect(child2).to.be(c2)
			expect(child2.element).to.be(p.element.childNodes[0].childNodes[1])

			expect(child3).to.be(c1)
			expect(child3.element).to.be(p.element.childNodes[1])
		})

		it('should add a child component at the bottom an element of another child component', function() {

			var p = new Component(
				'<div>' +
					'<div class="target"></div>' +
				'</div>'
			)

			var target = p.getElement('.target')

			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponentInside(c2, target, 'bottom')
			p.addChildComponentInside(c3, target, 'bottom')

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c2)
			expect(child1.element).to.be(p.element.childNodes[0].childNodes[0])

			expect(child2).to.be(c3)
			expect(child2.element).to.be(p.element.childNodes[0].childNodes[1])

			expect(child3).to.be(c1)
			expect(child3.element).to.be(p.element.childNodes[1])
		})

	})

	// -------------------------------------------------------------------------
	// addChildComponentBefore
	// -------------------------------------------------------------------------

	describe('addChildComponentBefore', function() {

		it('should add a child component before another child component', function() {

			var p  = new Component()
			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponentBefore(c3, c2)

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c1)
			expect(child1.element).to.be(p.element.childNodes[0])

			expect(child2).to.be(c3)
			expect(child2.element).to.be(p.element.childNodes[1])

			expect(child3).to.be(c2)
			expect(child3.element).to.be(p.element.childNodes[2])
		})

	})

	// -------------------------------------------------------------------------
	// addChildComponentAfter
	// -------------------------------------------------------------------------

	describe('addChildComponentAfter', function() {

		it('should add a child component after another child component', function() {

			var p  = new Component()
			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponentAfter(c3, c1)

			var child1 = p.getChildComponentAt(0)
			var child2 = p.getChildComponentAt(1)
			var child3 = p.getChildComponentAt(2)

			expect(child1).to.be(c1)
			expect(child1.element).to.be(p.element.childNodes[0])

			expect(child2).to.be(c3)
			expect(child2.element).to.be(p.element.childNodes[1])

			expect(child3).to.be(c2)
			expect(child3.element).to.be(p.element.childNodes[2])
		})

	})

	// -------------------------------------------------------------------------
	// _addChildComponent
	// -------------------------------------------------------------------------

	describe('_addChildComponent', function() {

		it('should remove the child component from its previous parent', function() {

			var p1 = new Component()
			var p2 = new Component()
			var c  = new Component()

			p1.addChildComponent(c)
			p2.addChildComponent(c)

			expect(p1.hasChildComponent(c)).to.be(false)
			expect(p2.hasChildComponent(c)).to.be(true)
		})

		it ('should properly set the parent to the child component', function() {

			var p = new Component()
			var c = new Component()

			p.addChildComponent(c)

			expect(c.getParentComponent()).to.be(p)
		})

		it('should properly set the window to each child components', function() {

			var w    = new Window()
			var p    = new Component()
			var c1   = new Component()
			var c2   = new Component()
			var c1c1 = new Component()
			var c1c2 = new Component()
			var c2c1 = new Component()
			var c2c2 = new Component()

			w.addChildComponent(p)

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			c1.addChildComponent(c1c1)
			c1.addChildComponent(c1c2)

			c2.addChildComponent(c2c1)
			c2.addChildComponent(c2c2)

			expect(p.getWindow()).to.be(w)
			expect(c1.getWindow()).to.be(w)
			expect(c2.getWindow()).to.be(w)
			expect(c1c1.getWindow()).to.be(w)
			expect(c1c2.getWindow()).to.be(w)
			expect(c2c1.getWindow()).to.be(w)
			expect(c2c2.getWindow()).to.be(w)
		})

		it('should property set the ready state to each child components', function() {

			var w    = new Window()
			var p    = new Component()
			var c1   = new Component()
			var c2   = new Component()
			var c1c1 = new Component()
			var c1c2 = new Component()
			var c2c1 = new Component()
			var c2c2 = new Component()

			w._setReady(true)

			w.addChildComponent(p)

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			c1.addChildComponent(c1c1)
			c1.addChildComponent(c1c2)

			c2.addChildComponent(c2c1)
			c2.addChildComponent(c2c2)

			expect(p.isReady()).to.be(true)
			expect(c1.isReady()).to.be(true)
			expect(c2.isReady()).to.be(true)
			expect(c1c1.isReady()).to.be(true)
			expect(c1c2.isReady()).to.be(true)
			expect(c2c1.isReady()).to.be(true)
			expect(c2c2.isReady()).to.be(true)
		})

		it('should properly map indexes to components', function() {

			Component.defineRole('button', null, null, function(element) {
				this.addChildComponent(new Component(element));
			});

			var p = new Component(
				'<div>' +
					'<div data-role="button" data-name="b1">B1</div>' +
					'<div>' +
						'<div></div>' +
						'<div data-role="button" data-name="b2">B2</div>' +
						'<div>' +
							'<div data-role="button" data-name="b3">B3</div>' +
						'</div>' +
					'</div>' +
					'<div data-role="button" data-name="b4">B4</div>' +
					'<div></div>' +
					'<div>' +
						'<div data-role="button" data-name="b5">B5</div>' +
					'</div>' +
				'</div>'
			)

			var child1 = p.getChildComponent('b1')
			var child2 = p.getChildComponent('b2')
			var child3 = p.getChildComponent('b3')
			var child4 = p.getChildComponent('b4')
			var child5 = p.getChildComponent('b5')

			expect(p.getChildComponentIndex(child1)).to.be(0)
			expect(p.getChildComponentIndex(child2)).to.be(1)
			expect(p.getChildComponentIndex(child3)).to.be(2)
			expect(p.getChildComponentIndex(child4)).to.be(3)
			expect(p.getChildComponentIndex(child5)).to.be(4)
		})

		it('should properly call willAddChildComponent and didAddChildComponent on the parent component', function() {

			var p    = new Component()
			var c1   = new Component()
			var c2   = new Component()

			sinon.spy(p, 'willAddChildComponent')
			sinon.spy(p, 'didAddChildComponent')

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			expect(p.willAddChildComponent.calledWith(c1)).to.be.ok()
			expect(p.willAddChildComponent.calledWith(c2)).to.be.ok()
			expect(p.willAddChildComponent.callCount).to.be(2)

			expect(p.didAddChildComponent.calledWith(c1)).to.be.ok()
			expect(p.didAddChildComponent.calledWith(c2)).to.be.ok()
			expect(p.didAddChildComponent.callCount).to.be(2)
		})

		it('should properly call willRemoveChildComponent and didRemoveChildComponent on the parent component', function() {

			var p    = new Component()
			var c1   = new Component()
			var c2   = new Component()

			sinon.spy(p, 'willRemoveChildComponent')
			sinon.spy(p, 'didRemoveChildComponent')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.removeChildComponent(c1)
			p.removeChildComponent(c2)

			expect(p.willRemoveChildComponent.calledWith(c1)).to.be.ok()
			expect(p.willRemoveChildComponent.calledWith(c2)).to.be.ok()
			expect(p.willRemoveChildComponent.callCount).to.be(2)

			expect(p.didRemoveChildComponent.calledWith(c1)).to.be.ok()
			expect(p.didRemoveChildComponent.calledWith(c2)).to.be.ok()
			expect(p.didRemoveChildComponent.callCount).to.be(2)
		})

		it('should properly call parentWillChange and parentDidChange on the child component', function() {

			var p    = new Component()
			var c1   = new Component()
			var c2   = new Component()

			sinon.spy(c1, 'parentComponentWillChange')
			sinon.spy(c1, 'parentComponentDidChange')
			sinon.spy(c2, 'parentComponentWillChange')
			sinon.spy(c2, 'parentComponentDidChange')

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			expect(c1.parentComponentWillChange.calledWith(p)).to.be.ok()
			expect(c1.parentComponentDidChange.calledWith(p)).to.be.ok()

			expect(c2.parentComponentWillChange.calledWith(p)).to.be.ok()
			expect(c2.parentComponentDidChange.calledWith(p)).to.be.ok()

			p.removeChildComponent(c1)
			p.removeChildComponent(c2)

			expect(c1.parentComponentWillChange.calledWith(null)).to.be.ok()
			expect(c1.parentComponentDidChange.calledWith(null)).to.be.ok()

			expect(c2.parentComponentWillChange.calledWith(null)).to.be.ok()
			expect(c2.parentComponentDidChange.calledWith(null)).to.be.ok()
		})

		it('should properly call didBecomeReady on each child components', function() {

			var w    = new Window()
			var p    = new Component()
			var c1   = new Component()
			var c2   = new Component()
			var c1c1 = new Component()
			var c1c2 = new Component()
			var c2c1 = new Component()
			var c2c2 = new Component()

			sinon.spy(p, 'didBecomeReady')
			sinon.spy(c1, 'didBecomeReady')
			sinon.spy(c2, 'didBecomeReady')
			sinon.spy(c1c1, 'didBecomeReady')
			sinon.spy(c1c2, 'didBecomeReady')
			sinon.spy(c2c1, 'didBecomeReady')
			sinon.spy(c2c2, 'didBecomeReady')

			w._setReady(true)

			w.addChildComponent(p)

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			c1.addChildComponent(c1c1)
			c1.addChildComponent(c1c2)

			c2.addChildComponent(c2c1)
			c2.addChildComponent(c2c2)

			expect(p.didBecomeReady.called).to.be.ok()
			expect(c1.didBecomeReady.called).to.be.ok()
			expect(c2.didBecomeReady.called).to.be.ok()
			expect(c1c1.didBecomeReady.called).to.be.ok()
			expect(c1c2.didBecomeReady.called).to.be.ok()
			expect(c2c1.didBecomeReady.called).to.be.ok()
			expect(c2c2.didBecomeReady.called).to.be.ok()
		})

		it('should properly call didUpdateLayout once', function() {

		})

	})

	// -------------------------------------------------------------------------
	// addChildComponents
	// -------------------------------------------------------------------------

	describe('addChildComponents', function() {
		// TODO
	})

	// -------------------------------------------------------------------------
	//  addChildComponentsInside
	// -------------------------------------------------------------------------

	describe('addChildComponentsInside', function() {
		// TODO
	})

	// -------------------------------------------------------------------------
	// addChildComponentsAfter
	// -------------------------------------------------------------------------

	describe('addChildComponentsAfter', function() {
		// TODO
	})

	// -------------------------------------------------------------------------
	// addChildComponentsBefore
	// -------------------------------------------------------------------------

	describe('addChildComponentsAfter', function() {
		// TODO
	})

	// -------------------------------------------------------------------------
	// _addChildComponents
	// -------------------------------------------------------------------------

	describe('_addChildComponents', function() {

	});

	// -------------------------------------------------------------------------
	// _inject
	// -------------------------------------------------------------------------

	describe('_inject', function() {
		// TODO
	})

	// -------------------------------------------------------------------------
	// _insert
	// -------------------------------------------------------------------------

	describe('_insert', function() {
		// TODO
	})

	// -------------------------------------------------------------------------
	// getChildComponent
	// -------------------------------------------------------------------------

	describe('getChildComponent', function() {

		it('should find a child using its name', function() {

			var p  = new Component()
			var c1 = new Component(null, null, 'me')
			var c2 = new Component(null, null, 'not-me')
			var c3 = new Component(null, null, 'not-me-either')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			expect(p.getChildComponent('me')).to.be(c1)
		})

	})

	// -------------------------------------------------------------------------
	// getChildComponentOfType
	// -------------------------------------------------------------------------

	describe('getChildComponentOfType', function() {

		it('should find a child of a given type using its name', function() {

			var p  = new Component()
			var c1 = new Component(null, null, 'me')
			var c2 = new ComponentOne(null, null, 'me')
			var c3 = new ComponentTwo(null, null, 'me')

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			expect(p.getChildComponentOfType(ComponentOne, 'me')).to.be(c2)
		})

	})

	// -------------------------------------------------------------------------
	// getChildComponentAt
	// -------------------------------------------------------------------------

	describe('getChildComponentAt', function() {

		it('should find a child using its index', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			expect(p.getChildComponentAt(0)).to.be(c1)
			expect(p.getChildComponentAt(1)).to.be(c2)
			expect(p.getChildComponentAt(2)).to.be(c3)
			expect(p.getChildComponentAt(9)).to.be(null)
		})

	})

	// -------------------------------------------------------------------------
	// getChildComponentByTypeAt
	// -------------------------------------------------------------------------

	describe('getChildComponentByTypeAt', function() {

		it('should find a child of a given type using its index', function() {

			var Missing = new Class({
				Extends: Component
			})

			var p  = new Component()
			var c1 = new Component()
			var c2 = new ComponentOne()
			var c3 = new ComponentTwo()

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			expect(p.getChildComponentOfTypeAt(ComponentTwo, 0)).to.be(c3)
			expect(p.getChildComponentOfTypeAt(ComponentTwo, 9)).to.be(null)

			expect(p.getChildComponentOfTypeAt(Missing, 0)).to.be(null)
		})

	})

	// -------------------------------------------------------------------------
	// getChildComponentIndex
	// -------------------------------------------------------------------------

	describe('getChildComponentIndex', function() {

		it('should find the index of a child', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			var missing = new Component()

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			expect(p.getChildComponentIndex(c1)).to.be(0)
			expect(p.getChildComponentIndex(c2)).to.be(1)
			expect(p.getChildComponentIndex(c3)).to.be(2)

			expect(p.getChildComponentIndex(missing)).to.be(-1)
		})

	})

	// -------------------------------------------------------------------------
	// getChildComponents
	// -------------------------------------------------------------------------

	describe('getChildComponents', function() {

		it('should return all children', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()
			var c2 = new Component()

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			var children = p.getChildComponents()

			expect(children[0]).to.be(c1)
			expect(children[1]).to.be(c2)
			expect(children[2]).to.be(c3)
		})

	})

	// -------------------------------------------------------------------------
	// getChildComponentsOfType
	// -------------------------------------------------------------------------

	describe('getChildComponentsOfType', function() {

		it('should return all children of a given type', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new ComponentOne()
			var c3 = new ComponentOne()

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			var children = p.getChildComponentsOfType(ComponentOne)

			expect(children[0]).to.be(c2)
			expect(children[1]).to.be(c3)
		})

	})

	// -------------------------------------------------------------------------
	// hasChildComponent
	// -------------------------------------------------------------------------

	describe('hasChildComponent', function() {

		it('should know if a child exists', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			expect(p.hasChildComponent(c1)).to.be(true)
			expect(p.hasChildComponent(c2)).to.be(true)
			expect(p.hasChildComponent(c3)).to.be(false)
		})

	})

	// -------------------------------------------------------------------------
	// hasChildComponentByType
	// -------------------------------------------------------------------------

	describe('hasChildComponentByType', function() {

		it('should know if a child of a given type exists', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new ComponentOne()

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			expect(p.hasChildComponentByType(ComponentOne)).to.be(true)
			expect(p.hasChildComponentByType(ComponentTwo)).to.be(false)
		})

	})

	// -------------------------------------------------------------------------
	// getComponent
	// -------------------------------------------------------------------------

	describe('getComponent', function() {

		it('should find a component within all its descendant using its name', function() {

			var p  = new Component()

			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			var c1c1 = new Component(null, null, 'c1c1')
			var c1c2 = new Component(null, null, 'c1c2')
			var c1c3 = new Component(null, null, 'c1c3')

			var c2c1 = new Component(null, null, 'c2c1')
			var c2c2 = new Component(null, null, 'c2c2')
			var c2c3 = new Component(null, null, 'c2c3')

			var c3c1 = new Component(null, null, 'c3c1')
			var c3c2 = new Component(null, null, 'c3c2')
			var c3c3 = new Component(null, null, 'c3c3')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			c1.addChildComponent(c1c1)
			c1.addChildComponent(c1c2)
			c1.addChildComponent(c1c3)

			c2.addChildComponent(c2c1)
			c2.addChildComponent(c2c2)
			c2.addChildComponent(c2c3)

			c3.addChildComponent(c3c1)
			c3.addChildComponent(c3c2)
			c3.addChildComponent(c3c3)

			expect(p.getComponent('c1')).to.be(c1)
			expect(p.getComponent('c2')).to.be(c2)
			expect(p.getComponent('c3')).to.be(c3)
			expect(p.getComponent('c1c1')).to.be(c1c1)
			expect(p.getComponent('c1c2')).to.be(c1c2)
			expect(p.getComponent('c1c3')).to.be(c1c3)
			expect(p.getComponent('c2c1')).to.be(c2c1)
			expect(p.getComponent('c2c2')).to.be(c2c2)
			expect(p.getComponent('c2c3')).to.be(c2c3)
			expect(p.getComponent('c3c1')).to.be(c3c1)
			expect(p.getComponent('c3c2')).to.be(c3c2)
			expect(p.getComponent('c3c3')).to.be(c3c3)
		})

	})

	// -------------------------------------------------------------------------
	// getComponentByType
	// -------------------------------------------------------------------------

	describe('getComponentByType', function() {

		it('should find a component within all its descendant using its type and name', function() {

			var p  = new Component()

			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			var c1c1 = new ComponentOne(null, null, 'c1')
			var c1c2 = new ComponentOne(null, null, 'c2')
			var c1c3 = new ComponentOne(null, null, 'c3')

			var c2c1 = new ComponentTwo(null, null, 'c1')
			var c2c2 = new ComponentTwo(null, null, 'c2')
			var c2c3 = new ComponentTwo(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			c1.addChildComponent(c1c1)
			c1.addChildComponent(c1c2)
			c1.addChildComponent(c1c3)

			c2.addChildComponent(c2c1)
			c2.addChildComponent(c2c2)
			c2.addChildComponent(c2c3)

			expect(p.getComponentByType(Component, 'c1')).to.be(c1)
			expect(p.getComponentByType(Component, 'c2')).to.be(c2)
			expect(p.getComponentByType(Component, 'c3')).to.be(c3)
			expect(p.getComponentByType(ComponentOne, 'c1')).to.be(c1c1)
			expect(p.getComponentByType(ComponentOne, 'c2')).to.be(c1c2)
			expect(p.getComponentByType(ComponentOne, 'c3')).to.be(c1c3)
			expect(p.getComponentByType(ComponentTwo, 'c1')).to.be(c2c1)
			expect(p.getComponentByType(ComponentTwo,'c2')).to.be(c2c2)
			expect(p.getComponentByType(ComponentTwo,'c3')).to.be(c2c3)
		})

	})

	// -------------------------------------------------------------------------
	// hasComponentByType
	// -------------------------------------------------------------------------

	describe('hasComponentByType', function() {

		it('should know if a component of a given type exists within all descendant component', function() {

			var p  = new Component()

			var c1 = new Component(null, null, 'c1')
			var c2 = new Component(null, null, 'c2')
			var c3 = new Component(null, null, 'c3')

			var c1c1 = new ComponentOne(null, null, 'c1')
			var c1c2 = new ComponentOne(null, null, 'c2')
			var c1c3 = new ComponentOne(null, null, 'c3')

			var c2c1 = new ComponentTwo(null, null, 'c1')
			var c2c2 = new ComponentTwo(null, null, 'c2')
			var c2c3 = new ComponentTwo(null, null, 'c3')

			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.addChildComponent(c3)

			c1.addChildComponent(c1c1)
			c1.addChildComponent(c1c2)
			c1.addChildComponent(c1c3)

			c2.addChildComponent(c2c1)
			c2.addChildComponent(c2c2)
			c2.addChildComponent(c2c3)

			expect(p.getComponentByType(Component, 'c1')).to.be(c1)
			expect(p.getComponentByType(Component, 'c2')).to.be(c2)
			expect(p.getComponentByType(Component, 'c3')).to.be(c3)
			expect(p.getComponentByType(ComponentOne, 'c1')).to.be(c1c1)
			expect(p.getComponentByType(ComponentOne, 'c2')).to.be(c1c2)
			expect(p.getComponentByType(ComponentOne, 'c3')).to.be(c1c3)
			expect(p.getComponentByType(ComponentTwo, 'c1')).to.be(c2c1)
			expect(p.getComponentByType(ComponentTwo,'c2')).to.be(c2c2)
			expect(p.getComponentByType(ComponentTwo,'c3')).to.be(c2c3)
		})

	})

	// -------------------------------------------------------------------------
	// replaceChildComponent
	// -------------------------------------------------------------------------

	describe('replaceChildComponent', function() {

		it('should replace a child component with another', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()

			p.addChildComponent(c1)
			p.replaceChildComponent(c1, c2)

			expect(p.getChildComponentAt(0)).to.be(c2)
		})

	})

	// -------------------------------------------------------------------------
 	// replaceWithComponent
 	// -------------------------------------------------------------------------

 	describe('replaceWithComponent', function() {

		it('should replace itself with another child component', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()

			p.addChildComponent(c1)
			c1.replaceWithComponent(c2)

			expect(p.getChildComponentAt(0)).to.be(c2)
		})

	})

	// -------------------------------------------------------------------------
	// removeChildComponent
	// -------------------------------------------------------------------------

	describe('removeChildComponent', function() {

		it('should remove a child component', function() {

			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()

			p.addChildComponent(c1)
			p.addChildComponent(c2)

			sinon.spy(p, 'willRemoveChildComponent')
			sinon.spy(p, 'didRemoveChildComponent')
			sinon.spy(c1, 'parentComponentWillChange')
			sinon.spy(c2, 'parentComponentDidChange')

			p.removeChildComponent(c1)

			expect(p.getChildComponentAt(0)).to.be(null)
			expect(p.willRemoveChildComponent.calledWith(c1)).to.be.ok()
			expect(p.didRemoveChildComponent.calledWith(c1)).to.be.ok()
		})

	})

	// -------------------------------------------------------------------------
	// removeAllChildComponents
	// -------------------------------------------------------------------------

	describe('removeAllChildComponents', function() {

		it('should remove all children', function() {
			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()
			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.removeAllChildComponents()
			expect(p.getChildComponents().length).to.be(0)
		})

	})

	// -------------------------------------------------------------------------
 	// removeAllChildComponentsOfType
 	// -------------------------------------------------------------------------

 	describe('removeAllChildComponentsOfType', function() {

		it('should remove all children of a given type', function() {
			var p  = new Component()
			var c1 = new Component()
			var c2 = new MyComponent()
			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.removeAllChildComponentsOfType(MyComponent)
			expect(p.getChildComponents().length).to.be(1)
		})

	})

	// -------------------------------------------------------------------------
	// removeFromParentComponent
	// -------------------------------------------------------------------------

	describe('removeFromParentComponent', function() {

		it('should remove itself', function() {
			var p  = new Component()
			var c1 = new Component()
			p.addChildComponent(c1)
			c1.removeFromParentComponent()
			expect(p.getChildComponents().length).to.be(0)
		})

	})

	// -------------------------------------------------------------------------
	// setParentComponent, getParentComponent, hasParentComponent
	// -------------------------------------------------------------------------

	describe('setParentComponent, getParentComponent, hasParentComponent', function() {

		it('should set the parent', function() {
			var p  = new Component()
			var c1 = new Component()
			sinon.spy(c1, 'parentComponentWillChange')
			sinon.spy(c1, 'parentComponentDidChange')
			c1.setParentComponent(p)
			expect(c1.getParentComponent()).to.be(p)
			expect(c1.hasParentComponent()).to.be(true)
			expect(c1.parentComponentWillChange.calledWith(p)).to.be.ok()
			expect(c1.parentComponentDidChange.calledWith(p)).to.be.ok()
		})

	})

	// -------------------------------------------------------------------------
	// setWindow, getWindow, hasWindow
	// -------------------------------------------------------------------------

	describe('setWindow, getWindow, hasWindow', function() {

		it('should set the window through all child', function() {
			var w  = new Window()
			var p  = new Component()
			var c1 = new Component()
			var c2 = new Component()
			sinon.spy(c1, 'windowWillChange')
			sinon.spy(c1, 'windowDidChange')
			sinon.spy(c2, 'windowWillChange')
			sinon.spy(c2, 'windowDidChange')
			p.addChildComponent(c1)
			p.addChildComponent(c2)
			p.setWindow(w)
			expect(p.getWindow()).to.be(w)
			expect(p.hasWindow()).to.be(true)
			expect(c1.getWindow()).to.be(w)
			expect(c2.getWindow()).to.be(w)
			expect(c1.windowWillChange.calledWith(w)).to.be.ok()
			expect(c1.windowDidChange.calledWith(w)).to.be.ok()
			expect(c2.windowWillChange.calledWith(w)).to.be.ok()
			expect(c2.windowDidChange.calledWith(w)).to.be.ok()
		})

	})

	// -------------------------------------------------------------------------
	// setReady, isReady
	// -------------------------------------------------------------------------

	describe('setReady, isReady', function() {

		it('should handle the ready flag through all child', function() {
			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()
			sinon.spy(c1, 'didBecomeReady')
			sinon.spy(c2, 'didBecomeReady')
			sinon.spy(c3, 'didBecomeReady')
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)
			w.addChildComponent(c1)
			expect(c1.didBecomeReady.called).to.be.ok()
			expect(c2.didBecomeReady.called).to.be.ok()
			expect(c3.didBecomeReady.called).to.be.ok()
			expect(c1.didBecomeReady.callCount).to.be(1)
			expect(c2.didBecomeReady.callCount).to.be(1)
			expect(c3.didBecomeReady.callCount).to.be(1)
			expect(c1.isReady()).to.be(true)
			expect(c2.isReady()).to.be(true)
			expect(c3.isReady()).to.be(true)
		})

	})

	// -------------------------------------------------------------------------
	// getName
	// -------------------------------------------------------------------------

	describe('getName', function() {

		it('should return the name', function() {
			var c = new Component(null, null, 'foo')
			expect(c.getName()).to.be('foo')
		})

	})

	// -------------------------------------------------------------------------
	// setStyle, getStyle
	// -------------------------------------------------------------------------

	describe('setStyle, getStyle', function() {

		it('should set the style', function() {
			var attached = false;
			var detached = false;
			Component.defineStyle('test', null, {
				attach: function() { attached = true; },
				detach: function() { detached = true; }
			})
			var c = new Component()
			c.setStyle('test')
			c.setStyle(null)
			expect(attached).to.be(true)
			expect(detached).to.be(true)
			c.setStyle('test')
			expect(c.getStyle()).to.be('test')
		})

	})

	// -------------------------------------------------------------------------
	// addClass
	// -------------------------------------------------------------------------

	describe('addClass', function() {

		it('should add a CSS class name to the component element', function() {
			var c = new Component()
			c.addClass('foo')
			expect(c.hasClass('foo')).to.be(true)
		})

	})

	// -------------------------------------------------------------------------
	// removeClass
	// -------------------------------------------------------------------------

	describe('removeClass', function() {

		it('should remove a CSS class name', function() {
			var c = new Component()
			c.addClass('foo')
			c.removeClass('foo')
			expect(c.hasClass('foo')).to.be(false)
		})

	})

	// -------------------------------------------------------------------------
	// toggleClass
	// -------------------------------------------------------------------------

	describe('toggleClass', function() {

		it('should add a CSS class name if not existent', function() {
			var c = new Component()
			c.toggleClass('foo')
			expect(c.hasClass('foo')).to.be(true)
		})

		it('should remove a CSS class name if existent', function() {
			var c = new Component()
			c.addClass('foo')
			c.toggleClass('foo')
			expect(c.hasClass('foo')).to.be(false)
		})

		it('should force add a CSS class name if not existent', function() {
			var c = new Component()
			c.addClass('foo')
			c.toggleClass('foo', true)
			expect(c.hasClass('foo')).to.be(true)
		})

		it('should force remove a CSS class name if existent', function() {
			var c = new Component()
			c.addClass('foo')
			c.toggleClass('foo', false)
			expect(c.hasClass('foo')).to.be(false)
		})

	})

	// -------------------------------------------------------------------------
	// hasClass
	// -------------------------------------------------------------------------

	describe('hasClass', function() {

		it('should indicate whether a CSS class', function() {
			var c = new Component()
			c.addClass('foo')
			expect(c.hasClass('foo')).to.be(true)
		})

	})

	// -------------------------------------------------------------------------
	// getElement
	// -------------------------------------------------------------------------

	describe('getElement', function() {

		it('should return the component element or an element from a selector', function() {
			var c = new Component('<div><p></p></div>')
			expect(c.element.get('tag')).to.be('div')
			expect(c.getElement('p').get('tag')).to.be('p')
		})

	})

	// -------------------------------------------------------------------------
	// getElements
	// -------------------------------------------------------------------------

	describe('getElements', function() {

		it('should return the component elements or elements that matches a selector', function() {
			var c = new Component('<div><p></p><p></p><div></div></div>')
			expect(c.getElements().length).to.be(3)
			expect(c.getElements('p').length).to.be(2)
		})

	})

	// -------------------------------------------------------------------------
	// hasElement
	// -------------------------------------------------------------------------

	describe('hasElement', function() {

		it('should know if an element exists', function() {
			var d = new Element('div')
			var s = new Element('span').inject(d)
			var c = new Component(d)
			expect(c.hasElement(s)).to.be(true)
		})

	})

	// -------------------------------------------------------------------------
	// getRoleElement
	// -------------------------------------------------------------------------

	describe('getRoleElement', function() {

		it('should return the component elements or elements that matches a selector', function() {
			Component.defineRole('test-element', null, null, function(){})
			Component.defineRole('test-content', null, null, function(){})
			Component.defineRole('test-wrapper', null, {traversable:true}, function(){})
			var CustomComponent = new Class({
				Extends: Component,
				willBuild: function() {
					expect(this.getRoleElement('test-element')).to.be(null)
					expect(this.getRoleElement('test-wrapper')).not.to.be(null)
					expect(this.getRoleElement('test-content')).not.to.be(null)
				}
			})
			new CustomComponent(
				'<div>' +
					'<div data-role="test-wrapper">' +
						'<div data-role="test-content">' +
							'<div data-role="test-element"></div>' +
						'</div>' +
					'</div>' +
				'</div>'
			)
		})

	})

	// -------------------------------------------------------------------------
	// show, hide
	// -------------------------------------------------------------------------

	describe('show, hide', function() {

		it('should hide the component and its child components', function() {

			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			w.addChildComponent(c1)
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)

			w.hide()

			expect(w.isVisible()).to.be(false)
			expect(c1.isVisible()).to.be(false)
			expect(c2.isVisible()).to.be(false)
			expect(c3.isVisible()).to.be(false)
		})

		it('should show the component and its child components after being hidden', function() {

			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			w.addChildComponent(c1)
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)

			w.hide()
			w.show()

			expect(w.isVisible()).to.be(true)
			expect(c1.isVisible()).to.be(true)
			expect(c2.isVisible()).to.be(true)
			expect(c3.isVisible()).to.be(true)
		})

		it('should properly propagate willHide and didHide through all components', function() {

			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			sinon.spy(w, 'willHide')
			sinon.spy(w, 'didHide')
			sinon.spy(c1, 'willHide')
			sinon.spy(c1, 'didHide')
			sinon.spy(c2, 'willHide')
			sinon.spy(c2, 'didHide')
			sinon.spy(c3, 'willHide')
			sinon.spy(c3, 'didHide')

			w.addChildComponent(c1)
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)

			w.hide()

			expect(c1.willHide.callCount).to.be(1)
			expect(c1.didHide.callCount).to.be(1)
			expect(c2.willHide.callCount).to.be(1)
			expect(c2.didHide.callCount).to.be(1)
			expect(c3.willHide.callCount).to.be(1)
			expect(c3.didHide.callCount).to.be(1)
		})

		it('should properly propagate willShow and didShow through all components', function() {

			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			sinon.spy(w, 'willShow')
			sinon.spy(w, 'didShow')
			sinon.spy(c1, 'willShow')
			sinon.spy(c1, 'didShow')
			sinon.spy(c2, 'willShow')
			sinon.spy(c2, 'didShow')
			sinon.spy(c3, 'willShow')
			sinon.spy(c3, 'didShow')

			w.addChildComponent(c1)
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)

			w.hide()
			w.show()

			expect(c1.willShow.callCount).to.be(1)
			expect(c1.didShow.callCount).to.be(1)
			expect(c2.willShow.callCount).to.be(1)
			expect(c2.didShow.callCount).to.be(1)
			expect(c3.willShow.callCount).to.be(1)
			expect(c3.didShow.callCount).to.be(1)
		})

		it('should not re-propagate willHide and didHide through all components when already hidden', function() {

			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			sinon.spy(w, 'willHide')
			sinon.spy(w, 'didHide')
			sinon.spy(c1, 'willHide')
			sinon.spy(c1, 'didHide')
			sinon.spy(c2, 'willHide')
			sinon.spy(c2, 'didHide')
			sinon.spy(c3, 'willHide')
			sinon.spy(c3, 'didHide')

			w.addChildComponent(c1)
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)

			w.hide()
			w.hide()

			expect(c1.willHide.callCount).to.be(1)
			expect(c1.didHide.callCount).to.be(1)
			expect(c2.willHide.callCount).to.be(1)
			expect(c2.didHide.callCount).to.be(1)
			expect(c3.willHide.callCount).to.be(1)
			expect(c3.didHide.callCount).to.be(1)
		})

		it('should not re-propagate willShow and didShow through all components when already shown', function() {

			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			sinon.spy(w, 'willShow')
			sinon.spy(w, 'didShow')
			sinon.spy(c1, 'willShow')
			sinon.spy(c1, 'didShow')
			sinon.spy(c2, 'willShow')
			sinon.spy(c2, 'didShow')
			sinon.spy(c3, 'willShow')
			sinon.spy(c3, 'didShow')

			w.addChildComponent(c1)
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)

			w.hide()
			w.show()
			w.show()

			expect(c1.willShow.callCount).to.be(1)
			expect(c1.didShow.callCount).to.be(1)
			expect(c2.willShow.callCount).to.be(1)
			expect(c2.didShow.callCount).to.be(1)
			expect(c3.willShow.callCount).to.be(1)
			expect(c3.didShow.callCount).to.be(1)
		})

		it('should not show a child that has been hidden when showing the parent', function() {

			var w = new Window()
			var c1 = new Component()
			var c2 = new Component()
			var c3 = new Component()

			w.addChildComponent(c1)
			c1.addChildComponent(c2)
			c2.addChildComponent(c3)

			sinon.spy(w, 'willShow')
			sinon.spy(w, 'didShow')
			sinon.spy(c1, 'willShow')
			sinon.spy(c1, 'didShow')
			sinon.spy(c2, 'willShow')
			sinon.spy(c2, 'didShow')
			sinon.spy(c3, 'willShow')
			sinon.spy(c3, 'didShow')

			w.hide()
			c3.hide()
			w.show()

			expect(w.isVisible()).to.be(true)
			expect(c1.isVisible()).to.be(true)
			expect(c2.isVisible()).to.be(true)
			expect(c3.isVisible()).to.be(false)

			expect(c1.willShow.callCount).to.be(1)
			expect(c1.didShow.callCount).to.be(1)
			expect(c2.willShow.callCount).to.be(1)
			expect(c2.didShow.callCount).to.be(1)
			expect(c3.willShow.callCount).to.be(0)
			expect(c3.didShow.callCount).to.be(0)
		})

	})

	// willUpdateLayout, didUpdateLayout

	// it('should call didUpdateLayout once after adding a component', function() {

	// 	var w  = new Window()
	// 	var p = new Component()
	// 	var c1 = new Component()
	// 	var c2 = new Component()
	// 	var c3 = new Component()

	// 	sinon.spy(p, 'didUpdateLayout')
	// 	sinon.spy(c1, 'didUpdateLayout')
	// 	sinon.spy(c2, 'didUpdateLayout')
	// 	sinon.spy(c3, 'didUpdateLayout')

	// 	p.addChildComponent(c1)
	// 	p.addChildComponent(c2)
	// 	w.addChildComponent(p)

	// 	expect(p.didUpdateLayout.callCount).to.be(1)
	// 	expect(c1.didUpdateLayout.callCount).to.be(1)
	// 	expect(c2.didUpdateLayout.callCount).to.be(1)

	// 	w.addChildComponent(c3)

	// 	expect(p.didUpdateLayout.callCount).to.be(2)
	// 	expect(c1.didUpdateLayout.callCount).to.be(2)
	// 	expect(c2.didUpdateLayout.callCount).to.be(2)
	// 	expect(c3.didUpdateLayout.callCount).to.be(1)

	// })

	// it('should call didUpdateLayout once after replacing a component', function() {

	// 	var w  = new Window()
	// 	var p = new Component()
	// 	var c1 = new Component()
	// 	var c2 = new Component()

	// 	w.addChildComponent(p)
	// 	p.addChildComponent(c1)

	// 	sinon.spy(p, 'didUpdateLayout')
	// 	sinon.spy(c1, 'didUpdateLayout')
	// 	sinon.spy(c2, 'didUpdateLayout')

	// 	p.replaceChildComponent(c1, c2)

	// 	expect(p.didUpdateLayout.callCount).to.be(1)
	// 	expect(c1.didUpdateLayout.callCount).to.be(0)
	// 	expect(c2.didUpdateLayout.callCount).to.be(1)
	// })

	// it('should call didUpdateLayout once after adding or removing a class', function() {

	// 	var w  = new Window()
	// 	var c = new Component()

	// 	w.addChildComponent(c)

	// 	sinon.spy(c, 'didUpdateLayout')

	// 	c.addClass('test')
	// 	expect(c.didUpdateLayout.callCount).to.be(1)

	// 	c.removeClass('test')
	// 	expect(c.didUpdateLayout.callCount).to.be(2)

	// 	c.toggleClass('test')
	// 	expect(c.didUpdateLayout.callCount).to.be(3)

	// })

	// TODO: Test Size
	// TODO: Test Position

})