function TutorialAssistant() {

}

TutorialAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: []
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	this.controller.listen(this.controller.get('close'),Mojo.Event.tap, this.closeButtonPressed.bind(this));
}

TutorialAssistant.prototype.closeButtonPressed = function(event) {
	Mojo.Controller.stageController.popScene();
}


TutorialAssistant.prototype.activate = function(event) {

}

TutorialAssistant.prototype.deactivate = function(event) {

}

TutorialAssistant.prototype.cleanup = function(event) {

}
