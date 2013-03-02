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
        var moobile = {
            version: "0.3.0-dev"
        };
        moobile.Component = require("1");
    },
    "1": function(require, module, exports, global) {
        "use strict";
        module.exports = require("2");
    },
    "2": function(require, module, exports, global) {
        "use strict";
        require("3");
        require("8");
        require("b");
        require("c");
        require("d");
        require("g");
        require("h");
        require("i");
        require("e");
        var requestAnimationFrame = require("j").request;
        var cancelAnimationFrame = require("j").cancel;
        var EventFirer = require("o");
        var Component = module.exports = new Class({
            Extends: EventFirer,
            __name: null,
            __ready: false,
            __window: null,
            __parent: null,
            __children: [],
            __visible: true,
            __display: true,
            __style: null,
            __listeners: {},
            __callbacks: {},
            __size: {
                x: 0,
                y: 0
            },
            __updateLayout: false,
            __updateTimeout: null,
            element: null,
            options: {
                className: null,
                styleName: null,
                tagName: "div",
                components: null
            },
            initialize: function(element, options, name) {
                this.element = Element.from(element);
                if (this.element === null) {
                    this.element = document.createElement(this.options.tagName);
                }
                this.__name = name || this.element.get("data-name");
                this.element.store("moobile:component", this);
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
                this.setOptions(options);
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
                this.__updateTimeout = clearTimeout(this.__updateTimeout);
                return this;
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
                return [ "click", "dblclick", "mouseup", "mousedown", "mouseover", "mouseout", "mousemove", "keydown", "keypress", "keyup", "touchstart", "touchmove", "touchend", "touchcancel", "gesturestart", "gesturechange", "gestureend", "tap", "tapstart", "tapmove", "tapend", "pinch", "swipe", "touchold", "animationend", "transitionend", "owntransitionend", "ownanimationend" ].contains(name);
            },
            addChildComponent: function(component, where, context) {
                component.removeFromParentComponent();
                if (context) {
                    context = document.id(context) || this.element.getElement(context);
                } else {
                    context = this.element;
                }
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
                    var key = arguments[0];
                    var val = arguments[1];
                    this.element.setStyle(key, val);
                } else {
                    if (this.__style) {
                        this.__style.detach.call(this, this.element);
                        this.__style = null;
                    }
                    var style = Component.getStyle(name, this);
                    if (style) {
                        style.attach.call(this, this.element);
                    }
                    this.__style = style;
                }
                this.updateLayout();
                return this;
            },
            getStyle: function() {
                return this.__style ? this.__style.name : null;
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
                if (this.__display === true) return;
                if (this.__display === true && this.__visible === false) return;
                var items = [];
                var filter = function(child) {
                    if (child === this || child.__display) {
                        items.push(child);
                        return true;
                    }
                }.bind(this);
                invokeSome.call(this, filter, "__willShow");
                this.removeClass("hidden");
                this.__display = true;
                this.__visible = true;
                var children = function(child) {
                    return items.contains(child);
                };
                assignSome.call(this, children, "__visible", true);
                invokeSome.call(this, children, "__didShow");
                this.updateLayout();
                return this;
            },
            hide: function() {
                if (this.__display === false) return this;
                var items = [];
                var filter = function(child) {
                    if (child === this || child.__display === true && child.__visible === true) {
                        items.push(child);
                        return true;
                    }
                }.bind(this);
                var children = function(child) {
                    return items.contains(child);
                };
                invokeSome.call(this, filter, "__willHide");
                this.addClass("hidden");
                this.__visible = false;
                this.__display = false;
                assignSome.call(this, children, "__visible", false);
                invokeSome.call(this, children, "__didHide");
                this.updateLayout(false);
                return this;
            },
            isVisible: function() {
                return this.__visible;
            },
            updateLayout: function(update, dispatcher) {
                update = update && this.__ready && this.__display && this.__visible;
                if (this.__updateLayout === update) return this;
                this.__updateLayout = update;
                if (this.__updateTimeout) {
                    this.__updateTimeout = cancelAnimationFrame(this.__updateTimeout);
                }
                if (this.__updateLayout && !dispatcher) {
                    this.__updateTimeout = requestAnimationFrame(this.__didUpdateLayout.bind(this));
                }
                this.__children.invoke("updateLayout", update, this);
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
                if (parent) {
                    if (this.__display) {
                        this.__visible = this.__isVisible();
                    }
                } else {
                    this.__visible = this.__display;
                }
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
                if (this.__updateTimeout) {
                    this.__updateTimeout = cancelAnimationFrame(this.__updateTimeout);
                }
                if (this.__updateLayout) {
                    this.__updateLayout = false;
                    this.didUpdateLayout();
                    this.fireEvent("didupdatelayout");
                }
                this.__children.invoke("__didUpdateLayout");
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
            __isVisible: function() {
                if (this.__display) {
                    return this.__parent ? this.__parent.__isVisible() : true;
                }
                return false;
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
        var invokeAll = function(method, args) {
            this[method].apply(this, args);
            var each = function(child) {
                invokeAll.apply(child, [ method, args ]);
            };
            this.__children.each(each);
        };
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
    },
    "3": function(require, module, exports, global) {
        "use strict";
        require("4");
        require("6");
        require("7");
    },
    "4": function(require, module, exports, global) {
        "use strict";
        var storage = require("5").createStorage();
        var customs = {};
        var dispatchEvent = Element.prototype.dispatchEvent;
        var addEventListener = Element.prototype.addEventListener;
        var removeEventListener = Element.prototype.removeEventListener;
        Element.prototype.dispatchEvent = function(event, data) {
            var custom = customs[event];
            if (custom) {
                data = data || {};
                if (fail(custom.condition, this, data)) return;
                var name = event;
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(name, custom.bubbleable, custom.cancelable);
                custom.onDispatch.call(this, event, data);
            }
            return dispatchEvent.call(this, event);
        };
        Element.prototype.addEventListener = function(type, listener, capture) {
            var custom = customs[type];
            if (custom) {
                custom.onAdd.call(this);
                listener = validate(this, type, listener);
                var name = root(custom);
                if (name) addEventListener.call(this, name, dispatch(this, type, listener), capture);
            }
            return addEventListener.call(this, type, listener, capture);
        };
        Element.prototype.removeEventListener = function(type, listener, capture) {
            var custom = customs[type];
            if (custom) {
                custom.onRemove.call(this);
                listener = validate(this, type, listener);
                var name = root(custom);
                if (name) removeEventListener.call(this, name, dispatch(this, type, listener), capture);
                detach(this, type, listener);
            }
            return removeEventListener.call(this, type, listener, capture);
        };
        var defineCustomEvent = function(name, custom) {
            custom.base = "base" in custom ? custom.base : null;
            custom.condition = "condition" in custom ? custom.condition : true;
            custom.bubbleable = "bubbleable" in custom ? custom.bubbleable : true;
            custom.cancelable = "cancelable" in custom ? custom.cancelable : true;
            custom.onAdd = custom.onAdd || function() {};
            custom.onRemove = custom.onRemove || function() {};
            custom.onDispatch = custom.onDispatch || function() {};
            var base = customs[custom.base];
            var condition = function(e) {
                return pass(base.condition, this, e) && pass(custom.condition, this, e);
            };
            customs[name] = base ? {
                base: base.base,
                bubbleable: custom.bubbleable,
                cancelable: custom.cancelable,
                condition: condition,
                onAdd: inherit(custom, base, "onAdd"),
                onRemove: inherit(custom, base, "onRemove"),
                onDispatch: inherit(custom, base, "onDispatch")
            } : custom;
        };
        var inherit = function(custom, base, method) {
            return function() {
                base[method].apply(this, arguments);
                custom[method].apply(this, arguments);
            };
        };
        var root = function(custom) {
            var base = custom.base;
            if (base === null) return null;
            var parent = customs[base];
            if (parent) return root(parent);
            return base;
        };
        var pass = function(condition, element, e) {
            return typeof condition === "function" ? condition.call(element, e) : condition;
        };
        var fail = function(condition, element, e) {
            return !pass(condition, element, e);
        };
        var handler = function(element, type, listener) {
            var events = storage(element);
            if (events[type] === undefined) {
                events[type] = [];
            }
            events = events[type];
            for (var i = 0, l = events.length; i < l; i++) {
                var event = events[i];
                if (event.listener === listener) return event;
            }
            event = events[events.length] = {
                dispatch: null,
                validate: null,
                listener: listener
            };
            return event;
        };
        var detach = function(element, type, listener) {
            var events = storage(element);
            if (events[type] === undefined) return;
            events = events[type];
            for (var i = 0, l = events.length; i < l; i++) {
                var event = events[i];
                if (event.listener === listener) {
                    events.splice(i, 1);
                }
            }
            return event;
        };
        var dispatch = function(element, type, listener) {
            var event = handler(element, type, listener);
            if (event.dispatch === null) {
                event.dispatch = function(e) {
                    element.dispatchEvent(type, e);
                };
            }
            return event.dispatch;
        };
        var validate = function(element, type, listener) {
            var event = handler(element, type, listener);
            if (event.validate === null) {
                event.validate = function(e) {
                    if (e instanceof CustomEvent) listener.call(this, e);
                };
            }
            return event.validate;
        };
        module.exports = global.defineCustomEvent = defineCustomEvent;
    },
    "5": function(require, module, exports, global) {
        void function(global, undefined_, undefined) {
            var getProps = Object.getOwnPropertyNames, defProp = Object.defineProperty, toSource = Function.prototype.toString, create = Object.create, hasOwn = Object.prototype.hasOwnProperty, funcName = /^\n?function\s?(\w*)?_?\(/;
            function define(object, key, value) {
                if (typeof key === "function") {
                    value = key;
                    key = nameOf(value).replace(/_$/, "");
                }
                return defProp(object, key, {
                    configurable: true,
                    writable: true,
                    value: value
                });
            }
            function nameOf(func) {
                return typeof func !== "function" ? "" : "name" in func ? func.name : toSource.call(func).match(funcName)[1];
            }
            var Data = function() {
                var dataDesc = {
                    value: {
                        writable: true,
                        value: undefined
                    }
                }, datalock = "return function(k){if(k===s)return l}", uids = create(null), createUID = function() {
                    var key = Math.random().toString(36).slice(2);
                    return key in uids ? createUID() : uids[key] = key;
                }, globalID = createUID(), storage = function(obj) {
                    if (hasOwn.call(obj, globalID)) return obj[globalID];
                    if (!Object.isExtensible(obj)) throw new TypeError("Object must be extensible");
                    var store = create(null);
                    defProp(obj, globalID, {
                        value: store
                    });
                    return store;
                };
                define(Object, function getOwnPropertyNames(obj) {
                    var props = getProps(obj);
                    if (hasOwn.call(obj, globalID)) props.splice(props.indexOf(globalID), 1);
                    return props;
                });
                function Data() {
                    var puid = createUID(), secret = {};
                    this.unlock = function(obj) {
                        var store = storage(obj);
                        if (hasOwn.call(store, puid)) return store[puid](secret);
                        var data = create(null, dataDesc);
                        defProp(store, puid, {
                            value: (new Function("s", "l", datalock))(secret, data)
                        });
                        return data;
                    };
                }
                define(Data.prototype, function get(o) {
                    return this.unlock(o).value;
                });
                define(Data.prototype, function set(o, v) {
                    this.unlock(o).value = v;
                });
                return Data;
            }();
            var WM = function(data) {
                var validate = function(key) {
                    if (key == null || typeof key !== "object" && typeof key !== "function") throw new TypeError("Invalid WeakMap key");
                };
                var wrap = function(collection, value) {
                    var store = data.unlock(collection);
                    if (store.value) throw new TypeError("Object is already a WeakMap");
                    store.value = value;
                };
                var unwrap = function(collection) {
                    var storage = data.unlock(collection).value;
                    if (!storage) throw new TypeError("WeakMap is not generic");
                    return storage;
                };
                var initialize = function(weakmap, iterable) {
                    if (iterable !== null && typeof iterable === "object" && typeof iterable.forEach === "function") {
                        iterable.forEach(function(item, i) {
                            if (item instanceof Array && item.length === 2) set.call(weakmap, iterable[i][0], iterable[i][1]);
                        });
                    }
                };
                function WeakMap(iterable) {
                    if (this === global || this == null || this === WeakMap.prototype) return new WeakMap(iterable);
                    wrap(this, new Data);
                    initialize(this, iterable);
                }
                function get(key) {
                    validate(key);
                    var value = unwrap(this).get(key);
                    return value === undefined_ ? undefined : value;
                }
                function set(key, value) {
                    validate(key);
                    unwrap(this).set(key, value === undefined ? undefined_ : value);
                }
                function has(key) {
                    validate(key);
                    return unwrap(this).get(key) !== undefined;
                }
                function delete_(key) {
                    validate(key);
                    var data = unwrap(this), had = data.get(key) !== undefined;
                    data.set(key, undefined);
                    return had;
                }
                function toString() {
                    unwrap(this);
                    return "[object WeakMap]";
                }
                try {
                    var src = ("return " + delete_).replace("e_", "\\u0065"), del = (new Function("unwrap", "validate", src))(unwrap, validate);
                } catch (e) {
                    var del = delete_;
                }
                var src = ("" + Object).split("Object");
                var stringifier = function toString() {
                    return src[0] + nameOf(this) + src[1];
                };
                define(stringifier, stringifier);
                var prep = {
                    __proto__: []
                } instanceof Array ? function(f) {
                    f.__proto__ = stringifier;
                } : function(f) {
                    define(f, stringifier);
                };
                prep(WeakMap);
                [ toString, get, set, has, del ].forEach(function(method) {
                    define(WeakMap.prototype, method);
                    prep(method);
                });
                return WeakMap;
            }(new Data);
            var defaultCreator = Object.create ? function() {
                return Object.create(null);
            } : function() {
                return {};
            };
            function createStorage(creator) {
                var weakmap = new WM;
                creator || (creator = defaultCreator);
                function storage(object, value) {
                    if (value || arguments.length === 2) {
                        weakmap.set(object, value);
                    } else {
                        value = weakmap.get(object);
                        if (value === undefined) {
                            value = creator(object);
                            weakmap.set(object, value);
                        }
                    }
                    return value;
                }
                return storage;
            }
            if (typeof module !== "undefined") {
                module.exports = WM;
            } else if (typeof exports !== "undefined") {
                exports.WeakMap = WM;
            } else if (!("WeakMap" in global)) {
                global.WeakMap = WM;
            }
            WM.createStorage = createStorage;
            if (global.WeakMap) global.WeakMap.createStorage = createStorage;
        }((0, eval)("this"));
    },
    "6": function(require, module, exports, global) {
        "use strict";
        var defineCustomEvent = require("4");
        var elem = document.createElement("div");
        var base = null;
        var keys = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            msTransition: "MSTransitionEnd",
            transition: "transitionend"
        };
        for (var key in keys) {
            if (key in elem.style) base = keys[key];
        }
        var onDispatch = function(custom, data) {
            custom.propertyName = data.propertyName;
            custom.elapsedTime = data.elapsedTime;
            custom.pseudoElement = data.pseudoElement;
        };
        defineCustomEvent("transitionend", {
            base: base,
            onDispatch: onDispatch
        });
        defineCustomEvent("owntransitionend", {
            base: "transitionend",
            condition: function(e) {
                return e.target === this;
            }
        });
    },
    "7": function(require, module, exports, global) {
        "use strict";
        var defineCustomEvent = require("4");
        var elem = document.createElement("div");
        var base = null;
        var keys = {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            msAnimation: "MSAnimationEnd",
            animation: "animationend"
        };
        for (var key in keys) {
            if (key in elem.style) base = keys[key];
        }
        var onDispatch = function(custom, data) {
            custom.animationName = data.animationName;
            custom.elapsedTime = data.elapsedTime;
        };
        defineCustomEvent("animationend", {
            base: base,
            onDispatch: onDispatch
        });
        defineCustomEvent("ownanimationend", {
            base: "animationend",
            condition: function(e) {
                return e.target === this;
            }
        });
    },
    "8": function(require, module, exports, global) {
        "use strict";
        require("9");
        require("a");
    },
    "9": function(require, module, exports, global) {
        "use strict";
        var hasTouchEvent = "ontouchstart" in global;
        var hasTouchList = "TouchList" in global;
        var hasTouch = "Touch" in global;
        if (!hasTouchList) {
            var TouchList = function() {
                this.length = 0;
            };
            TouchList.prototype.identifiedTouch = function(id) {
                return this[0] && this[0].identifier === id ? this[0] : null;
            };
            TouchList.prototype.item = function(index) {
                return this[index] || null;
            };
        }
        if (!hasTouch) {
            var Touch = function() {};
        }
        var touch = null;
        var target = null;
        var onDocumentMouseDown = function(e) {
            if (target === null) {
                target = e.target;
                touch = new Touch;
                touch.identifier = Date.now();
                touch.screenX = e.screenX;
                touch.screenY = e.screenY;
                touch.clientX = e.clientX;
                touch.clientY = e.clientY;
                touch.pageX = e.pageX;
                touch.pageY = e.pageY;
                touch.radiusX = 0;
                touch.radiusY = 0;
                touch.rotationAngle = 0;
                touch.force = 0;
                touch.target = target;
                var list = new TouchList;
                list.length = 1;
                list[0] = touch;
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("touchstart", true, true);
                event.touches = list;
                event.targetTouches = list;
                event.changedTouches = list;
                target.dispatchEvent(event);
            }
        };
        var onDocumentMouseMove = function(e) {
            if (target) {
                touch.screenX = e.screenX;
                touch.screenY = e.screenY;
                touch.clientX = e.clientX;
                touch.clientY = e.clientY;
                touch.pageX = e.pageX;
                touch.pageY = e.pageY;
                var list = new TouchList;
                list.length = 1;
                list[0] = touch;
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("touchmove", true, true);
                event.touches = list;
                event.targetTouches = list;
                event.changedTouches = list;
                target.dispatchEvent(event);
            }
        };
        var onDocumentMouseUp = function(e) {
            if (target) {
                touch.screenX = e.screenX;
                touch.screenY = e.screenY;
                touch.clientX = e.clientX;
                touch.clientY = e.clientY;
                touch.pageX = e.pageX;
                touch.pageY = e.pageY;
                var list = new TouchList;
                list.length = 1;
                list[0] = touch;
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("touchend", true, true);
                event.touches = new TouchList;
                event.targetTouches = new TouchList;
                event.changedTouches = list;
                target.dispatchEvent(event);
                target = null;
            }
        };
        if (!hasTouchEvent) {
            document.addEventListener("mousedown", onDocumentMouseDown);
            document.addEventListener("mousemove", onDocumentMouseMove);
            document.addEventListener("mouseup", onDocumentMouseUp);
        }
    },
    a: function(require, module, exports, global) {
        "use strict";
        var map = require("5")();
        var defineCustomEvent = require("4");
        var onDispatch = function(custom, data) {
            custom.view = data.view;
            custom.touches = data.touches;
            custom.targetTouches = data.targetTouches;
            custom.changedTouches = data.changedTouches;
            custom.ctrlKey = data.ctrlKey;
            custom.shiftKey = data.shiftKey;
            custom.altKey = data.altKey;
            custom.metaKey = data.metaKey;
        };
        var is = function(parent, node) {
            return parent === node || parent.contains(node);
        };
        var inside = function(x, y, node) {
            var element = document.elementFromPoint(x, y);
            if (element) return is(node, element);
            return false;
        };
        var outside = function(x, y, node) {
            var element = document.elementFromPoint(x, y);
            if (element) return !is(node, element);
            return true;
        };
        var append = function(parent, object) {
            var merge = {};
            for (var k in parent) merge[k] = parent[k];
            for (var k in object) merge[k] = object[k];
            return merge;
        };
        var attach = function(name, func) {
            return function() {
                this.addEventListener(name, func);
            };
        };
        var detach = function(name, func) {
            return function() {
                this.removeEventListener(name, func);
            };
        };
        var storage = function(element, touch) {
            var data = map.get(element);
            if (!data) map.set(element, data = {});
            return data;
        };
        var enters = function(element, touch) {
            var data = storage(element);
            var name = touch.identifier;
            if (data[name] === undefined || data[name] === "out") {
                data[name] = "in";
                return true;
            }
            return false;
        };
        var leaves = function(element, touch) {
            var data = storage(element);
            var name = touch.identifier;
            if (data[name] === undefined || data[name] === "in") {
                data[name] = "out";
                return true;
            }
            return false;
        };
        var enter = function(e) {
            this.dispatchEvent("tapenter", e);
        };
        var leave = function(e) {
            this.dispatchEvent("tapleave", e);
        };
        var custom = {
            onDispatch: onDispatch
        };
        defineCustomEvent("tapstart", append(custom, {
            base: "touchstart",
            condition: function(e) {
                return e.targetTouches.length === 1;
            }
        }));
        defineCustomEvent("tapmove", append(custom, {
            base: "touchmove",
            condition: function(e) {
                return e.targetTouches[0] === e.changedTouches[0];
            }
        }));
        defineCustomEvent("tapend", append(custom, {
            base: "touchend",
            condition: function(e) {
                return e.targetTouches.length === 0;
            }
        }));
        defineCustomEvent("tapcancel", append(custom, {
            base: "touchcancel",
            condition: function(e) {
                return true;
            }
        }));
        defineCustomEvent("tap", append(custom, {
            base: "tapend",
            condition: function(e) {
                var touch = e.changedTouches[0];
                return inside(touch.pageX, touch.pageY, this);
            }
        }));
        defineCustomEvent("tapinside", append(custom, {
            base: "tapmove",
            condition: function(e) {
                var touch = e.targetTouches[0];
                return inside(touch.pageX, touch.pageY, this);
            }
        }));
        defineCustomEvent("tapoutside", append(custom, {
            base: "tapmove",
            condition: function(e) {
                var touch = e.targetTouches[0];
                return outside(touch.pageX, touch.pageY, this);
            }
        }));
        defineCustomEvent("tapenter", append(custom, {
            base: "tapinside",
            condition: function(e) {
                return enters(this, e.targetTouches[0]);
            },
            onAdd: attach("tapstart", enter),
            onRemove: detach("tapstart", enter)
        }));
        defineCustomEvent("tapleave", append(custom, {
            base: "tapoutside",
            condition: function(e) {
                return leaves(this, e.targetTouches[0]);
            },
            onAdd: attach("tapend", leave),
            onRemove: detach("tapend", leave)
        }));
    },
    b: function(require, module, exports, global) {
        "use strict";
        String.implement({
            toCamelCase: function() {
                return this.camelCase().replace("-", "").replace(/\s\D/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
            }
        });
    },
    c: function(require, module, exports, global) {
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
    d: function(require, module, exports, global) {
        "use strict";
        require("e");
        require("g");
        var cache = {};
        Element.at = function(path, async, fn) {
            var element = cache[path];
            if (element) {
                var clone = element.clone(true, true);
                if (fn) fn(clone);
                return clone;
            }
            async = async || false;
            (new Moobile.Request({
                method: "get",
                async: async,
                url: path
            })).addEvent("success", function(response) {
                element = Element.from(response);
                if (fn) fn(element.clone(true, true));
            }).addEvent("failure", function(request) {
                if (fn) fn(null);
            }).send();
            if (element) cache[path] = element;
            return !async ? element.clone(true, true) : null;
        };
    },
    e: function(require, module, exports, global) {
        "use strict";
        module.exports = require("f");
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
    },
    h: function(require, module, exports, global) {
        "use strict";
        Element.implement({
            setRole: function(role) {
                return this.set("data-role", role);
            },
            getRole: function(role) {
                return this.get("data-role");
            },
            ingest: function(element) {
                return this.adopt(document.id(element).childNodes);
            }
        });
    },
    i: function(require, module, exports, global) {
        "use strict";
        var setStyle = Element.prototype.setStyle;
        var getStyle = Element.prototype.getStyle;
        var prefix = function(property) {
            property = property.camelCase();
            if (property in this.style) return property;
            if (cache[property] !== undefined) return cache[property];
            var suffix = property.charAt(0).toUpperCase() + property.slice(1);
            for (var i = 0; i < prefixes.length; i++) {
                var prefixed = prefixes[i] + suffix;
                if (prefixed in this.style) {
                    cache[property] = prefixed;
                    break;
                }
            }
            if (cache[property] === undefined) cache[property] = property;
            return cache[property];
        };
        var prefixes = [ "Khtml", "O", "Ms", "Moz", "Webkit" ];
        var cache = {};
        Element.implement({
            setStyle: function(property, value) {
                return setStyle.call(this, prefix.call(this, property), value);
            },
            getStyle: function(property) {
                return getStyle.call(this, prefix.call(this, property));
            }
        });
    },
    j: function(require, module, exports, global) {
        "use strict";
        var array = require("k");
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
    k: function(require, module, exports, global) {
        "use strict";
        var array = require("l")["array"];
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
    l: function(require, module, exports, global) {
        "use strict";
        var prime = require("m"), type = require("n");
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
    m: function(require, module, exports, global) {
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
    n: function(require, module, exports, global) {
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
    o: function(require, module, exports, global) {
        "use strict";
        require("p");
        console.log(Class.Binds);
        var fireEvent = Events.prototype.fireEvent;
        var EventFirer = module.exports = new Class({
            Implements: [ Events, Options, Class.Binds ],
            on: function() {
                return this.addEvent.apply(this, arguments);
            },
            off: function() {
                return this.removeEvent.apply(this, arguments);
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
    p: function(require, module, exports, global) {
        "use strict";
        Class.Binds = new Class({
            $bound: {},
            bound: function(name) {
                return this.$bound[name] ? this.$bound[name] : this.$bound[name] = this[name].bind(this);
            }
        });
    }
});
