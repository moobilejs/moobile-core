all: build

build:
	@browserify -r ./lib/main.js -s moobile -o moobile.js
	@echo "File written to 'moobile.js'"

.PHONY: