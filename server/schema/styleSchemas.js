const {GraphQLObjectType, GraphQLInt, GraphQLString} = require("graphql");
const Style = require("../db/models/style");

const StyleType = new GraphQLObjectType({
	name: 'Style',
	fields: () => ({
		_id: {type: GraphQLInt},
		navbarBgColor: {type: GraphQLString},
		navbarTitleColor: {type: GraphQLString},
		logo: {type: GraphQLString},
		mostBookedBorder: {type: GraphQLString},
		fontFamily: {type: GraphQLString},
	}),
})

const StyleMutations = {
	addStyle: {
		type: StyleType,
		args: {
			styleJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const data = JSON.parse(args.styleJSONString)
			const style = new Style(data);
			await style.save();
			return style;
		}
	},
	editStyle: {
		type: StyleType,
		args: {
			id: { type: GraphQLInt },
			styleJSONString: { type: GraphQLString },
		},
		async resolve(parent, args){
			const updateData = JSON.parse(args.styleJSONString)
			const style = await Style.findOneAndUpdate({_id: args.id}, updateData, {new: true});
			return style;
		}
	}
}

module.exports = {
	StyleType,
	StyleMutations,
}