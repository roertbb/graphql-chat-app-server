import { gql } from 'apollo-server';

const privateMessageSchema = gql`
  extend type Query {
    privateMessages: [PrivateMessage!]!
  }

  # extend type Mutation {

  # }

  type PrivateMessage {
    id: ID!
    sender: User!
    receiver: User!
    text: String!
  }
`;

export default privateMessageSchema;
