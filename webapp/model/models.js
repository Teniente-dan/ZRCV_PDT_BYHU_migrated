sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createHUSetModel: function () {
			var oModel = new JSONModel({
				/*	totalQuantity: "",
					wholesaleQuantity: "",
					retailQuantity : ""*/
				CREATED_BY: "MC_MASTER",
				CREATION_TIMESTAMP: "/Date(1540206985000)/",
				FLAG: "X",
				HU_EXT: "2000000255",
				HU_INT: "2592",
				LAST_CHANGE_BY: "X-DKOTWAL",
				LAST_CHANGE_TIMESTAMP: "/Date(1540207076000)/",
				STATUS: "002",
				STORE_ID: "0493",
				TOTAL_ITEM: "144.000 ",
				TU_ID: "200000007677",
				UNIT: "PI"
			});

			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		createFilterModel: function () {
			var oModel = new JSONModel({
				InProgress: "",
				InTransit: "",
				Processed: ""
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;

		},

		createTUHeaderModel: function () {
			var oModel = new JSONModel({
				TOTAL_HU: "",
				PROCESSED_HU: "",
				TRANSIT_HU: "",
				ScannnedHU: "",
				yet2scanHU: ""
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;

		},
		createTUModel: function () {
			var oModel = new JSONModel({
				TU_ID: "",
				//	InTransit: "2000000255",
				//	Processed: "2592"
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;

		},
		createHUModel: function () {
			var oModel = new JSONModel({
				HU_EXT: "",
				//	InTransit: "2000000255",
				//	Processed: "2592"
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;

		},
		createI18NModel: function () {
			var m = new sap.ui.model.resource.ResourceModel({
				bundleName: "retailstore.ZRCV_PDT_byHU.i18n.i18n"
			});
			return m;
		},

	};
});