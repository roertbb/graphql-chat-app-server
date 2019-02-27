const privateMessageResolver = {
  Query: {
    privateMessages: async (parent, agrs, { models }) => {
      return await models.PrivateMessage.findAll({});
    }
  },
  PrivateMessage: {
    sender: async ({ senderId }, args, { models }) => {
      return await models.User.findByPk(senderId);
    },
    receiver: async ({ receiverId }, args, { models }) => {
      return await models.User.findByPk(receiverId);
    }
  }
};

export default privateMessageResolver;
