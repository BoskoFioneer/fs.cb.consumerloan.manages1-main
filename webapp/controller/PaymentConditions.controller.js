sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fs/cb/consumerloan/manages1/model/utilities",
	"fs/cb/consumerloan/manages1/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, utilities, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.PaymentConditions", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function() {

			var oPaymentConditionsTbl = this.byId("tablepaymentconditions");
			this.oPaymentConditionsTbl = oPaymentConditionsTbl;

			this._oPaymentConditionsTblTemplate = this.getView().byId("tablePaymentConditionsItem").clone();

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * @public
		 */
		onAfterRendering: function() {

			this._onPaymentConditionBindingUpdate();
		},

		/* =========================================================== */
		/* Private methods                                             */
		/* =========================================================== */

		_onPaymentConditionBindingUpdate: function() {

			var oMainModel = this.getModel("mainModel");
			var oData = oMainModel.getData();

			var aAblFilters = [];
			aAblFilters.push(
				new Filter("BkAcctContrID", FilterOperator.EQ, oData.consumerAccountID),
				new Filter("BkAcctContrIDSchmID", FilterOperator.EQ, oData.consumerAccountIDSchemeID),
				new Filter("BkAcctContrIDSchmAgcyID", FilterOperator.EQ, oData.consumerAccountIDSchemeAgencyID),
				new Filter("BusinessSystemID", FilterOperator.EQ, oData.consumerAccountBusinessSystemID));

			this.oPaymentConditionsTbl.unbindAggregation("items");
			this.oPaymentConditionsTbl.bindAggregation("items", {
				path: "/PaymentConditionItems",
				filters: aAblFilters,
				template: this._oPaymentConditionsTblTemplate
			});
		},
		/**


		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the table counter after the table update
			// var oTable = oEvent.getSource(),
			// 	iTotalItems = oEvent.getParameter("total");

			// jQuery.each(oTable.getItems(), function(iIndex, oItem) {
			// 	oItem.setVisible(!oItem.getBindingContext("refaccounts").getObject()._bDeleted);
			// });
			// this.updateTableModel(oTable, iTotalItems);
		}
	});

});