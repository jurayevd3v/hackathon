import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '../user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userRepo: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string, res: Response) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
      throw new UnauthorizedException('Username yoki parol noto‘g‘ri!');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refresh_token);
    const newUser = await this.userRepo.findOne({
      where: { username },
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return {
      newUser,
      tokens,
    };
  }

  async logout(refreshToken: string, userId: string, res: Response) {
    await this.clearRefreshToken(refreshToken, userId);
    res.clearCookie('refresh_token');
  }

  async refreshToken(userId: string, refreshToken: string, res: Response) {
    const user = await this.userRepo.findByPk(userId);
    if (
      !user ||
      !(await bcrypt.compare(refreshToken, user.hashed_refresh_token))
    ) {
      throw new ForbiddenException('Ruxsat yo‘q!');
    }
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refresh_token);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }

  async getTokens(user: User) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { id: user.id, role: user.role },
        {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
      ),
      this.jwtService.signAsync(
        { id: user.id, role: user.role },
        {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        },
      ),
    ]);
    return { access_token, refresh_token };
  }

  async updateRefreshToken(user: User, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.userRepo.update(
      { hashed_refresh_token: hashedRefreshToken },
      { where: { id: user.id } },
    );
  }

  async clearRefreshToken(refreshToken: string, userId: string) {
    const user = await this.userRepo.findByPk(userId);
    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi!');
    }

    const isTokenValid = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!isTokenValid) {
      throw new UnauthorizedException('Refresh token noto‘g‘ri!');
    }

    await this.userRepo.update(
      { hashed_refresh_token: undefined },
      { where: { id: user.id } },
    );
  }
}
