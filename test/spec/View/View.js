describe('View/View', function() {

	// initialization

	it('should create a content element and a content wrapper on initialization', function() {
		var v = new Moobile.View();
		expect(v.getContentElement()).not.toBeNull();
		expect(v.getContentWrapperElement()).not.toBeNull();
	});

	// getPArentView

	it('should set the parent view to a child component', function() {
		var v  = new Moobile.View();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		v.addChildComponent(c1);
		v.addChildComponent(c1);
		expect(c1.getParentView()).toEqual(v);
		expect(c1.getParentView()).toEqual(v);
	});

	it('should set the parent view to child components', function() {
		var v1 = new Moobile.View();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var v2 = new Moobile.View();
		var c3 = new Moobile.Component();
		var c4 = new Moobile.Component();
		v1.addChildComponent(c1);
		c1.addChildComponent(c2);
		v1.addChildComponent(v2);
		v2.addChildComponent(c3);
		c3.addChildComponent(c4);
		expect(c1.getParentView()).toEqual(v1);
		expect(c2.getParentView()).toEqual(v1);
		expect(c3.getParentView()).toEqual(v2);
		expect(c4.getParentView()).toEqual(v2);
		expect(v2.getParentView()).toEqual(v1);
	});

});