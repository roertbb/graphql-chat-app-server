import { models, sequelize, initialMigration } from './models';
import { ApolloServer, PubSub } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './schema';
import { authorize } from './auth';

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        pubsub
      };
    }

    if (req) {
      const me = await authorize(req);

      return {
        models,
        me,
        pubsub
      };
    }
  }
});

sequelize.sync({ force: true }).then(async () => {
  initialMigration(new Date());

  server.listen({ port: 3000 }).then(({ url }) => {
    console.log(`Listening on ${url}`);
  });
});
