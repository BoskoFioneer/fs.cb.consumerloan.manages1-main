sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	// "fs/cb/consumerloan/manages1/controller/TurnoverSettingsDialog",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"fs/cb/consumerloan/manages1/model/dateRangeSelection",
	"fs/cb/consumerloan/manages1/model/utilities",
	"fs/cb/consumerloan/manages1/model/formatter",
	"sap/base/Log"
	
], function(BaseController, JSONModel, Filter, FilterOperator, DateRangeSelection, utilities, formatter, Log) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.Turnover", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var _oTurnoverTbl = this.byId("tableTurnover");
			this._oTurnoverTable = _oTurnoverTbl;
			this.initTableModel(_oTurnoverTbl, "xtit.itemsTableTitle", "xtit.itemsTableTitleCount", "ymsg.turnoverTableNoDataText");
			this._oTurnoverTableTemplate = this.getView().byId("tableTurnoverColItem").clone();
			this._onTurnoverBindingUpdate();

			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.subscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onTurnoverBindingUpdate, this);

			var oModel = this.getOwnerComponent().getModel();
			// Creates bacth group for updates
			oModel.setChangeGroups({
				"BankAccounts": {
					groupId: "turnoverGroup"
				}
			});

		},

		onExit: function() {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.unsubscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onTurnoverBindingUpdate, this);

			// if (this.oTurnoverSortFilterDialog !== undefined) {

			// 	this.oTurnoverSortFilterDialog.destroy();
			// 	this.oTurnoverSortFilterDialog = undefined;
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
		onTurnoverBindingUpdate: function(sChannelId, sEventId, oData) {
			if (sChannelId === "fs.cb.consumerloan.manages1" && sEventId === "consumerBindingUpdated") {

				if (this.oTurnoverSortFilterDialog !== undefined) {

					this.oTurnoverSortFilterDialog.destroy();
					this.oTurnoverSortFilterDialog = undefined;
				}
				this.getView().byId("turnoverDurationSelect").setSelectedKey("thisQuarter");
				var oTurnoverDateRangeSelection = this.getView().byId("turnoverDateRangeSelection");
				oTurnoverDateRangeSelection.setDateValue(null);
				oTurnoverDateRangeSelection.setSecondDateValue(null);
				oTurnoverDateRangeSelection.setEditable(false);

				var that = this;
				var oJsonModel = new JSONModel();
				this._handleDateRangeSelection(); // fall back handle date range selection

				var oDateModel = new JSONModel();
				this.getView().setModel(oDateModel, "dateModel");
				var sPostedTurnOversQuery;
				var oModel = that.getOwnerComponent().getModel("CashflowModel");
				that._oTurnoverTable.unbindItems();

				var dDateValue = this.getView().byId("turnoverDateRangeSelection").getDateValue();
				var dSecondDateValue = this.getView().byId("turnoverDateRangeSelection").getSecondDateValue();

				if (dDateValue && dSecondDateValue) {
					sPostedTurnOversQuery = "/BankAccounts(BkAcctIntID='" + oData.BkAccContrId + "',BkAcctIntIDSchmAgcyID='" + oData.consumerAccountIDSchemeAgencyID +
						"',BusinessSystemID='" + oData.consumerAccountBusinessSystemID + "')/PostedLoanFinancialTurnover";

					var aAblFilters = [];
					aAblFilters.push(new Filter("ValueDate", FilterOperator.BT, formatter.formatDate(dDateValue), formatter.formatDate(
						dSecondDateValue)));

					oModel.read(sPostedTurnOversQuery, {
						filters: aAblFilters,
						groupId: "turnoverGroup",
						success: function(oResult) {
							oJsonModel.setData(oResult);
							that._oTurnoverTable.setModel(oJsonModel);

							that._oTurnoverTable.bindItems("/results", that._oTurnoverTableTemplate);
							that._buildPostedTurnoversData(oResult);

						},
						error: function(oError) {
							Log.error("Error on reading in turnovers");
							// that.getModel("mainModel").setProperty("/ActiveOperation", "NoOrders");
							// that.getRouter().getTargets().display("detailNoObjectsAvailable");
						}
					});

				}
			}

		},

		onChangeTurnoverDurationSelect: function(oEvent) {
			this._handleDateRangeSelection();
			if (this.getView().byId("turnoverDurationSelect") &&
				this.getView().byId("turnoverDurationSelect").getSelectedKey() &&
				this.getView().byId("turnoverDurationSelect").getSelectedKey() !== "dateRange")

				this._onTurnoverBindingUpdate();
		},

		/**
		 * Triggered by the app  'bindingUpdated' event
		 * Apply binding context to Conditions Sub Section (extract from TermAgreements)
		 * @public
		 * @param {string} [sChannelId] The channel of the fired event: "fs.cb.currentaccount.manage"
		 * @param {sEvent} [sEventId] The event Id of the fired event: "updateLocksEvent"
		 * @param {object} [oData] Parameters
		 */
		_onTurnoverBindingUpdate: function() {

			if (this.oTurnoverSortFilterDialog !== undefined) {

				this.oTurnoverSortFilterDialog.destroy();
				this.oTurnoverSortFilterDialog = undefined;
			}

			var that = this;
			var oJsonModel = new JSONModel();
			this._handleDateRangeSelection(); // fall back handle date range selection
			var oMainModel = this.getOwnerComponent().getModel("mainModel");
			var oData = oMainModel.getData();
			var oDateModel = new JSONModel();
			this.getView().setModel(oDateModel, "dateModel");
			var sPostedTurnOversQuery;
			var oModel = that.getOwnerComponent().getModel("CashflowModel");
			that._oTurnoverTable.unbindItems();

			var dateRange = that.getView().byId("turnoverDateRangeSelection");
			var dDateValue = this.getView().byId("turnoverDateRangeSelection").getDateValue();
			var dSecondDateValue = this.getView().byId("turnoverDateRangeSelection").getSecondDateValue();

			if (dateRange._bValid) {
				dateRange.setValueState(sap.ui.core.ValueState.None);
				if (dDateValue && dSecondDateValue) {
					sPostedTurnOversQuery = "/BankAccounts(BkAcctIntID='" + oData.BkAccContrId + "',BkAcctIntIDSchmAgcyID='" + oData.consumerAccountIDSchemeAgencyID +
						"',BusinessSystemID='" + oData.consumerAccountBusinessSystemID + "')/PostedLoanFinancialTurnover";
					var aAblFilters = [];
					aAblFilters.push(new Filter("ValueDate", FilterOperator.BT, formatter.formatDate(dDateValue), formatter.formatDate(
						dSecondDateValue)));
					aAblFilters[0].oValue1 = aAblFilters[0].oValue1.slice(0, 10);
					aAblFilters[0].oValue2 = aAblFilters[0].oValue2.slice(0, 10);
					oModel.read(sPostedTurnOversQuery, {
						filters: aAblFilters,
						success: function(oResult) {
							oJsonModel.setData(oResult);
							that._oTurnoverTable.setModel(oJsonModel);

							that._oTurnoverTable.bindItems("/results", that._oTurnoverTableTemplate);
							that._buildPostedTurnoversData(oResult);

						},
						error: function(oError) {
							Log.error("Error on reading ");
						}
					});

				} else if (!dDateValue && !dSecondDateValue) {
					sPostedTurnOversQuery = "/BankAccounts(BkAcctIntID='" + oData.BkAccContrId + "',BkAcctIntIDSchmAgcyID='" + oData.consumerAccountIDSchemeAgencyID +
						"',BusinessSystemID='" + oData.consumerAccountBusinessSystemID + "')/PostedLoanFinancialTurnover";

					oModel.read(sPostedTurnOversQuery, {
						//	method: "GET",
						// filters: aFilters,
						success: function(oResult) {
							oJsonModel.setData(oResult);
							that._oTurnoverTable.setModel(oJsonModel);

							that._oTurnoverTable.bindItems("/results", that._oTurnoverTableTemplate);
							that._buildPostedTurnoversData(oResult);

						},
						error: function(oError) {
							Log.error("Error on reading in turnovers");
						}

					});
				}
			} 
		},

		_buildPostedTurnoversData: function(oData) {
			var aPostedTurnovers = [];
			var oPostedTurnovers = {
				BankAccountBalanceTypeCode: "",
				BankAccountBalanceTypeName: "",
				BankAccountBillingItemID: "",
				BkAcctIntID: "",
				BkAcctIntIDSchmAgcyID: "",
				BusinessSystemID: "",
				CreditAmount: "",
				DebitAmount: "",
				DueDate: "",
				OrdinalNumberValue: "",
				PaymentDate: "",
				PrenoteCreditAmount: "",
				PrenoteDebitAmount: "",
				ValueDate: "",
				Status: ""
			};
			for (var i = 0; i < oData.results.length; i++) {
				oPostedTurnovers = oData.results[i];
				if (oData.results[i].BankAccountBillingItemID !== null && oData.results[i].BankAccountBillingItemID !== "") {
					oPostedTurnovers.Status = this.getView().getModel("i18n").getProperty("xfld.billed");
				} else if ((oData.results[i].PrenoteDebitAmount.Content !== null && oData.results[i].PrenoteDebitAmount.Content !== "" && oData.results[
						i].PrenoteDebitAmount.Content !== "0.00") ||
					oData.results[i].PrenoteCreditAmount.Content !== null && oData.results[i].PrenoteCreditAmount.Content !== "" && oData.results[i]
					.PrenoteCreditAmount
					.Content !== "0.00"){
					oPostedTurnovers.Status = this.getView().getModel("i18n").getProperty("xfld.planned");
				} else {
					oPostedTurnovers.Status = this.getView().getModel("i18n").getProperty("xfld.posted");
				}
				aPostedTurnovers.push(oPostedTurnovers);
			}
			var oFinalData = {
				results: aPostedTurnovers
			};
			this._bindAggregationObject(oFinalData, "turnoverTblColumnListItem", "tableTurnover");
		},

		_bindAggregationObject: function(oData, sColumnItemList, sTableId) {
			var oJsonModel = new JSONModel();
			var that = this;
			oJsonModel.setData(oData);
			that._oTurnoverTable.setModel(oJsonModel);
			that._oTurnoverTable.bindItems("/results", that._oTurnoverTableTemplate);
		},

		/** Triggered by the table's 'updateFinished' event: after new table data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public*/
		onUpdateFinished: function(oEvent) {},

		onTurnoverSettingsPressed: function(oEvent) {
			var that = this;
			var oSelectedFilterKeys;
			if (that.oTurnoverSortFilterDialog === undefined) {
				that.oTurnoverSortFilterDialog = sap.ui.xmlfragment("TurnoverFragment", "fs.cb.consumerloan.manages1.view.fragment.TurnoverSettings",
					that.getView().getController());
				that.oTurnoverSortFilterDialog.setModel(that.getView().getModel("i18n"), "i18n");
				that.oTurnoverSortFilterDialog.oParentControllerIns = that;
				that.oTurnoverSortFilterDialog.attachConfirm(that.onPerformSortFilterTurnover);
			} else {
				oSelectedFilterKeys = that.oTurnoverSortFilterDialog.getSelectedFilterKeys();
			}
			that._retrieveFilterRecordTurnoverItems(that);
			if (oSelectedFilterKeys !== undefined) {
				that.oTurnoverSortFilterDialog.setSelectedFilterKeys(oSelectedFilterKeys);
			}
			that.oTurnoverSortFilterDialog.setFilterSearchOperator(sap.m.StringFilterOperator.Contains).open();

		},

		onPerformSortFilterTurnover: function(oEvent) {
			utilities.performSortFilterOnTable(this, "tableTurnover");
		},

		_retrieveFilterRecordTurnoverItems: function(oControllerIns) {
			var oPostedTurnoversTbl = this.getView().byId("tableTurnover");
			var oData = oPostedTurnoversTbl.getModel().getData();
			var aDescription = [];
			var aStatus = [];
			if (oData !== undefined && oData !== null && oData.results !== undefined && oData.results.length !== 0) {
				for (var i = 0; i < oData.results.length; i++) {
					aDescription.push(oData.results[i].BankAccountBalanceTypeName);
					aStatus.push(oData.results[i].Status);
				}
			}
			aDescription.sort();
			utilities.fillFilterItems("TurnoverFragment", "turnoverFilterDescription", aDescription);
			aStatus.sort();
			utilities.fillFilterItems("TurnoverFragment", "turnoverFilterStatus", aStatus);
		},

		onChangeTurnoverDateRange: function(oEvent) {
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
			this._onTurnoverBindingUpdate();
		},

		_handleDateRangeSelection: function() {
			var oTurnoverDurationSelect = this.getView().byId("turnoverDurationSelect");
			var oSelectedDateRangeKey = oTurnoverDurationSelect.getSelectedKey();
			var oDate = DateRangeSelection.getDateRangeSelectionByKey(oSelectedDateRangeKey);
			var oTurnoverDateRangeSelection = this.getView().byId("turnoverDateRangeSelection");
			if (oSelectedDateRangeKey === "dateRange") {
				oTurnoverDateRangeSelection.setEditable(true);
				oTurnoverDateRangeSelection.setEnabled(true);

			} else if (oSelectedDateRangeKey === "all") {
				oTurnoverDateRangeSelection.setDateValue(null);
				oTurnoverDateRangeSelection.setSecondDateValue(null);
				oTurnoverDateRangeSelection.setEditable(false);
			} else {
				oTurnoverDateRangeSelection.setDateValue(oDate[0].getJSDate());
				oTurnoverDateRangeSelection.setSecondDateValue(oDate[1].getJSDate());
				oTurnoverDateRangeSelection.setEditable(false);
			}
		}

	});

});
