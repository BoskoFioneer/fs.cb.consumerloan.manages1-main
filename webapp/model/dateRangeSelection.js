sap.ui.define([
	"sap/ui/core/date/UniversalDate"
], function(UniversalDate) {
	"use strict";

	return {

		/**
		 * Returns the month start date of a given universal date
		 * @param {sap.ui.core.date.UniversalDate} [oUniversalDate] the universal date
		 * @returns {sap.ui.core.date.UniversalDate} the month start date of a given universal date.
		 * @public
		 */
		getMonthStartDate: function(oUniversalDate) {
			var oDate = oUniversalDate;
			if (!oDate) {
				oDate = new UniversalDate();
			}
			oDate.setDate(1);
			return oDate;
		},

		/**
		 * Returns the quarter start date of a given universal date
		 * @param {sap.ui.core.date.UniversalDate} [oUniversalDate] the universal date
		 * @returns {sap.ui.core.date.UniversalDate} the quarter start date of a given universal date.
		 * @public
		 */
		getQuarterStartDate: function(oUniversalDate) {
			var oDate = oUniversalDate;
			if (!oDate) {
				oDate = new UniversalDate();
			}
			oDate.setMonth(3 * Math.floor(oDate.getMonth() / 3));
			oDate.setDate(1);
			return oDate;
		},

		/**
		 * Returns the years start date of a given universal date. If no date is given, today is used.
		 * @param {sap.ui.core.date.UniversalDate} [oUniversalDate] the universal date
		 * @returns {sap.ui.core.date.UniversalDate} the years start date of a given universal date.
		 * @public
		 */
		getYearStartDate: function(oUniversalDate) {
			var oDate = oUniversalDate;
			if (!oDate) {
				oDate = new UniversalDate();
			}
			oDate.setMonth(0);
			oDate.setDate(1);
			return oDate;
		},

		/**
		 * Returns the start date and end date for the selected key.
		 * @param {string} [sSelectedKey] selected key
		 * @returns {array} the start and the end date.
		 * @public
		 */
		getDateRangeSelectionByKey: function(sSelectedKey) {
			var oStartDate,
				oEndDate;
			switch (sSelectedKey) {
				case "thisMonth":
					oStartDate = this.getMonthStartDate();
					oEndDate = new UniversalDate(oStartDate);
					oEndDate.setMonth(oEndDate.getMonth() + 1);
					oEndDate.setDate(oEndDate.getDate() - 1);
					break;
				case "thisQuarter":
					oStartDate = this.getQuarterStartDate();
					oStartDate.setMonth(oStartDate.getMonth());
					oEndDate = new UniversalDate(oStartDate);
					oEndDate.setMonth(oEndDate.getMonth() + 3);
					oEndDate.setDate(oEndDate.getDate() - 1);
					break;
				case "thisYear":
					oStartDate = this.getYearStartDate();
					oEndDate = new UniversalDate(oStartDate);
					oEndDate.setFullYear(oEndDate.getFullYear() + 1);
					oEndDate.setDate(oEndDate.getDate() - 1);
					break;

				case "all":
					break;
				default:
			}
			return [oStartDate, oEndDate];
		}

	};
});