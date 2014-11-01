function StageAssistant() {
}

var MYNDUID = "blablubb";

StageAssistant.prototype.setup = function() {
	var deviceIdAttributes =
	{
		method: 'getSysProperty',
		parameters: {'key': 'com.palm.properties.nduid'},
		onSuccess: this.deviceIDServiceRequestHandler.bind(this)
	}
	
	new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', deviceIdAttributes);
}


StageAssistant.prototype.deviceIDServiceRequestHandler = function(resp) {
	MYNDUID = resp['com.palm.properties.nduid'];
	this.controller.pushScene("main");
}
