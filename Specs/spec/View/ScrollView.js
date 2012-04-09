describe('View/ScrollView', function() {

	//--------------------------------------------------------------------------

	it('should create a scroller on initialization', function() {
		var view = new Moobile.ScrollView();
		expect(view.getScroller() instanceof Moobile.Scroller).toEqual(true);
	});

	//--------------------------------------------------------------------------

	it('should create a wrapper element on initialization', function() {
		var view = new Moobile.ScrollView();
		expect(view.getWrapperElement()).not.toBeNull();
	});

	//--------------------------------------------------------------------------

});