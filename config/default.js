// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  api: {
    port: 3000,
  },

  logging: {
    format: 'text',
    level: 'debug',
  },

  auth: {
    access_expires_in_minutes: 15,
    refresh_expires_in_days: 30,
    password_salt: process.env.PASSWORD_SALT,
    jwt_secret: process.env.JWT_SECRET,
  },
};
