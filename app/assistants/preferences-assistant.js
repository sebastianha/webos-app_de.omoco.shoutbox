function PreferencesAssistant() {

}

PreferencesAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: []
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	this.refreshchoice = [];
	selectorsModel = { updateinterval: UPDATEINTERVAL };

	this.controller.listen('refreshselector', Mojo.Event.propertyChange, this.selectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('refreshselector', {label: $L("Refresh (sec.)"), choices: this.refreshchoice, modelProperty:'updateinterval'}, selectorsModel);
	
	selectorsModel.choices = [
		{ label: "2", value:"2" },
		{ label: "3", value:"3" },
		{ label: "5", value:"5" },
		{ label: "10", value:"10" },
		{ label: "20", value:"20" },
		{ label: "30", value:"30" },
		{ label: "60", value:"60" },
	];
	this.controller.modelChanged(selectorsModel);
	
	csattr = {trueLabel: 'yes', falseLabel: 'no'};
	csModel = {value: COLORSHOUTS, disabled: false};
	this.controller.setupWidget('colorshoutstoggle', csattr, csModel);
	Mojo.Event.listen(this.controller.get('colorshoutstoggle'),Mojo.Event.propertyChange,this.csTogglePressed.bind(this));
	
	sfattr = {trueLabel: 'yes', falseLabel: 'no'};
	sfModel = {value: SHOWFLAG, disabled: false};
	this.controller.setupWidget('showflagtoggle', sfattr, sfModel);
	Mojo.Event.listen(this.controller.get('showflagtoggle'),Mojo.Event.propertyChange,this.sfTogglePressed.bind(this));
	
	slattr = {trueLabel: 'yes', falseLabel: 'no'};
	slModel = {value: SHOWLISTENERS, disabled: false};
	this.controller.setupWidget('showlistenerstoggle', slattr, slModel);
	Mojo.Event.listen(this.controller.get('showlistenerstoggle'),Mojo.Event.propertyChange,this.slTogglePressed.bind(this));
	
	slsattr = {trueLabel: 'yes', falseLabel: 'no'};
	slsModel = {value: SHOWLASTSHOUTS, disabled: false};
	this.controller.setupWidget('showlastshoutstoggle', slsattr, slsModel);
	Mojo.Event.listen(this.controller.get('showlastshoutstoggle'),Mojo.Event.propertyChange,this.slsTogglePressed.bind(this));

	sshattr = {trueLabel: 'yes', falseLabel: 'no'};
	sshModel = {value: SHOWSHOUTHINT, disabled: false};
	this.controller.setupWidget('showshouthinttoggle', sshattr, sshModel);
	Mojo.Event.listen(this.controller.get('showshouthinttoggle'),Mojo.Event.propertyChange,this.sshTogglePressed.bind(this));

	dlattr = {trueLabel: 'yes', falseLabel: 'no'};
	dlModel = {value: DISABLELANDSCAPE, disabled: false};
	this.controller.setupWidget('disablelandscapetoggle', dlattr, dlModel);
	Mojo.Event.listen(this.controller.get('disablelandscapetoggle'),Mojo.Event.propertyChange,this.dlTogglePressed.bind(this));

	esattr = {trueLabel: 'yes', falseLabel: 'no'};
	esModel = {value: ENTERTOSEND, disabled: false};
	this.controller.setupWidget('entertosendtoggle', esattr, esModel);
	Mojo.Event.listen(this.controller.get('entertosendtoggle'),Mojo.Event.propertyChange,this.esTogglePressed.bind(this));

	var bucolors = BLOCKEDUSERS.split(";");
	var buhtml = "";
	for(i = 0; i < bucolors.length; i++) {
		buhtml = buhtml + "<div style='background-color:" + bucolors[i] + ";float:left;width:30px;height:30px'></div>";
	}
	
	$("blockedusers").innerHTML = buhtml;
	
	this.controller.listen($('clearblockedusers'),Mojo.Event.tap, this.clearBSButtonPressed.bind(this));
	
	var fucolors = FRIENDUSERS.split(";");
	var fuhtml = "";
	for(i = 0; i < fucolors.length; i++) {
		fuhtml = fuhtml + "<div style='background-color:" + fucolors[i] + ";float:left;width:30px;height:30px'></div>";
	}
	
	$("friendusers").innerHTML = fuhtml;
	
	this.controller.listen($('clearfriendusers'),Mojo.Event.tap, this.clearFSButtonPressed.bind(this));
	
	var prefixattr = {
		hintText: 'Klick to enter a prefix',
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: false, 
		maxLength: 50,
	};
	prefixmodel = {
		'original' : SHOUTPREFIX,
		disabled: false
	};
	this.controller.setupWidget('shoutprefix', prefixattr, prefixmodel);
	
	this.controller.listen($('saveshoutprefix'),Mojo.Event.tap, this.saveSPButtonPressed.bind(this));
	
	
	this.friendcolorchoice = [];
	friendcSelectorsModel = { friendcolor: FRIENDCOLOR };

	this.controller.listen('friendcolorselector', Mojo.Event.propertyChange, this.friendSelectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('friendcolorselector', {label: $L("Friend Color"), choices: this.friendcolorchoice, modelProperty:'friendcolor'}, friendcSelectorsModel);
	
	friendcSelectorsModel.choices = [
		{ label: "black", value:"black" },
		{ label: "blue", value:"blue" },
		{ label: "gray", value:"gray" },
		{ label: "green", value:"green" },
		{ label: "red", value:"red" },
		{ label: "white", value:"white" },
		{ label: "yellow", value:"yellow" }
	];
	this.controller.modelChanged(friendcSelectorsModel);
	
	this.fgcolorchoice = [];
	fgcSelectorsModel = { fgcolor: FGCOLOR };

	this.controller.listen('fgcolorselector', Mojo.Event.propertyChange, this.fgSelectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('fgcolorselector', {label: $L("Font Color"), choices: this.fgcolorchoice, modelProperty:'fgcolor'}, fgcSelectorsModel);
	
	fgcSelectorsModel.choices = [
		{ label: "black", value:"black" },
		{ label: "blue", value:"blue" },
		{ label: "gray", value:"gray" },
		{ label: "green", value:"green" },
		{ label: "red", value:"red" },
		{ label: "white", value:"white" },
		{ label: "yellow", value:"yellow" }
	];
	this.controller.modelChanged(fgcSelectorsModel);
	
	this.bgcolorchoice = [];
	bgcSelectorsModel = { bgcolor: BGCOLOR };

	this.controller.listen('bgcolorselector', Mojo.Event.propertyChange, this.bgSelectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('bgcolorselector', {label: $L("Background"), choices: this.bgcolorchoice, modelProperty:'bgcolor'}, bgcSelectorsModel);
	
	bgcSelectorsModel.choices = [
		{ label: "black", value:"black" },
		{ label: "blue", value:"blue" },
		{ label: "gray", value:"gray" },
		{ label: "green", value:"green" },
		{ label: "red", value:"red" },
		{ label: "white", value:"white" },
		{ label: "yellow", value:"yellow" }
	];
	this.controller.modelChanged(bgcSelectorsModel);
	
	this.fg2colorchoice = [];
	fg2cSelectorsModel = { fg2color: FG2COLOR };

	this.controller.listen('fg2colorselector', Mojo.Event.propertyChange, this.fg2SelectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('fg2colorselector', {label: $L("Landscape FG"), choices: this.fg2colorchoice, modelProperty:'fg2color'}, fg2cSelectorsModel);
	
	fg2cSelectorsModel.choices = [
		{ label: "black", value:"black" },
		{ label: "blue", value:"blue" },
		{ label: "gray", value:"gray" },
		{ label: "green", value:"green" },
		{ label: "red", value:"red" },
		{ label: "white", value:"white" },
		{ label: "yellow", value:"yellow" }
	];
	this.controller.modelChanged(fg2cSelectorsModel);
	
	this.bg2colorchoice = [];
	bg2cSelectorsModel = { bg2color: BG2COLOR };

	this.controller.listen('bg2colorselector', Mojo.Event.propertyChange, this.bg2SelectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('bg2colorselector', {label: $L("Landscape BG"), choices: this.bg2colorchoice, modelProperty:'bg2color'}, bg2cSelectorsModel);
	
	bg2cSelectorsModel.choices = [
		{ label: "black", value:"black" },
		{ label: "blue", value:"blue" },
		{ label: "gray", value:"gray" },
		{ label: "green", value:"green" },
		{ label: "red", value:"red" },
		{ label: "white", value:"white" },
		{ label: "yellow", value:"yellow" }
	];
	this.controller.modelChanged(bg2cSelectorsModel);
	
	this.controller.listen($('resetcolors'),Mojo.Event.tap, this.resetColorsButtonPressed.bind(this));
}

PreferencesAssistant.prototype.saveSPButtonPressed = function(event){
	SHOUTPREFIX = prefixmodel['original'];
	this.saveCookie();
	
	if(SHOUTPREFIX == "")
		this.controller.showAlertDialog({
			onChoose: function(value) {},
			title:"Message",
			message:"Prefix removed.",
			allowHTMLMessage: true,
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
	else
		this.controller.showAlertDialog({
			onChoose: function(value) {},
			title:"Message",
			message:"Prefix saved.",
			allowHTMLMessage: true,
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
}

PreferencesAssistant.prototype.clearBSButtonPressed = function(event) {
	BLOCKEDUSERS = "";
	this.saveCookie();
	
	var bucolors = BLOCKEDUSERS.split(";");
	var buhtml = "";
	for(i = 0; i < bucolors.length; i++) {
		buhtml = buhtml + "<div style='background-color:" + bucolors[i] + ";float:left;width:30px;height:30px'></div>";
	}
	
	$("blockedusers").innerHTML = buhtml;
}

PreferencesAssistant.prototype.clearFSButtonPressed = function(event) {
	FRIENDUSERS = "";
	this.saveCookie();
	
	var fucolors = FRIENDUSERS.split(";");
	var fuhtml = "";
	for(i = 0; i < fucolors.length; i++) {
		fuhtml = fuhtml + "<div style='background-color:" + fucolors[i] + ";float:left;width:30px;height:30px'></div>";
	}
	
	$("friendusers").innerHTML = fuhtml;
}

PreferencesAssistant.prototype.resetColorsButtonPressed = function(event){
	FRIENDCOLOR = "standard";
	FGCOLOR = "standard";
	BGCOLOR = "standard";
	FG2COLOR = "standard";
	BG2COLOR = "standard";

	this.saveCookie();
	
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:"Restart required!",
		message:"Please restart the app for changes to take effect.",
		allowHTMLMessage: true,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}

PreferencesAssistant.prototype.saveCookie = function(event) {
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

PreferencesAssistant.prototype.selectorChanged = function(event) {
	UPDATEINTERVAL = event.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.friendSelectorChanged = function(event) {
	FRIENDCOLOR = event.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.fgSelectorChanged = function(event) {
	FGCOLOR = event.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.bgSelectorChanged = function(event) {
	BGCOLOR = event.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.fg2SelectorChanged = function(event) {
	FG2COLOR = event.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.bg2SelectorChanged = function(event) {
	BG2COLOR = event.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.csTogglePressed = function(event) {
	COLORSHOUTS = csModel.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.sfTogglePressed = function(event) {
	SHOWFLAG = sfModel.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.slTogglePressed = function(event) {
	SHOWLISTENERS = slModel.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.slsTogglePressed = function(event) {
	SHOWLASTSHOUTS = slsModel.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.sshTogglePressed = function(event) {
	SHOWSHOUTHINT = sshModel.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.dlTogglePressed = function(event) {
	DISABLELANDSCAPE = dlModel.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.esTogglePressed = function(event) {
	ENTERTOSEND = dlModel.value;
	this.saveCookie();
};

PreferencesAssistant.prototype.activate = function(event) {

}

PreferencesAssistant.prototype.deactivate = function(event) {

}

PreferencesAssistant.prototype.cleanup = function(event) {

}
