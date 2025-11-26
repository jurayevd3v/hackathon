import {
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieGetter } from '../common/decorators/cookieGetter.decorator';
import { RefreshDto } from './dto/refresh.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { username, password } = loginDto;
    return this.authService.login(username, password, res);
  }

  @ApiOperation({ summary: 'User logout' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Body('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(refreshToken, userId, res);
    return { message: 'Muvaffaqiyatli chiqildi.' };
  }

  @ApiOperation({ summary: 'Token renewal' })
  @Post('refresh')
  async refreshToken(
    @Body() refreshDto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, refreshToken } = refreshDto;
    return this.authService.refreshToken(userId, refreshToken, res);
  }

  // @ApiOperation({ summary: 'Reset password' })
  // @Post('reset-password')
  // async resetPass(@Body() resetPasswordDto: ResetPasswordDto) {
  //   return this.authService.resetPass(resetPasswordDto);
  // }
}
