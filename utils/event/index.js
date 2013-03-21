"use strict"
Events.prototype.on = Events.prototype.addEvent;
Events.prototype.off = Events.prototype.removeEvent;
Events.prototype.emit = Events.prototype.fireEvent;