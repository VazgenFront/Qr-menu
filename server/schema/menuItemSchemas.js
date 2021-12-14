const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLBoolean} = require("graphql");
const MenuItem = require("../db/models/menuItem");

const MenuItemType = new GraphQLObjectType({
	name: 'MenuItem',
	fields: () => ({
		_id: {type: GraphQLID},
		type: {type: GraphQLString},
		name: {type: GraphQLString},
		description: {type: GraphQLString},
		img: {type: GraphQLString},
		price: {type: GraphQLFloat},
		currency: {type: GraphQLString},
		isMainDish: {type: GraphQLBoolean},
	}),
})

const MenuItemMutations = {
	addMenuItem: {
		type: MenuItemType,
		args: {
			menuItemJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const data = JSON.parse(args.menuItemJSONString)
			const menuItem = new MenuItem(data);
			await menuItem.save();
			return menuItem;
		}
	},
	editMenuItem: {
		type: MenuItemType,
		args: {
			id: { type: GraphQLID },
			menuItemJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const updateData = JSON.parse(args.menuItemJSONString)
			const menuItem = await MenuItem.findOneAndUpdate({_id: args.id}, updateData, {new: true});
			return menuItem;
		}
	}
}

module.exports = {
	MenuItemType,
	MenuItemMutations
}