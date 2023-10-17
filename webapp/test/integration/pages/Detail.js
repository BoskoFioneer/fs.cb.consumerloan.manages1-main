/*eslint-disable valid-jsdoc */
sap.ui.define([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common",
	"sap/ui/core/Fragment",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/core/date/UniversalDate",
	"sap/ui/test/matchers/Properties"
], function(Opa5, Common, Fragment, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Press, EnterText, UniversalDate,
	Properties) {
	"use strict";

	var sViewName = "Account";

	Opa5.createPageObjects({
		onTheDetailPage: {
			baseClass: Common,

			actions: jQuery.extend({
				iPressAccountHolderQuickView: function() {
					return this.waitFor({
						id: "accountHolderLink",
						viewName: "ObjectHeaderContent",
						actions: new Press(),
						success: function(oLink) {
							Opa5.assert.ok(true, "Click on account holder name");
						},
						errorMessage: "Did not find the quicklink for Account Holder"
					});
				},

				iPressContractManagerQuickView: function() {
					return this.waitFor({
						id: "contractManagerLink",
						viewName: "ObjectHeaderContent",
						actions: new Press(),
						success: function(oLink) {
							Opa5.assert.ok(true, "Click on contract manager name");
						},
						errorMessage: "Did not find the quicklink for Contract Manager"
					});
				},

				iPressMandateQuickView: function(Item) {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							var oItem = oTable.getItems(Item);
							var oLine = oItem[Item];
							var oMandate = oLine.getCells()[5];
							oMandate.firePress();
							Opa5.assert.ok(true, "click on Direct Debit Mandate");
						},
						errorMessage: "Did not find the quicklink for Mandate"
					});
				},

				iPressMoreDetailsPopover: function(Item) {
					return this.waitFor({
						id: "tableReceivables",
						viewName: "Receivables",
						success: function(oTable) {
							var oItem = oTable.getItems(Item);
							var oLine = oItem[Item];
							var oMoreDetails = oLine.getCells()[0];
							oMoreDetails.fireTitlePress();
							Opa5.assert.ok(true, "click on Receivables More Details");
						},
						errorMessage: "Did not find the More Details Button for Receivables"
					});
				},

				iPressAnchor: function(sI18nKey) {
					var sAnchorText = this.getI18nText(sI18nKey);
					return this.waitFor({
						controlType: "sap.m.Button",
						timeout: 50,
						matchers: new Properties({
							text: sAnchorText
						}),
						actions: new Press(),
						success: function(oButton) {
							Opa5.assert.ok(true, "click on anchor " + sAnchorText);
						},
						errorMessage: "Did not find the anchor"
					});
				},

				iPressMoreDetailsQuickView: function() {
					return this.waitFor({
						id: "oReceivablesTblMoreDetailsButton",
						viewName: "ReceivablesDisplay",
						check: function(object) {
								if (object.getText()) {
									return true;
								} else {
									return false;
								}
							}
							// actions: new Press(),
							// success: function(oButton) {
							// 	Opa5.assert.ok(true, "Click on More Details");
							// },
							// errorMessage: "Did not find the Quicklink for More Details"
					});
				}
			}),
			assertions: jQuery.extend({

				iShouldSeeTheHeader: function(sHeader) {
					return this.waitFor({
						controlType: "sap.m.Header",
						matchers: new Properties({
							text: sHeader
						}),
						success: function(aText) {
							Opa5.assert.ok(true, "Title " + sHeader + " is shown");
						},
						errorMessage: "No header found"
					});
				},

				iShouldSeeTheLabel: function(sViewId, sFragmentId, sLabel) {
					var sId = Fragment.createId(sViewId, sFragmentId);
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						check: function(object) {
							if (object.getText() === sLabel) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, sLabel + " is loaded");
						},
						errorMessage: sLabel + " is not loaded"
					});
				},
				iShouldSeeTheEmail: function(sEmail) {
					return this.waitFor({
						controlType: "sap.m.Link",
						matchers: new Properties({
							text: sEmail
						}),
						success: function(aLink) {
							Opa5.assert.ok(true, "Email " + sEmail + " is shown");
						},
						errorMessage: "No link with email found"
					});
				},
				iShouldSeeTheContent: function(sViewId, sFragmentId) {
					var sId = Fragment.createId(sViewId, sFragmentId);
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						check: function(object) {
							if (object.getText()) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Content is available");
						},
						errorMessage: "Content is not available"
					});
				},
				iShouldSeeObjectNumberContent: function(sViewId, sFragmentId) {
					var sId = Fragment.createId(sViewId, sFragmentId);
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						check: function(object) {
							if (object.getNumber()) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Object Number Content is available");
						},
						errorMessage: "Object Number Content is not available"
					});
				},

				iShouldSeeTheTable: function(sId, sView) {
					return this.waitFor({
						id: sId,
						viewName: sView,
						matchers: function(oTable) {
							return oTable.getColCount();
						},
						success: function() {
							Opa5.assert.ok(true, "Table Loaded with initial columns");
						},
						errorMessage: "Table has no visible columns"
					});
				},
				iShouldSeeTableOutput: function(sId, sView, sTable) {
					return this.waitFor({
						id: sId,
						viewName: sView,
						matchers: function(oTable) {
							return oTable.getBinding("items").getLength() > 0;
						},
						success: function() {
							Opa5.assert.ok(true, sTable + " table has entries");
						},
						errorMessage: sTable + " no entries found"
					});
				},

				iShouldSeeTheFragmentLabel: function(sView, sViewId, sFragmentId, sFragmentLabel) {
					var sId = Fragment.createId(sViewId, sFragmentId);
					return this.waitFor({
						id: sId,
						viewName: sView,
						check: function(object) {
							if (object.getText() === sFragmentLabel) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, sFragmentLabel + " is loaded");
						},
						errorMessage: sFragmentLabel + " is not loaded"
					});
				},
				iShouldSeeTheFragmentContent: function(sView, sViewId, sFragmentId) {
					var sId = Fragment.createId(sViewId, sFragmentId);
					return this.waitFor({
						id: sId,
						viewName: sView,
						check: function(object) {
							if (object.getText()) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Content is available");
						},
						errorMessage: "Content is not available"
					});
				},
				iShouldTheCheckboxStatus: function(sView, sViewId, sFragmentId) {
					var sId = Fragment.createId(sViewId, sFragmentId);
					return this.waitFor({
						id: sId,
						viewName: sView,
						check: function(object) {
							if (object.getSelected()) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Checkbox is checked");
						},
						errorMessage: "Checkbox is unchecked"
					});
				},
				iShouldSeeTheQuickviewContent: function(sContent) {
					return this.waitFor({
						controlType: "sap.m.Text",
						matchers: new Properties({
							text: sContent
						}),
						success: function(aText) {
							Opa5.assert.ok(true, sContent + " is shown");
						},
						errorMessage: "No Effective Capital Amount found"
					});
				},

				iShouldSeeTheAccountNumber: function(sAccountNumber) {
					var sId = Fragment.createId("fragmentObjectHeaderTitle", "ObjectPageHeader");
					var sObjectTitle = "";
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						check: function(object) {
							sObjectTitle = object.getObjectTitle();
							if (sObjectTitle === sAccountNumber) {
								return true;
							} else {
								return false;
							}
						},
						success: function(object) {
							Opa5.assert.ok(true, "The account number was shown");
						},
						errorMessage: "No account number found"
					});
				},

				iShouldSeeCFBlock: function(sMode) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageSubSection",
						matchers: new Properties({
							id: new RegExp("conditionFixingAgreementSubSection"),
							mode: sMode
						}),
						success: function(oSubSection) {
							Opa5.assert.ok(true, " Block is " + oSubSection[0].getMode());
						},
						errorMessage: "No Block found with mode " + sMode
					});
				},

				iExpandCollapseCFBlock: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new Properties({
							id: new RegExp("conditionFixingAgreementSubSection")
						}),
						success: function(oSeeMoreButton) {
							Opa5.assert.ok(true, "see More/see Less Button pressed");
						},
						actions: new Press(),
						errorMessage: "Did not find the see More/see Less Button"
					});
				},
				iShouldSeeIPBlock: function(sMode) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageSubSection",
						matchers: new Properties({
							id: new RegExp("inpaymentAgreementSubSection"),
							mode: sMode
						}),
						success: function(oSubSection) {
							Opa5.assert.ok(true, " Block is " + oSubSection[0].getMode());
						},
						errorMessage: "No Block found with mode " + sMode
					});
				},

				iShouldSeeTheTitle: function(sTitle) {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new Properties({
							text: sTitle
						}),
						success: function(aText) {
							Opa5.assert.ok(true, "Title " + sTitle + " is shown");
						},
						errorMessage: "No title found"
					});
				},

				iExpandCollapseIPBlock: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new Properties({
							id: new RegExp("inpaymentAgreementSubSection")
						}),
						success: function(oSeeMoreButton) {
							Opa5.assert.ok(true, "see More/see Less Button pressed");
						},
						actions: new Press(),
						errorMessage: "Did not find the see More/see Less Button"
					});
				},

				/**
				 * Press Button that is placed on a view
				 * @public
				 * @param {string} [sButtonId] The Id of the button
				 * @param {string} [sView] The Name of the view 
				 * @returns {string} Success or Error Message
				 */
				iPressButton: function(sButtonId, sView) {
					return this.waitFor({
						id: sButtonId,
						viewName: sView,
						actions: new Press(),
						success: function(oButton) {
							Opa5.assert.ok(true, "button " + sButtonId + " pressed");
						},
						errorMessage: "Did not find button with id: " + sButtonId
					});
				},
				
				iClickTheLink: function(sLink) {
					return this.waitFor({
						id: new RegExp(sLink),
						visible: true,
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "Link " + sLink);
						},
						errorMessage: "Did not find button with id: " + sLink
					});
				},
				
				/**
				 * Press Button that is placed on a dialog
				 * @public
				 * @param {string} [sButtonId] The Id of the button
				 * @returns {string} Success or Error Message
				 */
				iPressDialogButton: function(sButtonId) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new Properties({
							id: new RegExp(sButtonId),
							enabled: true
						}),
						actions: new Press(),
						success: function(oButton) {
							Opa5.assert.ok(true, "button " + sButtonId + " pressed");
						},
						errorMessage: "Did not find button with id: " + sButtonId
					});
				}

			})
		}

	});

});