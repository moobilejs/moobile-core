describe('View/View', function() {

	//--------------------------------------------------------------------------

	it('should create a content element on initialization', function() {
		var view = new Moobile.View();
		expect(view.getContentElement()).not.toBeNull();
	});

	//--------------------------------------------------------------------------

	it('should set the parent view to a child component', function() {

		var view = new Moobile.View();
		var component1 = new Moobile.Component();
		var component2 = new Moobile.Component();

		view.addChildComponent(component1);
		view.addChildComponent(component2);

		expect(component1.getParentView()).toEqual(view);
		expect(component2.getParentView()).toEqual(view);
	});

	//--------------------------------------------------------------------------

	it('should set the parent view to a child component recursively', function() {

		var view = new Moobile.View();
		var component1 = new Moobile.Component();
		var component2 = new Moobile.Component();
		var subComponent1 = new Moobile.Component();
		var subComponent2 = new Moobile.Component();

		component1.addChildComponent(subComponent1);
		component2.addChildComponent(subComponent2);

		view.addChildComponent(component1);
		view.addChildComponent(component2);

		expect(component1.getParentView()).toEqual(view);
		expect(component2.getParentView()).toEqual(view);
		expect(subComponent1.getParentView()).toEqual(view);
		expect(subComponent2.getParentView()).toEqual(view);

		var subView = new Moobile.View();
		var subViewComponent1 = new Moobile.Component();
		var subViewComponent2 = new Moobile.Component();

		subView.addChildComponent(subViewComponent1);
		subView.addChildComponent(subViewComponent2);
		view.addChildComponent(subView);

		expect(subViewComponent1.getParentView()).toEqual(subView);
		expect(subViewComponent2.getParentView()).toEqual(subView);
		expect(subView.getParentView()).toEqual(view);
	});

	//--------------------------------------------------------------------------

	it('should set the parent view to a child recursively but not child inside another child view', function() {

		var view              = new Moobile.View();
		var component1        = new Moobile.Component();
		var component2        = new Moobile.Component();
		var subView           = new Moobile.View();
		var subViewComponent1 = new Moobile.Component();
		var subViewComponent2 = new Moobile.Component();

		view.addChildComponent(component1);
		view.addChildComponent(component2);

		subView.addChildComponent(subViewComponent1);
		subView.addChildComponent(subViewComponent2);

		view.addChildComponent(subView);

		expect(subViewComponent1.getParentView()).toEqual(subView);
		expect(subViewComponent2.getParentView()).toEqual(subView);
		expect(subView.getParentView()).toEqual(view);

	});

	//--------------------------------------------------------------------------

});