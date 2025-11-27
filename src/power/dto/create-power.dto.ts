import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePowerDto {
  @ApiProperty({ example: true, description: 'Satatus' })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
