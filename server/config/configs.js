module.exports = {
	port: process.env.PORT || 4000,
	dbUri: 'mongodb+srv://secondAdmin:2ndAdmin@cluster0.32wrh.mongodb.net/qrmenu?retryWrites=true&w=majority',
	// dbUri: 'mongodb://localhost:27017/qrmenu',
	dbOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true,
	},
	secret: 'v3yi39ng7aR6vb11ib9ga7',
	tokenExpirationTimeInMinutes: 480,
	orderEditDuration: 5 * 60 * 1000,
};