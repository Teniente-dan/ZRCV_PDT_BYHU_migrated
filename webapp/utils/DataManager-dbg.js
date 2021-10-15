/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("retail.store.ZRCV_PDT_byHU.utils.DataManager");
retail.store.ZRCV_PDT_byHU.utils.DataManager = {
	_oDataModel: null,
	_bDetailedReceiving: false,
	_oStore: null,
	_oStoreDeferred: jQuery.Deferred(),
	_oPostAfterSubmit: null,
	init: function (d, s) {
		this._oDataModel = d;
		if (s && s.detailedReceiving) {
			this._bDetailedReceiving = s.detailedReceiving;
		}
	},
	onRequestSent: function (n) {
		jQuery.sap.log.info("Merchandise Receive by HU: OData Request Sent");
		if (!n) {
			sap.ca.ui.utils.busydialog.requireBusyDialog();
		}
	},
	onRequestCompleted: function (n) {
		jQuery.sap.log.info("Merchandise Receive by HU: OData Request Completed");
		if (!n) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}
	},
	readStores: function (a, s, e) {
		var u = {
			"$inlinecount": "allpages"
		};
		this.enrichURLParameters(u, a);
		var p = "/Stores";
		this.onRequestSent();
		this._oDataModel.read(p, {
			success: jQuery.proxy(function (d, r) {
				this.onRequestCompleted();
				if (typeof s === "function") {
					s(d, r);
				}
			}, this),
			error: jQuery.proxy(function (E) {
				this.onRequestCompleted();
				if (typeof e === "function") {
					e(E);
				}
			}, this),
			urlParameters: u
		});
	},
	readSingleStore: function (s, S, e) {
		var p = "";
		if (s) {
			p = "/Stores('" + s + "')";
		} else {
			p = "/Stores('')";
		}
		this.onRequestSent();
		this._oDataModel.read(p, {
			success: jQuery.proxy(function (d, r) {
				this.onRequestCompleted();
				this._oStore = d;
				this._oStoreDeferred.notify(d);
				if (typeof S === "function") {
					S(d, r);
				}
			}, this),
			error: jQuery.proxy(function (E) {
				this.onRequestCompleted();
				if (typeof e === "function") {
					e(E);
				}
			}, this),
			urlParameters: {
				"$expand": this.buildExpandForStore()
			}
		});
	},

	updateStoreAssignment: function (s, S, e) {
		var p = "/Users('')";
		var d = {};
		d.AssignedStoreID = s;
		this.onRequestSent();
		this._oDataModel.update(p, d, {
			success: jQuery.proxy(function () {
				this.onRequestCompleted();
				if (typeof S === "function") {
					S();
				}
			}, this),
			error: jQuery.proxy(function (E) {
				this.onRequestCompleted();
				if (typeof e === "function") {
					e(E);
				}
			}, this)
		});
	},
	saveSelectedFilterValues: function (s, f) {
		var o = null;
		var O = [];
		var p = "";
		var m = this._oDataModel;
		if (!f) {
			return;
		}
		m.clearBatch();
		p = "DeleteUserDefaultFilterValues?StoreID='" + s + "'&FilterID=''&FilterValueID=''";
		o = m.createBatchOperation(p, "POST");
		O.push(o);
		jQuery.each(f, function (F, a) {
			jQuery.each(a, function (b, S) {
				if (S) {
					p = "UpdateUserDefaultFilterValue?StoreID='" + s + "'&FilterID='" + F + "'&FilterValueID='" + b + "'";
					o = m.createBatchOperation(p, "POST");
					O.push(o);
				}
			});
		});
		m.addBatchChangeOperations(O);
		this.onRequestSent(true);
		m.submitBatch(jQuery.proxy(function () {
			this.onRequestCompleted(true);
		}, this), jQuery.proxy(function () {
			this.onRequestCompleted(true);
		}, this));
	},

	enrichURLParameters: function (u, a) {
		if (u && a) {
			if (a.skip) {
				jQuery.extend(u, {
					"$skip": a.skip
				});
			}
			if (a.top) {
				jQuery.extend(u, {
					"$top": a.top
				});
			}
			if (a.search) {
				jQuery.extend(u, {
					"search": a.search
				});
			}
		}
	},
	buildExpandForStore: function () {
		var e = "Filters/UserDefaultFilterValues,Filters/SystemDefaultFilterValues";
		if (this._bDetailedReceiving) {
			e = e + ",SettingsSet";
		}
		return e;
	},

	getStore: function (s) {
		var S = null;
		if (this._oStore && s === this._oStore.StoreID) {
			S = this._oStore;
		}
		return S;
	},
	getStorePromise: function () {
		return this._oStoreDeferred.promise();
	},
	cleanup: function () {
		this._oDataModel = null;
		this._aDocuments = [];
		this._aDocumentItems = [];
		this._aDocumentRefreshCallbacks = [];
		this._aDocumentWithItemsRefreshCallbacks = [];
		this._aDocumentItemRefreshCallbacks = [];
	}
};