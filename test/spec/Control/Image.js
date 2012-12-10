describe('Control/Image', function() {

	// setSource, getSource

	it('should set the source', function() {
		var i = new Moobile.Image();
		i.setSource('image');
		expect(i.getSource()).toEqual('image');
	});

	it('should set an empty string for bad inputs', function() {
		var i = new Moobile.Image();
		i.setSource(false);
		expect(i.getSource()).toEqual('');
		i.setSource(null);
		expect(i.getSource()).toEqual('');
		i.setSource(false);
		expect(i.getSource()).toEqual('');
		i.setSource(undefined);
		expect(i.getSource()).toEqual('');
		i.setSource(0);
		expect(i.getSource()).toEqual('');
	});

});