import { models, sequelize, initialMigration } from './models';
import { ApolloServer } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models
  }
});

sequelize.sync({ force: true }).then(async () => {
  // initial migration
  initialMigration(new Date());

  server.listen({ port: 3000 }).then(({ url }) => {
    console.log(`Listening on ${url}`);
  });
});
