import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  CurrentUserDecorator,
  type CurrentUser,
} from './current-user.decorator';
import { GoogleAuthQueryDto } from './dto/google-auth-query.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @Redirect()
  startGoogleAuth(@Query() query: GoogleAuthQueryDto) {
    return {
      url: this.authService.buildGoogleStartUrl(query.redirectUri),
    };
  }

  @Get('google/callback')
  @Redirect()
  async completeGoogleAuth(
    @Query('code') code?: string,
    @Query('state') state?: string,
  ) {
    if (!code || !state) {
      throw new BadRequestException('Google callback requires code and state.');
    }

    const result = await this.authService.completeGoogleAuth(code, state);
    return {
      url: result.redirectUrl,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @CurrentUserDecorator() currentUser: CurrentUser & { sub?: string },
  ) {
    if (!currentUser.id) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    return {
      user: await this.authService.getCurrentUser(currentUser.id),
    };
  }
}
