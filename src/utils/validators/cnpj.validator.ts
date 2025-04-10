import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidCNPJ', async: false })
export class IsValidCNPJConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string, args: ValidationArguments): boolean {
    if (typeof cnpj !== 'string') return false;
    
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    // Verifica tamanho e dígitos repetidos
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    // Valida primeiro dígito verificador
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    // Valida segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
    return resultado === parseInt(digitos.charAt(1));
  }

  defaultMessage(): string {
    return 'CNPJ inválido. Forneça um CNPJ válido com 14 dígitos';
  }
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCNPJConstraint,
    });
  };
}