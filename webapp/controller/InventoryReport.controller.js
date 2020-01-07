sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/sap/upl/PhysicalInventoryReport/model/formatter"
], function (Controller, MessageBox, JSONModel, Device, formatter) {
	"use strict";

	return Controller.extend("com.sap.upl.PhysicalInventoryReport.controller.InventoryReport", {
		formatter: formatter,
		onInit: function () {

			this.path = "/sap/fiori/zphysicalinventoryreport/" + this.getOwnerComponent().getModel("soundModel").sServiceUrl +
				"/SoundFileSet('sapmsg1.mp3')/$value";

			this.byId("CountDate").addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find(".sapMInputBaseInner");
					var oID = oDateInner[0].id;
					$("#" + oID).attr("disabled", "disabled");
				}
			}, this.byId("CountDate"));

			this.byId("CountDate").setMaxDate(new Date());

			jQuery.sap.delayedCall(400, this, function () {
				this.byId("WareHouseNo").focus();
			});

			this.onlyNumber(this.byId("ItemCode"));
		},

		onAfterRendering: function () {
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("WareHouseNo").focus();
			});
			this.onlyNumber(this.byId("ItemCode"));
			this.byId("CountDate").setMaxDate(new Date());
		},

		handleValueHelpRequest: function (oEvent) {
			this.sInputValue = oEvent.getSource();
			this.inputIdMat = oEvent.getSource().getId().split("--")[1];
			var oPath = oEvent.getSource().getBindingInfo("suggestionItems").path;
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.sap.upl.PhysicalInventoryReport.fragments.SearchHelp",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
			this._setListBinding(oPath, this.inputIdMat);
			this._valueHelpDialog.open();
		},

		_setListBinding: function (oPath, idInput) {

			switch (idInput) {
			case "Bin":
				this.id = "Bin";
				this.title = "BIN";
				this.desc = "WHNUMBER";
				this.text = "BIN";
				break;
			default:
				return;
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{" + this.title + "}",
				description: "{" + this.desc + "}"
			});

			var aTempFlter = [];
			aTempFlter.push(new sap.ui.model.Filter([
					new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
						"/WHNUMBER"))
				],
				true));
			this._valueHelpDialog.bindAggregation("items", oPath, oTemplate);
			this._valueHelpDialog.getBinding("items").filter(aTempFlter);

			this._valueHelpDialog.setTitle(this.text);
		},

		onOk: function (oEvent) {
			debugger;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.sKey = oSelectedItem.getTitle();
				if (this.id === "Bin") {
					this.getOwnerComponent().getModel("inventoryModel").setProperty(
						"/BIN", this.sKey);
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("ItemCode").focus();
					});
				}
			}
			this.sInputValue.setValueStateText("");
			this.sInputValue.setValueState("None");

			var WHNUMBER = this.getOwnerComponent().getModel("inventoryModel").getProperty("/WHNUMBER");
			var BIN = this.getOwnerComponent().getModel("inventoryModel").getProperty("/BIN");
			var ITEM = this.getOwnerComponent().getModel("inventoryModel").getProperty("/ITEM");
			var COUNTDATE = this.getOwnerComponent().getModel("inventoryModel").getProperty("/COUNTDATE");

			if (COUNTDATE != "" && WHNUMBER != "" && BIN != "" && ITEM != "") {
				this.checkField();
			}
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = [];
			if (sValue) {
				oFilter.push(new sap.ui.model.Filter([
						new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
							"/WHNUMBER")),
						new sap.ui.model.Filter(this.title, sap.ui.model.FilterOperator.Contains, sValue)
					],
					true));
				evt.getSource().getBinding("items").filter(oFilter);
			} else {
				oFilter.push(new sap.ui.model.Filter([
						new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
							"/WHNUMBER"))
					],
					true));
				evt.getSource().getBinding("items").filter(oFilter);
			}

		},

		onCheckAllField: function (oEvt) {

			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}
			if (oEvt.getSource().getName() == "WareHouseNo") {
				if (this.byId("WareHouseNo").getSelectedKey() != "") {
					this.getOwnerComponent().getModel("inventoryModel").setProperty("/WHNUMBER", oEvt.getSource().getSelectedKey().toUpperCase());
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("Bin").focus();
					});
				}
				if (this.getOwnerComponent().getModel("inventoryModel").getProperty("/COUNTDATE") != "" && this.getOwnerComponent().getModel(
						"inventoryModel").getProperty("/WHNUMBER") != "" && this.getOwnerComponent().getModel(
						"inventoryModel").getProperty("/BIN") != "") {
					this.checkField();
				}
			} else if (oEvt.getSource().getName() == "Bin") {
				if (this.byId("Bin").getValue() != "") {
					this.getOwnerComponent().getModel("inventoryModel").setProperty("/BIN", oEvt.getSource().getValue().toUpperCase());
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("ItemCode").focus();
					});
				}
				if (this.getOwnerComponent().getModel("inventoryModel").getProperty("/COUNTDATE") != "" && this.getOwnerComponent().getModel(
						"inventoryModel").getProperty("/WHNUMBER") != "" && this.getOwnerComponent().getModel(
						"inventoryModel").getProperty("/BIN") != "") {
					this.checkField();
				}
			} else if (oEvt.getSource().getName() == "ItemCode") {
				if (this.byId("ItemCode").getValue() != "") {
					jQuery.sap.delayedCall(400, this, function () {
						document.activeElement.blur();
					});
				}
			}

			if (this.getOwnerComponent().getModel("inventoryModel").getProperty("/COUNTDATE") != "" && this.getOwnerComponent().getModel(
					"inventoryModel").getProperty("/WHNUMBER") != "" && this.getOwnerComponent().getModel(
					"inventoryModel").getProperty("/BIN") != "" && this.getOwnerComponent().getModel(
					"inventoryModel").getProperty("/ITEM") != "") {
				this.checkField();
			}
		},

		checkField: function () {

			var InputFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
						"/WHNUMBER")),
					new sap.ui.model.Filter("BIN", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
						"/BIN")),
					new sap.ui.model.Filter("ITEM", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
						"/ITEM"))
				],
				and: true
			});

			var filter = new Array();
			filter.push(InputFilter);
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().read("/CHECKFIELDSSet", {
				filters: filter,
				success: function (odata, oresponse) {

					var data = odata.results[0];
					if (data.ERROR_INDICATOR == 'E') {
						var audio = new Audio(this.path);
						audio.play();
						jQuery.sap.delayedCall(5000, this, function () {
							this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
							MessageBox.error(data.MESSAGE, {
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										this.getOwnerComponent().getModel("inventoryModel").setProperty(
											"/results", []);
										this.getOwnerComponent().getModel("inventoryModel").refresh();
										this.getOwnerComponent().getModel("inventoryModel").updateBindings();
										var id;
										if (data.ERROR_TYPE == 'WHN') {
											this.getOwnerComponent().getModel("inventoryModel").setProperty("/WHNUMBER", "");
											id = "WareHouseNo";
										} else if (data.ERROR_TYPE == 'BIN') {
											this.getOwnerComponent().getModel("inventoryModel").setProperty("/BIN", "");
											id = "Bin";
										} else if (data.ERROR_TYPE == 'ITM') {
											this.getOwnerComponent().getModel("inventoryModel").setProperty("/ITEM", "");
											id = "ItemCode";
										}
										jQuery.sap.delayedCall(400, this, function () {
											this.byId(id).focus();
										});
									}
								}.bind(this)
							});
						});

					} else {
						this.getInventoryData();
					}
				}.bind(this),
				error: function (error) {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					var audio = new Audio(this.path);
					audio.play();

					if (JSON.parse(error.responseText).error.innererror.errordetails.length > 1) {
						var x = JSON.parse(error.responseText).error.innererror.errordetails;
						var details = '<ul>';
						var y = '';
						if (x.length > 1) {
							for (var i = 0; i < x.length - 1; i++) {
								y = '<li>' + x[i].message + '</li>' + y;
							}
						}
						details = details + y + "</ul>";

						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unabletocheck"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							details: details,
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {

								}
							}.bind(this)
						});
					} else {
						MessageBox.error(JSON.parse(error.responseText).error.message.value, {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							details: details,
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {

								}
							}.bind(this)
						});
					}
				}.bind(this)
			});
		},

		dateChange: function (ovalue) {
			if (ovalue != "") {
				var y = ovalue.slice(0, 4);
				var m = ovalue.slice(4, 6);
				var d = ovalue.slice(6, 8);
				var date = d + "." + m + "." + y;
				return date;
			}
		},

		getInventoryData: function () {
			var count = this.getFormField(this.byId("idPhysicalInventory").getContent());
			if (count > 0) {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				jQuery.sap.delayedCall(400, this, function () {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("allMandatoryField"));
				});
				return;
			}

			var InputFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("COUNTDATE", sap.ui.model.FilterOperator.EQ, this.dateFormatter(this.getOwnerComponent().getModel(
						"inventoryModel").getProperty(
						"/COUNTDATE"))),
					new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
						"/WHNUMBER")),
					new sap.ui.model.Filter("BIN", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
						"/BIN")),
					new sap.ui.model.Filter("ITEM", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("inventoryModel").getProperty(
						"/ITEM"))
				],
				and: true
			});

			var filter = new Array();
			filter.push(InputFilter);
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().read("/PHYREPORTSet", {
				filters: filter,
				success: function (odata, oresponse) {

					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);

					for (var i = 0; i < odata.results.length; i++) {
						odata.results[i].ACTUALSTOCK = odata.results[i].ACTUALSTOCK.trim();
						odata.results[i].DIFFERENCE = odata.results[i].DIFFERENCE.trim();

						if (odata.results[i].DIFFERENCE.indexOf("-") > 0) {
							var pos = odata.results[i].DIFFERENCE.indexOf('-');
							odata.results[i].DIFFERENCE = odata.results[i].DIFFERENCE.slice(0, pos);
							odata.results[i].DIFFERENCE = "-" + odata.results[i].DIFFERENCE;

							odata.results[i].DIFFERENCE = parseFloat(odata.results[i].DIFFERENCE.trim());
						}

						odata.results[i].SCANNEDQTY = odata.results[i].SCANNEDQTY.trim();
						odata.results[i].COUNTDATE = this.dateChange(odata.results[i].COUNTDATE);
					}

					this.getOwnerComponent().getModel("inventoryModel").setProperty(
						"/results", odata.results);
					this.getOwnerComponent().getModel("inventoryModel").refresh();
					this.getOwnerComponent().getModel("inventoryModel").updateBindings();

				}.bind(this),
				error: function (error) {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					var audio = new Audio(this.path);
					audio.play();

					if (JSON.parse(error.responseText).error.innererror.errordetails.length > 1) {
						var x = JSON.parse(error.responseText).error.innererror.errordetails;
						var details = '<ul>';
						var y = '';
						if (x.length > 1) {
							for (var i = 0; i < x.length - 1; i++) {
								y = '<li>' + x[i].message + '</li>' + y;
							}
						}
						details = details + y + "</ul>";

						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unabletogetReport"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							details: details,
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
									this.getOwnerComponent().getModel("inventoryModel").setProperty(
										"/results", []);
									this.getOwnerComponent().getModel("inventoryModel").refresh();
									this.getOwnerComponent().getModel("inventoryModel").updateBindings();
								}
							}.bind(this)
						});
					} else {
						MessageBox.error(JSON.parse(error.responseText).error.message.value, {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							details: details,
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
									this.getOwnerComponent().getModel("inventoryModel").setProperty(
										"/results", []);
									this.getOwnerComponent().getModel("inventoryModel").refresh();
									this.getOwnerComponent().getModel("inventoryModel").updateBindings();
								}
							}.bind(this)
						});
					}
				}.bind(this)
			});
		},

		onlyNumber: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},

		getFormField: function (oFormContent) {
			var c = 0;
			for (var i = 0; i < oFormContent.length; i++) {
				if (oFormContent[i].getMetadata()._sClassName === "sap.m.Input" ||
					oFormContent[i].getMetadata()._sClassName === "sap.m.DatePicker") {
					if (oFormContent[i].getValue() == "" && oFormContent[i].getRequired() == true) {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"isman"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				} else if (oFormContent[i].getMetadata()._sClassName ===
					"sap.m.ComboBox") {
					if (oFormContent[i].getSelectedKey() == "" && oFormContent[i].getRequired() == true) {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"isman"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				}
			}
		},

		dateFormatter: function (oValue) {
			if (oValue !== null) {
				var date = oValue;
				var m = String(date).slice(4, 15).replace(/ /g, "/").slice(0, 3);
				var d = String(date).slice(4, 15).replace(/ /g, "/").slice(4, 6);
				var y = String(date).slice(4, 15).replace(/ /g, "/").slice(7, 15);
				switch (m) {
				case 'Jan':
					m = "01";
					break;
				case "Feb":
					m = "02";
					break;
				case "Mar":
					m = "03";
					break;
				case "Apr":
					m = "04";
					break;
				case "May":
					m = "05";
					break;
				case "Jun":
					m = "06";
					break;
				case 'Jul':
					m = "07";
					break;
				case "Aug":
					m = "08";
					break;
				case "Sep":
					m = "09";
					break;
				case "Oct":
					m = "10";
					break;
				case "Nov":
					m = "11";
					break;
				case "Dec":
					m = "12";
					break;
				default:
					break;
				}
				return y + m + d;
			}
		},

		onCountDate: function (oEvt) {
			if (oEvt.getSource().getDateValue() !== null) {
				oEvt.getSource().setValueState("None");
				if (this.getOwnerComponent().getModel("inventoryModel").getProperty("/COUNTDATE") != "" && this.getOwnerComponent().getModel(
						"inventoryModel").getProperty("/WHNUMBER") != "" && this.getOwnerComponent().getModel(
						"inventoryModel").getProperty("/BIN") != "") {
					this.checkField();
				}
			}
		},

		_onFilters: function () {
			this._getDialog().open();
		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.sap.upl.PhysicalInventoryReport.fragments.filter", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},

		handleConfirm: function (oEvent) {
			debugger;
			var filters = [];
			var andFilter = [];
			if (oEvent.mParameters.filterCompoundKeys[1] !== undefined) {
				for (var i = 0; i < oEvent.mParameters.filterItems.length; i++) {
					if (oEvent.mParameters.filterItems[i].getKey() == "1") {
						filters.push(new sap.ui.model.Filter("DIFFERENCE", sap.ui.model.FilterOperator.GT, 0));
					} else {
						filters.push(new sap.ui.model.Filter("DIFFERENCE", sap.ui.model.FilterOperator.LT, 0));
					}
				}
			}

			if (filters.length > 0) {
				andFilter.push(new sap.ui.model.Filter(filters, false));
			}
			/*var aFilter = [];
			aFilter.push(new sap.ui.model.Filter(andFilter, true));*/
			if (andFilter.length > 0) {
				this.byId("idInventoryReport").getBinding("items").filter(filters);
			} else {
				this.byId("idInventoryReport").getBinding("items").filter([]);
			}
		}

	});

});