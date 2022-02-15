const {GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean } = require("graphql");

const MenuItemType = new GraphQLObjectType({
	name: 'MenuItem',
	fields: () => ({
		_id: {type: GraphQLInt},
		accountId: {type: GraphQLString},
		type: {type: GraphQLString},
		name: {type: GraphQLString},
		description: {type: GraphQLString},
		img: {type: GraphQLString},
		price: {type: GraphQLFloat},
		currency: {type: GraphQLString},
		isMainDish: {type: GraphQLBoolean},
	}),
})

const MainDishTypeAndList = new GraphQLObjectType({
	name: 'MainDishTypeAndList',
	fields: () => ({
		type: {type: GraphQLString},
		menuItemsCount: {type: GraphQLInt},
		mainItems: {type: new GraphQLList(MenuItemType)},
	}),
})

module.exports = {
	MenuItemType,
	MainDishTypeAndList,
}