sap.ui.define([
	    "jquery.sap.global", 
        "sap/ui/core/format/NumberFormat", 
        "sap/ui/model/SimpleType", 
        "sap/ui/model/FormatException",
		"sap/ui/model/ParseException", 
		"sap/ui/model/ValidateException"
	],
	function(jQuery, NumberFormat, SimpleType, FormatException, ParseException, ValidateException) {
		"use strict";

		/**
		 * Constructor for a Percentage type.
		 * 
		 * 
		 * @constructor
		 * @public
		 * @param {object} [oFormatOptions] formatting options. Supports the same options as {@link sap.ui.core.format.NumberFormat.getIntegerInstance NumberFormat.getIntegerInstance}
		 * @param {object} [oFormatOptions.source] additional set of format options to be used if the property in the model is not of type string and needs formatting as well.
		 * 										   In case an empty object is given, the default is disabled grouping and a dot as decimal separator.
		 * @param {object} [oConstraints] value constraints.
		 * @param {int} [oConstraints.minimum] smallest value allowed for this type
		 * @param {int} [oConstraints.maximum] largest value allowed for this type
		 * @alias sap.ui.model.type.Integer
		 * 
		 */
		var PercentageType = SimpleType.extend("fs.cb.consumerloan.manages1.model.PercentageType",  {

			constructor: function() {
				SimpleType.apply(this, arguments);
				this.sName = "PercentageType";
			}

		});

		/** 
		 * backend provides with value like "10.25" -> it means "10.25%"
		 * @see sap.ui.model.SimpleType.prototype.formatValue
		 * @param {int} [vValue] value to be formatted
		 * @param {string} [sInternalType] Internal type like string, int or float
		 * @returns {string} Formatted value like '10.25%'
		 */
		PercentageType.prototype.formatValue = function(vValue, sInternalType) {
			var iValue = vValue;
			if (vValue === undefined || vValue === null || vValue === "") {
				return "";
			}
			if (this.oInputFormat) {
				iValue = this.oInputFormat.parse(vValue);
				if (iValue === null) {
					throw new FormatException("Cannot format: " + vValue + " has the wrong format");
				}
			}
			switch (this.getPrimitiveType(sInternalType)) {
				case "string":
					var iPercentage = parseFloat(iValue, 10);
		            iPercentage = parseFloat((iValue / 100).toFixed(4),10); 
		            //var sPercentageValue = iPercentage.toString();

					return this.oOutputFormat.format(iPercentage);
				case "int":
				case "float":
				case "any":
					return iValue;
				default:
					throw new FormatException("Don't know how to format PercentageType to " + sInternalType);
			}
		};

		/*
		 * UI provides with value like "10.25%" -> it means "10.25" for backend communication
		 * @see sap.ui.model.SimpleType.prototype.parseValue
		 * @param {int} [vValue] value to be parsed
		 * @param {string} [sInternalType] Internal type like string, int or float
		 * @returns {string} parsed value like "10.25"
		 */
		PercentageType.prototype.parseValue = function(vValue, sInternalType) {
		// 	var iResult, iValue;
		// 	switch (this.getPrimitiveType(sInternalType)) {
		// 		case "string":
		// 			iValue = this.oOutputFormat.parse(String(vValue));
		// 			if (isNaN(iValue)) {
		// 				throw new ParseException();
		// 			}
		// 			break;
		// 		case "float":
		// 			iValue = Math.floor(vValue);
		// 			if (iValue !== vValue) {
		// 				throw new ParseException();
		// 			}
		// 			break;
		// 		case "int":
		// 			iValue = vValue;
		// 			break;
		// 		default:
		// 			throw new ParseException("Don't know how to parse PercentageType from " + sInternalType);
		// 	}
		// 	if (this.oInputFormat) {
		// 		iValue = this.oInputFormat.format(iValue);
		// 	}
		// 	iResult = (iValue * 100).toFixed(2).toString();
		// 	return iResult;
		 };

		/**
		 * @see sap.ui.model.SimpleType.prototype.validateValue
		 * @param {int} [iValue] value to be validated
		 */
		PercentageType.prototype.validateValue = function(iValue) {
			// if (this.oConstraints) {
			// 	var oBundle = sap.ui.getCore().getLibraryResourceBundle(),
			// 		aViolatedConstraints = [],
			// 		aMessages = [];
			// 	jQuery.each(this.oConstraints, function(sName, oContent) {
			// 		switch (sName) {
			// 			case "minimum":
			// 				if (iValue < oContent) {
			// 					aViolatedConstraints.push("minimum");
			// 					aMessages.push(oBundle.getText("Integer.Minimum", [oContent]));
			// 				}
			// 				break;
			// 			case "maximum":
			// 				if (iValue > oContent) {
			// 					aViolatedConstraints.push("maximum");
			// 					aMessages.push(oBundle.getText("Integer.Maximum", [oContent]));
			// 				}
			// 		}
			// 	});
			// 	if (aViolatedConstraints.length > 0) {
			// 		throw new ValidateException(aMessages.join(" "), aViolatedConstraints);
			// 	}
			// }
		};

		/**
		 * @see sap.ui.model.SimpleType.prototype.setFormatOptions
		 * @param {object} [oFormatOptions] see sap.ui.model.SimpleType.prototype.setFormatOptions
		 */
		PercentageType.prototype.setFormatOptions = function(oFormatOptions) {
			this.oFormatOptions = oFormatOptions;
			this._createFormats();
		};

		/**
		 * Called by the framework when any localization setting changed
		 * @private
		 */
		PercentageType.prototype._handleLocalizationChange = function() {
			this._createFormats();
		};

		/**
		 * Create formatters used by this type
		 * @private
		 */
		PercentageType.prototype._createFormats = function() {
			var oSourceOptions = this.oFormatOptions.source;
			this.oOutputFormat = NumberFormat.getPercentInstance(this.oFormatOptions);
			if (oSourceOptions) {
				if (jQuery.isEmptyObject(oSourceOptions)) {
					oSourceOptions = {
						groupingEnabled: false,
						groupingSeparator: ",",
						decimalSeparator: "."
					};
				}
				this.oInputFormat = NumberFormat.getPercentInstance(oSourceOptions);
			}
		};

		return PercentageType;

	});