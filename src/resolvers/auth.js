import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';

export const isAuthenticatedResolver = (parent, args, { me }) => {
  return me ? skip : new ForbiddenError('Not authenticated as user.');
};

export const isPrivateMessageOwner = async (parent, { id }, { models, me }) => {
  const message = await models.PrivateMessage.findByPk(id);

  if (message.senderId !== me.id)
    throw new ForbiddenError('Not authenticated as owner');

  return skip;
};
