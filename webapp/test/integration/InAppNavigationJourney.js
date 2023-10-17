sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/core/date/UniversalDate",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common"
], function(opaTest, UniversalDate, Common) {
	"use strict";

	QUnit.module("In App Navigation");

	opaTest("I start my app and see initial page", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		//Actions
		// Assertions
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		// Search field is empty
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("");
		// I should see correct URL
		// Then.onTheBrowser.iSeeTheEmptyHash();
		Then.iTeardownMyAppFrame();
	});

	opaTest("I start my app and search for account", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		// check page header text
		Then.onTheDetailPage.iSeeAppTitle(Given.getI18nText("xtit.appTitle"));

		//Actions
		When.onTheSearchPage.iEnterAccountSearch("0010030023");
		// Assertions
		// I should see data
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		// TODO check page header text
		//Then.onTheDetailPage.iSeeAppTitle(Given.getI18nText("appDisplayTitle"));
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
		// I should see correct URL
		// Then.onTheBrowser.iSeeTheHashContainingHashPart("16A68B51D7301EE78DC88CDCD4B1A21C");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start my app, search for account and navigate back", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");

		//Actions
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		// Search field is empty
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("");
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		// I should see correct URL
		// Then.onTheBrowser.iSeeTheEmptyHash();
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start my app and switch between accounts", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		// 1st account
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");

		//Actions
		// 2nd account
		When.onTheSearchPage.iEnterAccountSearch("0010014883");

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010014883");
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010014883");
		// I should see correct URL
		// Then.onTheBrowser.iSeeTheHashContainingHashPart("D8F940AAFA621ED6A5EB8CDCD4B1A21C");
		Then.iTeardownMyAppFrame();

	});

	// opaTest("I start my app and swith between accounts and back", function(Given, When, Then) {
	// 	// Arrangements
	// 	Given.iStartTheApp();
	// 	Then.onTheSearchPage.iShouldSeeTheSearchField();
	// 	Then.onTheStartPage.iShouldSeeTheInitialPage();
	// 	// 1st account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010030023");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	// 2nd account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010014883");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010014883");

	// 	//Actions
	// 	// 1st time back
	// 	// When.onTheBrowser.iPressOnTheBackwardsButton();

	// 	// Assertions
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
	// 	// I should see correct URL
	// 	Then.onTheBrowser.iSeeTheHashContainingHashPart("16A68B51D7301EE78DC88CDCD4B1A21C");

	// 	//Actions
	// 	// 2nd time back
	// 	When.onTheBrowser.iPressOnTheBackwardsButton();

	// 	// Assertions
	// 	// Search field is empty

	// 	Then.onTheStartPage.iShouldSeeTheInitialPage();
	// 	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("");
	// 	// I should see correct URL
	// 	Then.onTheBrowser.iSeeTheEmptyHash();
	// 	Then.iTeardownMyAppFrame();

	// });

	// opaTest("I start my app and swith between accounts using back and forward", function(Given, When, Then) {
	// 	// Arrangements
	// 	Given.iStartTheApp();
	// 	Then.onTheSearchPage.iShouldSeeTheSearchField();
	// 	Then.onTheStartPage.iShouldSeeTheInitialPage();
	// 	// 1st account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010030023");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	// 2nd account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010014883");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010014883");

	// 	//Actions
	// 	// 1st time back
	// 	When.onTheBrowser.iPressOnTheBackwardsButton();

	// 	// Assertions
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
	// 	// I should see correct URL
	// 	Then.onTheBrowser.iSeeTheHashContainingHashPart("16A68B51D7301EE78DC88CDCD4B1A21C");

	// 	//Actions
	// 	// Now forward
	// 	When.onTheBrowser.iPressOnTheForwardsButton();

	// 	// Assertions
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010014883");
	// 	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010014883");
	// 	// I should see correct URL
	// 	Then.onTheBrowser.iSeeTheHashContainingHashPart("D8F940AAFA621ED6A5EB8CDCD4B1A21C");
	// 	Then.iTeardownMyAppFrame();

	// });

	// opaTest("I start my app and navigate back to FLP", function(Given, When, Then) {
	// 	// Arrangements
	// 	Given.iStartTheApp();
	// 	Then.onTheSearchPage.iShouldSeeTheSearchField();
	// 	Then.onTheStartPage.iShouldSeeTheInitialPage();

	// 	//Actions
	// 	When.onTheBrowser.iPressOnTheBackwardsButton();

	// 	// Assertions
	// 	Then.onTheBrowser.iSeeShellHash();
	// 	Then.iTeardownMyAppFrame();
	// });

	// opaTest("I start app using the valid internal id as inner-app parameter", function(Given, When, Then) {
	// 	// Arrangements
	// 	var oOptions = {
	// 		hash: "Account(sap-iapp-state=DUMMY,BkAcctInternalID=16A68B51D7301EE78DC88CDCD4B1A21C)"
	// 	};
	// 	Given.iStartTheApp(oOptions);

	// 	//Actions

	// 	// Assertions
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
	// 	// I should see correct URL
	// 	// Then.onTheBrowser.iSeeTheHashContainingHashPart("16A68B51D7301EE78DC88CDCD4B1A21C");
	// 	Then.iTeardownMyAppFrame();

	// });

	// opaTest("I start app using not valid internal id as inner-app parameter", function(Given, When, Then) {
	// 	// Arrangements
	// 	var oOptions = {
	// 		hash: "Account(sap-iapp-state=DUMMY,BkAcctInternalID=0A000000F9841ED5B4968CDCD4B1C23B)"
	// 	};
	// 	Given.iStartTheApp(oOptions);

	// 	//Actions

	// 	// Assertions
	// 	Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
	// 	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("");
	// 	// Then.onTheBrowser.iSeeTheHashContainingHashPart("0A000000F9841ED5B4968CDCD4B1C23B");
	// 	Then.iTeardownMyAppFrame();

	// });

	// opaTest("I start app, navigate to the account and refresh", function(Given, When, Then) {
	// 	// Arrangements
	// 	Given.iStartTheApp();
	// 	Then.onTheSearchPage.iShouldSeeTheSearchField();
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010030023");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");

	// 	//Actions
	// 	When.onTheBrowser.iRestartTheAppWithTheSameHash();

	// 	// Assertions
	// 	// I should see data
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	// Search field contains account number
	// 	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
	// 	// I should see correct URL
	// 	Then.onTheBrowser.iSeeTheHashContainingHashPart("16A68B51D7301EE78DC88CDCD4B1A21C");
	// 	Then.iTeardownMyAppFrame();
	// });

	opaTest("I start my app and expand item details, details should be collapsed for new account", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		// 1st account
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		Then.onTheDetailPage.iShouldSeeCFBlock("Collapsed");
		Then.onTheDetailPage.iExpandCollapseCFBlock();
		Then.onTheDetailPage.iShouldSeeIPBlock("Collapsed");
		Then.onTheDetailPage.iExpandCollapseIPBlock();

		// 2nd account
		Then.onTheSearchPage.iEnterAccountSearch("0010014883");
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010014883");
		Then.onTheDetailPage.iShouldSeeCFBlock("Collapsed");
		Then.onTheDetailPage.iShouldSeeIPBlock("Collapsed");

		Then.iTeardownMyAppFrame();

	});

	// opaTest("I start my app and switch between accounts, condition Fixing table is refreshed", function(Given, When, Then) {
	// 	// Arrangements
	// 	Given.iStartTheApp();
	// 	Then.onTheSearchPage.iShouldSeeTheSearchField();
	// 	Then.onTheStartPage.iShouldSeeTheInitialPage();
	// 	// 1st account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010030023");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	Then.onTheDetailPage.iExpandCollapseCFBlock();
	// 	Then.onTheDetailPage.iSeeCorrectValues([
	// 		["PriceConditionConditions", "Nominal Int. Loans", "sap.m.ObjectIdentifier", "Title"]

	// 	]);
	// 	// 2nd account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010014883");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010014883");
	// 	Then.onTheDetailPage.iExpandCollapseCFBlock();

	// 	Then.onTheDetailPage.iDoNotSeeValues([
	// 		["PriceConditionConditions", "Nominal Int. Loans", "sap.m.ObjectIdentifier", "Title"]
	// 	]);
	// 	Then.iTeardownMyAppFrame();

	// });

	// opaTest("I start my app and switch between accounts, inpayment agreement table is refreshed", function(Given, When, Then) {
	// 	// Arrangements
	// 	Given.iStartTheApp();
	// 	Then.onTheSearchPage.iShouldSeeTheSearchField();
	// 	Then.onTheStartPage.iShouldSeeTheInitialPage();
	// 	// 1st account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010030023");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// 	Then.onTheDetailPage.iExpandCollapseIPBlock();
	// 	Then.onTheDetailPage.iSeeCorrectValues([
	// 		["PaymentConditionConditions", "Receivable (IL) ChargeDue", "sap.m.ObjectIdentifier", "Title"]

	// 	]);
	// 	// 2nd account
	// 	Then.onTheSearchPage.iEnterAccountSearch("0010014883");
	// 	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010014883");
	// 	Then.onTheDetailPage.iExpandCollapseIPBlock();

	// 	Then.onTheDetailPage.iDoNotSeeValues([
	// 		["PaymentConditionConditions", "Receivable (IL) ChargeDue", "sap.m.ObjectIdentifier", "Title"]

	// 	]);
	// 	Then.iTeardownMyAppFrame();

	// });
});