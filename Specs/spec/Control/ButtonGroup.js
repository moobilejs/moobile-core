describe('Control/ButtonGroup', function() {

	//--------------------------------------------------------------------------

	it('should add a button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		g.addButton(b1);
		expect(g.getChildComponents()[0]).toEqual(b1);
	});

	//--------------------------------------------------------------------------

	it('should add a button at the top', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2, 'top');
		expect(g.getButtonAt(0)).toEqual(b2);
		expect(g.getElements('>')[0]).toEqual(b2.getElement());
	});

	//--------------------------------------------------------------------------

	it('should add a button at the bottom', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2, 'bottom');
		expect(g.getButtonAt(1)).toEqual(b2);
		expect(g.getElements('>')[1]).toEqual(b2.getElement());
	});

	//--------------------------------------------------------------------------

	it('should add a button after another button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButtonAfter(b2, b1);
		expect(g.getButtonAt(1)).toEqual(b2);
		expect(g.getElements('>')[1]).toEqual(b2.getElement());
	});

	//--------------------------------------------------------------------------

	it('should add a button before another button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButtonBefore(b2, b1);
		expect(g.getButtonAt(0)).toEqual(b2);
		expect(g.getElements()[0]).toEqual(b2.getElement());
	});

	//--------------------------------------------------------------------------

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

	//--------------------------------------------------------------------------

	it('should find a button using its name', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button(null, null, 'me');
		g.addButton(b1);
		expect(g.getButton('me')).toEqual(b1);
	});

	//--------------------------------------------------------------------------

	it('should find a button using its index', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		g.addButton(b1);
		expect(g.getButtonAt(0)).toEqual(b1);
	});

	//--------------------------------------------------------------------------

	it('should remove a button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		g.addButton(b1);
		g.removeButton(b1);
		expect(g.getButtonAt(0)).toEqual(null);
	});

	//--------------------------------------------------------------------------

	it('should remove all buttons', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		var b2 = new Moobile.Button();
		g.addButton(b1);
		g.addButton(b2);
		g.removeAllButtons();
		expect(g.getButtons().length).toEqual(0);
	});

	//--------------------------------------------------------------------------

	it('should call willAddChildComponent/didAddChildComponent when adding a button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		spyOn(g, 'willAddChildComponent');
		spyOn(g, 'didAddChildComponent');
		g.addButton(b1);
		expect(g.willAddChildComponent).toHaveBeenCalled();
		expect(g.didAddChildComponent).toHaveBeenCalled();
	});

	//--------------------------------------------------------------------------

	it('should call willRemoveChildComponent / didRemoveChildComponent when removing a button', function() {
		var g  = new Moobile.ButtonGroup();
		var b1 = new Moobile.Button();
		spyOn(g, 'willRemoveChildComponent');
		spyOn(g, 'didRemoveChildComponent');
		g.addButton(b1);
		g.removeButton(b1);
		expect(g.willRemoveChildComponent).toHaveBeenCalled();
		expect(g.didRemoveChildComponent).toHaveBeenCalled();
	});

	//--------------------------------------------------------------------------

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

	//--------------------------------------------------------------------------

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

	//--------------------------------------------------------------------------

});