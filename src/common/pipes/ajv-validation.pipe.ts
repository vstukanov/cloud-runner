import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import Ajv from 'ajv';

@Injectable()
export class AjvValidationPipe implements PipeTransform {
  private ajv: Ajv;

  private logger = new Logger(AjvValidationPipe.name);

  constructor(private schema: any) {
    this.ajv = new Ajv();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform<T>(input: T, metadata: ArgumentMetadata) {
    const isValid = this.ajv.validate(this.schema, input);
    if (!isValid) {
      const exception = new UnprocessableEntityException(this.ajv.errors);

      this.logger.log({
        message: 'validation error',
        input,
        schema: this.schema,
        errors: this.ajv.errors,
      });

      throw new UnprocessableEntityException(exception);
    }

    return input;
  }
}
