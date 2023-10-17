sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Search Loan Account");

	opaTest("I enter account number into the search field and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter IBAN into the search field and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter account number into the search field for not existing account and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("0010002999");

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010002999");
			Then.onTheDetailPage.iSeeCorrectValues([
			["objectNotFoundLink", Given.getI18nText("backToStartPage"), "sap.m.Link", "Text"],
			["objectNotFoundPage", Given.getI18nText("noObjectFoundText"), "sap.m.MessagePage", "Text"]

		]);
		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter IBAN into the search field for not existing account and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE18900000010010002380");

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("DE18900000010010002380");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter any string into the search field and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("BLABLA");

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("BLABLA"); // new version no longer converts?
		Then.iTeardownMyAppFrame();
	});

	opaTest("I search for account via empty string and see initial Page", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("");

		// Assertions
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		Then.iTeardownMyAppFrame();
	});

	opaTest(
		"I enter first empty string to stay on initial page and if I enter valid account number the error state is removed and object is displayed",
		function(Given, When, Then) {
			// Arrangements
			Given.iStartTheApp();
			Then.onTheSearchPage.iShouldSeeTheSearchField();

			//Actions
			Then.onTheSearchPage.iEnterAccountSearch("");

			// Assertions
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions 2
			Then.onTheSearchPage.iEnterAccountSearch("0010030023");

			// Assertions 2
			Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
			Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
			Then.onTheSearchPage.iSeeCorrectValueState("searchField", "None");
			Then.iTeardownMyAppFrame();
		});

	opaTest(
		"I enter first empty string to stay on initial page and if I enter not valid account number the error state is removed and I see not found page",
		function(Given, When, Then) {
			// Arrangements
			Given.iStartTheApp();
			Then.onTheSearchPage.iShouldSeeTheSearchField();

			//Actions
			Then.onTheSearchPage.iEnterAccountSearch("");

			// Assertions
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions
			Then.onTheSearchPage.iEnterAccountSearch("BLABLA");

			// Assertions
			Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("BLABLA");
			Then.onTheSearchPage.iSeeCorrectValueState("searchField", "None");

			Then.iTeardownMyAppFrame();
		});

	opaTest("I enter search string identifying list of accounts and see the respective error page", function(Given, When, Then) {
		
		var sText = Given.getI18nText("errorPageTextUseSearch");
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("0000001001");

		//Assertions
		Then.onTheErrorPage.iShouldSeeErrorPage(sText);
	
		Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0000001001");
		Then.iTeardownMyAppFrame();
	});

});