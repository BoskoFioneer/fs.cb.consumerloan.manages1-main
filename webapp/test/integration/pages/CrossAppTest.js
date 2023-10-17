/*eslint-disable valid-jsdoc */
sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common",
	"sap/ui/test/actions/Press"
], function(Opa5, Common, Press) {
	"use strict";

	var sViewName = "TestPage";

	Opa5.createPageObjects({
		onTheCrossAppTestPage: {
			baseClass: Common,

			actions: {

				/**
				 * Press Link that is placed on a view
				 * @public
				 * @param {string} [sControlId] The Id of the control
				 * @param {string} [sView] The Name of the view 
				 * @returns {string} Success or Error Message
				 */
				iPressLink: function(sControlId) {
					var sLinkID = sViewName + "--" + sControlId;
					return this.waitFor({
						id: sLinkID,
						//viewName: sView,
						actions: new Press(),
						success: function(oControl) {
							//oControl.firePress();
							Opa5.assert.ok(true, "control " + sControlId + " pressed");
						},
						errorMessage: "Did not find control with id: " + sControlId
					});
				}

			},

			assertions: {

			}

		}

	});
});