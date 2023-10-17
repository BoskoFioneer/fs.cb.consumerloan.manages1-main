/*global location*/
sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fs/cb/consumerloan/manages1/model/genericNavigationHandler",
	"sap/ui/core/format/NumberFormat",
	"fs/cb/consumerloan/manages1/model/ReferenceAccountModel",
	"sap/base/Log"
], function(BaseController, JSONModel, genericNavigationHandler, NumberFormat, ReferenceAccountModel, Log) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.MainPage", {

		genericNavigationHandler: genericNavigationHandler,
		/* ================================
		=========================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			// 			var iOriginalBusyDelay;

			var oViewModel = new JSONModel({
				isObjectPage: false,
				busy: false,
				delay: 0
			});
			this.setModel(oViewModel, "mainview");
			this._initRouting();

			var oModel = this.getOwnerComponent().getModel();

			// For reference accounts internal JSON Model to be used
			this._refAccountModel = new ReferenceAccountModel(oModel, this.getResourceBundle());
			this.getView().setModel(this._refAccountModel, "refaccounts");
		},

		_initRouting: function() {

			var oViewModel = this.getModel("mainview");

			// Route: start
			// Initial Page displayed -> remove not required elements from UI 
			this.getRouter().getRoute("start").attachPatternMatched(function() {

				Log.info("Route 'start' matched", this.getOwnerComponent().getComponentName());

				this._unbindView();
				sap.ui.getCore().getMessageManager().removeAllMessages();

				oViewModel.setProperty("/busy", false);
				// because the start page is a message page, isObjectPage is set to false.
				oViewModel.setProperty("/isObjectPage", false);

				// when starting fresh, e.g. by deleting the hash of a purchase order deep link, 
				// the input is set back to empty.
				this._setSearchValue("");
				this._setFocusOnSearchField();

			}, this);

			// Route: displayAccount
			// Bind view to the respective object and enable the required UI elements
			this.getRouter().getRoute("displayAccountWithAppState").attachPatternMatched(function(oEvent) {

				Log.info("Route 'displayAccountWithAppState' matched", this.getOwnerComponent().getComponentName());
				this._unbindView();
				sap.ui.getCore().getMessageManager().removeAllMessages();
				var that = this;
				var mParameters = oEvent.getParameter("arguments");
				var sContainerId = mParameters.iAppState;
				var sBkAcctInternalID = mParameters.sBkAcctInternalID;

				genericNavigationHandler.getInnerAppState(sContainerId).then(function(oContainer) {

					// because the object page to be displayed, isObjectPage is set to true
					oViewModel.setProperty("/isObjectPage", true);
					oViewModel.setProperty("/busy", false);

					var oItem = oContainer.getItemValue("params"); // innera-app state
					if (!oItem && oContainer.getItemValue("appStateData")) { // cross-app state
						oItem = JSON.parse(oContainer.getItemValue("appStateData"));
					}

					if (oItem && oItem.consumerAccountID && oItem.consumerAccountIDSchemeID && oItem.consumerAccountBusinessSystemID) {
						// trigger oData
						that._triggerBinding(oItem, sBkAcctInternalID);

					} else {
						that.getOwnerComponent().navToAccountByInternalID(sBkAcctInternalID, true);
					}
				}, function(oError) {
					Log.error("error on navigation to account");
				});

			}, this);

			// this.getRouter().getTargets().getTarget("displayAccount").attachDisplay(function(oEvent) {
			// 	jQuery.sap.log.info("Target 'displayAccount' to be displayd", this.getOwnerComponent().getComponentName());
			// 	oViewModel.setProperty("/busy", false);
			// 	oViewModel.setProperty("/isObjectPage", true);

			// }, this);

			// Target: notFound
			// Not Found Message Page  displayed -> remove not required elements from UI
			this.getRouter().getTargets().getTarget("notFound").attachDisplay(function() {
				Log.info("Target 'notFound' to be displayd", this.getOwnerComponent().getComponentName());
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/isObjectPage", false);
			}, this);

			this.getRouter().getTargets().getTarget("error").attachDisplay(function() {
				Log.info("Target 'error' to be displayd", this.getOwnerComponent().getComponentName());
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/isObjectPage", false);
			}, this);

		},

		_unbindView: function() {
			this.getView().unbindElement();
		},

		/**
	
		// 	/**
		// //  * trigger binding of ConsumerLoan, AccountHolder and ContractManager
		// //  * @param {oData} : contains the IDs of ConsumerLoan, AccountHolder, ContractManager and BusinessSystem
		// //  */

		_triggerBinding: function(oData, BkAccContrId) {

			var oEventBus = this.getOwnerComponent().getEventBus();

			if (oData) {

				var sPath = "/ConsumerLoans(BkAcctContrID='" + oData.consumerAccountID +
					"',BkAcctContrIDSchmID='" + oData.consumerAccountIDSchemeID + "',BkAcctContrIDSchmAgcyID='" + oData.consumerAccountIDSchemeAgencyID +
					"',BusinessSystemID='" + oData.consumerAccountBusinessSystemID + "')";

				this._bindView(sPath, oData);

				oEventBus.publish("fs.cb.consumerloan.manages1", "consumerBindingUpdated", {
					consumerAccountBusinessSystemID: oData.consumerAccountBusinessSystemID,
					AcctHldrPartyInternalID: oData.AcctHldrPartyInternalID,
					OplBkContrMgmtUnitID: oData.OplBkContrMgmtUnitID,
					consumerAccountID: oData.consumerAccountID,
					consumerAccountIDSchemeID: oData.consumerAccountIDSchemeID,
					consumerAccountIDSchemeAgencyID: oData.consumerAccountIDSchemeAgencyID,
					BkAccContrId: oData.BkAcctInternalID

				});

			}

		},

		// // 	/**
		// //  * Binds the view to the object path.
		// //  * @function
		// //  * @param {string} sObjectPath path to the object to be bound
		// //  * @private
		// //  */
		_bindView: function(sObjectPath, sData) {

			var oViewModel = this.getModel("mainview"),
				oDataModel = this.getModel(),
				that = this,
				oMainModel = this.getOwnerComponent().getModel("mainModel"),
				PymntTrnsctnInstrctns;

			var sObjectPathEncoded = encodeURI(sObjectPath);

			this.getView().bindElement({
				path: sObjectPathEncoded,
				parameters: {
					expand: "PymntTrnsctnInstrctns"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// 			// Busy indicator on view should only be set if metadata is loaded,
							// 			// otherwise there may be two busy indications next to each other on the
							// 			// screen. This happens because route matched handler already calls '_bindView'
							// 			// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function(oData) {
						oViewModel.setProperty("/busy", false);
						if (!oData.getParameter("data")) {
							that.getRouter().getTargets().display("notFound");
						} else {
							PymntTrnsctnInstrctns = oData.getParameter("data").PymntTrnsctnInstrctns;
							jQuery.each(PymntTrnsctnInstrctns, function(iIndex, oCountpty) {
								var oCountptyData = oCountpty.CounterPartyBankAccount;
								// Set Account Number as IBAN in case, only standard ID is maintained and neither of BkStandardID and ID is maintained
								if (oCountptyData.StandardID !== "" && oCountptyData.ID === "" && oCountptyData.BkStandardID === "") {
									oCountptyData.ID = oCountptyData.StandardID;
								}
							});
							if (sData.consumerAccountID && sData.consumerAccountIDSchemeID && sData.consumerAccountIDSchemeAgencyID &&
								sData.consumerAccountBusinessSystemID && sData.AcctHldrPartyInternalID && sData.OplBkContrMgmtUnitID) {
								oMainModel.setProperty("/BkAccContrId", sData.BkAcctInternalID);
								oMainModel.setProperty("/AcctHldrPartyInternalID", sData.AcctHldrPartyInternalID);
								oMainModel.setProperty("/OplBkContrMgmtUnitID", sData.OplBkContrMgmtUnitID);
								oMainModel.setProperty("/consumerAccountBkAcctID", sData.consumerAccountBkAcctID);
								oMainModel.setProperty("/consumerAccountBusinessSystemID", sData.consumerAccountBusinessSystemID);
								oMainModel.setProperty("/consumerAccountID", sData.consumerAccountID);
								oMainModel.setProperty("/consumerAccountIDSchemeAgencyID", sData.consumerAccountIDSchemeAgencyID);
								oMainModel.setProperty("/consumerAccountIDSchemeID", sData.consumerAccountIDSchemeID);
								oMainModel.setProperty("/consumerAccountStandardID", sData.consumerAccountStandardID);
								oMainModel.setProperty("/BkAcctIntID", sData.BkAcctInternalID);
							}
						}
					}
				}
			});
		},

		/**
		 * Replace value in the search field
		 * @function
		 * @param {string} [sValue]	value to be placed
		 * @private
		 */
		_setSearchValue: function(sValue) {

			var oSearchView = this.getView().byId("searchView");

			if (oSearchView && oSearchView.getController()) {
				oSearchView.getController().setSearchFieldValue(sValue);
			}

		},

		/**
		 * Set focus on the search field
		 * @function
		 * @param {string} [sValue]	value to be placed
		 * @private
		 */
		_setFocusOnSearchField: function(sValue) {

			var oSearchView = this.getView().byId("searchView");

			if (oSearchView && oSearchView.getController()) {
				oSearchView.getController().setFocusOnSearchField();
			}

		},

		// /**
		//  * Event handler to element binding change event
		//  * check if binding context is set:
		//  *		yes -> replace text's for links and action
		//  *		no -> display not faund message page
		//  * @function
		//  * @private
		//  * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		//  *
		//  */
		_onBindingChange: function(oEvent) {
			var oMainModel = this.getOwnerComponent().getModel("mainModel");
			var oViewModel = this.getModel("mainview");
			oViewModel.setProperty("/busy", false);
			var oView = this.getView();
			var oObject,
				sObjectExternalId;

			// publish bindingUpdated event 
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.publish("fs.cb.consumerloan.manages1", "consumerRefAccBindingUpdated", {
				sPath: this.getView().getBindingContext().getPath()
			});

			if (oView.getBindingContext()) {
				oObject = oView.getBindingContext().getObject();
				sObjectExternalId = oObject.BkAcctIdfgElmnts.ID;
				this._setSearchValue(sObjectExternalId);
				// Update the MainModel in component
				oMainModel.setProperty("/BkAccContrId", oObject.BkAcctIdfgElmnts.IntID);
				oMainModel.setProperty("/AcctHldrPartyInternalID", oObject.AcctHldrPartyInternalID);
				oMainModel.setProperty("/OplBkContrMgmtUnitID", oObject.OplBkContrMgmtUnitID);
				oMainModel.setProperty("/consumerAccountBkAcctID", oObject.BkAcctIdfgElmnts.ID);
				oMainModel.setProperty("/consumerAccountBusinessSystemID", oObject.BusinessSystemID);
				oMainModel.setProperty("/consumerAccountID", oObject.BkAcctContrID);
				oMainModel.setProperty("/consumerAccountIDSchemeAgencyID", oObject.BkAcctContrIDSchmAgcyID);
				oMainModel.setProperty("/consumerAccountIDSchemeID", oObject.BkAcctContrIDSchmID);
				oMainModel.setProperty("/consumerAccountStandardID", oObject.BkAcctContrID);
				oMainModel.setProperty("/BkAcctIntID", oObject.BkAcctIdfgElmnts.IntID);
			} else {
				this.getRouter().getTargets().display("notFound");
			}
		}
	});
});