import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  const prisma = {
    role: {
      upsert: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };
  const jwtService = new JwtService();
  const service = new AuthService(jwtService, prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds the Google auth URL for an allowed redirect', () => {
    jest.spyOn(service as never, 'createGoogleClient').mockReturnValue({
      generateAuthUrl: jest
        .fn()
        .mockReturnValue('https://accounts.google.com/o/oauth2/v2/auth'),
    });

    expect(service.buildGoogleStartUrl('http://localhost:8081')).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );
  });

  it('completes Google auth, upserts the trainer, and returns the frontend redirect', async () => {
    jest.spyOn(service as never, 'createGoogleClient').mockReturnValue({
      getToken: jest.fn().mockResolvedValue({
        tokens: {
          id_token: 'google-id-token',
        },
      }),
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: () => ({
          email: 'trainer@adlerclub.tech',
          email_verified: true,
          name: 'Trainer',
          picture: 'https://example.com/avatar.png',
          sub: 'google-user-1',
        }),
      }),
    });

    prisma.role.upsert.mockResolvedValue({
      id: 'role-1',
      name: 'Trainer',
    });
    prisma.user.upsert.mockResolvedValue({
      email: 'trainer@adlerclub.tech',
      id: 'user-1',
      name: 'Trainer',
    });

    const state = jwtService.sign(
      {
        kind: 'google-auth-state',
        redirectUri: 'http://localhost:8081',
      },
      {
        expiresIn: '5m',
        secret: process.env.JWT_SECRET,
      },
    );

    const result = await service.completeGoogleAuth('auth-code', state);

    expect(result.redirectUrl).toContain('http://localhost:8081#token=');
    expect(prisma.role.upsert).toHaveBeenCalledWith({
      create: {
        name: 'Trainer',
      },
      update: {},
      where: {
        name: 'Trainer',
      },
    });
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      create: {
        avatarUrl: 'https://example.com/avatar.png',
        email: 'trainer@adlerclub.tech',
        googleId: 'google-user-1',
        name: 'Trainer',
        roleId: 'role-1',
      },
      update: {
        avatarUrl: 'https://example.com/avatar.png',
        email: 'trainer@adlerclub.tech',
        name: 'Trainer',
        roleId: 'role-1',
      },
      where: {
        googleId: 'google-user-1',
      },
    });
  });

  it('loads the current user from the database', async () => {
    prisma.user.findUnique.mockResolvedValue({
      email: 'trainer@adlerclub.tech',
      id: 'user-1',
      name: 'Trainer',
      role: {
        name: 'Trainer',
      },
    });

    await expect(service.getCurrentUser('user-1')).resolves.toEqual({
      email: 'trainer@adlerclub.tech',
      id: 'user-1',
      name: 'Trainer',
      role: 'Trainer',
    });
  });
});
