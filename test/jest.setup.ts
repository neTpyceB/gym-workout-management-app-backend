process.env.ALLOWED_REDIRECT_ORIGINS =
  'http://localhost:8081,http://wellness-app.adlerclub.tech';
process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:55432/gym_auth?schema=public';
process.env.GOOGLE_CLIENT_ID = 'google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'google-client-secret';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
process.env.JWT_SECRET = 'test-jwt-secret';
