describe('Window/WindowController', function() {

	//--------------------------------------------------------------------------

	it('should create a window upon initialization', function() {
		var windowController = new Moobile.WindowController();
		expect(windowController.getView() instanceof Moobile.Window).toEqual(true);
	});

	//--------------------------------------------------------------------------

	it('should set the root view controller', function() {

		var windowController = new Moobile.WindowController();
		var viewController   = new Moobile.ViewController();

		windowController.setRootViewController(viewController);

		expect(windowController.getRootViewController()).toEqual(viewController);
	});

	//--------------------------------------------------------------------------

	it('should destroy the current root view controller when setting a new root view controller', function() {

		var windowController = new Moobile.WindowController();
		var viewController1  = new Moobile.ViewController();
		var viewController2  = new Moobile.ViewController();

		spyOn(viewController1, 'destroy');

		windowController.setRootViewController(viewController1);
		windowController.setRootViewController(viewController2);

		expect(viewController1.destroy).toHaveBeenCalled();
	});

	//--------------------------------------------------------------------------

});