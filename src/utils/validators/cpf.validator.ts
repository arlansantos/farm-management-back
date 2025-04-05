import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidCPF', async: false })
export class IsValidCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments): boolean {
    if (typeof cpf !== 'string') return false;
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');
    
    // Verifica tamanho e dígitos repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    try {
      // Valida primeiro dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let remainder = sum % 11;
      const firstDigit = remainder < 2 ? 0 : 11 - remainder;
      
      if (firstDigit !== parseInt(cpf.charAt(9))) return false;

      // Valida segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      remainder = sum % 11;
      const secondDigit = remainder < 2 ? 0 : 11 - remainder;
      
      return secondDigit === parseInt(cpf.charAt(10));
    } catch (error) {
      return false;
    }
  }

  defaultMessage(): string {
    return 'CPF inválido. Forneça um CPF válido com 11 dígitos';
  }
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCPFConstraint,
    });
  };
}