
describe('Control/Control', function() {

	// setDisabled, isDisabled

	it('should set its state to disabled', function() {
		var c = new Moobile.Control();
		spyOn(c, 'shouldAllowState').andCallThrough();
		spyOn(c, 'willChangeState');
		spyOn(c, 'didChangeState');
		c.setDisabled();
		expect(c.isDisabled()).toEqual(true);
		c.setDisabled(true);
		expect(c.isDisabled()).toEqual(true);
		c.setDisabled(false);
		expect(c.isDisabled()).toEqual(false);
		expect(c.shouldAllowState).toHaveBeenCalledWith('disabled');
		expect(c.willChangeState).toHaveBeenCalledWith('disabled');
		expect(c.didChangeState).toHaveBeenCalledWith('disabled');
	});

	// setSelected, isSelected

	it('should set its state to selected', function() {
		var c = new Moobile.Control();
		spyOn(c, 'shouldAllowState').andCallThrough();
		spyOn(c, 'willChangeState');
		spyOn(c, 'didChangeState');
		c.setSelected();
		expect(c.isSelected()).toEqual(true);
		c.setSelected(true);
		expect(c.isSelected()).toEqual(true);
		c.setSelected(false);
		expect(c.isSelected()).toEqual(false);
		expect(c.shouldAllowState).toHaveBeenCalledWith('selected');
		expect(c.willChangeState).toHaveBeenCalledWith('selected');
		expect(c.didChangeState).toHaveBeenCalledWith('selected');
	});

	// setHighlighted, isHighlighted

	it('should set its state to highlighted', function() {
		var c = new Moobile.Control();
		spyOn(c, 'shouldAllowState').andCallThrough();
		spyOn(c, 'willChangeState');
		spyOn(c, 'didChangeState');
		c.setHighlighted();
		expect(c.isHighlighted()).toEqual(true);
		c.setHighlighted(true);
		expect(c.isHighlighted()).toEqual(true);
		c.setHighlighted(false);
		expect(c.isHighlighted()).toEqual(false);
		expect(c.shouldAllowState).toHaveBeenCalledWith('highlighted');
		expect(c.willChangeState).toHaveBeenCalledWith('highlighted');
		expect(c.didChangeState).toHaveBeenCalledWith('highlighted');
	});

});