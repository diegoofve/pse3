import pino from 'pino';
import path from 'path';

const LOG_DIR = path.join(__dirname, '../../logs');

export const logger = pino({
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                level: process.env.LOG_LEVEL || 'info',
                options: { colorize: true, translateTime: 'SYS: HH:MM:ss' }
            },
            {
                target: 'pino-roll',
                level: process.env.LOG_LEVEL || 'info',
                options: {
                    file: path.join(LOG_DIR, 'app.log'),
                    frequency: 'daily',
                    dateFormat: 'yyyy-MM-dd',
                    mkdir: true,
                    size: '50m'
                }
            }
        ]
    }
});