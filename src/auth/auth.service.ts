import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { env } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUser } from './current-user.decorator';

type GoogleProfile = {
  avatarUrl: string | null;
  email: string;
  googleId: string;
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  buildGoogleStartUrl(redirectUri: string) {
    const normalizedRedirectUri = this.assertAllowedRedirectUri(redirectUri);
    const state = this.jwtService.sign(
      {
        kind: 'google-auth-state',
        redirectUri: normalizedRedirectUri,
      },
      {
        expiresIn: '5m',
        secret: env.jwtSecret,
      },
    );

    return this.createGoogleClient().generateAuthUrl({
      access_type: 'online',
      prompt: 'select_account',
      scope: ['openid', 'email', 'profile'],
      state,
    });
  }

  async completeGoogleAuth(code: string, state: string) {
    const payload = this.jwtService.verify<{
      kind: string;
      redirectUri: string;
    }>(state, {
      secret: env.jwtSecret,
    });

    if (payload.kind !== 'google-auth-state') {
      throw new UnauthorizedException('Invalid auth state.');
    }

    const googleClient = this.createGoogleClient();
    const tokenResponse = await googleClient.getToken(code);
    const idToken = tokenResponse.tokens.id_token;

    if (!idToken) {
      throw new UnauthorizedException('Google did not return an ID token.');
    }

    const googleProfile = await this.verifyGoogleProfile(idToken);
    const trainerRole = await this.prisma.role.upsert({
      create: {
        name: 'Trainer',
      },
      update: {},
      where: {
        name: 'Trainer',
      },
    });

    const user = await this.prisma.user.upsert({
      create: {
        avatarUrl: googleProfile.avatarUrl,
        email: googleProfile.email,
        googleId: googleProfile.googleId,
        name: googleProfile.name,
        roleId: trainerRole.id,
      },
      update: {
        avatarUrl: googleProfile.avatarUrl,
        email: googleProfile.email,
        name: googleProfile.name,
        roleId: trainerRole.id,
      },
      where: {
        googleId: googleProfile.googleId,
      },
    });

    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        name: user.name,
        role: trainerRole.name,
        sub: user.id,
      },
      {
        expiresIn: '15m',
        secret: env.jwtSecret,
      },
    );

    return {
      redirectUrl: `${payload.redirectUri}#token=${encodeURIComponent(accessToken)}`,
    };
  }

  async getCurrentUser(userId: string): Promise<CurrentUser> {
    const user = await this.prisma.user.findUnique({
      include: {
        role: true,
      },
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Authenticated user not found.');
    }

    return {
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role.name as CurrentUser['role'],
    };
  }

  verifyAccessToken(token: string): CurrentUser & { sub: string } {
    const payload = this.jwtService.verify<{
      email: string;
      name: string;
      role: CurrentUser['role'];
      sub: string;
    }>(token, {
      secret: env.jwtSecret,
    });

    return {
      email: payload.email,
      id: payload.sub,
      name: payload.name,
      role: payload.role,
      sub: payload.sub,
    };
  }

  private assertAllowedRedirectUri(redirectUri: string) {
    const candidate = new URL(redirectUri);

    if (!env.allowedRedirectOrigins.includes(candidate.origin)) {
      throw new BadRequestException('Redirect origin is not allowed.');
    }

    return `${candidate.origin}${candidate.pathname}${candidate.search}`;
  }

  private createGoogleClient() {
    return new OAuth2Client(
      env.googleClientId,
      env.googleClientSecret,
      env.googleRedirectUri,
    );
  }

  private async verifyGoogleProfile(idToken: string): Promise<GoogleProfile> {
    const googleTicket = await this.createGoogleClient().verifyIdToken({
      audience: env.googleClientId,
      idToken,
    });
    const payload = googleTicket.getPayload();

    if (!payload?.email || !payload.sub || !payload.email_verified) {
      throw new UnauthorizedException('Google account payload is invalid.');
    }

    return {
      avatarUrl: payload.picture ?? null,
      email: payload.email,
      googleId: payload.sub,
      name: payload.name ?? payload.email,
    };
  }
}
