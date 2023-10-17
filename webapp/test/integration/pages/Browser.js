/*eslint-disable valid-jsdoc */
sap.ui.define([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common"
], function(Opa5, Common) {
	"use strict";

	Opa5.createPageObjects({
		onTheBrowser: {
			baseClass: Common,

			actions: {

				iPressOnTheBackwardsButton: function() {
					return this.waitFor({
						success: function() {
							// manipulate history directly for testing purposes
							Opa5.getWindow().history.back();
						}
					});
				},

				iPressOnTheForwardsButton: function() {
					return this.waitFor({
						success: function() {
							// manipulate history directly for testing purposes
							Opa5.getWindow().history.forward();
						}
					});
				},

				iChangeTheHashToSomethingInvalid: function() {
					return this.waitFor({
						success: function() {
							Opa5.getHashChanger().setHash("/somethingInvalid");
						}
					});
				},

				iChangeTheHashToTheRememberedItem: function() {
					return this.waitFor({
						success: function() {
							var sObjectId = this.getContext().currentItem.id;
							Opa5.getHashChanger().setHash("/AccountSet/" + sObjectId);
						}
					});
				},

				iRestartTheAppWithTheSameHash: function() {
					var sHash;
					this.waitFor({
						success: function() {
							sHash = Opa5.getHashChanger().getAppHash();
							this.iTeardownMyAppFrame();
						}
					});

					return this.waitFor({
						success: function() {
							var oOptions = {
								hash: sHash
							};
							this.iStartTheApp(oOptions);
						}
					});
				}
			},

			assertions: {

				iSeeTheHashContainingHashPart: function(sBkAcctInternalID, sInnerAppContainer) {
					return this.waitFor({
						success: function() {

							var sHash = Opa5.getHashChanger().getAppHash();
							Opa5.assert.notEqual(sHash.indexOf("Account("), -1, "Hash does contain path 'Account'");
							Opa5.assert.notEqual(sHash.indexOf("sap-iapp-state="), -1, "Hash does contain  paramter 'sap-iapp-state'");
							Opa5.assert.notEqual(sHash.indexOf("BkAcctInternalID="), -1, "Hash does contain  paramter 'BkAcctInternalID'");

							var sRequeredHashPart = "";
							if (sBkAcctInternalID) {
								sRequeredHashPart = "BkAcctInternalID=" + sBkAcctInternalID;
								Opa5.assert.notEqual(sHash.indexOf(sRequeredHashPart), -1, "Hash does contain required part '" + sRequeredHashPart + "'");
							}

							if (sInnerAppContainer) {
								sRequeredHashPart = "sap-iapp-state=" + sInnerAppContainer;
								Opa5.assert.notEqual(sHash.indexOf(sRequeredHashPart), -1, "Hash does contain required part '" + sRequeredHashPart + "'");
							}

						}
					});
				},

				iSeeTheEmptyHash: function() {
					return this.waitFor({
						success: function() {

							var sHash = Opa5.getHashChanger().getAppHash();
							Opa5.assert.equal(sHash, "", "Hash is empty");

						}
					});
				},

				iSeeShellHash: function() {
					return this.waitFor({
						success: function() {

							var sUrl = Opa5.getWindow().hasher.getURL();
							Opa5.assert.notEqual(sUrl.indexOf("#Shell-home"), -1, "Url contains 'Shell-home' as target to access FLP Home");

						}
					});
				}

			}
		}
	});
});