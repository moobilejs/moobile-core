all: build build-compress

build:
	@browserify -s moobile -r ./src/main.js -o moobile.js
	@echo "File written to 'moobile.js'"

build-compress:
	@browserify -s moobile -g uglifyify -r ./src/main.js -o moobile.js
	@echo "File written to 'moobile.min.js'"