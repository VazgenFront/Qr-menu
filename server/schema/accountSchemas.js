const {GraphQLString, GraphQLID, GraphQLObjectType, GraphQLList} = require("graphql");
const Account = require("../db/models/account");
const Style = require("../db/models/style");
const MenuItem = require("../db/models/menuItem");
const {StyleType} = require("./styleSchemas");
const {MenuItemType} = require("./menuItemSchemas");

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
				}),
			})),
			resolve(parent, args) {
				return parent.menuTypes;
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

const AccountMutations = {
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
	},
	editAccount: {
		type: AccountType,
		args: {
			id: { type: GraphQLID },
			accountJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const updateData = JSON.parse(args.accountJSONString)
			const account = await Account.findOneAndUpdate({_id: args.id}, updateData, {new: true});
			return account;
		}
	}
}

module.exports = {
	AccountType,
	AccountMutations,
}