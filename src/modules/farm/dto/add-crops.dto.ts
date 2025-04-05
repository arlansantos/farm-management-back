import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AddCropsDto{
    @ApiProperty({
      description: 'IDs dos cultivos para associar à fazenda',
      example: ['8c731c13-2985-4375-813c-7e49855fc160'],
    })
    @IsUUID(4, {each: true, message: 'ID de cultivo inválido' })
    cropIds: string[];
}