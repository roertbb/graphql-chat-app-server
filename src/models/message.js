const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    }
  });

  Message.associate = models => {
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      },
      constraints: true,
      allowNull: false
    });
    Message.belongsTo(models.Channel, {
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      },
      constraints: true,
      allowNull: false
    });
  };

  return Message;
};

export default message;
