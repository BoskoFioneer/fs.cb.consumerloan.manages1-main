/*eslint-disable valid-jsdoc */
sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common"
], function(Opa5, Common) {
	"use strict";

	Opa5.createPageObjects({
		onTheStartPage: {
			baseClass: Common,

			actions: {

				iWaitUntilISeeTheInitialPage: function() {
					return this.waitFor({
						id: "startPage",
						viewName: "Start",
						success: function(oPage) {
							Opa5.assert.ok(true, "Start Page is visible");
						},
						errorMessage: "Did not display the object not found page"
					});
				}

			},

			assertions: {
				iShouldSeeTheInitialPage: function() {
					return this.waitFor({
						id: "startPage",
						viewName: "Start",
						success: function(oPage) {
							Opa5.assert.ok(true, "Start Page is visible");
						},
						errorMessage: "Did not display the object not found page"
					});
				}

			}

		}

	});
});