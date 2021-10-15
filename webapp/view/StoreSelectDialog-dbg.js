/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("retailstore.ZRCV_PDT_byHU.view.StoreSelectDialog");
jQuery.sap.require("sap.retail.store.lib.reuse.customControls.SiteSelectDialog");
jQuery.sap.require("retailstore.ZRCV_PDT_byHU.utils.DataManager");
sap.retail.store.lib.reuse.customControls.SiteSelectDialog.extend("retailstore.ZRCV_PDT_byHU.view.StoreSelectDialog", {
    searchSites: function(s, S, e, t, i) {
        retail.store.ZRCV_PDT_byHU.utils.DataManager.readStores({
            skip: i,
            top: t,
            search: s
        }, function(d) {
            S(d.results);
        }, e);
    }
});
