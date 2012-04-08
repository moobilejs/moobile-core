
describe('Component/Component', function() {

	var MyComponent = new Class({
		Extends: Moobile.Component
	});

	it('should create a component with a div element from a string', function() {
		var component = new Moobile.Component('<div></div>');
		expect(component.getElement().get('tag')).toEqual('div');
	});

	it('should create a component with a div element from an element', function() {
		var component = new Moobile.Component(new Element('div'));
		expect(component.getElement().get('tag')).toEqual('div');
	});

	it('should create a component with a div element by default', function() {
		var component = new Moobile.Component();
		expect(component.getElement().get('tag')).toEqual('div');
	});

	it('should read options using the data-attribute', function() {
		var component = new Moobile.Component('<div data-option-style-name="foo"></div>');
		expect(component.options.styleName).toEqual('foo');
	});

	it('should read numeric options using the data-attribute', function() {
		var component = new Moobile.Component('<div data-option-style-name="1"></div>');
		expect(component.options.styleName).toEqual(1);
	});

	it('should add a child', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChild(c1);
		expect(p.getChildren()[0]).toEqual(c1);
	});

	it('should add a child at the top', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChild(c2, 'top');
		expect(p.getChildAt(0)).toEqual(c2);
		expect(p.getElements()[0]).toEqual(c2.getElement());
	});

	it('should add a child at the bottom', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChild(c2, 'bottom');
		expect(p.getChildAt(1)).toEqual(c2);
		expect(p.getElements()[1]).toEqual(c2.getElement());
	});

	it('should add a child inside an element', function() {
		var p  = new Moobile.Component('<div><div class="me"></div>');
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChildInside(c2, '.me');
		expect(c2.getElement().getParent().get('class')).toEqual('me');
	});

	it('should add a child after another component', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChildAfter(c2, c1);
		expect(p.getChildAt(1)).toEqual(c2);
		expect(p.getElements()[1]).toEqual(c2.getElement());
	});

	it('should add a child before another component', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChildBefore(c2, c1);
		expect(p.getChildAt(0)).toEqual(c2);
		expect(p.getElements()[0]).toEqual(c2.getElement());
	});

	it('should find a child using its name', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'me');
		p.addChild(c1);
		expect(p.getChild('me')).toEqual(c1);
	});

	it('should find a child using its index', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChild(c1);
		expect(p.getChildAt(0)).toEqual(c1);
	});

	it('should find a child of a given type using its index', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChild(c1);
		p.addChild(c2);
		expect(p.getChildOfTypeAt(MyComponent, 0)).toEqual(c2);
	});

	it('should find the index of a child', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChild(c1);
		expect(p.getChildIndex(c1)).toEqual(0);
	});

	it('should return all children', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChild(c2);
		var children = p.getChildren();
		expect(children[0]).toEqual(c1);
		expect(children[1]).toEqual(c2);
	});

	it('should return all children of a given type', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new MyComponent();
		p.addChild(c1);
		p.addChild(c2);
		p.addChild(c3);
		var children = p.getChildrenOfType(MyComponent);
		expect(children[0]).toEqual(c3);
	});

	it('should know if a child exists', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChild(c1);
		expect(p.hasChild(c1)).toEqual(true);
	});

	it('should know if a child of a given type exists', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChild(c1);
		p.addChild(c2);
		expect(p.hasChildOfType(MyComponent)).toEqual(true);
	});

	it('should replace a child', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.replaceChild(c1, c2);
		expect(p.getChildAt(0)).toEqual(c2);
	});

	it('should a child be replaced with another', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		c1.replaceWith(c2);
		expect(p.getChildAt(0)).toEqual(c2);
	});

	it('should remove a child', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChild(c1);
		p.removeChild(c1);
		expect(p.getChildAt(0)).toEqual(null);
	});

	it('should remove all children', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChild(c2);
		p.removeChildren();
		expect(p.getChildren().length).toEqual(0);
	});

	it('should remove all children of a given type', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChild(c1);
		p.addChild(c2);
		p.removeChildrenOfType(MyComponent);
		expect(p.getChildren().length).toEqual(1);
	});

	it('should a child remove itself', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChild(c1);
		c1.removeFromParent();
		expect(p.getChildren().length).toEqual(0);
	});

	it('should set/get/has parent', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		c1.setParent(p);
		expect(c1.getParent()).toEqual(p);
		expect(c1.hasParent()).toEqual(true);
	});

	it('should set the window through all child', function() {
		var w = new Moobile.Window();
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChild(c2);
		p.setWindow(w);
		expect(p.getWindow()).toEqual(w);
		expect(p.hasWindow()).toEqual(true);
		expect(c1.getWindow()).toEqual(w);
		expect(c2.getWindow()).toEqual(w);
	});

	it('should set the ready flag through all child', function() {
		var p = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChild(c1);
		p.addChild(c2);
		p.setReady(true);
		expect(p.isReady()).toEqual(true);
		expect(c1.isReady()).toEqual(true);
		expect(c2.isReady()).toEqual(true);
	});

	it('should return the name', function() {
		var component = new Moobile.Component(null, null, 'foo');
		expect(component.getName()).toEqual('foo');
	});

	// TODO: Test Style

	it('should add a CSS class name to the component element', function() {
		var component = new Moobile.Component();
		component.addClass('foo');
		expect(component.getElement().get('class')).toEqual('foo');
	});

	it('should remove a CSS class name to the component element', function() {
		var component = new Moobile.Component();
		component.addClass('foo');
		component.removeClass('foo');
		expect(component.getElement().get('class')).toEqual(null);
	});


	it('should toggle a CSS class name to the component element', function() {
		var component = new Moobile.Component();
		component.toggleClass('foo');
		expect(component.getElement().get('class')).toEqual('foo');
		component.toggleClass('foo');
		expect(component.getElement().get('class')).toEqual(null);
	});

	it('should return the component element or an element from a selector', function() {
		var component = new Moobile.Component('<div><span></span></div>');
		expect(component.getElement().get('tag')).toEqual('div');
		expect(component.getElement('span').get('tag')).toEqual('span');
	});

	it('should return the component elements or elemenst that matches a selector', function() {
		var component = new Moobile.Component('<div><span></span><span></span><p></p></div>');
		expect(component.getElements().length).toEqual(3);
		expect(component.getElements('span').length).toEqual(2);
	});

	it('should know if an element exists', function() {
		var div = new Element('div');
		var span = new Element('span').inject(div);
		var component = new Moobile.Component(div);
		expect(component.hasElement(span)).toEqual(true);
	});

	// TODO: Test Size

	// TODO: Test Position

	// TODO: Test visibility

});