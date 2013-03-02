"use strict"
Browser.Platform.cordova = (window.Phonegap || window.Cordova || window.cordova) && Browser.isMobile && !Browser.safari
