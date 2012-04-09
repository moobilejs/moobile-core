describe('Control/Button', function() {

	//--------------------------------------------------------------------------

	it('should create a label on initialization', function() {
		var button = new Moobile.Button();
		expect(button.getLabel() instanceof Moobile.Text).toEqual(true);
	});

	//--------------------------------------------------------------------------

	it('should set/get the label created from a string', function() {
		var button = new Moobile.Button();
		button.setLabel('foo');
		expect(button.getLabel().getText()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should set/get the label created from a Moobile.Text instance', function() {
		var button = new Moobile.Button();
		var label = new Moobile.Text().setText('foo');
		button.setLabel(label);
		expect(button.getLabel().getText()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should replace the current label when a new one is assigned', function() {
		var button = new Moobile.Button();
		var label = button.getLabel();
		spyOn(label, 'destroy');
		button.setLabel('foo');
		expect(label.destroy).toHaveBeenCalled();
	});

	//--------------------------------------------------------------------------

});