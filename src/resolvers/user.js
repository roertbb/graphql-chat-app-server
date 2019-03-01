import Sequelize from 'sequelize';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { validatePassword, createToken } from '../auth';
import { sequelize } from '../models';

const userResolver = {
  Query: {
    users: async (parent, agrs, { models }) => {
      return await models.User.findAll({});
    },
    chattedWith: async (parent, args, { models, me }) => {
      const [users, _] = await sequelize.query(
        'select u.id, u.nick, u.email, u.role from users u join private_messages pm on (u.id = pm.receiver_id or u.id = pm.sender_id) where (pm.receiver_id = :userId or pm.sender_id = :userId)',
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

      return { token: createToken(user, '30m') };
    },
    register: async (parent, { nick, email, password }, { models }) => {
      const user = await models.User.create({ nick, email, password });

      return { token: createToken(user, '30m') };
    }
  },
  User: {
    privateMessages: async ({ id }, args, { models }) => {
      return await models.PrivateMessage.findAll({
        where: {
          [Sequelize.Op.or]: [{ senderId: id }, { receiverId: id }]
        }
      });
    }
  }
};

export default userResolver;
