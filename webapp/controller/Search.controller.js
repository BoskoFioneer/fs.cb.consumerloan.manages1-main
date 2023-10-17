sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function (BaseController, JSONModel, Log) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.Search", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function () {
			this._initSearchSettings();

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for innerControlsCreated event
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 */
		onInnerControlsCreated: function (oEvent) {

			// Busy indicator of the App to be removed first if the smart field inner controls are created
			var oAppView = this.getView().getModel("appView");
			oAppView.setProperty("/busyOnSearchComponent", false);
			this.getOwnerComponent().setSearchComponent(oEvent.getSource());

			this.setFocusOnSearchField();
		},

		/**
		 * Event handler for accountSelected event on search component 
		 * after user selected account from the suggestion list or in value help dialog
		 * Extract required data and navigate to the details
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 */
		onAccountSelected: function (oEvent) {

			var oAccount = oEvent.getParameter("oAccountData");
			// if entity found -> extract details and process further
			// error handlings is done by navToAccountByInternalID
			var sBkAcctInternalID = oAccount.BankAccountInternalID; // extract key from the entity path

			var fnCallback = function () {
				this.getOwnerComponent().navToAccountByInternalID(sBkAcctInternalID);
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));

		},

		/**
		 * Event handler for searchError event on search component 
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 */
		onSearchError: function (oEvent) {

			sap.ui.getCore().getMessageManager().removeAllMessages();
			Log.error("Search with error: " + oEvent.getParameter("message"), this.getOwnerComponent().getComponentName());

			var oError = oEvent.getParameter("oError");

			var fnCallback = function () {
				if (oError) {
					if (oError.name === "NotFoundError") {
						this.getRouter().getTargets().display("notFound");
					} else if (oError.name === "InitialAccountSearchError") {
						this.getRouter().getTargets().display("start");
					} else {
						//  Add message to be visible to the user 
						var oMessageManager = sap.ui.getCore().getMessageManager();
						oMessageManager.addMessages(
							new sap.ui.core.message.Message({
								message: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errorPageTextUseSearch"),
								type: sap.ui.core.MessageType.Error,
								// target: sPath,
								//processor: this.getOwnerComponent().getSearchComponent().getSearchModel()
								processor: this.getOwnerComponent().getModel()
							})
						);
						this.getRouter().getTargets().display("error");
					}
				} else {
					Log.error("Error object not provided by the search component.", this.getOwnerComponent().getComponentName());
					this.getRouter().getTargets().display("error");
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));

		},

		onAfterRendering: function (oEvent) {
			this.setFocusOnSearchField();
		},

		/* =========================================================== */
		/* Public methods                                              */
		/* =========================================================== */

		/**
		 * 
		 * @public
		 * @param {string} [sValue] value to be set
		 */
		setSearchFieldValue: function (sValue) {
			this.getOwnerComponent().executeBySearchComponent(function (oSearchComponent) {
				oSearchComponent.setSearchTerm(sValue);
			});

		},

		/**
		 * 
		 * @public
		 */
		setFocusOnSearchField: function () {

			/*	Internal Incident: 1680123992: 
			Focus will trigger the suggestion -> therefore put it in comments
			this.getOwnerComponent().executeBySearchComponent(function(oSearchComponent) {
				oSearchComponent.setFocusOnSearchField();
			}); */

		},

		/* =========================================================== */
		/* Private methods                                             */
		/* =========================================================== */

		/**
		 * initialize the sreach component model .
		 * @private
		 */
		_initSearchSettings: function () {

			var oBankAccountContractSearchSettings = {
				entitySetName: this.getOwnerComponent().getSearchEntitySetName("Fs_C_Acs_Bac_0004", "entity_set_search_acct_main"),
				startSuggestion: 3,
				requiredFields: "BankAccountInternalID,ID,IDSchemeID,IDSchemeAgencyID,BusinessSystemID,BkAcctID,BkAcctStandardID,OplBkContrMgmtUnitID,AcctHldrPartyInternalID",
				accountSelected: this.onAccountSelected.bind(this),
				searchError: this.onSearchError.bind(this),
				searchComponentIntialized: this.onInnerControlsCreated.bind(this)
			};
			this.getView().setModel(new JSONModel(oBankAccountContractSearchSettings), "bankAccountContractSearchSettings");

		}

	});

});