import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    define: {
      underscored: true,
      underscoredAll: true
    }
  }
);

// define models
export const models = {
  User: sequelize.import('./user.js'),
  PrivateMessage: sequelize.import('./privateMessage.js'),
  Channel: sequelize.import('./channel.js'),
  Message: sequelize.import('./message.js')
};

// create associations
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});
