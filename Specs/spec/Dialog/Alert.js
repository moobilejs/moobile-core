describe('Dialog/Alert', function() {

	// setTitle, getTitle

	it('should set the title', function() {
		var a = new Moobile.Alert();
		a.setTitle('foo');
		expect(a.getTitle().getText()).toEqual('foo');
	});

	it('should set the title using a Text instance', function() {
		var a = new Moobile.Alert();
		var t = new Moobile.Text().setText('foo');
		a.setTitle(t);
		expect(a.getTitle().getText()).toEqual('foo');
	});

	it('should set an empty title for bad input', function() {
		var a = new Moobile.Alert();
		a.setTitle(null);
		expect(a.getTitle().getText()).toEqual('');
		expect(a.hasClass('alert-label-empty'));
	});

	it('should replace the title', function() {
		var a  = new Moobile.Alert();
		var t1 = new Moobile.Text();
		var t2 = new Moobile.Text();
		spyOn(t1, 'destroy');
		a.setTitle(t1);
		a.setTitle(t2);
		expect(t1.destroy).toHaveBeenCalled();
	});

	// setMessage, getMessage

	it('should set the message', function() {
		var a = new Moobile.Alert();
		a.setMessage('foo');
		expect(a.getMessage().getText()).toEqual('foo');
	});

	it('should set the message using a Text instance', function() {
		var a = new Moobile.Alert();
		var t = new Moobile.Text().setText('foo');
		a.setMessage(t);
		expect(a.getMessage().getText()).toEqual('foo');
	});

	it('should set an empty message for bad input', function() {
		var a = new Moobile.Alert();
		a.setMessage(null);
		expect(a.getMessage().getText()).toEqual('');
		expect(a.hasClass('alert-message-empty'));
	});

	it('should replace the message', function() {
		var a  = new Moobile.Alert();
		var t1 = new Moobile.Text();
		var t2 = new Moobile.Text();
		spyOn(t1, 'destroy');
		a.setMessage(t1);
		a.setMessage(t2);
		expect(t1.destroy).toHaveBeenCalled();
	});

	// addButton

	it('should add a button', function() {
		var a  = new Moobile.Alert();
		spyOn(a, 'willAddChildComponent');
		spyOn(a, 'didAddChildComponent');
		var b1 = new Moobile.Button();
		a.addButton(b1);
		expect(a.getButtons()[0]).toEqual(b1);
		expect(a.willAddChildComponent).toHaveBeenCalledWith(b1);
		expect(a.didAddChildComponent).toHaveBeenCalledWith(b1);
	});

	// addButtonAfter

	it('should add a button after another button', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		a.addButton(b1);
		a.addButtonAfter(b2, b1);
		expect(a.getButtonAt(1)).toEqual(b2);
		expect(a.getButtonAt(1).getElement()).toEqual(b2.getElement());
	});

	// addButtonBefore

	it('should add a button before another button', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		a.addButton(b1);
		a.addButtonBefore(b2, b1);
		expect(a.getButtonAt(0)).toEqual(b2);
		expect(a.getButtonAt(0).getElement()).toEqual(b2.getElement());
	});

	// getButtons

	it('should return all buttons', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		a.addButton(b1);
		a.addButton(b2);
		var children = a.getButtons();
		expect(children[0]).toEqual(b1);
		expect(children[1]).toEqual(b2);
	});

	// getButton

	it('should find a button using its name', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button(null, null, 'me');
		a.addButton(b1);
		expect(a.getButton('me')).toEqual(b1);
	});

	// getButtonAt

	it('should find a button using its index', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		a.addButton(b1);
		expect(a.getButtonAt(0)).toEqual(b1);
	});

	// removeButton

	it('should remove a button', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		spyOn(a, 'willRemoveChildComponent');
		spyOn(a, 'didRemoveChildComponent');
		a.addButton(b1);
		a.removeButton(b1);
		expect(a.getButtonAt(0)).toEqual(null);
		expect(a.willRemoveChildComponent).toHaveBeenCalledWith(b1);
		expect(a.didRemoveChildComponent).toHaveBeenCalledWith(b1);
	});

	// removeAllButtons

	it('should remove all buttons', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		a.addButton(b1);
		a.addButton(b2);
		a.removeAllButtons();
		expect(a.getButtons().length).toEqual(0);
	});

	// setDefaultButton, setDefaultButtonIndex

	it('should set the default button using the button instance', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		var b3 = new Moobile.Button();
		a.addButton(b1);
		a.addButton(b2);
		a.addButton(b3);
		a.setDefaultButton(b1);
		expect(b1.hasClass('is-default')).toEqual(true);
	});

	it('should set the default button using the button index', function() {
		var a  = new Moobile.Alert();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		var b3 = new Moobile.Button();
		a.addButton(b1);
		a.addButton(b2);
		a.addButton(b3);
		a.setDefaultButtonIndex(0);
		expect(b1.hasClass('is-default')).toEqual(true);
	});

});