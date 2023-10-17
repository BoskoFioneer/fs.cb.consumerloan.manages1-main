/*eslint-disable valid-jsdoc */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/EnterText",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common"
], function(Opa5, EnterText, Common) {
	"use strict";

	var sViewName = "Search";
	//var sSearchControlId = "searchField";
	var oRefToSearchField;

	var sContainerId = "bankAccountContractSearchComponent";
	var sViewId = "search";
	var sSmartFieldId = "searchField";

	var getSmartField = function(oContainer) {

		if (oContainer.getComponentInstance() &&
			oContainer.getComponentInstance().byId(sViewId) && // Search View
			oContainer.getComponentInstance().byId(sViewId).byId(sSmartFieldId) && // SmartField
			oContainer.getComponentInstance().byId(sViewId).byId(sSmartFieldId).getInnerControls &&
			oContainer.getComponentInstance().byId(sViewId).byId(sSmartFieldId).getInnerControls()[0]) { // check if inner controls created
			return oContainer.getComponentInstance().byId(sViewId).byId(sSmartFieldId); // return Smart Field
		} else {
			return false;
		}
	};

	var getInputField = function(oContainer) {

		var oSmartField = getSmartField(oContainer);

		if (oSmartField && oSmartField.getInnerControls) {
			return getSmartField(oContainer).getInnerControls()[0];
		} else {
			return false;
		}

	};

	Opa5.createPageObjects({
		onTheSearchPage: {
			baseClass: Common,
			actions: jQuery.extend({
				/**
				 * Write value to input field and fired change/submit event
				 */
				iEnterAccountSearch: function(sValue) {
					this.waitFor({
						viewName: sViewName,
						id: sContainerId,
						check: function(oContainer) {
							//Opa5.assert.ok(true, "Component Container found with id " + sContainerId);
							return getSmartField(oContainer);
						},
						success: function(oContainer) {
							var oSmartField = getSmartField(oContainer);
							if (oSmartField) {
								Opa5.assert.ok(true, "The (input) search field is visible in container with id " + sContainerId);
								oSmartField.setValue(sValue);
								var e = $.Event("keypress");
								e.keyCode = jQuery.sap.KeyCodes.ENTER;
								var oInput = getInputField(oContainer);
								oInput.setValue(sValue);
								oInput.$().trigger(e);
								Opa5.assert.ok(true, "The ENTER event is fired in container with id " + sContainerId +
									" with value '" + sValue + "'");
							} else {
								Opa5.assert.ok(false, "The (input) search field is not visible in container with id " + sContainerId);
							}

						},
						errorMessage: "Did not find the (input) search field in component container with id " + sContainerId
					});
				},
				/**
				 * Write value to input field and fired suggest event to test the suggestion
				 */
				iWriteInSearchFieldAndSuggest: function(sSearchTerm) {
					this.waitFor({
						viewName: sViewName,
						id: sContainerId,
						check: function(oContainer) {
							Opa5.assert.ok(true, "Component Container found with id " + sContainerId);
							return getSmartField(oContainer);
						},
						success: function(oContainer) {

							var oSmartField = getSmartField(oContainer);
							if (oSmartField) {
								Opa5.assert.ok(true, "The (input) search field is visible in container with id " + sContainerId);
								oSmartField.setValue(sSearchTerm);
								var oInput = oRefToSearchField = getInputField(oContainer);
								oInput.onfocusin(); // for some reason this is not triggered when calling focus via API
								oInput._$input.focus().val(sSearchTerm).trigger("input");

								Opa5.assert.ok(true, "Suggestion with the text '" + sSearchTerm + "' fired");
							} else {
								Opa5.assert.ok(false, "The (input) search field is not visible in container with id " + sContainerId);
							}

						},
						errorMessage: "Did not find the (input) search field in component container with id " + sContainerId
					});
				},

				/**
				 * Select from the suggestion List Item containing the given text
				 */
				iSelectInSuggestionListItemContaining: function(sSearchTerm) {

					function selectFirstItemInTheListContainTheSearchTerm(oTable, sTerm) {
						var aItems = oTable.getItems();
						// table need items
						if (aItems.length === 0) {
							return undefined;
						}
						var oItemRoReturn;
						jQuery.each(aItems, function(iItemIndex) {
							if (aItems[iItemIndex].getCells) { // processing only for ColumnListItems 
								var aCells = aItems[iItemIndex].getCells();
								jQuery.each(aCells, function(iCellIndex) {
									if (aCells[iCellIndex].getText().indexOf(sTerm) !== -1) {
										oItemRoReturn = aItems[iItemIndex];
										return oItemRoReturn;
									}
								});
							}
						});

						return oItemRoReturn;
					}

					this.waitFor({
						controlType: "sap.m.Table",
						/*viewName: sTestPageView,*/
						success: function(aTables) {
							Opa5.assert.ok(true, "The table containing suggestion is found");
							var oSelectedItem = selectFirstItemInTheListContainTheSearchTerm(aTables[0], sSearchTerm);

							Opa5.assert.ok(oSelectedItem, "Item found in the suggestion list for the given search term");
							if (oSelectedItem) {
								oRefToSearchField.fireSuggestionItemSelected({
									selectedRow: oSelectedItem
								});
							}
						},
						errorMessage: "Did not find the suggestion list"
					});
				}

			}),
			assertions: jQuery.extend({

				iShouldSeeTheSearchField: function() {
					return this.waitFor({
						viewName: sViewName,
						id: sContainerId,
						check: function(oContainer) {
							//Opa5.assert.ok(true, "Component Container found with id " + sContainerId);
							return getSmartField(oContainer);
						},
						success: function(oContainer) {
							if (getSmartField(oContainer)) {
								Opa5.assert.ok(true, "The smart field is visible in container with id " + sContainerId);
							} else {
								Opa5.assert.ok(false, "The smart field is not visible in container with id " + sContainerId);
							}

							if (getInputField(oContainer)) {
								Opa5.assert.ok(true, "The input field is visible in container with id " + sContainerId);
							} else {
								Opa5.assert.ok(false, "The input field is not visible in container with id " + sContainerId);
							}
						},
						errorMessage: "Did not find the (input) search field in component container with id " + sContainerId
					});
				},
				iShouldSeeTheAccountNumberInSearchField: function(sValue) {
					return this.waitFor({
						viewName: sViewName,
						id: sContainerId,
						check: function(oContainer) {
							//Opa5.assert.ok(true, "Component Container found with id " + sContainerId);
							var oSmartField = getSmartField(oContainer);
							if (oSmartField && oSmartField.getValue() === sValue) {
								return true;
							} else {
								return false;
							}
						},
						success: function(oContainer) {
							if (getSmartField(oContainer).getValue() === sValue) {
								Opa5.assert.ok(true, "The smart field in container with id " + sContainerId + " contains value '" + sValue + "'");
							} else {
								Opa5.assert.ok(false, "The smart field in container with id " + sContainerId + " does not contain value '" + sValue + "'");
							}

							if (getInputField(oContainer).getValue() === sValue) {
								Opa5.assert.ok(true, "The input field in container with id " + sContainerId + "with value '" + sValue + "'");
							} else {
								Opa5.assert.ok(false, "The input field in container with id " + sContainerId + " does not contain value '" + sValue + "'");
							}
						},
						errorMessage: "Did not find the (input) search field in component container with id " + sContainerId + " and value '" +
							sValue + "'"
					});
				},
				iShouldSeeValueStateOfTheSearchField: function(sValueState) {
					return this.waitFor({
						viewName: sViewName,
						id: sContainerId,
						check: function(oContainer) {
							//Opa5.assert.ok(true, "Component Container found with id " + sContainerId);
							var oSmartField = getSmartField(oContainer);
							if (oSmartField && oSmartField.getValueState() === sValueState) {
								return true;
							} else {
								return false;
							}
						},
						success: function(oContainer) {
							if (getSmartField(oContainer).getValueState() === sValueState) {
								Opa5.assert.ok(true, "The smart field in container with id " + sContainerId + " contains value state '" + sValueState +
									"'");
							} else {
								Opa5.assert.ok(false, "The smart field in container with id " + sContainerId + " does not contain value state '" +
									sValueState + "'");
							}

							if (getInputField(oContainer).getValueState() === sValueState) {
								Opa5.assert.ok(true, "The input field in container with id " + sContainerId + "with value state '" + sValueState + "'");
							} else {
								Opa5.assert.ok(false, "The input field in container with id " + sContainerId + " does not contain value state '" +
									sValueState + "'");
							}
						},
						errorMessage: "Did not find the (input) search field in component container with id " + sContainerId + " and value state '" +
							sValueState + "'"
					});
				}
			})
		}
	});

});