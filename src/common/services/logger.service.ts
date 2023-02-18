import { transports, format } from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import * as config from 'config';
import * as os from 'os';

function factoryFormat(service: string, type: string) {
  switch (type) {
    case 'json':
      return format.combine(format.timestamp(), format.json());
    case 'text':
      return format.combine(
        format.timestamp(),
        utilities.format.nestLike(service, {
          prettyPrint: true,
        }),
      );

    default:
      throw new Error(`Unsupported format type ${type}`);
  }
}

interface LoggerConfigTransportType {
  type: 'console';
  format: 'json' | 'text';
}

interface LoggerConfigOptions {
  level: string;
  transports: LoggerConfigTransportType[];
}

function getLoggerOptions(service: string, meta?: any) {
  const options = config.get<LoggerConfigOptions>('logging');

  const loggerTransports = options.transports.map((tc) => {
    if (tc.type === 'console') {
      return new transports.Console({
        format: factoryFormat(service, tc.format),
      });
    }

    throw new Error(`Unsupported transport type ${tc.type}`);
  });

  return {
    level: options.level,
    defaultMeta: {
      ...meta,
      hostname: os.hostname(),
      service,
    },
    transports: loggerTransports,
  };
}

export function winstonLoggerModuleFactory(service: string, meta?: any) {
  return WinstonModule.createLogger(getLoggerOptions(service, meta));
}
