describe('ViewController/ViewControllerStack', function() {

	// initialize

	it('should create a view on initialization', function() {
		var vs = new Moobile.ViewControllerStack();
		expect(vs.getView() instanceof Moobile.ViewStack).toEqual(true);
	});

	// pushViewController

	it('should push a view controller', function() {
		var vs = new Moobile.ViewControllerStack();
		var vc = new Moobile.ViewController();
		spyOn(vs, 'willPushViewController');
		spyOn(vs, 'didPushViewController');
		vs.pushViewController(vc);
		expect(vs.getChildViewControllerAt(0)).toEqual(vc);
		expect(vs.willPushViewController).toHaveBeenCalledWith(vc);
		expect(vs.didPushViewController).toHaveBeenCalledWith(vc);
	});

	it('should set the view controller stack to the child view controller recursively upon adding', function() {
		var vs = new Moobile.ViewControllerStack();
		var vc = new Moobile.ViewController();
		var subvc1 = new Moobile.ViewController();
		var subvc2 = new Moobile.ViewController();
		vc.addChildViewController(subvc1);
		vc.addChildViewController(subvc2);
		vs.pushViewController(vc);
		expect(vc.getViewControllerStack()).toEqual(vs);
		expect(subvc1.getViewControllerStack()).toEqual(vs);
		expect(subvc2.getViewControllerStack()).toEqual(vs);
	});

	// popViewController

	it('should pop a view controller', function() {
		var vs  = new Moobile.ViewControllerStack();
		var vc1 = new Moobile.ViewController();
		var vc2 = new Moobile.ViewController();
		spyOn(vs, 'willPopViewController');
		spyOn(vs, 'didPopViewController');
		vs.pushViewController(vc1);
		vs.pushViewController(vc2);
		vs.popViewController();
		expect(vs.getTopViewController()).toEqual(vc1);
		expect(vs.willPopViewController).toHaveBeenCalledWith(vc2);
		expect(vs.didPopViewController).toHaveBeenCalledWith(vc2);
	});

	// popViewControllerUntil

	it('should pop view controllers until a given view controller', function() {
		var vs  = new Moobile.ViewControllerStack();
		var vc1 = new Moobile.ViewController();
		var vc2 = new Moobile.ViewController();
		var vc3 = new Moobile.ViewController();
		vs.pushViewController(vc1);
		vs.pushViewController(vc2);
		vs.pushViewController(vc3);
		vs.popViewControllerUntil(vc1);
		expect(vs.getChildViewControllerAt(0)).toEqual(vc1);
		expect(vs.getChildViewControllerAt(1)).toEqual(null);
		expect(vs.getChildViewControllerAt(2)).toEqual(null);
	});

	// getTopViewController

	it('should retrieve the top view controller', function() {
		var vs  = new Moobile.ViewControllerStack();
		var vc1 = new Moobile.ViewController();
		var vc2 = new Moobile.ViewController();
		var vc3 = new Moobile.ViewController();
		vs.pushViewController(vc1);
		vs.pushViewController(vc2);
		vs.pushViewController(vc3);
		expect(vs.getTopViewController()).toEqual(vc3);
	});

});