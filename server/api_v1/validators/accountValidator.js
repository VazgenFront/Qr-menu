const moment = require("moment");
const validator = require("validator");
const { rgbRegex, rgbaRegex, defaultFontFamily } = require("../../config/parameters");
const { toObjectId } = require("../../helpers/conversions");

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

	dashboardStatistics: (query) => {
		if (query.daysBefore) {
			if (!validator.isNumeric(query.daysBefore)) {
				throw new Error("Invalid parameter daysBefore.")
			}
			return {
				startDate: moment().subtract(parseInt(query.daysBefore), "days").toDate(),
				endDate: new Date(),
			};
		} else {
			if (!query.startDate) {
				throw new Error("Missing parameter startDate.")
			}
			if (!query.endDate) {
				throw new Error("Missing parameter endDate.")
			}
			if (!moment(query.startDate, "YYYY-MM-DD").isValid()) {
				throw new Error("Invalid parameter startDate.")
			}
			if (!moment(query.endDate, "YYYY-MM-DD").isValid()) {
				throw new Error("Invalid parameter endDate.")
			}
			if (!moment(query.startDate).isBefore(moment(query.endDate))) {
				throw new Error("Parameter startDate must be before endDate.")
			}

			return {
				startDate: new Date(query.startDate),
				endDate: new Date(query.endDate),
			}
		}
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
			params.fontFamily = `${body.fontFamily}, ${defaultFontFamily}`;
		}
		const allParamsProvided = !!body.navbarBgColor && !!body.navbarTitleColor && !!body.logo && !!body.mostBookedBorder && !!body.fontFamily;

		return {
			params,
			allParamsProvided,
		};
	},

	addMenuItem(body) {
		if (!body.type) {
			throw new Error("Missing parameter type.")
		}
		if (!validator.isLength(body.type, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter type.")
		}
		if (!body.name) {
			throw new Error("Missing parameter name.")
		}
		if (!validator.isLength(body.name, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter name.")
		}
		if (!body.description) {
			throw new Error("Missing parameter description.")
		}
		if (!validator.isLength(body.description, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter description.")
		}
		if (!body.img) {
			throw new Error("Missing parameter img.")
		}
		if (!isString(body.img)) {
			throw new Error("Invalid parameter img.")
		}
		if (!body.price) {
			throw new Error("Missing parameter price.")
		}
		if (!validator.isNumeric(String(body.price))) {
			throw new Error("Invalid parameter price.")
		}
		if (!body.currency) {
			throw new Error("Missing parameter currency.")
		}
		if (!validator.isLength(body.currency, { min: 1, max: 3 })) {
			throw new Error("Invalid parameter currency.")
		}
		if (!body.isMainDish) {
			throw new Error("Missing parameter isMainDish.")
		}
		if (!validator.isBoolean(String(body.isMainDish))) {
			throw new Error("Invalid parameter isMainDish.")
		}
		const params = {
			type: body.type,
			name: body.name,
			description: body.description,
			img: body.img,
			price: body.price,
			currency: body.currency,
			isMainDish: Boolean(body.isMainDish),
		};
		return params;
	},

	getMenuItems(query) {
		const params = {
			offset: 0,
			limit: 0,
		}

		if (query.page && query.pageLimit
			&& validator.isNumeric(String(query.page)) && validator.isNumeric(String(query.pageLimit))
			&& Number(query.page) >= 1 && Number(query.pageLimit) >= 1
		) {
			params.limit = parseInt(query.pageLimit);
			params.offset = params.limit * (parseInt(query.page) - 1);
		}

		if (query.namePart) {
			params.namePart = query.namePart;
		}

		return params;
	},

	editMenuItem(body) {
		const params = this.addMenuItem(body);
		if (!body.id) {
			throw new Error("Missing parameter id.")
		}
		if (!validator.isNumeric(String(body.id))) {
			throw new Error("Invalid parameter id.")
		}
		return {
			updateParams: params,
			id: body.id,
		}
	},

	getMenuItemsOfType (query) {
		const params = this.getMenuItems(query);
		if (!query.type) {
			throw new Error("Missing parameter type.")
		}
		if (!validator.isLength(query.type, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter type.")
		}
		return {
			...params,
			type: query.type,
		};
	},

	menuItemId: (body) => {
		if (!body.menuItemId) {
			throw new Error("Missing parameter menuItemId.")
		}
		if (!validator.isNumeric(String(body.menuItemId))) {
			throw new Error("Invalid parameter menuItemId.")
		}
		return body.menuItemId;
	},

	addMenuType: (body) => {
		if (!body.typeName) {
			throw new Error("Missing parameter typeName.")
		}
		if (!validator.isLength(body.typeName, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter typeName.")
		}
		if (!body.img) {
			throw new Error("Missing parameter img.")
		}
		if (!isString(body.img)) {
			throw new Error("Invalid parameter img.")
		}

		return {
			name: body.typeName,
			img: body.img,
		}
	},

	editMenuType: (body) => {
		if (!body.oldName) {
			throw new Error("Missing parameter oldName.")
		}
		if (!validator.isLength(body.oldName, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter oldName.")
		}
		if (!body.newName) {
			throw new Error("Missing parameter newName.")
		}
		if (!validator.isLength(body.newName, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter newName.")
		}
		if (!body.img) {
			throw new Error("Missing parameter img.")
		}
		if (!isString(body.img)) {
			throw new Error("Invalid parameter img.")
		}

		return {
			oldName: body.oldName,
			newName: body.newName,
			img: body.img,
		}
	},

	deleteMenuType: (body) => {
		if (!body.typeName) {
			throw new Error("Missing parameter typeName.")
		}
		if (!validator.isLength(body.typeName, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter typeName.")
		}
		return body.typeName;
	},

	editDefaultMenuType: (body) => {
		if (!body.newName) {
			throw new Error("Missing parameter newName.")
		}
		if (!validator.isLength(body.newName, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter newName.")
		}
		return body.newName;
	},

	addTable(body, notes) {
		if (!body.name) {
			throw new Error("Missing parameter name.")
		}
		if (!validator.isLength(body.name, { min: 2, max: 30 })) {
			throw new Error("Invalid parameter name.")
		}
		if (!body.seatCount) {
			throw new Error("Missing parameter seatCount.")
		}
		if (!validator.isNumeric(String(body.seatCount))) {
			throw new Error("Invalid parameter seatCount.")
		}
		return {
			name: body.name,
			seatCount: Number(body.seatCount),
			notes: notes || `New table created at ${new Date().toString()}`,
		}
	},

	editTable(body) {
		const params = this.addTable(body, `Table edited at ${new Date().toString()}`);
		if (!body.tableId) {
			throw new Error("Missing parameter tableId.")
		}
		if (!validator.isMongoId(body.tableId)) {
			throw new Error("Invalid parameter tableId.")
		}
		return {
			tableId: toObjectId(body.tableId),
			updateParams: params,
		}
	},

	deleteTable(body) {
		if (!body.tableId) {
			throw new Error("Missing parameter tableId.")
		}
		if (!validator.isMongoId(body.tableId)) {
			throw new Error("Invalid parameter tableId.")
		}
		return toObjectId(body.tableId);
	},

	getTableOrder: (query) => {
		if (!query.tableId) {
			throw new Error("Missing parameter tableId.")
		}
		if (!validator.isMongoId(query.tableId)) {
			throw new Error("Invalid parameter tableId.")
		}
		return toObjectId(query.tableId);
	},

	getOrders: (query) => {
		const params = {};
		if (query.dateFrom) {
			if (!moment(query.dateFrom, moment.ISO_8601).isValid()) {
				throw new Error("Invalid parameter dateFrom.")
			}
		}
		if (query.dateTo) {
			if (!moment(query.dateTo, moment.ISO_8601).isValid()) {
				throw new Error("Invalid parameter dateTo.")
			}
		}
		if (query.dateFrom && query.dateTo) {
			params.dateRange = {
				$gte: new Date(query.dateFrom),
				$lte: new Date(query.dateTo),
			}
		} else if (query.dateFrom) {
			params.dateRange = {
				$gte: new Date(query.dateFrom),
			}
		} else if (query.dateTo) {
			params.dateRange = {
				$lte: new Date(query.dateTo),
			}
		} else {
			return {
				dateRange: null
			};
		}
		return {
			dateRange: params.dateRange,
		}
	},

	closeOrder: (body) => {
		if (!body.orderId) {
			throw new Error("Missing parameter orderId.")
		}
		if (!validator.isNumeric(String(body.orderId))) {
			throw new Error("Invalid parameter orderId.")
		}
		if (!body.notes) {
			throw new Error("Missing parameter notes.")
		}
		if (!isString(body.notes)) {
			throw new Error("Invalid parameter notes.")
		}

		return {
			orderId: Number(body.orderId),
			notes: body.notes,
		}
	},

	closeTable: (body) => {
		if (!body.tableId) {
			throw new Error("Missing parameter tableId.")
		}
		if (!validator.isMongoId(body.tableId)) {
			throw new Error("Invalid parameter tableId.")
		}

		return toObjectId(body.tableId);
	},
};

module.exports = AccountValidator;