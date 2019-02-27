import { gql } from 'apollo-server';

const linkSchema = gql`
  type Query {
    _: String!
    hello: String!
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema];
