import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { ConfigsService } from '../../configs/configs.service'

const configService = new ConfigsService()
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value)

    const errors = await validate(object)

    if (configService.nodeEnv !== 'production' && errors.length > 0) {
      throw new BadRequestException(errors)
    }

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed')
    }

    return object
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]

    return !types.includes(metatype)
  }
}
