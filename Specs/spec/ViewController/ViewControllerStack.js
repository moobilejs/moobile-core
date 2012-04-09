describe('ViewController/ViewControllerStack', function() {

 	//--------------------------------------------------------------------------

	it('should create a view on initialization', function() {
		var viewControllerStack = new Moobile.ViewControllerStack();
		expect(viewControllerStack.getView() instanceof Moobile.ViewStack).toEqual(true);
	});

	//--------------------------------------------------------------------------

	it('should push a view controller', function() {

		var viewControllerStack = new Moobile.ViewControllerStack();
		var viewController      = new Moobile.ViewController();

		viewControllerStack.pushViewController(viewController);

		expect(viewControllerStack.getChildViewControllerAt(0)).toEqual(viewController);
	});

	//--------------------------------------------------------------------------

	it('should pop a view controller', function() {

		var viewControllerStack = new Moobile.ViewControllerStack();
		var viewController1     = new Moobile.ViewController();
		var viewController2     = new Moobile.ViewController();

		viewControllerStack.pushViewController(viewController1);
		viewControllerStack.pushViewController(viewController2);
		viewControllerStack.popViewController();

		expect(viewControllerStack.getTopViewController()).toEqual(viewController1);
	});

	//--------------------------------------------------------------------------

	it('should pop view controllers until a given view controller', function() {

		var viewControllerStack = new Moobile.ViewControllerStack();
		var viewController1     = new Moobile.ViewController();
		var viewController2     = new Moobile.ViewController();
		var viewController3     = new Moobile.ViewController();

		viewControllerStack.pushViewController(viewController1);
		viewControllerStack.pushViewController(viewController2);
		viewControllerStack.pushViewController(viewController3);

		viewControllerStack.popViewControllerUntil(viewController1);

		expect(viewControllerStack.getChildViewControllerAt(0)).toEqual(viewController1);
		expect(viewControllerStack.getChildViewControllerAt(1)).toEqual(null);
		expect(viewControllerStack.getChildViewControllerAt(2)).toEqual(null);
	});

	//--------------------------------------------------------------------------

	it('should retrieve the top view controller', function() {

		var viewControllerStack = new Moobile.ViewControllerStack();
		var viewController1     = new Moobile.ViewController();
		var viewController2     = new Moobile.ViewController();
		var viewController3     = new Moobile.ViewController();

		viewControllerStack.pushViewController(viewController1);
		viewControllerStack.pushViewController(viewController2);
		viewControllerStack.pushViewController(viewController3);

		expect(viewControllerStack.getTopViewController()).toEqual(viewController3);
	});

	//--------------------------------------------------------------------------

	it('should call willPushViewController and didPushViewController upon pushing a view controller', function() {

		var viewControllerStack = new Moobile.ViewControllerStack();
		var viewController      = new Moobile.ViewController();

		spyOn(viewControllerStack, 'willPushViewController');
		spyOn(viewControllerStack, 'didPushViewController');

		viewControllerStack.pushViewController(viewController);

		expect(viewControllerStack.willPushViewController).toHaveBeenCalledWith(viewController);
		expect(viewControllerStack.didPushViewController).toHaveBeenCalledWith(viewController);
	});

	//--------------------------------------------------------------------------

	it('should call willPopViewController and didPopViewController upon popping a view controller', function() {

		var viewControllerStack = new Moobile.ViewControllerStack();
		var viewController1     = new Moobile.ViewController();
		var viewController2     = new Moobile.ViewController();

		spyOn(viewControllerStack, 'willPopViewController');
		spyOn(viewControllerStack, 'didPopViewController');

		viewControllerStack.pushViewController(viewController1);
		viewControllerStack.pushViewController(viewController2);
		viewControllerStack.popViewController();

		expect(viewControllerStack.willPopViewController).toHaveBeenCalledWith(viewController2);
		expect(viewControllerStack.didPopViewController).toHaveBeenCalledWith(viewController2);
	});

	//--------------------------------------------------------------------------

	it('should set the view controller stack to the child view controller recursively upon adding', function() {

		var viewControllerStack = new Moobile.ViewControllerStack();
		var viewController      = new Moobile.ViewController();
		var subViewController1  = new Moobile.ViewController();
		var subViewController2  = new Moobile.ViewController();

		viewController.addChildViewController(subViewController1);
		viewController.addChildViewController(subViewController2);
		viewControllerStack.pushViewController(viewController);

		expect(viewController.getViewControllerStack()).toEqual(viewControllerStack);
		expect(subViewController1.getViewControllerStack()).toEqual(viewControllerStack);
		expect(subViewController2.getViewControllerStack()).toEqual(viewControllerStack);
	});

	//--------------------------------------------------------------------------

});