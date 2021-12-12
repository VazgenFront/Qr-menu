const {
	GraphQLScalarType,
	GraphQLInputObjectType,
	GraphQLEnumType, GraphQLID,
} = require( 'graphql');

const createInputObject = (type) => {
	return new GraphQLInputObjectType({
		name: type.name + 'Input',
		fields: Object.fromEntries(
			Object.entries( type.getFields() ).map( ([key]) => [ key, convertInputObjectField( (type.getFields())[key] ) ] )
		),
	});
}

function convertInputObjectField(field) {
	let fieldType = field.type;
	const wrappers = [];

	while (fieldType.ofType) {
		wrappers.unshift(fieldType.constructor);
		fieldType = fieldType.ofType;
	}

	if (!(fieldType instanceof GraphQLInputObjectType ||
		fieldType instanceof GraphQLScalarType ||
		fieldType instanceof GraphQLEnumType)) {
		fieldType = createInputObject(fieldType)
	}

	fieldType = wrappers.reduce((type, Wrapper) => {
		return new Wrapper(type);
	}, fieldType);

	return { type: fieldType };
}

module.exports = { createInputObject };