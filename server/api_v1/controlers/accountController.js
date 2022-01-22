const jwt = require('jsonwebtoken');
const { secret, tokenExpirationTimeInMinutes } = require('../../config/configs')

const Account = require("../../db/models/account");
const MenuItem = require("../../db/models/menuItem");
const Order = require("../../db/models/order");
const Style = require("../../db/models/style");
const Table = require("../../db/models/table");

const { getLogger } = require("../../helpers/logger")

const log = getLogger("default");

const AccountController = {
	authenticate: async (req, res) => {
		try {
			const { username, password } = req.body;
			const account = await Account.findOne({ username }).lean();
			if (password !== account.password) {
				throw new Error("Invalid password!");
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
				success: true,
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
				_id: account._id,
				username,
				name,
				email,
			});
		} catch (e) {
			console.log("register error", e);
			log.error("register error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});		}
	},

	getAccountData: async (req, res) => {
		try {
			const { _id } = req.decoded;
			const account = await Account.findOne({ _id }).lean();
			res.status(200).send({
				...account,
				password: undefined,
			});
		} catch (e) {
			console.log("getAccountData error", e);
			log.error("getAccountData error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	editAccount: async (req, res) => {
		try {
			const { name, img, typeId, subTypeId } = req.body;
			const { _id } = req.decoded;
			const updateQuery = {};
			if (typeof name === "string") updateQuery.name = name;
			if (typeof img === "string") updateQuery.img = img;
			if (typeof typeId === "string") updateQuery.typeId = typeId;
			if (typeof subTypeId === "string") updateQuery.subTypeId = subTypeId;
			const account = await Account.findOneAndUpdate({ _id }, { $set: updateQuery }, { new: true }).lean();
			res.status(200).send({
				...account,
				password: undefined,
			});
		} catch (e) {
			console.log("editAccount error", e);
			log.error("editAccount error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	editStyle: async (req, res) => {
		try {
			const { navbarBgColor, navbarTitleColor, logo, mostBookedBorder, fontFamily } = req.body;
			const { _id } = req.decoded;
			const account = await Account.findOne({ _id }).lean();
			if (!account.styleId) {
				const styleEntity = new Style({
					navbarBgColor, navbarTitleColor, logo, mostBookedBorder, fontFamily
				})
				const style = await styleEntity.save();
				await Account.findOneAndUpdate({ _id }, { $set: { styleId: style._id } });
				res.status(200).send({
					style,
				});
			} else {
				const style = await Style.findOneAndUpdate(
					{ _id: account.styleId },
					{ $set: {navbarBgColor, navbarTitleColor, logo, mostBookedBorder, fontFamily } },
					{ new: true },
				).lean();
				res.status(200).send({
					style,
				});
			}
		} catch (e) {
			console.log("editStyle error", e);
			log.error("editStyle error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});		}
	},

	addMenuItem: async (req, res) => {
		try {
			const { type, name, description, img, price, currency, isMainDish } = req.body;
			const { _id } = req.decoded;
			const menuItemEntity = new MenuItem({
				accountId: _id, type, name, description, img, price, currency, isMainDish,
			})
			const menuItem = await menuItemEntity.save();
			res.status(200).send({
				menuItem
			});
		} catch (e) {
			console.log("addMenuItem error", e);
			log.error("addMenuItem error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});		}
	},

	editMenuItem: async (req, res) => {
		try {
			const { id, type, name, description, img, price, currency, isMainDish } = req.body;
			const { _id } = req.decoded;
			const menuItem =  await MenuItem.findOneAndUpdate(
				{_id: id, accountId: _id},
				{ $set: { type, name, description, img, price, currency, isMainDish } },
				{ new: true },
			).lean();
			res.status(200).send({
				menuItem
			});
		} catch (e) {
			console.log("editMenuItem error", e);
			log.error("editMenuItem error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});		}
	},

	addMenuType: async (req, res) => {
		try {
			const { typeName } = req.body;
			const { _id } = req.decoded;
			const account = await Account.findOneAndUpdate(
				{ _id },
				{ $addToSet: { menuTypes: typeName } },
				{ new: true },
			).lean();
			res.status(200).send({
				account
			});
		} catch (e) {
			console.log("addMenuType error", e);
			log.error("addMenuType error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});		}
	},

	editMenuType: async (req, res) => {
		try {
			const { oldName, newName } = req.body;
			const { _id } = req.decoded;
			const account = await Account.findOneAndUpdate(
				{ _id, menuTypes: { $elemMatch: { name: oldName } } },
				{ $set: { "menuTypes.$.name": newName } },
				{ new: true },
			).lean();
			await MenuItem.updateMany({ accountId: _id, type: oldName }, { $set: { type: newName } });
			res.status(200).send({
				account
			});
		} catch (e) {
			console.log("addMenuType error", e);
			log.error("addMenuType error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});		}
	},

	addTable: async (req, res) => {
		try {
			const { seatCount, notes } = req.body;
			const { _id } = req.decoded;
			const accountTables = await Table.find({ accountId: _id }).lean();
			const newTableId = accountTables.reduce((maxId, table) => Math.max(maxId, table.tableId), 0) + 1;
			const tableEntity = new Table({
				accountId: _id,
				tableId: newTableId,
				seatCount,
				notes,
			})
			const table = await tableEntity.save();
			res.status(200).send({
				table
			});
		} catch (e) {
			console.log("addTable error", e);
			log.error("addTable error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	editTable: async (req, res) => {
		try {
			const { tableId, seatCount, notes } = req.body;
			const { _id } = req.decoded;
			const table = await Table.findOneAndUpdate(
				{ accountId: _id, tableId },
				{ $set: { seatCount, notes } },
				{ new: true }).lean();
			res.status(200).send({
				table
			});
		} catch (e) {
			console.log("editTable error", e);
			log.error("editTable error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	getOrders: async (req, res) => {
		try {
			const { dateFrom, dateTo } = req.query;
			const { _id } = req.decoded;
			const orders = await Order.find({
				accountId: _id,
				dateCreated: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
			}).lean();
			res.status(200).send({
				orders
			});
		} catch (e) {
			console.log("getOrders error", e);
			log.error("getOrders error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	getPaidOrders: async (req, res) => {
		try {
			const { dateFrom, dateTo } = req.query;
			const { _id } = req.decoded;
			const orders = await Order.find({
				accountId: _id,
				isPaid: true,
				dateCreated: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
			}).lean();
			res.status(200).send({
				orders
			});
		} catch (e) {
			console.log("getPaidOrders error", e);
			log.error("getPaidOrders error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	getUnpaidOrders: async (req, res) => {
		try {
			const { _id } = req.decoded;
			const orders = await Order.find({
				accountId: _id,
				isPaid: false,
			}).lean();
			res.status(200).send({
				orders
			});
		} catch (e) {
			console.log("getUnpaidOrders error", e);
			log.error("getUnpaidOrders error", e);
			res.status(500).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},

	closeOrder: async (req, res) => {
		try {
			const { orderId, notes } = req.body;
			const { _id } = req.decoded;
			const order = await Order.findOneAndUpdate(
				{
					_id: orderId,
					accountId: _id,
				},
				{ $set: { isPaid: true, notes } },
				{ new: true },
			).lean();
			res.status(200).send({
				order
			});
		} catch (e) {
			console.log("closeOrder error", e);
			log.error("closeOrder error", e);
			res.status(500).send({
				success: true,
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
	}
};

module.exports = AccountController;