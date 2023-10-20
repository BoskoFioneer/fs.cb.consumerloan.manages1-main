sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
    "fs/cb/consumerloan/manages1/model/formatter"
], function(
	BaseController, formatter
) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.Object", {
        formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */

		onInit: function() {

		}
	});
});