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
      throw new Error(`Unsupported logger type ${type}`);
  }
}

function getLoggerOptions(service: string, meta?: any) {
  const { format, ...restOptions } = config.get('logging');

  return {
    ...restOptions,
    defaultMeta: {
      hostname: os.hostname(),
      ...meta,
      ...restOptions?.defaultMeta,
      service,
    },
    transports: [
      new transports.Console({
        format: factoryFormat(service, format),
      }),
    ],
  };
}

export function winstonLoggerModuleFactory(service: string, meta?: any) {
  return WinstonModule.createLogger(getLoggerOptions(service, meta));
}
