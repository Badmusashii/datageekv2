import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Userdg } from 'src/userdg/entities/userdg.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Userdg => {
    const req = ctx.switchToHttp().getRequest();
    return req.user; // NE PAS RENOMMER
    // c'est toujours la propriété user de req que l'on retourne
  },
);
