"use strict"

Request.prototype.options.isSuccess = function() {
	var status = this.status;
	return (status === 0 || (status >= 200 && status < 300));
}