const {GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLList } = require("graphql");
const Style = require("../db/models/style");
const MenuItem = require("../db/models/menuItem");
const { StyleType } = require("./styleSchemas");
const { MenuItemType, MainDishTypeAndList } = require("./menuItemSchemas");

const groupBy = function(xs, key) {
	return xs.reduce(function(rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

const AccountType = new GraphQLObjectType({
	name: 'Account',
	fields: () => ({
		_id: {type: GraphQLString},
		username: {type: GraphQLString},
		name: {type: GraphQLString},
		img: {type: GraphQLString},
		email: {type: GraphQLString},
		typeId: {type: GraphQLString},
		subTypeId: {type: GraphQLString},
		defaultMenuType: {type: GraphQLString},
		menuTypes: {
			type: new GraphQLList(new GraphQLObjectType({
				name: 'MenuTypeField',
				fields: () => ({
					name: {type: GraphQLString},
					img: {type: GraphQLString},
				}),
			})),
			resolve(parent) {
				return parent.menuTypes;
			}
		},
		status: {
			type: GraphQLString,
			resolve(parent) {
				if (parent.status !== "enabled") {
					throw new Error("Account not active now.");
				}
				return parent.status;
			}
		},
		style: {
			type: StyleType,
			async resolve(parent) {
				const styleId = parent.styleId;
				const style = await Style.findOne({ _id: styleId }).lean();
				return style;
			}
		},
		menuItems: {
			type: new GraphQLList(MenuItemType),
			name: "menuItems",
			async resolve(parent) {
				const accountId = parent._id;
				const menuItems = await MenuItem.find({ accountId }).lean();
				return menuItems;
			}
		},
		mainDishes: {
			type: new GraphQLList(MainDishTypeAndList),
			name: "mainDishes",
			async resolve(parent) {
				const accountId = parent._id;
				const menuItems = await MenuItem.find({ accountId, isMainDish: true }).lean();
				const grouped = groupBy(menuItems, 'type');
				return Object.entries(grouped).map((group) => ({
					type: group[0],
					menuItemsCount: group[1].length,
					mainItems: group[1]
				}))
			}
		}
	}),
})

module.exports = {
	AccountType,
}