import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'Authorization header topilmadi!',
      });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Token formati noto‘g‘ri!',
      });
    }

    interface JwtPayload {
      id: string;
      role: string;
    }

    try {
      const user = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (req as any).user = user;
    } catch {
      throw new UnauthorizedException({
        message: 'Token noto‘g‘ri yoki muddati tugagan!',
      });
    }

    return true;
  }
}
