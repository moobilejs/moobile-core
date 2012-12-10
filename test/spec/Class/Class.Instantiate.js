describe('Class/Class.Instantiate', function() {

	window.Test = {
		Foo: {
			Bar: new Class({})
		}
	};

	it('should return the type of a class from a string', function() {
		expect(Class.parse('Test.Foo.Bar')).toEqual(Test.Foo.Bar);
		expect(Class.parse('Test.Foo.Bar.Wat')).toEqual(null);
	});

	it('should instantiate a class from a string', function() {
		expect(Class.instantiate('Test.Foo.Bar') instanceof Test.Foo.Bar).toEqual(true);
	});

});