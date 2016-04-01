describe('Control/List', function() {

	// addItem

	it('should add an item', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		spyOn(l, 'willAddChildComponent');
		spyOn(l, 'didAddChildComponent');
		l.addItem(i1);
		expect(l.getItems()[0]).toEqual(i1);
		expect(l.willAddChildComponent).toHaveBeenCalledWith(i1);
		expect(l.didAddChildComponent).toHaveBeenCalledWith(i1);
	});

	it('should add an item at the top', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItem(i2, 'top');
		expect(l.getItemAt(0)).toEqual(i2);
		expect(l.getElements('>')[0]).toEqual(i2.getElement());
	});

	it('should add an item at the bottom', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItem(i2, 'bottom');
		expect(l.getItemAt(1)).toEqual(i2);
		expect(l.getElements('>')[1]).toEqual(i2.getElement());
	});

	// addItemAfter

	it('should add an item after another item', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItemAfter(i2, i1);
		expect(l.getItemAt(1)).toEqual(i2);
		expect(l.getElements('>')[1]).toEqual(i2.getElement());
	});

	// addItemBefore

	it('should add an item before another button', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItemBefore(i2, i1);
		expect(l.getItemAt(0)).toEqual(i2);
		expect(l.getElements()[0]).toEqual(i2.getElement());
	});

	// getItems

	it('should return all items', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItem(i2);
		var children = l.getItems();
		expect(children[0]).toEqual(i1);
		expect(children[1]).toEqual(i2);
	});

	// getItem

	it('should find an item using its name', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem(null, null, 'me');
		l.addItem(i1);
		expect(l.getItem('me')).toEqual(i1);
	});

	// getItemAT

	it('should find an item using its index', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		l.addItem(i1);
		expect(l.getItemAt(0)).toEqual(i1);
	});

	// removeItem

	it('should remove an item', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		spyOn(l, 'willRemoveChildComponent');
		spyOn(l, 'didRemoveChildComponent');
		l.addItem(i1);
		l.removeItem(i1);
		expect(l.getItemAt(0)).toEqual(null);
		expect(l.willRemoveChildComponent).toHaveBeenCalledWith(i1);
		expect(l.didRemoveChildComponent).toHaveBeenCalledWith(i1);
	});

	it('should clear the selected item when removed', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		l.addItem(i1);
		l.setSelectedItemIndex(0);
		l.removeItem(i1);
		expect(l.getSelectedItem()).toEqual(null);
	});

	// removeItems

	it('should remove all items', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		l.addItem(i1);
		l.removeAllItems();
		expect(l.getItems().length).toEqual(0);
	});

	// setSelectedItem, getSelectedItem

	it('should select an item using the item instance', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		var i3 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItem(i2);
		l.addItem(i3);
		l.setSelectedItem(i1);
		expect(l.getSelectedItem()).toEqual(i1);
	});

	// setSelectedItemIndex

	it('should select an item using the item index', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		var i3 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItem(i2);
		l.addItem(i3);
		l.setSelectedItemIndex(0);
		expect(l.getSelectedItem()).toEqual(i1);
	});

	// clearSelectedButton

	it('should clear the selected button', function() {
		var l  = new Moobile.List();
		var i1 = new Moobile.ListItem();
		var i2 = new Moobile.ListItem();
		var i3 = new Moobile.ListItem();
		l.addItem(i1);
		l.addItem(i2);
		l.addItem(i3);
		l.setSelectedItemIndex(0);
		l.clearSelectedItem();
		expect(l.getSelectedItem()).toEqual(null);
	});

});