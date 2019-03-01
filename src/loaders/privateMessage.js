import Sequelize from 'sequelize';

export const batchPrivateMessages = async (keys, models) => {
  const messages = await models.PrivateMessage.findAll({
    where: {
      [Sequelize.Op.or]: [
        {
          senderId: {
            [Sequlize.Op.in]: keys
          }
        },
        {
          receiverId: {
            [Sequlize.Op.in]: keys
          }
        }
      ]
    }
  });

  return keys.map(key => messages.find(message => message.id === key));
};
