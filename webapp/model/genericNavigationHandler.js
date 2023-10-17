sap.ui.define([
	"sap/base/Log"
	], function(Log) {
	"use strict";

	return {
		_mContainers: {},

		/**
		 * Get FLP Personalization Container  
		 * @returns {sap.ushell.services.Personalization} FLP Personalization service
		 */
		getPersonalizationService: function() {
			return sap.ushell.Container.getService("Personalization");
		},

		/**
		 * Get FLP Personalization Service key  
		 * @returns {string} FLP Personalization service Key
		 */
		getGeneratedKey: function() {
			return this.getPersonalizationService().getGeneratedKey();
		},

		/**
		 * Store parameters using Personalization Container  
		 * @param {object} [oComponent] component
		 * @param {string} [sID]	id/key
		 * @param {object} [oParamValues] paramter to be stored
		 * @returns {sap.ushell.services.PersonalizationContainer} Personalization Container
		 */
		storeInnerAppState: function(oComponent, sID, oParamValues) {
		    
		    var oPersonalizationService = this.getPersonalizationService();

			if (!this._mContainers[sID]) {

				var oScope = {
					validity: 0,
					keyCategory: oPersonalizationService.constants.keyCategory.GENERATED_KEY
				};

				var sKey = oPersonalizationService.getGeneratedKey();
				this._mContainers[sID] = sKey;

				return oPersonalizationService.getContainer(sKey, oScope, oComponent)
					.fail(function() {
						Log.error("Loading personalization data failed.");
					})
					.done(function(oContainer) {
						oComponent.oCallContainer = oContainer;
						oComponent.oCallContainer.clear();
						oComponent.oCallContainer.setItemValue("params", oParamValues);

						return oComponent.oCallContainer.save(); // validity = 0 = transient, no roundtrip
					});
			} else {
				return oPersonalizationService.getContainer(this._mContainers[sID])
					.fail(function() {
						Log.error("Loading personalization data failed.");
					})
					.done(function(oContainer) {
						return this;
					});
			}
		},

		/**
		 * Get Personalization Container 
		 * @param {string} [sContainerId] container key
		 * @returns {sap.ushell.services.PersonalizationContainer} Personalization Container
		 */
		getInnerAppState: function(sContainerId) {
			var oPersonalizationService = this.getPersonalizationService();

			return oPersonalizationService.getContainer(sContainerId)
				.fail(function() {
					Log.error("Loading personalization data failed.");
				})
				.done(function(oContainer) {
					return this;
				});
		}
	};

});