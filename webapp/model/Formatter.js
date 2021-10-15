sap.ui.define([
	"retailstore/ZRCV_PDT_byHU/model/models"
], function(models) {
	"use strict";

	return {
		
		
			checkVisForDlgSetting: function(FLAG) {
			if (FLAG === "X") {
				//console.log("showing dlg element");
				return "true";
			} else {
				return "false";
			}

		},
		checkVisSetting: function(value){
		return "working";	
			
		},
		deleteVisible: function(value){
			
		}
		
	};

});