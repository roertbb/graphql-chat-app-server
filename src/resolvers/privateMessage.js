import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticatedResolver, isPrivateMessageOwner } from './auth';
import Sequelize from 'sequelize';
import { NEW_MESSAGE, NEW_DIRECT_MESSAGE } from '../schema/privateMessage';
import { withFilter } from 'graphql-subscriptions';

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
        order: [['created_at', 'ASC']],
        limit,
        ...cursorOptions
      });
    }
  },
  Mutation: {
    createPrivateMessage: combineResolvers(
      isAuthenticatedResolver,
      async (parent, { text, receiverId }, { me, models, pubsub }) => {
        const message = await models.PrivateMessage.create({
          text,
          senderId: me.id,
          receiverId
        });

        pubsub.publish(NEW_MESSAGE, {
          newMessage: message
        });

        pubsub.publish(NEW_DIRECT_MESSAGE, {
          newDirectMessage: message
        });

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
        return resp;
      }
    )
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (parent, args, { pubsub, onConnect }) =>
          pubsub.asyncIterator(NEW_MESSAGE),
        (payload, variables) => {
          return payload.newMessage.dataValues.senderId === variables.senderId;
        }
      )
    },
    newDirectMessage: {
      subscribe: withFilter(
        (parent, args, { pubsub, me }) =>
          pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, variables, { me }) => {
          return payload.newDirectMessage.dataValues.receiverId === me.id;
        }
      )
    }
  },
  PrivateMessage: {
    sender: async ({ senderId }, args, { loaders }) => {
      return await loaders.user.load(senderId);
    },
    receiver: async ({ receiverId }, args, { loaders }) => {
      return await loaders.user.load(receiverId);
    }
  }
};

export default privateMessageResolver;
