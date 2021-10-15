/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/retail/store/lib/reuses1/customControls/SiteSelectDialog",

"retailstore/ZRCV_PDT_byHU/utils/Context"], function (S, C) {
	"use strict";
	return S.extend("retailstore.ZRCV_PDT_byHU.controller.SiteSelectDialog", {
		_context: C,
		searchSites: function (s, f, F, i, a) {
			this._context.searchSites(s, f, F, i, a);
		}
	});
});