/*global QUnit*/

sap.ui.define([
	"fs/cb/consumerloan/manages1/model/models",
	"sap/ui/Device"
], function (models, Device) {
	"use strict";
	QUnit.module("createDeviceModel", {
		afterEach : function () {
			this.oDeviceModel.destroy();
		}
	});

/*function isPhoneTestCase(assert, bIsPhone) {
		// Arrange
		this.stub(Device, "system", { phone : bIsPhone });

		// System under test
		this.oDeviceModel = models.createDeviceModel();

		// Assert
		assert.strictEqual(this.oDeviceModel.getData().system.phone, bIsPhone, "IsPhone property is correct");
	}*/



/*	function isTouchTestCase(assert, bIsTouch) {
		// Arrange
		this.stub(Device, "support", { touch : bIsTouch });

		// System under test
		this.oDeviceModel = models.createDeviceModel();

		// Assert
		assert.strictEqual(this.oDeviceModel.getData().support.touch, bIsTouch, "IsTouch property is correct");
	}*/


	QUnit.test("The binding mode of the device model should be one way", function (assert) {

		// System under test
		this.oDeviceModel = models.createDeviceModel();

		// Assert
		assert.strictEqual(this.oDeviceModel.getDefaultBindingMode(), "OneWay", "Binding mode is correct");
	});

});
