sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"fs/cb/consumerloan/manages1/model/dateRangeSelection",
	"fs/cb/consumerloan/manages1/model/utilities",
	"fs/cb/consumerloan/manages1/model/formatter",
	"sap/base/Log"
], function(BaseController, JSONModel, Filter, FilterOperator, DateRangeSelection, utilities, formatter, Log) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.PaymentPlan", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function() {

			var oPaymentPlanTbl = this.byId("tablePaymentPlan");
			this._oPaymentPlanTable = oPaymentPlanTbl;
			this.initTableModel(oPaymentPlanTbl, "xtit.itemsTableTitle", "xtit.itemsTableTitleCount", "ymsg.paymentPlanTableNoDataText");
			this._oPaymentPlanTemplate = this.getView().byId("tablePaymentPlanColItem").clone();
			this._onPaymentPlanBindingUpdate();
			this.noDataText = this.getResourceBundle().getText("ymsg.paymentPlanTableNoDataText");

			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.subscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onPaymentPlanBindingUpdate, this);

			var oModel = this.getOwnerComponent().getModel();
			// Creates bacth group for updates
			oModel.setChangeGroups({
				"LoanContracts": {
					groupId: "turnoverGroup"
				}
			});
		},

		onExit: function() {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.unsubscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onPaymentPlanBindingUpdate, this);

			// if (this.oPaymentPlanSortFilterDialog !== undefined) {

			// 	this.oPaymentPlanSortFilterDialog.destroy();
			// 	this.oPaymentPlanSortFilterDialog = undefined;
			// }

		},

		// /* =========================================================== */
		// /* event handlers                                              */
		// /* =========================================================== */
		/**
		 * Event handler on bindingUpdated event on app channel
		 * Update binding in object header for account holder and contract manager
		 * @public
		 * @param {string} [sChannelId] The channel of the fired event: "fs.cb.consumerloan.manages1"
		 * @param {sEvent} [sEventId] The EventId of the fired event: "consumerBindingUpdated"
		 * @param {object} [oData] Parameters
		 */
		onPaymentPlanBindingUpdate: function(sChannelId, sEventId, oData) {
			if (sChannelId === "fs.cb.consumerloan.manages1" && sEventId === "consumerBindingUpdated") {

				if (this.oPaymentPlanSortFilterDialog !== undefined) {

					this.oPaymentPlanSortFilterDialog.destroy();
					this.oPaymentPlanSortFilterDialog = undefined;
				}

				this.getView().byId("paymentPlanDurationSelect").setSelectedKey("thisYear");
				var oPaymentPlanDateRangeSelection = this.getView().byId("paymentPlanDateRangeSelection");
				oPaymentPlanDateRangeSelection.setDateValue(null);
				oPaymentPlanDateRangeSelection.setSecondDateValue(null);
				oPaymentPlanDateRangeSelection.setEditable(false);
				var that = this;
				var oJsonModel = new JSONModel();
				this._handleDateRangeSelection(); // fall back handle date range selection
				var oDateModel = new JSONModel();
				this.getView().setModel(oDateModel, "dateModel");
				var sLoanPaymentPlanQuery, sLoanPaymentPlanURL;
				var oModel = that.getOwnerComponent().getModel("CashflowModel");
				that._oPaymentPlanTable.unbindItems();

				var dDateValue = that.getView().byId("paymentPlanDateRangeSelection").getDateValue();
				var dSecondDateValue = that.getView().byId("paymentPlanDateRangeSelection").getSecondDateValue();

				if (dDateValue && dSecondDateValue) {
					sLoanPaymentPlanQuery = "/LoanContracts(ID='" + oData.consumerAccountID + "',IDSchemeID='" + oData.consumerAccountIDSchemeID +
						"',IDSchemeAgencyID='" + oData.consumerAccountIDSchemeAgencyID +
						"',BusinessSystemID='" + oData.consumerAccountBusinessSystemID + "')" + "/LoanPaymentPlanPayment";

					sLoanPaymentPlanURL = encodeURI(sLoanPaymentPlanQuery);

					var aAblFilters = [];
					aAblFilters.push(new Filter("Date", FilterOperator.BT, formatter.formatDate(dDateValue), formatter.formatDate(
						dSecondDateValue)));

					oModel.read(sLoanPaymentPlanURL, {
							filters: aAblFilters,
							groupId: "turnoverGroup",
							success: function(oResult) {
								that._oPaymentPlanTable.setNoDataText(that.noDataText);
								oJsonModel.setData(oResult);
								that._oPaymentPlanTable.setModel(oJsonModel);

								that._oPaymentPlanTable.bindItems("/results", that._oPaymentPlanTemplate);
							},
							error: function(oError) {
								var oMessageText = JSON.parse(oError.responseText).error.message.value;
								var oErrorText = that.getResourceBundle().getText("ymsg.paymentPlanError") + oMessageText;
								oJsonModel.setData(oMessageText);
								Log.error(oMessageText);
								that._oPaymentPlanTable.destroyItems();
								that._oPaymentPlanTable.setNoDataText(oErrorText);
							}
						}

					);
				}

			}

		},

		onUpdateFinished: function(oEvent) {
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");

			this.updateTableModel(oTable, iTotalItems);
		},

		onSelectPaymentPlanDuration: function(oEvent) {

			this._handleDateRangeSelection();
			if (this.getView().byId("paymentPlanDurationSelect") &&
				this.getView().byId("paymentPlanDurationSelect").getSelectedKey() &&
				this.getView().byId("paymentPlanDurationSelect").getSelectedKey() !== "dateRange")
				this._onPaymentPlanBindingUpdate();
		},

		_onPaymentPlanBindingUpdate: function() {

			if (this.oPaymentPlanSortFilterDialog !== undefined) {

				this.oPaymentPlanSortFilterDialog.destroy();
				this.oPaymentPlanSortFilterDialog = undefined;
			}

			var that = this;
			var oJsonModel = new JSONModel();
			this._handleDateRangeSelection(); // fall back handle date range selection
			var oMainModel = this.getOwnerComponent().getModel("mainModel");
			var oData = oMainModel.getData();
			var oDateModel = new JSONModel();
			this.getView().setModel(oDateModel, "dateModel");
			var sLoanPaymentPlanQuery, sLoanPaymentPlanURL;
			var oModel = that.getOwnerComponent().getModel("CashflowModel");
			that._oPaymentPlanTable.unbindItems();

			var dateRange = that.getView().byId("paymentPlanDateRangeSelection");
			var dDateValue = that.getView().byId("paymentPlanDateRangeSelection").getDateValue();
			var dSecondDateValue = that.getView().byId("paymentPlanDateRangeSelection").getSecondDateValue();

			if (dateRange._bValid) {
				dateRange.setValueState(sap.ui.core.ValueState.None);
				if (dDateValue && dSecondDateValue) {
					sLoanPaymentPlanQuery = "/LoanContracts(ID='" + oData.consumerAccountID + "',IDSchemeID='" + oData.consumerAccountIDSchemeID +
						"',IDSchemeAgencyID='" + oData.consumerAccountIDSchemeAgencyID +
						"',BusinessSystemID='" + oData.consumerAccountBusinessSystemID + "')" + "/LoanPaymentPlanPayment";

					sLoanPaymentPlanURL = encodeURI(sLoanPaymentPlanQuery);

					var aAblFilters = [];
					aAblFilters.push(new Filter("Date", FilterOperator.BT, formatter.formatDate(dDateValue), formatter.formatDate(
						dSecondDateValue)));
					aAblFilters[0].oValue1 = aAblFilters[0].oValue1.slice(0, 10);
					aAblFilters[0].oValue2 = aAblFilters[0].oValue2.slice(0, 10);

					oModel.read(sLoanPaymentPlanURL, {
							filters: aAblFilters,
							success: function(oResult) {
								that._oPaymentPlanTable.setNoDataText(that.noDataText);
								oJsonModel.setData(oResult);
								that._oPaymentPlanTable.setModel(oJsonModel);
								that._oPaymentPlanTable.bindItems("/results", that._oPaymentPlanTemplate);
							},
							error: function(oError) {
								var oMessageText = JSON.parse(oError.responseText).error.message.value;
								var oErrorText = that.getResourceBundle().getText("ymsg.paymentPlanError") + oMessageText;
								oJsonModel.setData(oMessageText);
								Log.error(oMessageText);
								that._oPaymentPlanTable.destroyItems();
								that._oPaymentPlanTable.setNoDataText(oErrorText);
							}
						}

					);
				} else if (!dDateValue && !dSecondDateValue) {
					sLoanPaymentPlanQuery = "/LoanContracts(ID='" + oData.consumerAccountID + "',IDSchemeID='" + oData.consumerAccountIDSchemeID +
						"',IDSchemeAgencyID='" + oData.consumerAccountIDSchemeAgencyID +
						"',BusinessSystemID='" + oData.consumerAccountBusinessSystemID + "')/LoanPaymentPlanPayment";

					sLoanPaymentPlanURL = encodeURI(sLoanPaymentPlanQuery);

					oModel.read(sLoanPaymentPlanURL, {
						// filters: [oFilters],
						success: function(oResult) {
							that._oPaymentPlanTable.setNoDataText(that.noDataText);
							oJsonModel.setData(oResult);
							that._oPaymentPlanTable.setModel(oJsonModel);
							that._oPaymentPlanTable.bindItems("/results", that._oPaymentPlanTemplate);

						},
						error: function(oError) {
							var oMessageText = JSON.parse(oError.responseText).error.message.value;
							var oErrorText = that.getResourceBundle().getText("ymsg.paymentPlanError") + oMessageText;
							oJsonModel.setData(oMessageText);
							Log.error(oMessageText);
							that._oPaymentPlanTable.destroyItems();
							that._oPaymentPlanTable.setNoDataText(oErrorText);
						}
					});

				} 
			}

		},

		//* Triggered by the table's 'updateFinished' event: after new table data is available, this handler method updates the table counter.
		//* This should only happen if the update was successful, which is why this handler is attached to 'updateFinished' and not to the
		//* table's list binding's 'dataReceived' method.
		//* @param {sap.ui.base.Event} oEvent the update finished event
		//* @public
		//*/

		onPaymentPlanSettingsPressed: function(oEvent) {

			var that = this;
			if (that.oPaymentPlanSortFilterDialog === undefined) {
				that.oPaymentPlanSortFilterDialog = sap.ui.xmlfragment("PaymentPlanFragment",
					"fs.cb.consumerloan.manages1.view.fragment.PaymentPlanSettings",
					that.getView().getController());
				that.oPaymentPlanSortFilterDialog.setModel(that.getView().getModel("i18n"), "i18n");
				that.oPaymentPlanSortFilterDialog.oParentControllerIns = that;
				that.oPaymentPlanSortFilterDialog.attachConfirm(that.onPerformSortFilterTurnover);
			}

			that.oPaymentPlanSortFilterDialog.open();

		},
		onPerformSortFilterTurnover: function(oEvent) {
			utilities.performSortFilterOnTable(this, "tablePaymentPlan");
		},

		onChangePaymentPlanDateRange: function(oEvent) {
			var oDateRangeSelection = oEvent.getSource();
			
			// when user enters a single date in the date range, it is a valid input.
			//So , in this case Fromdate = ToDate. 
			if (oDateRangeSelection.getSecondDateValue() === null) {
				oDateRangeSelection.setSecondDateValue(oDateRangeSelection.getDateValue());
			}
			
			if (oEvent.getParameter("valid") === true && oEvent.getParameter("value")) {
				if (oDateRangeSelection && oDateRangeSelection.setValueState) {
					oDateRangeSelection.setValueState("None");
				}
			} else {
				if (oDateRangeSelection && oDateRangeSelection.setValueState) {
					oDateRangeSelection.setValueState("Error");
				}
			}
			this._onPaymentPlanBindingUpdate();
		},

		_handleDateRangeSelection: function() {
			var oPaymentPlanDurationSelect = this.getView().byId("paymentPlanDurationSelect");
			var oSelectedDateRangeKey = oPaymentPlanDurationSelect.getSelectedKey();
			var oDate = DateRangeSelection.getDateRangeSelectionByKey(oSelectedDateRangeKey);
			var oPaymentPlanDateRangeSelection = this.getView().byId("paymentPlanDateRangeSelection");
			if (oSelectedDateRangeKey === "dateRange") {
				oPaymentPlanDateRangeSelection.setEditable(true);
				oPaymentPlanDateRangeSelection.setEnabled(true);

			} else if (oSelectedDateRangeKey === "all") {
				oPaymentPlanDateRangeSelection.setDateValue(null);
				oPaymentPlanDateRangeSelection.setSecondDateValue(null);
				oPaymentPlanDateRangeSelection.setEditable(false);
			} else {
				oPaymentPlanDateRangeSelection.setDateValue(oDate[0].getJSDate());
				oPaymentPlanDateRangeSelection.setSecondDateValue(oDate[1].getJSDate());
				oPaymentPlanDateRangeSelection.setEditable(false);
			}
		}

	});

});