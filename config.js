'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000' || 'https://macronator.netlify.com',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://chris:macronator@ds127958.mlab.com:27958/macronator',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: '7d'
};