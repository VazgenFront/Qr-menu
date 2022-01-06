const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLBoolean } = require("graphql");
const Order = require("../db/models/order");
const MenuItem = require("../db/models/menuItem");

const OrderListItemInput = new GraphQLInputObjectType({
	name: "OrderListItemInput",
	fields: {
		menuItemId: { type: GraphQLID },
		itemCount: { type: GraphQLID },
	},
})
const OrderListItem = new GraphQLObjectType({
	name: "OrderListItem",
	fields: {
		menuItemId: { type: GraphQLID },
		itemCount: { type: GraphQLID },
	},
})

const OrderType = new GraphQLObjectType({
	name: 'Order',
	fields: () => ({
		_id: {type: GraphQLID},
		accountId: {type: GraphQLID},
		tableId: {type: GraphQLID},
		cart: {type: new GraphQLList(OrderListItem)},
		reserveToken: {type: GraphQLString},
		isPaid: {type: GraphQLBoolean},
		notes: {type: GraphQLString},
	}),
})

const OrderMutations = {
	addOrder: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLID },
			tableId: { type: GraphQLID },
			reserveToken: { type: GraphQLString },
			orderList: { type: new GraphQLList(OrderListItemInput)},
		},
		async resolve(parent, args){
			const { accountId, tableId, reserveToken, orderList } = args;
			const invalidItemsCount = orderList.filter(item => item.itemCount <= 0).length;
			if (invalidItemsCount > 0) {
				throw new Error("Invalid item count provided in order list.")
			}
			const menuItemIds = orderList.map(item => item.menuItemId);

			const foundMenuItems = await MenuItem.find({ accountId, _id: {"$in": menuItemIds }}).lean();
			if (foundMenuItems.length !== menuItemIds.length) {
				throw new Error("Not all menuItems exists.")
			}
			const order = await Order.findOne({ accountId, tableId, reserveToken });
			let newOrder;
			if (order) {
				newOrder = await Order.findOneAndUpdate({ accountId, tableId, reserveToken }, {
					$push: { cart: { $each: orderList } }
				}, { new: true, upsert: true, multi: true }).lean();
				return newOrder;
			} else {
				const orderEntity = new Order({ accountId, tableId, reserveToken, cart: orderList, notes: "Created by user after adding order." });
				newOrder = await orderEntity.save();
				return newOrder
			}
		}
	},
	editOrder: {
		type: OrderType,
		args: {
			id: { type: GraphQLID },
			orderJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const updateData = JSON.parse(args.orderJSONString)
			const order = await Order.findOneAndUpdate({_id: args.id}, updateData, {new: true});
			return order;
		}
	}
}

module.exports = {
	OrderType,
	OrderMutations
}