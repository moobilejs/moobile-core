describe('Control/Text', function() {

	//--------------------------------------------------------------------------

	it('should set/get the text', function() {
		var text = new Moobile.Text();
		text.setText('foo');
		expect(text.getText()).toEqual('foo');
		text.setText('<b>foo</b>');
		expect(text.getText()).toEqual('<b>foo</b>');
	});

	//--------------------------------------------------------------------------

});