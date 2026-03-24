import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export type CurrentUser = {
  email: string;
  id: string;
  name: string;
  role: 'Owner' | 'Trainer';
};

export const CurrentUserDecorator = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUser => {
    const request = context.switchToHttp().getRequest<{ user: CurrentUser }>();
    return request.user;
  },
);
