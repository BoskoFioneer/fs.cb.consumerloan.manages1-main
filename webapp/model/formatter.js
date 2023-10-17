sap.ui.define([
	"sap/ui/core/format/NumberFormat",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/core/format/DateFormat"
], function(NumberFormat, ResourceModel, DateFormat) {
	"use strict";

	return {

		/**
		 * Format Amount as 5 EUR allways with currency after amount like
		 * sap.m.ObjectNumber. Should be used if amount is part of a text
		 * @public
		 * @param {string} [sAmount] amount
		 * @param {string} [sCurrency] Currency of amounts
		 * @returns {string} formatted amount depending on browser local with space and currency
		 */
		formatAmountText: function(sAmount, sCurrency) {

			if (sAmount && sCurrency) {
				var oCurrencyFormat = NumberFormat.getCurrencyInstance({
					showMeasure: false
				});
				return oCurrencyFormat.format(sAmount, sCurrency) + " " + sCurrency;
			} else {
				return "";
			}

		},

		/**
		 * Format Date in texts
		 * @public
		 * @param {string} [sDate] Date
		 * @returns {string} formatted Date text 
		 */
		getFormattedDate: function(sDate) {
			if (sDate) {
				var dateFormatter = DateFormat.getDateInstance({
					style: "medium"
				});
				return dateFormatter.format(sDate);
			}
		},

		formatDate: function(sDate) {
			if (sDate) {
				var oDateFormatter = DateFormat.getDateInstance({
					UTC: true,
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});
				return oDateFormatter.format(sDate, false);
			}
		},
		/**
		 * Format NoText
		 * @public
		 * @param {string} [sPropertyValue] Date
		 * @returns {string} formatted NoText 
		 */
		formatNoText: function(sPropertyValue) {
			if (!sPropertyValue) {

				var oResourceBundle = this.getModel("i18n").getResourceBundle();
				var sNoTextValue = oResourceBundle.getText("xtxt.noPropertyValueText");

				return sNoTextValue;

			} else {
				return sPropertyValue;
			}
		},
		getClearingStatus: function (DirectDebitCollectionInitiatedIndicator) {

				var oResourceBundle = this.getModel("i18n").getResourceBundle(),
					sClearingStatus;

				if (DirectDebitCollectionInitiatedIndicator === false) {
					sClearingStatus = oResourceBundle.getText("xtxt.open");

				} else if (DirectDebitCollectionInitiatedIndicator === true) {
					sClearingStatus = oResourceBundle.getText("xtxt.locked");
				} else {
					sClearingStatus = "";
				}

				return sClearingStatus;
			},

	};

});