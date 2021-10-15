sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	// "sap/ndc/BarcodeScannerButton",
	// "sap/ndc/BarcodeScanner",
	"sap/ui/model/json/JSONModel",
	"retailstore/ZRCV_PDT_byHU/model/Facade",
	'sap/m/MessageStrip',
	'sap/m/MessageBox',
	"sap/ui/Device",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/Button",
	"retailstore/ZRCV_PDT_byHU/controller/SiteSelectDialog",
	"retailstore/ZRCV_PDT_byHU/utils/NavigationHandler",
	"retailstore/ZRCV_PDT_byHU/utils/Context",
	"retailstore/ZRCV_PDT_byHU/model/Formatter",
	"retailstore/ZRCV_PDT_byHU/utils/formatter",
	"sap/m/MessageToast",

	"retailstore/ZRCV_PDT_byHU/model/models"
], function (Controller, Filter, FilterOperator, JSONModel, F, MessageStrip, MessageBox, Device, ResourceModel, Button,
	SiteSelectDialog, NavigationHandler,
	Context, Formatter, formatter, MessageToast, models) {
	"use strict";

	return Controller.extend("retailstore.ZRCV_PDT_byHU.controller.Review", {

		_siteSelectDialog: SiteSelectDialog,
		_navigationHandler: null,
		_context: Context,
		formatter: formatter,
		_messageToast: MessageToast,
		MessageBox: MessageBox,
		_models: models,
		//formatter: formatter
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf retailstore.ZRCV_PDT_byHU.view.Review
		 */
		onInit: function () {

			this.getView().setModel(this._models.createI18NModel(), "i18n");
			this._obundle = this.getView().getModel("i18n").getResourceBundle();
			this._navigationHandler = NavigationHandler;
			this.getOwnerComponent().getRouter().getRoute("RouteReview").attachPatternMatched(this.onReviewRouteMatched, this);

		},

		backToScan: function (oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteHUlisting", {
				HUnumber: this.getOwnerComponent().getModel("HUSetModel").getProperty("/HU_EXT")
			});
		},
		onReviewRouteMatched: function (oEvent) {
			var self = this;

			var aFilters = [];
			var Status = '002';
			var materialSection = self.getView().byId("HuTable");
			var footer = self.getView().byId("footer");
			//	var sServiceUrl = "/sap/opu/odata/sap/ZRETAILSTORE_RECEIVE_PRODUCT_SRV";
			var sServiceUrl = this.getView().getModel().sServiceUrl;

			var oModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl, true);
			var oFilter1 = new Filter("STATUS", FilterOperator.EQ, Status);

			aFilters.push(oFilter1);

			var HUModel = this.getOwnerComponent().getModel("HUModel");
			HUModel.setSizeLimit(1500);
			var TUModel = this.getOwnerComponent().getModel("TUModel");
			TUModel.setSizeLimit(1500);
			var TU = TUModel.getProperty("/TU_ID");

			oModel.read("/TUHeaders('" + TU + "')/HUInfoSet", {
				filters: aFilters,
				headers: {
					"X-CSRF-Token": "Fetch"
				},
				// method: "POST",
				success: function (data) {

					var HUModellist = new sap.ui.model.json.JSONModel();
					HUModellist.setSizeLimit(1500);
					var arr = [];
					arr.push(data);

					HUModellist.setData(data);
					self.getView().byId("HuTable").setModel(HUModellist);

					if (!materialSection.getVisible()) {
						materialSection.setVisible(true);

						if (!footer.getVisible()) {
							footer.setVisible(true);
						}

					}

				},
				error: function (oError) {
					var msg = "";
					try {
						msg = JSON.parse(oError.response.body)["error"]["message"]["value"];

					} catch (e) {
						msg = self._obundle.getText("GenericError");
					}
					MessageToast.show(msg);
				}
			});

		},
		//fucntion to search HU in list
		onSearch: function (oEvent) {
			var filters = [];
			var query = oEvent.getParameter("query");
			var str = new RegExp("^(?! )([a-zA-Z ]+)$");
			if (query && query.length > 0) {
				if (str.test(query)) {
					var descriptionFilter = new sap.ui.model.Filter("HU_EXT", sap.ui.model.FilterOperator.Contains, query);
					filters.push(descriptionFilter);
				} else {
					var materialFilter = new sap.ui.model.Filter("HU_EXT", sap.ui.model.FilterOperator.Contains, query);
					filters.push(materialFilter);
				}
			}

			var list = this.getView().byId("HuTable");
			var binding = list.getBinding("items");
			binding.filter(filters);

		},

		openFilter: function (oEvent) {
			if (!this.HUfilterDialog) {
				this.HUfilterDialog = sap.ui.xmlfragment("retailstore.ZRCV_PDT_byHU.view.fragment.filter", this.getView().getController());
				this.getView().addDependent(this.HUfilterDialog);

			}
			this.HUfilterDialog.open();

		},
		//function to post filters to backend
		onFilterSelect: function (oEvent) {
			var aFilters = [];
			var filtersModel = this.getOwnerComponent().getModel("filtersModel");
			if (filtersModel.getProperty("/Processed") === true) {
				var oFilter1 = new Filter("STATUS", FilterOperator.EQ, "003");
				aFilters.push(oFilter1);
			}
			if (filtersModel.getProperty("/InTransit") === true) {
				var oFilter2 = new Filter("STATUS", FilterOperator.EQ, "001");
				aFilters.push(oFilter2);
			}
			if (filtersModel.getProperty("/InProgress") === true) {
				var oFilter3 = new Filter("STATUS", FilterOperator.EQ, "002");
				aFilters.push(oFilter3);
			}
			var sServiceUrl = this.getView().getModel().sServiceUrl;
			//	var sServiceUrl = "/sap/opu/odata/sap/ZRETAILSTORE_RECEIVE_PRODUCT_SRV";

			var oModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl, true);

			var HUModel = this.getOwnerComponent().getModel("HUModel");
			HUModel.setSizeLimit(1500);
			var TUModel = this.getOwnerComponent().getModel("TUModel");
			TUModel.setSizeLimit(1500);
			var TU = TUModel.getProperty("/TU_ID");

			var self = this;

			oModel.read("/TUHeaders('" + TU + "')/HUInfoSet", {
				filters: aFilters,
				headers: {
					"X-CSRF-Token": "Fetch"
				},
				// method: "POST",
				success: function (data) {

					var HUModel2 = new sap.ui.model.json.JSONModel();
					HUModel2.setSizeLimit(1500);
					var arr = [];
					arr.push(data);

					HUModel2.setData(data);
					self.getView().byId("HuTable").setModel(HUModel2);
					// var filtersModel = this.getOwnerComponent().getModel("filtersModel");
					filtersModel.setProperty("/Processed", false);
					filtersModel.setProperty("/InTransit", false);
					filtersModel.setProperty("/InProgress", false);

				},
				error: function (oError) {
					var msg = "";
					try {
						msg = JSON.parse(oError.response.body)["error"]["message"]["value"];

					} catch (e) {
						msg = self._obundle.getText("GenericError");
					}
					MessageToast.show(msg);
				}
			});
			this.closeProductFilterDialog();

		},
		InProgressSelected: function (oEvent) {
			var filtersModel = this.getOwnerComponent().getModel("filtersModel");
			filtersModel.setProperty("/InProgress", oEvent.getParameter("selected"));
		},
		IntransitSelected: function (oEvent) {
			var filtersModel = this.getOwnerComponent().getModel("filtersModel");
			filtersModel.setProperty("/InTransit", oEvent.getParameter("selected"));
		},
		ProcessedSelected: function (oEvent) {
			var filtersModel = this.getOwnerComponent().getModel("filtersModel");
			filtersModel.setProperty("/Processed", oEvent.getParameter("selected"));
		},
		closeProductFilterDialog: function (oEvent) {
			if (!this.HUfilterDialog) {
				return;
			}
			this.HUfilterDialog.close();
		},

		onDelete: function (oEvent) {
			var bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
			var selectedRow = this.getView().byId("HuTable").getModel().getData(bindingContextPath);
			selectedRow.results[0].DelFlag = "X";
			var index = parseInt(bindingContextPath.split('/')[2]);

			var DelHU = selectedRow.results[index].HU_EXT;
			var DelTU = selectedRow.results[index].TU_ID;
			var DelStatus = selectedRow.results[index].STATUS;
			var self = this;

			//pass TUid and HuEXT to backend, then on success refresh the table model by passing the status of deleted row as filter.

			///sap/opu/odata/sap/ZRETAILSTORE_RECEIVE_PRODUCT_SRV/HUInfoSet(TU_ID='100000003255',HU_EXT='00000000001000000884')
			var sServiceUrl = this.getView().getModel().sServiceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			this._navigationHandler.showBusyDialog();
			oModel.remove("/HUInfoSet(TU_ID='" + DelTU + "',HU_EXT='" + DelHU + "')", {
				method: "DELETE",
				success: function (data) {
					self._navigationHandler.hideBusyDialog();

					//	var sServiceUrl = this.getView().getModel().sServiceUrl;
					var aFilters = [];
					//	var oModel = new sap.ui.model.odata.ODataModel(
					//		sServiceUrl, true);
					var oFilter1 = new Filter("STATUS", FilterOperator.EQ, DelStatus);

					aFilters.push(oFilter1);

					//	var HUModel = this.getOwnerComponent().getModel("HUModel");
					//	HUModel.setSizeLimit(1500);
					//	var TUModel = this.getOwnerComponent().getModel("TUModel");
					//	TUModel.setSizeLimit(1500);
					//	var TU = TUModel.getProperty("/TU_ID");

					oModel.read("/TUHeaders('" + DelTU + "')/HUInfoSet", {
						filters: aFilters,
						headers: {
							"X-CSRF-Token": "Fetch"
						},
						// method: "POST",
						success: function (data) {

							var HUModellist = new sap.ui.model.json.JSONModel();
							HUModellist.setSizeLimit(1500);
							var arr = [];
							arr.push(data);

							HUModellist.setData(data);
							self.getView().byId("HuTable").setModel(HUModellist);
							//	self.getView().byId("HuTable").refresh();

						},
						error: function (oError) {
							var msg = "";
							try {
								msg = JSON.parse(oError.response.body)["error"]["message"]["value"];

							} catch (e) {
								msg = self._obundle.getText("GenericError");
							}
							MessageToast.show(msg);
						}
					});

				},
				error: function (oError) {
					self._navigationHandler.hideBusyDialog();
					var msg = "";

					try {
						msg = JSON.parse(oError.response.body)["error"]["message"]["value"];

					} catch (e) {
						msg = self._obundle.getText("GenericError");
					}

					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						id: "messageBoxId1",
						initialFocus: sap.m.MessageBox.Action.OK,

						onClose: function (oAction) {

						}
					});
				},

			});

		},
		//function to post scanned TU to backend-to create delivery for all scanned HUs
		onPost: function (oEvent) {

			if (this.getView() && this.getView().byId("HuTable") && this.getView().byId("HuTable").getBinding("items") &&
				this.getView().byId("HuTable").getBinding("items").oList.length !== 0) {

				var self = this;
				//	var sServiceUrl = "/sap/opu/odata/sap/ZRETAILSTORE_RECEIVE_PRODUCT_SRV";
				var sServiceUrl = this.getView().getModel().sServiceUrl;

				var TUModel = this.getOwnerComponent().getModel("TUModel");
				var TU = TUModel.getProperty("/TU_ID");

				var entityData = {
					"TU_ID": TU
				};

				self._navigationHandler.showBusyDialog();
				var oModel = new sap.ui.model.odata.ODataModel(
					sServiceUrl, true);
				oModel.create("/TUHeaders", entityData, {
					method: "POST",
					success: function (data) {
						self._navigationHandler.hideBusyDialog();

						MessageToast.show(self._obundle.getText("HUposted"), {
							duration: 7000
						});

						var HUModel = self.getOwnerComponent().getModel("HUModel");

						TUModel.setProperty("/TU_ID", "");
						HUModel.setProperty("/HU_EXT", "");
						var filtersModel = self.getOwnerComponent().getModel("filtersModel");

						filtersModel.setProperty("/Processed", true);
						filtersModel.setProperty("/InTransit", true);
						filtersModel.setProperty("/InProgress", true);

						var oRouter = sap.ui.core.UIComponent.getRouterFor(self);
						oRouter.navTo("RouteHUlisting", {
							HUnumber: "posted"
						});

					},
					error: function (oError) {
						var msg = "";

						try {
							msg = JSON.parse(oError.response.body)["error"]["message"]["value"];

						} catch (e) {
							msg = self._obundle.getText("GenericError");
						}
						self._navigationHandler.hideBusyDialog();
						sap.m.MessageBox.show(msg, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							id: "messageBoxId1",
							initialFocus: sap.m.MessageBox.Action.OK,

							onClose: function (oAction) {

								var HUModel = self.getOwnerComponent().getModel("HUModel");
								TUModel.setProperty("/TU_ID", "");
								HUModel.setProperty("/HU_EXT", "");
								var oRouter = sap.ui.core.UIComponent.getRouterFor(self);
								oRouter.navTo("RouteHUlisting", {
									HUnumber: "error"
								});

							}
						});

					}
				});
			} else {
				var msg = this._obundle.getText("PleaseSelectHU2Post");

				MessageToast.show(msg);

			}

		}

	});

});