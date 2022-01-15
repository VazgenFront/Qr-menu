const AccountController = require("../controlers/accountController");
const verifyToken = require("../../helpers/verifyToken");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../../schema/schema");

module.exports = (express) => {
	const apiRouter = express.Router();

	apiRouter.post("/authenticate", AccountController.authenticate);

	apiRouter.use(verifyToken);

	apiRouter.use('/graphql', graphqlHTTP({
		schema,
		graphiql: true
	}))

	return apiRouter;
};
