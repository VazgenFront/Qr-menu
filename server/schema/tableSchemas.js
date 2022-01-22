const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } = require("graphql");
const { v4: uuidv4 } = require('uuid');
const Table = require("../db/models/table");
const Order = require("../db/models/order");

const TableType = new GraphQLObjectType({
	name: 'Table',
	fields: () => ({
		_id: {type: GraphQLInt},
		accountId: {type: GraphQLInt},
		tableId: {type: GraphQLInt},
		seatCount: {type: GraphQLInt},
		reserved: {type: GraphQLBoolean},
		notes: {type: GraphQLString},
	}),
})

const TableMutations = {
	reserveTable: {
		type: new GraphQLObjectType({ name: 'reserveTable', fields: ()=>({
				reserveToken: { type: GraphQLString },
			})
		}),
		args: {
			accountId: { type: GraphQLInt },
			tableId: { type: GraphQLInt },
		},
		async resolve(parent, args){
			const { accountId, tableId } = args;
			const reserveToken = uuidv4();
			const table = await Table.findOneAndUpdate({ accountId, tableId, reserved: false }, { reserved: true, reserveToken });
			if (table) {
				return { reserveToken };
			} else {
				throw new Error("Table doesn't exist or already reserved!");
			}
		}
	},
	closeTable: {
		type: GraphQLString,
		args: {
			accountId: { type: GraphQLInt },
			tableId: { type: GraphQLInt },
			reserveToken: { type: GraphQLString },
		},
		async resolve(parent, args){
			const { accountId, tableId, reserveToken } = args;
			const unpaidOrders = await Order.findOne({ accountId, tableId, reserveToken, isPaid: false }).lean();
			if (unpaidOrders) {
				throw new Error(`Orders No: ${unpaidOrders.map(order => order._id).join(", ")} doesn't paid at now!`);
			}
			const table = await Table.findOneAndUpdate({ accountId, tableId, reserved: true }, { reserved: false, reserveToken: null }, { new: true });
			if (table) {
				return `Account ${accountId} table ${tableId} successfully closed.`;
			} else {
				throw new Error("Table doesn't exist or don't reserved!");
			}
		}
	}
}

module.exports = {
	TableType,
	TableMutations
}