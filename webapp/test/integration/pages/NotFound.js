/*eslint-disable valid-jsdoc */
sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common"
], function(Opa5, Common) {
	"use strict";

	Opa5.createPageObjects({
		onTheNotFoundPage: {
			baseClass: Common,

			actions: {

				iWaitUntilISeeObjectNotFoundPage: function() {
					return this.waitFor({
						id: "objectNotFoundPage",
						viewName: "ObjectNotFound",
						success: function(oPage) {
							Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("noObjectFoundText"),
								"The text of the not found text is shown");
						},
						errorMessage: "Did not display the object not found page"
					});
				}

			},

			assertions: {
				iShouldSeeObjectNotFound: function() {
					return this.waitFor({
						id: "objectNotFoundPage",
						viewName: "ObjectNotFound",
						success: function(oPage) {
							Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("noObjectFoundText"),
								"The text of the not found text is shown");
						},
						errorMessage: "Did not display the object not found page"
					});
				}

			}

		}

	});
});