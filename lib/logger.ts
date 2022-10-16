import pino from 'pino';
import config from '../config';

// https://github.com/pinojs/pino/blob/master/docs/api.md#pinooptions-destination--logger
const logger = pino(config.log);

export default logger;
