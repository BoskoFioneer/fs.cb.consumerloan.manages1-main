sap.ui.define(["sap/uxap/BlockBase"],
	function(BlockBase) {
		"use strict";

		var oBlockEvents = BlockBase.extend("fs.cb.consumerloan.manages1.view.blocks.BlockPaymentConditionDetails", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "fs.cb.consumerloan.manages1.view.blocks.BlockPaymentConditionDetails",
						type: "XML"
					},
					Expanded: {
						viewName: "fs.cb.consumerloan.manages1.view.blocks.BlockPaymentConditionDetails",
						type: "XML"
					}
				}
			}
		});

		return oBlockEvents;
	});