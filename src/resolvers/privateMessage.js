import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticatedResolver, isPrivateMessageOwner } from './auth';
import Sequelize from 'sequelize';

const privateMessageResolver = {
  Query: {
    privateMessages: async (parent, args, { models }) => {
      return await models.PrivateMessage.findAll({});
    },
    myPrivateMessages: async (
      parent,
      { otherUserId, cursor, limit },
      { models, me }
    ) => {
      const cursorOptions = cursor
        ? {
            where: {
              [Sequelize.Op.or]: [
                { senderId: otherUserId, receiverId: me.id },
                { senderId: me.id, receiverId: otherUserId }
              ],
              created_at: {
                [Sequelize.Op.lt]: cursor
              }
            }
          }
        : {
            where: {
              [Sequelize.Op.or]: [
                { senderId: otherUserId, receiverId: me.id },
                { senderId: me.id, receiverId: otherUserId }
              ]
            }
          };

      return await models.PrivateMessage.findAll({
        order: [['created_at', 'DESC']],
        limit,
        ...cursorOptions
      });
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
