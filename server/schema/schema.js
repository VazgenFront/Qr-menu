const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLFloat, GraphQLInputObjectType, GraphQLBoolean} = require("graphql");
const Account = require("../db/models/account");
const Style = require("../db/models/style");
const MenuItem = require("../db/models/menuItem");
const Order = require("../db/models/order");
const {AccountType, AccountMutations} = require("./accountSchemas");
const {StyleType, StyleMutations} = require("./styleSchemas");
const {MenuItemType, MenuItemMutations} = require("./menuItemSchemas");
const {OrderType, OrderMutations} = require("./orderSchemas");

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		account: {
			type: AccountType,
			args: { username: { type: GraphQLString } },
			resolve(parent, args) {
				const username = args.username;
				const account = Account.findOne({username}, {stylesId: 0}).lean();
				return account;
			}
		},
		style: {
			type: StyleType,
			args: { _id: { type: GraphQLID } },
			async resolve(parent, args) {
				const _id = args._id;
				const style = await Style.findOne({_id}).lean();
				return style
			}
		},
		menuItem: {
			type: MenuItemType,
			args: { _id: { type: GraphQLID } },
			async resolve(parent, args) {
				const _id = args._id;
				const menuItem = await MenuItem.findOne({_id}).lean();
				return menuItem;
			}
		},
		order: {
			type: OrderType,
			args: { _id: { type: GraphQLID } },
			async resolve(parent, args) {
				const _id = args._id;
				const order = await Order.findOne({_id}).lean();
				return order;
			}
		},
	}
})

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		...AccountMutations,
		...StyleMutations,
		...MenuItemMutations,
		...OrderMutations,
	}),
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
})