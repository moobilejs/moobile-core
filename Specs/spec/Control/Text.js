describe('Control/Text', function() {

	// setText, getText

	it('should set the text', function() {
		expect(new Moobile.Text().setText('foo').getText()).toEqual('foo');
	});

	it('should set the text using a Text object', function() {
		var t1 = new Moobile.Text();
		var t2 = new Moobile.Text().setText('foo');
		t1.setText(t2);
		expect(t1.getText()).toEqual('foo');
	});

	it('should set the html', function() {
		expect(new Moobile.Text().setText('<b>foo</b>').getText()).toEqual('<b>foo</b>');
	});

});