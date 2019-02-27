import { models, sequelize } from './models';
import { ApolloServer } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {}
});

sequelize.sync({ force: true }).then(async () => {
  // initial migration
  server.listen().then(({ url }) => {
    console.log(`Listening on ${url}`);
  });
});
