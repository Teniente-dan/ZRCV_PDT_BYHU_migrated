sap.ui.define([

], function () {
	"use strict";

	var oFormatter = {

		checkVisForDlgSetting: function (FLAG) {
			if (FLAG === "X") {
				//console.log("showing dlg element");
				return "true";
			} else {
				return "false";
			}

		},
		setStatus: function (value) {
			var status = String(value);
			if (status === '001') {
				return this._obundle.getText("InTransit");
			} else if (status === '002') {
				return this._obundle.getText("InProgress");
			} else if (status === '003') {
				return this._obundle.getText("processed");
			}

		},
		totalFormatter: function (results) {
			if (results)
				return "HU: " + results.length;
		},
	deleteVisible: function(value){
			if(value === "002") 
			return true;
			else 
			return false;
		}
	

	};

	return oFormatter;

});