const AccountController = require("../controlers/accountController");
const verifyToken = require("../../helpers/verifyToken");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../../schema/schema");

module.exports = (express) => {
	const apiRouter = express.Router();

	apiRouter.post("/authenticate", AccountController.authenticate);
	apiRouter.post("/register", AccountController.register);

	apiRouter.use(verifyToken);

	apiRouter.get("/getAccountData", AccountController.getAccountData);
	apiRouter.put("/account", AccountController.editAccount);
	apiRouter.put("/style", AccountController.editStyle);

	apiRouter.post("/menuItem", AccountController.addMenuItem);
	apiRouter.put("/menuItem", AccountController.editMenuItem);

	apiRouter.post("/menuType", AccountController.addMenuType);
	apiRouter.put("/menuType", AccountController.editMenuType);

	apiRouter.post("/table", AccountController.addTable);
	apiRouter.put("/table", AccountController.editTable);

	apiRouter.get("/orders", AccountController.getOrders);
	apiRouter.get("/orders/paid", AccountController.getPaidOrders);
	apiRouter.get("/orders/unpaid", AccountController.getUnpaidOrders);
	apiRouter.post("/closeOrder", AccountController.closeOrder);

	return apiRouter;
};
