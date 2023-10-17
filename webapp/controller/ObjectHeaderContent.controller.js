/*global location*/
sap.ui.define([
	"fs/cb/consumerloan/manages1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fs/cb/consumerloan/manages1/model/utilities",
	"fs/cb/consumerloan/manages1/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, utilities, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("fs.cb.consumerloan.manages1.controller.ObjectHeaderContent", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.subscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onObjHdrBindingUpdate, this);

			//Check for navigation to Bank customer overview app
			var sSemanticObject = "BankCustomer";
			var sAction = "display";
			var oParams = {};
			this.callbackIsCrossAppNavigationSupported(function(isSupported) {
				this._isBankCustomerNavigationSupported = isSupported;
			}.bind(this), sSemanticObject, sAction, oParams);
		},

		onExit: function() {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.unsubscribe("fs.cb.consumerloan.manages1", "consumerBindingUpdated", this.onObjHdrBindingUpdate, this);
		},

		/* =================	========================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler on bindingUpdated event on app channel
		 * Update binding in object header for account holder and contract manager
		 * @public
		 * @param {string} [sChannelId] The channel of the fired event: "fs.cb.consumerloan.manages1"
		 * @param {sEvent} [sEventId] The EventId of the fired event: "consumerBindingUpdated"
		 * @param {object} [oData] Parameters
		 */
		onObjHdrBindingUpdate: function(sChannelId, sEventId, oData) {
			if (sChannelId === "fs.cb.consumerloan.manages1" && sEventId === "consumerBindingUpdated") {

				var sBusinessSystemId, sAcccountHolderID, sContractManagerId;

				sBusinessSystemId = oData.consumerAccountBusinessSystemID;
				sAcccountHolderID = oData.AcctHldrPartyInternalID;
				sContractManagerId = oData.OplBkContrMgmtUnitID;
				// Replace special characters +,/, ?, %, # & in AccountHolderId otherwise oDATA will not accept URL
				sAcccountHolderID = encodeURIComponent(sAcccountHolderID);

				if (sAcccountHolderID) {
					var sBorrowerPartyPath = "/BorrowerParties(InternalID='" + sAcccountHolderID + "',BusinessSystemID='" + sBusinessSystemId + "')";
					var oAccountHolderLink = this.getView().byId("accountHolderNameLayout");
					if (oAccountHolderLink) {
						oAccountHolderLink.bindElement({
							path: sBorrowerPartyPath,
							events: {
								change: function(oLink) {
									if (this.getView().getModel().getData(oLink.getSource().getPath())) {
										var sName = this.getView().getModel().getData(oLink.getSource().getPath()).BusinessPartnerFormattedName;
										var oEventBus = this.getOwnerComponent().getEventBus();
										oEventBus.publish("fs.cb.consumerloan.manages1", "accountHolderBindingChanged", {
													sTitleName: sName
										});
									}

								}.bind(this)
							},
							parameters: {
								expand: "RelatedParties"
							}
						});
					}
				}

				if (sContractManagerId) {
					var sContractManagerPath = "/OplBkContrMgmtUnits(ID='" + sContractManagerId + "',BusinessSystemID='" + sBusinessSystemId + "')";
					var oContractManagerLink = this.getView().byId("contractManagerLayout");
					if (oContractManagerLink) {
						oContractManagerLink.bindElement({
							path: sContractManagerPath
						});
					}
				}

			}
		},

		/**
		 * Event handler  for press on account holder link
		 * Open the business card of the account holder
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the link control
		 */
		onAccountHolderLinkPressed: function(oEvent) {

			if (!this._oAccountHolderCard) {
				this._initializeAccountHolderCard();
			}

			this._oAccountHolderCard.setBindingContext(oEvent.getSource().getBindingContext());

			// Collect data from RelatedParties into internal quick view group model
			var mContactData = {
				groups: []
			};

			// Add AccountHolder Contact Data from AcctHldrParty to the internal model
			mContactData.groups.push(this._createGroupData(this._oAccountHolderCard.getBindingContext()));

			// Add RelatedParties
			mContactData.groups.push.apply(mContactData.groups, this._createRelatedPartiesGroup(this.getView().byId("accountHolderNameLayout").getBindingContext(),
				"BUR022-1"));

			// create model and set the data to the model
			if (!this._oContactModel) {
				this._oContactModel = new JSONModel();
			}
			this._oContactModel.setData(mContactData);
			this._oAccountHolderCard.setModel(this._oContactModel, "contact");

			// //register callback for navigation to Bank customer overview app
			if (this._isBankCustomerNavigationSupported) {
				var pages = this._oAccountHolderCard.getPages();
				pages[0].setCrossAppNavCallback(this._acctHldrCrossAppNavCallback.bind(this));
				sap.m.QuickViewPage.prototype.setCrossAppNavCallback = function(v) {this.setProperty("crossAppNavCallback", v, true);return this;}; 
			}

			// show popover dialog
			var oLinkAcctHolder =   oEvent.getSource();
		    jQuery.sap.delayedCall(0, this, function () {
			      this._oAccountHolderCard.openBy(oLinkAcctHolder);
		    });
		},

		// callback function for navigation
		_acctHldrCrossAppNavCallback: function() {
			var oMod = this.getView().getModel();
			var oCtxt = this._oAccountHolderCard.getBindingContext();
			var target;
			if (oMod && oCtxt) {
				var oAcctHldr = oMod.getProperty(oCtxt.getPath());
				target = {
					target: {
						semanticObject: "BankCustomer",
						action: "display"
					},
					params: {
						CustomerUUID: oAcctHldr.UUID,
						BusinessSystemID: oAcctHldr.BusinessSystemID
					}
				};
			}
			return target;
		},

		/**
		 * Event handler  for press on contract manager link
		 * Open the business card containing details of OplBkContrMgmtUnits and RelatedParties of the Account Holder
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the link control
		 */
		onContractManagerLinkPressed: function(oEvent) {

			if (!this._oContractManagerCard) {
				this._initializeContractManagerCard();
			}

			this._oContractManagerCard.setBindingContext(oEvent.getSource().getBindingContext());

			// Collect data from OplBkContrMgmtUnits and RelatedParties into internal quick view group model
			var mContactData = {
				groups: []
			};

			// Add Contract Manager Contact Data from OplBkContrMgmtUnits to the internal model
			mContactData.groups.push(this._createGroupData(this._oContractManagerCard.getBindingContext()));

			// Add RelatedParties
			mContactData.groups.push.apply(mContactData.groups, this._createRelatedPartiesGroup(this.getView().byId("accountHolderNameLayout").getBindingContext(),
				"BUR011-2"));

			// create model and set the data to the model
			if (!this._oContactModel) {
				this._oContactModel = new JSONModel();
			}
			this._oContactModel.setData(mContactData);
			this._oContractManagerCard.setModel(this._oContactModel, "contact");

            var oLinkContractManager =   oEvent.getSource();
		    jQuery.sap.delayedCall(0, this, function () {
		     	this._oContractManagerCard.openBy(oLinkContractManager);
		    });
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Create elements for QuickViewGroup containing data from  OplBkContrMgmtUnits
		 * @function
		 * @private
		 * @param {Object} [oBindingContext] BindingContext for OplBkContrMgmtUnits
		 * @returns {Object} [oGroup] data for QuickViewGroup
		 */
		_createGroupData: function(oBindingContext) {

			var oGroup = {};

			if (oBindingContext) {

				oGroup = {
					heading: this.getResourceBundle().getText("xtit.contactDetails"),
					elements: [{
						label: this.getResourceBundle().getText("xfld.phone"),
						value: oBindingContext.getProperty("TelephoneDefaultFrmtdNoDesc"),
						elementType: sap.m.QuickViewGroupElementType.phone
					}, {
						label: this.getResourceBundle().getText("xfld.email"),
						value: oBindingContext.getProperty("EMailDefaultURI"),
						elementType: sap.m.QuickViewGroupElementType.email
					}]
				};

			}

			return oGroup;

		},

		/**
		 * Create elements for QuickViewGroup containing data from  RelatedParties of the Account Holder
		 * @function
		 * @private
		 * @param {Object} [oBindingContext] BindingContext for Account Holder
		 * @param {string} [sRoleCode] Role
		 * @returns {Array} [aGroup] data for QuickViewGroup
		 */
		_createRelatedPartiesGroup: function(oBindingContext, sRoleCode) {

			var aGroup = [];

			if (oBindingContext) {

				var oRelatedParties = oBindingContext.getProperty("RelatedParties");

				if (oRelatedParties) {
					var that = this;
					jQuery.each(oRelatedParties, function(iIndex, sItem) {
						var sPath = "/" + sItem;
						var oRelatedParty = that.getModel().getObject(sPath);
						if (oRelatedParty.BPRelshpRoleCode === sRoleCode) {
							var sRoleHeader = that._getRelatedPartyHeader(oRelatedParty.BPRelshpRoleCode, that);
							var oGroup = {
								heading: sRoleHeader,
								elements: [{
									label: that.getResourceBundle().getText("xfld.name"),
									value: oRelatedParty.BusinessPartnerFormattedName
								}, {
									label: that.getResourceBundle().getText("xfld.phone"),
									value: oRelatedParty.TelephoneDefaultFrmtdNoDesc,
									elementType: sap.m.QuickViewGroupElementType.phone
								}, {
									label: that.getResourceBundle().getText("xfld.email"),
									value: oRelatedParty.EMailDefaultURI,
									elementType: sap.m.QuickViewGroupElementType.email
								}]
							};
							aGroup.push(oGroup);
						}
					});
				}
			}
			return aGroup;
		},

		/**
		 * Create Quick View for Accound Holder Details
		 * @function
		 * @private
		 */
		_initializeAccountHolderCard: function() {

			var oCardModel = new JSONModel({
				open: true,
				loading: false,
				elementType: sap.m.QuickViewGroupElementType.text
			});

			this._oAccountHolderCard = sap.ui.xmlfragment(this.getView().getId(), "fs.cb.consumerloan.manages1.view.fragment.AccountHolderCard", this, {
				afterOpen: oCardModel.setProperty.bind(oCardModel, "/open", true),
				afterClose: oCardModel.setProperty.bind(oCardModel, "/open", false),
				dataRequested: oCardModel.setProperty.bind(oCardModel, "/loading", true),
				change: oCardModel.setProperty.bind(oCardModel, "/loading", false)
			});
			this._oAccountHolderCard.setModel(oCardModel, "cardModel");
			utilities.attachControlToView(this.getView(), this._oAccountHolderCard);
		},

		/**
		 * Create Quick View for Contract Manager Details
		 * @function
		 * @private
		 */
		_initializeContractManagerCard: function() {

			var oCardModel = new JSONModel({
				open: true,
				loading: false,
				elementType: sap.m.QuickViewGroupElementType.text
			});

			this._oContractManagerCard = sap.ui.xmlfragment(this.getView().getId(), "fs.cb.consumerloan.manages1.view.fragment.ContractManagerCard",
				this, {
					afterOpen: oCardModel.setProperty.bind(oCardModel, "/open", true),
					afterClose: oCardModel.setProperty.bind(oCardModel, "/open", false),
					dataRequested: oCardModel.setProperty.bind(oCardModel, "/loading", true),
					change: oCardModel.setProperty.bind(oCardModel, "/loading", false)
				});
			this._oContractManagerCard.setModel(oCardModel, "cardModel");
			utilities.attachControlToView(this.getView(), this._oContractManagerCard);
		},
		
		/**
		 * Get Text for Advisor and Legal Representative Headers
		 * @function
		 * @private
		 */
		_getRelatedPartyHeader: function(sRoleCode, that) {
			if (sRoleCode === "BUR011-2") {
				return that.getResourceBundle().getText("xtit.advisor");
			} else if (sRoleCode === "BUR022-1") {
				return that.getResourceBundle().getText("xtit.legal_rep");
			}
		}

	});

});