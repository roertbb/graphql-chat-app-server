import { gql } from 'apollo-server';

const userSchema = gql`
  extend type Query {
    users: [User!]!
  }

  # extend type Mutation {

  # }

  type User {
    id: ID!
    nick: String!
    email: String!
    role: String
    privateMessages: [PrivateMessage!]!
  }
`;

export default userSchema;
