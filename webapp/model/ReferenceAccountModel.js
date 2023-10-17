sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/message/Message"
], function(JSONModel, Message) {
	"use strict";

	return JSONModel.extend("fs.cb.consumerloan.manages1.model.ReferenceAccountModel", {

		_sBindingPath: null,
		_oModel: null,
		// ==========================================================================================
		// Public methods
		// ==========================================================================================

		/**
		 * Constructor to create new model instance and set data
		 * @param{sap.ui.model.odata.v2.ODataModel} [oModel]  OData Model
		 * @param{jQuery.sap.util.ResourceBundle} [oResourceBundle]  Ressource Bundle
		 */
		constructor: function(oModel, oResourceBundle) {

			JSONModel.apply(this);

			if (oModel) {
				this._oModel = oModel;
			}
			if (oResourceBundle) {
				this._oResourceBundle = oResourceBundle;
			}
			this._initRefAccounts();
		},

		/**
		 * Get reference to the model instance
		 * @returns {fs.cb.consumerloan.manages1.model.ReferenceAccountModel} model instance
		 */
		getModel: function() {
			return this;
		},

		/**
		 * Retrieve the data of the counter parties and counter parties payment instractions form the
		 * OData Model for the specific current account and set the data to the reference account model
		 * @param{String} [sPath]  OData Model Entity Path of the current account containing list of counter parties
		 */
		update: function(sPath) {

			this._initRefAccounts();

			if (sPath) {
				this._sBindingPath = sPath;
				this._setRefAccounts();
			}
		},

		/**
		 * Remove all data in model
		 */
		destroy: function() {
			this._initRefAccounts();
		},

		/* =========================================================== */
		/* Private methods                                             */
		/* =========================================================== */
		/**
		 * Helper to retrieve the data of the counter parties and counter parties payment instructions form the
		 * OData Model for the specific current account and set the data to the reference account model
		 */

		_setRefAccounts: function() {

			var mRefAccounts = {
				CounterParties: []
			};
			var oDisbCounterParty;
			var oBillingCounterParty;
			var oCounterParty = {};

			var oCounterParties = this._oModel.getProperty(this._sBindingPath + "/PymntTrnsctnInstrctns");
			if (oCounterParties) {
				// Copy the data from OData model to the current model (overwrite)
				var that = this;

				var bLastDisbIndicator;
				var bLastBillingIndicator;
				jQuery.each(oCounterParties, function(iIndex, sItem) {
					var sCounterPartyPath = sItem;
					var oCurrentCounterParty = that._oModel.getObject("/" + sCounterPartyPath);

					if ((!bLastDisbIndicator && !bLastBillingIndicator) ||
						(bLastDisbIndicator !== oCurrentCounterParty.DisbursementUseIndicator || bLastBillingIndicator !== oCurrentCounterParty.BillingUseIndicator)
					) {
						bLastDisbIndicator = oCurrentCounterParty.DisbursementUseIndicator;
						bLastBillingIndicator = oCurrentCounterParty.BillingUseIndicator;
						oCounterParty = {};
						oCounterParty = that._oModel.getObject("/" + sCounterPartyPath);
						// Add Billing and Disb Identifier properties (required as of the check boxes in table of reference account)						
						oCounterParty.BillingIndicator = oCurrentCounterParty.BillingUseIndicator;
						oCounterParty.BillingUseIndicator = oCurrentCounterParty.BillingUseIndicator;
						// oCounterParty.DirectDebitMandate = oCurrentCounterParty.DirectDebitMandate;
						oCounterParty.DisbIndicator = oCurrentCounterParty.DisbursementUseIndicator;
						oCounterParty.DisbIndicator = oCurrentCounterParty.DisbursementUseIndicator;

						oCounterParty._sPath = sCounterPartyPath;

						// oCounterParty._sPathBillingPaymentInstruction = "";
						// oCounterParty._sPathBillingPaymentInstructionDebit = "";
						// oCounterParty._sPathDisbPaymentInstruction = "";
						// oCounterParty._sPathDisbPaymentInstructionDebit = "";
					}

					// Set DummyId that contains either StandardID or ID
					if (oCounterParty.CounterPartyBankAccount.ID) {
						oCounterParty.CounterPartyBankAccount.DummyID = oCounterParty.CounterPartyBankAccount.ID;
					} else {
						oCounterParty.CounterPartyBankAccount.DummyID = oCounterParty.CounterPartyBankAccount.StandardID;
					}
					// // Add Disb 						
					// if (oCurrentCounterParty.BillingUseIndicator) {
					// 	if (oCurrentCounterParty.DebitUseIndicator) {
					// 		oCounterParty._sPathBillingPaymentInstructionDebit = sCounterPartyPath;
					// 	} else {
					// 		oCounterParty._sPathBillingPaymentInstruction = sCounterPartyPath;
					// 	}
					// }

					// if (oCurrentCounterParty.DisbursementUseIndicator) {
					// 	if (oCurrentCounterParty.DebitUseIndicator) {
					// 		oCounterParty._sPathDisbPaymentInstructionDebit = sCounterPartyPath;
					// 	} else {
					// 		oCounterParty._sPathDisbPaymentInstruction = sCounterPartyPath;
					// 	}
					// }
					
					oCounterParty.DirectDebitMandate.ID = oCurrentCounterParty.DirectDebitMandate.ID;
					oCounterParty.DirectDebitMandate.CreditorPartyID = oCurrentCounterParty.DirectDebitMandate.CreditorPartyID;

					if (oCurrentCounterParty.DisbursementUseIndicator) {
						oDisbCounterParty = jQuery.extend(true, {}, oCounterParty);
					}
					if (oCurrentCounterParty.BillingUseIndicator) {
						oBillingCounterParty = jQuery.extend(true, {}, oCounterParty);
					}
				});
				// Merge Counter Parties if typecode, account data amd mandate date are identical
				if (oDisbCounterParty && oBillingCounterParty) {
					var sCompareStringDisb = JSON.stringify([oDisbCounterParty.CounterPartyBankAccount.ID, oDisbCounterParty.CounterPartyBankAccount
						.StandardID,
						oDisbCounterParty.CounterPartyBankAccount.BkStandardID, oDisbCounterParty.CounterPartyBankAccount.BkRoutingID,
						oDisbCounterParty.CounterPartyBankAccount.BkCountryCode
					]);
					var sCompareStringBilling = JSON.stringify([oBillingCounterParty.CounterPartyBankAccount.ID, oBillingCounterParty.CounterPartyBankAccount
						.StandardID,
						oBillingCounterParty.CounterPartyBankAccount.BkStandardID, oBillingCounterParty.CounterPartyBankAccount.BkRoutingID,
						oBillingCounterParty.CounterPartyBankAccount.BkCountryCode
					]);
					if (sCompareStringDisb === sCompareStringBilling && oDisbCounterParty.TypeCode === oBillingCounterParty.TypeCode &&
						oDisbCounterParty.DirectDebitMandate.DirectDebitMandateID === oBillingCounterParty.DirectDebitMandate.DirectDebitMandateID) {

						oDisbCounterParty.BillingIndicator = oBillingCounterParty.BillingIndicator;
						oDisbCounterParty.BillingUseIndicator = oBillingCounterParty.BillingUseIndicator;
						oDisbCounterParty._sPathBillingPaymentInstructionDebit = oBillingCounterParty._sPathBillingPaymentInstructionDebit;
						oDisbCounterParty._sPathBillingPaymentInstruction = oBillingCounterParty._sPathBillingPaymentInstruction;
						mRefAccounts.CounterParties.push(oDisbCounterParty);
					} else {
						mRefAccounts.CounterParties.push(oDisbCounterParty);
						mRefAccounts.CounterParties.push(oBillingCounterParty);
					}
				} else {
					if (oDisbCounterParty) {
						mRefAccounts.CounterParties.push(oDisbCounterParty);
					}
					if (oBillingCounterParty) {
						mRefAccounts.CounterParties.push(oBillingCounterParty);
					}
				}
			}
			this.setData(mRefAccounts, true);
		},

		/**
		 * Helper to initialize the data of the model
		 */
		_initRefAccounts: function() {

			// remove data from model
			this.setData(null);
			
		}
	});

});