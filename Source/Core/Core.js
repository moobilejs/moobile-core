/*
---

name: Core

description: Provide the mobile namespace and requires all components from
             Core, More, Extras and Moobile that are required globally.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Array
	- Core/String
	- Core/Number
	- Core/Function
	- Core/Object
	- Core/Event
	- Core/Browser
	- Core/Class
	- Core/Class.Extras
	- Core/Element
	- Core/Element.Style
	- Core/Element.Event
	- Core/Element.Dimensions
	- Core/Fx
	- Core/Fx.CSS
	- Core/Fx.Tween
	- Core/Fx.Morph
	- Core/Request
	- Core/Request.HTML
	- Core/Request.JSON
	- Core/Cookie
	- Core/JSON
	- Core/DOMReady
	- More/Events.Pseudos
	- More/Class.Refactor
	- More/Class.Binds
	- More/Array.Extras
	- More/Date.Extras
	- More/Object.Extras
	- More/String.Extras
	- Extras/Console.Trace
	- Extras/Class.Element
	- Extras/Class.Binds
	- Extras/Class.Extras
	- Extras/Class.Mutator.Protected
	- Extras/Class.Mutator.Static
	- Extras/Element.Extras
	- Extras/Element.Properties
	- Extras/Selector.Apply
	- Extras/Selector.Attach
	- Extras/Array.Extras
	- Extras/String.Extras
	- Extras/Fx.CSS3
	- Extras/Fx.CSS3.Tween
	- Extras/Fx.CSS3.Morph
	- Mobile/Click
	- Mobile/Pinch
	- Mobile/Swipe
	- Mobile/Touch
	- Mobile/Touchhold
	- Browser.Platform
	- Event
	- Event.ClickOver
	- Event.TouchOver

provides:
	- Core

...
*/

if (!window.Moobile) window.Moobile = {};
window.Moobile.version = '0.1.0dev';
window.Moobile.build = '%build%';

window.Moobile.UI = {};