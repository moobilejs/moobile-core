all: build

build:
	@browserify -s moobile -r ./lib/main.js -o moobile.js
	@echo "File written to 'moobile.js'"

build-compress:
	@browserify -s moobile -g uglifyify -r ./lib/main.js -o moobile.js
	@echo "File written to 'moobile.min.js'"