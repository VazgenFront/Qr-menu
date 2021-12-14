const jwt = require('jsonwebtoken');
const logger = require('./logger');
const { secret } = require('../config/configs');
const ErrorHandler = require('./errorHandler');

const log = logger.getLogger();

module.exports = async (req, res, next) => {
	const token = req.headers['x-access-token'] || req.body.token || req.query.token;

	if (!token) {
		log.info('No token provided');
		res.status(403).send({
			success: false,
			message: 'Missing token',
		});
	} else {
		jwt.verify(token, secret, async (err, decoded) => {
			if (err) {
				log.error(`Failed to authenticate token ${token}`);
				res.status(403).send({
					success: false,
					message: {
						key: 'Invalid token',
					},
				});
			} else {
				try {
					decoded.token = token;
					req.decoded = decoded;
					next();
				} catch (error) {
					const response = ErrorHandler.errorHandler(error);
					res.status(response.code).send(response.body);
				}
			}
		});
	}
};
