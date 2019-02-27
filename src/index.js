import { models, sequelize } from './models';

sequelize.sync({ force: true }).then(async () => {
  // initial migration

  console.log('models created');
});
