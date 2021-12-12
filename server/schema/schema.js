const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLFloat, GraphQLInputObjectType, GraphQLBoolean} = require("graphql");
const Account = require("../db/models/account");
const Style = require("../db/models/style");
const MenuItem = require("../db/models/menuItem");
const {createInputObject} = require("./helpers");

const StyleType = new GraphQLObjectType({
	name: 'Style',
	fields: () => ({
		_id: {type: GraphQLID},
		navbarBgColor: {type: GraphQLString},
		navbarTitleColor: {type: GraphQLString},
		logo: {type: GraphQLString},
		mostBookedBorder: {type: GraphQLString},
		fontFamily: {type: GraphQLString},
	}),
})

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

const AccountType = new GraphQLObjectType({
	name: 'Account',
	fields: () => ({
		_id: {type: GraphQLID},
		username: {type: GraphQLString},
		password: {type: GraphQLString},
		name: {type: GraphQLString},
		img: {type: GraphQLString},
		email: {type: GraphQLString},
		typeId: {type: GraphQLString},
		subTypeId: {type: GraphQLString},
		status: {type: GraphQLString},
		menuTypes: {
			type: new GraphQLList(new GraphQLObjectType({
				name: 'MenuTypeField',
				fields: () => ({
					name: {type: GraphQLString},
					url: {type: GraphQLString},
				}),
			})),
			resolve(parent, args) {
				return parent.menuTypes;
			}
		},
		style: {
			type: StyleType,
			async resolve(parent, args) {
				const styleId = parent.styleId;
				const style = await Style.findOne({_id: styleId}).lean();
				return style;
			}
		},
		menuItems: {
			type: new GraphQLList(MenuItemType),
			name: "menuItems",
			async resolve(parent, args) {
				const menuItemsIds = parent.menuItems;
				const menuItems = await MenuItem.find({_id: menuItemsIds}).lean();
				return menuItems;
			}
		},
	}),
})

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
	}
})

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		addAccount: {
			type: AccountType,
			args: {
				accountJSONString: { type: GraphQLString },
			},
			async resolve(parent, args){
				const data = JSON.parse(args.accountJSONString)
				const account = new Account(data);
				await account.save();
				return account;
			}
		}
	}),
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
})