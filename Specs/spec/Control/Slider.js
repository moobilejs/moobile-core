describe('Control/Slider', function() {

	// setMinimum, getMinimum

	it('should set the minimum', function() {
		var s = new Moobile.Slider();
		s.setMinimum(100);
		expect(s.getMinimum()).toEqual(100);
	});

	it('should set the maximum', function() {
		var s = new Moobile.Slider();
		s.setMaximum(100);
		expect(s.getMaximum()).toEqual(100);
	});

});