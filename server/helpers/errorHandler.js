const logger = require('./logger');

const log = logger.getLogger();
const ErrorHandler = {
	errorHandler: (err) => {
		try {
			log.error(err);
			return {body: err, code: 501};
		} catch (error) {
			return {body: err, code: 500};
		}
	}
}

module.exports = ErrorHandler;