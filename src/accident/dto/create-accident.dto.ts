import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccidentDto {
  @ApiProperty({
    type: 'string',
    description: 'Avto halokat joyi yoki manzili',
    example: 'Guliston shahar, Toshkent ko‘chasi',
  })
  @IsString({ message: 'Manzil matn shaklida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Manzil bo‘sh bo‘lishi mumkin emas' })
  address: string;

  @ApiProperty({
    type: 'string',
    description: 'Avto halokat statusi',
    example: 'og‘ir',
  })
  @IsString({ message: 'Status matn shaklida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Status bo‘sh bo‘lishi mumkin emas' })
  status: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Qo‘shimcha izoh yoki sharh',
    example: 'Avto halokat ertalabki soatlarda sodir bo‘lgan',
  })
  @IsString({ message: 'Izoh matn shaklida bo‘lishi kerak' })
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Avto halokat rasmi (yuklanadigan fayl)',
  })
  @IsOptional()
  image: any;
}
