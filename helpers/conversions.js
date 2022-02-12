const toObjectId = (id) => {
	const ObjectId = (require('mongoose').Types.ObjectId);
	return new ObjectId(id.toString());
};

module.exports = {
	toObjectId,
}