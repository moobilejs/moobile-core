describe('Control/ListItem', function() {

	// initialize

	it('should create a label, image and detail label on initialization', function() {
		var i = new Moobile.ListItem();
		expect(i.getDetail() instanceof Moobile.Text).toEqual(true);
		expect(i.getLabel() instanceof Moobile.Text).toEqual(true);
		expect(i.getImage() instanceof Moobile.Image).toEqual(true);
	});

	// setLabel, getLabel

	it('should set the label', function() {
		var i = new Moobile.ListItem();
		i.setLabel('foo');
		expect(i.getLabel().getText()).toEqual('foo');
	});

	it('should set the label using a Text instance', function() {
		var i = new Moobile.ListItem();
		var l = new Moobile.Text().setText('foo');
		i.setLabel(l);
		expect(i.getLabel().getText()).toEqual('foo');
	});

	it('should set an empty label for bad input', function() {
		var i = new Moobile.ListItem();
		i.setLabel(null);
		expect(i.getLabel().getText()).toEqual('');
		expect(i.hasClass('list-item-label-empty')).toEqual(true);
	});

	it('should replace the label when setting a new one', function() {
		var i  = new Moobile.ListItem();
		var l1 = new Moobile.Text();
		var l2 = new Moobile.Text();
		spyOn(l1, 'destroy');
		i.setLabel(l1);
		i.setLabel(l2);
		expect(l1.destroy).toHaveBeenCalled();
	});

	// setDetail, getDetail

	it('should set the detail', function() {
		var i = new Moobile.ListItem();
		i.setDetail('foo');
		expect(i.getDetail().getText()).toEqual('foo');
	});

	it('should set the detail using a Text instance', function() {
		var i = new Moobile.ListItem();
		var l = new Moobile.Text().setText('foo');
		i.setDetail(l);
		expect(i.getDetail().getText()).toEqual('foo');
	});

	it('should set an empty detail for bad input', function() {
		var i = new Moobile.ListItem();
		i.setDetail(null);
		expect(i.getLabel().getText()).toEqual('');
		expect(i.hasClass('list-item-detail-empty')).toEqual(true);
	});

	it('should replace the detail when setting a new one', function() {
		var i  = new Moobile.ListItem();
		var d1 = new Moobile.Text();
		var d2 = new Moobile.Text();
		spyOn(d1, 'destroy');
		i.setDetail(d1);
		i.setDetail(d2);
		expect(d1.destroy).toHaveBeenCalled();
	});

	// setImage, getImage

	it('should set the image', function() {
		var i = new Moobile.ListItem();
		i.setImage('foo');
		expect(i.getImage().getSource()).toEqual('foo');
	});

	it('should set the image using an Image instance', function() {
		var i = new Moobile.ListItem();
		var m = new Moobile.Image().setSource('foo');
		i.setImage(m);
		expect(i.getImage().getSource()).toEqual('foo');
	});

	it('should set an image detail for bad input', function() {
		var i = new Moobile.ListItem();
		i.setImage(null);
		expect(i.getImage().getSource()).toEqual('');
		expect(i.hasClass('list-item-image-empty')).toEqual(true);
	});

	it('should replace the image when setting a new one', function() {
		var i  = new Moobile.ListItem();
		var m1 = new Moobile.Image();
		var m2 = new Moobile.Image();
		spyOn(m1, 'destroy');
		i.setImage(m1);
		i.setImage(m2);
		expect(m1.destroy).toHaveBeenCalled();
	});

});