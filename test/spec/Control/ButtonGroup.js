describe('Control/ButtonGroup', function() {

	// addButton

	it('should add a button', function() {
		var g  = new Moobile.ButtonGroup();
		spyOn(g, 'willAddChildComponent');
		spyOn(g, 'didAddChildComponent');
		var b1 = new Moobile.Button();
		g.addButton(b1);
		expect(g.getButtons()[0]).toEqual(b1);
		expect(g.willAddChildComponent).toHaveBeenCalledWith(b1);
		expect(g.didAddChildComponent).toHaveBeenCalledWith(b1);
	});

	it('should add a button at the top', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2, 'top');
		expect(g.getButtonAt(0)).toEqual(b2);
		expect(g.getElements('>')[0]).toEqual(b2.getElement());
	});

	it('should add a button at the bottom', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2, 'bottom');
		expect(g.getButtonAt(1)).toEqual(b2);
		expect(g.getElements('>')[1]).toEqual(b2.getElement());
	});

	// addButtonAfter

	it('should add a button after another button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButtonAfter(b2, b1);
		expect(g.getButtonAt(1)).toEqual(b2);
		expect(g.getElements('>')[1]).toEqual(b2.getElement());
	});

	// addButtonBefore

	it('should add a button before another button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButtonBefore(b2, b1);
		expect(g.getButtonAt(0)).toEqual(b2);
		expect(g.getElements()[0]).toEqual(b2.getElement());
	});

	// getButtons

	it('should return all buttons', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2);
		var children = g.getButtons();
		expect(children[0]).toEqual(b1);
		expect(children[1]).toEqual(b2);
	});

	// getButton

	it('should find a button using its name', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button(null, null, 'me');
		g.addButton(b1);
		expect(g.getButton('me')).toEqual(b1);
	});

	// getButtonAt

	it('should find a button using its index', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		g.addButton(b1);
		expect(g.getButtonAt(0)).toEqual(b1);
	});

	// removeButton

	it('should remove a button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		spyOn(g, 'willRemoveChildComponent');
		spyOn(g, 'didRemoveChildComponent');
		g.addButton(b1);
		g.removeButton(b1);
		expect(g.getButtonAt(0)).toEqual(null);
		expect(g.willRemoveChildComponent).toHaveBeenCalledWith(b1);
		expect(g.didRemoveChildComponent).toHaveBeenCalledWith(b1);
	});

	it('should clear the selected button when removed', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		g.addButton(b1);
		g.setSelectedButtonIndex(0);
		g.removeButton(b1);
		expect(g.getSelectedButton()).toEqual(null);
	});

	// removeAllButtons

	it('should remove all buttons', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2);
		g.removeAllButtons();
		expect(g.getButtons().length).toEqual(0);
	});

	// setSelectedButton, getSelectedButton

	it('should select a button using the button instance', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		var b3 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2);
		g.addButton(b3);
		g.setSelectedButton(b1);
		expect(g.getSelectedButton()).toEqual(b1);
	});

	// setSelectedButtonIndex

	it('should select a button using the button index', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		var b3 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2);
		g.addButton(b3);
		g.setSelectedButtonIndex(0);
		expect(g.getSelectedButton()).toEqual(b1);
	});

	// clearSelectedButton

	it('should clear the selected button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		var b3 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2);
		g.addButton(b3);
		g.setSelectedButtonIndex(0);
		g.clearSelectedButton();
		expect(g.getSelectedButton()).toEqual(null);
	});

});