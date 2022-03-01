const multer = require("multer");
const AccountController = require("../controlers/accountController");
const verifyToken = require("../../helpers/verifyToken");
const config = require("../../config/configs")

module.exports = (express) => {
	const apiRouter = express.Router();

	apiRouter.post("/authenticate", AccountController.authenticate);
	// apiRouter.post("/register", AccountController.register);

	apiRouter.use(verifyToken);

	const storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, config.imageUploadPath)
		},
		filename: function(req, file, cb) {
			cb(null, `${file.fieldname}_c${req.decoded._id}_${Date.now() % 1e8}_${file.originalname}`)
		}
	})
	const imageUpload = multer({storage: storage})

	apiRouter.post('/image-upload', imageUpload.single("up-img"), (req, res) => {
		res.status(200).send({
			url: `${req.file.destination}${req.file.filename}`,
		})
	})

	apiRouter.get("/getAccountData", AccountController.getAccountData);
	apiRouter.put("/account", AccountController.editAccount);

	apiRouter.get("/dashboardStatistics", AccountController.dashboardStatistics);

	apiRouter.get("/style", AccountController.getStyle);
	// apiRouter.put("/style", AccountController.editStyle);

	apiRouter.get("/menuItems", AccountController.getMenuItems);
	apiRouter.get("/menuItemsOfType", AccountController.getMenuItemsOfType);
	apiRouter.post("/menuItem", AccountController.addMenuItem);
	apiRouter.put("/menuItem", AccountController.editMenuItem);
	apiRouter.delete("/menuItem", AccountController.deleteMenuItem);

	apiRouter.get("/mainDishes", AccountController.getMainDishes);
	// apiRouter.post("/addMainDish", AccountController.addMainDish);
	apiRouter.post("/removeMainDish", AccountController.removeMainDish);

	apiRouter.post("/menuType", AccountController.addMenuType);
	apiRouter.put("/menuType", AccountController.editMenuType);
	apiRouter.put("/defaultMenuType", AccountController.editDefaultMenuType);
	apiRouter.delete("/menuType", AccountController.deleteMenuType);

	apiRouter.get("/tables", AccountController.getTables);
	apiRouter.post("/table", AccountController.addTable);
	apiRouter.put("/table", AccountController.editTable);
	apiRouter.delete("/table", AccountController.deleteTable);

	apiRouter.get("/tableOrder", AccountController.getTableOrder);
	apiRouter.get("/orders", AccountController.getOrders);
	apiRouter.get("/orders/paid", AccountController.getPaidOrders);
	apiRouter.get("/orders/unpaid", AccountController.getUnpaidOrders);
	apiRouter.post("/closeOrder", AccountController.closeOrder);
	apiRouter.post("/closeTable", AccountController.closeTable);

	return apiRouter;
};
