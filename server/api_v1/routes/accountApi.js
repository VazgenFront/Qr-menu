const AccountController = require("../controlers/accountController");
const verifyToken = require("../../helpers/verifyToken");

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
	apiRouter.delete("/menuItem", AccountController.deleteMenuItem);

	apiRouter.post("/addMainDish", AccountController.addMainDish);
	apiRouter.post("/removeMainDish", AccountController.removeMainDish);

	apiRouter.post("/menuType", AccountController.addMenuType);
	apiRouter.put("/menuType", AccountController.editMenuType);
	apiRouter.put("/defaultMenuType", AccountController.editDefaultMenuType);
	apiRouter.delete("/menuType", AccountController.deleteMenuType);

	apiRouter.post("/table", AccountController.addTable);
	apiRouter.put("/table", AccountController.editTable);
	apiRouter.delete("/table", AccountController.deleteTable);

	apiRouter.get("/orders", AccountController.getOrders);
	apiRouter.get("/orders/paid", AccountController.getPaidOrders);
	apiRouter.get("/orders/unpaid", AccountController.getUnpaidOrders);
	apiRouter.post("/closeOrder", AccountController.closeOrder);

	return apiRouter;
};
