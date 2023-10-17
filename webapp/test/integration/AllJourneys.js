jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/consumerloan/manages1/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"fs/cb/consumerloan/manages1/test/integration/pages/Browser",
	"fs/cb/consumerloan/manages1/test/integration/pages/Detail",
	"fs/cb/consumerloan/manages1/test/integration/pages/Search",
	"fs/cb/consumerloan/manages1/test/integration/pages/NotFound",
	"fs/cb/consumerloan/manages1/test/integration/pages/Error",
	"fs/cb/consumerloan/manages1/test/integration/pages/Start",
	"fs/cb/consumerloan/manages1/test/integration/pages/FLP",
	"fs/cb/consumerloan/manages1/test/integration/pages/CrossAppTest",
	"fs/cb/consumerloan/manages1/test/integration/pages/App"

], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "fs.cb.consumerloan.manages1.view."
	});
	sap.ui.require([
	//	"fs/cb/consumerloan/manages1/test/integration/CrossAppNavigationJourney"
		"fs/cb/consumerloan/manages1/test/integration/SearchJourney",
		"fs/cb/consumerloan/manages1/test/integration/InAppNavigationJourney",
		 "fs/cb/consumerloan/manages1/test/integration/DetailJourney"
		
	], function() {
		QUnit.start();
	});
});