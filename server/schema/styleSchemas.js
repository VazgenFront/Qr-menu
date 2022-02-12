const {GraphQLObjectType, GraphQLInt, GraphQLString} = require("graphql");

const StyleType = new GraphQLObjectType({
	name: 'Style',
	fields: () => ({
		_id: {type: GraphQLInt},
		navbarBgColor: {type: GraphQLString},
		navbarTitleColor: {type: GraphQLString},
		logo: {type: GraphQLString},
		mostBookedBorder: {type: GraphQLString},
		fontFamily: {type: GraphQLString},
	}),
})

module.exports = {
	StyleType,
}