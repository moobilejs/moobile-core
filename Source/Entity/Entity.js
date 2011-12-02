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
	- EntityRoles
	- EntityStyles

provides:
	- Entity

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * Provides the base class for objects that encapsulates a DOM element. Also
 * support methods to manage a hierarchy of entities.
 *
 * @name Entity
 * @class Entity
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Entity = new Class(/** @lends Entity.prototype */{

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	$roles: {},

	$styles: {},

	/**
	 * The entity's current style.
	 *
	 * @type {Object}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	style: null,

	/**
	 * The entity's owner.
	 *
	 * @type {Entity}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	owner: null,

	/**
	 * The entity's name.
	 *
	 * @type {String}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	name: null,

	/**
	 * The entity's DOM element.
	 *
	 * @type {Element}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	element: null,

	/**
	 * The entity's children.
	 *
	 * @type {Array}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	children: [],

	/**
	 * The entity's window.
	 *
	 * @type {Window}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	window: null,

	/**
	 * Indicates whether the entity is in the DOM.
	 *
	 * @type {Boolean}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	ready: false,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: null,
		styleName: null,
		tagName: 'div'
	},

	/**
	 * Initializes this entity using an element given as an <code>Element</code>
	 * instance, an element id or a string representing an element.
	 *
	 * <p>If you override this method, make sure you call the parent method at
	 * the beginning of your implementation.</p>
	 *
	 * @param {Element}	element This entity element, element id or string.
	 * @param {Object}  options This entity options.
	 * @param {String}  name    This entity name.
	 *
	 * @see Entity#didLoad
	 * @see Entity#willLoad
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

		this.element.getElements('[data-role]').each(function(element) {
			if (this.filterRoleElement(element)) {
				this.defineElementRole(element, element.get('data-role'));
			}
		}, this);

		this.didLoad();

		return this;
	},

	/**
	 * Destroys this entity and its hierarchy thus freeing the memory.
	 *
	 * <p>If you override this method, make sure you call the parent method at
	 * the end of your implementation.</p>
	 *
	 * @return {Entity} This entity.
	 *
	 * @see Entity#willUnload
	 * @see Entity#didUnload
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.willUnload();

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
	 * Adds a child entity at a location specified by <code>where</code> and
	 * <code>context</code>. If none are specified, the child entity will go
	 * at the bottom of this entity.
	 *
	 * <p>The <code>where</code> parameter accepts <code>top</code>,
	 * <code>bottom</code>, <code>before</code> or <code>after</code>. If a
	 * <code>context</code> is specified, the <code>where</code> value will be
	 * used relative to this context.</p>
	 *
	 * @param {Entity}  entity  The child entity.
	 * @param {String}  where   The child entity location.
	 * @param {Element} context The child entity location context element.
	 *
	 * @return {Boolean} Whether the child was successfully added.
	 *
	 * @see Entity#willAddChild
	 * @see Entity#didAddChild
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
				throw new Error('You are trying to add a child relative to an element that does not belong to this entity');
			}

			element.inject(context, where);
		}

		this.children.push(entity);

		entity.setOwner(this);
		entity.setWindow(this.window);

		this.didAddChild(entity);

		if (this.ready == false) {
			this.addEvent('ready:once', function() {
				entity.setReady();
			});
			return true;
		}

		entity.setReady();

		return true;
	},

	/**
	 * Returns whether this entity owns a given child entity, searching only
	 * within direct descendants of this entity.
	 *
	 * @param {Entity} entity The entity to search for.
	 *
	 * @return {Boolean} Whether the entity owns the given entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChild: function(entity) {
		return this.children.contains(entity);
	},

	/**
	 * Returns a child entity using the child entity's name, searching only
	 * within direct descendants of this entity.
	 *
	 * @param {String} name The entity name to search for.
	 *
	 * @return {Entity} The child entity or <code>null</code> if there are no
	 *                  entities with the given name.
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
	 * Returns an array which contains entities that are direct descendants
	 * of this entity.
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
	 * Removes a child entity without destroying it, removing only entities that
	 * are direct descendants of this entity.
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
		entity.setReady(false);
		entity.setWindow(null);

		element.dispose();

		this.children.erase(entity);

		this.didRemoveChild(entity);

		return true;
	},

	/**
	 * Removes a child entity from its owner without destroying it. This method
	 * returns <code>false</code> if this entity does not have an owner.
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
	 * Replaces a child entity with another entity. If the child entity cannot
	 * be added, there will be no attempt to remove the entity to replace. This
	 * method will only attempt to replace an entity that is a direct descendant
	 * of this entity.
	 *
	 * @param {Entity} replace The entity to remove.
	 * @param {Entity} entity  The entity to add.
	 *
	 * @return {Boolean} Whether the entity to replace was successfully removed
	 *                   and the entity to add was successfully added.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChild: function(replace, entity) {

		var success = this.addChild(entity, 'before', replace);
		if (success) {
			return this.removeChild(replace);
		}

		return false;
	},

	/**
	 * Assigns a style that was previously defined to this entity.
	 *
	 * <p>Do not confuse this method as it does not assign a CSS style. In
	 * order to apply a style to this entity, its behavior must have been
	 * previously define with <code>Entity.defineStyle</code>.</p>
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
	 * Returns the style name that has been applied to this entity.
	 *
	 * <p>Do not confuse this method as it does not return the value of a CSS
	 * style. In order to retrieve the style name of this entity, it must have
	 * been defined with <code>Entity.defineStyle</code> and then applied.</p>
	 *
	 * @see Entity#defineStyle
	 *
	 * @return {String} The style name or <code>null</code> if a style has yet
	 *                  to be applied to this element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getStyle: function() {
		return this.style.name;
	},

	/**
	 * Adds a CSS class to the entity's element.
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
	 * Removes a CSS class from the entity's element.
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
	 * Adds or removes a CSS class name to the entity's element.
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
	 * @param {Entity} owner The entity that owns this entity.
	 *
	 * @return {Entity} This entity.
	 *
	 * @see Entity#ownerWillChange
	 * @see Entity#ownerDidChange
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
	 * Returns the entity that owns this entity.
	 *
	 * @return {Entity} The entity that owns this entity.
	 *
	 * @see Entity#ownerWillChange
	 * @see Entity#ownerDidChange
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
	 * @return {Boolean} Whether this entity has an owner.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasOwner: function() {
		return !!this.owner;
	},

	/**
	 * Sets the window that owns this entity.
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
	 * Returns the window that owns this entity.
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
	 * @return {Boolean} Whether this entity as a window.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasWindow: function() {
		return !!this.window;
	},

	/**
	 * Returns the name.
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
	 * Returns this entity's element or the first element within this entity's
	 * element that matches the selector.
	 *
	 * <p>This method will run the selector, if any, against all the child
	 * elements of this entity's element.</p>
	 *
	 * @param {String} selector An optional CSS selector.
	 *
	 * @return {Element} This entity's element or an element that matches the
	 *                   given selector.
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
	 * Returns a collection of elements within this entity's element that
	 * matches the given selector.
	 *
	 * <p>This method will run the selector against all the child elements of
	 * this entity's element.</p>
	 *
	 * @param {String} selector The CSS selector.
	 *
	 * @return {Elements} A collection of elements that matches the given
	 *                    selector or an empty collection if no element were
	 *                    matched by the selector.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getElements: function(selector) {
		return this.element.getElements(selector);
	},

	/**
	 * Indicates whether an element exists within this entity's element.
	 *
	 * <p>This method will search the given element againts all the child
	 * elements of this entity's element.</p>
	 *
	 * @param {Element} element The element to search for.
	 *
	 * @return {Boolean} Whether the element exists within this entity's
	 *                   element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasElement: function(element) {
		return this.element === document.id(element) || this.element.contains(document.id(element));
	},

	/**
	 * Return an element performing a given role.
	 *
	 * @param {String} role The role.
	 *
	 * @return {Element}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getRoleElement: function(role) {
		return this.getRoleElements(role)[0] || null;
	},

	/**
	 * Return a collection of elements performing a given role.
	 *
	 * @param {String} role The role.
	 *
	 * @return {Elements}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getRoleElements: function(role) {
		return this.element.getElements('[data-role=' + role + ']').filter(this.bound('filterRoleElement'));
	},

	filterRoleElement: function(element) {

		var parent = element.getParent();
		if (parent) {
			return this.element === parent || this.filterRoleElement(parent);
		}

		return false;
	},

	/**
	 * Define the role of an element.
	 *
	 * @param {Element} element The element.
	 * @param {String} name The role.
	 *
	 * @return {Entity}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	defineElementRole: function(element, role) {

		if (element.retrieve('entity.has-role'))
			return this;

		var definition = this.$roles[role];
		if (definition == undefined) {
			throw new Error('Role ' + role + ' does not exists.');
		}

		definition.call(this, element, element.get('data-name'));

		element.store('entity.has-role', true);

		return this;
	},

	/**
	 * Return the size of the entity's element.
	 *
	 * @return {Object} An object that contains the size.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		return this.element.getSize();
	},

	/**
	 * Set the entity as being part of the DOM and at this point it is, for
	 * instance measurable.
	 *
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setReady: function() {

		if (this.ready)
			return this;

		if (this.owner) {
			this.window = this.owner.getWindow();
		}

		this.ready = true;
		this.didBecomeReady();
		this.fireEvent('ready');

		return this;
	},

	/**
	 * Indicates whether the entity is in the DOM.
	 *
	 * @return {Boolean} Whether the entity is in a DOM.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isReady: function() {
		return this.ready;
	},

	/**
	 * Show the entity.
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
	 * Hide the entity.
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
	 * Tells the entity it's about to be loaded. This method is called once
	 * the entity's element has been set and before other pieces of the
	 * initialization such as processing elements with role and applying
	 * style have taken place.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willLoad: function() {

	},

	/**
	 * Tells the entity it's has been loaded. This method is called once the
	 * entire initialization process is completed, after elements with roles
	 * were processed and style was loaded.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLoad: function() {

	},

	/**
	 * Tells the entity it's about to be unloaded. This method is called before
	 * the entity's element and the child entities are destroyed.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willUnload: function() {

	},

	/**
	 * Tells the entity it has been unloaded. This method is called once the
	 * entity's element and the child entites are destroyed.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didUnload: function() {

	},

	/**
	 * Tells the entity it has become part of the DOM document. This method is
	 * usefull to perform actions such as measuring.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {

	},

	/**
	 * Tells the entity a child entity is about to be added.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
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
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
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
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
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
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
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
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
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
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
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
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {

	},

	/**
	 * Tell the entity it became visible.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {

	},

	/**
	 * Tell the entity it's about to become hidden.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {

	},

	/**
	 * Tell the entity it became hidden.
	 *
	 * <p>The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.</p>
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {

	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent('mouseup', e);
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent('mousedown', e);
	},

	toElement: function() {
		return this.element;
	}

});

/**
 * Instantiate an entity based on a property stored on an element and validates
 * the instance. If the propery does not contain the class name, an instance of
 * the the type will be returned.
 * @name Entity.fromElement
 * @param {Element} element The element.
 * @param {String} property The property that contains the class name.
 * @param {Object} type The class name must be an instance of this value.
 * @return {Object}
 * @function
 * @since 0.1
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
 * Define a role.
 * @name Entity.defineRole
 * @param {String} name The role name.
 * @param {Entity} target The role target.
 * @param {Function} behavior The role behavior.
 * @function
 * @since 0.1
 */
Moobile.Entity.defineRole = function(name, target, behavior) {
	(target || Moobile.Entity).prototype.$roles[name] = behavior;
};

/**
 * Define a style.
 * @name Entity.defineStyle
 * @param {String} name The style name.
 * @param {Entity} target The style target.
 * @param {Object} behavior The style behavior.
 * @function
 * @since 0.1
 */
Moobile.Entity.defineStyle = function(name, target, behavior) {
	(target || Moobile.Entity).prototype.$styles[name] = Object.append({
		name: name,
		attach: function() {},
		detach: function() {}
	}, behavior);
};
