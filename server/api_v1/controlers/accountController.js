const jwt = require('jsonwebtoken');

const Account = require("../../db/models/account");
const { getLogger } = require("../../helpers/logger")
const { secret, tokenExpirationTimeInMinutes } = require('../../config/configs')

const log = getLogger("default");

const AccountController = {
	authenticate: async (req, res) => {
		try {
			const { username, email, password } = req.body;
			const account = await Account.findOne({username, email}).lean();
			if (password != account.password) {
				throw new Error("Invalid password!");
			}
			if (["deactivated", "disabled"].includes(account.status)) {
				throw new Error("Account is now inactive. Please contact to administrator to get more information.")
			}
			const tokenBody = {
				id: account._id,
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

			res.status(200).send({
				success: true,
				body: {
					exp: tokenExpirationTimeInMinutes * 60,
					token,
				},
			});
		} catch (e) {
			console.log(e)
			res.status(403).send({
				success: true,
				body: e.message ? e.message : e,
			});
		}
	},
	create: async (req, res) => {
		try {
			const account = new Account({username: req.body.username, password: req.body.password, email: req.body.email});
			await account.save();
			return res.status(200).send(account);
		} catch (e) {
			console.log(e)
			return res.status(500).send(e);
		}
	},
	getAccount: async (req, res) => {
		try {
			const account = await Account.findOne(req.body);
			res.status(200).send(account);
		} catch (e) {
			log.error("nothinga", e);
			return res.status(500).send(e);
		}
	},
};

module.exports = AccountController;