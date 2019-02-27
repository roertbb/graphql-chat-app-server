import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';

export const isAuthenticatedResolver = (parent, args, { me }) => {
  return me ? skip : new ForbiddenError('Not authenticated as user.');
};
