import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateAccidentDto {
  @ApiProperty({ example: true, description: 'Satatus' })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
