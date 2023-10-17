/*global location*/
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("test.integration.crossapp.controller.TestPage", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fs.cb.tdewd.create.fs.cb.tdewd.create.test.crossap.view.TestPage
		 */
		onInit: function() {
			this.sSemanticObject = "ConsumerLoans";
			this.sSemanticAction = "manage";
		},

		navToExternal: function(oParams, sAppStateKey) {
			this.oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			if (this.oCrossAppNavigator) {
				this.oCrossAppNavigator.toExternal({
					target: {
						semanticObject: this.sSemanticObject,
						action: this.sSemanticAction
					},
					params: oParams,
					appStateKey: sAppStateKey
				});
			}
		},
		navigateToAppWithoutParamaters: function(oEvent) {
			this.navToExternal();
		},
		navigateToAppUsingInternalId: function(oEvent) {
			var oParams = {
				BkAcctInternalID: "16A68B51D7301EE78DC88CDCD4B1A21C"
			};
			this.navToExternal(oParams);
		},
		navigateToAppUsingWrongInternalId: function(oEvent) {
			var oParams = {
				BkAcctInternalID: "9A000000F9841ED5B4968AAAA9A9A99A"
			};
			this.navToExternal(oParams);
		},
		navigateToAppUsingAppState: function(oEvent) {
			var oParams = {
				BkAcctInternalID: "9D503919F9841ED5B4968CDCD4B1A21C"
			};
			var initialContent = {
				AcctHldrPartyInternalID: "TD4",
				BkAcctInternalID: "16A68B51D7301EE78DC88CDCD4B1A21C",
				OplBkContrMgmtUnitID: "50002196",
				consumerAccountBkAcctID: "0010030023",
				consumerAccountBusinessSystemID: "F6D_100",
				consumerAccountID: "DE53904210810010030023",
				consumerAccountIDSchemeAgencyID: "310",
				consumerAccountIDSchemeID: "BAC.001",
				consumerAccountStandardID: "DE53904210810010030023"
			};
			var appComponent = this.getOwnerComponent(); // Current app UI5 component.
			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);
			// appState has same interface as PersonalizationContaier
			appState.setData(initialContent);
			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function() {
				that.navToExternal(oParams, appState.getKey());
			}); // immediate save
		},

		navigateToAppUsingWrongAppStateContent: function(oEvent) {
			var oParams = {
				BkAcctInternalID: "9D503919F9841ED5B4968CDCD4B1A21C"
			};
			var initialContent = {
				dummy1: "1111",
				dummy2: "2222"
			};
			var appComponent = this.getOwnerComponent(); // Current app UI5 component.
			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);
			// appState has same interface as PersonalizationContaier
			appState.setData(initialContent);
			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function() {
				that.navToExternal(oParams, appState.getKey());
			}); // immediate save
		},
		navigateToAppUsingWrongAppStateKey: function(oEvent) {
			var oParams = {
				BkAcctInternalID: "9D503919F9841ED5B4968CDCD4B1A21C"
			};
			var sAppStateKey = "111AAAA000J4COHZE89PJPS5OSEDGLPKQGIU1VM";
			this.navToExternal(oParams, sAppStateKey);
		},
		navigateToAppUsingWrongInternalIdAndAppState: function(oEvent) {
			var oParams = {
				BkAcctInternalID: "9A000000F9841ED5B4968AAAA9A9A99A"
			};
			var sAppStateKey = "111AAAA000J4COHZE89PJPS5OSEDGLPKQGIU1VM";
			this.navToExternal(oParams, sAppStateKey);
		},
		navigateToAppUsingAppStateWithoutInternalId: function(oEvent) {
			var initialContent = {
				AcctHldrPartyInternalID: "TD4",
				OplBkContrMgmtUnitID: "50000607",
				TimeDepositBkAcctID: "0010002379",
				TimeDepositBusinessSystemID: "F6D_100",
				TimeDepositID: "DE18900000010010002379",
				TimeDepositIDSchemeAgencyID: "310",
				TimeDepositIDSchemeID: "BAC.001",
				TimeDepositStandardID: "DE18900000010010002379"
			};
			var appComponent = this.getOwnerComponent(); // Current app UI5 component.
			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);
			// appState has same interface as PersonalizationContaier
			appState.setData(initialContent);
			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function() {
				that.navToExternal(null, appState.getKey());
			}); // immediate save
		}
	});
});