describe('Component/Component', function() {


// TODO: Set style via data-style

	var MyComponent = new Class({
		Extends: Moobile.Component
	});

	var ComponentOne = new Class({
		Extends: Moobile.Component
	});

	var ComponentTwo = new Class({
		Extends: Moobile.Component
	});

	// initialize

	it('should create a component with a div element from a string', function() {
		var c = new Moobile.Component('<div></div>');
		expect(c.element.get('tag')).toEqual('div');
	});

	it('should create a component with a div element from an element', function() {
		var c = new Moobile.Component(new Element('div'));
		expect(c.element.get('tag')).toEqual('div');
	});

	it('should create a component with a div element by default', function() {
		var c = new Moobile.Component();
		expect(c.element.get('tag')).toEqual('div');
	});

	it('should read string options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="foo"></div>');
		expect(c.options.styleName).toEqual('foo');
	});

	it('should read numeric options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="1"></div>');
		expect(c.options.styleName).toEqual(1);
	});

	it('should read boolean options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="true"></div>');
		expect(c.options.styleName).toEqual(true);
	});

	it('should read array options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="[1]"></div>');
		expect(c.options.styleName).toContain(1);
	});

	// TODO TEST components options

	// -------------------------------------------------------------------------
	// addEvent
	// -------------------------------------------------------------------------

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
			var c  = new Moobile.Component();
			var f1 = function(){};
			var f2 = function(){};
			var f3 = function(){};
			spyOn(c.element, 'addEvent');
			c.addEvent(event, f1);
			c.addEvent(event, f2);
			c.addEvent(event, f3);
			expect(c.element.addEvent).toHaveBeenCalled();
			expect(c.element.addEvent.calls.length).toEqual(1);
		})
	});

	// -------------------------------------------------------------------------
	// removeEvent
	// -------------------------------------------------------------------------

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
			var c  = new Moobile.Component();
			var f1 = function(){};
			var f2 = function(){};
			var f3 = function(){};
			spyOn(c.element, 'removeEvent');
			c.addEvent(event, f1);
			c.addEvent(event, f2);
			c.addEvent(event, f3);
			c.removeEvent(event, f1);
			c.removeEvent(event, f2);
			c.removeEvent(event, f3);
			expect(c.element.removeEvent).toHaveBeenCalled();
			expect(c.element.removeEvent.calls.length).toEqual(1);
		});
	});

	// -------------------------------------------------------------------------
	// addChildComponent
	// -------------------------------------------------------------------------

	it('should add a child component', function() {

		var p = new Moobile.Component();
		var c = new Moobile.Component();

		p.addChildComponent(c);

		var child = p.getChildComponentAt(0);

		expect(child).toEqual(c);
		expect(child.element).toEqual(p.element.childNodes[0]);
	});

	it('should add a child component after another by default', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');

		p.addChildComponent(c1);
		p.addChildComponent(c2)

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);

		expect(child1).toEqual(c1);
		expect(child1.element).toEqual(p.element.childNodes[0]);

		expect(child2).toEqual(c2);
		expect(child2.element).toEqual(p.element.childNodes[1]);
	});

	it('should add a child component at the top of its parent', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1, 'top');
		p.addChildComponent(c2, 'top');
		p.addChildComponent(c3, 'top');

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c3);
		expect(child1.element).toEqual(p.element.childNodes[0]);

		expect(child2).toEqual(c2);
		expect(child2.element).toEqual(p.element.childNodes[1]);

		expect(child3).toEqual(c1);
		expect(child3.element).toEqual(p.element.childNodes[2]);
	});

	it('should add a child component at the bottom of its parent', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1, 'bottom');
		p.addChildComponent(c2, 'bottom');
		p.addChildComponent(c3, 'bottom');

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c1);
		expect(child1.element).toEqual(p.element.childNodes[0]);

		expect(child2).toEqual(c2);
		expect(child2.element).toEqual(p.element.childNodes[1]);

		expect(child3).toEqual(c3);
		expect(child3.element).toEqual(p.element.childNodes[2]);
	});

	it('should add a child component without moving its element when it is already present in the DOM and the where parameter is unspecified', function() {

		var p = new Moobile.Component(
			'<div>' +
				'<div class="el3"></div>' +
				'<div class="el2"></div>' +
				'<div class="el1"></div>' +
			'</div>'
		);

		var c1 = new Moobile.Component(p.element.getElement('.el1'));
		var c2 = new Moobile.Component(p.element.getElement('.el2'));
		var c3 = new Moobile.Component(p.element.getElement('.el3'));

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c3);
		expect(child1.element).toEqual(p.element.childNodes[0]);

		expect(child2).toEqual(c2);
		expect(child2.element).toEqual(p.element.childNodes[1]);

		expect(child3).toEqual(c1);
		expect(child3.element).toEqual(p.element.childNodes[2]);
	});

	// -------------------------------------------------------------------------
	// addChildComponentInside
	// -------------------------------------------------------------------------

	it('should add a child component inside an element of another child component', function() {

		var p = new Moobile.Component(
			'<div>' +
				'<div class="target"></div>' +
			'</div>'
		);

		var target = p.getElement('.target');

		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponentInside(c3, target);

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c3);
		expect(child1.element).toEqual(p.element.childNodes[0].childNodes[0]);

		expect(child2).toEqual(c1);
		expect(child2.element).toEqual(p.element.childNodes[1]);

		expect(child3).toEqual(c2);
		expect(child3.element).toEqual(p.element.childNodes[2]);
	});

	it('should add a child component inside an element specified by a selector of another child component', function() {

		var p = new Moobile.Component(
			'<div>' +
				'<div class="target"></div>' +
			'</div>'
		);

		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponentInside(c3, '.target');

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c3);
		expect(child1.element).toEqual(p.element.childNodes[0].childNodes[0]);

		expect(child2).toEqual(c1);
		expect(child2.element).toEqual(p.element.childNodes[1]);

		expect(child3).toEqual(c2);
		expect(child3.element).toEqual(p.element.childNodes[2]);
	});

	it('should add a child component at the top an element of another child component', function() {

		var p = new Moobile.Component(
			'<div>' +
				'<div class="target"></div>' +
			'</div>'
		);

		var target = p.getElement('.target');

		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponentInside(c2, target, 'top');
		p.addChildComponentInside(c3, target, 'top');

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c3);
		expect(child1.element).toEqual(p.element.childNodes[0].childNodes[0]);

		expect(child2).toEqual(c2);
		expect(child2.element).toEqual(p.element.childNodes[0].childNodes[1]);

		expect(child3).toEqual(c1);
		expect(child3.element).toEqual(p.element.childNodes[1]);
	});

	it('should add a child component at the bottom an element of another child component', function() {

		var p = new Moobile.Component(
			'<div>' +
				'<div class="target"></div>' +
			'</div>'
		);

		var target = p.getElement('.target');

		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponentInside(c2, target, 'bottom');
		p.addChildComponentInside(c3, target, 'bottom');

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c2);
		expect(child1.element).toEqual(p.element.childNodes[0].childNodes[0]);

		expect(child2).toEqual(c3);
		expect(child2.element).toEqual(p.element.childNodes[0].childNodes[1]);

		expect(child3).toEqual(c1);
		expect(child3.element).toEqual(p.element.childNodes[1]);
	});

	// -------------------------------------------------------------------------
	// addChildComponentBefore
	// -------------------------------------------------------------------------

	it('should add a child component before another child component', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponentBefore(c3, c2);

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c1);
		expect(child1.element).toEqual(p.element.childNodes[0]);

		expect(child2).toEqual(c3);
		expect(child2.element).toEqual(p.element.childNodes[1]);

		expect(child3).toEqual(c2);
		expect(child3.element).toEqual(p.element.childNodes[2]);
	});

	// -------------------------------------------------------------------------
	// addChildComponentAfter
	// -------------------------------------------------------------------------

	it('should add a child component after another child component', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponentAfter(c3, c1);

		var child1 = p.getChildComponentAt(0);
		var child2 = p.getChildComponentAt(1);
		var child3 = p.getChildComponentAt(2);

		expect(child1).toEqual(c1);
		expect(child1.element).toEqual(p.element.childNodes[0]);

		expect(child2).toEqual(c3);
		expect(child2.element).toEqual(p.element.childNodes[1]);

		expect(child3).toEqual(c2);
		expect(child3.element).toEqual(p.element.childNodes[2]);
	});

	// -------------------------------------------------------------------------
	// _addChildComponent (Private API Method)
	// -------------------------------------------------------------------------

	it('should remove the child component from its previous parent', function() {

		var p1 = new Moobile.Component();
		var p2 = new Moobile.Component();
		var c  = new Moobile.Component();

		p1.addChildComponent(c);
		p2.addChildComponent(c);

		expect(p1.hasChildComponent(c)).toEqual(false);
		expect(p2.hasChildComponent(c)).toEqual(true);
	});

	it ('should properly set the parent to the child component', function() {

		var p = new Moobile.Component();
		var c = new Moobile.Component();

		p.addChildComponent(c);

		expect(c.getParentComponent()).toEqual(p);
	});

	it('should properly set the window to each child components', function() {

		var w    = new Moobile.Window();
		var p    = new Moobile.Component();
		var c1   = new Moobile.Component();
		var c2   = new Moobile.Component();
		var c1c1 = new Moobile.Component();
		var c1c2 = new Moobile.Component();
		var c2c1 = new Moobile.Component();
		var c2c2 = new Moobile.Component();

		w.addChildComponent(p);

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		c1.addChildComponent(c1c1);
		c1.addChildComponent(c1c2);

		c2.addChildComponent(c2c1);
		c2.addChildComponent(c2c2);

		expect(p.getWindow()).toEqual(w);
		expect(c1.getWindow()).toEqual(w);
		expect(c2.getWindow()).toEqual(w);
		expect(c1c1.getWindow()).toEqual(w);
		expect(c1c2.getWindow()).toEqual(w);
		expect(c2c1.getWindow()).toEqual(w);
		expect(c2c2.getWindow()).toEqual(w);
	});

	/*
	it('should property set the ready state to each child components', function() {

		var w    = new Moobile.Window();
		var p    = new Moobile.Component();
		var c1   = new Moobile.Component();
		var c2   = new Moobile.Component();
		var c1c1 = new Moobile.Component();
		var c1c2 = new Moobile.Component();
		var c2c1 = new Moobile.Component();
		var c2c2 = new Moobile.Component();

		w._setReady(true);

		w.addChildComponent(p);

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		c1.addChildComponent(c1c1);
		c1.addChildComponent(c1c2);

		c2.addChildComponent(c2c1);
		c2.addChildComponent(c2c2);

		expect(p.isReady()).toEqual(true);
		expect(c1.isReady()).toEqual(true);
		expect(c2.isReady()).toEqual(true);
		expect(c1c1.isReady()).toEqual(true);
		expect(c1c2.isReady()).toEqual(true);
		expect(c2c1.isReady()).toEqual(true);
		expect(c2c2.isReady()).toEqual(true);
	});
	*/

	it('should properly map indexes to components', function() {

		var p = new Moobile.Component(
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
		);

		var child1 = p.getChildComponent('b1');
		var child2 = p.getChildComponent('b2');
		var child3 = p.getChildComponent('b3');
		var child4 = p.getChildComponent('b4');
		var child5 = p.getChildComponent('b5');

		expect(p.getChildComponentIndex(child1)).toEqual(0);
		expect(p.getChildComponentIndex(child2)).toEqual(1);
		expect(p.getChildComponentIndex(child3)).toEqual(2);
		expect(p.getChildComponentIndex(child4)).toEqual(3);
		expect(p.getChildComponentIndex(child5)).toEqual(4);
	});

	it('should properly call willAddChildComponent and didAddChildComponent on the parent component', function() {

		var p    = new Moobile.Component();
		var c1   = new Moobile.Component();
		var c2   = new Moobile.Component();

		spyOn(p, 'willAddChildComponent');
		spyOn(p, 'didAddChildComponent');

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		expect(p.willAddChildComponent).toHaveBeenCalledWith(c1);
		expect(p.willAddChildComponent).toHaveBeenCalledWith(c2);
		expect(p.willAddChildComponent.calls.length).toEqual(2);

		expect(p.didAddChildComponent).toHaveBeenCalledWith(c1);
		expect(p.didAddChildComponent).toHaveBeenCalledWith(c2);
		expect(p.didAddChildComponent.calls.length).toEqual(2);
	});

	it('should properly call willRemoveChildComponent and didRemoveChildComponent on the parent component', function() {

		var p    = new Moobile.Component();
		var c1   = new Moobile.Component();
		var c2   = new Moobile.Component();

		spyOn(p, 'willRemoveChildComponent');
		spyOn(p, 'didRemoveChildComponent');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.removeChildComponent(c1);
		p.removeChildComponent(c2);

		expect(p.willRemoveChildComponent).toHaveBeenCalledWith(c1);
		expect(p.willRemoveChildComponent).toHaveBeenCalledWith(c2);
		expect(p.willRemoveChildComponent.calls.length).toEqual(2);

		expect(p.didRemoveChildComponent).toHaveBeenCalledWith(c1);
		expect(p.didRemoveChildComponent).toHaveBeenCalledWith(c2);
		expect(p.didRemoveChildComponent.calls.length).toEqual(2);
	});

	it('should properly call parentWillChange and parentDidChange on the child component', function() {

		var p    = new Moobile.Component();
		var c1   = new Moobile.Component();
		var c2   = new Moobile.Component();

		spyOn(c1, 'parentComponentWillChange');
		spyOn(c1, 'parentComponentDidChange');
		spyOn(c2, 'parentComponentWillChange');
		spyOn(c2, 'parentComponentDidChange');

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		expect(c1.parentComponentWillChange).toHaveBeenCalledWith(p);
		expect(c1.parentComponentDidChange).toHaveBeenCalledWith(p);

		expect(c2.parentComponentWillChange).toHaveBeenCalledWith(p);
		expect(c2.parentComponentDidChange).toHaveBeenCalledWith(p);

		p.removeChildComponent(c1);
		p.removeChildComponent(c2);

		expect(c1.parentComponentWillChange).toHaveBeenCalledWith(null);
		expect(c1.parentComponentDidChange).toHaveBeenCalledWith(null);

		expect(c2.parentComponentWillChange).toHaveBeenCalledWith(null);
		expect(c2.parentComponentDidChange).toHaveBeenCalledWith(null);
	});
	/*
	it('should properly call didBecomeReady on each child components', function() {

		var w    = new Moobile.Window();
		var p    = new Moobile.Component();
		var c1   = new Moobile.Component();
		var c2   = new Moobile.Component();
		var c1c1 = new Moobile.Component();
		var c1c2 = new Moobile.Component();
		var c2c1 = new Moobile.Component();
		var c2c2 = new Moobile.Component();

		spyOn(p, 'didBecomeReady');
		spyOn(c1, 'didBecomeReady');
		spyOn(c2, 'didBecomeReady');
		spyOn(c1c1, 'didBecomeReady');
		spyOn(c1c2, 'didBecomeReady');
		spyOn(c2c1, 'didBecomeReady');
		spyOn(c2c2, 'didBecomeReady');

		w._setReady(true);

		w.addChildComponent(p);

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		c1.addChildComponent(c1c1);
		c1.addChildComponent(c1c2);

		c2.addChildComponent(c2c1);
		c2.addChildComponent(c2c2);

		expect(p.didBecomeReady).toHaveBeenCalled();
		expect(c1.didBecomeReady).toHaveBeenCalled();
		expect(c2.didBecomeReady).toHaveBeenCalled();
		expect(c1c1.didBecomeReady).toHaveBeenCalled();
		expect(c1c2.didBecomeReady).toHaveBeenCalled();
		expect(c2c1.didBecomeReady).toHaveBeenCalled();
		expect(c2c2.didBecomeReady).toHaveBeenCalled();
	});
	*/

	it('should properly call didUpdateLayout once', function() {

	});

	// -------------------------------------------------------------------------
	// addChildComponents
	// -------------------------------------------------------------------------

	// TODO

	// -------------------------------------------------------------------------
	// addChildComponentsInside
	// -------------------------------------------------------------------------

	// TODO

	// -------------------------------------------------------------------------
	// addChildComponentsAfter
	// -------------------------------------------------------------------------

	// TODO

	// -------------------------------------------------------------------------
	// addChildComponentsBefore
	// -------------------------------------------------------------------------

	// TODO

	// -------------------------------------------------------------------------
	// _addChildComponents
	// -------------------------------------------------------------------------

	// TODO

	// -------------------------------------------------------------------------
	// _inject
	// -------------------------------------------------------------------------

	// TODO

	// -------------------------------------------------------------------------
	// _insert
	// -------------------------------------------------------------------------

	// TODO

	// -------------------------------------------------------------------------
	// getChildComponent
	// -------------------------------------------------------------------------

	it('should find a child using its name', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'me');
		var c2 = new Moobile.Component(null, null, 'not-me');
		var c3 = new Moobile.Component(null, null, 'not-me-either');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		expect(p.getChildComponent('me')).toEqual(c1);
	});

	// -------------------------------------------------------------------------
	// getChildComponentOfType
	// -------------------------------------------------------------------------

	it('should find a child of a given type using its name', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'me');
		var c2 = new ComponentOne(null, null, 'me');
		var c3 = new ComponentTwo(null, null, 'me');

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		expect(p.getChildComponentOfType(ComponentOne, 'me')).toEqual(c2);
	});

	// -------------------------------------------------------------------------
	// getChildComponentAt
	// -------------------------------------------------------------------------

	it('should find a child using its index', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		expect(p.getChildComponentAt(0)).toEqual(c1);
		expect(p.getChildComponentAt(1)).toEqual(c2);
		expect(p.getChildComponentAt(2)).toEqual(c3);
		expect(p.getChildComponentAt(9)).toEqual(null);
	});

	// -------------------------------------------------------------------------
	// getChildComponentByTypeAt
	// -------------------------------------------------------------------------

	it('should find a child of a given type using its index', function() {

		var Missing = new Class({
			Extends: Moobile.Component
		});

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new ComponentOne();
		var c3 = new ComponentTwo();

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		expect(p.getChildComponentOfTypeAt(ComponentTwo, 0)).toEqual(c3);
		expect(p.getChildComponentOfTypeAt(ComponentTwo, 9)).toEqual(null);

		expect(p.getChildComponentOfTypeAt(Missing, 0)).toEqual(null);
	});

	// -------------------------------------------------------------------------
	// getChildComponentIndex
	// -------------------------------------------------------------------------

	it('should find the index of a child', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		var missing = new Moobile.Component();

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		expect(p.getChildComponentIndex(c1)).toEqual(0);
		expect(p.getChildComponentIndex(c2)).toEqual(1);
		expect(p.getChildComponentIndex(c3)).toEqual(2);

		expect(p.getChildComponentIndex(missing)).toEqual(-1);
	});

	// -------------------------------------------------------------------------
	// getChildComponents
	// -------------------------------------------------------------------------

	it('should return all children', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		var children = p.getChildComponents();

		expect(children[0]).toEqual(c1);
		expect(children[1]).toEqual(c2);
		expect(children[2]).toEqual(c3);
	});

	// -------------------------------------------------------------------------
	// getChildComponentsOfType
	// -------------------------------------------------------------------------

	it('should return all children of a given type', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new ComponentOne();
		var c3 = new ComponentOne();

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		var children = p.getChildComponentsOfType(ComponentOne);

		expect(children[0]).toEqual(c2);
		expect(children[1]).toEqual(c3);
	});

	// -------------------------------------------------------------------------
	// hasChildComponent
	// -------------------------------------------------------------------------

	it('should know if a child exists', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		expect(p.hasChildComponent(c1)).toEqual(true);
		expect(p.hasChildComponent(c2)).toEqual(true);
		expect(p.hasChildComponent(c3)).toEqual(false);
	});

	// -------------------------------------------------------------------------
	// hasChildComponentByType
	// -------------------------------------------------------------------------

	it('should know if a child of a given type exists', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new ComponentOne();

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		expect(p.hasChildComponentByType(ComponentOne)).toEqual(true);
		expect(p.hasChildComponentByType(ComponentTwo)).toEqual(false);
	});

	// -------------------------------------------------------------------------
	// getComponent
	// -------------------------------------------------------------------------

	it('should find a component within all its descendant using its name', function() {

		var p  = new Moobile.Component();

		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		var c1c1 = new Moobile.Component(null, null, 'c1c1');
		var c1c2 = new Moobile.Component(null, null, 'c1c2');
		var c1c3 = new Moobile.Component(null, null, 'c1c3');

		var c2c1 = new Moobile.Component(null, null, 'c2c1');
		var c2c2 = new Moobile.Component(null, null, 'c2c2');
		var c2c3 = new Moobile.Component(null, null, 'c2c3');

		var c3c1 = new Moobile.Component(null, null, 'c3c1');
		var c3c2 = new Moobile.Component(null, null, 'c3c2');
		var c3c3 = new Moobile.Component(null, null, 'c3c3');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		c1.addChildComponent(c1c1);
		c1.addChildComponent(c1c2);
		c1.addChildComponent(c1c3);

		c2.addChildComponent(c2c1);
		c2.addChildComponent(c2c2);
		c2.addChildComponent(c2c3);

		c3.addChildComponent(c3c1);
		c3.addChildComponent(c3c2);
		c3.addChildComponent(c3c3);

		expect(p.getComponent('c1')).toEqual(c1);
		expect(p.getComponent('c2')).toEqual(c2);
		expect(p.getComponent('c3')).toEqual(c3);
		expect(p.getComponent('c1c1')).toEqual(c1c1);
		expect(p.getComponent('c1c2')).toEqual(c1c2);
		expect(p.getComponent('c1c3')).toEqual(c1c3);
		expect(p.getComponent('c2c1')).toEqual(c2c1);
		expect(p.getComponent('c2c2')).toEqual(c2c2);
		expect(p.getComponent('c2c3')).toEqual(c2c3);
		expect(p.getComponent('c3c1')).toEqual(c3c1);
		expect(p.getComponent('c3c2')).toEqual(c3c2);
		expect(p.getComponent('c3c3')).toEqual(c3c3);
	});

	// -------------------------------------------------------------------------
	// getComponentByType
	// -------------------------------------------------------------------------

	it('should find a component within all its descendant using its type and name', function() {

		var p  = new Moobile.Component();

		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		var c1c1 = new ComponentOne(null, null, 'c1');
		var c1c2 = new ComponentOne(null, null, 'c2');
		var c1c3 = new ComponentOne(null, null, 'c3');

		var c2c1 = new ComponentTwo(null, null, 'c1');
		var c2c2 = new ComponentTwo(null, null, 'c2');
		var c2c3 = new ComponentTwo(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		c1.addChildComponent(c1c1);
		c1.addChildComponent(c1c2);
		c1.addChildComponent(c1c3);

		c2.addChildComponent(c2c1);
		c2.addChildComponent(c2c2);
		c2.addChildComponent(c2c3);

		expect(p.getComponentByType(Moobile.Component, 'c1')).toEqual(c1);
		expect(p.getComponentByType(Moobile.Component, 'c2')).toEqual(c2);
		expect(p.getComponentByType(Moobile.Component, 'c3')).toEqual(c3);
		expect(p.getComponentByType(ComponentOne, 'c1')).toEqual(c1c1);
		expect(p.getComponentByType(ComponentOne, 'c2')).toEqual(c1c2);
		expect(p.getComponentByType(ComponentOne, 'c3')).toEqual(c1c3);
		expect(p.getComponentByType(ComponentTwo, 'c1')).toEqual(c2c1);
		expect(p.getComponentByType(ComponentTwo,'c2')).toEqual(c2c2);
		expect(p.getComponentByType(ComponentTwo,'c3')).toEqual(c2c3);
	});

	// -------------------------------------------------------------------------
	// hasComponentByType
	// -------------------------------------------------------------------------

	it('should know if a component of a given type exists within all descendant component', function() {

		var p  = new Moobile.Component();

		var c1 = new Moobile.Component(null, null, 'c1');
		var c2 = new Moobile.Component(null, null, 'c2');
		var c3 = new Moobile.Component(null, null, 'c3');

		var c1c1 = new ComponentOne(null, null, 'c1');
		var c1c2 = new ComponentOne(null, null, 'c2');
		var c1c3 = new ComponentOne(null, null, 'c3');

		var c2c1 = new ComponentTwo(null, null, 'c1');
		var c2c2 = new ComponentTwo(null, null, 'c2');
		var c2c3 = new ComponentTwo(null, null, 'c3');

		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);

		c1.addChildComponent(c1c1);
		c1.addChildComponent(c1c2);
		c1.addChildComponent(c1c3);

		c2.addChildComponent(c2c1);
		c2.addChildComponent(c2c2);
		c2.addChildComponent(c2c3);

		expect(p.getComponentByType(Moobile.Component, 'c1')).toEqual(c1);
		expect(p.getComponentByType(Moobile.Component, 'c2')).toEqual(c2);
		expect(p.getComponentByType(Moobile.Component, 'c3')).toEqual(c3);
		expect(p.getComponentByType(ComponentOne, 'c1')).toEqual(c1c1);
		expect(p.getComponentByType(ComponentOne, 'c2')).toEqual(c1c2);
		expect(p.getComponentByType(ComponentOne, 'c3')).toEqual(c1c3);
		expect(p.getComponentByType(ComponentTwo, 'c1')).toEqual(c2c1);
		expect(p.getComponentByType(ComponentTwo,'c2')).toEqual(c2c2);
		expect(p.getComponentByType(ComponentTwo,'c3')).toEqual(c2c3);
	});

	// -------------------------------------------------------------------------
	// replaceChildComponent
	// -------------------------------------------------------------------------

	it('should replace a child component with another', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();

		p.addChildComponent(c1);
		p.replaceChildComponent(c1, c2);

		expect(p.getChildComponentAt(0)).toEqual(c2);
	});

	// -------------------------------------------------------------------------
 	// replaceWithComponent
 	// -------------------------------------------------------------------------

	it('should replace itself with another child component', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();

		p.addChildComponent(c1);
		c1.replaceWithComponent(c2);

		expect(p.getChildComponentAt(0)).toEqual(c2);
	});

	// -------------------------------------------------------------------------
	// removeChildComponent
	// -------------------------------------------------------------------------

	it('should remove a child component', function() {

		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();

		p.addChildComponent(c1);
		p.addChildComponent(c2);

		spyOn(p, 'willRemoveChildComponent');
		spyOn(p, 'didRemoveChildComponent');
		spyOn(c1, 'parentComponentWillChange');
		spyOn(c2, 'parentComponentDidChange');

		p.removeChildComponent(c1);

		expect(p.getChildComponentAt(0)).toEqual(null);
		expect(p.willRemoveChildComponent).toHaveBeenCalledWith(c1);
		expect(p.didRemoveChildComponent).toHaveBeenCalledWith(c1);
	});

	// removeAllChildComponents

	it('should remove all children', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.removeAllChildComponents();
		expect(p.getChildComponents().length).toEqual(0);
	});

 	// removeAllChildComponentsOfType

	it('should remove all children of a given type', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.removeAllChildComponentsByType(MyComponent);
		expect(p.getChildComponents().length).toEqual(1);
	});

	// removeFromParentComponent

	it('should remove itself', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		c1.removeFromParentComponent();
		expect(p.getChildComponents().length).toEqual(0);
	});

	// setParentComponent, getParentComponent, hasParentComponent

	it('should set the parent', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		spyOn(c1, 'parentComponentWillChange');
		spyOn(c1, 'parentComponentDidChange');
		c1.setParentComponent(p);
		expect(c1.getParentComponent()).toEqual(p);
		expect(c1.hasParentComponent()).toEqual(true);
		expect(c1.parentComponentWillChange).toHaveBeenCalledWith(p);
		expect(c1.parentComponentDidChange).toHaveBeenCalledWith(p);
	});

	// setWindow, getWindow, hasWindow

	it('should set the window through all child', function() {
		var w  = new Moobile.Window();
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		spyOn(c1, 'windowWillChange');
		spyOn(c1, 'windowDidChange');
		spyOn(c2, 'windowWillChange');
		spyOn(c2, 'windowDidChange');
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.setWindow(w);
		expect(p.getWindow()).toEqual(w);
		expect(p.hasWindow()).toEqual(true);
		expect(c1.getWindow()).toEqual(w);
		expect(c2.getWindow()).toEqual(w);
		expect(c1.windowWillChange).toHaveBeenCalledWith(w);
		expect(c1.windowDidChange).toHaveBeenCalledWith(w);
		expect(c2.windowWillChange).toHaveBeenCalledWith(w);
		expect(c2.windowDidChange).toHaveBeenCalledWith(w);
	});

	// setReady, isReady

	it('should handle the ready flag through all child', function() {
		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();
		spyOn(c1, 'didBecomeReady');
		spyOn(c2, 'didBecomeReady');
		spyOn(c3, 'didBecomeReady');
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);
		w.addChildComponent(c1);
		expect(c1.didBecomeReady).toHaveBeenCalled();
		expect(c2.didBecomeReady).toHaveBeenCalled();
		expect(c3.didBecomeReady).toHaveBeenCalled();
		expect(c1.didBecomeReady.calls.length).toEqual(1);
		expect(c2.didBecomeReady.calls.length).toEqual(1);
		expect(c3.didBecomeReady.calls.length).toEqual(1);
		expect(c1.isReady()).toEqual(true);
		expect(c2.isReady()).toEqual(true);
		expect(c3.isReady()).toEqual(true);
	});

	// getName

	it('should return the name', function() {
		var c = new Moobile.Component(null, null, 'foo');
		expect(c.getName()).toEqual('foo');
	});

	// setStyle, getStyle

	it('should set the style', function() {
		var attached = false;
		var detached = false;
		Moobile.Component.defineStyle('test', null, {
			attach: function() { attached = true; },
			detach: function() { detached = true; }
		});
		var c = new Moobile.Component();
		c.setStyle('test');
		c.setStyle(null);
		expect(attached).toEqual(true);
		expect(detached).toEqual(true);
		c.setStyle('test');
		expect(c.getStyle()).toEqual('test');
	});

	// addClass

	it('should add a CSS class name to the component element', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		expect(c.hasClass('foo')).toEqual(true);
	});

	// removeClass

	it('should remove a CSS class name', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.removeClass('foo');
		expect(c.hasClass('foo')).toEqual(false);
	});

	// toggleClass

	it('should add a CSS class name if not existent', function() {
		var c = new Moobile.Component();
		c.toggleClass('foo');
		expect(c.hasClass('foo')).toEqual(true);
	});

	it('should remove a CSS class name if existent', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.toggleClass('foo');
		expect(c.hasClass('foo')).toEqual(false);
	});

	it('should force add a CSS class name if not existent', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.toggleClass('foo', true);
		expect(c.hasClass('foo')).toEqual(true);
	});

	it('should force remove a CSS class name if existent', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.toggleClass('foo', false);
		expect(c.hasClass('foo')).toEqual(false);
	});

	// hasClass

	it('should indicate whether a CSS class', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		expect(c.hasClass('foo')).toEqual(true);
	});

	// getElement

	it('should return the component element or an element from a selector', function() {
		var c = new Moobile.Component('<div><p></p></div>');
		expect(c.element.get('tag')).toEqual('div');
		expect(c.getElement('p').get('tag')).toEqual('p');
	});

	it('should return the component elements or elements that matches a selector', function() {
		var c = new Moobile.Component('<div><p></p><p></p><div></div></div>');
		expect(c.getElements().length).toEqual(3);
		expect(c.getElements('p').length).toEqual(2);
	});

	// hasElement

	it('should know if an element exists', function() {
		var d = new Element('div');
		var s = new Element('span').inject(d);
		var c = new Moobile.Component(d);
		expect(c.hasElement(s)).toEqual(true);
	});

	// getRoleElement

	it('should return the component elements or elements that matches a selector', function() {
		Moobile.Component.defineRole('test-element', null, null, function(){});
		Moobile.Component.defineRole('test-content', null, null, function(){});
		Moobile.Component.defineRole('test-wrapper', null, {traversable:true}, function(){});
		var CustomComponent = new Class({
			Extends: Moobile.Component,
			willBuild: function() {
				expect(this.getRoleElement('test-element')).toBeNull();
				expect(this.getRoleElement('test-wrapper')).not.toBeNull();
				expect(this.getRoleElement('test-content')).not.toBeNull();
			}
		});
		new CustomComponent(
			'<div>' +
				'<div data-role="test-wrapper">' +
					'<div data-role="test-content">' +
						'<div data-role="test-element"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
	});

	// show, hide

	it('should hide the component and its child components', function() {

		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		w.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);

		w.hide();

		expect(w.isVisible()).toEqual(false);
		expect(c1.isVisible()).toEqual(false);
		expect(c2.isVisible()).toEqual(false);
		expect(c3.isVisible()).toEqual(false);
	});

	it('should show the component and its child components after being hidden', function() {

		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		w.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);

		w.hide();
		w.show();

		expect(w.isVisible()).toEqual(true);
		expect(c1.isVisible()).toEqual(true);
		expect(c2.isVisible()).toEqual(true);
		expect(c3.isVisible()).toEqual(true);
	});

	it('should properly propagate willHide and didHide through all components', function() {

		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		spyOn(w, 'willHide');
		spyOn(w, 'didHide');
		spyOn(c1, 'willHide');
		spyOn(c1, 'didHide');
		spyOn(c2, 'willHide');
		spyOn(c2, 'didHide');
		spyOn(c3, 'willHide');
		spyOn(c3, 'didHide');

		w.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);

		w.hide();

		expect(c1.willHide.calls.length).toEqual(1);
		expect(c1.didHide.calls.length).toEqual(1);
		expect(c2.willHide.calls.length).toEqual(1);
		expect(c2.didHide.calls.length).toEqual(1);
		expect(c3.willHide.calls.length).toEqual(1);
		expect(c3.didHide.calls.length).toEqual(1);
	});

	it('should properly propagate willShow and didShow through all components', function() {

		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		spyOn(w, 'willShow');
		spyOn(w, 'didShow');
		spyOn(c1, 'willShow');
		spyOn(c1, 'didShow');
		spyOn(c2, 'willShow');
		spyOn(c2, 'didShow');
		spyOn(c3, 'willShow');
		spyOn(c3, 'didShow');

		w.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);

		w.hide();
		w.show();

		expect(c1.willShow.calls.length).toEqual(1);
		expect(c1.didShow.calls.length).toEqual(1);
		expect(c2.willShow.calls.length).toEqual(1);
		expect(c2.didShow.calls.length).toEqual(1);
		expect(c3.willShow.calls.length).toEqual(1);
		expect(c3.didShow.calls.length).toEqual(1);
	});

	it('should not re-propagate willHide and didHide through all components when already hidden', function() {

		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		spyOn(w, 'willHide');
		spyOn(w, 'didHide');
		spyOn(c1, 'willHide');
		spyOn(c1, 'didHide');
		spyOn(c2, 'willHide');
		spyOn(c2, 'didHide');
		spyOn(c3, 'willHide');
		spyOn(c3, 'didHide');

		w.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);

		w.hide();
		w.hide();

		expect(c1.willHide.calls.length).toEqual(1);
		expect(c1.didHide.calls.length).toEqual(1);
		expect(c2.willHide.calls.length).toEqual(1);
		expect(c2.didHide.calls.length).toEqual(1);
		expect(c3.willHide.calls.length).toEqual(1);
		expect(c3.didHide.calls.length).toEqual(1);
	});

	it('should not re-propagate willShow and didShow through all components when already shown', function() {

		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		spyOn(w, 'willShow');
		spyOn(w, 'didShow');
		spyOn(c1, 'willShow');
		spyOn(c1, 'didShow');
		spyOn(c2, 'willShow');
		spyOn(c2, 'didShow');
		spyOn(c3, 'willShow');
		spyOn(c3, 'didShow');

		w.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);

		w.hide();
		w.show();
		w.show();

		expect(c1.willShow.calls.length).toEqual(1);
		expect(c1.didShow.calls.length).toEqual(1);
		expect(c2.willShow.calls.length).toEqual(1);
		expect(c2.didShow.calls.length).toEqual(1);
		expect(c3.willShow.calls.length).toEqual(1);
		expect(c3.didShow.calls.length).toEqual(1);
	});

	it('should not show a child that has been hidden when showing the parent', function() {

		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();

		w.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);

		spyOn(w, 'willShow');
		spyOn(w, 'didShow');
		spyOn(c1, 'willShow');
		spyOn(c1, 'didShow');
		spyOn(c2, 'willShow');
		spyOn(c2, 'didShow');
		spyOn(c3, 'willShow');
		spyOn(c3, 'didShow');

		w.hide();
		c3.hide();
		w.show();

		expect(w.isVisible()).toEqual(true);
		expect(c1.isVisible()).toEqual(true);
		expect(c2.isVisible()).toEqual(true);
		expect(c3.isVisible()).toEqual(false);

		expect(c1.willShow.calls.length).toEqual(1);
		expect(c1.didShow.calls.length).toEqual(1);
		expect(c2.willShow.calls.length).toEqual(1);
		expect(c2.didShow.calls.length).toEqual(1);
		expect(c3.willShow.calls.length).toEqual(0);
		expect(c3.didShow.calls.length).toEqual(0);
	});

	// willUpdateLayout, didUpdateLayout

	// it('should call didUpdateLayout once after adding a component', function() {

	// 	var w  = new Moobile.Window();
	// 	var p = new Moobile.Component();
	// 	var c1 = new Moobile.Component();
	// 	var c2 = new Moobile.Component();
	// 	var c3 = new Moobile.Component();

	// 	spyOn(p, 'didUpdateLayout');
	// 	spyOn(c1, 'didUpdateLayout');
	// 	spyOn(c2, 'didUpdateLayout');
	// 	spyOn(c3, 'didUpdateLayout');

	// 	p.addChildComponent(c1);
	// 	p.addChildComponent(c2);
	// 	w.addChildComponent(p);

	// 	expect(p.didUpdateLayout.calls.length).toEqual(1);
	// 	expect(c1.didUpdateLayout.calls.length).toEqual(1);
	// 	expect(c2.didUpdateLayout.calls.length).toEqual(1);

	// 	w.addChildComponent(c3);

	// 	expect(p.didUpdateLayout.calls.length).toEqual(2);
	// 	expect(c1.didUpdateLayout.calls.length).toEqual(2);
	// 	expect(c2.didUpdateLayout.calls.length).toEqual(2);
	// 	expect(c3.didUpdateLayout.calls.length).toEqual(1);

	// });

	// it('should call didUpdateLayout once after replacing a component', function() {

	// 	var w  = new Moobile.Window();
	// 	var p = new Moobile.Component();
	// 	var c1 = new Moobile.Component();
	// 	var c2 = new Moobile.Component();

	// 	w.addChildComponent(p);
	// 	p.addChildComponent(c1);

	// 	spyOn(p, 'didUpdateLayout');
	// 	spyOn(c1, 'didUpdateLayout');
	// 	spyOn(c2, 'didUpdateLayout');

	// 	p.replaceChildComponent(c1, c2);

	// 	expect(p.didUpdateLayout.calls.length).toEqual(1);
	// 	expect(c1.didUpdateLayout.calls.length).toEqual(0);
	// 	expect(c2.didUpdateLayout.calls.length).toEqual(1);
	// });

	// it('should call didUpdateLayout once after adding or removing a class', function() {

	// 	var w  = new Moobile.Window();
	// 	var c = new Moobile.Component();

	// 	w.addChildComponent(c);

	// 	spyOn(c, 'didUpdateLayout');

	// 	c.addClass('test')
	// 	expect(c.didUpdateLayout.calls.length).toEqual(1);

	// 	c.removeClass('test')
	// 	expect(c.didUpdateLayout.calls.length).toEqual(2);

	// 	c.toggleClass('test')
	// 	expect(c.didUpdateLayout.calls.length).toEqual(3);

	// });

	// TODO: Test Size
	// TODO: Test Position

});