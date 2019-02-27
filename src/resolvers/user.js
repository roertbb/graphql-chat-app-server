import Sequelize from 'sequelize';

const userResolver = {
  Query: {
    users: async (parent, agrs, { models }) => {
      return await models.User.findAll({});
    }
  },
  User: {
    privateMessages: async ({ id }, args, { models }) => {
      return await models.PrivateMessage.findAll({
        where: {
          [Sequelize.Op.or]: [{ senderId: id }, { receiverId: id }]
        }
      });
    }
  }
};

export default userResolver;
