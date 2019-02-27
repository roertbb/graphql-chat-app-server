import { gql } from 'apollo-server';
import userSchema from './user';
import privateMessageSchema from './privateMessage';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, privateMessageSchema];
