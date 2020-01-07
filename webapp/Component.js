sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/upl/PhysicalInventoryReport/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("com.sap.upl.PhysicalInventoryReport.Component", {

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
			var oModel = new JSONModel({
				busy: false,
				enableexecute: false
			});
			this.setModel(oModel, "settingsModel");

			var inventoryData = new JSONModel({
				COUNTDATE: "",
				WHNUMBER: "",
				BIN: "",
				ITEM: "",
				BATCH: "",
				results: [],
				difference: [{
					"Key": "1",
					"Text": "> 0"
				}, {
					"Key": "2",
					"Text": "< 0"
				}]
			});
			this.setModel(inventoryData, "inventoryModel");

			this.getModel("inventoryModel").setSizeLimit(1000000000);
			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});