module.exports = {
	port: process.env.PORT || 4000,
	dbUri: 'mongodb+srv://qruser:qrAdmin987@cluster0.32wrh.mongodb.net/qrmenu?retryWrites=true&w=majority',
	// dbUri: 'mongodb://localhost:27017/myFirstDatabase',
	dbOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true,
	},
	secret: 'v3yi39ng7aR6vb11ib9ga7',
	tokenExpirationTimeInMinutes: 480,
};