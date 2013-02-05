describe('Control/Slider', function() {

	// setMinimum, getMinimum

	it('should set the minimum', function() {
		var s = new Moobile.Slider();
		s.setValue(1);
		s.setMinimum(1);
		expect(s.getMinimum()).toEqual(1);
	});

	it('should set the maximum', function() {
		var s = new Moobile.Slider();
		s.setValue(1);
		s.setMaximum(100);
		expect(s.getMaximum()).toEqual(100);
	});

	it('Should not go below minimum', function() {
		var s = new Moobile.Slider();
		s.setMinimum(1);
		s.setValue(0);
		expect(s.getMinimum()).toEqual(1);
	});

	it('Should not go above maximum', function() {
		var s = new Moobile.Slider();
		s.setMaximum(1);
		s.setValue(2);
		expect(s.getMaximum()).toEqual(1);
	});

});