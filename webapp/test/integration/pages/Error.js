/*eslint-disable valid-jsdoc */
sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common"
], function(Opa5, Common) {
	"use strict";

	Opa5.createPageObjects({
		onTheErrorPage: {
			baseClass: Common,

			actions: {

				iWaitUntilISeeErrorPage: function() {
					return this.waitFor({
						id: "errorPage",
						viewName: "ErrorPage",
						success: function(oPage) {
							Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("errorPageText"),
								"The standard message text of the error page is shown");
						},
						errorMessage: "Did not display the error page"
					});
				}

			},

			assertions: {
				iShouldSeeErrorPage: function(sMessage) {
					return this.waitFor({
						id: "errorPage",
						viewName: "ErrorPage",
						check: function(oPage) {
							if (sMessage) {
								var sText = oPage.getText();
								if (sText.indexOf(sMessage) > -1) {
									Opa5.assert.ok(true, "The message text '" + sMessage + "' of the error page is shown");
									return true;
								} else {
									return false;
								}
							} else {
								if (oPage.getText() === oPage.getModel("i18n").getProperty("errorPageText")) {
									Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("errorPageText"),
										"The standard message text of the error page is shown");
									return true;
								} else {
									return false;
								}
							}
						},
						success: function(oPage) {
							Opa5.assert.ok(oPage.getText(),"get the error message");
					
						},
						errorMessage: "Did not display the error page"
					});
				}
			}

		}

	});
});