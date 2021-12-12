const Account = require("../../db/models/account");
const { getLogger } = require("../../helpers/logger")

const log = getLogger("default");

const AccountController = {
	authenticate: async (req, res) => {
		return res.status(200).send(req.body);
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