const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean } = require("graphql");

const MenuItemType = new GraphQLObjectType({
	name: 'MenuItem',
	fields: () => ({
		_id: {type: GraphQLInt},
		type: {type: GraphQLString},
		name: {type: GraphQLString},
		description: {type: GraphQLString},
		img: {type: GraphQLString},
		price: {type: GraphQLFloat},
		currency: {type: GraphQLString},
		isMainDish: {type: GraphQLBoolean},
	}),
})

module.exports = {
	MenuItemType,
}