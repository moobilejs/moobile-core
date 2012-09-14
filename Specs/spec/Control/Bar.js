describe('Control/Bar', function() {

	it('should create a bar item on initialization', function() {
		var b = new Moobile.Bar();
		expect(b.getItem() instanceof Moobile.BarItem).toEqual(true);
	});

	it('should set the item', function() {
		var b = new Moobile.Bar();
		var i = new Moobile.BarItem();
		b.setItem(i);
		expect(b.getItem()).toEqual(i);
	});

	it('should replace the item when setting a new one', function() {
		var b  = new Moobile.Bar();
		var i1 = new Moobile.BarItem();
		var i2 = new Moobile.BarItem();
		spyOn(i1, 'destroy');
		b.setItem(i1);
		b.setItem(i2);
		expect(i1.destroy).toHaveBeenCalled();
	});

});