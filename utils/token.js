import jwt from 'jsonwebtoken';

export const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_JWT_SECRET, { expiresIn: '10m' });
};
export const signRefreshToken = (id) => {
  return jwt.sign(id, process.env.REFRESH_JWT_SECRET, { expiresIn: '365d' });
};
export const signActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_JWT_SECRET, {
    expiresIn: '7d'
  });
};
