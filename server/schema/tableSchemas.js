const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } = require("graphql");
const { v4: uuidv4 } = require('uuid');
const Table = require("../db/models/table");
const Order = require("../db/models/order");
const { toObjectId } = require("../helpers/conversions");

const TableType = new GraphQLObjectType({
	name: 'Table',
	fields: () => ({
		_id: {type: GraphQLInt},
		accountId: {type: GraphQLString},
		tableId: {type: GraphQLString},
		name: {type: GraphQLString},
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
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
		},
		async resolve(parent, args){
			let { accountId, tableId } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const reserveToken = uuidv4();
			const table = await Table.findOneAndUpdate(
				{ accountId, tableId, reserved: false },
				{ reserved: true, reserveToken },
				{ new: true }
			).lean();
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
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			// const unpaidOrders = await Order.findOne({ accountId, tableId, reserveToken, isPaid: false }).lean();
			// if (unpaidOrders) {
			// 	throw new Error(`Orders No: ${unpaidOrders.map(order => order._id).join(", ")} doesn't paid at now!`);
			// }
			const table = await Table.findOneAndUpdate({ accountId, tableId, reserved: true }, { reserved: false, reserveToken: null }, { new: true });
			if (table) {
				return "Table successfully closed.";
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