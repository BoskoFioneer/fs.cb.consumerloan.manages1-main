sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"fs/cb/consumerloan/manages1/model/PercentageType",
	"sap/ui/model/json/JSONModel",
	"fs/cb/consumerloan/manages1/model/utilities",
	"fs/cb/consumerloan/manages1/model/formatter"

], function(Controller, PercentageType,JSONModel, utilities, formatter) {
	"use strict";

	return Controller.extend("fs.cb.consumerloan.manages1.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Event Handler for navButtonPress
		 * - Execute check for unsaved changes
		 * - If a history entry available, history.go(-1) will happen.
		 * - If a history entry not available, navigate to FLP home
		 * @public
		 */
		onNavBack: function() {

			// Callback function to be executed in case there are no unsaved changes
			var fnCallback = function() {

				var oHistory = sap.ui.core.routing.History.getInstance(),
					sPreviousHash = oHistory.getPreviousHash(),
					oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) { // The history contains a previous entry
					if (oCrossAppNavigator && oCrossAppNavigator.historyBack) {
						oCrossAppNavigator.historyBack();
					} else {
						/*eslint-disable*/
						history.go(-1);
						/*eslint-enable*/
					}
				} else if (oCrossAppNavigator) { // Navigate back to FLP home as fallback
					oCrossAppNavigator.toExternal({
						target: {
							shellHash: "#"
						}
					});
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));

		},

		/**
		 * Convenience method to check if there are changes in domain OData model
		 * Show data loss confirmation dialog in case there are unsaved changes
		 * If no changes or data loss confirmed, execute callback function
		 * @public
		 * @param {function} fnFunction The function to call after checks
		 */
		checkForChangesAndExecute: function(fnFunction) {
			fnFunction();
		},

		/**
		 * Initialize and set internal model with the name tableView
		 * to handle updates the table counter and table state's.
		 * @param {sap.m.Table} [oTable] table
		 * @param {String} [sI18NTableTitle] i18n property key for table title
		 * @param {String} [sI18NTableTitleCount] i18n property key for table title with count
		 * @param {String} [sI18NTableNoDataText] i18n property key for table no data text
		 * @public
		 */
		initTableModel: function(oTable, sI18NTableTitle, sI18NTableTitleCount, sI18NTableNoDataText) {

			// Put down table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			var iOriginalBusyDelay = oTable.getBusyIndicatorDelay();

			// Model used to manipulate control states
			var oViewModel = new JSONModel({
				tableTitle: this.getResourceBundle().getText(sI18NTableTitle),
				tableTitleI18n: sI18NTableTitle,
				tableTitleCountI18n: sI18NTableTitleCount,
				tableNoDataText: this.getResourceBundle().getText(sI18NTableNoDataText),
				tableBusyDelay: 0
			});
			oTable.setModel(oViewModel, "tableView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});

		},

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.m.Table} [oTable] table control
		 * @param {integer} [iTotalItems] number of total items
		 * @public
		 */
		updateTableModel: function(oTable, iTotalItems) {

			// update the table counter after the table update
			var sTitle;

			var sTableTitleI18n = oTable.getModel("tableView").getProperty("/tableTitleI18n");
			var sTableTitleCountI18n = oTable.getModel("tableView").getProperty("/tableTitleCountI18n");

			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText(sTableTitleCountI18n, [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText(sTableTitleI18n);
			}

			oTable.getModel("tableView").setProperty("/tableTitle", sTitle);
		},

		//  * Convenience method to navigate to the corresponding route after check if there are any unsaved changes
		//* @public
		//* @param {string} sRouteName	Route Name
		//* @param {string} mParameters	Route Parameters
		//* @param {boolean} bReplace	Controls browser history:
		//*								true -> replace hash without adding to browser history
		//*								false -> replace hash with adding to browser history
		//*/
		navTo: function(sRouteName, mParameters, bReplace) {

			// Callback function to be executed in case there are no unsaved changes
			var fnCallback = function() {
				if (sRouteName) {
					this.getRouter().navTo(sRouteName, mParameters, bReplace);
				} else {
					// if there is no value in the input, a corresponding ftd is not searched,
					// instead the start page is displayed directly 
					this.getRouter().navTo("start");
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));

		},

		/**
		 * Navigate using external navigation
		 * check first if any changes on ui
		 * @function
		 * @param {string} [sSemanticObject] 	Name of the Semantic object
		 * @param {string} [sAction]	Name of the action
		 * @param {string} [oParams]	Parameter map to be passed through
		 * @param {string} [sAppStateKey]	Parameter map to be passed through
		 * @public
		 */
		navToExternal: function(sSemanticObject, sAction, oParams, sAppStateKey) {

			var fnCallback = function() {
				var oCrossAppNav = this.getCrossAppNav();
				if (oCrossAppNav) {
					var nav = {
						target: {
							semanticObject: sSemanticObject,
							action: sAction
						},
						params: oParams,
						appStateKey: sAppStateKey
					};
					oCrossAppNav.isNavigationSupported([nav]).done(function(aResponses) {
							if (aResponses && aResponses.length > 0 && aResponses[0].supported === true) {
								oCrossAppNav.toExternal(nav);
							}
						})
						.fail(function(o) {

						});
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));

		},

		callbackIsCrossAppNavigationSupported: function(fnCallback, sSemanticObject, sAction, oParams) {
			if (!fnCallback || !sSemanticObject || !sAction) {
				return;
			}
			var oCrossAppNav = this.getCrossAppNav();

			if (oCrossAppNav) {
				var nav = {
					target: {
						semanticObject: sSemanticObject,
						action: sAction
					},
					params: oParams
				};
				oCrossAppNav.isNavigationSupported([nav]).done(function(aResponses) {
						if (aResponses && aResponses.length > 0 && aResponses[0].supported === true) {
							fnCallback(true, sSemanticObject, sAction, oParams);
						} else {
							fnCallback(false, sSemanticObject, sAction, oParams);
						}
					})
					.fail(function(o) {
						fnCallback(false, sSemanticObject, sAction, oParams);
					});
			} else {
				fnCallback(false, sSemanticObject, sAction, oParams);
			}
		},

		getCrossAppNav: function() {
			if (!this.oCrossAppNav) {
				this.oCrossAppNav = sap.ushell && sap.ushell.Container &&
					sap.ushell.Container.getService &&
					sap.ushell.Container.getService("CrossApplicationNavigation");
			}
			return this.oCrossAppNav;
		},

		deleteStartingZeros: function(sTxt) {
			var sChangedTxt;
			if (sTxt) {
				sChangedTxt = sTxt.replace(/^0+/, "");
			}
			return sChangedTxt;
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}
	});

});