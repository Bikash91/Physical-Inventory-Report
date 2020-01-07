/* 
 * Copyright (C) 2009-2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	return {

		setStatus: function (value) {
			debugger;
			value = parseFloat(value);
			if (value > 0) {
				return 'Success';
			} else {
				return 'Error';
			}
		}
	};

});