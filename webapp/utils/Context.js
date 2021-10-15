/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["retailstore/ZRCV_PDT_byHU/model/Facade", "retailstore/ZRCV_PDT_byHU/utils/Constants",
	"retailstore/ZRCV_PDT_byHU/utils/Utilities"
], function (F, C, U) {
	"use strict";
	var c = {
		_facade: F,
		_constants: C,
		_utilities: U,
		_model: null,
		_aGetUoMPrecisionsQueue: [],
		getModel: function () {
			if (this._model === null) {
				this._model = new sap.ui.model.json.JSONModel();
				this._model.setData({
					PreloadConfiguration: null
				
				});
			}
			return this._model;
		},
		reset: function () {
			this._model = null;
		
		},

		getCurrentSite: function (f, e) {
			f = this._utilities.getSafeCallback(f);
			var o = this.getModel().getData().currentSite;
			if (o) {
				f(o);
			} else {
				var t = this;
				var s = function (R) {
					if (R.length === 1) {
						o = R[0];
						t.getModel().getData().currentSite = o;
						f(o);
					} else {
						t.getModel().getData().currentSite = null;
						e();
					}
				};
				var n = 2;
				var r = 0;
				this._facade.getAssignedSite(s, e, n, r);
			}
		},
		searchSites: function (s, f, e, n, r) {
			var t = this;
			var S = function (a) {
				f = t._utilities.getSafeCallback(f);
				f(a);
			};
			n = this.initRecordPerPage(n);
			r = this.initRecordStartFrom(r);
			this._facade.getSites(s, S, e, n, r);
		},
		setAssignedSite: function (s, f, e) {
			var t = this;
			var S = function () {
				f = t._utilities.getSafeCallback(f);
				t.reset();
				t._model = null;
				f();
			};
			this._facade.setAssignedSite(s, S, e);
		},
		initRecordPerPage: function (n) {
			if (typeof n === "undefined" || n === null) {
				n = this._constants.LIST_ITEMS_PER_PAGE;
			}
			return n;
		},
		initRecordStartFrom: function (r) {
			if (typeof r === "undefined" || r === null) {
				r = 0;
			}
			return r;
		}
	
	
	};
	return c;
});