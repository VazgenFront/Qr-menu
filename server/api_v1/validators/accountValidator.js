const validator = require("validator");
const { toObjectId } = require("../../helpers/conversions");
const { rgbRegex, rgbaRegex, defaultFontFamily } = require("../../config/parameters");

const isString = (str) => typeof str === "string";

const AccountValidator = {
	authenticate: (body) => {
		if (!body.username) {
			throw new Error("Missing parameter username.")
		}
		if (!body.password) {
			throw new Error("Missing parameter password.")
		}
		if (!validator.isAlphanumeric(body.username) && !validator.isLength(body.username, { min: 4, max: 20 })) {
			throw new Error("Invalid parameter username.")
		}
		if (!isString(body.password) && !validator.isLength(body.password, { min: 6, max: 40 })) {
			throw new Error("Invalid parameter password.")
		}

		return {
			...body,
		}
	},

	register: (body) => {
		if (!body.username) {
			throw new Error("Missing parameter username.")
		}
		if (!body.password) {
			throw new Error("Missing parameter password.")
		}
		if (!body.name) {
			throw new Error("Missing parameter name.")
		}
		if (!body.email) {
			throw new Error("Missing parameter email.")
		}
		if (!validator.isAlphanumeric(body.username) && !validator.isLength(body.username, { min: 4, max: 20 })) {
			throw new Error("Invalid parameter username.")
		}
		if (!isString(body.password) && !validator.isLength(body.password, { min: 6, max: 40 })) {
			throw new Error("Invalid parameter password.")
		}
		if (!validator.isLength(body.name, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter name.")
		}
		if (!validator.isEmail(body.email)) {
			throw new Error("Invalid parameter email.")
		}
	},

	getAccountId: (decoded) => {
		if (!decoded._id) {
			throw new Error("Missing information about account. Token is invalid");
		}

		return {
			_id: toObjectId(decoded._id)
		};
	},

	editAccount: (body) => {
		const params = {};
		if (body.name) {
			if (!validator.isLength(body.name, { min: 2, max: 30 })) {
				throw new Error("Invalid parameter name.")
			}
			params.name = body.name;
		}
		if (body.img) {
			if (!isString(body.img)) {
				throw new Error("Invalid parameter img.")
			}
			params.img = body.img;
		}
		if (body.typeId) {
			if (!isString(body.typeId)) {
				throw new Error("Invalid parameter typeId.")
			}
			params.typeId = body.typeId;
		}
		if (body.subTypeId) {
			if (!isString(body.subTypeId)) {
				throw new Error("Invalid parameter subTypeId.")
			}
			params.subTypeId = body.subTypeId;
		}

		return params;
	},

	editStyle: (body) => {
		const params = {};

		if (body.navbarBgColor) {
			if (!isString(body.navbarBgColor) || !(rgbRegex.test(body.navbarBgColor) || rgbaRegex.test(body.navbarBgColor))) {
				throw new Error("Invalid parameter navbarBgColor.")
			}
			params.navbarBgColor = body.navbarBgColor;
		}
		if (body.navbarTitleColor) {
			if (!isString(body.navbarTitleColor) || !(rgbRegex.test(body.navbarTitleColor) || rgbaRegex.test(body.navbarTitleColor))) {
				throw new Error("Invalid parameter navbarTitleColor.")
			}
			params.navbarTitleColor = body.navbarTitleColor;
		}
		if (body.mostBookedBorder) {
			if (!isString(body.mostBookedBorder) || !(rgbRegex.test(body.mostBookedBorder) || rgbaRegex.test(body.mostBookedBorder))) {
				throw new Error("Invalid parameter mostBookedBorder.")
			}
			params.mostBookedBorder = body.mostBookedBorder;
		}
		if (body.logo) {
			if (!isString(body.logo)) {
				throw new Error("Invalid parameter logo.")
			}
			params.logo = body.logo;
		}
		if (body.fontFamily) {
			if (!isString(body.fontFamily)) {
				throw new Error("Invalid parameter subTypeId.")
			}
			params.fontFamily = `body.fontFamily, ${defaultFontFamily}`;
		}
		const allParamsProvided = !!body.navbarBgColor && !!body.navbarTitleColor && !!body.logo && !!body.mostBookedBorder && !!body.fontFamily;

		return {
			params,
			allParamsProvided,
		};
	},

};

module.exports = AccountValidator;