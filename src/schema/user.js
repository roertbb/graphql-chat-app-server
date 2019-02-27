import { gql } from 'apollo-server';

const userSchema = gql`
  extend type Query {
    users: [User!]!
  }

  extend type Mutation {
    login(nick: String!, password: String!): Token!
    register(nick: String!, email: String!, password: String!): Token!
  }

  type User {
    id: ID!
    nick: String!
    email: String!
    role: String
    privateMessages: [PrivateMessage!]!
  }

  type Token {
    token: String!
  }
`;

export default userSchema;
