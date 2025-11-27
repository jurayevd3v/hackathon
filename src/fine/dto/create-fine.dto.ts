import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateFineDto {
  @ApiProperty({ example: true, description: 'Satatus' })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
