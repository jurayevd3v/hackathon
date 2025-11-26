import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../common/decorators/roles-auth-decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

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

    let user: { role: string | string[] };
    try {
      user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch {
      throw new UnauthorizedException({
        message: 'Token noto‘g‘ri yoki muddati tugagan!',
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (req as any).user = user;

    const hasRole = Array.isArray(user.role)
      ? requiredRoles.some((role) => user.role.includes(role))
      : requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException({
        message: 'Sizga ruxsat yo‘q!',
      });
    }

    return true;
  }
}
