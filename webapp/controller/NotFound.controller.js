sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.NotFound", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit: function() {
			this.getView().setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for press event on link on the message page
		 * Navigate to the start
		 * @public
		 */
		onLinkPressed: function() {
			this.navTo("start");
		},
		/* =========================================================== */
		/* Public methods                                              */
		/* =========================================================== */

		/**
		 * get Error Message to be displayed on the error page
		 * @param {model} [oMessageModel] message model
		 * @return {string} error message
		 */
		getErrorPageText: function(oMessageModel) {

			var messages = oMessageModel;

			if (messages.length === 1) {
				return this.getResourceBundle().getText("errorPageTextPlaceholder", messages[0].getMessage());
			} else {
				return this.getResourceBundle().getText("errorPageText");
			}
		}

	});

});