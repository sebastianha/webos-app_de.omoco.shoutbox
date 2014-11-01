function HistoryAssistant() {

}

HistoryAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: []
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	shoutList = [];

	listModel = {listTitle:$L('Shout History'), items:shoutList};

	// Set up the attributes & model for the List widget:
	this.controller.setupWidget('histlist',
		this.attributes = {
			itemTemplate:'history/listitem', 
			listTemplate:'history/listcontainer', 
			emptyTemplate:'history/emptylist'
		},
		listModel
	);
	
	// CHANGE FOR RELEASE
	//var url = "http://sboxs.omoco.de/sboxs/hist.php";
	//var url = "http://sboxs.omoco.de/sboxspaid_23/hist.php";
	var url = "http://sboxs.omoco.de/shoutboxbeta/hist2.php";
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'force',
		onSuccess: this.requestSuccess.bind(this),
		onFailure: this.requestFailure.bind(this)
	}); 
}

HistoryAssistant.prototype.requestSuccess = function(response) {
	var histItems = response.responseJSON;
	
	var histItems2 = [];
	
	for(i=0; i<histItems.length; i++)
	{
		var blocked = "block_sn";
		var friend = "heart_sn";
		var stars = "star_sn";
		var textcolor = "#000000";

		if (FRIENDUSERS.indexOf(histItems[i].color) != -1) {
			friend = "heart_s";
			textcolor = "#ff0000";
		}		
		
		if (BLOCKEDUSERS.indexOf(histItems[i].color) != -1) {
			blocked = "block_s";
			textcolor = "#adadac";
		}
		
		if (histItems[i].donated) {
			stars = "star_s";
		}
		
		histItems2.push({
			locale: histItems[i].locale,
			text: histItems[i].text,
			time: histItems[i].time,
			color: histItems[i].color,
			stars: stars,
			blocked: blocked,
			friend: friend,
			textcolor: textcolor
		})
	}
	
	listModel.items = histItems2;
	this.controller.modelChanged(listModel);
}

HistoryAssistant.prototype.requestFailure = function(response) {
	Mojo.Controller.errorDialog("Downloading history failed.");
}

HistoryAssistant.prototype.activate = function(event) {

}

HistoryAssistant.prototype.deactivate = function(event) {

}

HistoryAssistant.prototype.cleanup = function(event) {

}
