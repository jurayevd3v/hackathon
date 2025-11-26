import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({
    description: 'Unique kalit (bo‘lim identifikatori)',
    example: 'hero_section',
  })
  @IsString({ message: 'Key matn bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Key bo‘sh bo‘lishi mumkin emas' })
  key: string;

  @ApiPropertyOptional({
    description: 'Bo‘limning sarlavhasi',
    example: 'New Cafe by Starbucks',
  })
  @IsString({ message: 'Title matn bo‘lishi kerak' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Qo‘shimcha matn yoki izoh (bo‘limning mazmuni)',
    example: 'Our new Starbucks cafe offers fast service and quality drinks.',
  })
  @IsString({ message: 'Note matn bo‘lishi kerak' })
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Birinchi rasm (yuklanadigan fayl)',
  })
  @IsOptional()
  imageOne: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ikkinchi rasm (yuklanadigan fayl)',
  })
  @IsOptional()
  imageTwo: any;
}
