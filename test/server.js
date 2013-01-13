"use strict";

var fs = require('fs')
var qs = require('querystring')
var url = require('url')
var wrapup = require('wrapup')

var app = require('http').createServer(function(req, res){

	var parsed   = url.parse(req.url)
	var pathname = parsed.pathname

	if (pathname == '/test.js' && parsed.search){

		var query = qs.parse(parsed.search.slice(1))
		var wrup = wrapup()

		for (var q in query){
			if (query[q]) wrup.require(q, __dirname + '/../' + query[q])
			else wrup.require(__dirname + '/../' + q)
		}

		res.writeHead(200, {'Content-Type': 'text/javascript'})

		wrup.pipe(res)
		wrup.up(function(err){
			if (err) throw err
		})

	} else {

		var paths = {
			'/mocha.js': __dirname + '/../node_modules/mocha/mocha.js',
			'/mocha.css': __dirname + '/../node_modules/mocha/mocha.css',
			'/mootools-core-1.4.5.js': __dirname + '/../assets/mootools-core-1.4.5.js',
			'/mootools-more-1.4.0.1.js': __dirname + '/../assets/mootools-more-1.4.0.1.js',
			'/': __dirname + '/index.html'
		};

		var file = paths[pathname] || __dirname + pathname

		fs.readFile(file, function(err, data){
			if (err){
				res.writeHead(404)
				res.end()
			} else {

				var contentType = {
					'css': 'text/css',
					'js': 'text/javascript'
				}[pathname.split('.').pop()] || 'text/html'

				res.writeHead(200, {'Content-Type': contentType})
				res.end(String(data))

			}
		})

	}

})

app.listen('8080')
console.log('running the tests on http://localhost:8080')