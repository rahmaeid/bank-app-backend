import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthJwtService } from '../jwt/jwt.service';
import { TOKEN_TYPE, access_token_payload } from '../auth/auth.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authJwtService: AuthJwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const is_public = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (is_public) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    // if (!token) return false;
    if (!token) throw new UnauthorizedException();

    const user: access_token_payload | undefined =
      await this.authJwtService.decodeToken(token, TOKEN_TYPE.ACCESS_TOKEN);

    if (!user) {
      throw new UnauthorizedException();
      // return false;
    }

    request.user = user;
    request.token = token;
    return true;
  }

  private extractToken(request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
