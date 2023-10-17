/*eslint-disable valid-jsdoc */
sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common"
], function(Opa5, Common) {
	"use strict";

	Opa5.createPageObjects({
		onTheFLPPage: {
			baseClass: Common,

			actions: {

				iPressOnAppTile: function(sTitle) {
					var oFoundTile = {};
					return this.waitFor({
						controlType: "sap.m.GenericTile",
						check: function(oTile) {
							var bReturn = false;
							jQuery.each(oTile, function(iIndex, oItem) {
								if (oItem.getTileContent()[0].getFooter() === sTitle) {
									bReturn = true;
									oFoundTile = oItem;
								}
							});
							return bReturn;
						},
						success: function(oTile) {
							if (oFoundTile) {
								oFoundTile.firePress();
								Opa5.assert.ok(true, "Press on tile " + sTitle + " fired");
							} else {
								Opa5.assert.ok(false, "Did not found the tile on the FLP");
							}
						},
						errorMessage: "Did not found the tile on the FLP"
					});
				}

			},

			assertions: {

				iSeeAppTile: function(sTitle) {
					var oFoundTile = {};
					return this.waitFor({
						controlType: "sap.m.GenericTile",
						check: function(oTile) {
							var bReturn = false;
							jQuery.each(oTile, function(iIndex, oItem) {
								if (oItem.getTileContent()[0].getFooter() === sTitle) {
									bReturn = true;
									oFoundTile = oItem;
								}
							});
							return bReturn;
						},
						success: function(oTile) {
							Opa5.assert.ok(true, "Tile " + oFoundTile.getTileContent()[0].getFooter() + " is visible");
						},
						errorMessage: "Did not found the tile on the FLP"
					});
				}

			}

		}

	});
});