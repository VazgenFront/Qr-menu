module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, PUT, PATCH, DELETE, OPTIONS',
			'Access-Control-Allow-Credentials': false,
			'Access-Control-Max-Age': '86400', // 24 hours
			'Access-Control-Allow-Headers': 'X-Requested-With, x-access-token, X-HTTP-Method-Override, Content-Type, Accept, TimeElapsed',
		};
		res.writeHead(200, headers);
		return res.end();
	}

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD');
	res.setHeader('Access-Control-Allow-Headers', 'x-access-token, X-access-token, X-Requested-With, Origin, TimeElapsed'
		+ 'Accept, Content-Type,Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers');
	next();
};
