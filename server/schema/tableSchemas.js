const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");
const Table = require("../db/models/table");

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
	}
}

module.exports = {
	TableType,
	TableMutations
}