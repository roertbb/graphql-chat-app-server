import userResolver from './user';
import privateMessageResolver from './privateMessage';
import { GraphQLDateTime } from 'graphql-iso-date';

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [customScalarResolver, userResolver, privateMessageResolver];
