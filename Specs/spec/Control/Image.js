describe('Control/Image', function() {

	//--------------------------------------------------------------------------

	it('should set/get the source', function() {
		var image = new Moobile.Image();
		image.setSource('image.gif');
		expect(image.getSource()).toEqual('image.gif');
	});

	//--------------------------------------------------------------------------

});