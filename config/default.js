// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  api: {
    host: process.env.HOST ?? '127.0.0.1',
    port: process.env.PORT ?? 3000,
  },

  logging: {
    level: 'debug',
    transports: [{ type: 'console', format: 'text' }],
  },

  auth: {
    access_expires_in_minutes: 15,
    refresh_expires_in_days: 30,
    password_salt: process.env.PASSWORD_SALT,
    jwt_secret: process.env.JWT_SECRET,
  },

  seed: {
    admin_email: process.env.SEED_ADMIN_EMAIL ?? 'admin',
    admin_password: process.env.SEED_ADMIN_PASSWORD ?? 'admin',
    admin_fullname: process.env.SEED_ADMIN_FULLNAME ?? 'Admin',
  },
};
