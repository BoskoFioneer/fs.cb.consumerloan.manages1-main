/*eslint-disable valid-jsdoc */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/test/matchers/Properties",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/Locale",
	"sap/ui/test/actions/Press"
], function(Opa5, ResourceModel, Properties, DateFormat, NumberFormat, Locale, Press) {
	"use strict";

	function getFrameUrl(sHash, sUrlParameters) {
		var sUrl = jQuery.sap.getResourcePath("fs/cb/consumerloan/manages1/app", ".html");
		// var sUrl = jQuery.sap.getResourcePath("fs/cb/consumerloan/manages1/app",".html#ConsumerLoans-manage&/Account(sap-iapp-state=3340LMV6NZ7U0UGDDY6UJN9W9C1PFESRH00CPPLQ,BkAcctInternalID=9D503919F9841ED5B4968CDCD4B1A21C)");
		sHash = sHash || "";
		sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

		if (sHash) {
			sHash = "#ConsumerLoans-manage&/" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
		} else {
			sHash = "#ConsumerLoans-manage";
		}

		return sUrl + sUrlParameters + sHash;
		// return sUrl;
	}

	function getCrossAppTestUrl(sInHash, sInUrlParameter) {

		var sUrl = jQuery.sap.getResourcePath("fs/cb/consumerloan/manages1/app", ".html");
		var sUrlParameters = sInUrlParameter ? "?" + sInUrlParameter : "";

		var sHash = "#CrossAppNavigation-test";
		if (sInHash) {
			sHash = "#CrossAppNavigation-test&/" + (sInHash.indexOf("/") === 0 ? sInHash.substring(1) : sInHash);
		}

		return sUrl + sUrlParameters + sHash;
	}

	return Opa5.extend("fs.cb.consumerloan.manages1.test.integration.pages.Common", {

		iStartTheApp: function(oOptions) {
			oOptions = oOptions || {};
			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, "serverDelay=10"));
		},

		iStartTheAppWithDelay: function(sHash, iDelay) {
			this.iStartMyAppInAFrame(getFrameUrl(sHash, "serverDelay=" + iDelay));
		},

		iLookAtTheScreen: function() {
			return this;
		},

		iStartMyAppOnADesktopToTestErrorHandler: function(sParam) {
			this.iStartMyAppInAFrame(getFrameUrl("", sParam));
		},

		iStartCrossAppTestApp: function(oInOptions) {
			var sUrlParameters;
			var oOptions = oInOptions || {};

			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			var iDelay = oOptions.delay || 50;

			sUrlParameters = "serverDelay=" + iDelay;

			this.iStartMyAppInAFrame(getCrossAppTestUrl(oOptions.hash, sUrlParameters));
		},

		getI18nText: function(sI18nKey) {
			var oResourceModel = new ResourceModel({
				bundleUrl: jQuery.sap.getModulePath("fs.cb.consumerloan.manages1", "/i18n/i18n.properties")
			});
			return oResourceModel.getResourceBundle().getText(sI18nKey);
		},

		getDateFormatter: function() {
			return DateFormat.getDateInstance({
				style: "medium"
			});
		},

		createAWaitForAnEntitySet: function(oOptions) {
			return {
				success: function() {
					var bMockServerAvailable = false,
						aEntitySet;

					this.getMockServer().then(function(oMockServer) {
						aEntitySet = oMockServer.getEntitySetData(oOptions.entitySet);
						bMockServerAvailable = true;
					});

					return this.waitFor({
						check: function() {
							return bMockServerAvailable;
						},
						success: function() {
							oOptions.success.call(this, aEntitySet);
						}
					});
				}
			};
		},

		getMockServer: function() {
			return new Promise(function(success) {
				Opa5.getWindow().sap.ui.require(["fs/cb/consumerloan/manages1/localService//mockserver"], function(
					mockserver) {
					success(mockserver.getMockServer());
				});
			});
		},

		theUnitNumbersShouldHaveTwoDecimals: function(sControlType, sViewName, sSuccessMsg, sErrMsg) {
			var rTwoDecimalPlaces = /^-?\d+\.\d{2}$/;

			return this.waitFor({
				controlType: sControlType,
				viewName: sViewName,
				success: function(aNumberControls) {
					Opa5.assert.ok(aNumberControls.every(function(oNumberControl) {
							return rTwoDecimalPlaces.test(oNumberControl.getNumber());
						}),
						sSuccessMsg);
				},
				errorMessage: sErrMsg
			});
		},

		getAmountFormatter: function() {
			return NumberFormat.getCurrencyInstance({
				showMeasure: false
			});
		},
		/**
		 * Checks if the given Texts are written in the given UI Elements
		 * Parameters:	aData	- Array IDs combined with texts
		 *
		 * Pattern:		[ 	["ID1", "VALUE1", "TYPE1"],
		 *					["ID2", "VALUE2", "TYPE2"],
		 *					["ID3", "VALUE3", "TYPE3"]
		 * 				]
		 */

		iSeeCorrectValues: function(aData) {
			for (var k = 0; k < aData.length; k++) {
				var myId = aData[k][0];
				var myValue = aData[k][1];
				var type = aData[k][2];
				var property = aData[k][3];

				this.iSeeCorrectValue(myId, myValue, type, property);
			}
			return this;
		},

		/**
		 * Checks if the given Text is shown in the given UI Element
		 * @param {string} [id] Element ID 
		 * @param {string} [value] The value to be checked
		 * @param {string} [type] The type of Element
		 * @param {string} [property] : Value, Text, Title
		 * @returns {string} Success or Error Message 
		 */
		iSeeCorrectValue: function(id, value, type, property) {
			var val = "";
			var controlType;
			if (typeof type === "undefined") {
				controlType = "sap.ui.core.Control";
			} else {
				controlType = type;
			}

			this.waitFor({
				controlType: controlType,
				check: function(aElements) {
					var regExp = new RegExp("(--){1,}" + id + "(?=-|$){0,1}");
					var bFound = false;
					for (var i = 0; i < aElements.length; i++) {
						if (regExp.test(aElements[i].getId()) === true) {
							val = "";
							if (property === "Text" && typeof(aElements[i].getSelectedItem) !== "undefined") {
								val = aElements[i].getSelectedItem().getText();
							} else if (property === "Value" && typeof(aElements[i].getValue) !== "undefined") {
								val = aElements[i].getValue();
							} else if (property === "Text" && typeof(aElements[i].getText) !== "undefined") {
								val = aElements[i].getText();
							} else if (property === "Title" && typeof(aElements[i].getTitle) !== "undefined") {
								val = aElements[i].getTitle();
							} else if (property === "Number" && typeof(aElements[i].getNumber) !== "undefined") {
								val = aElements[i].getNumber();
							} else if (property === "Boolean" && typeof(aElements[i].getSelected) !== "undefined") {
								val = aElements[i].getSelected();
							} else if (property === "selectedKey" && typeof(aElements[i].getSelectedKey) !== "undefined") {
								val = aElements[i].getSelectedKey();
							} else if (property === "Icon" && typeof(aElements[i].getTooltip) !== "undefined") {
								val = aElements[i].getTooltip();
							}
							if (String(val) === value) {
								bFound = true;
								break;
							}
						}
					}
					if (!bFound) {
						return false;
						//		ok(bFound, id + " is incorrect (" + val + " !== " + value + ")");
					} else {
						return true;
						//		ok(String(val) === value, id + " is correct (" + val + " === " + value + ")");
					}
				},
				success: function(aElements) {
					ok(String(val) === value, id + " is correct (" + val + " === " + value + ")");
				},
				errorMessage: id + " is incorrect (" + val + " !== " + value + ")",
				timeout: 30,
				pollingInterval: 50
			});
			return this;
		},

		/**
		 * Checks if the given Texts are not shown on the UI
		 * @public
		 * @param {object} [aData] Array IDs combined with texts
		 * Pattern:		[ 	["ID1", "VALUE1", "TYPE1"],
		 *					["ID2", "VALUE2", "TYPE2"],
		 *					["ID3", "VALUE3", "TYPE3"]
		 * 				]
		 * @returns {string} Success or Error Message 
		 */
		iDoNotSeeValues: function(aData) {
			for (var k = 0; k < aData.length; k++) {
				var myId = aData[k][0];
				var myValue = aData[k][1];
				var type = aData[k][2];
				var property = aData[k][3];

				this.iDoNotSeeValue(myId, myValue, type, property);
			}
			return this;
		},

		/**
		 * Checks if the given Text is not shown on the UI
		 * @public
		 * @param {string} [id] The Id of the control
		 * @param {string} [value] The expected value 
		 * @param {string} [type] The type of Element
		 * @param {string} [property] Value, Text, Title
		 * @returns {string} Success or Error Message
		 */
		iDoNotSeeValue: function(id, value, type, property) {
			var val = "";
			var controlType;
			if (typeof type === "undefined") {
				controlType = "sap.ui.core.Control";
			} else {
				controlType = type;
			}

			this.waitFor({
				controlType: controlType,
				check: function(aElements) {
					var regExp = new RegExp("(--){1,}" + id + "(?=-|$){0,1}");
					var bFound = false;
					for (var i = 0; i < aElements.length; i++) {
						if (regExp.test(aElements[i].getId()) === true) {
							val = "";
							if (property === "Text" && typeof(aElements[i].getSelectedItem) !== "undefined") {
								val = aElements[i].getSelectedItem().getText();
							} else if (property === "Value" && typeof(aElements[i].getValue) !== "undefined") {
								val = aElements[i].getValue();
							} else if (property === "Text" && typeof(aElements[i].getText) !== "undefined") {
								val = aElements[i].getText();
							} else if (property === "Title" && typeof(aElements[i].getTitle) !== "undefined") {
								val = aElements[i].getTitle();
							}
							if (String(val) === value) {
								bFound = true;
								break;
							}
						}
					}
					if (bFound) {
						return false;
						//ok(!bFound, "Control with id " + id + " found (" + val + " === " + value + ")");
					} else {
						return true;
						//ok(true, "Control with id " + id + " and value " + value + " not found");
					}
				},
				success: function(aElements) {
					ok(true, "Control with id " + id + " and value " + value + " not found");
				},
				errorMessage: "Control with id " + id + " found (" + val + " === " + value + ")",
				timeout: 30,
				pollingInterval: 50
			});
			return this;
		},

		/**
		 * Select in sap.m.Select via Key
		 * @public
		 * @param {string} [sSelectId] The Id of the select field
		 * @param {string} [sViewName] The view of the select field
		 * @param {string} [sSelectedKey] The Id of the select field
		 * @returns {string} Success or Error Message
		 */
		iSelectBySelectionKey: function(sSelectId, sViewName, sSelectedKey) {
			return this.waitFor({
				controlType: "sap.m.Select",
				matchers: new Properties({
					id: new RegExp(sSelectId)
				}),
				check: function(aSelect) {
					var oSelect = aSelect[0];
					if (!oSelect.getItemByKey(sSelectedKey)) {
						return false;
					} else {
						return true;
					}
				},
				//actions: new Press(),
				success: function(aSelect) {
					var oSelect = aSelect[0];
					Opa5.assert.ok(true, sSelectedKey + " found");
					var oItem = oSelect.getItemByKey(sSelectedKey);
					ok(oItem, "Item with sSelectedKey " + sSelectedKey + " found");
					oSelect.setSelectedItem(oItem).fireChange({
						"selectedItem": oItem
					});
				},
				errorMessage: "Did not find select with id: " + sSelectId,
				timeout: 30,
				pollingInterval: 500
			});
		},

		iSeeCorrectValueState: function(id, valuestate, type) {
			var controlType;
			if (typeof type === "undefined") {
				controlType = "sap.ui.core.Control";
			} else {
				controlType = type;
			}
			this.waitFor({
				controlType: controlType,
				id: new RegExp(id),
				check: function(aElements) {
					var regExp = new RegExp("(--){0,1}" + id + "(?=-|$){0,1}");
					var bFound = false;
					for (var i = 0; i < aElements.length; i++) {
						if (regExp.test(aElements[i].getId()) === true) {
							var val = "";
							val = aElements[i].getValueState();
							if (String(val) === valuestate) {
								bFound = true;
								break;
							}
						}
					}
					return bFound;
				},
				success: function(aElements) {
					var regExp = new RegExp("(--){1,}" + id + "(?=-|$){0,1}");
					var bFound = false;
					for (var i = 0; i < aElements.length; i++) {
						if (regExp.test(aElements[i].getId()) === true) {
							var val = "";
							val = aElements[i].getValueState();
							if (String(val) === valuestate) {
								bFound = true;
								break;
							}
						}
					}
					if (bFound) {
						ok(bFound, "Control with id " + id + " found and Valuestate === " + valuestate);
					} else {
						ok(true, "Control with id " + id + " found and Valuestate not equal " + valuestate);
					}
				},
				timeout: 30,
				pollingInterval: 50
			});
			return this;
		},

		iChooseDateRangeSelect: function(sId, sView) {
			return this.waitFor({
				id: sId,
				viewName: sView,
				actions: function(oSelect) {
					oSelect.$().tap();
				}
			});
		},

		iSelectInSelectOption: function(sId, sView, sOption) {
			this.waitFor({
				id: sId,
				viewName: sView,
				success: function(oSelect) {
					if (oSelect) {
						var oSelectList = oSelect.getSelectableItems();
						Opa5.assert.ok(true, "The select options is loaded");
						var oItem = oSelectList.filter(function(oItems) {
							return oItems.getProperty("key") === sOption;
						});
						if (oItem && oItem[0]) {
							oItem[0].$().tap();
							Opa5.assert.ok(true, "Select option " + sOption + " triggered");
						} else {
							Opa5.assert.ok(false, "Did not find the select option " + sOption);
						}
					} else {
						Opa5.assert.ok(false, "Did not find the select options");
					}
				},
				errorMessage: "Did not find the select options"
			});
		},

		iEnterDateRangeFilter: function(sId, sView, sDateValue, sSecondDateValue) {
			return this.waitFor({
				id: sId,
				viewName: sView,
				actions: function(oDateRangeFilter) {
					oDateRangeFilter.setProperty("dateValue", sDateValue.getJSDate());
					oDateRangeFilter.setProperty("secondDateValue", sSecondDateValue.getJSDate());
					oDateRangeFilter._$input.focus();
				}
			});
		},

		iShouldSeeSelectedDateRangeValue: function(sId, sView, sOption, sEnabled) {
			return this.waitFor({
				id: sId,
				viewName: sView,
				check: function(oDateRangeSelection) {
					if (oDateRangeSelection.getEditable() === sEnabled) {
						Opa5.assert.ok(true, "The date range selection enabled property is " + sEnabled);
					} else {
						return false;
					}
					if (oDateRangeSelection.getDateValue()) {
						Opa5.assert.ok(true, "The date range selection start date is " + oDateRangeSelection.getDateValue());
					} else {
						return false;
					}
					if (oDateRangeSelection.getSecondDateValue()) {
						Opa5.assert.ok(true, "The date range selection end date is " + oDateRangeSelection.getSecondDateValue());
					} else {
						return false;
					}
					return true;
				},
				success: function(oDateRange) {
					Opa5.assert.ok(true, "The date range is rendered correctly in " + sView + " view");
				},
				errorMessage: "The date range contains invalid date in " + sView + " view"
			});
		},

		iShouldSeeTheSelectedValue: function(sId, sView, sOption) {
			return this.waitFor({
				id: sId,
				viewName: sView,
				check: function(oSelect) {
					if (oSelect.getSelectedKey() === sOption) {
						return true;
					} else {
						return false;
					}
				},
				success: function() {
					Opa5.assert.ok(true, "The date range select value is " + sOption);
				},
				errorMessage: "The date range select has incorrect value in " + sView + " view"
			});
		},

		iTriggerDateRangeSelection: function(sId, sView) {
			return this.waitFor({
				id: sId,
				viewName: sView,
				actions: function(oDateRangeFilter) {
					var e = $.Event("sapenter");
					e.keyCode = jQuery.sap.KeyCodes.ENTER;
					// Input base sapenter method
					oDateRangeFilter.onsapenter(e);
				}
			});
		},

		iShouldSeeTheText: function(sText) {
			return this.waitFor({
				controlType: "sap.m.Text",
				matchers: new Properties({
					text: sText
				}),
				success: function(aText) {
					Opa5.assert.ok(true, "Text " + sText + " is shown");
				},
				errorMessage: "No text found"
			});
		},

		iSeeAppTitle: function(sText) {
			return this.waitFor({
				controlType: "sap.ushell.ui.shell.ShellAppTitle",
				matchers: new Properties({
					id: new RegExp("shellAppTitle"),
					text: sText
				}),
				success: function(aTitles) {
					Opa5.assert.ok(true, "app title with text " + sText + " found");

				},
				errorMessage: "Did not find app title with text " + sText
			});

		},

		iSelectListItemInViewSettingsDialog: function(sListItemTitle) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.StandardListItem",
				matchers: new Opa5.matchers.PropertyStrictEquals({
					name: "title",
					value: sListItemTitle
				}),
				actions: new Press(),
				errorMessage: "Did not find list item with title " + sListItemTitle + " in View Settings Dialog."
			});
		},

		iPressTheBackButton: function() {
			return this.waitFor({
				id: "mainPage",
				viewName: "MainPage",
				success: function(oPage) {
					oPage.$("navButton").trigger("tap");
				},
				errorMessage: "Did not find the nav button on object page"
			});
		},
		/**
		 * Press Button that is placed on a view
		 * @public
		 * @param {string} [sButtonId] The Id of the button
		 * @param {string} [sView] The Name of the view 
		 * @returns {string} Success or Error Message
		 */
		iPressBackButton: function(sButtonId) {
			return this.waitFor({
				id: sButtonId,
				actions: new Press(),
				success: function(oButton) {
					Opa5.assert.ok(true, "button " + sButtonId + " pressed");
				},
				errorMessage: "Did not find button with id: " + sButtonId
			});
		}
	});

});