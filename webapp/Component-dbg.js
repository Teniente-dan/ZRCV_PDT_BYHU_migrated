sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"retailstore/ZRCV_PDT_byHU/model/models",
		"sap/ui/model/resource/ResourceModel",
	"retailstore/ZRCV_PDT_byHU/model/Facade"
], function (UIComponent,Device, models,ResourceModel,Facade) {
	"use strict";

	return UIComponent.extend("retailstore.ZRCV_PDT_byHU.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createHUSetModel(), "HUSetModel");
			this.setModel(models.createFilterModel(), "filtersModel");
				this.setModel(models.createTUModel(), "TUModel");
					this.setModel(models.createHUModel(), "HUModel");//TUHeaderModel
					this.setModel(models.createTUHeaderModel(), "TUHeaderModel");
						Facade.setService(this.getModel("siteModel"));
			
			
		}
	});
});