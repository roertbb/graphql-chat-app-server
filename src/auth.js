import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';
import { models } from './models';

const saltRounds = 10;
const SECRET = process.env.SECRET;
const SECRET2 = process.env.SECRET2;

export const createTokens = async (user, expiresIn, refreshExpiresIn) => {
  const { id, nick, email } = user;
  const token = await jwt.sign({ id, nick, email }, SECRET, { expiresIn });
  const refreshToken = await jwt.sign({ id, nick, email }, SECRET2, {
    expiresIn: refreshExpiresIn
  });
  return { token, refreshToken };
};

export const generatePasswordHash = async password => {
  return await bcrypt.hash(password, saltRounds);
};

export const validatePassword = async (enteredPassword, savedPassword) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

export const authorizeWs = async token => {
  try {
    return await jwt.verify(token, SECRET);
  } catch (error) {
    throw new AuthenticationError('Your session expired. Sign in again');
  }
};

export const authorize = async (req, res) => {
  const token = req.headers['x-token'] && req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, SECRET);
    } catch (error) {
      throw new AuthenticationError('Your session expired. Sign in again');
    }
  }
};

export const refreshTokens = async (token, refreshToken) => {
  const { id } = jwt.decode(refreshToken);
  console.log(id);
  if (!id) return {};

  const user = await models.User.findByPk(id, { raw: true });
  console.log(user);
  if (!user) return {};

  const { newToken, newRefreshToken } = await createToken(
    user,
    SECRET,
    refreshSecret
  );

  console.log(newToken, newRefreshToken);
  return { token: newToken, refreshToken: newRefreshToken };
};
