const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");
const { v4: uuidv4 } = require('uuid');
const Table = require("../db/models/table");
const Order = require("../db/models/order");

const TableType = new GraphQLObjectType({
	name: 'Table',
	fields: () => ({
		_id: {type: GraphQLID},
		accountId: {type: GraphQLID},
		tableId: {type: GraphQLID},
		seatCount: {type: GraphQLInt},
		reserved: {type: GraphQLBoolean},
		notes: {type: GraphQLString},
	}),
})

const TableMutations = {
	addTable: {
		type: TableType,
		args: {
			tableJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const data = JSON.parse(args.tableJSONString)
			const table = new Table(data);
			await table.save();
			return table;
		}
	},
	editTable: {
		type: TableType,
		args: {
			id: { type: GraphQLID },
			tableJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const updateData = JSON.parse(args.tableJSONString)
			const table = await Table.findOneAndUpdate({_id: args.id}, updateData, {new: true});
			return table;
		}
	},
	reserveTable: {
		type: new GraphQLObjectType({ name: 'reserveTable', fields: ()=>({
				reserveToken: { type: GraphQLString },
			})
		}),
		args: {
			accountId: { type: GraphQLID },
			tableId: { type: GraphQLID },
		},
		async resolve(parent, args){
			const { accountId, tableId } = args;
			const reserveToken = uuidv4();
			const table = await Table.findOneAndUpdate({ accountId, tableId, reserved: false, reserveToken: null }, { reserved: true, reserveToken }, {new: true});
			if (table) {
				const order = new Order({accountId, tableId, reserveToken, notes: "Table reserved", cart: []})
				await order.save();
				return { reserveToken };
			} else {
				throw new Error("Table doesn't exist or already reserved!");
			}
		}
	},
	closeTable: {
		type: GraphQLString,
		args: {
			accountId: { type: GraphQLID },
			tableId: { type: GraphQLID },
			reserveToken: { type: GraphQLString },
		},
		async resolve(parent, args){
			const { accountId, tableId, reserveToken } = args;
			const unpaidOrders = await Order.find({ accountId, tableId, reserveToken, isPaid: false }).lean();
			if (unpaidOrders.length) {
				throw new Error(`Orders No: ${unpaidOrders.map(order => order._id).join(", ")} doesn't paid at now!`);
			}
			const table = await Table.findOneAndUpdate({ accountId, tableId, reserved: true }, { reserved: false, reserveToken: null }, {new: true});
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