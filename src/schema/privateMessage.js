import { gql } from 'apollo-server';

const privateMessageSchema = gql`
  extend type Query {
    privateMessages: [PrivateMessage!]!
    myPrivateMessages(
      otherUserId: Int!
      cursor: String
      limit: Int
    ): [PrivateMessage!]!
  }

  extend type Mutation {
    createPrivateMessage(text: String!, receiverId: Int!): PrivateMessage!
    updatePrivateMessage(id: ID!, text: String!): PrivateMessage!
    deletePrivateMessage(id: ID!): Boolean!
  }

  extend type Subscription {
    newMessage(senderId: Int!): PrivateMessage!
    newDirectMessage: PrivateMessage!
  }

  type PrivateMessage {
    id: ID!
    sender: User!
    receiver: User!
    text: String!
    created_at: Date!
  }
`;

export default privateMessageSchema;

export const NEW_MESSAGE = 'NEW_MESSAGE';
export const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';
