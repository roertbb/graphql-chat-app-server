const privateMessage = (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define('privateMessage', {
    text: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    }
  });

  PrivateMessage.associate = models => {
    PrivateMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        field: 'sender_id'
      },
      constraints: true,
      allowNull: false
    });
    PrivateMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'receiverId',
        field: 'receiver_id'
      },
      constraints: true,
      allowNull: false
    });
  };

  return PrivateMessage;
};

export default privateMessage;
