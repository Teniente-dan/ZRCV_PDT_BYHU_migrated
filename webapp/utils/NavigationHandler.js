/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/m/BusyDialog"], function (B) {
	"use strict";
	var n = {
		_oBusyIndicator: null,
		onInit: function (r) {
			this._oBusyIndicator = new B();
		},
		showBusyDialog: function () {
				this._oBusyIndicator = new B();
			this._oBusyIndicator.open();
		},
		hideBusyDialog: function () {
			this._oBusyIndicator.close();
		}
	};
	return n;
});