describe('Types/Array', function() {

	var array = ['foo', 'bar', 'wat'];

	//--------------------------------------------------------------------------

	it('should find a item from the array', function() {
		expect(array.find(function(item) {
			return item === 'wat';
		})).toEqual('wat');
	});

	//--------------------------------------------------------------------------

	it('should return an item from the end of the array', function() {
		expect(array.getLastItemAtOffset()).toEqual('wat');
		expect(array.getLastItemAtOffset(0)).toEqual('wat');
		expect(array.getLastItemAtOffset(1)).toEqual('bar');
	});

	//--------------------------------------------------------------------------

});