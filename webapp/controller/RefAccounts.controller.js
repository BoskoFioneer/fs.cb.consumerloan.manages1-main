sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fs/cb/consumerloan/manages1/model/utilities",
	"fs/cb/consumerloan/manages1/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, utilities, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.RefAccounts", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function() {

			var oRefAccTbl = this.byId("tableRefAccounts");
			this._oRefAccTable = oRefAccTbl;

			this.initTableModel(oRefAccTbl, "xtit.accountTableTitle", "xtit.accountTableTitleCount", "ymsg.accountTableNoDataText");
			this._oRefAccTableTemplate = this.getView().byId("tableRefAccountsItem").clone();

			var oEventBus = this.getOwnerComponent().getEventBus();
			// Listen on bindingUpdated event on app channel
			oEventBus.subscribe("fs.cb.consumerloan.manages1", "consumerRefAccBindingUpdated", this.onRefAccBindingUpdate, this);
			// this._onRefAccBindingUpdate();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * @public
		 */
		onAfterRendering: function() {

		},

		// /* =========================================================== */
		// /* event handlers                                              */
		// /* =========================================================== */

		// _onRefAccBindingUpdate: function() {
		// 	this._oRefAccTable.unbindAggregation("items");
		// 	this._oRefAccTable.bindAggregation("items", {
		// 		path: "PymntTrnsctnInstrctns",
		// 		template: this._oRefAccTableTemplate
		// 	});

		// },

		onRefAccBindingUpdate: function(sChannelId, sEventId, oData) {

			if (sChannelId === "fs.cb.consumerloan.manages1" && sEventId === "consumerRefAccBindingUpdated") {

				var sBindingPath = oData.sPath;
				this.getView().getModel("refaccounts").update(sBindingPath);

			}
		},

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onRefAccTableUpdateFinished: function(oEvent) {
			// update the table counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");

			// update the table counter after the table update
			this.updateTableModel(oTable, iTotalItems);
		},

		onDirectDebitMandateLinkPressed: function(oEvent) {

			var oDataModel = this.getView().getModel();
			var that = this;
			var oEventLocal = oEvent.getSource();

			var sBusinessSystemID = oEvent.getSource().getBindingContext().getProperty("BusinessSystemID");
			
			var oItemBindingContext = oEvent.getSource().getBindingContext("refaccounts");
			var sMandateId = oItemBindingContext.getProperty("DirectDebitMandate/ID");
			var sCreditorID = oItemBindingContext.getProperty("DirectDebitMandate/CreditorPartyID");
			sMandateId = encodeURIComponent(sMandateId);
			// var sMandateId = oEvent.getSource().getBindingContext().getProperty("DirectDebitMandate/ID");
			// var sCreditorID = oEvent.getSource().getBindingContext().getProperty("DirectDebitMandate/CreditorPartyID");

			var sPath = "/DirectDebitMandates(ID='" + sMandateId + "',CreditorPartyID='" + sCreditorID + "',BusinessSystemID='" +
				sBusinessSystemID + "')";

			var _onSucess = function() {
				var oMandateObject = that.getView().getModel().getObject(sPath);

				if (!that._oDirectDebitMandateCard) {
					that._initializeDirectDebitMandateCard();
				}

				// that._oDirectDebitMandateCard.setBindingContext(oEventLocal.getBindingContext());

				// Collect data from RelatedParties into internal quick view group model
				var mDirectDebitMandateData = {
					groups: []
				};

				// Add AccountHolder Contact Data from AcctHldrParty to the internal model
				mDirectDebitMandateData.groups.push(that._createGroupData(oMandateObject));

				// create model and set the data to the model
				if (!that._oDirectDebitMandateModel) {
					that._oDirectDebitMandateModel = new JSONModel();
				}
				that._oDirectDebitMandateModel.setData(mDirectDebitMandateData);
				that._oDirectDebitMandateCard.setModel(that._oDirectDebitMandateModel, "mandate");
				that.byId("directDebitMandatQuickViewPage").setTitle(oMandateObject.ID);

				// show popover dialog
				that._oDirectDebitMandateCard.openBy(oEventLocal);

			};

			var oMandateObject = that.getView().getModel().getObject(sPath);
			// If Mandate Object is read before take this
			if (oMandateObject) {
				_onSucess();
			} else {
				// otherhwise get Mandate data via read 
				oDataModel.read(sPath, {
						success: function(oReadData) {
							_onSucess();
						}
					},

					{
						error: function(oError) { // onError

						}
					}

				);
			}
		},

		/* =========================================================== */
		/* Public methods                                              */
		/* =========================================================== */

		/* =========================================================== */
		/* Private methods                                             */
		/* =========================================================== */

		_initializeDirectDebitMandateCard: function() {

			var oCardModel = new JSONModel({
				open: true,
				loading: false
			});

			this._oDirectDebitMandateCard = sap.ui.xmlfragment(this.getView().getId(),
				"fs.cb.consumerloan.manages1.view.fragment.DirectDebitMandateCard", this, {
					afterOpen: oCardModel.setProperty.bind(oCardModel, "/open", true),
					afterClose: oCardModel.setProperty.bind(oCardModel, "/open", false),
					dataRequested: oCardModel.setProperty.bind(oCardModel, "/loading", true),
					change: oCardModel.setProperty.bind(oCardModel, "/loading", false)
				});
			this._oDirectDebitMandateCard.setModel(oCardModel, "cardModel");
			utilities.attachControlToView(this.getView(), this._oDirectDebitMandateCard);
		},

		_createGroupData: function(oBindingContext) {

			var oGroup = {};

			var sformatedDate = formatter.getFormattedDate(oBindingContext.SignatureDate);
			var sformatedValidityEndDate = formatter.getFormattedDate(oBindingContext.ValidityEndDate);

			if (oBindingContext) {

				oGroup = {
					heading: this.getResourceBundle().getText("xtit.mandateDetails"),
					title: oBindingContext.ID,
					elements: [{
						label: this.getResourceBundle().getText("xfld.directDebitMandateCreditorPartyID"),
						value: oBindingContext.CreditorPartyID
					}, {
						label: this.getResourceBundle().getText("xfld.directDebitMandateSignatureDate"),
						value: sformatedDate
					}, {
						label: this.getResourceBundle().getText("xfld.directDebitMandateValidityEndDate"),
						value: sformatedValidityEndDate

					}, {
						label: this.getResourceBundle().getText("xfld.DirDebitCollsSEPASeqTypeName"),
						value: oBindingContext.DirDebitCollsSEPASeqTypeName
					}, {
						label: this.getResourceBundle().getText("xfld.DirectDebitMandateCreditorReferenceID"),
						value: oBindingContext.CreditorReferenceID
					}, {
						label: this.getResourceBundle().getText("xfld.accountIban"),
						value: oBindingContext.DebtorBankAccount.StandardID
					}, {
						label: this.getResourceBundle().getText("xfld.BIC"),
						value: oBindingContext.DebtorBankAccount.BkStandardID
					}, {
						label: this.getResourceBundle().getText("xfld.accountHolder"),
						value: oBindingContext.DebtorBankAccount.HolderName
					}]
				};
			}

			return oGroup;

		}

	});

});