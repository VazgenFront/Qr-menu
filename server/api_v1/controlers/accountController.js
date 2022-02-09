const jwt = require('jsonwebtoken');
const { secret, tokenExpirationTimeInMinutes } = require('../../config/configs')

const Account = require("../../db/models/account");
const MenuItem = require("../../db/models/menuItem");
const Order = require("../../db/models/order");
const Style = require("../../db/models/style");
const Table = require("../../db/models/table");

const { getLogger } = require("../../helpers/logger")
const { toObjectId } = require("../../helpers/conversions");
const mongoose = require("mongoose");

const log = getLogger("default");

const AccountController = {
	authenticate: async (req, res) => {
		try {
			const { username, password } = req.body;
			const account = await Account.findOne({ username }).lean();
			if (!account || password !== account.password) {
				throw new Error("Username or password is incorrect.")
			}
			if (["deactivated", "disabled"].includes(account.status)) {
				throw new Error("Account is now inactive. Please contact to administrator to get more information.")
			}
			const body = generateToken(account);

			res.status(200).send({
				success: true,
				body,
			});
		} catch (e) {
			console.log("authenticate error", e);
			log.error("authenticate error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	register: async (req, res) => {
		try {
			const { username, password, name, email } = req.body;
			const accountEntity = new Account({
				username,
				password,
				name,
				email,
			});
			const account = await accountEntity.save();
			return res.status(200).send({
				success: true,
				_id: account._id,
				username,
				name,
				email,
			});
		} catch (e) {
			console.log("register error", e);
			log.error("register error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getAccountData: async (req, res) => {
		try {
			const _id = toObjectId(req.decoded._id);
			const account = await Account.findOne({ _id }).lean();
			res.status(200).send({
				success: true,
				...account,
				password: undefined,
			});
		} catch (e) {
			console.log("getAccountData error", e);
			log.error("getAccountData error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	editAccount: async (req, res) => {
		try {
			const { name, img, typeId, subTypeId } = req.body;
			const _id = toObjectId(req.decoded._id);
			const updateQuery = {};
			if (typeof name === "string") updateQuery.name = name;
			if (typeof img === "string") updateQuery.img = img;
			if (typeof typeId === "string") updateQuery.typeId = typeId;
			if (typeof subTypeId === "string") updateQuery.subTypeId = subTypeId;
			const account = await Account.findOneAndUpdate({ _id }, { $set: updateQuery }, { new: true }).lean();
			res.status(200).send({
				success: true,
				...account,
				password: undefined,
			});
		} catch (e) {
			console.log("editAccount error", e);
			log.error("editAccount error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getStyle: async (req, res) => {
		try {
			const _id = toObjectId(req.decoded._id);
			const account = await Account.findOne({ _id }).lean();
			if (!account.styleId) {
				throw new Error("Account don't have style configured. Use default style indeed.")
			} else {
				const style = await Style.findOne({ _id: account.styleId }).lean();
				res.status(200).send({
					success: true,
					style,
				});
			}
		} catch (e) {
			console.log("getStyle error", e);
			log.error("getStyle error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	editStyle: async (req, res) => {
		try {
			const { navbarBgColor, navbarTitleColor, logo, mostBookedBorder, fontFamily } = req.body;
			const _id = toObjectId(req.decoded._id);
			const account = await Account.findOne({ _id }).lean();
			if (!account.styleId) {
				const styleEntity = new Style({
					navbarBgColor, navbarTitleColor, logo, mostBookedBorder, fontFamily
				})
				const style = await styleEntity.save();
				await Account.findOneAndUpdate({ _id }, { $set: { styleId: style._id } });
				res.status(200).send({
					success: true,
					style,
				});
			} else {
				const style = await Style.findOneAndUpdate(
					{ _id: account.styleId },
					{ $set: {navbarBgColor, navbarTitleColor, logo, mostBookedBorder, fontFamily } },
					{ new: true },
				).lean();
				res.status(200).send({
					success: true,
					style,
				});
			}
		} catch (e) {
			console.log("editStyle error", e);
			log.error("editStyle error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	addMenuItem: async (req, res) => {
		try {
			const { type, name, description, img, price, currency, isMainDish } = req.body;
			const _id = toObjectId(req.decoded._id);
			const menuItemEntity = new MenuItem({
				accountId: _id, type, name, description, img, price, currency, isMainDish,
			})
			const menuItem = await menuItemEntity.save();
			res.status(200).send({
				success: true,
				menuItem,
			});
		} catch (e) {
			console.log("addMenuItem error", e);
			log.error("addMenuItem error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getMenuItems: async (req, res) => {
		try {
			const _id = toObjectId(req.decoded._id);
			const menuItems = await MenuItem.find({ accountId: _id });
			res.status(200).send({
				success: true,
				menuItems,
			});
		} catch (e) {
			console.log("getMenuItems error", e);
			log.error("getMenuItems error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getMenuItemsOfType: async (req, res) => {
		try {
			const { type } = req.query;
			const _id = toObjectId(req.decoded._id);
			const menuItems = await MenuItem.find({ accountId: _id, type });
			res.status(200).send({
				success: true,
				menuItems,
			});
		} catch (e) {
			console.log("getMenuItemsOfType error", e);
			log.error("getMenuItemsOfType error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	editMenuItem: async (req, res) => {
		try {
			const { id, type, name, description, img, price, currency, isMainDish } = req.body;
			const _id = toObjectId(req.decoded._id);
			const menuItem =  await MenuItem.findOneAndUpdate(
				{_id: id, accountId: _id},
				{ $set: { type, name, description, img, price, currency, isMainDish } },
				{ new: true },
			).lean();
			res.status(200).send({
				success: true,
				menuItem,
			});
		} catch (e) {
			console.log("editMenuItem error", e);
			log.error("editMenuItem error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	deleteMenuItem: async (req, res) => {
		try {
			const { menuItemId } = req.body;
			const _id = toObjectId(req.decoded._id);
			const unpaidOrders = await Order.find({ accountId: _id, isPaid: false, "cart.menuItemId": menuItemId }).lean();
			if (unpaidOrders.length) {
				throw new Error("Please close all unpaid orders with specified menu item before delete.");
			}
			await MenuItem.deleteOne({ _id: menuItemId, accountId: _id });
			res.status(200).send({
				success: true,
			});
		} catch (e) {
			console.log("deleteMenuItem error", e);
			log.error("deleteMenuItem error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	addMainDish: async (req, res) => {
		try {
			const { menuItemId } = req.body;
			const _id = toObjectId(req.decoded._id);
			const menuItem = await MenuItem.findOneAndUpdate(
				{ _id: menuItemId, accountId: _id },
				{ $set: { isMainDish: true } },
				{ new: true }
			);
			if (!menuItem) {
				throw new Error("Menu item not found.");
			}
			res.status(200).send({
				success: true,
			});
		} catch (e) {
			console.log("addMainDish error", e);
			log.error("addMainDish error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	getMainDishes: async (req, res) => {
		try {
			const _id = toObjectId(req.decoded._id);
			const mainDishes = await MenuItem.find({ accountId: _id, isMainDish: true }).lean();
			res.status(200).send({
				success: true,
				mainDishes,
			});
		} catch (e) {
			console.log("getMainDishes error", e);
			log.error("getMainDishes error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	removeMainDish: async (req, res) => {
		try {
			const { menuItemId } = req.body;
			const _id = toObjectId(req.decoded._id);
			await MenuItem.updateOne({ _id: menuItemId, accountId: _id }, { $set: { isMainDish: false } });
			res.status(200).send({
				success: true,
			});
		} catch (e) {
			console.log("removeMainDish error", e);
			log.error("removeMainDish error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	addMenuType: async (req, res) => {
		try {
			const { typeName, img } = req.body;
			const _id = toObjectId(req.decoded._id);
			const account = await Account.findOneAndUpdate(
				{ _id },
				{ $addToSet: { menuTypes: { name: typeName, img } } },
				{ new: true },
			).lean();
			res.status(200).send({
				success: true,
				account,
			});
		} catch (e) {
			console.log("addMenuType error", e);
			log.error("addMenuType error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	editMenuType: async (req, res) => {
		try {
			const { oldName, newName, img } = req.body;
			const _id = toObjectId(req.decoded._id);
			const account = await Account.findOneAndUpdate(
				{ _id, menuTypes: { $elemMatch: { name: oldName } } },
				{ $set: { "menuTypes.$.name": newName, "menuTypes.$.img": img } },
				{ upsert: false, new: true },
			).lean();
			await MenuItem.updateMany({ accountId: _id, type: oldName }, { $set: { type: newName } });
			res.status(200).send({
				success: true,
				account,
			});
		} catch (e) {
			console.log("editMenuType error", e);
			log.error("editMenuType error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	editDefaultMenuType: async (req, res) => {
		try {
			const { newName } = req.body;
			const _id = toObjectId(req.decoded._id);
			const account = await Account.findOneAndUpdate(
				{ _id },
				{ $set: { defaultMenuType: newName } },
				{ upsert: false, new: true },
			).lean();
			res.status(200).send({
				success: true,
				account,
			});
		} catch (e) {
			console.log("editDefaultMenuType error", e);
			log.error("editDefaultMenuType error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	deleteMenuType: async (req, res) => {
		try {
			const { typeName } = req.body;
			const _id = toObjectId(req.decoded._id);
			console.log({_id, typeName})
			const account = await Account.findOneAndUpdate(
				{ _id },
				{ $pull: { menuTypes: { name: typeName } } },
				{ upsert: false, new: true },
			).lean();
			// await MenuItem.updateMany({ accountId: _id, type: typeName }, { $set: { type: account.defaultMenuType } });
			res.status(200).send({
				success: true,
				account,
			});
		} catch (e) {
			console.log("deleteMenuType error", e);
			log.error("deleteMenuType error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getTables: async (req, res) => {
		try {
			const _id = toObjectId(req.decoded._id);
			const accountTables = await Table.find({ accountId: _id }).lean();

			res.status(200).send({
				success: true,
				accountTables,
			});
		} catch (e) {
			console.log("addTable error", e);
			log.error("addTable error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	addTable: async (req, res) => {
		try {
			let { seatCount, name, notes } = req.body;
			const _id = toObjectId(req.decoded._id);
			const tableEntity = new Table({
				accountId: _id,
				tableId: new mongoose.Types.ObjectId(),
				name,
				seatCount,
				notes,
			})
			const table = await tableEntity.save();
			res.status(200).send({
				success: true,
				table,
			});
		} catch (e) {
			console.log("addTable error", e);
			log.error("addTable error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	editTable: async (req, res) => {
		try {
			const { tableId, seatCount, name, notes } = req.body;
			const _id = toObjectId(req.decoded._id);
			const table = await Table.findOneAndUpdate(
				{ accountId: _id, _id: tableId },
				{ $set: { seatCount, notes, name } },
				{ new: true }).lean();
			res.status(200).send({
				success: true,
				table,
			});
		} catch (e) {
			console.log("editTable error", e);
			log.error("editTable error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	deleteTable: async (req, res) => {
		try {
			const { tableId } = req.body;
			const _id = toObjectId(req.decoded._id);
			const unpaidOrders = await Order.find({ accountId: _id, isPaid: false, tableId }).lean();
			if (unpaidOrders.length) {
				throw new Error("Please close all unpaid orders with specified tableId before delete.");
			}
			await Table.deleteOne({ accountId: _id, tableId });
			res.status(200).send({
				success: true,
			});
		} catch (e) {
			console.log("deleteTable error", e);
			log.error("deleteTable error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getOrders: async (req, res) => {
		try {
			const { dateFrom, dateTo } = req.query;
			const _id = toObjectId(req.decoded._id);
			const dateRange = {
				$gte: new Date(dateFrom),
				$lte: new Date(dateTo),
			};
			const orders = await Order.find({
				accountId: _id,
				dateCreated: dateRange,
			}).lean();
			res.status(200).send({
				success: true,
				orders,
			});
		} catch (e) {
			console.log("getOrders error", e);
			log.error("getOrders error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getPaidOrders: async (req, res) => {
		try {
			const { dateFrom, dateTo } = req.query;
			const _id = toObjectId(req.decoded._id);
			const orders = await Order.find({
				accountId: _id,
				isPaid: true,
				dateCreated: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
			}).lean();
			res.status(200).send({
				success: true,
				orders,
			});
		} catch (e) {
			console.log("getPaidOrders error", e);
			log.error("getPaidOrders error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	getUnpaidOrders: async (req, res) => {
		try {
			const _id = toObjectId(req.decoded._id);
			const orders = await Order.find({
				accountId: _id,
				isPaid: false,
			}).lean();
			res.status(200).send({
				success: true,
				orders,
			});
		} catch (e) {
			console.log("getUnpaidOrders error", e);
			log.error("getUnpaidOrders error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},

	closeOrder: async (req, res) => {
		try {
			const { orderId, notes } = req.body;
			const _id = toObjectId(req.decoded._id);
			const order = await Order.findOneAndUpdate(
				{
					_id: orderId,
					accountId: _id,
				},
				{ $set: { isPaid: true, notes } },
				{ new: true },
			).lean();
			res.status(200).send({
				success: true,
				order
			});
		} catch (e) {
			console.log("closeOrder error", e);
			log.error("closeOrder error", e);
			res.status(500).send({
				success: false,
				body: e.message ? e.message : e,
			});
		}
	},
};

const generateToken = (account) => {
	const tokenBody = {
		_id: account._id,
		username: account.username,
		name: account.name,
		email: account.email,
		typeId: account.typeId,
		subTypeId: account.subTypeId,
	};
	const token = jwt.sign(
		tokenBody,
		secret, {
			expiresIn: `${tokenExpirationTimeInMinutes}m`,
		},
	);

	return {
		exp: tokenExpirationTimeInMinutes * 60,
		token,
		account: {
			...account,
			password: undefined,
		}
	}
};

module.exports = AccountController;