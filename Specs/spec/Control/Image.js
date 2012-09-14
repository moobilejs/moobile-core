describe('Control/Image', function() {

	// setSource, getSource

	it('should set the source', function() {
		var i = new Moobile.Image();
		i.setSource('image');
		expect(i.getSource()).toEqual('image');
	});

});