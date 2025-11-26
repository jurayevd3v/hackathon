import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Foydalanuvchi to‘liq ismi',
  })
  @IsString({ message: 'full_name matn (string) bo‘lishi kerak' })
  @IsNotEmpty({ message: 'full_name bo‘sh bo‘lishi mumkin emas' })
  full_name: string;

  @ApiProperty({
    example: 'john',
    description: 'Foydalanuvchi username manzili',
  })
  @IsNotEmpty({ message: 'username kiritilishi shart' })
  username: string;

  @ApiProperty({
    example: 'Guiston Shahar',
    description: 'Foydalanuvchi manzili',
  })
  @IsString({ message: 'address matn (string) bo‘lishi kerak' })
  @IsNotEmpty({ message: 'address bo‘sh bo‘lishi mumkin emas' })
  address: string;

  @ApiProperty({
    example: 'password123',
    description: 'Foydalanuvchi paroli (kamida 6 ta belgi)',
  })
  @IsString({ message: 'password matn (string) bo‘lishi kerak' })
  @IsNotEmpty({ message: 'password kiritilishi shart' })
  @MinLength(6, {
    message: 'password kamida 6 ta belgidan iborat bo‘lishi kerak',
  })
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.DISPATCHER,
    description: 'Foydalanuvchi roli',
  })
  @IsEnum(UserRole, {
    message: 'Role noto‘g‘ri kiritilgan',
  })
  role: UserRole;
}
