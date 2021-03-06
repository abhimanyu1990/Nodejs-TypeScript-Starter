import { registerDecorator, ValidationOptions, ValidationArguments, IsBoolean } from 'class-validator';

export function IsMatchedRegex(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    let strongRegex = new RegExp(property);
    registerDecorator({
      name: 'IsMatchedRegex',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && strongRegex.test(value);
        },
      },
    });
  };
}

export default IsMatchedRegex;