sap.ui.define([
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"fs/cb/consumerloan/manages1/model/formatter"
], function(Device, JSONModel, MessageBox, formatter) {
	"use strict";

	// Resolve content density class
	var sContentDensityClass = (function() {

		var sCozyClass = "sapUiSizeCozy",
			sCompactClass = "sapUiSizeCompact";

		var oBody = jQuery(document.body);

		if (oBody.hasClass(sCozyClass) || oBody.hasClass(sCompactClass)) { // density class is already set by the FLP
			return "";
		} else {
			return Device.support.touch ? sCozyClass : sCompactClass;
		}
	}());

	return {
		formatter: formatter,

		/**
		 * Get resolved content density class
		 * Could be used for (root) views 
		 * 
		 * this.getView().addStyleClass(utilities.getContentDensityClass());
		 */

		getContentDensityClass: function() {
			return sContentDensityClass;
		},

		/**
		 * Sync models and content density class between view and dependent controls e.g. popovers and dialogs
		 * Register the controls for dependent lifecicly of the view (control to be destroyed with the view)
		 * 
		 * utilities.attachControlToView(this.getView(), this._oDialog);
		 * 
		 * @param {sap.ui.core.mvc.View} [oView] view control to be synced with
		 * @param {sap.ui.core.PopupInterface} [oControl] control to be synced with the view
		 */
		attachControlToView: function(oView, oControl) {
			jQuery.sap.syncStyleClass(sContentDensityClass, oView, oControl);
			oView.addDependent(oControl);
		},

		// ==========================================================================================
		// Private functions
		// ==========================================================================================

		performSortFilterOnTable: function(oControllerIns, sTableId) {
			var oTableBinding = oControllerIns.oParentControllerIns.byId(sTableId).getBinding("items");
			// Sort table
			if (oTableBinding) {
				if (oControllerIns.getSelectedSortItem() !== null) {
					var oSortKey = sap.ui.getCore().getElementById(oControllerIns.getSelectedSortItem()).getKey();
					var oModel = new sap.ui.model.Sorter(oSortKey,
						oControllerIns.getSortDescending());
					oTableBinding.sort(oModel);
				}
				var oFilter = [];
				// delete the existing filters.
				oTableBinding.detachFilter();
				oTableBinding.filter(oFilter);
				// filter table
				if (oControllerIns.getSelectedFilterItems().length !== 0) {
					var oFilterKey = oControllerIns.getSelectedFilterItems();
					for (var i = 0; i < oFilterKey.length; i++) {
						var sKey = oFilterKey[i].getKey();
						var oColumnToFilter = oFilterKey[i].getParent();
						var oFilterItem = new sap.ui.model.Filter(oColumnToFilter.getKey(), "EQ", sKey);
						oFilter.push(oFilterItem);
					}
					oTableBinding.filter(oFilter);
				}

			}
		},

		eliminateDuplicatesRecords: function(aIn) {
			var i;
			var iLength = aIn.length,
				aOut = [],
				oObj = {};
			for (i = 0; i < iLength; i++) {
				oObj[aIn[i]] = 0;
			}
			for (i in oObj) {
				/*if ({}.hasOwnProperty.call(i, i)) {*/
				aOut.push(i);
				/*}*/
			}
			return aOut;
		},

		fillFilterItems: function(fragmentId, sFilterItem, aIn) {

			var oFilterItem = sap.ui.core.Fragment.byId(fragmentId, sFilterItem);

			// remove all previous records
			oFilterItem.removeAllItems();
			// delete duplicate entries in the input if any.
			var aFilterItem = this.eliminateDuplicatesRecords(aIn);
			if (aFilterItem !== undefined && aFilterItem.length !== 0) {
				for (var i = 0; i < aFilterItem.length; i++) {
					var oItem = new sap.m.ViewSettingsItem({
						text: aFilterItem[i],
						key: aFilterItem[i]
					});
					oFilterItem.addItem(oItem);
				}
			}
		}
	};
});