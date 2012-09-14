describe('View/ScrollView', function() {

	// initialization

	it('should create a scroller on initialization', function() {
		var v = new Moobile.ScrollView();
		expect(v.getScroller() instanceof Moobile.Scroller).toEqual(true);
	});

});