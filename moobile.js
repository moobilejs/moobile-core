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
        require("2");
        require("7");
        require("a");
        require("b");
        require("c");
        require("d");
        require("e");
        var Emitter = require("f");
        var Component = new Class({
            Extends: Emitter,
            _name: null,
            _built: null,
            _ready: false,
            _window: null,
            _parent: null,
            _children: [],
            _visible: true,
            _display: true,
            _style: null,
            _events: {
                listeners: {},
                callbacks: {}
            },
            _size: {
                x: 0,
                y: 0
            },
            _updateLayout: false,
            _updateLayoutTimer: null,
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
                    this.element = this.create();
                }
                this._name = name || this.element.get("data-name");
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
                this.element.store("moobile:component", this);
                var marker = this.element;
                var exists = document.contains(this.element);
                if (exists) this.element = this.element.clone(true, true);
                this._willBuild();
                this._build();
                this._built = true;
                this._didBuild();
                if (exists) this.element.replaces(marker);
                return this;
            },
            create: function() {
                return document.createElement(this.options.tagName);
            },
            _build: function() {
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
                    if (handler instanceof Function) {
                        handler.call(owner, element);
                    }
                });
                if (this.build) {
                    this.build.call(this);
                    console.log('[DEPRECATION NOTICE] The method "build" will be removed in 0.5, use the "_build" method instead');
                }
            },
            _willBuild: function() {
                this.willBuild();
            },
            _didBuild: function() {
                var components = this.options.components;
                if (components) {
                    this.addChildComponents(components);
                }
                this.didBuild();
            },
            addEvent: function(type, fn, internal) {
                var name = type.split(":")[0];
                if (this.shouldSupportNativeEvent(name)) {
                    var self = this;
                    var listeners = this._events.listeners;
                    var callbacks = this._events.callbacks;
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
                if (this.shouldSupportNativeEvent(type)) {
                    var listeners = this._events.listeners;
                    var callbacks = this._events.callbacks;
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
            shouldSupportNativeEvent: function(name) {
                return [ "click", "dblclick", "mouseup", "mousedown", "mouseover", "mouseout", "mousemove", "keydown", "keypress", "keyup", "touchstart", "touchmove", "touchend", "touchcancel", "gesturestart", "gesturechange", "gestureend", "tap", "tapstart", "tapmove", "tapend", "pinch", "swipe", "touchold", "animationend", "transitionend", "owntransitionend", "ownanimationend" ].contains(name);
            },
            addChildComponent: function(component, where) {
                return this._addChildComponent(component, null, where);
            },
            addChildComponentInside: function(component, context, where) {
                return this._addChildComponent(component, document.id(context) || this.getElement(context), where);
            },
            addChildComponentAfter: function(component, after) {
                return this._addChildComponent(component, after, "after");
            },
            addChildComponentBefore: function(component, before) {
                return this._addChildComponent(component, before, "before");
            },
            addChildComponentAt: function(component, index) {
                if (index > this._children.length) {
                    index = this._children.length;
                } else if (index < 0) {
                    index = 0;
                }
                var before = this.getChildComponentAt(index);
                if (before) {
                    return this.addChildComponentBefore(component, before);
                }
                return this.addChildComponent(component, "bottom");
            },
            _addChildComponent: function(component, context, where) {
                component.removeFromParentComponent();
                if (context) {
                    context = document.id(context) || this.element.getElement(context);
                } else {
                    context = this.element;
                }
                this._willAddChildComponent(component);
                this._inject(component, context, where);
                this._insert(component);
                component._setParent(this);
                component._setWindow(this._window);
                this._didAddChildComponent(component);
                if (this._ready) {
                    component._setReady(true);
                }
                this._setUpdateLayout(true);
                return this;
            },
            addChildComponents: function(components, where) {
                return this._addChildComponents(components, null, where);
            },
            addChildComponentsInside: function(component, context, where) {
                return this._addChildComponents(component, document.id(context) || this.getElement(context), where);
            },
            addChildComponentsAfter: function(component, after) {
                return this._addChildComponents(component, after, "after");
            },
            addChildComponentsBefore: function(component, before) {
                return this._addChildComponents(component, before, "before");
            },
            _addChildComponents: function(components, context, where) {
                components.invoke("removeFromParentComponent");
                if (context) {
                    context = document.id(context) || this.element.getElement(context);
                } else {
                    context = this.element;
                }
                var fragment = document.createDocumentFragment();
                for (var i = 0, l = components.length; i < l; i++) {
                    var component = components[i];
                    this._willAddChildComponent(component);
                    this._inject(component, context, null, fragment);
                }
                switch (where) {
                  case "top":
                    var first = context.firstChild;
                    if (first) {
                        context.insertBefore(fragment, first);
                        break;
                    }
                    context.appendChild(fragment);
                    break;
                  case "after":
                    var parent = context.parentNode;
                    if (parent) {
                        var next = context.nextSibling;
                        if (next) {
                            parent.insertBefore(fragment, next);
                            break;
                        }
                        parent.appendChild(fragment);
                    }
                    break;
                  case "before":
                    var parent = context.parentNode;
                    if (parent) {
                        parent.insertBefore(fragment, context);
                    }
                    break;
                  case "bottom":
                    context.appendChild(fragment);
                    break;
                  default:
                    context.appendChild(fragment);
                    break;
                }
                for (var i = 0, l = components.length; i < l; i++) {
                    var component = components[i];
                    this._insert(component);
                    component._setParent(this);
                    component._setWindow(this._window);
                    this._didAddChildComponent(component);
                    if (this._ready) {
                        component._setReady(true);
                    }
                }
                this._setUpdateLayout(true);
                return this;
            },
            _willAddChildComponent: function(component) {
                this.willAddChildComponent(component);
            },
            _didAddChildComponent: function(component) {
                this.didAddChildComponent(component);
            },
            _inject: function(component, context, where, fragment) {
                var element = component.getElement();
                if (where || this.hasElement(element) === false) {
                    if (fragment) {
                        fragment.appendChild(element);
                    } else {
                        element.inject(context, where);
                    }
                }
                return this;
            },
            _insert: function(component) {
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
                        var found = getLastComponentIndex.call(this, node);
                        if (found !== null) {
                            index = found;
                            break;
                        }
                    }
                } while (node);
                this._children.splice(index, 0, component);
                return this;
            },
            getChildComponent: function(name) {
                return this._children.find(function(child) {
                    return child.getName() === name;
                });
            },
            getChildComponentByType: function(type, name) {
                return this._children.find(function(child) {
                    return child instanceof type && child.getName() === name;
                });
            },
            getChildComponentAt: function(index) {
                return this._children[index] || null;
            },
            getChildComponentByTypeAt: function(type, index) {
                return this.getChildComponentsByType(type)[index] || null;
            },
            getChildComponentIndex: function(component) {
                return this._children.indexOf(component);
            },
            getChildComponents: function() {
                return this._children;
            },
            getChildComponentsByType: function(type) {
                return this._children.filter(function(child) {
                    return child instanceof type;
                });
            },
            hasChildComponent: function(component) {
                return this._children.contains(component);
            },
            hasChildComponentByType: function(type) {
                return this._children.some(function(child) {
                    return child instanceof type;
                });
            },
            getComponent: function(name) {
                var component = this.getChildComponent(name);
                if (component === null) {
                    for (var i = 0, len = this._children.length; i < len; i++) {
                        var found = this._children[i].getComponent(name);
                        if (found) return found;
                    }
                }
                return component;
            },
            getComponentByType: function(type, name) {
                var component = this.getChildComponentByType(type, name);
                if (component === null) {
                    for (var i = 0, len = this._children.length; i < len; i++) {
                        var found = this._children[i].getComponentByType(type, name);
                        if (found) return found;
                    }
                }
                return component;
            },
            hasComponent: function(name) {
                var exists = this.hasChildComponent(name);
                if (exists === false) {
                    for (var i = 0, len = this._children.length; i < len; i++) {
                        var found = this._children[i].hasComponent(name);
                        if (found) return found;
                    }
                }
                return exists;
            },
            hasComponentByType: function(type, name) {
                var exists = this.hasChildComponentByType(type, name);
                if (exists === false) {
                    for (var i = 0, len = this._children.length; i < len; i++) {
                        var found = this._children[i].hasComponentByType(type, name);
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
                this._willRemoveChildComponent(component);
                var element = component.getElement();
                if (element) {
                    element.dispose();
                }
                this._children.erase(component);
                component._setParent(null);
                component._setWindow(null);
                component._setReady(false);
                this._didRemoveChildComponent(component);
                if (destroy) {
                    component.destroy();
                }
                this._setUpdateLayout(true);
                return this;
            },
            removeAllChildComponents: function(destroy) {
                return this.removeAllChildComponentsByType(Component, destroy);
            },
            removeAllChildComponentsByType: function(type, destroy) {
                this._children.filter(function(child) {
                    return child instanceof type;
                }).invoke("removeFromParentComponent", destroy);
                return this;
            },
            removeFromParentComponent: function(destroy) {
                var parent = this.getParentComponent();
                if (parent) parent.removeChildComponent(this, destroy);
                return this;
            },
            _willRemoveChildComponent: function(component) {
                this.willRemoveChildComponent(component);
            },
            _didRemoveChildComponent: function(component) {
                this.didRemoveChildComponent(component);
            },
            _setParent: function(parent) {
                if (this._parent === parent) return this;
                this._parentComponentWillChange(parent);
                this._parent = parent;
                this._parentComponentDidChange(parent);
                return this;
            },
            _parentComponentWillChange: function(parent) {
                this.parentComponentWillChange(parent);
            },
            _parentComponentDidChange: function(parent) {
                if (parent) {
                    if (this._display) {
                        this._visible = this._isVisible();
                    }
                } else {
                    this._visible = this._display;
                }
                this.parentComponentDidChange(parent);
            },
            getParentComponent: function() {
                return this._parent;
            },
            hasParentComponent: function() {
                return !!this._parent;
            },
            _setWindow: function(window) {
                if (this._window === window) return this;
                this._windowWillChange(window);
                this._window = window;
                this._windowDidChange(window);
                this._children.invoke("_setWindow", window);
                return this;
            },
            _windowWillChange: function(window) {
                this.windowWillChange(window);
            },
            _windowDidChange: function(window) {
                this.windowDidChange(window);
            },
            getWindow: function() {
                return this._window;
            },
            hasWindow: function() {
                return !!this._window;
            },
            _setReady: function(ready) {
                if (this._ready === ready) return this;
                this._willChangeReadyState();
                this._ready = ready;
                this._didChangeReadyState();
                this._children.invoke("_setReady", ready);
                this.fireEvent("ready");
                this._setUpdateLayout(ready);
                return this;
            },
            _willChangeReadyState: function() {},
            _didChangeReadyState: function() {
                if (this._ready) this.didBecomeReady();
            },
            isReady: function() {
                return this._ready;
            },
            isBuilt: function() {
                return this._built;
            },
            getName: function() {
                return this._name;
            },
            setStyle: function(name) {
                if (this._style) {
                    this._style.detach.call(this, this.element);
                    this._style = null;
                }
                var style = Component.getStyle(name, this);
                if (style) {
                    style.attach.call(this, this.element);
                }
                this._style = style;
                this._setUpdateLayout(true);
                return this;
            },
            getStyle: function() {
                return this._style ? this._style.name : null;
            },
            hasStyle: function(name) {
                return this._style ? this._style.name === name : false;
            },
            addClass: function(name) {
                if (this.element.hasClass(name) === false) {
                    this.element.addClass(name);
                    this._setUpdateLayout(true);
                }
                return this;
            },
            removeClass: function(name) {
                if (this.element.hasClass(name) === true) {
                    this.element.removeClass(name);
                    this._setUpdateLayout(true);
                }
                return this;
            },
            toggleClass: function(name, force) {
                this.element.toggleClass(name, force);
                this._setUpdateLayout(true);
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
                if (this._size.x !== x || this._size.y !== y) {
                    this._setUpdateLayout(true);
                }
                this._size.x = x;
                this._size.y = y;
                return this;
            },
            getSize: function() {
                return this.element.getSize();
            },
            getPosition: function(relative) {
                return this.element.getPosition(document.id(relative) || this._parent);
            },
            show: function() {
                if (this._display === true || this._visible === true) return this;
                this._display = true;
                this._willShow();
                this.removeClass("hidden");
                this._didShow();
                this._setUpdateLayout(true);
                return this;
            },
            _willShow: function() {
                if (this._display === false || this._visible === true) return;
                this.willShow();
                this._children.invoke("_willShow");
            },
            _didShow: function() {
                if (this._display === false || this._visible === true) return;
                this._visible = true;
                this.didShow();
                this.fireEvent("show");
                this._children.invoke("_didShow");
            },
            hide: function() {
                if (this._display === false) return this;
                this._willHide();
                this.addClass("hidden");
                this._didHide();
                this._display = false;
                this._setUpdateLayout(false);
                return this;
            },
            _willHide: function() {
                if (this._display === false || this._visible === false) return;
                this.willHide();
                this._children.invoke("_willHide");
            },
            _didHide: function() {
                if (this._display === false || this._visible === false) return;
                this._visible = false;
                this.didHide();
                this.fireEvent("hide");
                this._children.invoke("_didHide");
            },
            isVisible: function() {
                return this._visible;
            },
            _isVisible: function() {
                if (this._display) {
                    return this._parent ? this._parent._isVisible() : true;
                }
                return false;
            },
            _setUpdateLayout: function(updateLayout, dispatcher) {
                updateLayout = updateLayout && this._built && this._ready && this._display && this._visible;
                if (this._updateLayout === updateLayout) return this;
                this._updateLayout = updateLayout;
                if (this._updateLayoutTimer) {
                    this._updateLayoutTimer = cancelAnimationFrame(this._updateLayoutTimer);
                }
                if (this._updateLayout && !dispatcher) {
                    this._updateLayoutTimer = requestAnimationFrame(this._didUpdateLayout.bind(this));
                }
                this._children.invoke("_setUpdateLayout", updateLayout, this);
                return this;
            },
            _didUpdateLayout: function() {
                if (this._updateLayoutTimer) {
                    this._updateLayoutTimer = cancelAnimationFrame(this._updateLayoutTimer);
                }
                if (this._updateLayout) {
                    this._updateLayout = false;
                    this.didUpdateLayout();
                    this.fireEvent("layout");
                }
                this._children.invoke("_didUpdateLayout");
            },
            willBuild: function() {},
            didBuild: function() {},
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
            destroy: function() {
                this.removeAllChildComponents(true);
                this.removeFromParentComponent();
                this.element.destroy();
                this.element = null;
                this._window = null;
                this._parent = null;
                return this;
            },
            toElement: function() {
                return this.element;
            },
            setParentComponent: function(parent) {
                console.log('[DEPRECATION NOTICE] The method "setParentComponent" will be removed in 0.5, this is not part of the public API anymore');
                return this._setParent(parent);
            },
            setWindow: function(window) {
                console.log('[DEPRECATION NOTICE] The method "setWindow" will be removed in 0.5, this is not part of the public API anymore');
                return this._setWindow(window);
            },
            setReady: function(ready) {
                console.log('[DEPRECATION NOTICE] The method "setReady" will be removed in 0.5, this is not part of the public API anymore');
                return this._setReady(ready);
            },
            eventIsNative: function(name) {
                console.log('[DEPRECATION NOTICE] The method "eventIsNative" will be removed in 0.6, use the method "shouldSupportNativeEvent" instead.');
                return this.shouldSupportNativeEvent(name);
            },
            getChildComponentOfType: function(type, name) {
                console.log('[DEPRECATION NOTICE] The method "getChildComponentOfType" will be removed in 0.5, use the method "getChildComponentByType" instead.');
                return this.getChildComponentByType(type, name);
            },
            getChildComponentOfTypeAt: function(type, index) {
                console.log('[DEPRECATION NOTICE] The method "getChildComponentOfTypeAt" will be removed in 0.5, use the method "getChildComponentByTypeAt" instead.');
                return this.getChildComponentByTypeAt(type, index);
            },
            getChildComponentsOfType: function(type) {
                console.log('[DEPRECATION NOTICE] The method "getChildComponentsOfType" will be removed in 0.5, use the method "getChildComponentsByType" instead.');
                return this.getChildComponentsByType(type);
            },
            hasChildComponentOfType: function(type) {
                console.log('[DEPRECATION NOTICE] The method "hasChildComponentOfType" will be removed in 0.5, use the method "hasChildComponentByType" instead.');
                return this.hasChildComponentByType(type);
            },
            getDescendantComponent: function(name) {
                console.log('[DEPRECATION NOTICE] The method "getDescendantComponent" will be removed in 0.5, use the method "getComponent" instead.');
                return this.getComponent(name);
            },
            getComponentOfType: function(type, name) {
                console.log('[DEPRECATION NOTICE] The method "getComponentOfType" will be removed in 0.5, use the method "getComponentByType" instead.');
                return this.getComponentByType(type, name);
            },
            hasComponentOfType: function(type, name) {
                console.log('[DEPRECATION NOTICE] The method "hasComponentOfType" will be removed in 0.5, use the method "hasComponentByType" instead.');
                return this.hasComponentByType(type, name);
            }
        });
        var getLastComponentIndex = function(root) {
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
                    var found = getLastComponentIndex.call(this, node);
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
        module.exports = Component;
    },
    "2": function(require, module, exports, global) {
        "use strict";
        require("3");
        require("5");
        require("6");
    },
    "3": function(require, module, exports, global) {
        "use strict";
        var storage = require("4").createStorage();
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
    "4": function(require, module, exports, global) {
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
    "5": function(require, module, exports, global) {
        "use strict";
        var defineCustomEvent = require("3");
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
    "6": function(require, module, exports, global) {
        "use strict";
        var defineCustomEvent = require("3");
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
    "7": function(require, module, exports, global) {
        "use strict";
        require("8");
        require("9");
    },
    "8": function(require, module, exports, global) {
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
    "9": function(require, module, exports, global) {
        "use strict";
        var map = require("4")();
        var defineCustomEvent = require("3");
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
    a: function(require, module, exports, global) {
        "use strict";
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
    b: function(require, module, exports, global) {
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
    c: function(require, module, exports, global) {
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
    d: function(require, module, exports, global) {
        "use strict";
        Request.prototype.options.isSuccess = function() {
            var status = this.status;
            return status === 0 || status >= 200 && status < 300;
        };
    },
    e: function(require, module, exports, global) {
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
    f: function(require, module, exports, global) {
        "use strict";
        var fireEvent = Events.prototype.fireEvent;
        var Emitter = new Class({
            Implements: [ Events, Options ],
            __bound: {},
            bound: function(name) {
                var func = this[name];
                if (typeof func === "function") return this.__bound[name] ? this.__bound[name] : this.__bound[name] = func.bind(this);
                throw new Error("Cannot bind function " + name);
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
        module.exports = Emitter;
    }
});
