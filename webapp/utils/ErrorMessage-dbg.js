/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/base/Object"], function (U) {
	"use strict";
	var e = U.extend("retailstore.ZRCV_PDT_byHU.utils.ErrorMessage", {
		constructor: function (E, s) {
			this._sErrorMessage = E;
			this._sErrorCode = s;
		},
		getMessage: function () {
			return this._sErrorMessage;
		},
		setMessage: function (m) {
			this._sErrorMessage = m;
		},
		getCode: function () {
			return this._sErrorCode;
		},
		setCode: function (c) {
			this._sErrorCode = c;
		}
	});
	return e;
});