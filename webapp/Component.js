sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"fs/cb/consumerloan/manages1/model/models",
	"fs/cb/consumerloan/manages1/controller/ErrorHandler",
	"fs/cb/consumerloan/manages1/model/genericNavigationHandler",
	"sap/ui/core/routing/HashChanger",
	"sap/base/Log"
], function(UIComponent, Device, JSONModel, models, ErrorHandler, genericNavigationHandler, HashChanger, Log) {
	"use strict";

	return UIComponent.extend("fs.cb.consumerloan.manages1.Component", {
		genericNavigationHandler: genericNavigationHandler,
		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");

			//setting a mainModel, that contains reusable IDs
			var oMainModel = new JSONModel({
				BkAccContrId: "",
				AcctHldrPartyInternalID: "",
				OplBkContrMgmtUnitID: "",
				consumerAccountBkAcctID: "",
				consumerAccountBusinessSystemID: "",
				consumerAccountID: "",
				consumerAccountIDSchemeAgencyID: "",
				consumerAccountIDSchemeID: "",
				consumerAccountStandardID: "",
				BkAcctInternalID: ""
			});

			this.setModel(oMainModel, "mainModel");
			// sap.ui.getCore().setModel(oMainModel, "mainModel");

			// create the views based on the url/hash
			this.getRouter().initialize();

			var oComponentData = this.getComponentData();
			// If started with parameters -> navigate to the respective account
			if (oComponentData && oComponentData.startupParameters) {

				// to construct the correct URL all parameters defined in the routes's pattern have to be provided to the getURL
				// function:
				var startparams = (oComponentData.startupParameters || {});
				var aAppState = (oComponentData["sap-xapp-state"] || []);
				// startparams should be ignored if there is inner app navigation to avoid that incorrect (previous) account data is displayed
				var hashChanger = HashChanger.getInstance();
				var sHash = hashChanger.getHash();
				if (!sHash || sHash === "") {
					// if only the account uuid provided / no sap-xapp-state
					var sBkAcctInternalID, sAppState;
					if (startparams.BkAcctInternalID && aAppState.length === 0) {
						sBkAcctInternalID = (startparams.BkAcctInternalID instanceof Array ? startparams.BkAcctInternalID[0] : startparams.BkAcctInternalID
							.toString());
						this.navToAccountByInternalID(sBkAcctInternalID, true);
					}

					// the account uuid and sap-xapp-state both provided
					if (startparams.BkAcctInternalID && aAppState.length === 1) {
						sAppState = aAppState[0].toString();
						sBkAcctInternalID = (startparams.BkAcctInternalID instanceof Array ? startparams.BkAcctInternalID[0] : startparams.BkAcctInternalID
							.toString());
						this.getRouter().navTo("displayAccountWithAppState", {
							iAppState: sAppState,
							sBkAcctInternalID: sBkAcctInternalID
						}, true);
					}
				}
			}
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		/**
		 * This method can be called to determine the component name
		 * @public
		 * @return {string} component name
		 */
		getComponentName: function() {

			var sName = this.getManifestObject().getComponentName();

			return sName;
		},

		/**
		 * Uses the search service to determine all parameters of the account using the Account UUID,
		 * store the parameter into the container and navigate to  respective route		 
		 * @param {string} [sBkAcctInternalID] Account UUID
		 * @param {boolean} [bReplace]	Controls browser history:
		 *								true -> replace hash without adding to browser history
		 *								false -> replace hash with adding to browser history 
		 */
		navToAccountByInternalID: function(sBkAcctInternalID, bReplace) {

			var that = this;
			var onSuccess = function(oData, oResponse) {
				var oParamValues = this._extractContainerParamValues(oData);
				// save the InnerAppState and navigate 
				genericNavigationHandler.storeInnerAppState(this, sBkAcctInternalID, oParamValues).then(function(oContainer) {
					// that.getRouter().getTargets().display("displayAccount"); // workaround if route not changed -> e.g. previouws target was an error page
					that.getRouter().navTo("displayAccountWithAppState", {
						iAppState: oContainer.getKey(),
						sBkAcctInternalID: sBkAcctInternalID
					}, bReplace);
				}, function(oError) {
					Log.error("Error by storing the inner-app state.", oError, that.getComponentName());
					Log.debug("Error by storing the inner-app state with the following paramaters: " + JSON.stringify(oParamValues),
						that.getComponentName());
					that.getRouter().getTargets().display("error");
				});
			};
			var onError = function(oError) {
				Log.error("Error backend call of the search service usings search term", that.getComponentName());
				if (oError && oError.statusCode === "404") {
					that.getRouter().getTargets().display("notFound");
				} else {
					that.getRouter().getTargets().display("error");
				}
			};

			this.executeBySearchComponent(function(oSearchComponent) {
				oSearchComponent.readEntityByKey(sBkAcctInternalID, {
					success: onSuccess.bind(that),
					error: onError.bind(that)
				});
			});

		},

		/**
		 * Set the account search component instance
		 * @public
		 * @param {object} [oComponent] component instance
		 */
		setSearchComponent: function(oComponent) {
			this._oSearchComponent = oComponent;
		},

		/**
		 * Return the account search component instance
		 * @public
		 * @return {object} component instance
		 */
		getSearchComponent: function() {
			return this._oSearchComponent;
		},

		/**
		 * Wait till search component is initialized and execute given function
		 * @public
		 * @param {function} [fnCallBack] function to be executed
		 */
		executeBySearchComponent: function(fnCallBack) {

			var that = this;

			(function waitForSearchComponent() {
				if (that._oSearchComponent) {
					fnCallBack(that._oSearchComponent);
				} else {
					setTimeout(function() {
						waitForSearchComponent();
					}, 0);
				}
			})();
		},
		
		/**
		 * Gets configuration for account search 
		 * @private
		 * @param {string} [sDefaultEntitySet] the default entity type for the account search component
		 * @param {string} [sConfigParameter] parameter name of tile configuration to derive entity set e.g.
		 * entity_set_search_acct_main
		 * entity_set_search_acct_read 
		 * entity_set_search_acct_vhlp 
		 * @returns {string} EntitySet		 
		 */
		getSearchEntitySetName: function(sDefaultEntitySet, sConfigParameter) {
			var oStartParams = this.getComponentData().startupParameters;

			if (oStartParams[sConfigParameter] && oStartParams[sConfigParameter] !== "") {
				return oStartParams[sConfigParameter].toString();
			} else {
				return sDefaultEntitySet;
			}
		},

		/* =========================================================== */
		/* Private methods                                             */
		/* =========================================================== */

		/**
		 * Extract parameter for the container from the rsult of the search service  
		 * @public
		 * @param {string} [oSearchEntity] Entity object
		 * @return {object} paramater map of the following structure
		 * 	{
					consumerAccountID: "",
					consumerAccountIDSchemeID: "",
					consumerAccountIDSchemeAgencyID: "",
					consumerAccountBusinessSystemID:"",
					consumerAccountBkAcctID: "",
					AcctHldrPartyInternalID: "",
					OplBkContrMgmtUnitID: "" 
			}	
		 */
		_extractContainerParamValues: function(oSearchEntity) {

			if (oSearchEntity) {

				var oParamValues = {};

				if (oSearchEntity.ID) {
					oParamValues.consumerAccountID = oSearchEntity.ID;
				} else {
					return undefined;
				}

				if (oSearchEntity.IDSchemeID) {
					oParamValues.consumerAccountIDSchemeID = oSearchEntity.IDSchemeID;
				} else {
					return undefined;
				}

				if (oSearchEntity.IDSchemeAgencyID) {
					oParamValues.consumerAccountIDSchemeAgencyID = oSearchEntity.IDSchemeAgencyID;
				} else {
					return undefined;
				}

				if (oSearchEntity.BusinessSystemID) {
					oParamValues.consumerAccountBusinessSystemID = oSearchEntity.BusinessSystemID;
				} else {
					return undefined;
				}

				if (oSearchEntity.BkAcctID) {
					oParamValues.consumerAccountBkAcctID = oSearchEntity.BkAcctID;
				} else {
					return undefined;
				}

				if (oSearchEntity.BkAcctStandardID) {
					oParamValues.consumerAccountStandardID = oSearchEntity.BkAcctStandardID;
				} else {
					oParamValues.consumerAccountStandardID = oSearchEntity.BkAcctStandardID;
				}

				if (oSearchEntity.BankAccountInternalID) {
					oParamValues.BkAcctInternalID = oSearchEntity.BankAccountInternalID;
				} else {
					oParamValues.BkAcctInternalID = oSearchEntity.BankAccountInternalID;
				}
				if (oSearchEntity.AcctHldrPartyInternalID) {
					oParamValues.AcctHldrPartyInternalID = oSearchEntity.AcctHldrPartyInternalID;
				} else {
					return undefined;
				}

				if (oSearchEntity.OplBkContrMgmtUnitID) {
					oParamValues.OplBkContrMgmtUnitID = oSearchEntity.OplBkContrMgmtUnitID;
				} else {
					return undefined;
				}

				return oParamValues; // return parameters in case all available

			} else {
				return undefined;
			}

		}

	});
});