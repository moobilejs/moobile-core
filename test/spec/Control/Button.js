describe('Control/Button', function() {

	// initialize

	it('should create a label on initialization', function() {
		var b = new Moobile.Button();
		expect(b.getLabel() instanceof Moobile.Text).toEqual(true);
	});

	// setLabel, getLabel

	it('should set the label', function() {
		var b = new Moobile.Button();
		b.setLabel('foo');
		expect(b.getLabel().getText()).toEqual('foo');
	});

	it('should set the label using a Text instance', function() {
		var b = new Moobile.Button();
		var l = new Moobile.Text().setText('foo');
		b.setLabel(l);
		expect(b.getLabel().getText()).toEqual('foo');
	});

	it('should set an empty label for bad input', function() {
		var b = new Moobile.Button();
		b.setLabel(null);
		expect(b.getLabel().getText()).toEqual('');
		expect(b.hasClass('button-label-empty'));
	});

	it('should replace the label', function() {
		var b  = new Moobile.Button();
		var l1 = new Moobile.Text();
		var l2 = new Moobile.Text();
		spyOn(l1, 'destroy');
		b.setLabel(l1);
		b.setLabel(l2);
		expect(l1.destroy).toHaveBeenCalled();
	});

});