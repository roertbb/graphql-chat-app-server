import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticatedResolver } from './auth';

const privateMessageResolver = {
  Query: {
    privateMessages: async (parent, agrs, { models }) => {
      return await models.PrivateMessage.findAll({});
    }
  },
  Mutation: {
    createPrivateMessage: combineResolvers(
      isAuthenticatedResolver,
      async (parent, { text, receiverId }, { me, models }) => {
        const message = await models.PrivateMessage.create({
          text,
          senderId: me.id,
          receiverId
        });

        // subscription

        return message;
      }
    )
  },
  PrivateMessage: {
    sender: async ({ senderId }, args, { models }) => {
      return await models.User.findByPk(senderId);
    },
    receiver: async ({ receiverId }, args, { models }) => {
      return await models.User.findByPk(receiverId);
    }
  }
};

export default privateMessageResolver;
