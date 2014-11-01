function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	this.showAds = true;
	
	AdMob.ad.initialize({
		// BETA
		pub_id: 'a14c2c3908724c4', // your publisher id
		// NORMAL
		//pub_id: 'a14c2d02548cbfd', // your publisher id
		bg_color: '#ccc', // optional background color, defaults to #fff
		text_color: '#333', // optional background color, defaults to #000
		test_mode: false // optional, set to true for testing ads, remove or set to false for production
	});
	
	AdMob.ad.request({
		onSuccess: (function (ad) { // successful ad call, parameter 'ad' is the html markup for the ad
			if (this.showAds) {
				this.controller.get('admob_ad').insert(ad); // place mark up in the the previously declared div
				$('admob_ad').style.display = "block";
				$('admob_ad_spacer').style.display = "block";
				$('star').style.top = "58px";
				$('star2').style.top = "58px";
			}
		}).bind(this),
		onFailure: (function () { // no ad was returned or call was unsuccessful
			//Mojo.Controller.errorDialog($L("Problem getting Ad"));
			$('admob_ad').style.display = "none";
			$('admob_ad_spacer').style.display = "none";
			$('star').style.top = "10px";
			$('star2').style.top = "10px";
		}).bind(this),
	});
	
	this.newadauto.bind(this).delay(60);
	
	var cookie = new Mojo.Model.Cookie("SBPrefs");
	var prefs = cookie.get();
	if(prefs != null)
	{
		UPDATEINTERVAL = prefs.updateinterval;
		COLORSHOUTS = prefs.colorshouts;
		SHOWFLAG = prefs.showflag;
		SHOWLISTENERS = prefs.showlisteners;
		BLOCKEDUSERS = prefs.blockedusers;
		FRIENDUSERS = prefs.friendusers;
		SHOUTPREFIX = prefs.shoutprefix;
		SHOWLASTSHOUTS = prefs.showlastshouts;
		FRIENDCOLOR = prefs.friendcolor;
		FGCOLOR = prefs.fgcolor;
		BGCOLOR = prefs.bgcolor;
		FG2COLOR = prefs.fg2color;
		BG2COLOR = prefs.bg2color;
		SHOWSHOUTHINT = prefs.showshouthint;
		DISABLELANDSCAPE = prefs.disablelandscape;
		ENTERTOSEND = prefs.entertosend;
		
		if(BLOCKEDUSERS == null)
			BLOCKEDUSERS = "";
		if(FRIENDUSERS == null)
			FRIENDUSERS = "";
		if(SHOUTPREFIX == null)
			SHOUTPREFIX = "";
		if(SHOWLASTSHOUTS == null)
			SHOWLASTSHOUTS = false;
		if(FRIENDCOLOR == null)
			FRIENDCOLOR = "standard";
		if(FGCOLOR == null)
			FGCOLOR = "standard";
		if(BGCOLOR == null)
			BGCOLOR = "standard";
		if(FG2COLOR == null)
			FG2COLOR = "standard";
		if(BG2COLOR == null)
			BG2COLOR = "standard";
		if(SHOWSHOUTHINT == null)
			SHOWSHOUTHINT = true;
		if(DISABLELANDSCAPE == null)
			DISABLELANDSCAPE = false;
		if(ENTERTOSEND == null)
			ENTERTOSEND = true;
	} else {
		UPDATEINTERVAL = 10;
		COLORSHOUTS = true;
		SHOWFLAG = true;
		SHOWLISTENERS = true;
		BLOCKEDUSERS = "";
		FRIENDUSERS = "";
		SHOUTPREFIX = "";
		SHOWLASTSHOUTS = false;
		FRIENDCOLOR = "standard";
		FGCOLOR = "standard";
		BGCOLOR = "standard";
		FG2COLOR = "standard";
		BG2COLOR = "standard";
		SHOWSHOUTHINT = true;
		DISABLELANDSCAPE = false;
		ENTERTOSEND = true;
		
		var cookie = new Mojo.Model.Cookie("SBPrefs");
		cookie.put({
			updateinterval: UPDATEINTERVAL,
			colorshouts: COLORSHOUTS,
			showflag: SHOWFLAG,
			showlisteners: SHOWLISTENERS,
			blockedusers: BLOCKEDUSERS,
			friendusers: FRIENDUSERS,
			shoutprefix: SHOUTPREFIX,
			showlastshouts: SHOWLASTSHOUTS,
			friendcolor: FRIENDCOLOR,
			fgcolor: FGCOLOR,
			bgcolor: BGCOLOR,
			fg2color: FG2COLOR,
			bg2color: BG2COLOR,
			showshouthint: SHOWSHOUTHINT,
			disablelandscape: DISABLELANDSCAPE,
			entertosend: ENTERTOSEND
		});
		
		Mojo.Controller.stageController.pushScene("tutorial");
	}
	
	this.locale = Mojo.Locale.getCurrentLocale();
	//Mojo.Log.error(this.locale);
	
	this.appMenuModel = {
		visible: true,
		items: [
			{ label: $L("About"), command: 'about' },
			{ label: $L("Help"), command: 'tutorial' },
			{ label: $L("Preferences"), command: 'preferences' },
			{ label: $L("History"), command: 'history' },
			{ label: $L("Shout Stats"), command: 'stats' }
		]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	var cookie = new Mojo.Model.Cookie("Shoutbox");
	var Prefs = cookie.get();
	if(Prefs != null) {
		this.nduid = Prefs.nduid;
	} else {
		var date = new Date();
		var timestamp = date.getTime();
		this.nduid = timestamp + "_" + Math.round(Math.random()*999999999);
		cookie.put({
			nduid: this.nduid
		});
	}
	
	var shoutmessageattr = {
		hintText: 'Enter your message here...',
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: false, 
		maxLength: 250
	};
	shoutmessagemodel = {
		'original' : "",
		disabled: false
	};
	this.controller.setupWidget('shoutmessage', shoutmessageattr, shoutmessagemodel);
	
	this.controller.listen($('ActionButton'),Mojo.Event.tap, this.sendButtonPressed.bind(this));
	this.controller.document.addEventListener("keyup", this.keyDownHandler.bind(this), true);
	this.controller.listen($('block'),Mojo.Event.tap, this.blockButtonPressed.bind(this));
	this.controller.listen($('friend'),Mojo.Event.tap, this.friendButtonPressed.bind(this));
	
	if (!DISABLELANDSCAPE) {
		this.controller.stageController.setWindowOrientation("free");
		this.controller.listen(document, 'orientationchange', this.handleOrientation.bindAsEventListener(this));
	}
	
	this.getShouts();
	
	this.countdownTime = 0;
	this.tmpLastShoutForUp = "";
	
	var url = "http://omoco.de/sboxs/info.txt";
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.infoRequestSuccess.bind(this),
		onFailure: this.infoRequestFailure.bind(this)
	});
	
	// CHANGE FOR RELEASE
	//var url = "http://sboxs.omoco.de/sboxs/checkforstar.php?id=" + this.nduid + "&id2=" + MYNDUID;
	//var url = "http://sboxs.omoco.de/sboxspaid_23/checkforstar.php?id=" + this.nduid + "&id2=" + MYNDUID;
	var url = "http://sboxs.omoco.de/shoutboxbeta/checkforstar2.php?id=" + this.nduid + "&id2=" + MYNDUID;
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.checkForStarSuccess.bind(this),
		onFailure: this.checkForStarFailure.bind(this)
	});
}

MainAssistant.prototype.keyDownHandler = function(event)
{
	if (event.keyCode == 13 && ENTERTOSEND) {
		this.sendButtonPressed();
	}
}

MainAssistant.prototype.checkForStarSuccess = function(resp){
	if(resp.responseText == "yes") {
		this.showAds = false;
		$('admob_ad').style.display = "none";
		$('admob_ad_spacer').style.display = "none";
		$('star').style.top = "10px";
		$('star2').style.top = "10px";
	}
}

MainAssistant.prototype.checkForStarFailure = function(resp){
}

MainAssistant.prototype.newadauto = function(event) {
	if (this.showAds) {
		AdMob.ad.request({
			onSuccess: (function(ad){ // successful ad call, parameter 'ad' is the html markup for the ad
				this.controller.get('admob_ad').childElements()[0].replace(ad); // place mark up in the the previously declared div
				$('admob_ad').style.display = "block";
				$('admob_ad_spacer').style.display = "block";
				$('star').style.top = "58px";
				$('star2').style.top = "58px";
			}).bind(this),
			onFailure: (function(){ // no ad was returned or call was unsuccessful
				//Mojo.Controller.errorDialog($L("Problem getting Ad"));
				$('admob_ad').style.display = "none";
				$('admob_ad_spacer').style.display = "none";
				$('star').style.top = "10px";
				$('star2').style.top = "10px";
			}).bind(this),
		});
		
		this.newadauto.bind(this).delay(60);
	}
}

MainAssistant.prototype.blockButtonPressed = function() {
	this.tmpBlockColor = this.tmpColor;
	
	var answer = this.controller.showAlertDialog({
		onChoose: this.blockUser.bind(this),
		title:"Block User",
		message:"<center>Really block this user?<br><br><div style='background-color:" + this.tmpBlockColor +  ";width:100px;height:30px'></div></center>",
		allowHTMLMessage: true,
		choices:[ {label:'Block', value:true, type:'negative'}, {label:'Cancel', value:false, type:'color'} ]
	});
}

MainAssistant.prototype.friendButtonPressed = function() {
	this.tmpFriendColor = this.tmpColor;
	
	var answer = this.controller.showAlertDialog({
		onChoose: this.friendUser.bind(this),
		title:"Add Friend",
		message:"<center>Do you want to add this friend?<br><br><div style='background-color:" + this.tmpFriendColor +  ";width:100px;height:30px'></div></center>",
		allowHTMLMessage: true,
		choices:[ {label:'Add Friend', value:true, type:'negative'}, {label:'Cancel', value:false, type:'color'} ]
	});
}

MainAssistant.prototype.blockUser = function(value) {
	if (value) {
		if (this.tmpBlockColor == "#ffffff") {
			this.controller.showAlertDialog({
				onChoose: function(value) {},
				title:"Developer",
				message:"You can't block the Developer!",
				allowHTMLMessage: true,
				choices:[ {label:'OK', value:'OK', type:'color'} ]
			});
		} else if (this.tmpBlockColor == "#fffffe") {
			this.controller.showAlertDialog({
				onChoose: function(value) {},
				title:"Advertisement",
				message:"You can't block Ads!",
				allowHTMLMessage: true,
				choices:[ {label:'OK', value:'OK', type:'color'} ]
			});
		} else if (this.tmpBlockColor == "#000000") {
			this.controller.showAlertDialog({
				onChoose: function(value) {},
				title:"Pirates",
				message:"You can't block a Pirate!",
				allowHTMLMessage: true,
				choices:[ {label:'OK', value:'OK', type:'color'} ]
			});
		} else {
			BLOCKEDUSERS = BLOCKEDUSERS + this.tmpBlockColor + ";";
			
			var cookie = new Mojo.Model.Cookie("SBPrefs");
			cookie.put({
				updateinterval: UPDATEINTERVAL,
				colorshouts: COLORSHOUTS,
				showflag: SHOWFLAG,
				showlisteners: SHOWLISTENERS,
				blockedusers: BLOCKEDUSERS,
				friendusers: FRIENDUSERS,
				shoutprefix: SHOUTPREFIX,
				showlastshouts: SHOWLASTSHOUTS,
				friendcolor: FRIENDCOLOR,
				fgcolor: FGCOLOR,
				bgcolor: BGCOLOR,
				fg2color: FG2COLOR,
				bg2color: BG2COLOR,
				showshouthint: SHOWSHOUTHINT,
				disablelandscape: DISABLELANDSCAPE,
				entertosend: ENTERTOSEND
			});
		} 
	}
}

MainAssistant.prototype.friendUser = function(value) {
	if (value) {
		FRIENDUSERS = FRIENDUSERS + this.tmpFriendColor + ";";
		
		var cookie = new Mojo.Model.Cookie("SBPrefs");
		cookie.put({
			updateinterval: UPDATEINTERVAL,
			colorshouts: COLORSHOUTS,
			showflag: SHOWFLAG,
			showlisteners: SHOWLISTENERS,
			blockedusers: BLOCKEDUSERS,
			friendusers: FRIENDUSERS,
			shoutprefix: SHOUTPREFIX,
			showlastshouts: SHOWLASTSHOUTS,
			friendcolor: FRIENDCOLOR,
			fgcolor: FGCOLOR,
			bgcolor: BGCOLOR,
			fg2color: FG2COLOR,
			bg2color: BG2COLOR,
			showshouthint: SHOWSHOUTHINT,
			disablelandscape: DISABLELANDSCAPE,
			entertosend: ENTERTOSEND
		});
	} 
}

MainAssistant.prototype.getShouts = function() {
	this.getShouts.bind(this).delay(UPDATEINTERVAL);
	
	// CHANGE FOR RELEASE
	//var url = "http://sboxs.omoco.de/sboxs/get.php?id=" + this.nduid + "&id2=" + MYNDUID + "&locale=" + this.locale;
	//var url = "http://sboxs.omoco.de/sboxspaid_23/get.php?id=" + this.nduid + "&id2=" + MYNDUID + "&locale=" + this.locale;
	var url = "http://sboxs.omoco.de/shoutboxbeta/get4.php?id=" + this.nduid + "&id2=" + MYNDUID + "&locale=" + this.locale;
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'force',
		onSuccess: this.getShoutsSuccess.bind(this),
		onFailure: this.getShoutsFailure.bind(this)
	});
}

MainAssistant.prototype.getShoutsSuccess = function(response) {
	if (FGCOLOR != "standard") {
		$('shoutsb').style.color = FGCOLOR;
		$('shouts').style.color = FGCOLOR;
		$('listeners').style.color = FGCOLOR;
		
		$('shoutsL').style.color = FG2COLOR;
		$('listenersL').style.color = FG2COLOR;
		
		$('lastshouts1a').style.color = FGCOLOR;
		$('lastshouts2a').style.color = FGCOLOR;
		$('lastshouts3a').style.color = FGCOLOR;
		$('lastshouts4a').style.color = FGCOLOR;
	} else {
		$('shoutsb').style.color = "black";
		$('shouts').style.color = "black";
		$('listeners').style.color = "black";
		
		$('shoutsL').style.color = "white";
		$('listenersL').style.color = "white";
		
		$('lastshouts1a').style.color = "black";
		$('lastshouts2a').style.color = "black";
		$('lastshouts3a').style.color = "black";
		$('lastshouts4a').style.color = "black";
	}
	if (BGCOLOR != "standard") {
		$('shoutsb').style.backgroundColor = BGCOLOR;
		$('lastshouts1').style.backgroundColor = BGCOLOR;
		$('lastshouts2').style.backgroundColor = BGCOLOR;
		$('lastshouts3').style.backgroundColor = BGCOLOR;
		$('lastshouts4').style.backgroundColor = BGCOLOR;
		$('mojo-scene-main-scene-scroller').style.backgroundColor = BGCOLOR;
		$('bottombg').style.backgroundColor = BGCOLOR;
		$('bottombg').style.backgroundImage = "none";
		
		$('shoutsbL').style.backgroundColor = BG2COLOR;
		$('shoutsbL2').style.backgroundColor = BG2COLOR;
		$('shoutsL').style.backgroundColor = BG2COLOR;
		$('listenersL').style.backgroundColor = BG2COLOR;
	}
	
	if((response.responseJSON[0].text + response.responseJSON[0].color) != this.tmpLastShoutForUp) {
		this.controller.sceneScroller.mojo.revealTop();
	}
	this.tmpLastShoutForUp = response.responseJSON[0].text + response.responseJSON[0].color;

	if(BLOCKEDUSERS.indexOf(response.responseJSON[0].color) == -1) {
		this.tmpColor = response.responseJSON[0].color;
		
		$('shouts').innerText = response.responseJSON[0].text;
		$('shoutsL').innerText = response.responseJSON[0].text;

		if(FRIENDUSERS.indexOf(response.responseJSON[0].color) > -1) {
			if(FRIENDCOLOR != "standard") {
				$('shouts').style.color = FRIENDCOLOR;
				$('shoutsL').style.color = FRIENDCOLOR;
			} else {
				$('shouts').style.color = "#ff0000";
				$('shoutsL').style.color = "#ff0000";				
			}
		}

		if(response.responseJSON[0].html == true) {
			$('shouts').innerHTML = response.responseJSON[0].text;
			$('shoutsL').innerHTML = response.responseJSON[0].text;
		}

		if(response.responseJSON[0].donated == true) {
			$('star').style.display = "block";
			$('star2').style.display = "block";
		} else {
			$('star').style.display = "none";
			$('star2').style.display = "none";
		}

		if (SHOWFLAG) {
			$('locale').style.backgroundImage = "url(images/locales/" + response.responseJSON[0].locale + ".png)";
			$('localeL').style.backgroundImage = "url(images/locales_l/" + response.responseJSON[0].locale + ".png)";
		} else {
			$('locale').style.backgroundImage = "url()";
			$('localeL').style.backgroundImage = "url()";		
		}
	
		if (COLORSHOUTS) {
			$('shoutsbL').style.backgroundColor = response.responseJSON[0].color;
			$('shoutsb2').style.backgroundColor = response.responseJSON[0].color;
		}
		else {
			$('shoutsbL').style.backgroundColor = "#000000";
			$('shoutsb2').style.backgroundColor = "#e4e4e2";
		}
	}
	
	if (SHOWLISTENERS) {
		$('listeners').innerText = response.responseJSON[0].listeners + " people listening.";
		$('listenersL').innerText = response.responseJSON[0].listeners + " people listening.";
	} else {
		$('listeners').innerText = "";
		$('listenersL').innerText = "";
	}
	
	if (SHOWLASTSHOUTS) {
		$('lastshouts').style.display = "block";

		$('lastshouts1a').style.backgroundColor = response.responseJSON[1].color;		
		if (BLOCKEDUSERS.indexOf(response.responseJSON[1].color) == -1) {
			if(FRIENDUSERS.indexOf(response.responseJSON[1].color) > -1) {
				if(FRIENDCOLOR != "standard")
					$('lastshouts1a').style.color = FRIENDCOLOR;
				else
					$('lastshouts1a').style.color = "#ff0000";
			}
			
			$('lastshouts1').innerText = response.responseJSON[1].text;
			if (response.responseJSON[1].html == true) 
				$('lastshouts1').innerHTML = response.responseJSON[1].text;
		} else {
			$('lastshouts1').innerHTML = "<img src='images/block_s.png'><i><font color='adadac'> blocked</font></i>";
		}
		
		$('lastshouts2a').style.backgroundColor = response.responseJSON[2].color;
		if (BLOCKEDUSERS.indexOf(response.responseJSON[2].color) == -1) {
			if(FRIENDUSERS.indexOf(response.responseJSON[2].color) > -1) {
				if(FRIENDCOLOR != "standard")
					$('lastshouts2a').style.color = FRIENDCOLOR;
				else
					$('lastshouts2a').style.color = "#ff0000";
			}
			
			$('lastshouts2').innerText = response.responseJSON[2].text;
			if (response.responseJSON[2].html == true) 
				$('lastshouts2').innerHTML = response.responseJSON[2].text;
		} else {
			$('lastshouts2').innerHTML = "<img src='images/block_s.png'><i><font color='adadac'> blocked</font></i>";
		}
		
		$('lastshouts3a').style.backgroundColor = response.responseJSON[3].color;
		if (BLOCKEDUSERS.indexOf(response.responseJSON[3].color) == -1) {
			if(FRIENDUSERS.indexOf(response.responseJSON[3].color) > -1) {
				if(FRIENDCOLOR != "standard")
					$('lastshouts3a').style.color = FRIENDCOLOR;
				else
					$('lastshouts3a').style.color = "#ff0000";
			}
			
			$('lastshouts3').innerText = response.responseJSON[3].text;
			if (response.responseJSON[3].html == true) 
				$('lastshouts3').innerHTML = response.responseJSON[3].text;
		} else {
			$('lastshouts3').innerHTML = "<img src='images/block_s.png'><i><font color='adadac'> blocked</font></i>";
		}
		
		$('lastshouts4a').style.backgroundColor = response.responseJSON[4].color;
		if (BLOCKEDUSERS.indexOf(response.responseJSON[4].color) == -1) {
			if(FRIENDUSERS.indexOf(response.responseJSON[4].color) > -1) {
				if(FRIENDCOLOR != "standard")
					$('lastshouts4a').style.color = FRIENDCOLOR;
				else
					$('lastshouts4a').style.color = "#ff0000";
			}
			
			$('lastshouts4').innerText = response.responseJSON[4].text;
			if (response.responseJSON[4].html == true) 
				$('lastshouts4').innerHTML = response.responseJSON[4].text;
		} else {
			$('lastshouts4').innerHTML = "<img src='images/block_s.png'><i><font color='adadac'> blocked</font></i>";
		}
	} else {
		$('lastshouts').style.display = "none";
	}
}

MainAssistant.prototype.getShoutsFailure = function(response) {
	Mojo.Controller.errorDialog("Error getting Shouts.");
}

MainAssistant.prototype.sendButtonPressed = function(event) {
	//var shoutText = shoutmessagemodel['original'];
	var shoutText = this.controller.get("shoutmessage").mojo.getValue();
	
	if(shoutText != "") {
		$('blocksend').style.display = "block";
		$('blocksend').innerHTML = "";
		
		// CHANGE FOR RELEASE
		//var url = "http://sboxs.omoco.de/sboxs/put2.php?id=" + this.nduid + "&id2=" + MYNDUID + "&text=" + escape(SHOUTPREFIX + shoutText) + "&locale=" + this.locale;
		//var url = "http://sboxs.omoco.de/sboxspaid_23/put2.php?id=" + this.nduid + "&id2=" + MYNDUID + "&text=" + escape(SHOUTPREFIX + shoutText) + "&locale=" + this.locale;
		var url = "http://sboxs.omoco.de/shoutboxbeta/put3.php?id=" + this.nduid + "&id2=" + MYNDUID + "&text=" + escape(SHOUTPREFIX + shoutText) + "&locale=" + this.locale;
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'force',
			onSuccess: this.putShoutsSuccess.bind(this),
			onFailure: this.putShoutsFailure.bind(this)
		});
	} else {
		Mojo.Controller.errorDialog("You have to enter some text to shout.");
	}
}

MainAssistant.prototype.putShoutsSuccess = function(response) {
	if (response.responseText.split(";")[0] == "success") {
		shoutmessagemodel['original'] = "";
		this.controller.modelChanged(shoutmessagemodel);
		$('blocksend').style.display = "block";
		this.countdownTime = parseInt(response.responseText.split(";")[1]);
		this.countdownStep();
		this.enableShoutSend.bind(this).delay(parseInt(response.responseText.split(";")[1]));
		
		if(SHOWSHOUTHINT)
			this.controller.showAlertDialog({
				onChoose: function(value) {},
				title:"Message shouted",
				message:"Your message has been shouted. Please note that other people are also shouting and only the last message shouted worldwide is beeing displayed. So you might not see your message.",
				allowHTMLMessage: true,
				choices:[ {label:'OK', value:'OK', type:'color'} ]
			});
	}
	else if (response.responseText.split(";")[0] == "wait") {
		Mojo.Controller.errorDialog("You have to wait " + parseInt(response.responseText.split(";")[1]) + " more seconds to shout again.");
		$('blocksend').style.display = "block";
		this.countdownTime = parseInt(parseInt(response.responseText.split(";")[1]));
		this.countdownStep();
		this.enableShoutSend.bind(this).delay(parseInt(response.responseText.split(";")[1]));
	}
	else if (response.responseText.split(";")[0] == "banned") {
		Mojo.Controller.errorDialog("You have been banned from Global Shoutbox for this reason: " + response.responseText.split(";")[1]);
	} else {
		$('blocksend').style.display = "none";
		Mojo.Controller.errorDialog("Error sending Shout.");
	}
}

MainAssistant.prototype.countdownStep = function() {
	$('blocksend').innerHTML = "<center><small><br>Wait " + this.countdownTime + " seconds to shout again...</small></center>";
	this.countdownTime--;
	if(this.countdownTime > 0)
		this.countdownStep.bind(this).delay(1);
}

MainAssistant.prototype.putShoutsFailure = function(response) {
	$('blocksend').style.display = "none";
	Mojo.Controller.errorDialog("Error sending Shout.");
}

MainAssistant.prototype.enableShoutSend = function(response) {
	$('blocksend').style.display = "none";
}

MainAssistant.prototype.handleOrientation = function(event) {
	if (!DISABLELANDSCAPE) {
		if (event.position == 4 || event.position == 5) {
			$('shoutsbL').style.display = "block";
			$('listenersL').style.display = "block";
			$('localeL').style.display = "block";
		}
		else if (event.position == 2 || event.position == 3) {
			$('shoutsbL').style.display = "none";
			$('listenersL').style.display = "none";
			$('localeL').style.display = "none";
		}
	}
}

MainAssistant.prototype.activate = function(event) {
	Mojo.Controller.stageController.setWindowProperties({ blockScreenTimeout: true });
}

MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {

}

MainAssistant.prototype.infoRequestSuccess = function(resp){
	if(resp.responseText != "")
		this.controller.showAlertDialog({
			onChoose: function(value) {},
			title: $L("Message"),
			message: resp.responseText,
			allowHTMLMessage: true,
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
}

MainAssistant.prototype.infoRequestFailure = function(resp){
}

MainAssistant.prototype.shoutStatsSuccess = function(response){
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title: $L("Shout Stats"),
		message: "Some statistics about your shouts:<br><br>" +
			"<table border=0><tr><td width=120>Today:</td><td align=right>" + response.responseJSON.day + 
			"</td></tr><tr><td>Last Week:</td><td align=right>" + response.responseJSON.week +  
			"</td></tr><tr><td>Last Month:</td><td align=right>" + response.responseJSON.month + 
			"</td></tr><tr><td>All Time:</td><td align=right>" + response.responseJSON.alltime + "</td></tr></table>",
			
		allowHTMLMessage: true,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}

MainAssistant.prototype.shoutStatsFailure = function(response){
}

MainAssistant.prototype.handleCommand = function(event){
    if(event.type == Mojo.Event.command) {	
		switch (event.command) {
			case 'about':
				Mojo.Controller.stageController.pushScene("about");
				break;
			case 'tutorial':
				Mojo.Controller.stageController.pushScene("tutorial");
				break;
			case 'preferences':
				Mojo.Controller.stageController.pushScene("preferences");
				break;
			case 'history':
				Mojo.Controller.stageController.pushScene("history");
				break;
			case 'stats':
				// CHANGE FOR RELEASE
				//var url = "http://sboxs.omoco.de/sboxs/getstats.php?id=" + this.nduid + "&id2=" + MYNDUID;
				//var url = "http://sboxs.omoco.de/sboxspaid_23/getstats.php?id=" + this.nduid + "&id2=" + MYNDUID;
				var url = "http://sboxs.omoco.de/shoutboxbeta/getstats2.php?id=" + this.nduid + "&id2=" + MYNDUID;
				var request = new Ajax.Request(url, {
					method: 'get',
					evalJSON: 'force',
					onSuccess: this.shoutStatsSuccess.bind(this),
					onFailure: this.shoutStatsFailure.bind(this)
				});
				break;
		}
	}
}