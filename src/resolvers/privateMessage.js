import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticatedResolver, isPrivateMessageOwner } from './auth';

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
    ),
    updatePrivateMessage: combineResolvers(
      isAuthenticatedResolver,
      isPrivateMessageOwner,
      async (parent, { id, text }, { models }) => {
        const [_, [message, ...__]] = await models.PrivateMessage.update(
          { text: text },
          { where: { id }, returning: true, raw: true }
        );
        return message;
      }
    ),
    deletePrivateMessage: combineResolvers(
      isAuthenticatedResolver,
      isPrivateMessageOwner,
      async (parent, { id }, { models }) => {
        const resp = await models.PrivateMessage.destroy({ where: { id } });
        console.log(resp);
        return resp;
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
