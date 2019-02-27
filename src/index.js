import { models, sequelize, initialMigration } from './models';
import { ApolloServer } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './schema';
import { authorize } from './auth';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      const me = await authorize(req);

      return {
        models,
        me
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
