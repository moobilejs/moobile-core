describe('Control/ListItem', function() {

	//--------------------------------------------------------------------------

	it('should create a label, image and detail label on initialization', function() {
		var item = new Moobile.ListItem();
		expect(item.getDetail() instanceof Moobile.Text).toEqual(true);
		expect(item.getLabel() instanceof Moobile.Text).toEqual(true);
		expect(item.getImage() instanceof Moobile.Image).toEqual(true);
	});

	//--------------------------------------------------------------------------

	it('should set/get the label created from a string', function() {
		var item = new Moobile.ListItem();
		item.setLabel('foo');
		expect(item.getLabel().getText()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should set/get the label created from a Moobile.Text instance', function() {
		var item = new Moobile.ListItem();
		var label = new Moobile.Text().setText('foo');
		item.setLabel(label);
		expect(item.getLabel().getText()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should replace the current label when a new one is assigned', function() {
		var item = new Moobile.ListItem();
		var label = item.getLabel();
		spyOn(label, 'destroy');
		item.setLabel('foo');
		expect(label.destroy).toHaveBeenCalled();
	});

	//--------------------------------------------------------------------------

	it('should set/get the detail label created from a string', function() {
		var item = new Moobile.ListItem();
		item.setDetail('foo');
		expect(item.getDetail().getText()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should set/get the detail label created from a Moobile.Text instance', function() {
		var item = new Moobile.ListItem();
		var label = new Moobile.Text().setText('foo');
		item.setDetail(label);
		expect(item.getDetail().getText()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should replace the current detail label when a new one is assigned', function() {
		var item = new Moobile.ListItem();
		var detail = item.getDetail();
		spyOn(detail, 'destroy');
		item.setDetail('foo');
		expect(detail.destroy).toHaveBeenCalled();
	});

	//--------------------------------------------------------------------------

	it('should set/get the image created from a string', function() {
		var item = new Moobile.ListItem();
		item.setImage('foo');
		expect(item.getImage().getSource()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should set/get the image created from a Moobile.Image instance', function() {
		var item = new Moobile.ListItem();
		var image = new Moobile.Image().setSource('foo');
		item.setImage(image);
		expect(item.getImage().getSource()).toEqual('foo');
	});

	//--------------------------------------------------------------------------

	it('should replace the current image when a new one is assigned', function() {
		var item = new Moobile.ListItem();
		var image = item.getImage();
		spyOn(image, 'destroy');
		item.setImage('foo');
		expect(image.destroy).toHaveBeenCalled();
	});

	//--------------------------------------------------------------------------

});