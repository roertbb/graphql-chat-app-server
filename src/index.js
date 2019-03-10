import { models, sequelize, initialMigration } from './models';
import { ApolloServer, PubSub } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './schema';
import { authorize, authorizeWs } from './auth';
import { batchUsers } from './loaders/user';
import { batchPrivateMessages } from './loaders/privateMessage';
import DataLoader from 'dataloader';

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: async connectionParams => {
      const token = connectionParams['x-token'];
      try {
        return { me: await authorizeWs(token) };
      } catch (error) {
        throw new AuthenticationError('Your session expired. Sign in again');
      }
    }
  },
  context: async ({ req, connection }) => {
    if (connection) {
      const { me } = connection.context;

      return {
        me,
        models,
        pubsub,
        loaders: {
          user: new DataLoader(keys => batchUsers(keys, models)),
          privateMessages: new DataLoader(keys =>
            batchPrivateMessages(keys, models)
          )
        }
      };
    }

    if (req) {
      const me = await authorize(req);

      return {
        models,
        me,
        pubsub,
        loaders: {
          user: new DataLoader(keys => batchUsers(keys, models)),
          privateMessages: new DataLoader(keys =>
            batchPrivateMessages(keys, models)
          )
        }
      };
    }
  }
});

sequelize.sync({ force: true }).then(async () => {
  initialMigration(new Date());

  server.listen().then(({ url }) => {
    console.log(`Listening on ${url}`);
  });
});
