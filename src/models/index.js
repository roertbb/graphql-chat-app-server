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

export const initialMigration = async date => {
  await models.User.create({
    nick: 'test',
    email: 'test@test.com',
    password: 'test123',
    role: 'ADMIN'
  });

  await models.User.create({
    nick: 'bob',
    email: 'bob@bob.com',
    password: 'awesomebob'
  });

  await models.PrivateMessage.create({
    text: 'lorem ipsum',
    senderId: 1,
    receiverId: 2
  });

  await models.PrivateMessage.create({
    text: 'second message',
    senderId: 2,
    receiverId: 1
  });
  await models.PrivateMessage.create({
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero modi quibusdam minus aspernatur perferendis accusamus sapiente repellat, deserunt ad voluptates, praesentium voluptatem blanditiis excepturi.',
    senderId: 1,
    receiverId: 2
  });
};
