/*
---

name: Entity

description: Provides the base class for objects that encapsulates a DOM
             element. Also support methods to manage a hierarchy of entities.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Class-Extras/Class.Binds

provides:
	- Entity

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @name  Entity
 * @class Provides the base class for objects that encapsulates a DOM element.
 *
 * @classdesc
 *
 * [TODO: Introduction]
 * [TODO: Events]
 *
 * The element given to the class constructor may hold an already
 * established hierarchy. Elements with a `data-role` attribute will then be
 * processed and, in most cases, child entities will be created and added as
 * child of this entity.
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Entity = new Class( /** @lends Entity.prototype */ {

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	$roles: {},

	$styles: {},

	/**
	 * @var    {Object} The current style.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	style: null,

	/**
	 * @var    {Entity} The entity that owns this entity.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	owner: null,

	/**
	 * @var    {String} The name.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	name: null,

	/**
	 * @var    {Element} The root element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	element: null,

	/**
	 * @var    {Array} The child entities.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	children: [],

	/**
	 * @var    {Window} The window.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	window: null,

	/**
	 * @var    {Boolean} Whether this entity is ready.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	ready: false,

	/**
	 * @var    {Object} The class options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * Initializes this entity.
	 *
	 * The `element` given to this entity must be an instance of an `Element`,
	 * an element id or an HTML string that represents an element. An empty
	 * element is automatically created if none was supplied.
	 *
	 * If you override this method, make sure you call the parent method at the
	 * beginning of your implementation.
	 *
	 * @param {Element}	[element] The Element, element id or string.
	 * @param {Object}  [options] The options.
	 * @param {String}  [name]    The name.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(element, options, name) {

		this.name = name;

		var root = document.id(element);
		if (root == null) {
			root = new Element(this.options.tagName);
			if (typeof element == 'string') {
				root = Elements.from(element)[0];
			}
		}

		this.element = root;

		options = options || {};

		for (var option in this.options) {
			var value = this.element.get('data-option-' + option.hyphenate());
			if (value != null) {
				if (options[option] == undefined) {
					options[option] = value;
				}
			}
		}

		this.setOptions(options);

		this.element.addEvent('swipe', this.bound('onSwipe'));
		this.element.addEvent('pinch', this.bound('onPinch'));
		this.element.addEvent('click', this.bound('onClick'));
		this.element.addEvent('mouseup', this.bound('onMouseUp'))
		this.element.addEvent('mousedown', this.bound('onMouseDown'));

		this.willLoad();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}

		var styleName = this.options.styleName
		if (styleName) {
			this.setStyle(styleName);
		}

		this.processRoles();

		this.didLoad();

		return this;
	},

	/**
	 * Destroys this entity.
	 *
	 * This method will remove this entity from its owner, destroy all its
	 * child entities then destroy its element.
	 *
	 * If you override this method, make sure you call the parent method at
	 * the end of your implementation.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.willUnload();

		this.element.removeEvent('swipe', this.bound('onSwipe'));
		this.element.removeEvent('pinch', this.bound('onPinch'));
		this.element.removeEvent('click', this.bound('onClick'));
		this.element.removeEvent('mouseup', this.bound('onMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onMouseDown'));

		this.removeFromOwner();

		this.destroyChildren();

		this.element.destroy();
		this.element = null;
		this.window = null;
		this.owner = null;

		this.didUnload();

		return this;
	},

	destroyChildren: function() {
		this.children.each(this.bound('destroyChild'));
		this.children.empty();
	},

	destroyChild: function(entity) {
		entity.destroy();
	},

	/**
	 * Adds a child entity.
	 *
	 * This method adds a child entity at the bottom of this entity. You may
	 * specify the location of the child entity using the `where` parameter
	 * combined with the optional `context` parameter.
	 *
	 * If specified, the child entity can be added at the `top`, `bottom`,
	 * `before` or `after` this entity. If an element is given as the
	 * `context`, the location will be relative to this element.
	 *
	 * The child entity's element will not be re-injected in this entity's
	 * element if it's already there, in this case only a reference of the
	 * child entity will be stored.
	 *
	 * @param {Entity}  entity    The entity.
	 * @param {String}  [where]   The location.
	 * @param {Element} [context] The location context element.
	 *
	 * @return {Boolean} Whether the child was successfully added.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChild: function(entity, where, context) {

		var element = document.id(entity);
		if (element == null)
			return false;

		if (this.hasChild(entity))
			return false;

		this.willAddChild(entity);

		if (!this.hasElement(element)) {

			context = document.id(context);
			if (context == null) {
				context = this.element;
			} else if (!this.hasElement(context)) {
				throw new Error('The context is not an element of this entity');
			}

			element.inject(context, where);
		}

		this.children.push(entity);

		entity.setOwner(this);
		entity.setWindow(this.window);

		this.didAddChild(entity);

		if (this.ready == false) {
			this.addEvent('ready:once', function() {
				entity.setWindow(this.window);
				entity.setReady();
			}.bind(this));
		} else {
			entity.setReady();
		}

		return true;
	},

	/**
	 * Returns a child entity.
	 *
	 * This method will return an entity from its own entites that matches the
	 * given name.
	 *
	 * @param {String} name The name to look for.
	 *
	 * @return {Entity} The child entity or `null` if no entities were found
	 *                  using the given name.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChild: function(name) {
		return this.children.find(function(children) {
			return children.getName() == name;
		});
	},

	/**
	 * Indicates whether this entity is the direct owner of a given entity.
	 *
	 * @param {Entity} entity The entity.
	 *
	 * @return {Boolean} Whether this entity owns a given entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChild: function(entity) {
		return this.children.contains(entity);
	},

	/**
	 * Returns all the child entities.
	 *
	 * @return {Array} The child entities.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildren: function() {
		return this.children;
	},

	/**
	 * Replaces a child entity with another.
	 *
	 * This method will not attempt to remove the entity to replace if the
	 * entity to add could not be added.
	 *
	 * @param {Entity} oldEntity The entity to remove.
	 * @param {Entity} newEntity The entity to add.
	 *
	 * @return {Boolean} Whether the entity to replace was successfully removed
	 *                   and the entity to add was successfully added.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChild: function(oldEntity, newEntity) {

		var success = this.addChild(newEntity, 'before', oldEntity);
		if (success) {
			return this.removeChild(oldEntity);
		}

		return false;
	},

	/**
	 * Removes a child entity.
	 *
	 * This method will not destroy the given entity upon removal since it
	 * could be added to another entity. If you wish to destroy the given
	 * entity, you must do so manually.
	 *
	 * @param {Entity} entity The entity to remove.
	 *
	 * @return {Boolean} Whether the entity was successfully removed.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChild: function(entity) {

		var element = document.id(entity);
		if (element == null)
			return false;

		if (!this.hasElement(entity))
			return false;

		this.willRemoveChild(entity);

		entity.setOwner(null);
		entity.setWindow(null);
		element.dispose();

		this.children.erase(entity);

		this.didRemoveChild(entity);

		return true;
	},

	/**
	 * Removes this entity from its owner.
	 *
	 * This method will not destroy the given entity upon removal since it
	 * could be added to another entity. If you wish to destroy the given
	 * entity, you must do so manually.
	 *
	 * @return {Boolean} Whether this entity was successfully removed.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeFromOwner: function() {
		return this.owner
		     ? this.owner.removeChild(this)
		     : false;
	},

	/**
	 * Sets the style.
	 *
	 * This method must not be confused with the `Element.setStyle` as it does
	 * not set a CSS style. Instead, this method is used to set a style defined
	 * with `Entity.defineStyle`.
	 *
	 * @param {String} name The style name.
	 *
	 * @return {Entity} This entity.
	 *
	 * @see Entity.defineStyle
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setStyle: function(name) {

		if (this.style) {
			this.style.detach.call(this, this.element);
		}

		var style = this.$styles[name];
		if (style) {
			style.attach.call(this, this.element);
		}

		this.style = style;

		return this;
	},

	/**
	 * Returns the style.
	 *
	 * This method must not be confused with the `Element.getStyle` as it does
	 * not return a CSS style. Instead, this method is used to return a style
	 * defined with `Entity.defineStyle`.
	 *
	 * @return {String} The style name or `null` if no styles were applied to
	 *                  this entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getStyle: function() {
		return this.style.name;
	},

	/**
	 * Adds a CSS class to this entity.
	 *
	 * This method is simply a convenient shortcut that assigns a CSS class to
	 * this entity's element.
	 *
	 * @param {String} name The CSS class.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addClass: function(name) {
		this.element.addClass(name);
		return this;
	},

	/**
	 * Removes a CSS class from this entity.
	 *
	 * This method is simply a convenient shortcut that removes a CSS class
	 * from this entity's element.
	 *
	 * @param {String} name The CSS class.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeClass: function(name) {
		this.element.removeClass(name);
		return this;
	},

	/**
	 * Adds or removes a CSS class from this entity.
	 *
	 * This method is simply a convenient shortcut that adds or removes a
	 * CSS class from this entity's element.
	 *
	 * @param {String} name The CSS class.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	toggleClass: function(name) {
		this.element.toggleClass(name);
		return this;
	},

	/**
	 * Sets the entity that owns this entity.
	 *
	 * This method will assign a reference of the entity who acts as the owner
	 * of this entity. You should seldom need this method as it's mostly used
	 * internally.
	 *
	 * @param {Entity} owner The owner.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setOwner: function(owner) {

		this.ownerWillChange(owner);
		this.owner = owner;
		this.ownerDidChange(owner);

		return this;
	},

	/**
	 * Returns the entity that owns this entitiy.
	 *
	 * This method will return a reference of the entity who acts as the owner
	 * of this entity. You should seldom need this method as it's mostly used
	 * internally.
	 *
	 * @return {Entity} The entity that owns this entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getOwner: function() {
		return this.owner;
	},

	/**
	 * Indicates whether this entity has an owner.
	 *
	 * This method will indicates if a reference of the entity who acts as the
	 * owner of this entity has been set. You should seldom need this method as
	 * it's mostly used internally.
	 *
	 * @return {Boolean} Whether this entity has an owner.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasOwner: function() {
		return !!this.owner;
	},

	/**
	 * Sets this entity as ready.
	 *
	 * This method will set this entity as being ready, meaning its element is
	 * part of an element that is part of the DOM and can be for instance
	 * measured. You should seldom need this method as it's mostly used
	 * internally.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setReady: function() {

		if (this.ready)
			return this;

		this.ready = true;
		this.didBecomeReady();
		this.fireEvent('ready');

		return this;
	},

	/**
	 * Indicates whether this entity is ready.
	 *
	 * This method will indicate whether the entity is ready, meaning its
	 * element is part of an element that is part of the DOM and can be, for
	 * instance, measured. You should seldom need this method as it's mostly
	 * used internally.
	 *
	 * @return {Boolean} Whether the entity is ready.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isReady: function() {
		return this.ready;
	},

	/**
	 * Sets the window.
	 *
	 * This method will assign a reference of the window entity, which contains
	 * the whole application hierarchy. The window is only assigned when this
	 * entity becomes ready.
	 *
	 * @param {Window} window The window.
	 *
	 * @return {Entity}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setWindow: function(window) {
		this.window = window;
		return this;
	},

	/**
	 * Returns the window.
	 *
	 * This method will return a reference of the window entity, which contains
	 * the whole application hierarchy. The window is only available when this
	 * entity becomes ready.
	 *
	 * @return {Window} The window.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWindow: function() {
		return this.window;
	},

	/**
	 * Indicates whether this entity has a window.
	 *
	 * This method will indicates if a reference of the window entity has been
	 * set. The window is only available when this entity becomes ready.
	 *
	 * @return {Boolean} Whether this entity as a window.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasWindow: function() {
		return !!this.window;
	},

	/**
	 * Return the name.
	 *
	 * This method will return this entity's name used to identify this entity
	 * among its sibling. Given at initialization, the name does not need to be
	 * absolutely unique, only different from its siblings.
	 *
	 * @return {String} The name.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this.name;
	},

	/**
	 * Returns this entity's element or the first element that matches the
	 * optional selector.
	 *
	 * This method is working at the element level which means that all
	 * elements, either from this entity's element or a child entity's element
	 * will be returned by this method if they match the given selector.
	 *
	 * @param {String} [selector] An CSS selector.
	 *
	 * @return {Element} This entity's element or the first element that
	 *                   matches the selector.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElement: function(selector) {
		return selector
			? this.element.getElement(selector)
			: this.element;
	},

	/**
	 * Returns a collection of elements.
	 *
	 * This method is working at the element level which means that all
	 * elements, either from this entity's element or a child entity's element
	 * will be returned by this method if they match the given selector.
	 *
	 * @param {String} selector The CSS selector.
	 *
	 * @return {Elements} A collection of elements.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	/**
	 * Indicates whether an element exists.
	 *
	 * This method is working at the element level which means that all
	 * elements, either from this entity's element or a child entity's element
	 * will return a positive if they match the given element.
	 *
	 * @param {Element} element The element.
	 *
	 * @return {Boolean} Whether the element exists.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * Returns an element with a given `data-role` attribute.
	 *
	 * This method will discard any element with a `data-role` attribue that
	 * are child of another element with a `data-role` attribute unless the
	 * latter is this entity's lement.
	 *
	 * @param {String} role The role name.
	 *
	 * @return {Element} The element or `null` if no elements were found.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getRoleElement: function(role) {
		return this.getRoleElements(role)[0] || null;
	},

	/**
	 * Returns a collection of element with a given `data-role` attribute.
	 *
	 * This method will discard any element with a `data-role` attribue that
	 * are child of another element with a `data-role` attribute unless the
	 * latter is this entity's lement.
	 *
	 * @param {String} role The role name.
	 *
	 * @return {Elements} A collection of elements.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getRoleElements: function(role) {

		var validate = this.bound('validateRoleElement');
		var selector = role
		             ? '[data-role=' + role + ']'
		             : '[data-role]';

		return this.element.getElements(selector).filter(validate);
	},

	validateRoleElement: function(element) {

		var parent = element.getParent();
		if (parent) {

			if (parent === this.element)
				return true;

			if (parent.get('data-role'))
				return false;

			return this.validateRoleElement(parent);
		}

		return false;
	},

	processRoles: function() {
		this.getRoleElements().each(function(element) {
			this.defineElementRole(element, element.get('data-role'));
		}, this);
	},

	/**
	 * Applies a role to an element.
	 *
	 * This method will simply execute the function used to define the given
	 * role for the given element. This methods throws an exception if the role
	 * does has not been defined.
	 *
	 * @param {Element} element The element.
	 * @param {String}  name    The role name.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	defineElementRole: function(element, role) {

		if (element.retrieve('entity.has-role'))
			return this;

		if (!this.validateRoleElement(element))
			throw new Error('The element does not belong to this entity');

		var definition = this.$roles[role];
		if (definition == undefined) {
			throw new Error('Role ' + role + ' is not defined');
		}

		definition.call(this, element, element.get('data-name'));

		element.store('entity.has-role', true);

		return this;
	},

	/**
	 * Returns this entity's size.
	 *
	 * This method will return an object with two keys, `x` which indicates the
	 * width of this entity and `y` which indicates the height of this entity.
	 *
	 * @return {Object} This entity's size.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * Shows this entity.
	 *
	 * This method will make this entitiy visible using the `display` CSS
	 * property of this entity's element.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	show: function() {
		this.willShow();
		this.element.show();
		this.didShow();
		return this;
	},

	/**
	 * Hides this entity.
	 *
	 * This method will make this entitiy hidden using the `display` CSS
	 * property of this entity's element.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hide: function() {
		this.willHide();
		this.element.hide();
		this.didHide();
		return this;
	},

	/**
	 * Tells the entity it's about to be loaded.
	 *
	 * This method is called once the entity's element has been set and before
	 * other pieces of the initialization such as processing elements with role
	 * and applying style have taken place.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willLoad: function() {

	},

	/**
	 * Tells the entity it's has been loaded.
	 *
	 * This method is called once the entire initialization process is
	 * completed, after elements with roles were processed and style was
	 * loaded.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLoad: function() {

	},

	/**
	 * Tells the entity it's about to be unloaded.
	 *
	 * This method is called before the entity's element and the child entities
	 * are destroyed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willUnload: function() {

	},

	/**
	 * Tells the entity it has been unloaded.
	 *
	 * This method is called once the entity's element and the child entites
	 * are destroyed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didUnload: function() {

	},

	/**
	 * Tells the entity it has become part of the DOM document.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {

	},

	/**
	 * Tells the entity a child entity is about to be added.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {Entity} entity The entity that is going to be added.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChild: function(entity) {

	},

	/**
	 * Tell the entity a child entity has been added.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {Entity} entity The entity that was added.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChild: function(entity) {

	},

	/**
	 * Tell the entity a child entity is about to be removed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {Entity} entity The entity that will be removed.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChild: function(entity) {

	},

	/**
	 * Tell the entity a child entity has been removed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {Entity} entity The entity that was removed.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChild: function(entity) {

	},

	/**
	 * Tell the entity it's about to be moved to a new entity.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {Entity} owner The entity that will own this entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	ownerWillChange: function(owner) {

	},

	/**
	 * Tell the entity it has been moved to a new entity.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {Entity} owner The entity that owns this entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	ownerDidChange: function(owner) {

	},

	/**
	 * Tell the entity it's about to become visible.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {

	},

	/**
	 * Tell the entity it became visible.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {

	},

	/**
	 * Tell the entity it's about to become hidden.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {

	},

	/**
	 * Tell the entity it became hidden.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {

	},

	onSwipe: function(e) {
		this.fireEvent('swipe', e.target = this);
	},

	onPinch: function(e) {
		this.fireEvent('swipe', e.target = this);
	},

	onClick: function(e) {
		this.fireEvent('click', e.target = this);
	},

	onMouseUp: function(e) {
		this.fireEvent('mouseup', e.target = this);
	},

	onMouseDown: function(e) {
		this.fireEvent('mousedown', e.target = this);
	},

	toElement: function() {
		return this.element;
	}

});

/**
 * Returns an entity defined within an element.
 *
 * This function instantiates an entity based on a data-attribute stored on an
 * element and validates the instance type. If the data-attribute is missing,
 * an instance of the `type` will be returned.
 *
 * @name Entity.fromElement
 *
 * @function
 *
 * @param {Element} element  The element.
 * @param {String}  property The data-attribute that contains the class name.
 * @param {Object}  type     The class instanceof.
 *
 * @return {Object} An entity instance.
 *
 * @example
 *
 * var element = new Element('div[data-button=Moobile.Button');
 * var entity  = Moobile.Entity.fromElement(element, 'data-button', Moobile.Button);
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Entity.fromElement = function(element, property, type) {

	var name = element.get('data-name');

	var klass = element.get(property);
	if (klass) {

		var child = Class.instantiate(klass, element, null, name);
		if (child instanceof type) {
			return child;
		}

		throw new Error('Class ' + klass + ' is not a proper instance.');
	}

	return new type(element, null, name);
};

/**
 * Defines a role.
 *
 * This function defines the behavior of a role for an entity or all entities
 * if the `target` parameter is `null`. The `behavior` function will be bound
 * to the entity and receive it's element upon execution.
 *
 * @name Entity.defineRole
 *
 * @function
 *
 * @param {String}   name     The name.
 * @param {Entity}   target   The target entity.
 * @param {Function} behavior The function that defines the role's behavior.
 *
 * @example
 *
 * // defines the role label for all entities
 * Moobile.Entity.defineRole('label', null, function(element, name) {
 * 	this.addChild(new Moobile.Label(element, null, name));
 * });
 *
 * @example
 *
 * // defines the role image for buttons
 * Moobile.Entity.defineRole('image', Moobile.Button, function(element, name)) {
 * 	this.addChild(new Moobile.Image(element, null, name));
 * });
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
*/
Moobile.Entity.defineRole = function(name, target, behavior) {
	(target || Moobile.Entity).prototype.$roles[name] = behavior;
};

/**
 * Define a style.
 *
 * This function defines a style for an entity or all entities if the `target`
 * parameter is `null`. The `behavior` object needs an `attach` and `detach`
 * method that will be used to install or remove the style. Both method will be
 * bound to the entity upon execution.
 *
 * @name Entity.defineStyle
 *
 * @function
 *
 * @param {String} name     The style name.
 * @param {Entity} target   The entity that will use this style.
 * @param {Object} behavior The style definition which consists of an object
 *                          with an `attach` and `detach` method.
 *
 * @example
 *
 * // defines the style `big-and-bold` for the Moobile.Button entity
 * Moobile.defineStyle('big-and-bold', Moobile.Button, {
 * 	attach: function() {
 *   this.element.addClass('some-big-and-bold-style');
 * 	},
 * 	detach: function() {
 * 	 this.element.removeClass('some-big-and-bold-style');
 * 	}
 * });
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Entity.defineStyle = function(name, target, behavior) {
	(target || Moobile.Entity).prototype.$styles[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, behavior);
};
