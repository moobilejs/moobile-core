describe('Window/WindowController', function() {

	// initialize

	it('should create a window upon initialization', function() {
		var wc = new Moobile.WindowController();
		expect(wc.getView() instanceof Moobile.Window).toEqual(true);
	});

	// setRootViewController

	it('should set the root view controller', function() {
		var wc = new Moobile.WindowController();
		var vc = new Moobile.ViewController();
		wc.setRootViewController(vc);
		expect(wc.getRootViewController()).toEqual(vc);
	});

	it('should destroy the current root view controller when setting a new root view controller', function() {
		var wc  = new Moobile.WindowController();
		var vc1 = new Moobile.ViewController();
		var vc2 = new Moobile.ViewController();
		spyOn(vc1, 'destroy');
		wc.setRootViewController(vc1);
		wc.setRootViewController(vc2);
		expect(vc1.destroy).toHaveBeenCalled();
	});

});