"use strict"
Browser.platform.cordova = (window.Phonegap || window.Cordova || window.cordova) && Browser.isMobile && !Browser.safari;
