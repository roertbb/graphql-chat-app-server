import { AuthenticationError, UserInputError } from 'apollo-server';
import { validatePassword, createTokens } from '../auth';
import { sequelize } from '../models';

const userResolver = {
  Query: {
    users: async (parent, agrs, { models }) => {
      return await models.User.findAll({});
    },
    chattedWith: async (parent, args, { models, me }) => {
      const [users, _] = await sequelize.query(
        `select distinct u.id, u.nick, u.email, u.role from users u join private_messages pm on (u.id = pm.receiver_id or u.id = pm.sender_id) where (pm.receiver_id = :userId or pm.sender_id = :userId) except select u2.id, u2.nick, u2.email, u2.role from users u2 where id = :userId`,
        {
          replacements: {
            userId: me.id
          }
        }
      );
      return users;
    }
  },
  Mutation: {
    login: async (parent, { nick, password }, { models }) => {
      const user = await models.User.find({ where: { nick } });
      if (!user)
        throw new UserInputError('No user found with such user credentials');

      const isValid = await validatePassword(password, user.password);
      if (!isValid) throw new AuthenticationError('Invalid password');

      const { token, refreshToken } = await createTokens(user, '1d', '7d');
      return { token, refreshToken };
    },
    register: async (parent, { nick, email, password }, { models }) => {
      const user = await models.User.create({ nick, email, password });

      const { token, refreshToken } = await createTokens(user, '1d', '7d');
      return { token, refreshToken };
    }
  },
  User: {
    privateMessages: async ({ id }, args, { loaders }) => {
      return await loaders.privateMessages.load(id);
    }
  }
};

export default userResolver;
