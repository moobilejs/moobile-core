Moobile is a new mobile application framework built on MooTools.
------------------------------------------------

Visit [http://moobilejs.com](http://moobilejs.com) for more informations.

## Changelog

### 0.1.1

- Fixed a flicker that occured when showing an alert.
- Added a `getDescendantComponent` method to the `Moobile.Component` class.
- Fixed an issue that made some events fire more than once.
- Added micro-optimizations.
- Moved the presentation logic into a separate CSS file.
- Added CSS vendor prefixes.
- Fixed a few scroller issues that prevented scrolling on android devices.
- Fixed slider
- Added retina display images

### 0.2

This release focuses on making a solid foundation for future releases. Here are some of the changes:

#### Theme / Stylesheet

 - Presentation logic has been moved to it's own `moobile.css` stylesheet. Theme specific CSS has now it's own file.
 - Added a basic Android 4 theme.

#### Components

 - Parsing data-role is now a bit faster.
 - Child components now receive a proper index based on their location relative to other components.
 - Child components are also shown / hidden when the parent component is show / hidden.

#### Lists

 - Added a `header` style for list items that performs correctly or a normal or grouped list.

#### Views

 - The view content is now wrapped. This properly resets the coordinate system so setting an element inside a view with `height:100%` will only fill the view content.

#### ScrollViews

 - Snap to page is fixed.

#### ViewControllers

 - `presentModalViewController` is now truly modal.

#### ViewTransitions

 - Added a Cover.Box and Cover.Page transitions.
