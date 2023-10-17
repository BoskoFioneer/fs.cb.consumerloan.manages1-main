opaTest("I navigate to app using cross-app navigation with internal id as cross app parameter and test back navigation", function(Given,
	When, Then) {

	// Arrangements
	Given.iStartCrossAppTestApp();

	//Actions 1
	When.onTheCrossAppTestPage.iPressLink("link2");

	// Assertions
	// I should see data
	Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
	// Search field contains account number
	Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010030023");
	// I should see correct URL
	// Then.onTheBrowser.iSeeTheHashContainingHashPart("16A68B51D7301EE78DC88CDCD4B1A21C");

	// Action 2 - navigate back using page nav back button
	// When.onTheStartPage.iPressTheBackButton();
	When.onTheStartPage.iPressTheBackButton();
	Then.onTheCrossAppTestPage.iLookAtTheScreen();

	//Actions 3 - navigate again to the app
	When.onTheCrossAppTestPage.iPressLink("link2");

	Then.iTeardownMyAppFrame();
});