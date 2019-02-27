import { gql } from 'apollo-server';

const privateMessageSchema = gql`
  extend type Query {
    privateMessages: [PrivateMessage!]!
  }

  extend type Mutation {
    createPrivateMessage(text: String!, receiverId: Int!): PrivateMessage!
    updatePrivateMessage(id: ID!, text: String!): PrivateMessage!
    deletePrivateMessage(id: ID!): Boolean!
  }

  type PrivateMessage {
    id: ID!
    sender: User!
    receiver: User!
    text: String!
  }
`;

export default privateMessageSchema;
