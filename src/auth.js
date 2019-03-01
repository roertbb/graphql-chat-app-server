import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const SECRET = process.env.SECRET;

export const createToken = async (user, expiresIn) => {
  const { id, nick, email } = user;
  return await jwt.sign({ id, nick, email }, SECRET, { expiresIn });
};

export const generatePasswordHash = async password => {
  return await bcrypt.hash(password, saltRounds);
};

export const validatePassword = async (enteredPassword, savedPassword) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

export const authorize = async req => {
  const token =
    req.headers['x-token'] && req.headers['x-token'].replace('Bearer ', '');
  if (token) {
    try {
      return await jwt.verify(token, SECRET);
    } catch (error) {
      throw new AuthenticationError('Your session expired. Sign in again');
    }
  }
};
