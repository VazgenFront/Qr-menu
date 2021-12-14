const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt} = require("graphql");
const Order = require("../db/models/order");

const OrderType = new GraphQLObjectType({
	name: 'Order',
	fields: () => ({
		_id: {type: GraphQLID},
		accountId: {type: GraphQLID},
		tableId: {type: GraphQLID},
		menuItemId: {type: GraphQLID},
		itemCount: {type: GraphQLInt},
		notes: {type: GraphQLString},
	}),
})

const OrderMutations = {
	addOrder: {
		type: OrderType,
		args: {
			orderJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const data = JSON.parse(args.orderJSONString)
			const order = new Order(data);
			await order.save();
			return order;
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