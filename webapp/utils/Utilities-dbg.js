/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/m/MessageBox"], function (M) {
	"use strict";
	var u = {
		_messageBox: M,
		_oComponent: null,
		_oResourceBundle: null,
		init: function (c) {
			this._oComponent = c;
			this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();
		},
		displayErrorMessages: function (e, m) {
			var E = e.length > 0 ? e[0] : null;
			var s = "";
			var d = "";
			var S = false;
			if (m) {
				s = m;
				if (E) {
					S = true;
					d = E.getMessage();
				}
			} else {
				if (E) {
					s = E.getMessage();
				}
			}
			if (S) {
				s = s.concat(" ").concat(d).trim();
			}
			this._messageBox.error(s);
		},
		getSafeCallback: function (c) {
			if (c === undefined) {
				c = function () {
					return;
				};
			}
			return c;
		},
		getText: function (k) {
			var r = "";
			try {
				r = this._oResourceBundle.getText(k);
			} catch (e) {
				r = k;
				jQuery.sap.log.error("Missing text definition for key " + k + ".", "", "retail.store.countstocks1");
			}
			return r;
		}
	};
	return u;
});