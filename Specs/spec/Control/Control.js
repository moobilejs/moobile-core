describe('Control/Control', function() {

	var control = null;

	beforeEach(function() {
		control = new Moobile.Control();
//		spyOn(control, 'shouldAllowState');
		spyOn(control, 'willChangeState');
		spyOn(control, 'didChangeState');
	});

	afterEach(function() {
		control = null;
	});

	//--------------------------------------------------------------------------

	it('should set its state to disabled', function() {
		control.setDisabled(true);
		expect(control.isDisabled()).toEqual(true);
//		expect(control.shouldAlloState).toHaveBeenCalledWith('disabled');
		expect(control.willChangeState).toHaveBeenCalledWith('disabled');
		expect(control.didChangeState).toHaveBeenCalledWith('disabled');
	});

	//--------------------------------------------------------------------------

	it('should set its state to selected', function() {
		control.setSelected(true);
		expect(control.isSelected()).toEqual(true);
//		expect(control.shouldAlloState).toHaveBeenCalledWith('disabled');
		expect(control.willChangeState).toHaveBeenCalledWith('selected');
		expect(control.didChangeState).toHaveBeenCalledWith('selected');
	});

	//--------------------------------------------------------------------------

	it('should set its state to highlighted', function() {
		control.setHighlighted(true);
		expect(control.isHighlighted()).toEqual(true);
//		expect(control.shouldAlloState).toHaveBeenCalledWith('disabled');
		expect(control.willChangeState).toHaveBeenCalledWith('highlighted');
		expect(control.didChangeState).toHaveBeenCalledWith('highlighted');
	});

	//--------------------------------------------------------------------------

});