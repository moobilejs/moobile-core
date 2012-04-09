describe('Control/Bar', function() {

	//--------------------------------------------------------------------------

	it('should create a bar item on initialization', function() {
		var bar = new Moobile.Bar();
		expect(bar.getItem() instanceof Moobile.BarItem).toEqual(true);
	});

	//--------------------------------------------------------------------------

	it('should assign, replace and retrieve the bar item', function() {
		var bar = new Moobile.Bar();
		var curItem = bar.getItem();
		var newItem = new Moobile.BarItem();
		spyOn(curItem, 'destroy');
		bar.setItem(newItem);
		expect(curItem.destroy).toHaveBeenCalled();
		expect(bar.getItem()).toEqual(newItem);
	});

	//--------------------------------------------------------------------------

});