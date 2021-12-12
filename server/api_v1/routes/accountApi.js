const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} = require('graphql');
const {
	getGraphQLParameters,
	processRequest,
	renderGraphiQL,
	shouldRenderGraphiQL
} = require('graphql-helix');

module.exports = (express) => {
	const apiRouter = express.Router();

	// apiRouter.use(verifyToken);

	const schema = new GraphQLSchema({
		query: new GraphQLObjectType({
			name: 'Query',
			fields: {
				hello: {
					type: GraphQLString,
					resolve: () => 'Hello world!',
				},
			},
		}),
	});

	apiRouter.use('/graphql', async (req, res) => {
		const request = {
			body: req.body,
			headers: req.headers,
			method: req.method,
			query: req.query,
		};

		if (shouldRenderGraphiQL(request)) {
			res.send(renderGraphiQL());
		} else {
			const { operationName, query, variables } = getGraphQLParameters(request);

			const result = await processRequest({
				operationName,
				query,
				variables,
				request,
				schema,
			});

			if (result.type === 'RESPONSE') {
				result.headers.forEach(({ name, value }) => res.setHeader(name, value));
				res.status(result.status);
				res.json(result.payload);
			}
		}
	});

	return apiRouter;
};
