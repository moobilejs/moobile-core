describe('Types/String', function() {

	//--------------------------------------------------------------------------

	it('should transform to camel casing', function() {
		expect('foo bar wat'.toCamelCase()).toEqual('fooBarWat');
		expect('foo-bar-wat'.toCamelCase()).toEqual('fooBarWat');
		expect('foo_bar_wat'.toCamelCase()).toEqual('foo_bar_wat');
	});

	//--------------------------------------------------------------------------

});