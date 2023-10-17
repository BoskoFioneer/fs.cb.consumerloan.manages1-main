sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fs/cb/consumerloan/manages1/model/utilities",
	"fs/cb/consumerloan/manages1/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"fs/cb/consumerloan/manages1/model/dateRangeSelection",
	"sap/base/Log"
], function (BaseController, JSONModel, utilities, formatter, Filter, FilterOperator, dateRangeSelection, Log) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.Receivables", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oReceivablesTbl = this.byId("tableReceivables");
			this._oReceivablesTable = oReceivablesTbl;
			this.initTableModel(oReceivablesTbl, "xtit.itemsTableTitle", "xtit.itemsTableTitleCount", "ymsg.itemsTableNoDataText");

			this._oReceivablesTableTemplate = this.getView().byId("tableReceivablesColItem").clone();

			this._onReceivablesBindingUpdate();
			this.noDataText = this.getResourceBundle().getText("ymsg.itemsTableNoDataText");

			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.subscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onOpenBindingUpdate, this);
			var oModel = this.getOwnerComponent().getModel();
			// Creates bacth group for updates
			oModel.setChangeGroups({
				"Receivables": {
					groupId: "oReceivablesTblGroup"
				}
			});
		},

		onExit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.unsubscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onOpenBindingUpdate, this);

			// if (this.oReceivablesSortFilterDialog !== undefined) {

			// 	this.oReceivablesSortFilterDialog.destroy();
			// 	this.oReceivablesSortFilterDialog = undefined;
			// }

		},

		/* =================	========================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler on bindingUpdated event on app channel
		 * Update binding in object header for account holder and contract manager
		 * @public
		 * @param {string} [sChannelId] The channel of the fired event: "fs.cb.consumerloan.manages1"
		 * @param {sEvent} [sEventId] The EventId of the fired event: "consumerBindingUpdated"
		 * @param {object} [oData] Parameters
		 */
		onOpenBindingUpdate: function (sChannelId, sEventId, oData) {
			if (sChannelId === "fs.cb.consumerloan.manages1" && sEventId === "consumerBindingUpdated") {

				if (this.oReceivablesSortFilterDialog !== undefined) {

					this.oReceivablesSortFilterDialog.destroy();
					this.oReceivablesSortFilterDialog = undefined;
				}

				var oModel = this.getOwnerComponent().getModel();
				var oDateModel = new JSONModel();
				this.getView().setModel(oDateModel, "dateModel");
				this.getView().byId("oReceivablesTblDateSelect").setSelectedKey("thisQuarter");
				var oReceivablesDateRangeSelection = this.getView().byId("oReceivablesTblDateRangeSelection");
				oReceivablesDateRangeSelection.setDateValue(null);
				oReceivablesDateRangeSelection.setSecondDateValue(null);
				oReceivablesDateRangeSelection.setEditable(false);

				var that = this;
				var oJsonModel = new JSONModel();
				this._handleDateRangeSelection(); // fall back handle date range selection

				that._oReceivablesTable.unbindItems();
				var aAblFilters = [];
				var url = "/Receivables";
				var dDateValue = oReceivablesDateRangeSelection.getDateValue();
				var dSecondDateValue = oReceivablesDateRangeSelection.getSecondDateValue();
				if (dDateValue && dSecondDateValue) {
					aAblFilters.push(
						new Filter("BusinessSystemId", FilterOperator.EQ, oData.consumerAccountBusinessSystemID),
						new Filter("BkAcctintIdSchmAgcyId", FilterOperator.EQ, oData.consumerAccountIDSchemeAgencyID),
						new Filter("BkAcctIntId", FilterOperator.EQ, oData.BkAccContrId),
						new Filter("WrkngDayAdjstdBllAmntPymntDue", FilterOperator.BT, formatter.formatDate(dDateValue),
							formatter.formatDate(dSecondDateValue)));
					aAblFilters[3].oValue1 = aAblFilters[3].oValue1.slice(0, 10);
					aAblFilters[3].oValue2 = aAblFilters[3].oValue2.slice(0, 10);
					oModel.read(url, {
						method: "GET",
						filters: aAblFilters,
						groupId: "oReceivablesTblGroup",
						success: function (oResult) {
							that._oReceivablesTable.setNoDataText(that.noDataText);
							oJsonModel.setData(oResult);
							that._oReceivablesTable.setModel(oJsonModel);
							that.oReceivablesTblTable = oResult;

							that._oReceivablesTable.bindItems("/results", that._oReceivablesTableTemplate);

						},
						error: function (oError) {
							var oResult = {
								results: ""
							};
							that.oReceivablesTblTable = oResult;

							Log.error("Error in reading Receivables ");
							that._oReceivablesTable.destroyItems();
							that._oReceivablesTable.setNoDataText(this.getResourceBundle().getText("ymsg.BillingItms"));
						}
					});
				}
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
		onUpdateFinished: function (oEvent) {
			// update the table counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");

			this.updateTableModel(oTable, iTotalItems);
		},

		//* Event handler for more details action in Receivables table
		//* Creates a quick overview and displays additional payment item information
		//* @public
		//*/
		onPaymentItemMoreDetails: function (oEvent) {

			var oReceivableRefModel;

			var oReceivablesDetails = {
				"HolderName": oEvent.getSource().getBindingContext().getProperty("CounterPartyBankAccount/HolderName"),
				"ID": oEvent.getSource().getBindingContext().getProperty("CounterPartyBankAccount/ID"),
				"StandardID": oEvent.getSource().getBindingContext().getProperty("CounterPartyBankAccount/StandardID"),
				"BkStandardID": oEvent.getSource().getBindingContext().getProperty("CounterPartyBankAccount/BkStandardID"),
				"BkRoutingID": oEvent.getSource().getBindingContext().getProperty("CounterPartyBankAccount/BkRoutingID"),
				"BkCountryCode": oEvent.getSource().getBindingContext().getProperty("CounterPartyBankAccount/BkCountryCode"),
				"BkName": oEvent.getSource().getBindingContext().getProperty("CounterPartyBankAccount/BkName"),

				"DirectDebitMandtID": oEvent.getSource().getBindingContext().getProperty("DirectDebitMandate/ID"),
				"DirectDebitMandtCrdtrPtyID": oEvent.getSource().getBindingContext().getProperty("DirectDebitMandate/CreditorPartyID"),

				"PymtTrnInstrnTypeName": oEvent.getSource().getBindingContext().getProperty("PaymentTransactionInstructionTypeName")
			};

			if (!this._oReceivablesDetails) {
				var oCardModel = new JSONModel({
					open: true,
					loading: false
				});
				this._oReceivablesDetails = sap.ui.xmlfragment(this.getView().getId(),
					"fs.cb.consumerloan.manages1.view.fragment.ReceivablesMoreDetails",
					this, {
						afterOpen: oCardModel.setProperty.bind(oCardModel, "/open", true),
						afterClose: oCardModel.setProperty.bind(oCardModel, "/open", false),
						dataRequested: oCardModel.setProperty.bind(oCardModel, "/loading", true),
						change: oCardModel.setProperty.bind(oCardModel, "/loading", false)
					});
				this._oReceivablesDetails.setModel(oCardModel, "cardModel");
				utilities.attachControlToView(this.getView(), this._oReceivablesDetails);
			}

			if (!this._oReceivablesDetails.getModel("moreDetailsModel")) {
				oReceivableRefModel = new JSONModel(oReceivablesDetails);
				this._oReceivablesDetails.setModel(oReceivableRefModel, "moreDetailsModel");
			} else {
				this._oReceivablesDetails.getModel("moreDetailsModel").setData(oReceivablesDetails);
			}

			// this._oReceivablesDetails.openBy(oEvent.getSource());
			this._oReceivablesDetails.openBy(oEvent.getParameters("domRef").domRef);

		},

		onReceivablesSettingsPressed: function (oEvent) {
			var that = this;
			var oSelectedFilterKeys;
			if (that.oReceivablesSortFilterDialog === undefined) {
				that.oReceivablesSortFilterDialog = sap.ui.xmlfragment("ReceivablesFragment",
					"fs.cb.consumerloan.manages1.view.fragment.ReceivablesSettings",
					that.getView().getController());

				that.oReceivablesSortFilterDialog.setModel(that.getView().getModel("i18n"), "i18n");
				that.oReceivablesSortFilterDialog.oParentControllerIns = that;

				that.oReceivablesSortFilterDialog.attachConfirm(that.onPerformSortFilterReceivables);
			} else {
				oSelectedFilterKeys = that.oReceivablesSortFilterDialog.getSelectedFilterKeys();
			}
			that._retrieveFilterRecordItemsReceivables(that);
			if (oSelectedFilterKeys !== undefined) {
				that.oReceivablesSortFilterDialog.setSelectedFilterKeys(oSelectedFilterKeys);
			}
			that.oReceivablesSortFilterDialog.setFilterSearchOperator(sap.m.StringFilterOperator.Contains).open();
		},

		/**
		 * Event handler for Change Event of Receivables DateRangeSelection Control
		 * Validates the DateRangeSelection control values and rebinds the table
		 * @public
		 * @param {object} [oEvent] Payment item posting date range selection
		 */
		onChangeReceivablesDateSelect: function (oEvent) {
			this._handleDateRangeSelection();
			if (this.getView().byId("oReceivablesTblDateSelect") &&
				this.getView().byId("oReceivablesTblDateSelect").getSelectedKey() &&
				this.getView().byId("oReceivablesTblDateSelect").getSelectedKey() !== "dateRange")

				this._onReceivablesBindingUpdate();
		},

		onChangeReceivablesDateRange: function (oEvent) {
			/*	var oReceivablesDateRangeSelection = this.getView().byId("oReceivablesTblDateRangeSelection");
				var sDateFrom = oReceivablesDateRangeSelection.getDateValue();
				var sDateTo = oReceivablesDateRangeSelection.getSecondDateValue();
				this._applyFilterOnReceivables(sDateFrom, sDateTo);*/
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
			this._onReceivablesBindingUpdate();

		},

		onPerformSortFilterReceivables: function (oEvent) {
			utilities.performSortFilterOnTable(this, "tableReceivables");
		},

		/* =========================================================== */
		/* Private methods                                             */
		/* =========================================================== */

		_onReceivablesBindingUpdate: function () {
			var that = this;
			this._handleDateRangeSelection(); // fall back handle date range selection
			var oMainModel = this.getOwnerComponent().getModel("mainModel");
			var aAblFilters = [];
			var url = "/Receivables";
			var oReceivablesTblDateSelection = this.getView().byId("oReceivablesTblDateRangeSelection");
			var dDateValue = oReceivablesTblDateSelection.getDateValue();
			var dSecondDateValue = oReceivablesTblDateSelection.getSecondDateValue();
			var oModel = that.getOwnerComponent().getModel();
			var oJsonModel = new JSONModel();
			var dateRange = that.getView().byId("oReceivablesTblDateRangeSelection");
			if (dateRange._bValid) {
				dateRange.setValueState(sap.ui.core.ValueState.None);
				if (dDateValue && dSecondDateValue) {
					aAblFilters.push(
						new Filter("BusinessSystemId", FilterOperator.EQ, oMainModel.getProperty("/consumerAccountBusinessSystemID")),
						new Filter("BkAcctintIdSchmAgcyId", FilterOperator.EQ, oMainModel.getProperty("/consumerAccountIDSchemeAgencyID")),
						new Filter("BkAcctIntId", FilterOperator.EQ, oMainModel.getProperty("/BkAcctIntID")),
						new Filter("WrkngDayAdjstdBllAmntPymntDue", FilterOperator.BT, formatter.formatDate(dDateValue),
							formatter.formatDate(dSecondDateValue)));
					aAblFilters[3].oValue1 = aAblFilters[3].oValue1.slice(0, 10);
					aAblFilters[3].oValue2 = aAblFilters[3].oValue2.slice(0, 10);
					that._oReceivablesTable.unbindItems();
				} else if (!dDateValue && !dSecondDateValue) {

					aAblFilters.push(
						new Filter("BusinessSystemId", FilterOperator.EQ, oMainModel.getProperty("/consumerAccountBusinessSystemID")),
						new Filter("BkAcctintIdSchmAgcyId", FilterOperator.EQ, oMainModel.getProperty("/consumerAccountIDSchemeAgencyID")),
						new Filter("BkAcctIntId", FilterOperator.EQ, oMainModel.getProperty("/BkAcctIntID")));
				} else {
					dateRange.setValueState(sap.ui.core.ValueState.Error);
				}
				oModel.read(url, {
					method: "GET",
					filters: aAblFilters,
					success: function (oResult) {
						that._oReceivablesTable.setNoDataText(that.noDataText);
						oJsonModel.setData(oResult);
						that._oReceivablesTable.setModel(oJsonModel);
						that.oReceivablesTblTable = oResult;

						that._oReceivablesTable.bindItems("/results", that._oReceivablesTableTemplate);

					},
					error: function (oError) {
						var oResult = {
							results: ""
						};
						that.oReceivablesTblTable = oResult;

						Log.error("Error in reading Receivables ");
						that._oReceivablesTable.destroyItems();
						that._oReceivablesTable.setNoDataText(this.getResourceBundle().getText("ymsg.BillingItms"));
					}
				});

			} else {
				dateRange.setValueState(sap.ui.core.ValueState.Error);
			}

		},

		_bindReceivables: function (oData) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);
			var that = this;

			that._oReceivablesTable.setModel(oModel);
			that._oReceivablesTable.bindItems("/results", that._oReceivablesTableTemplate);
		},
		/**
		 * handle the Receivable date range selection	 
		 * @function
		 * @private
		 */
		_handleDateRangeSelection: function () {
			var oReceivablesDateSelect = this.getView().byId("oReceivablesTblDateSelect");
			var oSelectedDateRangeKey = oReceivablesDateSelect.getSelectedKey();
			var oDate = dateRangeSelection.getDateRangeSelectionByKey(oSelectedDateRangeKey);
			var oReceivablesDateRangeSelection = this.getView().byId("oReceivablesTblDateRangeSelection");

			if (oSelectedDateRangeKey === "dateRange") {
				oReceivablesDateRangeSelection.setEditable(true);
				oReceivablesDateRangeSelection.setEnabled(true);

			} else if (oSelectedDateRangeKey === "all") {
				oReceivablesDateRangeSelection.setDateValue(null);
				oReceivablesDateRangeSelection.setSecondDateValue(null);
				oReceivablesDateRangeSelection.setEditable(false);
			} else {
				oReceivablesDateRangeSelection.setDateValue(oDate[0].getJSDate());
				oReceivablesDateRangeSelection.setSecondDateValue(oDate[1].getJSDate());
				oReceivablesDateRangeSelection.setEditable(false);
			}

		},
		_retrieveFilterRecordItemsReceivables: function (oControllerIns) {
			var oReceivablesTbl = this.getView().byId("tableReceivables");
			var oData = oReceivablesTbl.getModel().getData();
			var aDescription = [];
			if (oData !== undefined && oData !== null && oData.results !== undefined && oData.results.length !== 0) {
				for (var i = 0; i < oData.results.length; i++) {
					if (oData.results[i].Typename !== "") {
						aDescription.push(oData.results[i].Typename);
					}
				}
			}
			aDescription.sort();
			utilities.fillFilterItems("ReceivablesFragment", "ReceivablesFilterDescription", aDescription);
		}

	});

});