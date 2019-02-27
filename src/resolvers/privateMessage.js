const privateMessageResolver = {
  Query: {
    privateMessages: async (parent, agrs, { models }) => {
      return await models.PrivateMessage.findAll({});
    }
  }
};

export default privateMessageResolver;
