// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsEmail,
//   IsNotEmpty,
//   IsNumberString,
//   IsString,
//   MinLength,
// } from 'class-validator';

// export class ResetPasswordDto {
//   @ApiProperty({ example: 'user@example.com', description: 'User email' })
//   @IsEmail({}, { message: 'Email formati noto‘g‘ri!' })
//   email: string;

//   @ApiProperty({
//     example: 'password123',
//     description: 'Foydalanuvchi paroli (kamida 6 ta belgi)',
//   })
//   @IsString({ message: 'password matn (string) bo‘lishi kerak' })
//   @IsNotEmpty({ message: 'password kiritilishi shart' })
//   @MinLength(6, {
//     message: 'password kamida 6 ta belgidan iborat bo‘lishi kerak',
//   })
//   password: string;

//   @ApiProperty({
//     example: '456912',
//     description: "Foydalanuvchi email raqamiga jo'natilgan code",
//   })
//   @IsNumberString(
//     {},
//     { message: 'SMS kodi faqat raqamlardan iborat bo‘lishi kerak' },
//   )
//   @IsNotEmpty({ message: 'SMS kodi kiritilishi majburiy' })
//   otp: string;
// }
