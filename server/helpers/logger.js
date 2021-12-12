const log4js = require('log4js');
const path = require('path');

log4js.addLayout('json', () => (logEvent) => {
    logEvent = {
        date: logEvent.startTime,
        level: logEvent.level.levelStr,
        msg: logEvent.data.shift(),
        data: logEvent.data.length ? logEvent.data : undefined,
    };
    return JSON.stringify(logEvent);
});
log4js.configure(path.join(__dirname, '../config/log4jsConfig.json'));

const loggerMap = new Map();

module.exports = {
    getLogger(name = 'default') {
        let log = loggerMap.get(name);
        if (!log) {
            log = log4js.getLogger(name);
            loggerMap.set(name, log);
        }
        return {
            trace: log.trace.bind(log),
            info: log.info.bind(log),
            warn: log.warn.bind(log),
            error: log.error.bind(log),
            fatal: log.fatal.bind(log),
        };
    },
};
