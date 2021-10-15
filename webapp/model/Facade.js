/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["retailstore/ZRCV_PDT_byHU/utils/Utilities", "retailstore/ZRCV_PDT_byHU/utils/Constants",
	"retailstore/ZRCV_PDT_byHU/utils/ErrorMessage", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (U, C, E, F, a) {
	"use strict";
	var f = {
		_utilities: U,
		_constants: C,
		_errorMessage: E,
		_filter: F,
		_filterOperator: a,
		_service: null,
		_oDataModel: null,
		_sDeferredGroupId: "sDeferredGroup",
		READ_REQUEST_TYPE: "read",
		UPDATE_REQUEST_TYPE: "update",
		CREATE_REQUEST_TYPE: "create",
		REMOVE_REQUEST_TYPE: "remove",
		CALLFUNCTION_REQUEST_TYPE: "callFunction",
		setService: function (d) {
			this._service = d;
			this._oDataModel = d;
			this._service.sDefaultUpdateMethod = "MERGE";
			this._service.setDeferredGroups([this._sDeferredGroupId]);
		},
		reset: function () {
			this._service = null;
		},
		getService: function () {

			return this._service;
		},
		read: function (p, P, s, b) {
			this.sendRequest(this.READ_REQUEST_TYPE, p, null, P, s, b);
		},
		update: function (p, P, m, s, b) {
			this.sendRequest(this.UPDATE_REQUEST_TYPE, p, P, m, s, b);
		},
		create: function (p, P, m, s, b) {
			this.sendRequest(this.CREATE_REQUEST_TYPE, p, P, m, s, b);
		},
		remove: function (p, P, s, b) {
			this.sendRequest(this.REMOVE_REQUEST_TYPE, p, null, P, s, b);
		},
		callFunction: function (p, P, s, b) {
			this.sendRequest(this.CALLFUNCTION_REQUEST_TYPE, p, null, P, s, b);
		},
		updateStoreAssignment: function (s, S, e) {
			var p = "/Users('')";
			var d = {};
			d.AssignedStoreID = s;
			//this.onRequestSent();
			this._oDataModel.update(p, d, {
				success: function () {
					//	this.onRequestCompleted();
					if (typeof S === "function") {
						S();
					}
				}.bind(this),
				error: function (E) {
					//this.onRequestCompleted();
					if (typeof e === "function") {
						e(E);
					}
				}.bind(this)
			});
		},
		sendRequest: function (r, p, P, m, s, b) {
			var S = this.getService()[r];
			m = m ? m : {};
			if (r === this.CALLFUNCTION_REQUEST_TYPE) {
				m.method = typeof (m.method) === "string" ? m.method : "GET";
			}
			var c = [p, jQuery.extend(m, {
				success: jQuery.proxy(function (d, R) {
					if (typeof s === "function") {
						var o = d && d.results ? d.results : d;
						s(o, R);
					}
				}, this),
				error: jQuery.proxy(function (e) {
					if (typeof b === "function") {
						this.raiseErrors([e], b);
					}
				}, this)
			})];
			if (P) {
				c.splice(1, 0, P);
			}
			S.apply(this.getService(), c);
		},
		createBatchRequest: function (r, p, P, m) {
			var s = this.getService();
			var S = s[r];
			m = m ? m : {};
			m.groupId = typeof m.groupId === "string" ? m.groupId : this._sDeferredGroupId;
			if (r === this.CALLFUNCTION_REQUEST_TYPE) {
				m.method = typeof (m.method) === "string" ? m.method : "GET";
			}
			var c = function (R) {
				var b = [p, jQuery.extend(m, {
					success: function (d, o) {
						R({
							data: d && d.results ? d.results : d,
							response: o
						});
					},
					error: function (e) {
						R({
							error: e
						});
					}
				})];
				if (P) {
					b.splice(1, 0, P);
				}
				return b;
			};
			return new Promise(function (R) {
				S.apply(s, c(R));
			});
		},
		sendBatchRequests: function (b, r, B, c) {
			Promise.all(b).then(function (R) {
				var e = this._getErrorResponsesFromBatch(R);
				if (e.length > 0) {
					this.raiseErrors(e, c);
				} else {
					var d = R.map(function (o) {
						return o.data;
					});
					B(d);
				}
			}.bind(this));
			this.getService().submitChanges({
				groupId: typeof r === "string" ? r : this._sDeferredGroupId,
				success: function () {}.bind(this),
				error: function (e) {
					this.raiseErrors([e], c);
				}.bind(this)
			});
		},
		raiseErrors: function (b, c) {
			var g = this._utilities.getText("GENERIC_ERROR_MESSAGE");
			var G = new this._errorMessage(g, "");
			var d = [G];
			if (b.constructor === Array) {
				if (b.length > 0) {
					d = b.map(function (o) {
						var B = g;
						var s = "";
						var h = G;
						var j = null;
						if (o.responseText) {
							try {
								j = jQuery.parseJSON(o.responseText);
							} catch (e) {
								j = null;
								B = B.concat(" ").concat(o.responseText);
							}
							var i = false;
							if (j) {
								if (j.error) {
									if (j.error.message) {
										if (j.error.message.value) {
											B = j.error.message.value;
											i = true;
										}
										if (j.error.code) {
											s = j.error.code;
										}
									}
								}
							}
							if (i === false) {
								if (o.message || o.statusCode || o.statusText) {
									B = o.message.concat(": ").concat(o.statusCode.toString()).concat(" ").concat(o.statusText);
								}
							}
							h = new this._errorMessage(B.trim(), s);
						}
						return h;
					}, this);
				}
			}
			if (typeof c !== "function") {
				this._utilities.displayErrorMessages(d);
			} else {
				c(d);
			}
		},
		_getErrorResponsesFromBatch: function (b) {
			var e = b.filter(function (B) {
				return B.error !== undefined;
			}).map(function (B) {
				return B.error;
			});
			return e;
		},
		_createSearchFilterObject: function (b, c) {
			var t = this;
			var d = [];
			if (b.length > 0 && b.length === c.length) {
				d = b.map(function (s, i) {
					return new t._filter(s, t._filterOperator.EQ, c[i]);
				});
			}
			return d;
		},
		getAssignedSite: function (s, b, t, S) {
			var c = ["Assigned"];
			var d = ["X"];
			var e = this._createSearchFilterObject(c, d);
			var u;
			if (t !== undefined && S !== undefined) {
				u = {};
				u.$top = t;
				u.$skip = S;
			}
			var p = {
				filters: e,
				urlParameters: u
			};
			/*	this.read("/Sites", p, s, b);*/
			this.read("/Stores", p, s, b);
		},
		setAssignedSite: function (s, S, b) {
			var p = {
				"StoreID": s
			};
			var p = "";
			if (s) {
				p = "/Stores('" + encodeURIComponent(s) + "')";
			} else {
				p = "/Stores('')";
			}
			this.updateStoreAssignment(s, S, b);
			this._oDataModel.metadataLoaded().then(function () {
				//this.onRequestSent(true);
				this._oDataModel.read(p, {
					success: function (d, r) {
						//	this.onRequestCompleted(true);
						this._oStore = d;
						this._oStoreDeferred.notify(d);
						if (typeof S === "function") {
							S(d, r);
						}
					}.bind(this),
					error: function (E) {
						//	this.onRequestCompleted(true);
						if (typeof e === "function") {
							b(E);
						}
					}.bind(this),
					urlParameters: {
						"$expand": this.buildExpandForStore()
					}
				});
			}.bind(this));

			//this.update("/Stores('" + s + "')", p, null, S, b);
		},
		readSingleStore: function (s, S, e) {

		},
		buildExpandForStore: function () {
			var e = "Filters/UserDefaultFilterValues,Filters/SystemDefaultFilterValues,Settings";
			return e;
		},
		getSites: function (s, S, b, t, i) {
			var c = [];
			var u;

			if (t !== undefined && i !== undefined) {
				/*	u = {};
					u.$top = t;
					u.$skip = i;*/
				//temp
				var u = {
					"$inlinecount": "allpages"
				};
			}
			if (s && s !== "") {
				var d = ["StoreID"];
				var e = [s];
				c = this._createSearchFilterObject(d, e);
			}
			var p = {
				filters: c,
				urlParameters: u
			};
			//this.read("/Sites", p, S, b);
			this.read("/Stores", p, S, b);
		}
	};
	return f;
});