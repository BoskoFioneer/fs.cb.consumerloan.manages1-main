sap.ui.define([
	"sap/ui/test/opaQunit",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common",
	"fs/cb/consumerloan/manages1/test/integration/pages/Detail",
	"sap/ui/core/date/UniversalDate",
	"sap/ui/model/resource/ResourceModel"
], function (opaTest, Common, Detail, UniversalDate, ResourceModel) {
	"use strict";

	function getCommon() {
		return new Common();
	}

	QUnit.module("Display Page");

	opaTest("I display Object Header Content", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		When.onTheDetailPage.iLookAtTheScreen();
		// Assertions

		Then.onTheDetailPage.iLookAtTheScreen();
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		Then.onTheDetailPage.iSeeCorrectValues([
			["accountHolderNameLabel", Given.getI18nText("xfld.accountHolder"), "sap.m.Label", "Text"],
			["accountHolderNameLabel", "Account Holder", "sap.m.Label", "Text"],
			["contractManagerLabel", Given.getI18nText("xfld.contractManager"), "sap.m.Label", "Text"],
			["createdOnLabel", Given.getI18nText("xfld.contractStartDateHeader"), "sap.m.Label", "Text"],
			["productLabel", Given.getI18nText("xfld.accountProduct"), "sap.m.Label", "Text"],
			["effectiveInterestRateLabel", Given.getI18nText("xfld.effectiveInterestRate"), "sap.m.Label", "Text"],
			["effectiveCapitalLabel", Given.getI18nText("xfld.effectiveCapital"), "sap.m.Label", "Text"],

			["accountHolderLink", "Eckehart Fleck", "sap.m.Link", "Text"],
			["contractManagerLink", "90WP", "sap.m.Link", "Text"],
			// ["createdOnText", getCommon().getDateFormatter().format(new Date(2017, 4, 11)), "sap.m.Text", "Text"],
			["productNameText", "Retail Consumer Loan", "sap.m.Text", "Text"],
			["effectiveCapitalObjectNumber", "9,188.89", "sap.m.ObjectNumber", "Number"],
			["effectiveInterestRateObjectNumber", "33.45%", "sap.m.ObjectNumber", "Number"]

		]);
		Then.onTheDetailPage.iClickTheLink("buttonPayoff");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I display account and contract manager", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");

		// Assertions
		Then.onTheDetailPage.iPressAccountHolderQuickView();
		Then.onTheDetailPage.iShouldSeeTheEmail("Eckehart.Fleck@aol.com");
		Then.onTheDetailPage.iPressAccountHolderQuickView();
		Then.onTheDetailPage.iShouldSeeTheEmail("harald.harms@bank.com");

		Then.onTheDetailPage.iPressContractManagerQuickView();
		Then.onTheDetailPage.iShouldSeeTheEmail("firma.sap@sap.com");
		Then.onTheDetailPage.iShouldSeeTheEmail("eck.fleck@bank.com");
		Then.onTheDetailPage.iShouldSeeTheEmail("maria.mueller@bank.com");

		Then.iTeardownMyAppFrame();
	});

	opaTest("I display balance key figures data", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");

		// Assertions
		Then.onTheDetailPage.iPressAnchor("xtit.balanceKeyFigure_section");
		Then.onTheDetailPage.iSeeCorrectValues([
			["disbursedCapitalLabel", Given.getI18nText("xfld.disbursedCapital"), "sap.m.Label", "Text"],
			["disbursedCapitalField", getCommon().getAmountFormatter().format(10000.00, "EUR") + " EUR", "sap.m.Text", "Text"],
			["contractCapitalLabel", Given.getI18nText("xfld.contractCapital"), "sap.m.Label", "Text"],
			["contractCapitalField", getCommon().getAmountFormatter().format(10000.00, "EUR") + " EUR", "sap.m.Text", "Text"],
			["outstandingInterestLabel", Given.getI18nText("xfld.outstandingInterest"), "sap.m.Label", "Text"],
			["outstandingInterestField", getCommon().getAmountFormatter().format(21.70, "EUR") + " EUR", "sap.m.Text", "Text"],
			["outstandingChargesLabel", Given.getI18nText("xfld.outstandingCharges"), "sap.m.Label", "Text"],
			["outstandingChargesField", getCommon().getAmountFormatter().format(105.00, "EUR") + " EUR", "sap.m.Text", "Text"],
			["interestAccruedLabel", Given.getI18nText("xfld.interestAccrued"), "sap.m.Label", "Text"],
			["interestAccruedfield", getCommon().getAmountFormatter().format(60.59, "EUR") + " EUR", "sap.m.Text", "Text"],
			["interestPaidLabel", Given.getI18nText("xfld.interestPaid"), "sap.m.Label", "Text"],
			["interestPaidfield", getCommon().getAmountFormatter().format(0.00, "EUR") + " EUR", "sap.m.Text", "Text"]
		]);
		Then.iTeardownMyAppFrame();
	});

	opaTest("Should see Agreements", function (Given, When, Then) {
		Given.iStartTheApp();
		//Actions
		When.onTheDetailPage.iLookAtTheScreen();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		Then.onTheDetailPage.iLookAtTheScreen();
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.agreements_section");
		// When.onTheDetailPage.iPressAnchor("xtit.agreementPeriod_sub_section");
		// Assertions
		Then.onTheDetailPage.iSeeCorrectValues([
			["agrPeriodStartDateLabel", Given.getI18nText("xfld.startDate"), "sap.m.Label", "Text"],
			["agrPeriodEndDateLabel", Given.getI18nText("xfld.endDate"), "sap.m.Label", "Text"]

		]);
		Then.iTeardownMyAppFrame();
	});

	opaTest("Should see Condition Fixing Agreements", function (Given, When, Then) {
		Given.iStartTheApp();
		//Actions
		When.onTheDetailPage.iLookAtTheScreen();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		Then.onTheDetailPage.iLookAtTheScreen();
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.agreements_section");
		// When.onTheDetailPage.iPressAnchor("xtit.conditionFixingAgreement_sub_section");
		Then.onTheDetailPage.iShouldSeeCFBlock("Collapsed");
		// Assertions
		Then.onTheDetailPage.iSeeCorrectValues([
			["cfaStartDateLabel", Given.getI18nText("xfld.startDate"), "sap.m.Label", "Text"],
			["cfaEndDateLabel", Given.getI18nText("xfld.endDate"), "sap.m.Label", "Text"]
		]);

		Then.onTheDetailPage.iExpandCollapseCFBlock();
		// Then.onTheDetailPage.iShouldSeeTheTable("tablepriceconditions", "BlockPriceConditionDetails").
		Then.onTheDetailPage.iSeeCorrectValues([
			["tablePriceConditionsConditionLabel", Given.getI18nText("xfld.condition"), "sap.m.Label", "Text"],
			["tablePriceConditionsValueLabel", Given.getI18nText("xfld.value"), "sap.m.Label", "Text"],
			["tablePriceConditionsIndividualisedLabel", Given.getI18nText("xfld.individualised"), "sap.m.Label", "Text"],

			["PriceConditionConditions", "Nominal Int. Loans", "sap.m.ObjectIdentifier", "Title"],
			["PriceConditionConditions", "Acct Maint. Charge Loans", "sap.m.ObjectIdentifier", "Title"],
			["PriceConditionConditions", "Admin. Charge Loans", "sap.m.ObjectIdentifier", "Title"],
			["PriceConditionConditions", "Price: Share Disb. Chrge", "sap.m.ObjectIdentifier", "Title"],
			["PriceConditionConditions", "Loan Payoff Activate", "sap.m.ObjectIdentifier", "Title"],
			["PriceConditionConditions", "Loan Payoff Execute", "sap.m.ObjectIdentifier", "Title"],
			["PriceConditionConditions", "Loan Payoff Execute- Partial Payoff", "sap.m.ObjectIdentifier", "Title"],
			["PriceConditionPricevalue", "5 %", "sap.m.Text", "Text"],
			["PriceConditionPricevalue", "5.00 EUR", "sap.m.Text", "Text"],
			["PriceConditionPricevalue", "1 %", "sap.m.Text", "Text"],
			["PriceConditionPricevalue", "2 %", "sap.m.Text", "Text"],
			["PriceConditionPricevalue", "60.00 EUR", "sap.m.Text", "Text"],
			["PriceConditionPricevalue", "50.00 EUR", "sap.m.Text", "Text"],
			["PriceConditionPricevalue", "100.00 EUR", "sap.m.Text", "Text"],
			["PriceConditionIndividualized", "false", "sap.m.CheckBox", "Boolean"],
			["PriceConditionIndividualized", "false", "sap.m.CheckBox", "Boolean"],
			["PriceConditionIndividualized", "false", "sap.m.CheckBox", "Boolean"],
			["PriceConditionIndividualized", "false", "sap.m.CheckBox", "Boolean"],
			["PriceConditionIndividualized", "false", "sap.m.CheckBox", "Boolean"],
			["PriceConditionIndividualized", "false", "sap.m.CheckBox", "Boolean"],
			["PriceConditionIndividualized", "false", "sap.m.CheckBox", "Boolean"]

		]);

		Then.iTeardownMyAppFrame();
	});

	opaTest("Should see Inpayment Agreements", function (Given, When, Then) {
		Given.iStartTheApp();
		//Actions
		When.onTheDetailPage.iLookAtTheScreen();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		Then.onTheDetailPage.iLookAtTheScreen();
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.agreements_section");
		// When.onTheDetailPage.iPressAnchor("xtit.inpaymentAgreement_sub_section");
		Then.onTheDetailPage.iShouldSeeIPBlock("Collapsed");
		// Assertions
		Then.onTheDetailPage.iSeeCorrectValues([
			["ipaStartDateLabel", Given.getI18nText("xfld.startDate"), "sap.m.Label", "Text"],
			["ipaEndDateLabel", Given.getI18nText("xfld.endDate"), "sap.m.Label", "Text"]

			// ["startDatefield", getCommon().getDateFormatter().format(new Date(2001, 0, 2)), "sap.m.Text", "Text"],
			// ["endDatefield", getCommon().getDateFormatter().format(new Date(2002, 0, 2)), "sap.m.Text", "Text"]

		]);

		Then.onTheDetailPage.iExpandCollapseIPBlock();
		// Then.onTheDetailPage.iShouldSeeTheTable("tablepaymentconditions", "BlockPaymentConditionDetails").
		Then.onTheDetailPage.iSeeCorrectValues([
			["tablePaymentConditionsConditionLabel", Given.getI18nText("xfld.condition"), "sap.m.Label", "Text"],
			["tablePaymentConditionsValueLabel", Given.getI18nText("xfld.value"), "sap.m.Label", "Text"],
			["tablePaymentConditionsIndividualizedLabel", Given.getI18nText("xfld.individualised"), "sap.m.Label", "Text"],

			["PaymentConditionConditions", "Receivable (IL) ChargeDue", "sap.m.ObjectIdentifier", "Title"],
			["PaymentConditionConditions", "Receivable:Installment IL", "sap.m.ObjectIdentifier", "Title"],
			["PaymentConditionsValue", "0.00 EUR", "sap.m.Text", "Text"],
			["PaymentConditionsValue", "850.00 EUR", "sap.m.Text", "Text"],
			["PaymentConditionsindividualized", "true", "sap.m.CheckBox", "Boolean"],
			["PaymentConditionsindividualized", "false", "sap.m.CheckBox", "Boolean"]

		]);

		Then.iTeardownMyAppFrame();
	});

	opaTest("Should see Reference Accounts Table", function (Given, When, Then) {
		Given.iStartTheApp();
		//Actions
		When.onTheDetailPage.iLookAtTheScreen();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		When.onTheDetailPage.iPressAnchor("xtit.refAccounts_section");
		// Assertions
		Then.onTheDetailPage.iShouldSeeTheTable("tableRefAccounts", "RefAccounts").
		and.iShouldSeeTableOutput("tableRefAccounts", "RefAccounts", "Reference Accounts");
		Then.onTheDetailPage.iSeeCorrectValues([
			["tableRefAccountsObjIdentifier", "SEPA", "sap.m.ObjectIdentifier", "Title"],
			["tableRefAccountsObjIdentifier", "Internal", "sap.m.ObjectIdentifier", "Title"],
			["tableRefAccountsAccount", "DE83900000010000000001", "sap.m.Text", "Text"],
			["tableRefAccountsAccount", "0000000002", "sap.m.Text", "Text"],
			["tableRefAccountsBankKey", "HASPDEXXX", "sap.m.Text", "Text"],
			["tableRefAccountsBankKey", "90000001", "sap.m.Text", "Text"],
			["tableRefAccountsBankName", "SAP Bank", "sap.m.Text", "Text"],
			["tableRefAccountsBankName", "SAP Bank", "sap.m.Text", "Text"],
			["tableRefAccountsAccountHolder", "Musterbank", "sap.m.Text", "Text"],
			["tableRefAccountsAccountHolder", "Musterbank", "sap.m.Text", "Text"],
			["tableRefAccountsMandateID", "LPM-BP", "sap.m.Link", "Text"],
			["tableRefAccountsMandateID", "", "sap.m.Link", "Text"],
			["tableRefAccountsDisbursementIndicator", "true", "sap.m.CheckBox", "Boolean"],
			["tableRefAccountsDisbursementIndicator", "true", "sap.m.CheckBox", "Boolean"],
			["tableRefAccountsBillingIndicator", "true", "sap.m.CheckBox", "Boolean"],
			["tableRefAccountsBillingIndicator", "false", "sap.m.CheckBox", "Boolean"]
		]);

		Then.onTheDetailPage.iPressMandateQuickView(0);
		//	 Then.onTheDetailPage.iShouldSeeTheTitle("LPM-BP");
		//	 Then.onTheDetailPage.iShouldSeeTheText("DE48ZZZ53003113525");
		//	 Then.onTheDetailPage.iShouldSeeTheText("Jul 17, 2015");
		//	 Then.onTheDetailPage.iShouldSeeTheText("");
		//	 Then.onTheDetailPage.iShouldSeeTheText("Recurring");
		//	 Then.onTheDetailPage.iShouldSeeTheText("DE83900000010010019251");

		Then.iTeardownMyAppFrame();
	});

	opaTest("Should see Receivables Table", function (Given, When, Then) {
		Given.iStartTheApp();
		//Actions
		When.onTheDetailPage.iLookAtTheScreen();
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");

		When.onTheDetailPage.iPressAnchor("xtit.oReceivablesTbl_section");
		
		
		When.onTheDetailPage.iChooseDateRangeSelect("oReceivablesTblDateSelect", "Receivables");

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "all");
		
		// Assertions
		Then.onTheDetailPage.iShouldSeeTheTable("tableReceivables", "Receivables").
		and.iShouldSeeTableOutput("tableReceivables", "Receivables", "Receivables");

		Then.iTeardownMyAppFrame();
	});

	opaTest("I display table Data for Receivable", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		When.onTheDetailPage.iPressAnchor("xtit.oReceivablesTbl_section");
		When.onTheDetailPage.iLookAtTheScreen();
		
		When.onTheDetailPage.iChooseDateRangeSelect("oReceivablesTblDateSelect", "Receivables");

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "all");
		
		// Assertions
		Then.onTheDetailPage.iSeeCorrectValues([
			["tableReceivablesObjIdentifier", "91957", "sap.m.ObjectIdentifier", "Title"],
			["tableReceivablesTypeName", "Charges", "sap.m.Text", "Text"],
			["tableReceivablesDueDate", getCommon().getDateFormatter().format(new Date(2019, 3, 26)), "sap.m.Text", "Text"],
			["tableReceivablesDueAmt", "455.00 EUR", "sap.m.Text", "Text"]
		]);
		Then.iTeardownMyAppFrame();
	});

	opaTest("I display Additional Details for Receivable", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		When.onTheDetailPage.iPressAnchor("xtit.oReceivablesTbl_section");
		
		When.onTheDetailPage.iChooseDateRangeSelect("oReceivablesTblDateSelect", "Receivables");

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "all");
		
		When.onTheDetailPage.iLookAtTheScreen();
		// Assertions
		Then.onTheDetailPage.iSeeCorrectValues([
			["tableReceivablesObjIdentifier", "91957", "sap.m.ObjectIdentifier", "Title"],
			["tableReceivablesTypeName", "Charges", "sap.m.Text", "Text"],
			["tableReceivablesDueDate", getCommon().getDateFormatter().format(new Date(2019, 3, 26)), "sap.m.Text", "Text"],
			["tableReceivablesDueAmt", "455.00 EUR", "sap.m.Text", "Text"]
		]);
		//Then.onTheDetailPage.iPressMoreDetailsPopover(0);
		//	Then.onTheDetailPage.iShouldSeeTheText("MUSTERBANK");
		//	Then.onTheDetailPage.iShouldSeeTheText("001100001169");
		//	Then.onTheDetailPage.iShouldSeeTheText("Direct Debit");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I change receivables date range filter", function (Given, When, Then) {
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.oReceivablesTbl_section");

		When.onTheDetailPage.iChooseDateRangeSelect("oReceivablesTblDateSelect", "Receivables");

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "all");
		// Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("oReceivablesTblDateRangeSelection", "Receivables", "all", false);

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "thisMonth");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "thisMonth");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("oReceivablesTblDateRangeSelection", "Receivables", "thisMonth", false);

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "thisQuarter");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "thisQuarter");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("oReceivablesTblDateRangeSelection", "Receivables", "thisQuarter", false);

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "thisYear");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "thisYear");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("oReceivablesTblDateRangeSelection", "Receivables", "thisYear", false);

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "dateRange");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "dateRange");
		// Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("oReceivablesTblDateRangeSelection", "Receivables", "dateRange", true);

		When.onTheDetailPage.iEnterDateRangeFilter("oReceivablesTblDateRangeSelection", "Receivables",
			new UniversalDate("2002", "01", "01"), new UniversalDate("2020", "11", "31"));
		Then.onTheDetailPage.iTriggerDateRangeSelection("oReceivablesTblDateRangeSelection", "Receivables");
		//	Then.onTheDetailPage.iShouldSeeTableOutput("tableReceivables", "Receivables", "Receivables");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I press receivables table settings and sort", function (Given, When, Then) {
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.oReceivablesTbl_section");
		
		When.onTheDetailPage.iChooseDateRangeSelect("oReceivablesTblDateSelect", "Receivables");

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "all");
		
		Then.onTheDetailPage.iPressButton("oReceivablesTblSettingsBtn", "Receivables");
		Then.onTheDetailPage.iPressDialogButton("ReceivablesFragment--oReceivablesTblDialog-sortbutton");
		Then.onTheDetailPage.iPressDialogButton("ReceivablesFragment--oReceivablesTblDialog-acceptbutton");
		Then.onTheDetailPage.iSeeCorrectValues([
			["tableReceivablesObjIdentifier", "91957", "sap.m.ObjectIdentifier", "Title"],
			["tableReceivablesTypeName", "Charges", "sap.m.Text", "Text"],
			["tableReceivablesDueDate", getCommon().getDateFormatter().format(new Date(2019, 3, 26)), "sap.m.Text", "Text"],
			["tableReceivablesDueAmt", "455.00 EUR", "sap.m.Text", "Text"]
		]);
		Then.iTeardownMyAppFrame();
	});
	opaTest("I press receivables table settings and filter", function (Given, When, Then) {
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.oReceivablesTbl_section");
		
		When.onTheDetailPage.iChooseDateRangeSelect("oReceivablesTblDateSelect", "Receivables");

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "all");

		Then.onTheDetailPage.iPressButton("oReceivablesTblSettingsBtn", "Receivables");
		Then.onTheDetailPage.iPressDialogButton("ReceivablesFragment--oReceivablesTblDialog-filterbutton");
		Then.onTheDetailPage.iSelectListItemInViewSettingsDialog("Receivable Type").
		and.iSelectListItemInViewSettingsDialog("Charges");
		Then.onTheDetailPage.iPressDialogButton("ReceivablesFragment--oReceivablesTblDialog-acceptbutton");
		Then.onTheDetailPage.iSeeCorrectValues([
			["tableReceivablesObjIdentifier", "91957", "sap.m.ObjectIdentifier", "Title"],
			["tableReceivablesTypeName", "Charges", "sap.m.Text", "Text"],
			["tableReceivablesDueDate", getCommon().getDateFormatter().format(new Date(2019, 3, 26)), "sap.m.Text", "Text"],
			["tableReceivablesDueAmt", "455.00 EUR", "sap.m.Text", "Text"]
		]);
		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter invalid date in date range selection and see receivables date range field in error state", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.oReceivablesTbl_section");

		When.onTheDetailPage.iChooseDateRangeSelect("oReceivablesTblDateSelect", "Receivables");

		When.onTheDetailPage.iSelectInSelectOption("oReceivablesTblDateSelect", "Receivables", "dateRange");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("oReceivablesTblDateSelect", "Receivables", "dateRange");

		When.onTheDetailPage.iEnterDateRangeFilter("oReceivablesTblDateRangeSelection", "Receivables",
			new UniversalDate("hdsk", "0", "01"), new UniversalDate("test", "11", "31"));
		Then.onTheDetailPage.iTriggerDateRangeSelection("oReceivablesTblDateRangeSelection", "Receivables");
		// Assertions
		Then.onTheSearchPage.iSeeCorrectValueState("oReceivablesTblDateRangeSelection", "Error");

		When.onTheDetailPage.iEnterDateRangeFilter("oReceivablesTblDateRangeSelection", "Receivables",
			new UniversalDate("2011", "0", "01"), new UniversalDate());
		Then.onTheDetailPage.iTriggerDateRangeSelection("oReceivablesTblDateRangeSelection", "Receivables");
		// Assertions
		Then.onTheSearchPage.iSeeCorrectValueState("oReceivablesTblDateRangeSelection", "Error");
		Then.iTeardownMyAppFrame();

	});

	// ****** OPA Test for Financial - Turnover data  *********		
	opaTest("Should display Posted Turnovers data", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.turnover_sub_section");
		When.onTheDetailPage.iLookAtTheScreen();

		When.onTheDetailPage.iChooseDateRangeSelect("turnoverDurationSelect", "Turnover");

		When.onTheDetailPage.iSelectInSelectOption("turnoverDurationSelect", "Turnover", "thisQuarter");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("turnoverDurationSelect", "Turnover", "thisQuarter");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("turnoverDateRangeSelection", "Turnover", "thisQuarter", false);

		When.onTheDetailPage.iSelectInSelectOption("turnoverDurationSelect", "Turnover", "thisMonth");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("turnoverDurationSelect", "Turnover", "thisMonth");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("turnoverDateRangeSelection", "Turnover", "thisMonth", false);

		When.onTheDetailPage.iSelectInSelectOption("turnoverDurationSelect", "Turnover", "thisYear");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("turnoverDurationSelect", "Turnover", "thisYear");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("turnoverDateRangeSelection", "Turnover", "thisYear", false);

		When.onTheDetailPage.iSelectInSelectOption("turnoverDurationSelect", "Turnover", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("turnoverDurationSelect", "Turnover", "all");

		When.onTheDetailPage.iSelectInSelectOption("turnoverDurationSelect", "Turnover", "dateRange");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("turnoverDurationSelect", "Turnover", "dateRange");

		When.onTheDetailPage.iEnterDateRangeFilter("turnoverDateRangeSelection", "Turnover",
			new UniversalDate("1900", "0", "01"), new UniversalDate("2199", "11", "31"));
		Then.onTheDetailPage.iTriggerDateRangeSelection("turnoverDateRangeSelection", "Turnover");

		Then.iTeardownMyAppFrame();
	});

	opaTest("Should display Posted Turnovers Table data", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.cashflow_section"));
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.turnover_sub_section"));
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.turnover_sub_section");
		When.onTheDetailPage.iLookAtTheScreen();
		
		When.onTheDetailPage.iChooseDateRangeSelect("turnoverDurationSelect", "Turnover");
		
		When.onTheDetailPage.iSelectInSelectOption("turnoverDurationSelect", "Turnover", "all");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("turnoverDurationSelect", "Turnover", "all");

		Then.onTheDetailPage.iSeeCorrectValues([
			// ["tableTurnoverObjIdentifier", getCommon().getDateFormatter().format(new Date(2001, 0, 2)), "sap.m.ObjectIdentifier", "Title"],
			["tableTurnoverDescription", "Installment: Owed", "sap.m.Text", "Text"],
			// ["tableTurnoverDueDate", getCommon().getDateFormatter().format(new Date(2001, 0, 2)), "sap.m.Text", "Text"],
			// ["tableTurnoverPaymentDate", getCommon().getDateFormatter().format(new Date(2001, 0, 2)), "sap.m.Text", "Text"],
			["tableTurnoverStatus", "Billed", "sap.m.Text", "Text"],
			["tableTurnoverBillingDocNo", "42113", "sap.m.Text", "Text"],
			["tableTurnoverDebitAmt", "850.00 EUR", "sap.m.Text", "Text"],
			["tableTurnoverCreditAmt", "0.00 EUR", "sap.m.Text", "Text"]
		]);

		Then.onTheDetailPage.iPressButton("postedTurnoversSettingsBtn", "Turnover");
		Then.onTheDetailPage.iPressDialogButton("TurnoverFragment--turnoverDialog-filterbutton");
		Then.onTheDetailPage.iSelectListItemInViewSettingsDialog("Status").
		and.iSelectListItemInViewSettingsDialog("Billed");
		Then.onTheDetailPage.iPressDialogButton("TurnoverFragment--turnoverDialog-acceptbutton");

		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter invalid date in date range selection and see turnvers date range field in error state", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.turnover_sub_section");

		When.onTheDetailPage.iChooseDateRangeSelect("turnoverDurationSelect", "Turnover");

		When.onTheDetailPage.iSelectInSelectOption("turnoverDurationSelect", "Turnover", "dateRange");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("turnoverDurationSelect", "Turnover", "dateRange");

		When.onTheDetailPage.iEnterDateRangeFilter("turnoverDateRangeSelection", "Turnover",
			new UniversalDate("hgdf", "0", "01"), new UniversalDate("test", "11", "31"));
		Then.onTheDetailPage.iTriggerDateRangeSelection("turnoverDateRangeSelection", "Turnover");
		Then.onTheSearchPage.iSeeCorrectValueState("turnoverDateRangeSelection", "Error");

		When.onTheDetailPage.iEnterDateRangeFilter("turnoverDateRangeSelection", "Turnover",
			new UniversalDate("hgdf", "0", "01"), new UniversalDate());
		Then.onTheDetailPage.iTriggerDateRangeSelection("turnoverDateRangeSelection", "Turnover");
		Then.onTheSearchPage.iSeeCorrectValueState("turnoverDateRangeSelection", "Error");

		Then.iTeardownMyAppFrame();

	});

	// ***** OPA Test for Financial Turnover - Payment Plan data 	********
	opaTest("Should display Payment Plan data on change of account", function (Given, When, Then) { // Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE40904199160010014883");
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.cashflow_section"));
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.paymentPlan_sub_section"));
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.paymentPlan_sub_section");
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		When.onTheDetailPage.iLookAtTheScreen();
		When.onTheDetailPage.iChooseDateRangeSelect("paymentPlanDurationSelect", "PaymentPlan");
		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "all");

		Then.onTheDetailPage.iSeeCorrectValues([
			// ["tablePaymentPlanObjIdentifier", getCommon().getDateFormatter().format(new Date(2001, 1, 28)), "sap.m.ObjectIdentifier", "Title"],
			["tablePaymentPlanAmount", "955.00 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanRglrInstallmentToBePaidAmount", "850.00 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanInterestToBePaidAmount", "38.29 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanAmortizationToBePaidAmount", "811.71 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanChargeToBePaidAmount", "105.00 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanLoanContrRemainingDebtAmount", "8,377.18 EUR", "sap.m.Text", "Text"]
		]);
		Then.onTheSearchPage.iEnterAccountSearch("DE40904199160010014883");
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		Then.iTeardownMyAppFrame();
	});

	opaTest("Should display Payment Plan data", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.cashflow_section"));
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.paymentPlan_sub_section"));
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.paymentPlan_sub_section");
		When.onTheDetailPage.iLookAtTheScreen();

		When.onTheDetailPage.iChooseDateRangeSelect("paymentPlanDurationSelect", "PaymentPlan");

		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "thisQuarter");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("paymentPlanDurationSelect", "PaymentPlan", "thisQuarter");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("paymentPlanDateRangeSelection", "PaymentPlan", "thisQuarter", false);

		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "thisMonth");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("paymentPlanDurationSelect", "PaymentPlan", "thisMonth");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("paymentPlanDateRangeSelection", "PaymentPlan", "thisMonth", false);

		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "thisYear");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("paymentPlanDurationSelect", "PaymentPlan", "thisYear");
		Then.onTheDetailPage.iShouldSeeSelectedDateRangeValue("paymentPlanDateRangeSelection", "PaymentPlan", "thisYear", false);

		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "dateRange");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("paymentPlanDurationSelect", "PaymentPlan", "dateRange");

		When.onTheDetailPage.iEnterDateRangeFilter("paymentPlanDateRangeSelection", "PaymentPlan",
			new UniversalDate("1900", "0", "01"), new UniversalDate("2199", "11", "31"));
		Then.onTheDetailPage.iTriggerDateRangeSelection("paymentPlanDateRangeSelection", "PaymentPlan");

		// Assertions
		//Then.onTheDetailPage.iShouldSeeTheTable("tablePaymentPlan", "PaymentPlan");
		//and.iShouldSeeTableOutput("tablePaymentPlan", "PaymentPlan", "Payment Plan");

		Then.iTeardownMyAppFrame();
	});

	opaTest("Should display Payment Plan Table data", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.cashflow_section"));
		// When.onTheDetailPage.iPressAnchor(Given.getI18nText("xtit.paymentPlan_sub_section"));
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.paymentPlan_sub_section");
		When.onTheDetailPage.iLookAtTheScreen();

		When.onTheDetailPage.iChooseDateRangeSelect("paymentPlanDurationSelect", "PaymentPlan");
		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "all");

		Then.onTheDetailPage.iSeeCorrectValues([
			// ["tablePaymentPlanObjIdentifier", getCommon().getDateFormatter().format(new Date(2001, 1, 28)), "sap.m.ObjectIdentifier", "Title"],
			["tablePaymentPlanAmount", "955.00 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanRglrInstallmentToBePaidAmount", "850.00 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanInterestToBePaidAmount", "38.29 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanAmortizationToBePaidAmount", "811.71 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanChargeToBePaidAmount", "105.00 EUR", "sap.m.Text", "Text"],
			["tablePaymentPlanLoanContrRemainingDebtAmount", "8,377.18 EUR", "sap.m.Text", "Text"]
		]);

		Then.iTeardownMyAppFrame();

	});

	opaTest("I press payment plan table settings", function (Given, When, Then) {
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.paymentPlan_sub_section");
		
		When.onTheDetailPage.iChooseDateRangeSelect("paymentPlanDurationSelect", "PaymentPlan");
		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "all");

		Then.onTheDetailPage.iPressButton("paymentPlanSettingsBtn", "PaymentPlan");
		Then.onTheDetailPage.iPressDialogButton("PaymentPlanFragment--paymentPlanDialog-acceptbutton");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I enter invalid date in date range selection and see payment plan date range field in error state", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		Then.onTheSearchPage.iEnterAccountSearch("0010030023");
		When.onTheDetailPage.iPressAnchor("xtit.cashflow_section");
		// When.onTheDetailPage.iPressAnchor("xtit.paymentPlan_sub_section");

		When.onTheDetailPage.iChooseDateRangeSelect("paymentPlanDurationSelect", "PaymentPlan");
		When.onTheDetailPage.iSelectInSelectOption("paymentPlanDurationSelect", "PaymentPlan", "dateRange");
		Then.onTheDetailPage.iShouldSeeTheSelectedValue("paymentPlanDurationSelect", "PaymentPlan", "dateRange");

		When.onTheDetailPage.iEnterDateRangeFilter("paymentPlanDateRangeSelection", "PaymentPlan",
			new UniversalDate("dhd", "0", "01"), new UniversalDate("test", "11", "31"));
		Then.onTheDetailPage.iTriggerDateRangeSelection("paymentPlanDateRangeSelection", "PaymentPlan");
		Then.onTheSearchPage.iSeeCorrectValueState("paymentPlanDateRangeSelection", "Error");

		When.onTheDetailPage.iEnterDateRangeFilter("paymentPlanDateRangeSelection", "PaymentPlan",
			new UniversalDate("dhd", "0", "01"), new UniversalDate());
		Then.onTheDetailPage.iTriggerDateRangeSelection("paymentPlanDateRangeSelection", "PaymentPlan");
		Then.onTheSearchPage.iSeeCorrectValueState("paymentPlanDateRangeSelection", "Error");

		Then.iTeardownMyAppFrame();

	});
/*	opaTest("I click on See More Button", function (Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		//Actions
		Then.onTheSearchPage.iEnterAccountSearch("DE53904210810010030023");
		When.onTheDetailPage.iLookAtTheScreen();
		// Assertions

		Then.onTheDetailPage.iLookAtTheScreen();
		Then.onTheDetailPage.iShouldSeeTheAccountNumber("0010030023");

		Then.onTheDetailPage.iClickTheLink("buttonFurther");

		Then.iTeardownMyAppFrame();
	});*/

});