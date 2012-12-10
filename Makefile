all: build build-compress

build:
	@wrup -r moobile ./ > moobile.js
	@echo "File written to 'moobile.js'"

build-compress:
	@wrup -r elements ./ > moobile.min.js --compress
	@echo "File written to 'moobile.min.js'"

