describe('Component/Component', function() {

	var MyComponent = new Class({
		Extends: Moobile.Component
	});

	it('should create a component with a div element from a string', function() {
		var c = new Moobile.Component('<div></div>');
		expect(c.getElement().get('tag')).toEqual('div');
	});

	it('should create a component with a div element from an element', function() {
		var c = new Moobile.Component(new Element('div'));
		expect(c.getElement().get('tag')).toEqual('div');
	});

	it('should create a component with a div element by default', function() {
		var c = new Moobile.Component();
		expect(c.getElement().get('tag')).toEqual('div');
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

	it('should handler events handler properly', function() {
		var c = new Moobile.Component();
		var f1 = function(){};
		var f2 = function(){};
		var f3 = function(){};
		spyOn(c.element, 'addEvent');
		spyOn(c.element, 'removeEvent');
		c.addEvent('tap', f1);
		c.addEvent('tap', f2);
		c.addEvent('tap', f3);
		c.removeEvent('tap', f1);
		c.removeEvent('tap', f2);
		c.removeEvent('tap', f3);
		expect(c.element.addEvent).toHaveBeenCalled();
		expect(c.element.addEvent.calls.length).toEqual(1);
		expect(c.element.removeEvent).toHaveBeenCalled();
		expect(c.element.removeEvent.calls.length).toEqual(1);
	});

	it('should add a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		expect(p.getChildComponents()[0]).toEqual(c1);
	});

	it('should add a child at the top', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2, 'top');
		expect(p.getChildComponentAt(0)).toEqual(c2);
		expect(p.getElements()[0]).toEqual(c2.getElement());
	});

	it('should add a child at the bottom', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2, 'bottom');
		expect(p.getChildComponentAt(1)).toEqual(c2);
		expect(p.getElements()[1]).toEqual(c2.getElement());
	});

	it('should add a child inside an element', function() {
		var p  = new Moobile.Component('<div><div class="me"></div>');
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponentInside(c2, '.me');
		expect(c2.getElement().getParent().get('class')).toEqual('me');
	});

	it('should add a child after another component', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponentAfter(c2, c1);
		expect(p.getChildComponentAt(1)).toEqual(c2);
		expect(p.getElements()[1]).toEqual(c2.getElement());
	});

	it('should add a child before another component', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponentBefore(c2, c1);
		expect(p.getChildComponentAt(0)).toEqual(c2);
		expect(p.getElements()[0]).toEqual(c2.getElement());
	});

	it('should properly manage component indexes', function() {
		var p = new Moobile.Component(
			'<div>' +
				'<div data-role="button" data-name="b1">B1</div>' +
					'<div>' +
						'<div data-role="button" data-name="b2">B2</div>' +
					'</div>' +
				'<div data-role="button" data-name="b3">B1</div>' +
			'</div>'
		);
		var b1 = p.getChildComponent('b1');
		var b2 = p.getChildComponent('b2');
		var b3 = p.getChildComponent('b3');
		console.log(b1, b2, b3);
		console.log('WAT');
		expect(p.getChildComponentIndex(b1)).toEqual(0);
		expect(p.getChildComponentIndex(b2)).toEqual(1);
		expect(p.getChildComponentIndex(b3)).toEqual(2);
		var b4 = new Moobile.Button();
		p.addChildComponentAfter(b4, b2);
		expect(p.getChildComponentIndex(b1)).toEqual(0);
		expect(p.getChildComponentIndex(b2)).toEqual(1);
		expect(p.getChildComponentIndex(b3)).toEqual(3);
		expect(p.getChildComponentIndex(b4)).toEqual(2);
	});

	it('should find a child using its name', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'me');
		p.addChildComponent(c1);
		expect(p.getChildComponent('me')).toEqual(c1);
	});

	it('should find a child using its index', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		expect(p.getChildComponentAt(0)).toEqual(c1);
	});

	it('should find a child of a given type using its index', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		expect(p.getChildComponentOfTypeAt(MyComponent, 0)).toEqual(c2);
	});

	it('should find the index of a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		expect(p.getChildComponentIndex(c1)).toEqual(0);
	});

	it('should return all children', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		var children = p.getChildComponents();
		expect(children[0]).toEqual(c1);
		expect(children[1]).toEqual(c2);
	});

	it('should return all children of a given type', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);
		var children = p.getChildComponentsOfType(MyComponent);
		expect(children[0]).toEqual(c3);
	});

	it('should know if a child exists', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		expect(p.hasChildComponent(c1)).toEqual(true);
	});

	it('should know if a child of a given type exists', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		expect(p.hasChildComponentOfType(MyComponent)).toEqual(true);
	});

	it('should find a descendant using its name', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component(null, null, 'me');
		p.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);
		expect(p.getDescendantComponent('me')).toEqual(c3);
	});

	it('should replace a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.replaceChildComponent(c1, c2);
		expect(p.getChildComponentAt(0)).toEqual(c2);
	});

	it('should a child be replaced with another', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		c1.replaceWithComponent(c2);
		expect(p.getChildComponentAt(0)).toEqual(c2);
	});

	it('should remove a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		p.removeChildComponent(c1);
		expect(p.getChildComponentAt(0)).toEqual(null);
	});

	it('should remove all children', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.removeAllChildComponents();
		expect(p.getChildComponents().length).toEqual(0);
	});

	it('should remove all children of a given type', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.removeAllChildComponentsOfType(MyComponent);
		expect(p.getChildComponents().length).toEqual(1);
	});

	it('should a child remove itself', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		c1.removeFromParentComponent();
		expect(p.getChildComponents().length).toEqual(0);
	});

	it('should set/get/has parent', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		c1.setParentComponent(p);
		expect(c1.getParentComponent()).toEqual(p);
		expect(c1.hasParentComponent()).toEqual(true);
	});

	it('should set the window through all child', function() {
		var w  = new Moobile.Window();
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.setWindow(w);
		expect(p.getWindow()).toEqual(w);
		expect(p.hasWindow()).toEqual(true);
		expect(c1.getWindow()).toEqual(w);
		expect(c2.getWindow()).toEqual(w);
	});

	it('should set the ready flag through all child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.setReady(true);
		expect(p.isReady()).toEqual(true);
		expect(c1.isReady()).toEqual(true);
		expect(c2.isReady()).toEqual(true);
	});

	it('should return the name', function() {
		var c = new Moobile.Component(null, null, 'foo');
		expect(c.getName()).toEqual('foo');
	});

	it('should add a CSS class name to the component element', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		expect(c.getElement().get('class')).toEqual('foo');
	});

	it('should indicate whether a CSS class name is set for a component', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		expect(c.hasClass('foo')).toEqual(true);
	});

	it('should remove a CSS class name to the component element', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.removeClass('foo');
		expect(c.getElement().get('class')).toEqual(null);
	});

	it('should toggle a CSS class name to the component element', function() {
		var c = new Moobile.Component();
		c.toggleClass('foo');
		expect(c.getElement().get('class')).toEqual('foo');
		c.toggleClass('foo');
		expect(c.getElement().get('class')).toEqual(null);
	});

	it('should return the component element or an element from a selector', function() {
		var c = new Moobile.Component('<div><span></span></div>');
		expect(c.getElement().get('tag')).toEqual('div');
		expect(c.getElement('span').get('tag')).toEqual('span');
	});

	it('should return the component elements or elements that matches a selector', function() {
		var c = new Moobile.Component('<div><span></span><span></span><p></p></div>');
		expect(c.getElements().length).toEqual(3);
		expect(c.getElements('span').length).toEqual(2);
	});

	it('should know if an element exists', function() {
		var d = new Element('div');
		var s = new Element('span').inject(d);
		var c = new Moobile.Component(d);
		expect(c.hasElement(s)).toEqual(true);
	});

	// TODO: Test Style
	// TODO: Test Size
	// TODO: Test Position
	// TODO: Test visibility

});