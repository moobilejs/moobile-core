(function(modules) {
    var cache = {}, require = function(id) {
        var module = cache[id];
        if (!module) {
            module = cache[id] = {};
            var exports = module.exports = {};
            modules[id].call(exports, require, module, exports, window);
        }
        return module.exports;
    };
    window["moobile"] = require("0");
})({
    "0": function(require, module, exports, global) {
        "use strict";
        global.requestAnimationFrame = require("1").request;
        global.cancelAnimationFrame = require("1").cancel;
        require("6");
        require("7");
        require("8");
        require("9");
        require("a");
        require("b");
        require("c");
        require("d");
        require("e");
        require("f");
        require("g");
        require("h");
        require("i");
        require("j");
        require("k");
        require("l");
        require("m");
        require("n");
        require("o");
        require("p");
        require("q");
        require("r");
        require("s");
        require("t");
        require("u");
        require("v");
        require("w");
        require("x");
        require("y");
        require("z");
        require("10");
        require("11");
        require("12");
        require("13");
        require("14");
        require("15");
        require("16");
        require("17");
        require("19");
        require("1a");
        require("1b");
        require("1c");
        require("1d");
        require("1e");
        require("1f");
        require("1g");
        require("1h");
        require("1i");
        require("1j");
        require("1k");
        require("1l");
        require("1m");
        require("1n");
        require("1o");
        require("1p");
        require("1q");
        require("1r");
        require("1s");
        require("1t");
        require("1u");
        require("1v");
        module.exports = global.Moobile = global.moobile;
    },
    "1": function(require, module, exports, global) {
        "use strict";
        var array = require("2");
        var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame || function(callback) {
            return setTimeout(callback, 1e3 / 60);
        };
        var callbacks = [];
        var iterator = function(time) {
            var split = callbacks.splice(0, callbacks.length);
            for (var i = 0, l = split.length; i < l; i++) split[i](time || (time = +(new Date)));
        };
        var cancel = function(callback) {
            var io = array.indexOf(callbacks, callback);
            if (io > -1) callbacks.splice(io, 1);
        };
        var request = function(callback) {
            var i = callbacks.push(callback);
            if (i === 1) requestFrame(iterator);
            return function() {
                cancel(callback);
            };
        };
        exports.request = request;
        exports.cancel = cancel;
    },
    "2": function(require, module, exports, global) {
        "use strict";
        var array = require("3")["array"];
        var names = ("pop,push,reverse,shift,sort,splice,unshift,concat,join,slice,toString,indexOf,lastIndexOf,forEach,every,some" + ",filter,map,reduce,reduceRight").split(",");
        for (var methods = {}, i = 0, name, method; name = names[i++]; ) if (method = Array.prototype[name]) methods[name] = method;
        if (!methods.filter) methods.filter = function(fn, context) {
            var results = [];
            for (var i = 0, l = this.length >>> 0; i < l; i++) if (i in this) {
                var value = this[i];
                if (fn.call(context, value, i, this)) results.push(value);
            }
            return results;
        };
        if (!methods.indexOf) methods.indexOf = function(item, from) {
            for (var l = this.length >>> 0, i = from < 0 ? Math.max(0, l + from) : from || 0; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };
        if (!methods.map) methods.map = function(fn, context) {
            var length = this.length >>> 0, results = Array(length);
            for (var i = 0, l = length; i < l; i++) {
                if (i in this) results[i] = fn.call(context, this[i], i, this);
            }
            return results;
        };
        if (!methods.every) methods.every = function(fn, context) {
            for (var i = 0, l = this.length >>> 0; i < l; i++) {
                if (i in this && !fn.call(context, this[i], i, this)) return false;
            }
            return true;
        };
        if (!methods.some) methods.some = function(fn, context) {
            for (var i = 0, l = this.length >>> 0; i < l; i++) {
                if (i in this && fn.call(context, this[i], i, this)) return true;
            }
            return false;
        };
        if (!methods.forEach) methods.forEach = function(fn, context) {
            for (var i = 0, l = this.length >>> 0; i < l; i++) {
                if (i in this) fn.call(context, this[i], i, this);
            }
        };
        var toString = Object.prototype.toString;
        array.isArray = Array.isArray || function(self) {
            return toString.call(self) === "[object Array]";
        };
        module.exports = array.implement(methods);
    },
    "3": function(require, module, exports, global) {
        "use strict";
        var prime = require("4"), type = require("5");
        var slice = Array.prototype.slice;
        var ghost = prime({
            constructor: function ghost(self) {
                this.valueOf = function() {
                    return self;
                };
                this.toString = function() {
                    return self + "";
                };
                this.is = function(object) {
                    return self === object;
                };
            }
        });
        var shell = function(self) {
            if (self == null || self instanceof ghost) return self;
            var g = shell[type(self)];
            return g ? new g(self) : self;
        };
        var register = function() {
            var g = prime({
                inherits: ghost
            });
            return prime({
                constructor: function(self) {
                    return new g(self);
                },
                define: function(key, descriptor) {
                    var method = descriptor.value;
                    this[key] = function(self) {
                        return arguments.length > 1 ? method.apply(self, slice.call(arguments, 1)) : method.call(self);
                    };
                    g.prototype[key] = function() {
                        return shell(method.apply(this.valueOf(), arguments));
                    };
                    prime.define(this.prototype, key, descriptor);
                    return this;
                }
            });
        };
        for (var types = "string,number,array,object,date,function,regexp".split(","), i = types.length; i--; ) shell[types[i]] = register();
        module.exports = shell;
    },
    "4": function(require, module, exports, global) {
        "use strict";
        var has = function(self, key) {
            return Object.hasOwnProperty.call(self, key);
        };
        var each = function(object, method, context) {
            for (var key in object) if (method.call(context, object[key], key, object) === false) break;
            return object;
        };
        if (!{
            valueOf: 0
        }.propertyIsEnumerable("valueOf")) {
            var buggy = "constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(",");
            var proto = Object.prototype;
            each = function(object, method, context) {
                for (var key in object) if (method.call(context, object[key], key, object) === false) return object;
                for (var i = 0; key = buggy[i]; i++) {
                    var value = object[key];
                    if ((value !== proto[key] || has(object, key)) && method.call(context, value, key, object) === false) break;
                }
                return object;
            };
        }
        var create = Object.create || function(self) {
            var constructor = function() {};
            constructor.prototype = self;
            return new constructor;
        };
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        var define = Object.defineProperty;
        try {
            var obj = {
                a: 1
            };
            getOwnPropertyDescriptor(obj, "a");
            define(obj, "a", {
                value: 2
            });
        } catch (e) {
            getOwnPropertyDescriptor = function(object, key) {
                return {
                    value: object[key]
                };
            };
            define = function(object, key, descriptor) {
                object[key] = descriptor.value;
                return object;
            };
        }
        var implement = function(proto) {
            each(proto, function(value, key) {
                if (key !== "constructor" && key !== "define" && key !== "inherits") this.define(key, getOwnPropertyDescriptor(proto, key) || {
                    writable: true,
                    enumerable: true,
                    configurable: true,
                    value: value
                });
            }, this);
            return this;
        };
        var prime = function(proto) {
            var superprime = proto.inherits;
            var constructor = has(proto, "constructor") ? proto.constructor : superprime ? function() {
                return superprime.apply(this, arguments);
            } : function() {};
            if (superprime) {
                var superproto = superprime.prototype;
                var cproto = constructor.prototype = create(superproto);
                constructor.parent = superproto;
                cproto.constructor = constructor;
            }
            constructor.define = proto.define || superprime && superprime.define || function(key, descriptor) {
                define(this.prototype, key, descriptor);
                return this;
            };
            constructor.implement = implement;
            return constructor.implement(proto);
        };
        prime.has = has;
        prime.each = each;
        prime.create = create;
        prime.define = define;
        module.exports = prime;
    },
    "5": function(require, module, exports, global) {
        "use strict";
        var toString = Object.prototype.toString, types = /number|object|array|string|function|date|regexp|boolean/;
        var type = function(object) {
            if (object == null) return "null";
            var string = toString.call(object).slice(8, -1).toLowerCase();
            if (string === "number" && isNaN(object)) return "null";
            if (types.test(string)) return string;
            return "object";
        };
        module.exports = type;
    },
    "6": function(require, module, exports, global) {
        Class.Binds = new Class({
            $bound: {},
            bound: function(name) {
                return this.$bound[name] ? this.$bound[name] : this.$bound[name] = this[name].bind(this);
            }
        });
    },
    "7": function(require, module, exports, global) {
        (function() {
            [ Element, Window, Document ].invoke("implement", {
                hasEvent: function(event) {
                    var events = this.retrieve("events"), list = events && events[event] ? events[event].values : null;
                    if (list) {
                        for (var i = list.length; i--; ) if (i in list) {
                            return true;
                        }
                    }
                    return false;
                }
            });
            var wrap = function(custom, method, extended, name) {
                method = custom[method];
                extended = custom[extended];
                return function(fn, customName) {
                    if (!customName) customName = name;
                    if (extended && !this.hasEvent(customName)) extended.call(this, fn, customName);
                    if (method) method.call(this, fn, customName);
                };
            };
            var inherit = function(custom, base, method, name) {
                return function(fn, customName) {
                    base[method].call(this, fn, customName || name);
                    custom[method].call(this, fn, customName || name);
                };
            };
            var events = Element.Events;
            Element.defineCustomEvent = function(name, custom) {
                var base = events[custom.base];
                custom.onAdd = wrap(custom, "onAdd", "onSetup", name);
                custom.onRemove = wrap(custom, "onRemove", "onTeardown", name);
                events[name] = base ? Object.append({}, custom, {
                    base: base.base,
                    condition: function(event) {
                        return (!base.condition || base.condition.call(this, event)) && (!custom.condition || custom.condition.call(this, event));
                    },
                    onAdd: inherit(custom, base, "onAdd", name),
                    onRemove: inherit(custom, base, "onRemove", name)
                }) : custom;
                return this;
            };
            var loop = function(name) {
                var method = "on" + name.capitalize();
                Element[name + "CustomEvents"] = function() {
                    Object.each(events, function(event, name) {
                        if (event[method]) event[method].call(event, name);
                    });
                };
                return loop;
            };
            loop("enable")("disable");
        })();
    },
    "8": function(require, module, exports, global) {
        Browser.Features.Touch = function() {
            try {
                document.createEvent("TouchEvent").initTouchEvent("touchstart");
                return true;
            } catch (exception) {}
            return false;
        }();
        Browser.Features.iOSTouch = function() {
            var name = "cantouch", html = document.html, hasTouch = false;
            if (!html.addEventListener) return false;
            var handler = function() {
                html.removeEventListener(name, handler, true);
                hasTouch = true;
            };
            try {
                html.addEventListener(name, handler, true);
                var event = document.createEvent("TouchEvent");
                event.initTouchEvent(name);
                html.dispatchEvent(event);
                return hasTouch;
            } catch (exception) {}
            handler();
            return false;
        }();
    },
    "9": function(require, module, exports, global) {
        (function() {
            Browser.Device = {
                name: "other"
            };
            if (Browser.Platform.ios) {
                var device = navigator.userAgent.toLowerCase().match(/(ip(ad|od|hone))/)[0];
                Browser.Device[device] = true;
                Browser.Device.name = device;
            }
            if (this.devicePixelRatio == 2) Browser.hasHighResolution = true;
            Browser.isMobile = ![ "mac", "linux", "win" ].contains(Browser.Platform.name);
        }).call(this);
    },
    a: function(require, module, exports, global) {
        if (Browser.Features.Touch) (function() {
            var name = "pinch", thresholdKey = name + ":threshold", disabled, active;
            var events = {
                touchstart: function(event) {
                    if (event.targetTouches.length == 2) active = true;
                },
                touchmove: function(event) {
                    if (disabled || !active) return;
                    event.preventDefault();
                    var threshold = this.retrieve(thresholdKey, .5);
                    if (event.scale < 1 + threshold && event.scale > 1 - threshold) return;
                    active = false;
                    event.pinch = event.scale > 1 ? "in" : "out";
                    this.fireEvent(name, event);
                }
            };
            Element.defineCustomEvent(name, {
                onSetup: function() {
                    this.addEvents(events);
                },
                onTeardown: function() {
                    this.removeEvents(events);
                },
                onEnable: function() {
                    disabled = false;
                },
                onDisable: function() {
                    disabled = true;
                }
            });
        })();
    },
    b: function(require, module, exports, global) {
        (function() {
            var name = "swipe", distanceKey = name + ":distance", cancelKey = name + ":cancelVertical", dflt = 50;
            var start = {}, disabled, active;
            var clean = function() {
                active = false;
            };
            var events = {
                touchstart: function(event) {
                    if (event.touches.length > 1) return;
                    var touch = event.touches[0];
                    active = true;
                    start = {
                        x: touch.pageX,
                        y: touch.pageY
                    };
                },
                touchmove: function(event) {
                    if (disabled || !active) return;
                    var touch = event.changedTouches[0], end = {
                        x: touch.pageX,
                        y: touch.pageY
                    };
                    if (this.retrieve(cancelKey) && Math.abs(start.y - end.y) > 10) {
                        active = false;
                        return;
                    }
                    var distance = this.retrieve(distanceKey, dflt), delta = end.x - start.x, isLeftSwipe = delta < -distance, isRightSwipe = delta > distance;
                    if (!isRightSwipe && !isLeftSwipe) return;
                    event.preventDefault();
                    active = false;
                    event.direction = isLeftSwipe ? "left" : "right";
                    event.start = start;
                    event.end = end;
                    this.fireEvent(name, event);
                },
                touchend: clean,
                touchcancel: clean
            };
            Element.defineCustomEvent(name, {
                onSetup: function() {
                    this.addEvents(events);
                },
                onTeardown: function() {
                    this.removeEvents(events);
                },
                onEnable: function() {
                    disabled = false;
                },
                onDisable: function() {
                    disabled = true;
                    clean();
                }
            });
        })();
    },
    c: function(require, module, exports, global) {
        "use strict";
        Browser.Platform.cordova = (window.Phonegap || window.Cordova || window.cordova) && Browser.isMobile && !Browser.safari;
    },
    d: function(require, module, exports, global) {
        "use strict";
        Class.parse = function(name) {
            name = name.trim();
            name = name.split(".");
            var func = window;
            for (var i = 0; i < name.length; i++) if (func[name[i]]) func = func[name[i]]; else return null;
            return typeof func === "function" ? func : null;
        }, Class.instantiate = function(klass) {
            if (typeof klass === "string") klass = Class.parse(klass);
            if (klass === null) return null;
            klass.$prototyping = true;
            var instance = new klass;
            delete klass.$prototyping;
            var params = Array.prototype.slice.call(arguments, 1);
            if (instance.initialize) instance.initialize.apply(instance, params);
            return instance;
        };
    },
    e: function(require, module, exports, global) {
        "use strict";
        var setStyle = Element.prototype.setStyle;
        var getStyle = Element.prototype.getStyle;
        var vendors = [ "Khtml", "O", "Ms", "Moz", "Webkit" ];
        var prefixes = {};
        var prefix = function(property) {
            property = property.camelCase();
            if (property in this.style) return property;
            if (prefixes[property] !== undefined) return prefixes[property];
            var suffix = property.charAt(0).toUpperCase() + property.slice(1);
            for (var i = 0; i < vendors.length; i++) {
                var prefixed = vendors[i] + suffix;
                if (prefixed in this.style) {
                    prefixes[property] = prefixed;
                    break;
                }
            }
            if (prefixes[property] === undefined) prefixes[property] = property;
            return prefixes[property];
        };
        Element.implement({
            setRole: function(role) {
                return this.set("data-role", role);
            },
            getRole: function(role) {
                return this.get("data-role");
            },
            setStyle: function(property, value) {
                return setStyle.call(this, prefix.call(this, property), value);
            },
            getStyle: function(property) {
                return getStyle.call(this, prefix.call(this, property));
            },
            ingest: function(element) {
                return this.adopt(document.id(element).childNodes);
            }
        });
        var cache = {};
        Element.from = function(text) {
            switch (typeof text) {
              case "object":
                return document.id(text);
              case "string":
                var element = document.createElement("div");
                element.innerHTML = text;
                return element.childNodes[0] || null;
            }
            return null;
        };
        Element.at = function(path, callback) {
            var dispatch = function(element) {
                if (callback) callback(element);
            };
            var element = cache[path] || null;
            if (element) {
                element = element.clone(true, true);
                dispatch(element);
                return element;
            }
            var onSuccess = function(response) {
                dispatch(element = cache[path] = Element.from(response));
            };
            var onFailure = function() {
                dispatch(null);
            };
            var async = typeof callback === "function";
            (new Request({
                url: path,
                async: async,
                method: "get",
                onSuccess: onSuccess,
                onFailure: onFailure
            })).send();
            return element;
        };
    },
    f: function(require, module, exports, global) {
        "use strict";
        Request.prototype.options.isSuccess = function() {
            var status = this.status;
            return status === 0 || status >= 200 && status < 300;
        };
    },
    g: function(require, module, exports, global) {
        "use strict";
        Array.implement({
            find: function(fn) {
                for (var i = 0; i < this.length; i++) {
                    var found = fn.call(this, this[i]);
                    if (found === true) {
                        return this[i];
                    }
                }
                return null;
            },
            getLastItemAtOffset: function(offset) {
                offset = offset ? offset : 0;
                return this[this.length - 1 - offset] ? this[this.length - 1 - offset] : null;
            }
        });
    },
    h: function(require, module, exports, global) {
        "use strict";
        String.implement({
            toCamelCase: function() {
                return this.camelCase().replace("-", "").replace(/\s\D/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
            }
        });
    },
    i: function(require, module, exports, global) {
        "use strict";
        var moobile = global.moobile = global.Moobile = {
            version: "0.3.0-dev"
        };
    },
    j: function(require, module, exports, global) {
        "use strict";
        var fireEvent = Events.prototype.fireEvent;
        var Emitter = moobile.Emitter = new Class({
            Implements: [ Events, Options, Class.Binds ],
            on: function() {
                return this.addEvent.apply(this, arguments);
            },
            off: function() {
                return this.removeEvent.apply(this, arguments);
            },
            emit: function() {
                return this.fireEvent.apply(this, arguments);
            },
            fireEvent: function(type, args, delay) {
                args = Array.from(args).include(this);
                if (!this.shouldFireEvent(type, args)) return this;
                this.willFireEvent(type, args);
                fireEvent.call(this, type, args, delay);
                this.didFireEvent(type, args);
                return this;
            },
            shouldFireEvent: function(type, args) {
                return true;
            },
            willFireEvent: function(type, args) {},
            didFireEvent: function(type, args) {}
        });
    },
    k: function(require, module, exports, global) {
        "use strict";
        var onReady = function() {
            window.fireEvent("ready");
        };
        Element.defineCustomEvent("ready", {
            onSetup: function() {
                if (Browser.Platform.cordova) {
                    document.addEventListener("deviceready", onReady);
                    return;
                }
                window.addEvent("domready", onReady);
            },
            onTeardown: function() {
                if (Browser.Platform.cordova) {
                    document.removeEventListener("deviceready", onReady);
                    return;
                }
                window.removeEvent("domready", onReady);
            }
        });
        window.addEvent("ready", function() {
            if (parent && parent.fireEvent) {
                parent.fireEvent("appready");
            }
        });
    },
    l: function(require, module, exports, global) {
        (function() {
            var prefix = "";
            if (Browser.safari || Browser.chrome || Browser.Platform.ios) {
                prefix = "webkit";
            } else if (Browser.firefox) {
                prefix = "Moz";
            } else if (Browser.opera) {
                prefix = "o";
            } else if (Browser.ie) {
                prefix = "ms";
            }
            Element.NativeEvents[prefix + "TransitionEnd"] = 2;
            Element.Events["transitionend"] = {
                base: prefix + "TransitionEnd",
                onAdd: function() {},
                onRemove: function() {}
            };
            Element.NativeEvents[prefix + "AnimationEnd"] = 2;
            Element.Events["animationend"] = {
                base: prefix + "AnimationEnd",
                onAdd: function() {},
                onRemove: function() {}
            };
            Element.defineCustomEvent("owntransitionend", {
                base: "transitionend",
                condition: function(e) {
                    e.stop();
                    return e.target === this;
                }
            });
            Element.defineCustomEvent("ownanimationend", {
                base: "animationend",
                condition: function(e) {
                    e.stop();
                    return e.target === this;
                }
            });
        })();
    },
    m: function(require, module, exports, global) {
        if (!Browser.Features.Touch) (function() {
            var touch = null;
            var touchTarget = null;
            var touchIdentifier = null;
            var redispatch = function(e) {
                if (e.fake) return;
                var faked = document.createEvent("MouseEvent");
                faked.fake = true;
                faked.initMouseEvent(e.type, true, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, 0, null);
                touchTarget.dispatchEvent(faked);
            };
            var onDocumentMouseDown = function(e) {
                if (touch === null) {
                    touchTarget = e.event.target;
                    touchIdentifier = e.event.timeStamp;
                    touch = {
                        target: touchTarget,
                        identifier: touchIdentifier
                    };
                    redispatch(e.event);
                }
            };
            var onDocumentMouseMove = function(e) {
                if (touch) redispatch(e.event);
            };
            var onDocumentMouseUp = function(e) {
                if (touch) {
                    redispatch(e.event);
                    touch = null;
                    touchTarget = null;
                    touchIdentifier = null;
                }
            };
            document.addEvent("mousedown", onDocumentMouseDown);
            document.addEvent("mousemove", onDocumentMouseMove);
            document.addEvent("mouseup", onDocumentMouseUp);
            var condition = function(e) {
                if (touch === null) return false;
                touch.pageX = e.page.x;
                touch.pageY = e.page.y;
                touch.clientX = e.client.x;
                touch.clientY = e.client.y;
                e.touches = e.targetTouches = e.changedTouches = [ touch ];
                if (e.type === "mouseup") {
                    e.touches = [];
                    e.targetTouches = [];
                }
                if (e.event.fake) {
                    return true;
                }
                return false;
            };
            Element.defineCustomEvent("touchstart", {
                base: "mousedown",
                condition: condition
            });
            Element.defineCustomEvent("touchmove", {
                base: "mousemove",
                condition: condition
            });
            Element.defineCustomEvent("touchend", {
                base: "mouseup",
                condition: condition
            });
        })();
    },
    n: function(require, module, exports, global) {
        if (Browser.Features.Touch) (function() {
            delete Element.NativeEvents["mousedown"];
            delete Element.NativeEvents["mousemove"];
            delete Element.NativeEvents["mouseup"];
            Element.defineCustomEvent("mousedown", {
                base: "touchstart"
            }).defineCustomEvent("mousemove", {
                base: "touchmove"
            }).defineCustomEvent("mouseup", {
                base: "touchend"
            });
        })();
    },
    o: function(require, module, exports, global) {
        (function() {
            var tapStartX = 0;
            var tapStartY = 0;
            var tapMaxX = 0;
            var tapMinX = 0;
            var tapMaxY = 0;
            var tapMinY = 0;
            var tapValid = true;
            var onTapTouchStart = function(e) {
                if (e.changedTouches.length > 1) {
                    tapValid = false;
                    return;
                }
                tapValid = true;
                tapStartX = e.changedTouches[0].clientX;
                tapStartY = e.changedTouches[0].clientY;
                tapMaxX = tapStartX + 10;
                tapMinX = tapStartX - 10;
                tapMaxY = tapStartY + 10;
                tapMinY = tapStartY - 10;
            };
            var onTapTouchMove = function(e) {
                if (e.changedTouches.length > 1) {
                    tapValid = false;
                    return;
                }
                if (tapValid) {
                    var x = e.changedTouches[0].clientX;
                    var y = e.changedTouches[0].clientY;
                    tapValid = !(x > tapMaxX || x < tapMinX || y > tapMaxY || y < tapMinY);
                } else {
                    this.fireEvent("tapend", e);
                }
            };
            Element.defineCustomEvent("tap", {
                base: "touchend",
                condition: function(e) {
                    return tapValid;
                },
                onSetup: function() {
                    this.addEvent("touchstart", onTapTouchStart);
                    this.addEvent("touchmove", onTapTouchMove);
                },
                onTeardown: function() {
                    this.removeEvent("touchstart", onTapTouchStart);
                    this.removeEvent("touchmove", onTapTouchMove);
                }
            });
            Element.defineCustomEvent("tapstart", {
                base: "touchstart",
                condition: function(e) {
                    return e.changedTouches.length === 1;
                }
            });
            Element.defineCustomEvent("tapmove", {
                base: "touchmove",
                condition: function(e) {
                    return e.changedTouches.length === 1;
                }
            });
            Element.defineCustomEvent("tapend", {
                base: "touchend",
                condition: function(e) {
                    return e.changedTouches.length === 1;
                }
            });
        })();
    },
    p: function(require, module, exports, global) {
        moobile.Animation = new Class({
            Extends: moobile.Emitter,
            _name: null,
            _running: false,
            element: null,
            animationClass: null,
            animationProperties: {
                name: null,
                duration: null,
                "iteration-count": null,
                "animation-direction": null,
                "animation-timing-function": null,
                "animation-fill-mode": null,
                "animation-delay": null
            },
            initialize: function(element, options) {
                this.setElement(element);
                this.setOptions(options);
                return this;
            },
            setName: function(name) {
                this._name = name;
                return this;
            },
            getName: function() {
                return this._name;
            },
            setElement: function(element) {
                this.element = document.id(element);
                return this;
            },
            getElement: function() {
                return this.element;
            },
            setAnimationClass: function(value) {
                this.animationClass = value;
                return this;
            },
            getAnimationClass: function() {
                return this.animationClass;
            },
            setAnimationName: function(value) {
                this.animationProperties["name"] = value;
                return this;
            },
            getAnimationName: function() {
                return this.animationProperties["name"];
            },
            setAnimationDuration: function(value) {
                this.animationProperties["duration"] = value;
                return this;
            },
            getAnimationDuration: function() {
                return this.animationProperties["duration"];
            },
            setAnimationIterationCount: function(value) {
                this.animationProperties["iteration-count"] = value;
                return this;
            },
            getAnimationIterationCount: function() {
                return this.animationProperties["iteration-count"];
            },
            setAnimationDirection: function(value) {
                this.animationProperties["direction"] = value;
                return this;
            },
            getAnimationDirection: function() {
                return this.animationProperties["direction"];
            },
            setAnimationTimingFunction: function(value) {
                this.animationProperties["timing-function"] = value;
                return this;
            },
            getAnimationTimingFunction: function() {
                return this.animationProperties["timing-function"];
            },
            setAnimationFillMode: function(value) {
                this.animationProperties["fill-mode"] = value;
                return this;
            },
            getAnimationFillMode: function() {
                return this.animationProperties["fill-mode"];
            },
            setAnimationDelay: function(value) {
                this.animationProperties["delay"] = value;
                return this;
            },
            getAnimationDelay: function() {
                return this.animationProperties["delay"];
            },
            attach: function() {
                this.element.addEvent("ownanimationend", this.bound("onAnimationEnd"));
                this.element.addClass(this.animationClass);
                Object.each(this.animationProperties, function(val, key) {
                    this.element.setStyle("animation-" + key, val);
                }, this);
                return this;
            },
            detach: function() {
                this.element.removeEvent("ownanimationend", this.bound("onAnimationEnd"));
                this.element.removeClass(this.animationClass);
                Object.each(this.animationProperties, function(val, key) {
                    this.element.setStyle("animation-" + key, null);
                }, this);
                return this;
            },
            start: function() {
                if (this._running) return this;
                this._running = true;
                this.attach();
                this.fireEvent("start");
                return this;
            },
            stop: function() {
                if (this._running === false) return this;
                this._running = false;
                this.detach();
                this.fireEvent("stop");
                return this;
            },
            isRunning: function() {
                return this._running;
            },
            onAnimationEnd: function(e) {
                if (this._running === false) return;
                if (this.element !== e.target) return;
                e.stop();
                this._running = false;
                this.fireEvent("end");
                this.detach();
            }
        });
    },
    q: function(require, module, exports, global) {
        "use strict";
        var Component = moobile.Component = new Class({
            Extends: moobile.Emitter,
            __name: null,
            __ready: false,
            __window: null,
            __parent: null,
            __children: [],
            __visible: true,
            __style: null,
            __listeners: {},
            __callbacks: {},
            __size: {
                x: 0,
                y: 0
            },
            __updateLayout: false,
            element: null,
            options: {
                className: null,
                styleName: null,
                tagName: "div",
                components: null
            },
            initialize: function(element, options, name) {
                this.setElement(element);
                this.setOptions(options);
                this.__name = name || this.element.get("data-name");
                var marker = this.element;
                var exists = document.contains(this.element);
                if (exists) this.element = this.element.clone(true, true);
                this.__willBuild();
                this.__build();
                this.__didBuild();
                if (exists) this.element.replaces(marker);
                return this;
            },
            destroy: function() {
                this.removeEvents();
                this.removeFromParentComponent();
                this.removeAllChildComponents(true);
                this.element.destroy();
                this.element = null;
                this.__window = null;
                this.__parent = null;
                this.__children = null;
                this.__callbacks = null;
                this.__listeners = null;
                this.__updateRefresh = clearTimeout(this.__updateRefresh);
                return this;
            },
            setElement: function(element) {
                if (this.element) {
                    this.element.destroy();
                    this.element = null;
                }
                this.element = Element.from(element);
                if (this.element === null) {
                    this.element = document.createElement(this.options.tagName);
                }
                this.element.store("moobile:component", this);
                return this;
            },
            setOptions: function(options) {
                options = options || {};
                for (var option in this.options) {
                    if (options[option] === undefined) {
                        var value = this.element.get("data-option-" + option.hyphenate());
                        if (value !== null) {
                            try {
                                value = JSON.parse(value);
                            } catch (e) {}
                            options[option] = value;
                        }
                    }
                }
                return this.parent(options);
            },
            addEvent: function(type, fn, internal) {
                var name = type.split(":")[0];
                if (this.supportNativeEvent(name)) {
                    var self = this;
                    var listeners = this.__listeners;
                    var callbacks = this.__callbacks;
                    if (callbacks[name] === undefined) {
                        callbacks[name] = [];
                        listeners[name] = function(e) {
                            self.fireEvent(name, e);
                        };
                    }
                    callbacks[name].include(fn);
                    if (callbacks[name].length === 1) this.element.addEvent(name, listeners[name]);
                }
                return this.parent(type, fn, internal);
            },
            removeEvent: function(type, fn) {
                if (this.supportNativeEvent(type)) {
                    var listeners = this.__listeners;
                    var callbacks = this.__callbacks;
                    if (callbacks[type] && callbacks[type].contains(fn)) {
                        callbacks[type].erase(fn);
                        if (callbacks[type].length === 0) {
                            this.element.removeEvent(type, listeners[type]);
                            delete listeners[type];
                            delete callbacks[type];
                        }
                    }
                }
                return this.parent(type, fn);
            },
            supportNativeEvent: function(name) {
                return [ "click", "dblclick", "mouseup", "mousedown", "mouseover", "mouseout", "mousemove", "keydown", "keypress", "keyup", "touchstart", "touchmove", "touchend", "touchcancel", "gesturestart", "gesturechange", "gestureend", "tap", "tapstart", "tapmove", "tapend", "tapcancel", "pinch", "swipe", "touchold", "animationend", "transitionend", "owntransitionend", "ownanimationend" ].contains(name);
            },
            addChildComponent: function(component, where, context) {
                component.removeFromParentComponent();
                context = context ? document.id(context) || this.element.getElement(context) : this.element;
                this.__willAddChildComponent(component);
                var element = document.id(component);
                if (where || !this.hasElement(element)) {
                    element.inject(context, where);
                }
                insert.call(this, component);
                component.__setParent(this);
                component.__setWindow(this.__window);
                this.__didAddChildComponent(component);
                this.updateLayout();
                return this;
            },
            addChildComponentInside: function(component, context, where) {
                return this.addChildComponent(component, where, document.id(context) || this.getElement(context));
            },
            addChildComponentAfter: function(component, after) {
                return this.addChildComponent(component, "after", after);
            },
            addChildComponentBefore: function(component, before) {
                return this.addChildComponent(component, "before", before);
            },
            addChildComponentAt: function(component, index) {
                var children = this.__children;
                if (index > children.length) {
                    index = children.length;
                } else if (index < 0) {
                    index = 0;
                }
                var before = this.getChildComponentAt(index);
                if (before) {
                    return this.addChildComponentBefore(component, before);
                }
                return this.addChildComponent(component, "bottom");
            },
            getChildComponent: function(name) {
                return this.__children.find(function(child) {
                    return child.getName() === name;
                });
            },
            getChildComponentByType: function(type, name) {
                return this.__children.find(function(child) {
                    return child instanceof type && child.getName() === name;
                });
            },
            getChildComponentAt: function(index) {
                return this.__children[index] || null;
            },
            getChildComponentByTypeAt: function(type, index) {
                return this.getChildComponentsByType(type)[index] || null;
            },
            getChildComponentIndex: function(component) {
                return this.__children.indexOf(component);
            },
            getChildComponents: function() {
                return this.__children;
            },
            getChildComponentsByType: function(type) {
                return this.__children.filter(function(child) {
                    return child instanceof type;
                });
            },
            hasChildComponent: function(component) {
                return this.__children.contains(component);
            },
            hasChildComponentByType: function(type) {
                return this.__children.some(function(child) {
                    return child instanceof type;
                });
            },
            getComponent: function(name) {
                var component = this.getChildComponent(name);
                if (component === null) {
                    for (var i = 0, len = this.__children.length; i < len; i++) {
                        var found = this.__children[i].getComponent(name);
                        if (found) return found;
                    }
                }
                return component;
            },
            getComponentByType: function(type, name) {
                var component = this.getChildComponentByType(type, name);
                if (component === null) {
                    for (var i = 0, len = this.__children.length; i < len; i++) {
                        var found = this.__children[i].getComponentByType(type, name);
                        if (found) return found;
                    }
                }
                return component;
            },
            hasComponent: function(name) {
                var exists = this.hasChildComponent(name);
                if (exists === false) {
                    for (var i = 0, len = this.__children.length; i < len; i++) {
                        var found = this.__children[i].hasComponent(name);
                        if (found) return found;
                    }
                }
                return exists;
            },
            hasComponentByType: function(type, name) {
                var exists = this.hasChildComponentByType(type, name);
                if (exists === false) {
                    for (var i = 0, len = this.__children.length; i < len; i++) {
                        var found = this.__children[i].hasComponentByType(type, name);
                        if (found) return found;
                    }
                }
                return exists;
            },
            replaceChildComponent: function(component, replacement, destroy) {
                this.addChildComponentBefore(replacement, component).removeChildComponent(component, destroy);
                return this;
            },
            replaceWithComponent: function(component, destroy) {
                var parent = this.getParentComponent();
                if (parent) parent.replaceChildComponent(this, component, destroy);
                return this;
            },
            removeChildComponent: function(component, destroy) {
                if (this.hasChildComponent(component) === false) return this;
                this.__willRemoveChildComponent(component);
                var element = component.getElement();
                if (element) {
                    element.dispose();
                }
                this.__children.erase(component);
                component.__setParent(null);
                component.__setWindow(null);
                this.__didRemoveChildComponent(component);
                if (destroy) {
                    component.destroy();
                }
                this.updateLayout();
                return this;
            },
            removeAllChildComponents: function(destroy) {
                return this.removeAllChildComponentsByType(Component, destroy);
            },
            removeAllChildComponentsByType: function(type, destroy) {
                this.__children.filter(function(child) {
                    return child instanceof type;
                }).invoke("removeFromParentComponent", destroy);
                return this;
            },
            removeFromParentComponent: function(destroy) {
                var parent = this.getParentComponent();
                if (parent) parent.removeChildComponent(this, destroy);
                return this;
            },
            getParentComponent: function() {
                return this.__parent;
            },
            hasParentComponent: function() {
                return !!this.__parent;
            },
            getWindow: function() {
                return this.__window;
            },
            hasWindow: function() {
                return !!this.__window;
            },
            isReady: function() {
                return this.__ready;
            },
            getName: function() {
                return this.__name;
            },
            setStyle: function(name) {
                if (arguments.length === 2) {
                    this.element.setStyle(arguments[0], arguments[1]);
                    return this.updateLayout();
                }
                if (this.__style) {
                    this.__style.detach.call(this, this.element);
                    this.__style = null;
                }
                var style = Component.getStyle(name, this);
                if (style) {
                    style.attach.call(this, this.element);
                }
                this.__style = style;
                return this.updateLayout();
            },
            getStyle: function() {
                return arguments.length === 1 ? this.element.getStyle(arguments[0]) : this.__style && this.__style.name || null;
            },
            hasStyle: function(name) {
                return this.__style ? this.__style.name === name : false;
            },
            addClass: function(name) {
                var element = this.element;
                if (element.hasClass(name) === false) {
                    element.addClass(name);
                    this.updateLayout();
                }
                return this;
            },
            removeClass: function(name) {
                var element = this.element;
                if (element.hasClass(name) === true) {
                    element.removeClass(name);
                    this.updateLayout();
                }
                return this;
            },
            toggleClass: function(name, force) {
                this.element.toggleClass(name, force);
                this.updateLayout();
                return this;
            },
            hasClass: function(name) {
                return this.element.hasClass(name);
            },
            getElements: function(selector) {
                return this.element.getElements(selector || "*");
            },
            getElement: function(selector) {
                return selector ? this.element.getElement(selector) : this.element;
            },
            hasElement: function(element) {
                return this.element === document.id(element) || this.element.contains(document.id(element));
            },
            getRoleElement: function(name) {
                return this.getRoleElements(name, 1)[0] || null;
            },
            getRoleElements: function(name, limit) {
                var roles = this.__roles__;
                var found = [];
                var walk = function(element) {
                    if (limit && limit <= found.length) return;
                    var nodes = element.childNodes;
                    for (var i = 0, len = nodes.length; i < len; i++) {
                        var node = nodes[i];
                        if (node.nodeType !== 1) continue;
                        var role = node.getRole();
                        if (role === null) {
                            walk(node);
                            continue;
                        }
                        var behavior = roles[role];
                        if (behavior) {
                            if (name === role || !name) found.push(node);
                            if (behavior.options.traversable) {
                                walk(node);
                                continue;
                            }
                        }
                    }
                };
                walk(this.element);
                return found;
            },
            setSize: function(x, y) {
                if (x > 0 || x === null) this.element.setStyle("width", x);
                if (y > 0 || y === null) this.element.setStyle("height", y);
                if (this.__size.x !== x || this.__size.y !== y) {
                    this.updateLayout();
                }
                this.__size.x = x;
                this.__size.y = y;
                return this;
            },
            getSize: function() {
                return this.element.getSize();
            },
            getPosition: function(relative) {
                return this.element.getPosition(document.id(relative) || this.__parent);
            },
            show: function() {
                if (this.__visible === true) return this;
                this.removeClass("hidden");
                this.__visible = true;
                this.__didShow();
                this.updateLayout();
                return this;
            },
            hide: function() {
                if (this.__visible === false) return this;
                this.addClass("hidden");
                this.__visible = false;
                this.__didHide();
                this.updateLayout(false);
                return this;
            },
            isVisible: function() {
                return this.__visible;
            },
            updateLayout: function(update) {
                if (this.__updateLayout === false) {
                    this.__updateLayout = true;
                    updateLayout(this);
                }
                return this;
            },
            cascade: function(func) {
                func.call(this, this);
                this.__children.invoke("cascade", func);
                return this;
            },
            willBuild: function() {},
            didBuild: function() {},
            willChangeReadyState: function(ready) {},
            didChangeReadyState: function(ready) {},
            didBecomeReady: function() {},
            didUpdateLayout: function() {},
            willAddChildComponent: function(component) {},
            didAddChildComponent: function(component) {},
            willRemoveChildComponent: function(component) {},
            didRemoveChildComponent: function(component) {},
            parentComponentWillChange: function(parent) {},
            parentComponentDidChange: function(parent) {},
            windowWillChange: function(window) {},
            windowDidChange: function(window) {},
            willShow: function() {},
            willHide: function() {},
            didShow: function() {},
            didHide: function() {},
            toElement: function() {
                return this.element;
            },
            __setParent: function(parent) {
                if (this.__parent === parent) return this;
                this.__parentComponentWillChange(parent);
                this.__parent = parent;
                this.__parentComponentDidChange(parent);
                return this;
            },
            __setWindow: function(window) {
                if (this.__window === window) return this;
                invokeAll.call(this, "__windowWillChange", [ window ]);
                assignAll.call(this, "__window", window);
                invokeAll.call(this, "__windowDidChange", [ window ]);
                var ready = !!window;
                invokeAll.call(this, "__willChangeReadyState", [ ready ]);
                assignAll.call(this, "__ready", ready);
                invokeAll.call(this, "__didChangeReadyState", [ ready ]);
                if (ready) invokeAll.call(this, "__didBecomeReady");
                return this;
            },
            __build: function() {
                var owner = this;
                var roles = this.__roles__;
                var attrs = this.__attributes__;
                for (var key in attrs) {
                    var value = this.element.get(key);
                    if (value !== null) {
                        var handler = attrs[key];
                        if (handler instanceof Function) {
                            handler.call(this, value);
                        }
                    }
                }
                var className = this.options.className;
                if (className) this.addClass(className);
                var styleName = this.options.styleName;
                if (styleName) this.setStyle(styleName);
                this.getRoleElements().each(function(element) {
                    var handler = roles[element.getRole()].handler;
                    if (typeof handler === "function") {
                        handler.call(owner, element);
                    }
                });
            },
            __willBuild: function() {
                this.willBuild();
            },
            __didBuild: function() {
                var components = this.options.components;
                if (components) {
                    this.addChildComponents(components);
                }
                this.didBuild();
            },
            __willAddChildComponent: function(component) {
                this.willAddChildComponent(component);
                this.fireEvent("willaddchildcomponent", component);
            },
            __didAddChildComponent: function(component) {
                this.didAddChildComponent(component);
                this.fireEvent("didaddchildcomponent", component);
            },
            __willRemoveChildComponent: function(component) {
                this.willRemoveChildComponent(component);
                this.fireEvent("willremovechildcomponent", component);
            },
            __didRemoveChildComponent: function(component) {
                this.didRemoveChildComponent(component);
                this.fireEvent("didremovechildcomponent", component);
            },
            __parentComponentWillChange: function(parent) {
                this.parentComponentWillChange(parent);
                this.fireEvent("parentcomponentwillchange", parent);
            },
            __parentComponentDidChange: function(parent) {
                this.parentComponentDidChange(parent);
                this.fireEvent("parentcomponentdidchange", parent);
            },
            __windowWillChange: function(window) {
                this.windowWillChange(window);
                this.fireEvent("windowwillchange", window);
            },
            __windowDidChange: function(window) {
                this.windowDidChange(window);
                this.fireEvent("windowdidchange", window);
            },
            __willChangeReadyState: function(ready) {
                this.willChangeReadyState(ready);
                this.fireEvent("willchangereadystate", ready);
            },
            __didChangeReadyState: function(ready) {
                this.didChangeReadyState(ready);
                this.fireEvent("didchangereadystate", ready);
            },
            __didBecomeReady: function() {
                this.didBecomeReady();
                this.fireEvent("didbecomeready");
            },
            __didUpdateLayout: function() {
                if (this.__updateLayout) {
                    this.__updateLayout = false;
                    this.didUpdateLayout();
                    this.fireEvent("didupdatelayout");
                }
            },
            __willShow: function() {
                this.willShow();
            },
            __didShow: function() {
                this.didShow();
                this.fireEvent("show");
            },
            __willHide: function() {
                this.willHide();
            },
            __didHide: function() {
                this.didHide();
                this.fireEvent("hide");
            },
            getChildComponentOfType: function(type, name) {
                return this.getChildComponentByType(type, name);
            },
            getChildComponentOfTypeAt: function(type, index) {
                return this.getChildComponentByTypeAt(type, index);
            },
            getChildComponentsOfType: function(type) {
                return this.getChildComponentsByType(type);
            },
            hasChildComponentOfType: function(type) {
                return this.hasChildComponentByType(type);
            },
            getDescendantComponent: function(name) {
                return this.getComponent(name);
            },
            getComponentOfType: function(type, name) {
                return this.getComponentByType(type, name);
            },
            hasComponentOfType: function(type, name) {
                return this.hasComponentByType(type, name);
            }
        });
        Component.defineRole = function(name, context, options, handler) {
            context = (context || Component).prototype;
            if (context.__roles__ === undefined) {
                context.__roles__ = {};
            }
            if (options) {
                switch (typeof options) {
                  case "function":
                    handler = options;
                    options = {};
                    break;
                  case "object":
                    if (typeof options.behavior === "function") handler = options.behavior;
                    break;
                }
            }
            context.__roles__[name] = {
                handler: handler || function() {},
                options: options || {}
            };
        };
        Component.defineAttribute = function(name, context, handler) {
            context = (context || Component).prototype;
            if (context.__attributes__ === undefined) {
                context.__attributes__ = {};
            }
            context.__attributes__[name] = handler;
        };
        Component.defineStyle = function(name, target, handler) {
            var context = (target || Component).prototype;
            if (context.__styles__ === undefined) {
                context.__styles__ = {};
            }
            context.__styles__[name] = Object.append({
                name: name,
                attach: function() {},
                detach: function() {}
            }, handler);
        };
        Component.getStyle = function(name, target) {
            return target.__styles__ ? target.__styles__[name] : null;
        };
        Component.create = function(klass, element, descriptor, options, name) {
            element = Element.from(element);
            if (descriptor) {
                var subclass = element.get(descriptor);
                if (subclass) {
                    var instance = Class.instantiate(subclass, element, options, name);
                    if (instance instanceof klass) {
                        return instance;
                    }
                }
            }
            return new klass(element, options, name);
        };
        Component.defineAttribute("data-style", null, function(value) {
            this.options.styleName = value;
        });
        var updateLayoutTime = null;
        var updateLayoutRoot = null;
        var assignAll = function(key, val) {
            this[key] = val;
            var each = function(child) {
                assignAll.apply(child, [ key, val ]);
            };
            this.__children.each(each);
        };
        var invokeSome = function(filter, method, args) {
            if (filter(this)) this[method].apply(this, args);
            var each = function(child) {
                invokeSome.apply(child, [ filter, method, args ]);
            };
            this.__children.each(each);
        };
        var assignSome = function(filter, key, val) {
            if (filter(this)) this[key] = val;
            var each = function(child) {
                assignSome.apply(child, [ filter, key, val ]);
            };
            this.__children.each(each);
        };
        var invokeAll = function(method, args) {
            this[method].apply(this, args);
            var each = function(child) {
                invokeAll.apply(child, [ method, args ]);
            };
            this.__children.each(each);
        };
        var insert = function(component) {
            var index = 0;
            var node = document.id(component);
            do {
                var prev = node.previousSibling;
                if (prev === null) {
                    node = node.parentNode;
                    if (node === this.element) break;
                    continue;
                }
                node = prev;
                if (node.nodeType !== 1) continue;
                var previous = node.retrieve("moobile:component");
                if (previous) {
                    index = this.getChildComponentIndex(previous) + 1;
                    break;
                }
                var children = node.childNodes;
                if (children.length) {
                    var found = position.call(this, node);
                    if (found !== null) {
                        index = found;
                        break;
                    }
                }
            } while (node);
            this.__children.splice(index, 0, component);
            return this;
        };
        var position = function(root) {
            var node = root.lastChild;
            do {
                if (node.nodeType !== 1) {
                    node = node.previousSibling;
                    if (node === null) return 0;
                    continue;
                }
                var component = node.retrieve("moobile:component");
                if (component) {
                    return this.getChildComponentIndex(component) + 1;
                }
                var children = node.childNodes;
                if (children.length) {
                    var found = position.call(this, node);
                    if (found >= 0) {
                        return found;
                    }
                }
                node = node.previousSibling;
            } while (node);
            return null;
        };
        var updateLayout = function(component) {
            if (!(component instanceof moobile.Window) && component.hasWindow() === false) return;
            updateLayoutTime = cancelAnimationFrame(updateLayoutTime);
            updateLayoutTime = requestAnimationFrame(onUpdateLayout);
            if (updateLayoutRoot === null) {
                updateLayoutRoot = component;
                return;
            } else if (updateLayoutRoot instanceof moobile.Window) {
                return;
            }
            var parent = component.getParentComponent();
            while (parent) {
                if (parent !== updateLayoutRoot) {
                    parent = parent.getParentComponent();
                    continue;
                }
                return;
            }
            console.log("Setting new root");
            updateLayoutRoot = component;
        };
        var onUpdateLayout = function() {
            if (updateLayoutRoot) {
                updateLayoutRoot.cascade(function(component) {
                    if (component.__updateLayout) {
                        component.__didUpdateLayout();
                        component.__updateLayout = false;
                    }
                });
                updateLayoutRoot = null;
            }
        };
    },
    r: function(require, module, exports, global) {
        "use strict";
        var Overlay = moobile.Overlay = new Class({
            Extends: moobile.Component,
            willBuild: function() {
                this.parent();
                this.addClass("overlay");
                this.addEvent("animationend", this.bound("_onAnimationEnd"));
            },
            destroy: function() {
                this.removeEvent("animationend", this.bound("_onAnimationEnd"));
                this.parent();
            },
            showAnimated: function() {
                this.willShow();
                this.addClass("show-animated").removeClass("hidden");
                return this;
            },
            hideAnimated: function() {
                this.willHide();
                this.element.addClass("hide-animated");
                return this;
            },
            _onAnimationEnd: function(e) {
                e.stop();
                if (this.hasClass("show-animated")) {
                    this.removeClass("show-animated");
                    this.didShow();
                }
                if (this.hasClass("hide-animated")) {
                    this.removeClass("hide-animated");
                    this.addClass("hidden");
                    this.didHide();
                }
            }
        });
    },
    s: function(require, module, exports, global) {
        "use strict";
        var Control = moobile.Control = new Class({
            Extends: moobile.Component,
            __state: null,
            options: {
                className: null,
                styleName: null
            },
            _setState: function(state, value) {
                if (this.__state === state) return this;
                if (this.shouldAllowState(state) || state == null) {
                    this.willChangeState(state);
                    if (this.__state) this.removeClass("is-" + this.__state);
                    this.__state = state;
                    if (this.__state) this.addClass("is-" + this.__state);
                    this.didChangeState(state);
                }
                return this;
            },
            _getState: function() {
                return this.__state;
            },
            shouldAllowState: function(state) {
                return [ "highlighted", "selected", "disabled" ].contains(state);
            },
            setDisabled: function(disabled) {
                return this._setState(disabled !== false ? "disabled" : null);
            },
            isDisabled: function() {
                return this._getState() == "disabled";
            },
            setSelected: function(selected) {
                return this._setState(selected !== false ? "selected" : null);
            },
            isSelected: function() {
                return this._getState() == "selected";
            },
            setHighlighted: function(highlighted) {
                return this._setState(highlighted !== false ? "highlighted" : null);
            },
            isHighlighted: function() {
                return this._getState() == "highlighted";
            },
            willChangeState: function(state) {},
            didChangeState: function(state) {},
            shouldFireEvent: function(type, args) {
                return !this.isDisabled();
            }
        });
    },
    t: function(require, module, exports, global) {
        "use strict";
        var Text = moobile.Text = new Class({
            Extends: moobile.Control,
            options: {
                tagName: "span",
                text: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("text");
            },
            didBuild: function() {
                this.parent();
                var text = this.options.text;
                if (text) this.setText(text);
            },
            setText: function(text) {
                this.element.set("html", text instanceof Text ? text.getText() : text || typeof text === "number" ? text + "" : "");
                return this;
            },
            getText: function() {
                return this.element.get("html");
            },
            isEmpty: function() {
                return !this.getText();
            }
        });
        Text.from = function(source) {
            if (source instanceof Text) return source;
            var text = new Text;
            text.setText(source);
            return text;
        };
        moobile.Component.defineRole("text", null, function(element) {
            this.addChildComponent(moobile.Component.create(Text, element, "data-text"));
        });
    },
    u: function(require, module, exports, global) {
        "use strict";
        var ActivityIndicator = moobile.ActivityIndicator = new Class({
            Extends: moobile.Control,
            willBuild: function() {
                this.parent();
                this.addClass("activity-indicator");
            },
            start: function() {
                return this.addClass("active");
            },
            stop: function() {
                return this.removeClass("active");
            }
        });
        moobile.Component.defineRole("activity-indicator", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(ActivityIndicator, element, "data-activity-indicator"));
        });
    },
    v: function(require, module, exports, global) {
        "use strict";
        var Bar = moobile.Bar = new Class({
            Extends: moobile.Control,
            willBuild: function() {
                this.parent();
                this.addClass("bar");
            }
        });
        moobile.Component.defineRole("bar", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(Bar, element, "data-bar"));
        });
        moobile.Component.defineStyle("dark", Bar, {
            attach: function(element) {
                element.addClass("style-dark");
            },
            detach: function(element) {
                element.removeClass("style-dark");
            }
        });
        moobile.Component.defineStyle("light", Bar, {
            attach: function(element) {
                element.addClass("style-light");
            },
            detach: function(element) {
                element.removeClass("style-light");
            }
        });
    },
    w: function(require, module, exports, global) {
        "use strict";
        var ButtonGroup = moobile.ButtonGroup = new Class({
            Extends: moobile.Control,
            __selectedButton: null,
            __selectedButtonIndex: -1,
            options: {
                layout: "horizontal",
                selectable: true,
                selectedButtonIndex: -1,
                buttons: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("button-group");
                var layout = this.options.layout;
                if (layout) {
                    this.addClass("button-group-layout-" + layout);
                }
            },
            didBuild: function() {
                this.parent();
                this.setSelectable(this.options.selectable);
                this.setSelectedButtonIndex(this.options.selectedButtonIndex);
                var buttons = this.options.buttons;
                if (buttons) this.addButtons(buttons);
            },
            destroy: function() {
                this.__selectedButton = null;
                this.__selectedButtonIndex = -1;
                this.parent();
            },
            setSelectedButton: function(selectedButton) {
                if (this.__selectable === false) return this;
                if (this.__selectedButton === selectedButton) return this;
                if (this.__selectedButton) {
                    this.__selectedButton.setSelected(false);
                    this.fireEvent("deselect", this.__selectedButton);
                    this.__selectedButton = null;
                }
                this.__selectedButtonIndex = selectedButton ? this.getChildComponentIndex(selectedButton) : -1;
                if (selectedButton) {
                    this.__selectedButton = selectedButton;
                    this.__selectedButton.setSelected(true);
                    this.fireEvent("select", this.__selectedButton);
                }
                return this;
            },
            getSelectedButton: function() {
                return this.__selectedButton;
            },
            setSelectedButtonIndex: function(index) {
                var child = null;
                if (index >= 0) {
                    child = this.getChildComponentByTypeAt(moobile.Button, index);
                }
                return this.setSelectedButton(child);
            },
            getSelectedButtonIndex: function() {
                return this.__selectedButtonIndex;
            },
            clearSelectedButton: function() {
                this.setSelectedButton(null);
                return this;
            },
            addButton: function(button, where) {
                return this.addChildComponent(moobile.Button.from(button), where);
            },
            addButtonAfter: function(button, after) {
                return this.addChildComponentAfter(moobile.Button.from(button), after);
            },
            addButtonBefore: function(button, before) {
                return this.addChildComponentBefore(moobile.Button.from(button), before);
            },
            addButtons: function(buttons, where) {
                return this.addChildComponents(buttons.map(function(button) {
                    return moobile.Button.from(button);
                }), where);
            },
            addButtonsAfter: function(buttons, after) {
                return this.addChildComponentsAfter(buttons.map(function(button) {
                    return moobile.Button.from(button);
                }), after);
            },
            addButtonsBefore: function(buttons, before) {
                return this.addChildComponentsBefore(buttons.map(function(button) {
                    return moobile.Button.from(button);
                }), before);
            },
            getButtons: function() {
                return this.getChildComponentsByType(moobile.Button);
            },
            getButton: function(name) {
                return this.getChildComponentByType(moobile.Button, name);
            },
            getButtonAt: function(index) {
                return this.getChildComponentByTypeAt(moobile.Button, index);
            },
            removeButton: function(button, destroy) {
                return this.removeChildComponent(button, destroy);
            },
            removeAllButtons: function(destroy) {
                return this.removeAllChildComponentsByType(moobile.Button, destroy);
            },
            setSelectable: function(selectable) {
                this.__selectable = selectable;
                return this;
            },
            isSelectable: function() {
                return this.__selectable;
            },
            willRemoveChildComponent: function(component) {
                this.parent(component);
                if (this.__selectedButton === component) {
                    this.clearSelectedButton();
                }
            },
            didAddChildComponent: function(child) {
                this.parent(child);
                if (child instanceof moobile.Button) {
                    child.addEvent("tap", this.bound("onButtonTap"));
                }
            },
            didRemoveChildComponent: function(child) {
                this.parent(child);
                if (child instanceof moobile.Button) {
                    child.removeEvent("tap", this.bound("onButtonTap"));
                }
            },
            didChangeState: function(state) {
                this.parent(state);
                if (state === "disabled" || state == null) {
                    this.getChildComponents().invoke("setDisabled", state);
                }
            },
            onButtonTap: function(e, sender) {
                this.setSelectedButton(sender);
            }
        });
        moobile.Component.defineRole("button-group", null, function(element) {
            this.addChildComponent(moobile.Component.create(ButtonGroup, element, "data-button-group"));
        });
    },
    x: function(require, module, exports, global) {
        "use strict";
        var Button = moobile.Button = new Class({
            Extends: moobile.Control,
            __label: null,
            hitAreaElement: null,
            options: {
                label: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("button");
                var label = this.getRoleElement("label");
                if (label === null) {
                    label = document.createElement("div");
                    label.ingest(this.element);
                    label.inject(this.element);
                    label.setRole("label");
                }
                this.addEvent("tapstart", this.bound("_onTapStart"));
                this.addEvent("tapend", this.bound("_onTapEnd"));
            },
            didBuild: function() {
                this.parent();
                this.hitAreaElement = new Element("div.hit-area");
                this.hitAreaElement.inject(this.element);
                var label = this.options.label;
                if (label) this.setLabel(label);
            },
            destroy: function() {
                this.removeEvent("tapstart", this.bound("_onTapStart"));
                this.removeEvent("tapend", this.bound("_onTapEnd"));
                this.label = null;
                this.parent();
            },
            setLabel: function(label) {
                if (this.__label === label) return this;
                label = moobile.Text.from(label);
                if (this.__label) {
                    this.__label.replaceWithComponent(label, true);
                } else {
                    this.addChildComponent(label);
                }
                this.__label = label;
                this.__label.addClass("button-label");
                this.toggleClass("button-label-empty", this.__label.isEmpty());
                return this;
            },
            getLabel: function() {
                return this.__label;
            },
            _onTapStart: function(e) {
                if (!this.isSelected()) this.setHighlighted(true);
            },
            _onTapEnd: function(e) {
                if (!this.isSelected()) this.setHighlighted(false);
            }
        });
        Button.from = function(source) {
            if (source instanceof Button) return source;
            var button = new Button;
            button.setLabel(source);
            return button;
        };
        moobile.Component.defineRole("button", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(Button, element, "data-button"));
        });
        moobile.Component.defineRole("label", Button, null, function(element) {
            this.setLabel(moobile.Component.create(moobile.Text, element, "data-label"));
        });
        moobile.Component.defineStyle("active", Button, {
            attach: function(element) {
                element.addClass("style-active");
            },
            detach: function(element) {
                element.removeClass("style-active");
            }
        });
        moobile.Component.defineStyle("warning", Button, {
            attach: function(element) {
                element.addClass("style-warning");
            },
            detach: function(element) {
                element.removeClass("style-warning");
            }
        });
        moobile.Component.defineStyle("back", Button, {
            attach: function(element) {
                element.addClass("style-back");
            },
            detach: function(element) {
                element.removeClass("style-back");
            }
        });
        moobile.Component.defineStyle("forward", Button, {
            attach: function(element) {
                element.addClass("style-forward");
            },
            detach: function(element) {
                element.removeClass("style-forward");
            }
        });
    },
    y: function(require, module, exports, global) {
        "use strict";
        var Image = moobile.Image = new Class({
            Extends: moobile.Control,
            __image: null,
            __source: null,
            __loaded: false,
            __originalSize: {
                x: 0,
                y: 0
            },
            options: {
                tagName: "img",
                preload: false,
                source: null
            },
            willBuild: function() {
                this.parent();
                this.hide();
                this.addClass("image");
            },
            didBuild: function() {
                this.parent();
                var source = this.options.source || this.element.get("src");
                if (source) this.setSource(source);
            },
            destroy: function() {
                if (this.__image) {
                    this.__image.removeEvent("load", this.bound("__onLoad"));
                    this.__image.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    this.__image = null;
                }
                this.element.set("src", "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
                this.parent();
            },
            setSource: function(source, media) {
                if (media && window.matchMedia && window.matchMedia(media).matches === false) return this;
                this.__source = source || "";
                if (this.__image) {
                    this.__image.removeEvent("load", this.bound("__onLoad"));
                    this.__image = null;
                }
                if (source) {
                    if (this.options.preload) {
                        this.__loaded = false;
                        this.__image = new Image;
                        this.__image.src = source;
                        this.__image.addEvent("load", this.bound("__onLoad"));
                    } else {
                        this.__load();
                    }
                } else {
                    this.__unload();
                }
                return this;
            },
            getSource: function() {
                return this.__source;
            },
            getImage: function() {
                return this.__image;
            },
            getOriginalSize: function() {
                return this.__originalSize;
            },
            isLoaded: function() {
                return this.__loaded;
            },
            isEmpty: function() {
                return !this.getSource();
            },
            show: function() {
                return this.isEmpty() ? this : this.parent();
            },
            __load: function() {
                this.__loaded = true;
                if (this.options.preload) {
                    this.__originalSize.x = this.__image.width;
                    this.__originalSize.y = this.__image.height;
                }
                this.element.set("src", this.__source);
                this.show();
            },
            __unload: function() {
                this.__loaded = false;
                if (this.options.preload) {
                    this.__originalSize.x = 0;
                    this.__originalSize.y = 0;
                }
                this.element.erase("src");
                this.fireEvent("unload");
                this.hide();
            },
            __onLoad: function() {
                this.fireEvent("preload");
                this.__load();
            }
        });
        Image.from = function(source) {
            if (source instanceof Image) return source;
            var image = new Image;
            image.setSource(source);
            return image;
        };
        moobile.Component.defineRole("image", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(Image, element, "data-image"));
        });
    },
    z: function(require, module, exports, global) {
        "use strict";
        var List = moobile.List = new Class({
            Extends: moobile.Control,
            __selectable: true,
            __selectedItem: null,
            __selectedItemIndex: -1,
            options: {
                tagName: "ul",
                selectable: true,
                selectedItemIndex: -1,
                items: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("list");
            },
            didBuild: function() {
                this.parent();
                this.setSelectable(this.options.selectable);
                this.setSelectedItemIndex(this.options.selectedItemIndex);
                var items = this.options.items;
                if (items) this.addItems(items);
            },
            destroy: function() {
                this.__selectedItem = null;
                this.__selectedItemIndex = -1;
                this.parent();
            },
            setSelectedItem: function(selectedItem) {
                if (this.__selectable == false) return this;
                if (this.__selectedItem === selectedItem) return this;
                if (this.__selectedItem) {
                    this.__selectedItem.setSelected(false);
                    this.fireEvent("deselect", this.__selectedItem);
                    this.__selectedItem = null;
                }
                this.__selectedItemIndex = selectedItem ? this.getChildComponentIndex(selectedItem) : -1;
                if (selectedItem) {
                    this.__selectedItem = selectedItem;
                    this.__selectedItem.setSelected(true);
                    this.fireEvent("select", this.__selectedItem);
                }
                return this;
            },
            getSelectedItem: function() {
                return this.__selectedItem;
            },
            setSelectedItemIndex: function(index) {
                var child = null;
                if (index >= 0) {
                    child = this.getChildComponentByTypeAt(moobile.ListItem, index);
                }
                return this.setSelectedItem(child);
            },
            getSelectedItemIndex: function() {
                return this.__selectedItemIndex;
            },
            clearSelectedItem: function() {
                this.setSelectedItem(null);
                return this;
            },
            addItem: function(item, where) {
                return this.addChildComponent(moobile.ListItem.from(item), where);
            },
            addItemAfter: function(item, after) {
                return this.addChildComponentAfter(moobile.ListItem.from(item), after);
            },
            addItemBefore: function(item, before) {
                return this.addChildComponentBefore(moobile.ListItem.from(item), before);
            },
            addItems: function(items, where) {
                return this.addChildComponents(items.map(function(item) {
                    return moobile.ListItem.from(item);
                }), where);
            },
            addItemsAfter: function(items, after) {
                return this.addChildComponentsAfter(items.map(function(item) {
                    return moobile.ListItem.from(item);
                }), after);
            },
            addItemsBefore: function(items, before) {
                return this.addChildComponentsBefore(items.map(function(item) {
                    return moobile.ListItem.from(item);
                }), before);
            },
            getItem: function(name) {
                return this.getChildComponentByType(moobile.ListItem, name);
            },
            getItemAt: function(index) {
                return this.getChildComponentByTypeAt(moobile.ListItem, index);
            },
            getItemIndex: function(item) {
                return this.getChildComponentIndex(item);
            },
            getItems: function() {
                return this.getChildComponentsByType(moobile.ListItem);
            },
            removeItem: function(item) {
                return this.removeChildComponent(item);
            },
            removeAllItems: function() {
                return this.removeAllChildComponentsByType(moobile.ListItem);
            },
            setSelectable: function(selectable) {
                this.__selectable = selectable;
                return this;
            },
            isSelectable: function() {
                return this.__selectable;
            },
            didAddChildComponent: function(component) {
                this.parent(component);
                if (component instanceof moobile.ListItem) {
                    component.addEvent("tapstart", this.bound("__onItemTapStart"));
                    component.addEvent("tapend", this.bound("__onItemTapEnd"));
                    component.addEvent("tap", this.bound("__onItemTap"));
                }
            },
            willRemoveChildComponent: function(component) {
                this.parent(component);
                if (this.__selectedItem === component) {
                    this.clearSelectedItem();
                }
            },
            didRemoveChildComponent: function(component) {
                this.parent(component);
                if (component instanceof moobile.ListItem) {
                    component.removeEvent("tapstart", this.bound("__onItemTapStart"));
                    component.removeEvent("tapend", this.bound("__onItemTapEnd"));
                    component.removeEvent("tap", this.bound("__onItemTap"));
                }
            },
            didChangeState: function(state) {
                this.parent(state);
                if (state === "disabled" || state == null) {
                    this.getChildComponents().invoke("setDisabled", state);
                }
            },
            didUpdateLayout: function() {
                this.parent();
                var components = this.getChildComponents();
                for (var i = 0; i < components.length; i++) {
                    var prev = components[i - 1];
                    var next = components[i + 1];
                    var curr = components[i];
                    if (curr.hasStyle("header")) {
                        if (next) next.addClass("list-section-header");
                        if (prev) prev.addClass("list-section-footer");
                    } else {
                        if (next && next.hasStyle("header") || prev && prev.hasStyle("header")) {
                            continue;
                        }
                        curr.removeClass("list-section-header");
                        curr.removeClass("list-section-footer");
                    }
                }
            },
            __onItemTapStart: function(e, sender) {
                if (this.__selectable && !sender.isSelected()) sender.setHighlighted(true);
            },
            __onItemTapEnd: function(e, sender) {
                if (this.__selectable && !sender.isSelected()) sender.setHighlighted(false);
            },
            __onItemTap: function(e, sender) {
                if (this.__selectable) this.setSelectedItem(sender);
            }
        });
        moobile.Component.defineRole("list", null, function(element) {
            this.addChildComponent(moobile.Component.create(List, element, "data-list"));
        });
        moobile.Component.defineStyle("grouped", List, {
            attach: function(element) {
                element.addClass("style-grouped");
            },
            detach: function(element) {
                element.removeClass("style-grouped");
            }
        });
    },
    "10": function(require, module, exports, global) {
        "use strict";
        var ListItem = moobile.ListItem = new Class({
            Extends: moobile.Control,
            __image: null,
            __label: null,
            __detail: null,
            options: {
                tagName: "li",
                image: null,
                label: null,
                detail: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("list-item");
                var image = this.getRoleElement("image");
                var label = this.getRoleElement("label");
                var detail = this.getRoleElement("detail");
                if (label === null) {
                    label = document.createElement("div");
                    label.ingest(this.element);
                    label.inject(this.element);
                    label.setRole("label");
                }
                if (image === null) {
                    image = document.createElement("img");
                    image.inject(this.element, "top");
                    image.setRole("image");
                }
                if (detail === null) {
                    detail = document.createElement("div");
                    detail.inject(this.element);
                    detail.setRole("detail");
                }
            },
            didBuild: function() {
                this.parent();
                var image = this.options.image;
                var label = this.options.label;
                var detail = this.options.detail;
                if (image) this.setImage(image);
                if (label) this.setLabel(label);
                if (detail) this.setDetail(detail);
            },
            destroy: function() {
                this.__label = null;
                this.__image = null;
                this.__detail = null;
                this.parent();
            },
            setLabel: function(label) {
                if (this.__label === label) return this;
                label = moobile.Text.from(label);
                if (this.__label) {
                    this.__label.replaceWithComponent(label, true);
                } else {
                    this.addChildComponent(label);
                }
                this.__label = label;
                this.__label.addClass("list-item-label");
                this.toggleClass("list-item-label-empty", this.__label.isEmpty());
                return this;
            },
            getLabel: function() {
                return this.__label;
            },
            setImage: function(image) {
                if (this.__image === image) return this;
                image = moobile.Image.from(image);
                if (this.__image) {
                    this.__image.replaceWithComponent(image, true);
                } else {
                    this.addChildComponent(image);
                }
                this.__image = image;
                this.__image.addClass("list-item-image");
                this.toggleClass("list-item-image-empty", this.__image.isEmpty());
                return this;
            },
            getImage: function() {
                return this.__image;
            },
            setDetail: function(detail) {
                if (this.__detail === detail) return this;
                detail = moobile.Text.from(detail);
                if (this.__detail) {
                    this.__detail.replaceWithComponent(detail, true);
                } else {
                    this.addChildComponent(detail);
                }
                this.__detail = detail;
                this.__detail.addClass("list-item-detail");
                this.toggleClass("list-item-detail-empty", this.__detail.isEmpty());
                return this;
            },
            getDetail: function() {
                return this.__detail;
            },
            shouldAllowState: function(state) {
                if (this.hasStyle("header") && (state === "highlighted" || state === "selected" || state === "disabled")) {
                    return false;
                }
                return this.parent(state);
            }
        });
        moobile.ListItem.from = function(source) {
            if (source instanceof moobile.ListItem) return source;
            var item = new moobile.ListItem;
            item.setLabel(source);
            return item;
        };
        moobile.Component.defineRole("item", moobile.List, null, function(element) {
            this.addItem(moobile.Component.create(moobile.ListItem, element, "data-item"));
        });
        moobile.Component.defineRole("header", moobile.List, null, function(element) {
            this.addItem(moobile.Component.create(moobile.ListItem, element, "data-item").setStyle("header"));
        });
        moobile.Component.defineRole("image", moobile.ListItem, null, function(element) {
            this.setImage(moobile.Component.create(moobile.Image, element, "data-image"));
        });
        moobile.Component.defineRole("label", moobile.ListItem, null, function(element) {
            this.setLabel(moobile.Component.create(moobile.Text, element, "data-label"));
        });
        moobile.Component.defineRole("detail", moobile.ListItem, null, function(element) {
            this.setDetail(moobile.Component.create(moobile.Text, element, "data-detail"));
        });
        moobile.Component.defineRole("list-item", moobile.List, null, function(element) {
            console.log('[DEPRECATION NOTICE] The role "list-item" will be removed in 0.4, use the role "item" instead');
            this.addItem(moobile.Component.create(moobile.ListItem, element, "data-list-item"));
        });
        moobile.Component.defineStyle("header", moobile.ListItem, {
            attach: function(element) {
                element.addClass("style-header");
            },
            detach: function(element) {
                element.removeClass("style-header");
            }
        });
        moobile.Component.defineStyle("checked", moobile.ListItem, {
            attach: function(element) {
                element.addClass("style-checked");
            },
            detach: function(element) {
                element.removeClass("style-checked");
            }
        });
        moobile.Component.defineStyle("disclosed", moobile.ListItem, {
            attach: function(element) {
                element.addClass("style-disclosed");
            },
            detach: function(element) {
                element.removeClass("style-disclosed");
            }
        });
        moobile.Component.defineStyle("detailed", moobile.ListItem, {
            attach: function(element) {
                element.addClass("style-detailed");
            },
            detach: function(element) {
                element.removeClass("style-detailed");
            }
        });
    },
    "11": function(require, module, exports, global) {
        "use strict";
        var NavigationBar = moobile.NavigationBar = new Class({
            Extends: moobile.Bar,
            __title: null,
            contentElement: null,
            options: {
                title: null,
                centerTitle: true
            },
            willBuild: function() {
                this.parent();
                this.addClass("navigation-bar");
                var item = this.getRoleElement("item");
                if (item) {
                    console.log('[REMOVAL NOTICE] The role "item" has been removed in 0.3, use the role "content" instead or refer to the documentation.');
                    return;
                }
                var content = this.getRoleElement("content");
                if (content === null) {
                    content = document.createElement("div");
                    content.ingest(this.element);
                    content.inject(this.element);
                    content.setRole("content");
                }
                var fc = content.firstChild;
                var lc = content.lastChild;
                if (fc && fc.nodeType === 3 && lc && lc.nodeType === 3) {
                    var title = this.getRoleElement("title");
                    if (title === null) {
                        title = document.createElement("div");
                        title.ingest(content);
                        title.inject(content);
                        title.setRole("title");
                    }
                }
            },
            didBuild: function() {
                this.parent();
                var title = this.options.title;
                if (title) {
                    this.setTitle(title);
                }
            },
            destroy: function() {
                this.__title = null;
                this.parent();
            },
            setTitle: function(title) {
                if (this.__title === title) return this;
                title = moobile.Text.from(title);
                if (this.__title) {
                    this.__title.replaceWithComponent(title, true);
                } else {
                    this.addChildComponentInside(title, this.contentElement);
                }
                this.__title = title;
                this.__title.addClass("navigation-bar-title");
                this.toggleClass("navigation-bar-title-empty", this.__title.isEmpty());
                return this;
            },
            getTitle: function() {
                return this.__title;
            },
            didUpdateLayout: function() {
                console.log("Update Layout et CENTER TITLE");
                this.parent();
                if (!this.options.centerTitle) return this;
                var element = this.element;
                var content = this.contentElement;
                content.setStyle("padding-left", 0);
                content.setStyle("padding-right", 0);
                var elementSize = element.offsetWidth;
                var contentSize = content.offsetWidth;
                var contentPosition = content.offsetLeft;
                var offset = (elementSize / 2 - (contentPosition + contentSize / 2)) * 2;
                var fc = content.firstChild;
                var lc = content.lastChild;
                if (fc && fc.getPosition) {
                    var pos = fc.offsetLeft + offset;
                    if (pos < 0) {
                        offset += Math.abs(pos);
                    }
                }
                if (lc && lc.getPosition) {
                    var pos = lc.offsetLeft + lc.offsetWidth + offset;
                    if (pos > contentSize) {
                        offset -= Math.abs(contentSize - pos);
                    }
                }
                content.setStyle(offset < 0 ? "padding-right" : "padding-left", Math.abs(offset));
            },
            addLeftButton: function(button) {
                return this.addChildComponent(button, "top");
            },
            addRightButton: function(button) {
                return this.addChildComponent(button, "bottom");
            },
            getButton: function(name) {
                return this.getChildComponentByType(Button, name);
            },
            getButtonAt: function(index) {
                return this.getChildComponentByTypeAt(Button, index);
            },
            removeButton: function(button, destroy) {
                return this.removeChildComponent(button, destroy);
            },
            removeAllButtons: function(destroy) {
                return this.removeAllChildComponents(Button, destroy);
            }
        });
        moobile.Component.defineRole("navigation-bar", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(NavigationBar, element, "data-navigation-bar"));
        });
        moobile.Component.defineRole("content", NavigationBar, {
            traversable: true
        }, function(element) {
            this.contentElement = element;
            this.contentElement.addClass("navigation-bar-content");
        });
        moobile.Component.defineRole("title", NavigationBar, null, function(element) {
            this.setTitle(moobile.Component.create(moobile.Text, element, "data-title"));
        });
    },
    "12": function(require, module, exports, global) {
        "use strict";
        var Slider = moobile.Slider = new Class({
            Extends: moobile.Control,
            __activeTouch: null,
            __activeTouchOffsetX: null,
            __activeTouchOffsetY: null,
            __activeTouchInitialThumbX: null,
            __activeTouchInitialThumbY: null,
            _position: {
                x: -1,
                y: -1
            },
            _value: null,
            _minimum: 0,
            _maximum: 0,
            _valueRange: null,
            _trackRange: null,
            _trackLimit: {
                min: 0,
                max: 0
            },
            trackElement: null,
            thumbElement: null,
            rangeElement: null,
            valueElement: null,
            hitAreaElement: null,
            options: {
                mode: "horizontal",
                snap: false,
                value: 0,
                minimum: 0,
                maximum: 100
            },
            willBuild: function() {
                this.parent();
                this.addClass("slider");
                this.trackElement = document.createElement("div");
                this.trackElement.addClass("slider-track");
                this.trackElement.inject(this.element);
                this.thumbElement = document.createElement("div");
                this.thumbElement.addClass("slider-thumb");
                this.thumbElement.inject(this.trackElement);
                this.rangeElement = document.createElement("div");
                this.rangeElement.addClass("slider-range");
                this.rangeElement.inject(this.trackElement);
                this.valueElement = document.createElement("div");
                this.valueElement.addClass("slider-value");
                this.valueElement.inject(this.rangeElement);
                this.hitAreaElement = (new Element("div.hit-area")).inject(this.thumbElement);
                if ("min" in this.options || "max" in this.options) {
                    if ("min" in this.options) this.options.minimum = this.options.min;
                    if ("max" in this.options) this.options.maximum = this.options.max;
                    console.log('[DEPRECATION NOTICE] The options "min" and "max" will be removed in 0.4, use the "minimum" and "maximum" options instead');
                }
                var mode = this.options.mode;
                if (mode) {
                    this.addClass("slider-mode-" + mode);
                }
            },
            didBuild: function() {
                this.parent();
                this.element.addEvent("touchstart", this.bound("_onTouchStart"));
                this.element.addEvent("touchmove", this.bound("_onTouchMove"));
                this.element.addEvent("touchend", this.bound("_onTouchEnd"));
                this.thumbElement.addEvent("touchcancel", this.bound("_onThumbTouchCancel"));
                this.thumbElement.addEvent("touchstart", this.bound("_onThumbTouchStart"));
                this.thumbElement.addEvent("touchmove", this.bound("_onThumbTouchMove"));
                this.thumbElement.addEvent("touchend", this.bound("_onThumbTouchEnd"));
                this.setMinimum(this.options.minimum);
                this.setMaximum(this.options.maximum);
                var value = this.options.value;
                if (value !== null) {
                    this.setValue(value);
                }
            },
            didUpdateLayout: function() {
                this.parent();
                var trackSize = this.trackElement.getSize();
                var thumbSize = this.thumbElement.getSize();
                var range = 0;
                switch (this.options.mode) {
                  case "horizontal":
                    range = trackSize.x - thumbSize.x;
                    break;
                  case "vertical":
                    range = trackSize.y - thumbSize.y;
                    break;
                }
                this._valueRange = this._maximum - this._minimum;
                this._trackRange = range;
                this._trackLimit = {
                    min: 0,
                    max: range
                };
                var pos = this._positionFromValue(this._value);
                if (pos.x === this._position.x && pos.y === this._position.y) return;
                this._move(pos.x, pos.y);
            },
            destroy: function() {
                this.element.removeEvent("touchstart", this.bound("_onTouchStart"));
                this.element.removeEvent("touchmove", this.bound("_onTouchMove"));
                this.element.removeEvent("touchend", this.bound("_onTouchEnd"));
                this.thumbElement.removeEvent("touchcancel", this.bound("_onThumbTouchCancel"));
                this.thumbElement.removeEvent("touchstart", this.bound("_onThumbTouchStart"));
                this.thumbElement.removeEvent("touchmove", this.bound("_onThumbTouchMove"));
                this.thumbElement.removeEvent("touchend", this.bound("_onThumbTouchEnd"));
                this.thumbElement = null;
                this.trackElement = null;
                this.valueElement = null;
                this.rangeElement = null;
                this.parent();
            },
            setValue: function(value) {
                value = this.options.snap ? value.round() : value;
                if (this._value === value) return this;
                this._value = value;
                var pos = this._positionFromValue(value);
                if (pos.x !== this._position.x || pos.y !== this._position.y) {
                    this._move(pos.x, pos.y);
                }
                this.fireEvent("change", value);
                return this;
            },
            getValue: function() {
                return this._value;
            },
            setMinimum: function(minimum) {
                this._minimum = minimum;
                if (this._value < minimum) this.setValue(minimum);
                return this;
            },
            getMinimum: function() {
                return this._minimum;
            },
            setMaximum: function(maximum) {
                this._maximum = maximum;
                if (this._value > maximum) this.setValue(maximum);
                return this;
            },
            getMaximum: function() {
                return this._maximum;
            },
            _move: function(x, y) {
                if (!this.isBuilt() || !this.isReady() || !this.isVisible()) return this;
                switch (this.options.mode) {
                  case "horizontal":
                    y = 0;
                    if (x < this._trackLimit.min) x = this._trackLimit.min;
                    if (x > this._trackLimit.max) x = this._trackLimit.max;
                    break;
                  case "vertical":
                    x = 0;
                    if (y < this._trackLimit.min) y = this._trackLimit.min;
                    if (y > this._trackLimit.max) y = this._trackLimit.max;
                    break;
                }
                this._position.x = x;
                this._position.y = y;
                this.thumbElement.setStyle("transform", "translate3d(" + x + "px, " + y + "px, 0)");
                this.valueElement.setStyle("transform", "translate3d(" + x + "px, " + y + "px, 0)");
                return this;
            },
            _valueFromPosition: function(x, y) {
                return (this.options.mode === "horizontal" ? x : y) * this._valueRange / this._trackRange + this._minimum;
            },
            _positionFromValue: function(value) {
                var x = 0;
                var y = 0;
                var pos = (value - this._minimum) * this._trackRange / this._valueRange;
                switch (this.options.mode) {
                  case "horizontal":
                    x = pos.round(2);
                    break;
                  case "vertical":
                    y = pos.round(2);
                    break;
                }
                return {
                    x: x,
                    y: y
                };
            },
            _onTouchStart: function(e) {
                e.stop();
            },
            _onTouchMove: function(e) {
                e.stop();
            },
            _onTouchEnd: function(e) {
                e.stop();
            },
            _onThumbTouchCancel: function(e) {
                this.__activeTouch = null;
                this.__activeTouchOffsetX = null;
                this.__activeTouchOffsetY = null;
                this.__activeTouchInitialThumbX = null;
                this.__activeTouchInitialThumbY = null;
            },
            _onThumbTouchStart: function(e) {
                var touch = e.changedTouches[0];
                if (this.__activeTouch === null) {
                    this.__activeTouch = touch;
                    this.__activeTouchOffsetX = touch.pageX;
                    this.__activeTouchOffsetY = touch.pageY;
                    this.__activeTouchInitialThumbX = this._position.x;
                    this.__activeTouchInitialThumbY = this._position.y;
                }
            },
            _onThumbTouchMove: function(e) {
                var touch = e.changedTouches[0];
                if (this.__activeTouch.identifier === touch.identifier) {
                    var x = touch.pageX - this.__activeTouchOffsetX + this.__activeTouchInitialThumbX;
                    var y = touch.pageY - this.__activeTouchOffsetY + this.__activeTouchInitialThumbY;
                    this.setValue(this._valueFromPosition(x, y));
                }
            },
            _onThumbTouchEnd: function(e) {
                if (this.__activeTouch.identifier === e.changedTouches[0].identifier) {
                    this.__activeTouch = null;
                    this.__activeTouchOffsetX = null;
                    this.__activeTouchOffsetY = null;
                    this.__activeTouchInitialThumbX = null;
                    this.__activeTouchInitialThumbY = null;
                }
            }
        });
        moobile.Component.defineRole("slider", null, function(element) {
            this.addChildComponent(moobile.Component.create(Slider, element, "data-slider"));
        });
    },
    "13": function(require, module, exports, global) {
        "use strict";
        var TabBar = moobile.TabBar = new Class({
            Extends: moobile.Bar,
            _selectedTab: null,
            _selectedTabIndex: -1,
            options: {
                selectedTabIndex: -1,
                tabs: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("tab-bar");
            },
            didBuild: function() {
                this.parent();
                var tabs = this.options.tabs;
                if (tabs) this.addTabs(tabs);
            },
            setSelectedTab: function(selectedTab) {
                if (this._selectedTab === selectedTab) return this;
                if (this._selectedTab) {
                    this._selectedTab.setSelected(false);
                    this.fireEvent("deselect", this._selectedTab);
                    this._selectedTab = null;
                }
                this._selectedTabIndex = selectedTab ? this.getChildComponentIndex(selectedTab) : -1;
                if (selectedTab) {
                    this._selectedTab = selectedTab;
                    this._selectedTab.setSelected(true);
                    this.fireEvent("select", this._selectedTab);
                }
                return this;
            },
            getSelectedTab: function() {
                return this._selectedTab;
            },
            setSelectedTabIndex: function(index) {
                var child = null;
                if (index >= 0) {
                    child = this.getChildComponentByTypeAt(Tab, index);
                }
                return this.setSelectedTab(child);
            },
            getSelectedTabIndex: function() {
                return this._selectedTabIndex;
            },
            clearSelectedTab: function() {
                this.setSelectedTab(null);
                return this;
            },
            addTab: function(tab, where) {
                return this.addChildComponent(Tab.from(tab), where);
            },
            addTabAfter: function(tab, after) {
                return this.addChildComponentAfter(Tab.from(tab), after);
            },
            addTabBefore: function(tab, before) {
                return this.addChildComponentBefore(Tab.from(tab), before);
            },
            addTabs: function(tabs, where) {
                return this.addChildComponents(Tab.from(tab), where);
            },
            addTabsAfter: function(tabs, after) {
                return this.addChildComponentsAfter(tabs.map(function(tab) {
                    return Tab.from(tab);
                }), after);
            },
            addTabsBefore: function(tabs, before) {
                return this.addChildComponentsBefore(tabs.map(function(tab) {
                    return Tab.from(tab);
                }), before);
            },
            getTabs: function() {
                return this.getChildComponentsByType(Tab);
            },
            getTab: function(name) {
                return this.getChildComponentByType(Tab, name);
            },
            getTabAt: function(index) {
                return this.getChildComponentByTypeAt(Tab, index);
            },
            removeTab: function(tab, destroy) {
                return this.removeChildComponent(tab, destroy);
            },
            removeAllTabs: function(destroy) {
                return this.removeAllChildComponentsByType(Tab, destroy);
            },
            willRemoveChildComponent: function(component) {
                this.parent(component);
                if (this._selectedTab === component) {
                    this.clearSelectedTab();
                }
            },
            didAddChildComponent: function(child) {
                this.parent(child);
                if (child instanceof Tab) {
                    child.addEvent("tap", this.bound("onTabTap"));
                }
            },
            didRemoveChildComponent: function(child) {
                this.parent(child);
                if (child instanceof Tab) {
                    child.removeEvent("tap", this.bound("onTabTap"));
                }
            },
            didChangeState: function(state) {
                this.parent(state);
                if (state === "disabled" || state == null) {
                    this.getChildComponents().invoke("setDisabled", state);
                }
            },
            onTabTap: function(e, sender) {
                this.setSelectedTab(sender);
            }
        });
        moobile.Component.defineRole("tab-bar", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(Tabmoobile.Bar, element, "data-tab-bar"));
        });
    },
    "14": function(require, module, exports, global) {
        "use strict";
        var Tab = moobile.Tab = new Class({
            Extends: moobile.Control,
            _label: null,
            _image: null,
            options: {
                label: null,
                image: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("tab");
                var image = this.getRoleElement("image");
                var label = this.getRoleElement("label");
                if (label === null) {
                    label = document.createElement("div");
                    label.ingest(this.element);
                    label.inject(this.element);
                    label.setRole("label");
                }
                if (image === null) {
                    image = document.createElement("div");
                    image.inject(this.element, "top");
                    image.setRole("image");
                }
            },
            didBuild: function() {
                this.parent();
                var image = this.options.image;
                var label = this.options.label;
                if (image) this.setImage(image);
                if (label) this.setLabel(label);
            },
            destroy: function() {
                this._label = null;
                this._image = null;
                this.parent();
            },
            setLabel: function(label) {
                if (this._label === label) return this;
                label = moobile.Text.from(label);
                if (this._label) {
                    this._label.replaceWithComponent(label, true);
                } else {
                    this.addChildComponent(label);
                }
                this._label = label;
                this._label.addClass("tab-label");
                this.toggleClass("tab-label-empty", this._label.isEmpty());
                return this;
            },
            getLabel: function() {
                return this._label;
            },
            setImage: function(image) {
                if (this._image === image) return this;
                image = moobile.Image.from(image);
                if (this._image) {
                    this._image.replaceWithComponent(image, true);
                } else {
                    this.addChildComponent(image);
                }
                this._image = image;
                this._image.addClass("tab-image");
                this.toggleClass("tab-image-empty", this._image.isEmpty());
                return this;
            },
            getImage: function() {
                return this._image;
            }
        });
        Tab.from = function(source) {
            if (source instanceof Tab) return source;
            var tab = new Tab;
            tab.setLabel(source);
            return tab;
        };
        moobile.Component.defineRole("tab", moobile.TabBar, null, function(element) {
            this.addTab(moobile.Component.create(Tab, element, "data-tab"));
        });
        moobile.Component.defineRole("label", Tab, null, function(element) {
            this.setLabel(moobile.Component.create(moobile.Text, element, "data-label"));
        });
        moobile.Component.defineRole("image", Tab, null, function(element) {
            this.setImage(moobile.Component.create(moobile.Image, element, "data-image"));
        });
    },
    "15": function(require, module, exports, global) {
        "use strict";
        var Alert = moobile.Alert = new Class({
            Extends: moobile.Component,
            _title: null,
            _message: null,
            _buttons: [],
            boxElement: null,
            contentElement: null,
            headerElement: null,
            footerElement: null,
            overlay: null,
            options: {
                layout: "horizontal",
                title: null,
                message: null,
                buttons: null
            },
            willBuild: function() {
                this.parent();
                this.addClass("alert");
                this.addEvent("animationend", this.bound("_onAnimationEnd"));
                this.overlay = new Overlay;
                this.overlay.hide();
                this.addChildComponent(this.overlay);
                this.headerElement = document.createElement("div");
                this.headerElement.addClass("alert-header");
                this.footerElement = document.createElement("div");
                this.footerElement.addClass("alert-footer");
                this.contentElement = document.createElement("div");
                this.contentElement.addClass("alert-content");
                this.boxElement = document.createElement("div");
                this.boxElement.addClass("alert-box");
                this.boxElement.grab(this.headerElement);
                this.boxElement.grab(this.contentElement);
                this.boxElement.grab(this.footerElement);
                this.element.grab(this.boxElement);
                var layout = this.options.layout;
                if (layout) {
                    this.addClass("alert-layout-" + layout);
                }
            },
            didBuild: function() {
                this.parent();
                this.setTitle(this.options.title);
                this.setMessage(this.options.message);
                var buttons = this.options.buttons;
                if (buttons) {
                    this.addButtons(buttons);
                }
            },
            destroy: function() {
                this.removeEvent("animationend", this.bound("_onAnimationEnd"));
                this._title = null;
                this._message = null;
                this.boxElement = null;
                this.headerElement = null;
                this.footerElement = null;
                this.contentElement = null;
                this.overlay.destroy();
                this.overlay = null;
                this.parent();
            },
            setTitle: function(title) {
                if (this._title === title) return this;
                title = moobile.Text.from(title);
                if (this._title) {
                    this._title.replaceWithComponent(title, true);
                } else {
                    this.addChildComponentInside(title, this.headerElement);
                }
                this._title = title;
                this._title.addClass("alert-title");
                this.toggleClass("alert-title-empty", this._title.isEmpty());
                return this;
            },
            getTitle: function() {
                return this._title;
            },
            setMessage: function(message) {
                if (this._message === message) return this;
                message = moobile.Text.from(message);
                if (this._message) {
                    this._message.replaceWithComponent(message, true);
                } else {
                    this.addChildComponentInside(message, this.contentElement);
                }
                this._message = message;
                this._message.addClass("alert-message");
                this.toggleClass("alert-message-empty", this._message.isEmpty());
                return this;
            },
            getMessage: function() {
                return this._message;
            },
            addButton: function(button, where) {
                return this.addChildComponentInside(moobile.Button.from(button), this.footerElement, where);
            },
            addButtonAfter: function(button, after) {
                return this.addChildComponentAfter(moobile.Button.from(button), after);
            },
            addButtonBefore: function(button, before) {
                return this.addChildComponentBefore(moobile.Button.from(button), before);
            },
            addButtons: function(buttons, where) {
                return this.addChildComponentsInside(buttons.map(function(button) {
                    return moobile.Button.from(button);
                }), this.footerElement, where);
            },
            addButtonsAfter: function(buttons, after) {
                return this.addChildComponentsAfter(buttons.map(function(button) {
                    return moobile.Button.from(button);
                }), after);
            },
            addButtonsBefore: function(buttons, before) {
                return this.addChildComponentBefore(buttons.map(function(button) {
                    return moobile.Button.from(button);
                }), before);
            },
            getButtons: function() {
                return this.getChildComponentsByType(moobile.Button);
            },
            getButton: function(name) {
                return this.getChildComponentByType(moobile.Button, name);
            },
            getButtonAt: function(index) {
                return this.getChildComponentByTypeAt(moobile.Button, index);
            },
            removeButton: function(button, destroy) {
                return this.removeChildComponent(button, destroy);
            },
            removeAllButtons: function(destroy) {
                return this.removeAllChildComponentsByType(moobile.Button, destroy);
            },
            setDefaultButton: function(button) {
                if (this.hasChildComponent(button)) button.addClass("is-default");
                return this;
            },
            setDefaultButtonIndex: function(index) {
                return this.setDefaultButton(this.getChildComponentByTypeAt(moobile.Button, index));
            },
            showAnimated: function() {
                this.willShow();
                this.element.addClass("show-animated").removeClass("hidden");
                this.overlay.showAnimated();
                return this;
            },
            hideAnimated: function() {
                this.willHide();
                this.element.addClass("hide-animated");
                this.overlay.hideAnimated();
                return this;
            },
            didAddChildComponent: function(component) {
                this.parent(component);
                if (component instanceof moobile.Button) {
                    component.addEvent("tap", this.bound("_onButtonTap"));
                    this._buttons.include(component);
                }
            },
            didRemoveChildComponent: function(component) {
                this.parent(component);
                if (component instanceof moobile.Button) {
                    component.removeEvent("tap", this.bound("_onButtonTap"));
                    this._buttons.erase(component);
                }
            },
            willShow: function() {
                this.parent();
                if (this.getParentView() === null) {
                    var instance = Window.getCurrentInstance();
                    if (instance) {
                        instance.addChildComponent(this);
                    }
                }
                if (this._buttons.length === 0) this.addButton("OK");
            },
            didHide: function() {
                this.parent();
                this.removeFromParentmoobile.Component();
            },
            _onButtonTap: function(e, sender) {
                var index = this.getChildComponentsByType(moobile.Button).indexOf(sender);
                if (index >= 0) {
                    this.fireEvent("dismiss", [ sender, index ]);
                }
                this.hideAnimated();
            },
            _onAnimationEnd: function(e) {
                e.stop();
                if (this.hasClass("show-animated")) {
                    this.removeClass("show-animated");
                    this.didShow();
                }
                if (this.hasClass("hide-animated")) {
                    this.addClass("hidden").removeClass("hide-animated");
                    this.didHide();
                }
            }
        });
    },
    "16": function(require, module, exports, global) {
        "use strict";
        var Scroller = moobile.Scroller = new Class({
            Extends: moobile.Emitter,
            contentElement: null,
            contentWrapperElement: null,
            options: {
                scroll: "vertial",
                scrollbar: "vertical",
                momentum: true,
                bounce: true
            },
            initialize: function(contentElement, contentWrapperElement, options) {
                this.contentElement = document.id(contentElement);
                this.contentWrapperElement = document.id(contentWrapperElement);
                this.contentWrapperElement.addClass("scrollable");
                this.setOptions(options);
                return this;
            },
            destroy: function() {
                this.contentElement = null;
                this.contentWrapperElement = null;
                return this;
            },
            getName: function() {
                throw new Error("You must override this method");
            },
            scrollTo: function(x, y, time) {
                throw new Error("You must override this method");
            },
            scrollToElement: function(element, time) {
                throw new Error("You must override this method");
            },
            refresh: function() {
                throw new Error("You must override this method");
            },
            getScroll: function() {
                throw new Error("You must override this method");
            }
        });
        Scroller.create = function(contentElement, contentWrapperElement, scrollers, options) {
            var scroller = null;
            scrollers = scrollers ? Array.from(scrollers) : [ "IScroll.Android", "Native", "IScroll" ];
            for (var i = 0; i < scrollers.length; i++) {
                var candidate = Class.parse("moobile.Scroller." + scrollers[i]);
                if (candidate === null) {
                    throw new Error("The scroller scroller " + scrollers[i] + " does not exists");
                }
                if (candidate.supportsCurrentPlatform === undefined || candidate.supportsCurrentPlatform && candidate.supportsCurrentPlatform.call(this)) {
                    scroller = candidate;
                    break;
                }
            }
            if (scroller === null) {
                throw new Error("A proper scroller was not found");
            }
            return new scroller(contentElement, contentWrapperElement, options);
        };
        window.addEvent("domready", function(e) {
            var scrolls = {};
            document.addEvent("touchstart", function(e) {
                var touches = e.changedTouches;
                for (var i = 0, l = touches.length; i < l; i++) {
                    var touch = touches[i];
                    var target = touch.target;
                    var identifier = touch.identifier;
                    if (target.tagName.match(/input|textarea|select/i)) {
                        scrolls[identifier] = false;
                        return;
                    }
                    if (target.hasClass("scrollable") || target.getParent(".scrollable")) {
                        scrolls[identifier] = true;
                    } else {
                        scroll[identifier] = false;
                        e.preventDefault();
                    }
                }
            });
            document.addEvent("touchmove", function(e) {
                var touches = e.changedTouches;
                for (var i = 0, l = touches.length; i < l; i++) {
                    if (scrolls[touches[i].identifier] === false) e.preventDefault();
                }
            });
            document.addEvent("touchend", function(e) {
                var touches = e.changedTouches;
                for (var i = 0, l = touches.length; i < l; i++) {
                    delete scrolls[touches[i].identifier];
                }
            });
        });
    },
    "17": function(require, module, exports, global) {
        "use strict";
        var iScroll = require("18").iScroll;
        var touch = null;
        var IScroll = moobile.Scroller.IScroll = new Class({
            Extends: moobile.Scroller,
            scroller: null,
            initialize: function(contentElement, contentWrapperElement, options) {
                this.parent(contentElement, contentWrapperElement, options);
                this.scroller = new iScroll(contentWrapperElement, {
                    scrollbarClass: "scrollbar-",
                    hScroll: this.options.scroll === "both" || this.options.scroll === "horizontal",
                    vScroll: this.options.scroll === "both" || this.options.scroll === "vertical",
                    hScrollbar: this.options.scrollbar === "both" || this.options.scrollbar === "horizontal",
                    vScrollbar: this.options.scrollbar === "both" || this.options.scrollbar === "vertical",
                    momentum: this.options.momentum,
                    bounce: this.options.bounce,
                    hideScrollbar: true,
                    fadeScrollbar: true,
                    checkDOMChanges: true,
                    onBeforeScrollStart: this.bound("_onBeforeScrollStart"),
                    onScrollStart: this.bound("_onScrollStart"),
                    onScrollMove: this.bound("_onScrollMove"),
                    onScrollEnd: this.bound("_onScrollEnd"),
                    onTouchEnd: this.bound("_onTouchEnd")
                });
                window.addEvent("resize", this.bound("refresh"));
                return this;
            },
            destroy: function() {
                window.removeEvent("resize", this.bound("refresh"));
                this.scroller.destroy();
                this.scroller = null;
                return this.parent();
            },
            getName: function() {
                return "iscroll";
            },
            scrollTo: function(x, y, time) {
                this.scroller.scrollTo(-x, -y, time || 0);
                return this;
            },
            scrollToElement: function(element, time) {
                this.scroller.scrollToElement(document.id(element), time || 0);
                return this;
            },
            refresh: function() {
                this.scroller.refresh();
                return this;
            },
            getScroll: function() {
                return {
                    x: -this.scroller.x,
                    y: -this.scroller.y
                };
            },
            _onBeforeScrollStart: function(e) {
                var target = e.target.get("tag");
                if (target !== "input" && target !== "select" && target !== "textarea") {
                    e.preventDefault();
                }
            },
            _onScrollStart: function(e) {
                if (!Browser.Features.Touch) {
                    touch = {
                        identifier: String.uniqueID(),
                        target: e.target,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        clientX: e.clientX,
                        clientY: e.clientY
                    };
                    e.touches = e.targetTouches = e.changedTouches = [ touch ];
                }
                this.fireEvent("touchstart", e);
                this.fireEvent("scrollstart");
            },
            _onScrollMove: function(e) {
                if (!Browser.Features.Touch) {
                    touch.pageX = e.pageX;
                    touch.pageY = e.pageY;
                    touch.clientX = e.clientX;
                    touch.clientY = e.clientY;
                    e.touches = e.targetTouches = e.changedTouches = [ touch ];
                }
                this.fireEvent("touchmove", e);
                this.fireEvent("scroll");
            },
            _onScrollEnd: function() {
                this.fireEvent("scroll");
                this.fireEvent("scrollend");
            },
            _onTouchEnd: function(e) {
                if (!Browser.Features.Touch) {
                    touch.pageX = e.pageX;
                    touch.pageY = e.pageY;
                    touch.clientX = e.clientX;
                    touch.clientY = e.clientY;
                    e.touches = [];
                    e.targetTouches = [];
                    e.changedTouches = [ touch ];
                    touch = null;
                }
                this.fireEvent("touchend", e);
            }
        });
        moobile.Scroller.IScroll.supportsCurrentPlatform = function() {
            return true;
        };
    },
    "18": function(require, module, exports, global) {
        (function(window, doc) {
            var m = Math, dummyStyle = doc.createElement("div").style, vendor = function() {
                var vendors = "t,webkitT,MozT,msT,OT".split(","), t, i = 0, l = vendors.length;
                for (; i < l; i++) {
                    t = vendors[i] + "ransform";
                    if (t in dummyStyle) {
                        return vendors[i].substr(0, vendors[i].length - 1);
                    }
                }
                return false;
            }(), cssVendor = vendor ? "-" + vendor.toLowerCase() + "-" : "", transform = prefixStyle("transform"), transitionProperty = prefixStyle("transitionProperty"), transitionDuration = prefixStyle("transitionDuration"), transformOrigin = prefixStyle("transformOrigin"), transitionTimingFunction = prefixStyle("transitionTimingFunction"), transitionDelay = prefixStyle("transitionDelay"), isAndroid = /android/gi.test(navigator.appVersion), isIDevice = /iphone|ipad/gi.test(navigator.appVersion), isTouchPad = /hp-tablet/gi.test(navigator.appVersion), has3d = prefixStyle("perspective") in dummyStyle, hasTouch = "ontouchstart" in window && !isTouchPad, hasTransform = vendor !== false, hasTransitionEnd = prefixStyle("transition") in dummyStyle, RESIZE_EV = "onorientationchange" in window ? "orientationchange" : "resize", START_EV = hasTouch ? "touchstart" : "mousedown", MOVE_EV = hasTouch ? "touchmove" : "mousemove", END_EV = hasTouch ? "touchend" : "mouseup", CANCEL_EV = hasTouch ? "touchcancel" : "mouseup", TRNEND_EV = function() {
                if (vendor === false) return false;
                var transitionEnd = {
                    "": "transitionend",
                    webkit: "webkitTransitionEnd",
                    Moz: "transitionend",
                    O: "otransitionend",
                    ms: "MSTransitionEnd"
                };
                return transitionEnd[vendor];
            }(), nextFrame = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                    return setTimeout(callback, 1);
                };
            }(), cancelFrame = function() {
                return window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout;
            }(), translateZ = has3d ? " translateZ(0)" : "", iScroll = function(el, options) {
                var that = this, i;
                that.wrapper = typeof el == "object" ? el : doc.getElementById(el);
                that.wrapper.style.overflow = "hidden";
                that.scroller = that.wrapper.children[0];
                that.options = {
                    hScroll: true,
                    vScroll: true,
                    x: 0,
                    y: 0,
                    bounce: true,
                    bounceLock: false,
                    momentum: true,
                    lockDirection: true,
                    useTransform: true,
                    useTransition: false,
                    topOffset: 0,
                    checkDOMChanges: false,
                    handleClick: true,
                    hScrollbar: true,
                    vScrollbar: true,
                    fixedScrollbar: isAndroid,
                    hideScrollbar: isIDevice,
                    fadeScrollbar: isIDevice && has3d,
                    scrollbarClass: "",
                    zoom: false,
                    zoomMin: 1,
                    zoomMax: 4,
                    doubleTapZoom: 2,
                    wheelAction: "scroll",
                    snap: false,
                    snapThreshold: 1,
                    onRefresh: null,
                    onBeforeScrollStart: function(e) {
                        e.preventDefault();
                    },
                    onScrollStart: null,
                    onBeforeScrollMove: null,
                    onScrollMove: null,
                    onBeforeScrollEnd: null,
                    onScrollEnd: null,
                    onTouchEnd: null,
                    onDestroy: null,
                    onZoomStart: null,
                    onZoom: null,
                    onZoomEnd: null
                };
                for (i in options) that.options[i] = options[i];
                that.x = that.options.x;
                that.y = that.options.y;
                that.options.useTransform = hasTransform && that.options.useTransform;
                that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
                that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
                that.options.zoom = that.options.useTransform && that.options.zoom;
                that.options.useTransition = hasTransitionEnd && that.options.useTransition;
                if (that.options.zoom && isAndroid) {
                    translateZ = "";
                }
                that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + "transform" : "top left";
                that.scroller.style[transitionDuration] = "0";
                that.scroller.style[transformOrigin] = "0 0";
                if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = "cubic-bezier(0.33,0.66,0.66,1)";
                if (that.options.useTransform) that.scroller.style[transform] = "translate(" + that.x + "px," + that.y + "px)" + translateZ; else that.scroller.style.cssText += ";position:absolute;top:" + that.y + "px;left:" + that.x + "px";
                if (that.options.useTransition) that.options.fixedScrollbar = true;
                that.refresh();
                that._bind(RESIZE_EV, window);
                that._bind(START_EV);
                if (!hasTouch) {
                    if (that.options.wheelAction != "none") {
                        that._bind("DOMMouseScroll");
                        that._bind("mousewheel");
                    }
                }
                if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function() {
                    that._checkDOMChanges();
                }, 500);
            };
            iScroll.prototype = {
                enabled: true,
                x: 0,
                y: 0,
                steps: [],
                scale: 1,
                currPageX: 0,
                currPageY: 0,
                pagesX: [],
                pagesY: [],
                aniTime: null,
                wheelZoomCount: 0,
                handleEvent: function(e) {
                    var that = this;
                    switch (e.type) {
                      case START_EV:
                        if (!hasTouch && e.button !== 0) return;
                        that._start(e);
                        break;
                      case MOVE_EV:
                        that._move(e);
                        break;
                      case END_EV:
                      case CANCEL_EV:
                        that._end(e);
                        break;
                      case RESIZE_EV:
                        that._resize();
                        break;
                      case "DOMMouseScroll":
                      case "mousewheel":
                        that._wheel(e);
                        break;
                      case TRNEND_EV:
                        that._transitionEnd(e);
                        break;
                    }
                },
                _checkDOMChanges: function() {
                    if (this.moved || this.zoomed || this.animating || this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale) return;
                    this.refresh();
                },
                _scrollbar: function(dir) {
                    var that = this, bar;
                    if (!that[dir + "Scrollbar"]) {
                        if (that[dir + "ScrollbarWrapper"]) {
                            if (hasTransform) that[dir + "ScrollbarIndicator"].style[transform] = "";
                            that[dir + "ScrollbarWrapper"].parentNode.removeChild(that[dir + "ScrollbarWrapper"]);
                            that[dir + "ScrollbarWrapper"] = null;
                            that[dir + "ScrollbarIndicator"] = null;
                        }
                        return;
                    }
                    if (!that[dir + "ScrollbarWrapper"]) {
                        bar = doc.createElement("div");
                        if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase(); else bar.style.cssText = "position:absolute;z-index:100;" + (dir == "h" ? "height:7px;bottom:1px;left:2px;right:" + (that.vScrollbar ? "7" : "2") + "px" : "width:7px;bottom:" + (that.hScrollbar ? "7" : "2") + "px;top:2px;right:1px");
                        bar.style.cssText += ";pointer-events:none;" + cssVendor + "transition-property:opacity;" + cssVendor + "transition-duration:" + (that.options.fadeScrollbar ? "350ms" : "0") + ";overflow:hidden;opacity:" + (that.options.hideScrollbar ? "0" : "1");
                        that.wrapper.appendChild(bar);
                        that[dir + "ScrollbarWrapper"] = bar;
                        bar = doc.createElement("div");
                        if (!that.options.scrollbarClass) {
                            bar.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);" + cssVendor + "background-clip:padding-box;" + cssVendor + "box-sizing:border-box;" + (dir == "h" ? "height:100%" : "width:100%") + ";" + cssVendor + "border-radius:3px;border-radius:3px";
                        }
                        bar.style.cssText += ";pointer-events:none;" + cssVendor + "transition-property:" + cssVendor + "transform;" + cssVendor + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);" + cssVendor + "transition-duration:0;" + cssVendor + "transform: translate(0,0)" + translateZ;
                        if (that.options.useTransition) bar.style.cssText += ";" + cssVendor + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)";
                        that[dir + "ScrollbarWrapper"].appendChild(bar);
                        that[dir + "ScrollbarIndicator"] = bar;
                    }
                    if (dir == "h") {
                        that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
                        that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
                        that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + "px";
                        that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
                        that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
                    } else {
                        that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
                        that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
                        that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + "px";
                        that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
                        that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
                    }
                    that._scrollbarPos(dir, true);
                },
                _resize: function() {
                    var that = this;
                    setTimeout(function() {
                        that.refresh();
                    }, isAndroid ? 200 : 0);
                },
                _pos: function(x, y) {
                    if (this.zoomed) return;
                    x = this.hScroll ? x : 0;
                    y = this.vScroll ? y : 0;
                    if (this.options.useTransform) {
                        this.scroller.style[transform] = "translate(" + x + "px," + y + "px) scale(" + this.scale + ")" + translateZ;
                    } else {
                        x = m.round(x);
                        y = m.round(y);
                        this.scroller.style.left = x + "px";
                        this.scroller.style.top = y + "px";
                    }
                    this.x = x;
                    this.y = y;
                    this._scrollbarPos("h");
                    this._scrollbarPos("v");
                },
                _scrollbarPos: function(dir, hidden) {
                    var that = this, pos = dir == "h" ? that.x : that.y, size;
                    if (!that[dir + "Scrollbar"]) return;
                    pos = that[dir + "ScrollbarProp"] * pos;
                    if (pos < 0) {
                        if (!that.options.fixedScrollbar) {
                            size = that[dir + "ScrollbarIndicatorSize"] + m.round(pos * 3);
                            if (size < 8) size = 8;
                            that[dir + "ScrollbarIndicator"].style[dir == "h" ? "width" : "height"] = size + "px";
                        }
                        pos = 0;
                    } else if (pos > that[dir + "ScrollbarMaxScroll"]) {
                        if (!that.options.fixedScrollbar) {
                            size = that[dir + "ScrollbarIndicatorSize"] - m.round((pos - that[dir + "ScrollbarMaxScroll"]) * 3);
                            if (size < 8) size = 8;
                            that[dir + "ScrollbarIndicator"].style[dir == "h" ? "width" : "height"] = size + "px";
                            pos = that[dir + "ScrollbarMaxScroll"] + (that[dir + "ScrollbarIndicatorSize"] - size);
                        } else {
                            pos = that[dir + "ScrollbarMaxScroll"];
                        }
                    }
                    that[dir + "ScrollbarWrapper"].style[transitionDelay] = "0";
                    that[dir + "ScrollbarWrapper"].style.opacity = hidden && that.options.hideScrollbar ? "0" : "1";
                    that[dir + "ScrollbarIndicator"].style[transform] = "translate(" + (dir == "h" ? pos + "px,0)" : "0," + pos + "px)") + translateZ;
                },
                _start: function(e) {
                    var that = this, point = hasTouch ? e.touches[0] : e, matrix, x, y, c1, c2;
                    if (!that.enabled) return;
                    if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);
                    if (that.options.useTransition || that.options.zoom) that._transitionTime(0);
                    that.moved = false;
                    that.animating = false;
                    that.zoomed = false;
                    that.distX = 0;
                    that.distY = 0;
                    that.absDistX = 0;
                    that.absDistY = 0;
                    that.dirX = 0;
                    that.dirY = 0;
                    if (that.options.zoom && hasTouch && e.touches.length > 1) {
                        c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                        c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                        that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);
                        that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
                        that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;
                        if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                    }
                    if (that.options.momentum) {
                        if (that.options.useTransform) {
                            matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, "").split(",");
                            x = +(matrix[12] || matrix[4]);
                            y = +(matrix[13] || matrix[5]);
                        } else {
                            x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, "");
                            y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, "");
                        }
                        if (x != that.x || y != that.y) {
                            if (that.options.useTransition) that._unbind(TRNEND_EV); else cancelFrame(that.aniTime);
                            that.steps = [];
                            that._pos(x, y);
                            if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                        }
                    }
                    that.absStartX = that.x;
                    that.absStartY = that.y;
                    that.startX = that.x;
                    that.startY = that.y;
                    that.pointX = point.pageX;
                    that.pointY = point.pageY;
                    that.startTime = e.timeStamp || Date.now();
                    if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);
                    that._bind(MOVE_EV, window);
                    that._bind(END_EV, window);
                    that._bind(CANCEL_EV, window);
                },
                _move: function(e) {
                    var that = this, point = hasTouch ? e.touches[0] : e, deltaX = point.pageX - that.pointX, deltaY = point.pageY - that.pointY, newX = that.x + deltaX, newY = that.y + deltaY, c1, c2, scale, timestamp = e.timeStamp || Date.now();
                    if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);
                    if (that.options.zoom && hasTouch && e.touches.length > 1) {
                        c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                        c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                        that.touchesDist = m.sqrt(c1 * c1 + c2 * c2);
                        that.zoomed = true;
                        scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;
                        if (scale < that.options.zoomMin) scale = .5 * that.options.zoomMin * Math.pow(2, scale / that.options.zoomMin); else if (scale > that.options.zoomMax) scale = 2 * that.options.zoomMax * Math.pow(.5, that.options.zoomMax / scale);
                        that.lastScale = scale / this.scale;
                        newX = this.originX - this.originX * that.lastScale + this.x, newY = this.originY - this.originY * that.lastScale + this.y;
                        this.scroller.style[transform] = "translate(" + newX + "px," + newY + "px) scale(" + scale + ")" + translateZ;
                        if (that.options.onZoom) that.options.onZoom.call(that, e);
                        return;
                    }
                    that.pointX = point.pageX;
                    that.pointY = point.pageY;
                    if (newX > 0 || newX < that.maxScrollX) {
                        newX = that.options.bounce ? that.x + deltaX / 2 : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
                    }
                    if (newY > that.minScrollY || newY < that.maxScrollY) {
                        newY = that.options.bounce ? that.y + deltaY / 2 : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
                    }
                    that.distX += deltaX;
                    that.distY += deltaY;
                    that.absDistX = m.abs(that.distX);
                    that.absDistY = m.abs(that.distY);
                    if (that.absDistX < 6 && that.absDistY < 6) {
                        return;
                    }
                    if (that.options.lockDirection) {
                        if (that.absDistX > that.absDistY + 5) {
                            newY = that.y;
                            deltaY = 0;
                        } else if (that.absDistY > that.absDistX + 5) {
                            newX = that.x;
                            deltaX = 0;
                        }
                    }
                    that.moved = true;
                    that._pos(newX, newY);
                    that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                    that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
                    if (timestamp - that.startTime > 300) {
                        that.startTime = timestamp;
                        that.startX = that.x;
                        that.startY = that.y;
                    }
                    if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
                },
                _end: function(e) {
                    if (hasTouch && e.touches.length !== 0) return;
                    var that = this, point = hasTouch ? e.changedTouches[0] : e, target, ev, momentumX = {
                        dist: 0,
                        time: 0
                    }, momentumY = {
                        dist: 0,
                        time: 0
                    }, duration = (e.timeStamp || Date.now()) - that.startTime, newPosX = that.x, newPosY = that.y, distX, distY, newDuration, snap, scale;
                    that._unbind(MOVE_EV, window);
                    that._unbind(END_EV, window);
                    that._unbind(CANCEL_EV, window);
                    if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);
                    if (that.zoomed) {
                        scale = that.scale * that.lastScale;
                        scale = Math.max(that.options.zoomMin, scale);
                        scale = Math.min(that.options.zoomMax, scale);
                        that.lastScale = scale / that.scale;
                        that.scale = scale;
                        that.x = that.originX - that.originX * that.lastScale + that.x;
                        that.y = that.originY - that.originY * that.lastScale + that.y;
                        that.scroller.style[transitionDuration] = "200ms";
                        that.scroller.style[transform] = "translate(" + that.x + "px," + that.y + "px) scale(" + that.scale + ")" + translateZ;
                        that.zoomed = false;
                        that.refresh();
                        if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                        return;
                    }
                    if (!that.moved) {
                        if (hasTouch) {
                            if (that.doubleTapTimer && that.options.zoom) {
                                clearTimeout(that.doubleTapTimer);
                                that.doubleTapTimer = null;
                                if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                                that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                                if (that.options.onZoomEnd) {
                                    setTimeout(function() {
                                        that.options.onZoomEnd.call(that, e);
                                    }, 200);
                                }
                            } else if (this.options.handleClick) {
                                that.doubleTapTimer = setTimeout(function() {
                                    that.doubleTapTimer = null;
                                    target = point.target;
                                    while (target.nodeType != 1) target = target.parentNode;
                                    if (target.tagName != "SELECT" && target.tagName != "INPUT" && target.tagName != "TEXTAREA") {
                                        ev = doc.createEvent("MouseEvents");
                                        ev.initMouseEvent("click", true, true, e.view, 1, point.screenX, point.screenY, point.clientX, point.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                                        ev._fake = true;
                                        target.dispatchEvent(ev);
                                    }
                                }, that.options.zoom ? 250 : 0);
                            }
                        }
                        that._resetPos(400);
                        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                        return;
                    }
                    if (duration < 300 && that.options.momentum) {
                        momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                        momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0, that.options.bounce ? that.wrapperH : 0) : momentumY;
                        newPosX = that.x + momentumX.dist;
                        newPosY = that.y + momentumY.dist;
                        if (that.x > 0 && newPosX > 0 || that.x < that.maxScrollX && newPosX < that.maxScrollX) momentumX = {
                            dist: 0,
                            time: 0
                        };
                        if (that.y > that.minScrollY && newPosY > that.minScrollY || that.y < that.maxScrollY && newPosY < that.maxScrollY) momentumY = {
                            dist: 0,
                            time: 0
                        };
                    }
                    if (momentumX.dist || momentumY.dist) {
                        newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);
                        if (that.options.snap) {
                            distX = newPosX - that.absStartX;
                            distY = newPosY - that.absStartY;
                            if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) {
                                that.scrollTo(that.absStartX, that.absStartY, 200);
                            } else {
                                snap = that._snap(newPosX, newPosY);
                                newPosX = snap.x;
                                newPosY = snap.y;
                                newDuration = m.max(snap.time, newDuration);
                            }
                        }
                        that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);
                        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                        return;
                    }
                    if (that.options.snap) {
                        distX = newPosX - that.absStartX;
                        distY = newPosY - that.absStartY;
                        if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200); else {
                            snap = that._snap(that.x, that.y);
                            if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
                        }
                        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                        return;
                    }
                    that._resetPos(200);
                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                },
                _resetPos: function(time) {
                    var that = this, resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x, resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;
                    if (resetX == that.x && resetY == that.y) {
                        if (that.moved) {
                            that.moved = false;
                            if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                        }
                        if (that.hScrollbar && that.options.hideScrollbar) {
                            if (vendor == "webkit") that.hScrollbarWrapper.style[transitionDelay] = "300ms";
                            that.hScrollbarWrapper.style.opacity = "0";
                        }
                        if (that.vScrollbar && that.options.hideScrollbar) {
                            if (vendor == "webkit") that.vScrollbarWrapper.style[transitionDelay] = "300ms";
                            that.vScrollbarWrapper.style.opacity = "0";
                        }
                        return;
                    }
                    that.scrollTo(resetX, resetY, time || 0);
                },
                _wheel: function(e) {
                    var that = this, wheelDeltaX, wheelDeltaY, deltaX, deltaY, deltaScale;
                    if ("wheelDeltaX" in e) {
                        wheelDeltaX = e.wheelDeltaX / 12;
                        wheelDeltaY = e.wheelDeltaY / 12;
                    } else if ("wheelDelta" in e) {
                        wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
                    } else if ("detail" in e) {
                        wheelDeltaX = wheelDeltaY = -e.detail * 3;
                    } else {
                        return;
                    }
                    if (that.options.wheelAction == "zoom") {
                        deltaScale = that.scale * Math.pow(2, 1 / 3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
                        if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
                        if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
                        if (deltaScale != that.scale) {
                            if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                            that.wheelZoomCount++;
                            that.zoom(e.pageX, e.pageY, deltaScale, 400);
                            setTimeout(function() {
                                that.wheelZoomCount--;
                                if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                            }, 400);
                        }
                        return;
                    }
                    deltaX = that.x + wheelDeltaX;
                    deltaY = that.y + wheelDeltaY;
                    if (deltaX > 0) deltaX = 0; else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;
                    if (deltaY > that.minScrollY) deltaY = that.minScrollY; else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
                    if (that.maxScrollY < 0) {
                        that.scrollTo(deltaX, deltaY, 0);
                    }
                },
                _transitionEnd: function(e) {
                    var that = this;
                    if (e.target != that.scroller) return;
                    that._unbind(TRNEND_EV);
                    that._startAni();
                },
                _startAni: function() {
                    var that = this, startX = that.x, startY = that.y, startTime = Date.now(), step, easeOut, animate;
                    if (that.animating) return;
                    if (!that.steps.length) {
                        that._resetPos(400);
                        return;
                    }
                    step = that.steps.shift();
                    if (step.x == startX && step.y == startY) step.time = 0;
                    that.animating = true;
                    that.moved = true;
                    if (that.options.useTransition) {
                        that._transitionTime(step.time);
                        that._pos(step.x, step.y);
                        that.animating = false;
                        if (step.time) that._bind(TRNEND_EV); else that._resetPos(0);
                        return;
                    }
                    animate = function() {
                        var now = Date.now(), newX, newY;
                        if (now >= startTime + step.time) {
                            that._pos(step.x, step.y);
                            that.animating = false;
                            if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);
                            that._startAni();
                            return;
                        }
                        now = (now - startTime) / step.time - 1;
                        easeOut = m.sqrt(1 - now * now);
                        newX = (step.x - startX) * easeOut + startX;
                        newY = (step.y - startY) * easeOut + startY;
                        that._pos(newX, newY);
                        if (that.animating) that.aniTime = nextFrame(animate);
                    };
                    animate();
                },
                _transitionTime: function(time) {
                    time += "ms";
                    this.scroller.style[transitionDuration] = time;
                    if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
                    if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
                },
                _momentum: function(dist, time, maxDistUpper, maxDistLower, size) {
                    var deceleration = 6e-4, speed = m.abs(dist) / time, newDist = speed * speed / (2 * deceleration), newTime = 0, outsideDist = 0;
                    if (dist > 0 && newDist > maxDistUpper) {
                        outsideDist = size / (6 / (newDist / speed * deceleration));
                        maxDistUpper = maxDistUpper + outsideDist;
                        speed = speed * maxDistUpper / newDist;
                        newDist = maxDistUpper;
                    } else if (dist < 0 && newDist > maxDistLower) {
                        outsideDist = size / (6 / (newDist / speed * deceleration));
                        maxDistLower = maxDistLower + outsideDist;
                        speed = speed * maxDistLower / newDist;
                        newDist = maxDistLower;
                    }
                    newDist = newDist * (dist < 0 ? -1 : 1);
                    newTime = speed / deceleration;
                    return {
                        dist: newDist,
                        time: m.round(newTime)
                    };
                },
                _offset: function(el) {
                    var left = -el.offsetLeft, top = -el.offsetTop;
                    while (el = el.offsetParent) {
                        left -= el.offsetLeft;
                        top -= el.offsetTop;
                    }
                    if (el != this.wrapper) {
                        left *= this.scale;
                        top *= this.scale;
                    }
                    return {
                        left: left,
                        top: top
                    };
                },
                _snap: function(x, y) {
                    var that = this, i, l, page, time, sizeX, sizeY;
                    page = that.pagesX.length - 1;
                    for (i = 0, l = that.pagesX.length; i < l; i++) {
                        if (x >= that.pagesX[i]) {
                            page = i;
                            break;
                        }
                    }
                    if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
                    x = that.pagesX[page];
                    sizeX = m.abs(x - that.pagesX[that.currPageX]);
                    sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
                    that.currPageX = page;
                    page = that.pagesY.length - 1;
                    for (i = 0; i < page; i++) {
                        if (y >= that.pagesY[i]) {
                            page = i;
                            break;
                        }
                    }
                    if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
                    y = that.pagesY[page];
                    sizeY = m.abs(y - that.pagesY[that.currPageY]);
                    sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
                    that.currPageY = page;
                    time = m.round(m.max(sizeX, sizeY)) || 200;
                    return {
                        x: x,
                        y: y,
                        time: time
                    };
                },
                _bind: function(type, el, bubble) {
                    (el || this.scroller).addEventListener(type, this, !!bubble);
                },
                _unbind: function(type, el, bubble) {
                    (el || this.scroller).removeEventListener(type, this, !!bubble);
                },
                destroy: function() {
                    var that = this;
                    that.scroller.style[transform] = "";
                    that.hScrollbar = false;
                    that.vScrollbar = false;
                    that._scrollbar("h");
                    that._scrollbar("v");
                    that._unbind(RESIZE_EV, window);
                    that._unbind(START_EV);
                    that._unbind(MOVE_EV, window);
                    that._unbind(END_EV, window);
                    that._unbind(CANCEL_EV, window);
                    if (!that.options.hasTouch) {
                        that._unbind("DOMMouseScroll");
                        that._unbind("mousewheel");
                    }
                    if (that.options.useTransition) that._unbind(TRNEND_EV);
                    if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
                    if (that.options.onDestroy) that.options.onDestroy.call(that);
                },
                refresh: function() {
                    var that = this, offset, i, l, els, pos = 0, page = 0;
                    if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
                    that.wrapperW = that.wrapper.clientWidth || 1;
                    that.wrapperH = that.wrapper.clientHeight || 1;
                    that.minScrollY = -that.options.topOffset || 0;
                    that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
                    that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
                    that.maxScrollX = that.wrapperW - that.scrollerW;
                    that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
                    that.dirX = 0;
                    that.dirY = 0;
                    if (that.options.onRefresh) that.options.onRefresh.call(that);
                    that.hScroll = that.options.hScroll && that.maxScrollX < 0;
                    that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);
                    that.hScrollbar = that.hScroll && that.options.hScrollbar;
                    that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;
                    offset = that._offset(that.wrapper);
                    that.wrapperOffsetLeft = -offset.left;
                    that.wrapperOffsetTop = -offset.top;
                    if (typeof that.options.snap == "string") {
                        that.pagesX = [];
                        that.pagesY = [];
                        els = that.scroller.querySelectorAll(that.options.snap);
                        for (i = 0, l = els.length; i < l; i++) {
                            pos = that._offset(els[i]);
                            pos.left += that.wrapperOffsetLeft;
                            pos.top += that.wrapperOffsetTop;
                            that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                            that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
                        }
                    } else if (that.options.snap) {
                        that.pagesX = [];
                        while (pos >= that.maxScrollX) {
                            that.pagesX[page] = pos;
                            pos = pos - that.wrapperW;
                            page++;
                        }
                        if (that.maxScrollX % that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length - 1] + that.pagesX[that.pagesX.length - 1];
                        pos = 0;
                        page = 0;
                        that.pagesY = [];
                        while (pos >= that.maxScrollY) {
                            that.pagesY[page] = pos;
                            pos = pos - that.wrapperH;
                            page++;
                        }
                        if (that.maxScrollY % that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length - 1] + that.pagesY[that.pagesY.length - 1];
                    }
                    that._scrollbar("h");
                    that._scrollbar("v");
                    if (!that.zoomed) {
                        that.scroller.style[transitionDuration] = "0";
                        that._resetPos(400);
                    }
                },
                scrollTo: function(x, y, time, relative) {
                    var that = this, step = x, i, l;
                    that.stop();
                    if (!step.length) step = [ {
                        x: x,
                        y: y,
                        time: time,
                        relative: relative
                    } ];
                    for (i = 0, l = step.length; i < l; i++) {
                        if (step[i].relative) {
                            step[i].x = that.x - step[i].x;
                            step[i].y = that.y - step[i].y;
                        }
                        that.steps.push({
                            x: step[i].x,
                            y: step[i].y,
                            time: step[i].time || 0
                        });
                    }
                    that._startAni();
                },
                scrollToElement: function(el, time) {
                    var that = this, pos;
                    el = el.nodeType ? el : that.scroller.querySelector(el);
                    if (!el) return;
                    pos = that._offset(el);
                    pos.left += that.wrapperOffsetLeft;
                    pos.top += that.wrapperOffsetTop;
                    pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
                    pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
                    time = time === undefined ? m.max(m.abs(pos.left) * 2, m.abs(pos.top) * 2) : time;
                    that.scrollTo(pos.left, pos.top, time);
                },
                scrollToPage: function(pageX, pageY, time) {
                    var that = this, x, y;
                    time = time === undefined ? 400 : time;
                    if (that.options.onScrollStart) that.options.onScrollStart.call(that);
                    if (that.options.snap) {
                        pageX = pageX == "next" ? that.currPageX + 1 : pageX == "prev" ? that.currPageX - 1 : pageX;
                        pageY = pageY == "next" ? that.currPageY + 1 : pageY == "prev" ? that.currPageY - 1 : pageY;
                        pageX = pageX < 0 ? 0 : pageX > that.pagesX.length - 1 ? that.pagesX.length - 1 : pageX;
                        pageY = pageY < 0 ? 0 : pageY > that.pagesY.length - 1 ? that.pagesY.length - 1 : pageY;
                        that.currPageX = pageX;
                        that.currPageY = pageY;
                        x = that.pagesX[pageX];
                        y = that.pagesY[pageY];
                    } else {
                        x = -that.wrapperW * pageX;
                        y = -that.wrapperH * pageY;
                        if (x < that.maxScrollX) x = that.maxScrollX;
                        if (y < that.maxScrollY) y = that.maxScrollY;
                    }
                    that.scrollTo(x, y, time);
                },
                disable: function() {
                    this.stop();
                    this._resetPos(0);
                    this.enabled = false;
                    this._unbind(MOVE_EV, window);
                    this._unbind(END_EV, window);
                    this._unbind(CANCEL_EV, window);
                },
                enable: function() {
                    this.enabled = true;
                },
                stop: function() {
                    if (this.options.useTransition) this._unbind(TRNEND_EV); else cancelFrame(this.aniTime);
                    this.steps = [];
                    this.moved = false;
                    this.animating = false;
                },
                zoom: function(x, y, scale, time) {
                    var that = this, relScale = scale / that.scale;
                    if (!that.options.useTransform) return;
                    that.zoomed = true;
                    time = time === undefined ? 200 : time;
                    x = x - that.wrapperOffsetLeft - that.x;
                    y = y - that.wrapperOffsetTop - that.y;
                    that.x = x - x * relScale + that.x;
                    that.y = y - y * relScale + that.y;
                    that.scale = scale;
                    that.refresh();
                    that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
                    that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;
                    that.scroller.style[transitionDuration] = time + "ms";
                    that.scroller.style[transform] = "translate(" + that.x + "px," + that.y + "px) scale(" + scale + ")" + translateZ;
                    that.zoomed = false;
                },
                isReady: function() {
                    return !this.moved && !this.zoomed && !this.animating;
                }
            };
            function prefixStyle(style) {
                if (vendor === "") return style;
                style = style.charAt(0).toUpperCase() + style.substr(1);
                return vendor + style;
            }
            dummyStyle = null;
            if (typeof exports !== "undefined") exports.iScroll = iScroll; else window.iScroll = iScroll;
        })(window, document);
    },
    "19": function(require, module, exports, global) {
        "use strict";
        var requestFrame = require("1").request;
        var cancelFrame = require("1").cancel;
        var Native = moobile.Scroller.Native = new Class({
            Extends: moobile.Scroller,
            _animating: false,
            _animation: null,
            contentScrollerElement: null,
            initialize: function(contentElement, contentWrapperElement, options) {
                this.parent(contentElement, contentWrapperElement, options);
                if (this.options.snapToPage) {
                    this.options.momentum = false;
                    this.options.bounce = false;
                }
                this.contentWrapperElement.setStyle("overflow", "auto");
                this.contentWrapperElement.setStyle("overflow-scrolling", "touch");
                var styles = {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    overflow: "auto",
                    "overflow-scrolling": this.options.momentum ? "touch" : "auto"
                };
                this.contentScrollerElement = document.createElement("div");
                this.contentScrollerElement.setStyles(styles);
                this.contentScrollerElement.wraps(contentElement);
                this.contentScrollerElement.addEvent("touchstart", this.bound("_onTouchStart"));
                this.contentScrollerElement.addEvent("touchmove", this.bound("_onTouchMove"));
                this.contentScrollerElement.addEvent("touchend", this.bound("_onTouchEnd"));
                window.addEvent("orientationchange", this.bound("_onOrientationChange"));
                return this;
            },
            destroy: function() {
                this.contentScrollerElement.removeEvent("touchstart", this.bound("_onTouchStart"));
                this.contentScrollerElement.removeEvent("touchend", this.bound("_onTouchMove"));
                this.contentScrollerElement.removeEvent("touchend", this.bound("_onTouchEnd"));
                this.contentScrollerElement.removeEvent("scroll", this.bound("_onScroll"));
                this.contentScrollerElement = null;
                this.contentScroller = null;
                window.addEvent("orientationchange", this.bound("_onOrientationChange"));
                this.parent();
            },
            getName: function() {
                return "native";
            },
            scrollTo: function(x, y, time) {
                x = x || 0;
                y = y || 0;
                time = time || 0;
                if (this._animating) {
                    this._animating = false;
                    cancelFrame(this._animation);
                }
                var now = Date.now();
                var self = this;
                var elem = this.contentScrollerElement;
                var absX = Math.abs(x);
                var absY = Math.abs(y);
                var currX = elem.scrollLeft;
                var currY = elem.scrollTop;
                var dirX = x - currX;
                var dirY = y - currY;
                var update = function() {
                    if (elem.scrollLeft === x && elem.scrollTop === y) {
                        self.fireEvent("scroll");
                        self._animating = false;
                        self._animation = null;
                        return;
                    }
                    var valueX = (Date.now() - now) * (x - currX) / time;
                    var valueY = (Date.now() - now) * (y - currY) / time;
                    var scrollX = valueX + currX;
                    var scrollY = valueY + currY;
                    if (scrollX >= x && dirX >= 0 || scrollX < x && dirX < 0) scrollX = x;
                    if (scrollY >= y && dirY >= 0 || scrollY < y && dirY < 0) scrollY = y;
                    elem.scrollLeft = scrollX;
                    elem.scrollTop = scrollY;
                    self._animating = true;
                    self._animation = requestFrame(update);
                };
                this._animation = requestFrame(update);
                return this;
            },
            scrollToElement: function(element, time) {
                var elem = document.id(element);
                if (elem) {
                    var p = element.getPosition(this.contentElement);
                    this.scrollTo(p.x, p.y, time);
                }
                return this;
            },
            refresh: function() {
                var wrapperSize = this.contentWrapperElement.getSize();
                var contentSize = this.contentElement.getScrollSize();
                if (this.options.momentum) {
                    var scrollX = this.options.scroll === "both" || this.options.scroll === "horizontal";
                    var scrollY = this.options.scroll === "both" || this.options.scroll === "vertical";
                    if (scrollY && contentSize.y <= wrapperSize.y) this.contentElement.setStyle("min-height", wrapperSize.y + 1);
                    if (scrollX && contentSize.x <= wrapperSize.x) this.contentElement.setStyle("min-width", wrapperSize.x + 1);
                }
                return this;
            },
            _attachEvents: function() {
                this.contentScrollerElement.addEvent("scroll", this.bound("_onScroll"));
                return this;
            },
            _detachEvents: function() {
                this.contentScrollerElement.removeEvent("scroll", this.bound("_onScroll"));
                return this;
            },
            getSize: function() {
                return this.contentScrollerElement.getSize();
            },
            getScroll: function() {
                return this.contentScrollerElement.getScroll();
            },
            _onScroll: function() {
                this.fireEvent("scroll");
            },
            _onTouchStart: function(e) {
                this.fireEvent("touchstart", e);
            },
            _onTouchMove: function(e) {
                this.fireEvent("touchmove", e);
            },
            _onTouchEnd: function(e) {
                this.fireEvent("touchend", e);
            },
            _onOrientationChange: function() {
                this.refresh();
            }
        });
        moobile.Scroller.Native.supportsCurrentPlatform = function() {
            return Browser.Platform.ios && "WebkitOverflowScrolling" in document.createElement("div").style;
        };
    },
    "1a": function(require, module, exports, global) {
        "use strict";
        var element = null;
        var configs = {};
        var Theme = moobile.Theme = {
            init: function() {
                var content = element.getStyle("content");
                if (content) {
                    content = content.replace(/^\'/, "");
                    content = content.replace(/\'$/, "");
                    configs = JSON.decode(content);
                }
            },
            getName: function() {
                return configs["name"] || null;
            }
        };
        document.addEvent("domready", function() {
            element = document.createElement("div");
            element.addClass("theme");
            element.inject(document.body);
            Theme.init();
        });
    },
    "1b": function(require, module, exports, global) {
        "use strict";
        var View = moobile.View = new Class({
            Extends: moobile.Component,
            __layout: null,
            contentElement: null,
            contentWrapperElement: null,
            options: {
                layout: "vertical"
            },
            willBuild: function() {
                this.parent();
                this.addClass("view");
                var content = this.getRoleElement("content");
                if (content === null) {
                    content = document.createElement("div");
                    content.ingest(this.element);
                    content.inject(this.element);
                    content.setRole("content");
                }
                var wrapper = this.getRoleElement("content-wrapper");
                if (wrapper === null) {
                    wrapper = document.createElement("div");
                    wrapper.wraps(content);
                    wrapper.setRole("content-wrapper");
                }
            },
            didBuild: function() {
                this.parent();
                var classes = this.element.get("class");
                if (classes) {
                    classes.split(" ").each(function(klass) {
                        klass = klass.trim();
                        if (klass) this.contentElement.addClass(klass + "-content");
                    }, this);
                }
                this.setLayout(this.options.layout);
            },
            destroy: function() {
                this.contentElement = null;
                this.parent();
            },
            enableTouch: function() {
                this.removeClass("disable").addClass("enable");
                return this;
            },
            disableTouch: function() {
                this.removeClass("enable").addClass("disable");
                return this;
            },
            addChildComponent: function(component, where) {
                if (where === "header") return this.parent(component, "top");
                if (where === "footer") return this.parent(component, "bottom");
                return this.parent(component, where, this.contentElement);
            },
            addChildComponents: function(components, where) {
                if (where === "header") return this.parent(components, "top");
                if (where === "footer") return this.parent(components, "bottom");
                return this.addChildComponentsInside(components, this.contentElement, where);
            },
            willAddChildComponent: function(component) {
                this.parent(component);
                component.setParentView(this);
            },
            willRemoveChildComponent: function(component) {
                this.parent(component);
                component.setParentView(null);
            },
            getContentElement: function() {
                return this.contentElement;
            },
            getContentWrapperElement: function() {
                return this.contentWrapperElement;
            },
            setLayout: function(layout) {
                if (this.__layout === layout) return this;
                this.willChangeLayout(layout);
                if (this.__layout) this.removeClass("view-layout-" + this.__layout);
                this.__layout = layout;
                if (this.__layout) this.addClass("view-layout-" + this.__layout);
                this.didChangeLayout(layout);
                return this;
            },
            getLayout: function() {
                return this.__layout;
            },
            willChangeLayout: function(layout) {},
            didChangeLayout: function(layout) {}
        });
        Class.refactor(moobile.Component, {
            __parentView: null,
            setParentView: function(parentView) {
                if (this.__parentView === parentView) return this;
                this.parentViewWillChange(parentView);
                this.__parentView = parentView;
                this.parentViewDidChange(parentView);
                if (this instanceof View) return this;
                var by = function(component) {
                    return !(component instanceof View);
                };
                this.getChildComponents().filter(by).invoke("setParentView", parentView);
                return this;
            },
            getParentView: function() {
                return this.__parentView;
            },
            parentViewWillChange: function(parentView) {},
            parentViewDidChange: function(parentView) {},
            willAddChildComponent: function(component) {
                this.previous(component);
                component.setParentView(this.__parentView);
            },
            willRemoveChildComponent: function(component) {
                this.previous(component);
                component.setParentView(null);
            }
        });
        View.at = function(path, options, name) {
            var element = Element.at(path);
            if (element) {
                return moobile.Component.create(View, element, "data-view", options, name);
            }
            return null;
        };
        moobile.Component.defineRole("view", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(View, element, "data-view"));
        });
        moobile.Component.defineRole("content", View, {
            traversable: true
        }, function(element) {
            this.contentElement = element;
            this.contentElement.addClass("view-content");
        });
        moobile.Component.defineRole("content-wrapper", View, {
            traversable: true
        }, function(element) {
            this.contentWrapperElement = element;
            this.contentWrapperElement.addClass("view-content-wrapper");
        });
        moobile.Component.defineRole("view-content", View, {
            traversable: true
        }, function(element) {
            console.log('[DEPRECATION NOTICE] The role "view-content" will be removed in 0.4, use the role "content" instead');
            this.contentElement = element;
            this.contentElement.addClass("view-content");
        });
        moobile.Component.defineStyle("dark", View, {
            attach: function(element) {
                element.addClass("style-dark");
            },
            detach: function(element) {
                element.removeClass("style-dark");
            }
        });
        moobile.Component.defineStyle("light", View, {
            attach: function(element) {
                element.addClass("style-light");
            },
            detach: function(element) {
                element.removeClass("style-light");
            }
        });
    },
    "1c": function(require, module, exports, global) {
        "use strict";
        var ScrollView = moobile.ScrollView = new Class({
            Extends: moobile.View,
            __activeTouch: null,
            __activeTouchTime: null,
            __activeTouchScroll: null,
            __activeTouchDuration: null,
            __scroller: null,
            __offset: {
                x: null,
                y: null
            },
            __page: {
                x: null,
                y: null
            },
            __pageOffset: {
                x: 0,
                y: 0
            },
            __scrollToPageTimer: null,
            __contentSize: {
                x: null,
                y: null
            },
            options: {
                scroller: [ "Native", "IScroll" ],
                scroll: "vertical",
                scrollbar: "vertical",
                bounce: Browser.Platform.ios,
                momentum: true,
                snapToPage: false,
                snapToPageAt: 20,
                snapToPageSizeX: null,
                snapToPageSizeY: null,
                snapToPageDuration: 150,
                snapToPageDelay: 150,
                initialPageX: 0,
                initialPageY: 0,
                initialScrollX: 0,
                initialScrollY: 0
            },
            willBuild: function() {
                this.parent();
                this.addClass("scroll-view");
            },
            didBuild: function() {
                this.parent();
                if ("scrollX" in this.options || "scrollY" in this.options) {
                    console.log('[DEPRECATION NOTICE] The options "scrollX" and "scrollY" will be removed in 0.4, use the "scroll" option instead');
                    if (this.options.scrollX && this.options.scrollY) {
                        this.options.scroll = "both";
                    } else {
                        if (this.options.scrollX) this.options.scroll = "horizontal";
                        if (this.options.scrollY) this.options.scroll = "vertical";
                    }
                }
                var options = {
                    scroll: this.options.scroll,
                    scrollbar: this.options.scrollbar,
                    bounce: this.options.bounce,
                    momentum: this.options.momentum,
                    snapToPage: this.options.snapToPage,
                    snapToPageAt: this.options.snapToPageAt,
                    snapToPageSizeX: this.options.snapToPageSizeX,
                    snapToPageSizeY: this.options.snapToPageSizeY,
                    snapToPageDuration: this.options.snapToPageDuration,
                    snapToPageDelay: this.options.snapToPageDelay
                };
                this.__scroller = moobile.Scroller.create(this.contentElement, this.contentWrapperElement, this.options.scroller, options);
                this.__scroller.addEvent("scroll", this.bound("__onScroll"));
                this.__scroller.addEvent("scrollend", this.bound("__onScrollEnd"));
                this.__scroller.addEvent("scrollstart", this.bound("__onScrollStart"));
                this.__scroller.addEvent("touchcancel", this.bound("__onTouchCancel"));
                this.__scroller.addEvent("touchstart", this.bound("__onTouchStart"));
                this.__scroller.addEvent("touchend", this.bound("__onTouchEnd"));
                var name = this.__scroller.getName();
                if (name) {
                    this.addClass(name + "-engine");
                }
            },
            didBecomeReady: function() {
                this.parent();
                var x = this.options.initialScrollX;
                var y = this.options.initialScrollY;
                var s = "scrollTo";
                if (this.options.snapToPage) {
                    x = this.options.initialPageX;
                    y = this.options.initialPageY;
                    s = "scrollToPage";
                }
                this.__scroller.refresh();
                this[s].call(this, x, y);
            },
            didUpdateLayout: function() {
                this.parent();
                this.__scroller.refresh();
            },
            destroy: function() {
                this.__scroller.removeEvent("scroll", this.bound("__onScroll"));
                this.__scroller.removeEvent("scrollend", this.bound("__onScrollEnd"));
                this.__scroller.removeEvent("scrollstart", this.bound("__onScrollStart"));
                this.__scroller.removeEvent("touchcancel", this.bound("__onTouchCancel"));
                this.__scroller.removeEvent("touchstart", this.bound("__onTouchStart"));
                this.__scroller.removeEvent("touchend", this.bound("__onTouchEnd"));
                this.__scroller.destroy();
                this.__scroller = null;
                this.parent();
            },
            setContentSize: function(x, y) {
                if (x >= 0 || x === null) this.contentElement.setStyle("width", x);
                if (y >= 0 || y === null) this.contentElement.setStyle("height", y);
                if (this.__contentSize.x !== x || this.__contentSize.y !== y) {
                    this.updateLayout();
                }
                this.__contentSize.x = x;
                this.__contentSize.y = y;
                return this;
            },
            getContentSize: function() {
                return this.contentElement.getScrollSize();
            },
            getContentWrapperSize: function() {
                return this.contentWrapperElement.getSize();
            },
            getContentScroll: function() {
                return this.__scroller.getScroll();
            },
            scrollTo: function(x, y, time) {
                this.__scroller.scrollTo(x, y, time);
                return this;
            },
            scrollToElement: function(element, time) {
                this.__scroller.scrollToElement(element);
                return this;
            },
            scrollToPage: function(pageX, pageY, time) {
                pageX = pageX || 0;
                pageY = pageY || 0;
                if (pageX < 0) pageX = 0;
                if (pageY < 0) pageY = 0;
                var frame = this.getContentWrapperSize();
                var total = this.getContentSize();
                var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
                var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;
                var xmax = total.x - frame.x;
                var ymax = total.y - frame.y;
                var x = pageSizeX * pageX;
                var y = pageSizeY * pageY;
                if (x > xmax) x = xmax;
                if (y > ymax) y = ymax;
                var scroll = this.getContentScroll();
                if (scroll.x !== x || scroll.y !== y) {
                    this.scrollTo(x, y, time);
                }
                if (this.__scrollToPageTimer) {
                    clearTimeout(this.scrolltopage);
                    this.__scrollToPageTimer = null;
                }
                if (this.__page.x !== pageX || this.__page.y !== pageY) {
                    this.__pageOffset.x = Math.abs(x - pageX * pageSizeX);
                    this.__pageOffset.y = Math.abs(y - pageY * pageSizeY);
                    this.__scrollToPageTimer = this.fireEvent.delay(time + 5, this, [ "scrolltopage", [ pageX, pageY ] ]);
                }
                this.__page.x = pageX;
                this.__page.y = pageY;
                return this;
            },
            getPage: function() {
                var x = 0;
                var y = 0;
                var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
                var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;
                if (pageSizeX && pageSizeY) {
                    var scroll = this.getContentScroll();
                    scroll.x = scroll.x > 0 ? scroll.x : 0;
                    scroll.y = scroll.y > 0 ? scroll.y : 0;
                    x = Math.floor(scroll.x / pageSizeX);
                    y = Math.floor(scroll.y / pageSizeY);
                }
                return {
                    x: x,
                    y: y
                };
            },
            getPageOffset: function() {
                return this.__pageOffset;
            },
            getScroller: function() {
                return this.__scroller;
            },
            willHide: function() {
                this.parent();
                this.__offset = this.__scroller.getScroll();
            },
            didShow: function() {
                this.parent();
                this.__scroller.refresh();
                this.__scroller.scrollTo(this.__offset.x, this.__offset.y);
            },
            __snapToPage: function() {
                var size = this.getContentSize();
                var scroll = this.getContentScroll();
                scroll.x = scroll.x > 0 ? scroll.x : 0;
                scroll.y = scroll.y > 0 ? scroll.y : 0;
                var moveX = scroll.x - this.__activeTouchScroll.x;
                var moveY = scroll.y - this.__activeTouchScroll.y;
                var absMoveX = Math.abs(moveX);
                var absMoveY = Math.abs(moveY);
                if (moveX === 0 && moveY === 0) return this;
                var scrollX = this.options.scroll === "both" || this.options.scroll === "horizontal";
                var scrollY = this.options.scroll === "both" || this.options.scroll === "vertical";
                var snapToPageAt = this.options.snapToPageAt;
                var snapToPageDelay = this.options.snapToPageDelay;
                var snapToPageDuration = this.options.snapToPageDuration;
                var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
                var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;
                var pageMoveX = (absMoveX - Math.floor(absMoveX / pageSizeX) * pageSizeX) * 100 / pageSizeX;
                var pageMoveY = (absMoveY - Math.floor(absMoveY / pageSizeY) * pageSizeY) * 100 / pageSizeY;
                var page = this.getPage();
                if (moveX < 0 || this.__pageOffset.x > 0) page.x += 1;
                if (moveY < 0 || this.__pageOffset.y > 0) page.y += 1;
                if (absMoveX >= 10 && (pageMoveX >= snapToPageAt || this.__activeTouchDuration < snapToPageDelay)) page.x += moveX > 0 ? 1 : -1;
                if (absMoveY >= 10 && (pageMoveY >= snapToPageAt || this.__activeTouchDuration < snapToPageDelay)) page.y += moveY > 0 ? 1 : -1;
                if (page.x < 0) page.x = 0;
                if (page.y < 0) page.y = 0;
                if ((page.x + 1) * pageSizeX > size.x) page.x = Math.floor(size.x / pageSizeX) - 1;
                if ((page.y + 1) * pageSizeY > size.y) page.y = Math.floor(size.y / pageSizeY) - 1;
                this.scrollToPage(page.x, page.y, this.options.snapToPageDuration);
                this.fireEvent("snaptopage", [ page.x, page.y ]);
                return this;
            },
            __onTouchCancel: function() {
                this.__activeTouch = null;
                this.__activeTouchTime = null;
                this.__activeTouchScroll = null;
                this.__activeTouchDuration = null;
            },
            __onTouchStart: function(e) {
                var touch = e.changedTouches[0];
                if (this.__activeTouch === null) {
                    this.__activeTouch = touch;
                    this.__activeTouchTime = Date.now();
                    this.__activeTouchScroll = this.getContentScroll();
                }
            },
            __onTouchEnd: function(e) {
                if (e.touches.length > 0) return;
                this.__activeTouchDuration = Date.now() - this.__activeTouchTime;
                if (this.options.snapToPage) this.__snapToPage();
                this.__activeTouch = null;
                this.__activeTouchTime = null;
                this.__activeTouchScroll = null;
                this.__activeTouchDuration = null;
            },
            __onScroll: function() {
                this.fireEvent("scroll");
            },
            __onScrollStart: function() {
                this.fireEvent("scrollstart");
            },
            __onScrollEnd: function() {
                this.fireEvent("scrollend");
            },
            getScrollSize: function() {
                console.log('[DEPRECATION NOTICE] The method "getScrollSize" will be removed in 0.4, use the method "getContentSize" instead');
                return this.getContentSize();
            },
            getScroll: function() {
                console.log('[DEPRECATION NOTICE] The method "getScroll" will be removed in 0.4, use the method "getContentScroll" instead');
                return this.getContentScroll();
            }
        });
        ScrollView.at = function(path, options, name) {
            var element = Element.at(path);
            if (element) {
                return moobile.Component.create(ScrollView, element, "data-view", options, name);
            }
            return null;
        };
        moobile.Component.defineRole("scroll-view", null, function(element) {
            this.addChildComponent(moobile.Component.create(ScrollView, element, "data-scroll-view"));
        });
    },
    "1d": function(require, module, exports, global) {
        "use strict";
        var View = moobile.View;
        var Component = moobile.Component;
        var ViewCollection = moobile.ViewCollection = new Class({
            Extends: View,
            willBuild: function() {
                this.parent();
                this.addClass("view-collection");
            },
            didBuild: function() {
                this.parent();
                this.setLayout("horizontal");
            }
        });
        Component.defineRole("view-collection", null, null, function(element) {
            this.addChildComponent(Component.create(ViewCollection, element, "data-view-collection"));
        });
    },
    "1e": function(require, module, exports, global) {
        "use strict";
        var View = moobile.View;
        var Component = moobile.Component;
        var ViewQueue = moobile.ViewQueue = new Class({
            Extends: View,
            willBuild: function() {
                this.parent();
                this.addClass("view-queue");
            }
        });
        Component.defineRole("view-queue", null, null, function(element) {
            this.addChildComponent(Component.create(ViewQueue, element, "data-view-queue"));
        });
    },
    "1f": function(require, module, exports, global) {
        "use strict";
        var ViewSet = moobile.ViewSet = new Class({
            Extends: moobile.View,
            _tabBar: null,
            willBuild: function() {
                this.parent();
                this.addClass("view-set");
                var bar = this.getRoleElement("tab-bar");
                if (bar === null) {
                    bar = document.createElement("div");
                    bar.inject(this.element);
                    bar.setRole("tab-bar");
                }
            },
            setTabBar: function(tabBar) {
                if (this._tabBar === tabBar || !tabBar) return this;
                if (this._tabBar) {
                    this._tabBar.replaceWithmoobile.Component(tabBar, true);
                } else {
                    this.addChildComponent(tabBar, "footer");
                }
                this._tabBar = tabBar;
                this._tabBar.addClass("view-set-tab-bar");
                return this;
            },
            getTabBar: function() {
                return this._tabBar;
            }
        });
        moobile.Component.defineRole("view-set", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(moobile.ViewSet, element, "data-view-set"));
        });
        moobile.Component.defineRole("tab-bar", moobile.ViewSet, null, function(element) {
            this.setTabBar(moobile.Component.create(TabBar, element, "data-tab-bar"));
        });
    },
    "1g": function(require, module, exports, global) {
        "use strict";
        var ViewStack = moobile.ViewStack = new Class({
            Extends: moobile.View,
            willBuild: function() {
                this.parent();
                this.addClass("view-stack");
            }
        });
        moobile.Component.defineRole("view-stack", null, null, function(element) {
            this.addChildComponent(moobile.Component.create(moobile.ViewStack, element, "data-view-stack"));
        });
    },
    "1h": function(require, module, exports, global) {
        "use strict";
        var ViewController = moobile.ViewController = new Class({
            Extends: moobile.Emitter,
            __id: null,
            __name: null,
            __title: null,
            __image: null,
            __viewReady: false,
            __viewTransition: null,
            __parent: null,
            __children: [],
            __modal: false,
            __modalViewController: null,
            view: null,
            initialize: function(options, name) {
                this.__name = name;
                this.setOptions(options);
                this.loadView();
                if (this.view) {
                    this.view.addEvent("ready", this.bound("__onViewDidBecomeReady"));
                    this.view.addEvent("layout", this.bound("__onViewDidUpdateLayout"));
                    this.viewDidLoad();
                }
                window.addEvent("orientationchange", this.bound("__onWindowOrientationChange"));
                return this;
            },
            loadView: function() {
                if (this.view === null) {
                    this.view = new moobile.View;
                }
            },
            showView: function() {
                this.view.show();
                return this;
            },
            hideView: function() {
                this.view.hide();
                return this;
            },
            addChildViewController: function(viewController) {
                return this._addChildViewController(viewController);
            },
            addChildViewControllerAfter: function(viewController, after) {
                var index = this.getChildViewControllerIndex(after);
                if (index === -1) return this;
                return this._addChildViewController(viewController, after, "after");
            },
            addChildViewControllerBefore: function(viewController, before) {
                var index = this.getChildViewControllerIndex(before);
                if (index === -1) return this;
                return this._addChildViewController(viewController, before, "before");
            },
            addChildViewControllerAt: function(viewController, index) {
                if (index > this.__children.length) {
                    index = this.__children.length;
                } else if (index < 0) {
                    index = 0;
                }
                var before = this.getChildViewControllerAt(index);
                if (before) {
                    return this.addChildViewControllerBefore(viewController, before);
                }
                return this.addChildViewController(viewController);
            },
            _addChildViewController: function(viewController, context, where) {
                viewController.removeFromParentViewController();
                this.willAddChildViewController(viewController);
                if (context) {
                    this.__children.splice(this.getChildViewControllerIndex(context), 0, viewController);
                    switch (where) {
                      case "before":
                        this.view.addChildComponentBefore(viewController.view, context.view);
                        break;
                      case "after":
                        this.view.addChildComponentAfter(viewController.view, context.view);
                        break;
                    }
                } else {
                    this.__children.push(viewController);
                    this.view.addChildComponent(viewController.view);
                }
                viewController.setParentViewController(this);
                this.didAddChildViewController(viewController);
                return this;
            },
            getChildViewController: function(name) {
                return this.__children.find(function(viewController) {
                    return viewController.getName() === name;
                });
            },
            getChildViewControllerAt: function(index) {
                return this.__children[index] || null;
            },
            getChildViewControllerIndex: function(viewController) {
                return this.__children.indexOf(viewController);
            },
            getChildViewControllers: function() {
                return this.__children;
            },
            hasChildViewController: function(viewController) {
                return this.__children.contains(viewController);
            },
            removeChildViewController: function(viewController, destroy) {
                if (!this.hasChildViewController(viewController)) return this;
                this.willRemoveChildViewController(viewController);
                this.__children.erase(viewController);
                viewController.setParentViewController(null);
                var view = viewController.getView();
                if (view) {
                    view.removeFromParentComponent();
                }
                this.didRemoveChildViewController(viewController);
                if (destroy) {
                    viewController.destroy();
                }
                return this;
            },
            removeFromParentViewController: function(destroy) {
                if (this.__parent) this.__parent.removeChildViewController(this, destroy);
                return this;
            },
            removeAllChildViewControllers: function(destroy) {
                this.__children.filter(function() {
                    return true;
                }).invoke("removeFromParentViewController", destroy);
                return this;
            },
            presentModalViewController: function(viewController, viewTransition) {
                if (this.__modalViewController) return this;
                var parentView = this.view.getWindow();
                if (parentView === null) throw new Error("The view to present is not ready");
                this.willPresentModalViewController(viewController);
                this.__modalViewController = viewController;
                this.__modalViewController.setParentViewController(this);
                this.__modalViewController.setModal(true);
                var viewToShow = this.__modalViewController.getView();
                var viewToHide = parentView.getChildComponentsByType(View).getLastItemAtOffset(0);
                parentView.addChildComponent(viewToShow);
                viewTransition = viewTransition || new ViewTransition.Cover;
                viewTransition.addEvent("start:once", this.bound("__onPresentTransitionStart"));
                viewTransition.addEvent("complete:once", this.bound("__onPresentTransitionCompleted"));
                viewTransition.enter(viewToShow, viewToHide, parentView);
                viewController.setViewTransition(viewTransition);
                return this;
            },
            dismissModalViewController: function() {
                if (this.__modalViewController === null) return this;
                var parentView = this.view.getWindow();
                if (parentView === null) throw new Error("The view to dismiss is not ready");
                this.willDismissModalViewController();
                var viewToShow = parentView.getChildComponentsByType(View).getLastItemAtOffset(1);
                var viewToHide = this.__modalViewController.getView();
                var viewTransition = this.__modalViewController.getViewTransition();
                viewTransition.addEvent("start:once", this.bound("__onDismissTransitionStart"));
                viewTransition.addEvent("complete:once", this.bound("__onDismissTransitionCompleted"));
                viewTransition.leave(viewToShow, viewToHide, parentView);
                return this;
            },
            getName: function() {
                return this.__name;
            },
            getId: function() {
                var name = this.getName();
                if (name) {
                    return name;
                }
                if (this.__id === null) {
                    this.__id = String.uniqueID();
                }
                return this.__id;
            },
            setTitle: function(title) {
                if (this.__title === title) return this;
                title = moobile.Text.from(title);
                if (this.__title && this.__title.hasParentComponent()) {
                    this.__title.replaceWithComponent(title, true);
                }
                this.__title = title;
                return this;
            },
            getTitle: function() {
                return this.__title;
            },
            setImage: function(image) {
                if (this.__image === image) return this;
                image = moobile.Image.from(image);
                if (this.__image && this.__image.hasParentComponent()) {
                    this.__image.replaceWithComponent(image, true);
                }
                this.__image = image;
                return this;
            },
            getImage: function() {
                return this.__image;
            },
            setModal: function(modal) {
                this.__modal = modal;
            },
            isModal: function() {
                return this.__modal;
            },
            isViewReady: function() {
                return this.__viewReady;
            },
            getView: function() {
                return this.view;
            },
            setViewTransition: function(viewTransition) {
                this.__viewTransition = viewTransition;
                return this;
            },
            getViewTransition: function() {
                return this.__viewTransition;
            },
            setParentViewController: function(viewController) {
                this.parentViewControllerWillChange(viewController);
                this.__parent = viewController;
                this.parentViewControllerDidChange(viewController);
                return this;
            },
            getParentViewController: function() {
                return this.__parent;
            },
            willAddChildViewController: function(viewController) {},
            didAddChildViewController: function(viewController) {},
            willRemoveChildViewController: function(viewController) {},
            didRemoveChildViewController: function(viewController) {},
            parentViewControllerWillChange: function(viewController) {},
            parentViewControllerDidChange: function(viewController) {},
            willPresentModalViewController: function(viewController) {},
            didPresentModalViewController: function(viewController) {},
            willDismissModalViewController: function() {},
            didDismissModalViewController: function() {},
            viewDidLoad: function() {},
            viewDidBecomeReady: function() {},
            viewDidUpdateLayout: function() {},
            viewWillEnter: function() {},
            viewDidEnter: function() {},
            viewWillLeave: function() {},
            viewDidLeave: function() {},
            viewDidRotate: function(orientation) {},
            destroy: function() {
                window.removeEvent("orientationchange", this.bound("__onWindowOrientationChange"));
                this.removeAllChildViewControllers(true);
                this.removeFromParentViewController();
                if (this.__modalViewController) {
                    this.__modalViewController.destroy();
                    this.__modalViewController = null;
                }
                this.view.removeEvent("ready", this.bound("__onViewDidBecomeReady"));
                this.view.removeEvent("layout", this.bound("__onViewDidUpdateLayout"));
                this.view.destroy();
                this.view = null;
                if (this.__title) {
                    this.__title.destroy();
                    this.__title = null;
                }
                if (this.__image) {
                    this.__image.destroy();
                    this.__image = null;
                }
                this.__parent = null;
                this.__children = null;
                this.__viewTransition = null;
            },
            __onPresentTransitionStart: function() {
                this.__modalViewController.viewWillEnter();
            },
            __onPresentTransitionCompleted: function() {
                this.__modalViewController.viewDidEnter();
                this.didPresentModalViewController();
            },
            __onDismissTransitionStart: function() {
                this.__modalViewController.viewWillLeave();
            },
            __onDismissTransitionCompleted: function() {
                this.__modalViewController.viewDidLeave();
                this.__modalViewController.setParentViewController(this);
                this.__modalViewController.setModal(false);
                this.__modalViewController.destroy();
                this.__modalViewController = null;
                this.didDismissModalViewController();
            },
            __onViewDidBecomeReady: function() {
                this.viewDidBecomeReady();
            },
            __onViewDidUpdateLayout: function() {
                this.viewDidUpdateLayout();
            },
            __onWindowOrientationChange: function(e) {
                var name = Math.abs(window.orientation) === 90 ? "landscape" : "portrait";
                if (this.didRotate) {
                    this.didRotate(name);
                    console.log('[DEPRECATION NOTICE] The method "didRotate" will be removed in 0.4, use the method "viewDidRotate" instead');
                }
                this.viewDidRotate(name);
            }
        });
    },
    "1i": function(require, module, exports, global) {
        "use strict";
        var ViewControllerStack = moobile.ViewControllerStack = new Class({
            Extends: moobile.ViewController,
            _animating: false,
            loadView: function() {
                this.view = new moobile.ViewStack;
            },
            pushViewController: function(viewController, viewTransition) {
                if (this._animating) return this;
                if (this.getTopViewController() === viewController) return this;
                var childViewControllers = this.getChildViewControllers();
                this.willPushViewController(viewController);
                this.addChildViewController(viewController);
                var viewControllerPushed = viewController;
                var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
                var viewToShow = viewControllerPushed.getView();
                var viewToHide = viewControllerBefore ? viewControllerBefore.getView() : null;
                this._animating = true;
                if (childViewControllers.length === 1) {
                    this._onPushTransitionStart();
                    this._onPushTransitionComplete();
                    return this;
                }
                viewTransition = viewTransition || new ViewTransition.None;
                viewTransition.addEvent("start:once", this.bound("_onPushTransitionStart"));
                viewTransition.addEvent("complete:once", this.bound("_onPushTransitionComplete"));
                viewTransition.enter(viewToShow, viewToHide, this.view);
                viewControllerPushed.setViewTransition(viewTransition);
                return this;
            },
            _onPushTransitionStart: function() {
                var childViewControllers = this.getChildViewControllers();
                var viewControllerPushed = childViewControllers.getLastItemAtOffset(0);
                var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
                if (viewControllerBefore) {
                    viewControllerBefore.viewWillLeave();
                }
                viewControllerPushed.viewWillEnter();
            },
            _onPushTransitionComplete: function() {
                var childViewControllers = this.getChildViewControllers();
                var viewControllerPushed = childViewControllers.getLastItemAtOffset(0);
                var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
                if (viewControllerBefore) {
                    viewControllerBefore.viewDidLeave();
                }
                this.didPushViewController(viewControllerPushed);
                viewControllerPushed.viewDidEnter();
                this._animating = false;
            },
            popViewController: function() {
                if (this._animating) return this;
                var childViewControllers = this.getChildViewControllers();
                if (childViewControllers.length <= 1) return this;
                var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
                var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
                this.willPopViewController(viewControllerPopped);
                this._animating = true;
                var viewTransition = viewControllerPopped.getViewTransition();
                viewTransition.addEvent("start:once", this.bound("_onPopTransitionStart"));
                viewTransition.addEvent("complete:once", this.bound("_onPopTransitionComplete"));
                viewTransition.leave(viewControllerBefore.getView(), viewControllerPopped.getView(), this.view);
                return this;
            },
            popViewControllerUntil: function(viewController) {
                if (this._animating) return this;
                var childViewControllers = this.getChildViewControllers();
                if (childViewControllers.length <= 1) return this;
                var viewControllerIndex = this.getChildViewControllerIndex(viewController);
                if (viewControllerIndex > -1) {
                    for (var i = childViewControllers.length - 2; i > viewControllerIndex; i--) {
                        var viewControllerToRemove = this.getChildViewControllerAt(i);
                        viewControllerToRemove.viewWillLeave();
                        viewControllerToRemove.viewDidLeave();
                        viewControllerToRemove.removeFromParentViewController();
                        viewControllerToRemove.destroy();
                        viewControllerToRemove = null;
                    }
                }
                this.popViewController();
                return this;
            },
            _onPopTransitionStart: function(e) {
                var childViewControllers = this.getChildViewControllers();
                var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
                var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
                viewControllerBefore.viewWillEnter();
                viewControllerPopped.viewWillLeave();
            },
            _onPopTransitionComplete: function(e) {
                var childViewControllers = this.getChildViewControllers();
                var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
                var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
                viewControllerBefore.viewDidEnter();
                viewControllerPopped.viewDidLeave();
                viewControllerPopped.removeFromParentViewController();
                this.didPopViewController(viewControllerPopped);
                viewControllerPopped.destroy();
                viewControllerPopped = null;
                this._animating = false;
            },
            getTopViewController: function() {
                return this.getChildViewControllers().getLast();
            },
            didAddChildViewController: function(viewController) {
                this.parent(viewController);
                viewController.setViewControllerStack(this);
            },
            didRemoveChildViewController: function(viewController) {
                this.parent(viewController);
                viewController.setViewControllerStack(null);
            },
            willPushViewController: function(viewController) {},
            didPushViewController: function(viewController) {},
            willPopViewController: function(viewController) {},
            didPopViewController: function(viewController) {}
        });
        Class.refactor(moobile.ViewController, {
            _viewControllerStack: null,
            setViewControllerStack: function(viewControllerStack) {
                if (this._viewControllerStack === viewControllerStack) return this;
                this.parentViewControllerStackWillChange(viewControllerStack);
                this._viewControllerStack = viewControllerStack;
                this.parentViewControllerStackDidChange(viewControllerStack);
                if (this instanceof moobile.ViewControllerStack) return this;
                var by = function(component) {
                    return !(component instanceof moobile.ViewControllerStack);
                };
                this.getChildViewControllers().filter(by).invoke("setViewControllerStack", viewControllerStack);
                return this;
            },
            getViewControllerStack: function() {
                return this._viewControllerStack;
            },
            parentViewControllerStackWillChange: function(viewController) {},
            parentViewControllerStackDidChange: function(viewController) {},
            willAddChildViewController: function(viewController) {
                this.previous(viewController);
                viewController.setViewControllerStack(this._viewControllerStack);
            },
            willRemoveChildViewController: function(viewController) {
                this.previous(viewController);
                viewController.setViewControllerStack(null);
            }
        });
    },
    "1j": function(require, module, exports, global) {
        "use strict";
        var ViewControllerQueue = moobile.ViewControllerQueue = new Class({
            Extends: moobile.ViewControllerStack,
            options: {
                length: Infinity
            },
            loadView: function() {
                this.view = new moobile.ViewQueue;
            },
            prependViewController: function(viewController, viewTransition) {
                if (!viewTransition) {
                    var childViewController = this.getChildViewControllerAt(0);
                    if (childViewController) {
                        viewTransition = childViewController.getViewTransition();
                    } else {
                        viewTransition = new ViewTransition.None;
                    }
                }
                viewController.setViewTransition(viewTransition);
                this.addChildViewControllerAt(viewController, 0);
                this.popViewController();
                return this;
            },
            didAddChildViewController: function(viewController) {
                this.parent(viewController);
                viewController.setViewControllerQueue(this);
            },
            didRemoveChildViewController: function(viewController) {
                this.parent(viewController);
                viewController.setViewControllerQueue(null);
            },
            _onPushTransitionComplete: function() {
                this.parent();
                var length = this.options.length;
                if (length === Infinity) return;
                var children = this.getChildViewControllers();
                if (children.length > length) {
                    var diff = children.length - length;
                    for (var i = 0; i < diff; i++) {
                        children[i].removeFromParentViewController(true);
                    }
                }
            }
        });
        Class.refactor(moobile.ViewController, {
            _viewControllerQueue: null,
            setViewControllerQueue: function(viewControllerQueue) {
                if (this._viewControllerQueue === viewControllerQueue) return this;
                this.viewControllerQueueWillChange(viewControllerQueue);
                this._viewControllerQueue = viewControllerQueue;
                this.viewControllerQueueDidChange(viewControllerQueue);
                if (this instanceof moobile.ViewControllerQueue) return this;
                var by = function(component) {
                    return !(component instanceof moobile.ViewControllerQueue);
                };
                this.getChildViewControllers().filter(by).invoke("setViewControllerQueue", viewControllerQueue);
                return this;
            },
            getViewControllerQueue: function() {
                return this._viewControllerQueue;
            },
            viewControllerQueueWillChange: function(viewController) {},
            viewControllerQueueDidChange: function(viewController) {},
            willAddChildViewController: function(viewController) {
                this.previous(viewController);
                viewController.setViewControllerQueue(this._viewControllerQueue);
            },
            willRemoveChildViewController: function(viewController) {
                this.previous(viewController);
                viewController.setViewControllerQueue(null);
            }
        });
    },
    "1k": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition = new Class({
            Implements: [ Events, Options, Class.Binds ],
            initialize: function(options) {
                this.setOptions(options);
                return this;
            },
            enter: function(viewToShow, viewToHide, parentView) {
                viewToHide.disableTouch();
                viewToShow.disableTouch();
                this.enterAnimation(viewToShow, viewToHide, parentView);
                this.fireEvent("start");
                return this;
            },
            leave: function(viewToShow, viewToHide, parentView) {
                viewToShow.disableTouch();
                viewToHide.disableTouch();
                this.leaveAnimation(viewToShow, viewToHide, parentView);
                this.fireEvent("start");
                return this;
            },
            didEnter: function(viewToShow, viewToHide, parentView) {
                viewToHide.enableTouch();
                viewToShow.enableTouch();
                this.fireEvent("complete");
                return this;
            },
            didLeave: function(viewToShow, viewToHide, parentView) {
                viewToHide.enableTouch();
                viewToShow.enableTouch();
                this.fireEvent("complete");
                return this;
            },
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                throw new Error("You must override this method");
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                throw new Error("You must override this method");
            }
        });
    },
    "1l": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var CoverBox = moobile.ViewTransition.Box = new Class({
            Extends: moobile.ViewTransition,
            overlay: null,
            wrapper: null,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                this.overlay = new Overlay;
                this.overlay.addClass("transition-cover-box-overlay");
                this.overlay.hide();
                parentView.addChildComponent(this.overlay);
                this.wrapper = document.createElement("div");
                this.wrapper.addClass("transition-cover-box-foreground-view-wrapper");
                this.wrapper.wraps(viewToShow);
                var onStart = function() {
                    parentElem.addClass("transition-cover-box-enter");
                    viewToHide.addClass("transition-cover-box-background-view");
                    viewToShow.addClass("transition-cover-box-foreground-view");
                    viewToShow.show();
                    this.overlay.showAnimated();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-cover-box-enter");
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(this.wrapper);
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-cover-box-leave");
                    this.overlay.hideAnimated();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-cover-box-leave");
                    viewToShow.removeClass("transition-cover-box-background-view");
                    viewToHide.removeClass("transition-cover-box-foreground-view");
                    viewToHide.hide();
                    this.overlay.removeFromParentComponent();
                    this.overlay.destroy();
                    this.overlay = null;
                    this.didLeave(viewToShow, viewToHide, parentView);
                    this.wrapper.destroy();
                    this.wrapper = null;
                }.bind(this);
                var animation = new moobile.Animation(this.wrapper);
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            shouldHideViewToHideOnEnter: function(viewToShow, viewToHide, parentView) {
                return false;
            }
        });
    },
    "1m": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var Cover = moobile.ViewTransition.Cover = new Class({
            Extends: moobile.ViewTransition,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-cover-enter");
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-cover-enter");
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(viewToShow);
                animation.setAnimationClass("transition-view-to-show");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-cover-leave");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-cover-leave");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(viewToHide);
                animation.setAnimationClass("transition-view-to-hide");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            }
        });
    },
    "1n": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var Cubic = moobile.ViewTransition.Cubic = new Class({
            Extends: moobile.ViewTransition,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var parentWrap = parentView.getContentWrapperElement();
                var onStart = function() {
                    parentWrap.addClass("transition-cubic-perspective");
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentWrap.removeClass("transition-cubic-perspective");
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(parentElem);
                animation.setAnimationClass("transition-cubic-enter");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var parentWrap = parentView.getContentWrapperElement();
                var onStart = function() {
                    parentWrap.addClass("transition-cubic-perspective");
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentWrap.removeClass("transition-cubic-perspective");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToHide.hide();
                    this.didLeave(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(parentElem);
                animation.setAnimationClass("transition-cubic-leave");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            }
        });
    },
    "1o": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var Drop = moobile.ViewTransition.Drop = new Class({
            Extends: moobile.ViewTransition,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-drop-enter");
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-drop-enter");
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(viewToShow);
                animation.setAnimationClass("transition-view-to-show");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-drop-leave");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-drop-leave");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(viewToHide);
                animation.setAnimationClass("transition-view-to-hide");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            }
        });
    },
    "1p": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var Fade = moobile.ViewTransition.Fade = new Class({
            Extends: moobile.ViewTransition,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-fade-enter");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-fade-enter");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(viewToShow);
                animation.setAnimationClass("transition-view-to-show");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-fade-leave");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-fade-leave");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(viewToHide);
                animation.setAnimationClass("transition-view-to-hide");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            }
        });
    },
    "1q": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var Flip = moobile.ViewTransition.Flip = new Class({
            Extends: moobile.ViewTransition,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var parentWrap = parentView.getContentWrapperElement();
                var onStart = function() {
                    parentWrap.addClass("transition-flip-perspective");
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentWrap.removeClass("transition-flip-perspective");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(parentElem);
                animation.setAnimationClass("transition-flip-enter");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var parentWrap = parentView.getContentWrapperElement();
                var onStart = function() {
                    parentWrap.addClass("transition-flip-perspective");
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    parentWrap.removeClass("transition-flip-perspective");
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.hide();
                    this.didLeave(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(parentElem);
                animation.setAnimationClass("transition-flip-leave");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            }
        });
    },
    "1r": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var None = moobile.ViewTransition.None = new Class({
            Extends: moobile.ViewTransition,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                viewToShow.show();
                viewToHide.hide();
                this.didEnter.delay(50, this, [ viewToShow, viewToHide, parentView ]);
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                viewToShow.show();
                viewToHide.hide();
                this.didLeave.delay(50, this, [ viewToShow, viewToHide, parentView ]);
            }
        });
    },
    "1s": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var Page = moobile.ViewTransition.Page = new Class({
            Extends: moobile.ViewTransition,
            overlay: null,
            wrapper: null,
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                this.overlay = new Overlay;
                this.overlay.addClass("transition-cover-page-overlay");
                this.overlay.hide();
                parentView.addChildComponent(this.overlay);
                this.wrapper = document.createElement("div");
                this.wrapper.addClass("transition-cover-page-foreground-view-wrapper");
                this.wrapper.wraps(viewToShow);
                var onStart = function() {
                    parentElem.addClass("transition-cover-page-enter");
                    viewToHide.addClass("transition-cover-page-background-view");
                    viewToShow.addClass("transition-cover-page-foreground-view");
                    viewToShow.show();
                    this.overlay.showAnimated();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-cover-page-enter");
                    this.didEnter(viewToShow, viewToHide, parentView);
                }.bind(this);
                var animation = new moobile.Animation(this.wrapper);
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var onStart = function() {
                    parentElem.addClass("transition-cover-page-leave");
                    this.overlay.hideAnimated();
                }.bind(this);
                var onEnd = function() {
                    parentElem.removeClass("transition-cover-page-leave");
                    viewToShow.removeClass("transition-cover-page-background-view");
                    viewToHide.removeClass("transition-cover-page-foreground-view");
                    viewToHide.hide();
                    this.overlay.removeFromParentComponent();
                    this.overlay.destroy();
                    this.overlay = null;
                    this.didLeave(viewToShow, viewToHide, parentView);
                    this.wrapper.destroy();
                    this.wrapper = null;
                }.bind(this);
                var animation = new moobile.Animation(this.wrapper);
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            shouldHideViewToHideOnEnter: function(viewToShow, viewToHide, parentView) {
                return false;
            }
        });
    },
    "1t": function(require, module, exports, global) {
        "use strict";
        var ViewTransition = moobile.ViewTransition;
        var prefix = "";
        var vendor = [ "Webkit", "Moz", "O", "ms", "Khtml" ];
        var test = document.createElement("div");
        for (var i = 0; i < vendor.length; i++) {
            var name = vendor[i] + "AnimationName";
            if (name in test.style) {
                prefix = "-" + vendor[i].toLowerCase() + "-";
                break;
            }
        }
        var create = function(name, x1, x2) {
            return "@" + prefix + "keyframes " + name + " { from { " + prefix + "transform: translate3d(" + x1 + "px, 0, 0); } to { " + prefix + "transform: translate3d(" + x2 + "px, 0, 0); }}";
        };
        var unique = function(name) {
            return name + "-" + String.uniqueID();
        };
        var Slide = moobile.ViewTransition.Slide = new Class({
            Extends: moobile.ViewTransition,
            options: {
                enhanceBackButtonOnEnter: true,
                enhanceBackButtonOnLeave: true
            },
            enterAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var style = null;
                var items = [];
                var onStart = function() {
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToHide.hide();
                    this.didEnter(viewToShow, viewToHide, parentView);
                    if (items) {
                        items.invoke("setStyle", "animation-name", null);
                        items = null;
                    }
                    if (style) {
                        style.destroy();
                        style = null;
                    }
                }.bind(this);
                var animation = new moobile.Animation(parentElem);
                animation.setAnimationClass("transition-slide-enter");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            },
            leaveAnimation: function(viewToShow, viewToHide, parentView) {
                var parentElem = parentView.getContentElement();
                var style = null;
                var items = [];
                var onStart = function() {
                    viewToHide.addClass("transition-view-to-hide");
                    viewToShow.addClass("transition-view-to-show");
                    viewToShow.show();
                }.bind(this);
                var onEnd = function() {
                    viewToHide.removeClass("transition-view-to-hide");
                    viewToShow.removeClass("transition-view-to-show");
                    viewToHide.hide();
                    this.didLeave(viewToShow, viewToHide, parentView);
                    if (items) {
                        items.invoke("setStyle", "animation-name", null);
                        items = null;
                    }
                    if (style) {
                        style.destroy();
                        style = null;
                    }
                }.bind(this);
                var animation = new moobile.Animation(parentElem);
                animation.setAnimationClass("transition-slide-leave");
                animation.addEvent("start", onStart);
                animation.addEvent("end", onEnd);
                animation.start();
            }
        });
    },
    "1u": function(require, module, exports, global) {
        "use strict";
        var View = moobile.View;
        var Window = moobile.Window = new Class({
            Extends: View,
            initialize: function(element, options, name) {
                instance = this;
                window.addEvent("orientationchange", this.bound("__onWindowOrientationChange"));
                return this.parent(element, options, name);
            },
            destroy: function() {
                instance = null;
                window.removeEvent("orientationchange", this.bound("__onWindowOrientationChange"));
                this.parent();
            },
            willBuild: function() {
                this.parent();
                this.element.addClass("window");
            },
            didAddChildComponent: function(component) {
                this.parent();
                component.__setParent(this);
                component.__setWindow(this);
            },
            __onWindowOrientationChange: function(e) {
                this.updateLayout();
            }
        });
        var instance = null;
        Window.getCurrentInstance = function() {
            return instance;
        };
    },
    "1v": function(require, module, exports, global) {
        "use strict";
        var ViewController = moobile.ViewController;
        var WindowController = moobile.WindowController = new Class({
            Extends: ViewController,
            __rootViewController: null,
            loadView: function() {
                var element = document.id("window");
                if (element === null) {
                    element = document.createElement("div");
                    element.inject(document.body);
                }
                this.view = new moobile.Window(element);
            },
            setRootViewController: function(rootViewController) {
                if (this.__rootViewController) {
                    this.__rootViewController.destroy();
                    this.__rootViewController = null;
                }
                if (rootViewController) {
                    this.addChildViewController(rootViewController);
                }
                this.__rootViewController = rootViewController;
                return this;
            },
            getRootViewController: function() {
                return this.__rootViewController;
            }
        });
    }
});
