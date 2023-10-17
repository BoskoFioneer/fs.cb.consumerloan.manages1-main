sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("test.integration.crossapp.Component", {

		metadata: {
			//manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

		},

		createContent: function() {
		    
		   var myView = sap.ui.xmlview("TestPage",{
               viewName : "test.integration.crossapp.view.TestPage"
            });

			// put the View onto the screen
			return myView;
		}

	});

});