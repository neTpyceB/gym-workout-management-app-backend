function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function readPort() {
  const value = process.env.PORT ?? '3000';
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer.');
  }

  return port;
}

function readAllowedRedirectOrigins() {
  const value = requireEnv('ALLOWED_REDIRECT_ORIGINS');
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error(
      'ALLOWED_REDIRECT_ORIGINS must contain at least one origin.',
    );
  }

  return origins;
}

export const env = {
  allowedRedirectOrigins: readAllowedRedirectOrigins(),
  databaseUrl: requireEnv('DATABASE_URL'),
  googleClientId: requireEnv('GOOGLE_CLIENT_ID'),
  googleClientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
  googleRedirectUri: requireEnv('GOOGLE_REDIRECT_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  port: readPort(),
} as const;
