/*global location*/
sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"fs/cb/consumerloan/manages1/model/formatter",
	"fs/cb/consumerloan/manages1/model/genericNavigationHandler"
], function (BaseController, JSONModel, History, formatter, genericNavigationHandler) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.Account", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.subscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onBindingUpdate, this);

			// Listen on accountHolderBindingChanged event on app channel
			oEventBus.subscribe("fs.cb.consumerloan.manages1", "accountHolderBindingChanged", this.onHolderBindingChange, this);

		},

		onExit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.unsubscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onBindingUpdate, this);

		},

		onBindingUpdate: function (sChannelId, sEventId, oData) {

			if (sChannelId === "fs.cb.consumerloan.manages1" && sEventId === "consumerBindingUpdated") {
				// for each new account the section should be collapsed
				this.getView().byId("conditionFixingAgreementSubSection").setMode(sap.uxap.ObjectPageSubSectionMode.Collapsed);
				this.getView().byId("inpaymentAgreementSubSection").setMode(sap.uxap.ObjectPageSubSectionMode.Collapsed);
				this.getView().byId("TurnoverSubSection").setMode(sap.uxap.ObjectPageSubSectionMode.Collapsed);
				this.getView().byId("PaymentPlanSubSection").setMode(sap.uxap.ObjectPageSubSectionMode.Collapsed);

			}
		},

		/**
		 * Event handler on accountHolderBindingChanged event on app channel
		 * Set SubTitle on ObjectHeader Binding Changing
		 * @public
		 * @param {string} [sChannelId] The channel of the fired event: "fs.cb.consumerloan.manages1"
		 * @param {sEvent} [sEventId] The EventId of the fired event: "accountHolderBindingChanged"
		 * @param {object} [oData] Parameters
		 */
		onHolderBindingChange: function (sChannelId, sEventId, oData) {
			if (sChannelId === "fs.cb.consumerloan.manages1" && sEventId === "accountHolderBindingChanged") {
				var oLayout = this.getView().byId("accountLayout");
				var oHeaderTitle = oLayout ? oLayout.getHeaderTitle() : null;
				if (oData.sTitleName && oHeaderTitle) {
					oHeaderTitle.setObjectSubtitle(oData.sTitleName);
				}
			}
		},

		/* =========================================================== */
		/* Public methods                                              */
		/* =========================================================== */

		/**
		 * Called when open further button in object header pressed
		 * open account data in sapgui
		 * @public
		 * @param {sEvent} [oEvent] Event of Link
		 */
		onOpenFurther: function (oEvent) {
			var sSemanticObject = "BankAccountContract";
			var sAction = "displayMoreDetails";
			var oCtxt = oEvent.getSource().getBindingContext();
			var sID = oCtxt.getProperty("BkAcctIdfgElmnts/ID");
			sID = this.deleteStartingZeros(sID);
			var oParams = {
				BkCountryCode: oCtxt.getProperty("BkAcctIdfgElmnts/BkCountryCode"),
				BkRoutingID: oCtxt.getProperty("BkAcctIdfgElmnts/BkRoutingID"),
				ID: sID
			};
			this.navToExternal(sSemanticObject, sAction, oParams);
		},

		/**
		 * Called when manage loan payoff button in object header pressed
		 * open manage loan payoff
		 * @public
		 * @param {sEvent} [oEvent] Event of Link
		 */
		onManagePayoff: function (oEvent) {
			var sSemanticObject = "LoanPayoff";
			var sAction = "manage";
			var oCtxt = oEvent.getSource().getModel("mainModel");
			var oParams = {
				BkAcctInternalID: oCtxt.getData().BkAcctIntID
			};

			var initialContent = {
				AcctHldrPartyInternalID: oCtxt.getData().AcctHldrPartyInternalID,
				OplBkContrMgmtUnitID: oCtxt.getData().OplBkContrMgmtUnitID,
				consumerAccountBkAcctID: oCtxt.getData().consumerAccountBkAcctID,
				consumerAccountBusinessSystemID: oCtxt.getData().consumerAccountBusinessSystemID,
				consumerAccountID: oCtxt.getData().consumerAccountID,
				consumerAccountIDSchemeAgencyID: oCtxt.getData().consumerAccountIDSchemeAgencyID,
				consumerAccountIDSchemeID: oCtxt.getData().consumerAccountIDSchemeID,
				consumerAccountStandardID: oCtxt.getData().consumerAccountStandardID
			};

			var appComponent = this.getOwnerComponent(); // Current app UI5 component.

			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);

			appState.setData(initialContent);

			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function () {
				that.navToExternal(sSemanticObject, sAction, oParams, appState.getKey());
			});
		},

		onManageDisbursement: function (oEvent) {
			var sSemanticObject = "LoanDisbursement";
			var sAction = "manage";
			var oCtxt = oEvent.getSource().getModel("mainModel");
			var oParams = {
				LoanContractUUID: oCtxt.getData().BkAcctIntID
			};

			var initialContent = {
				BkAcctID: oCtxt.getData().consumerAccountBkAcctID
			};

			var appComponent = this.getOwnerComponent(); // Current app UI5 component.

			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);

			appState.setData(initialContent);

			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function () {
				that.navToExternal(sSemanticObject, sAction, oParams, appState.getKey());
			});
		}
	});
});