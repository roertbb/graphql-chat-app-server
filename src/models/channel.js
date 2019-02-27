const channel = (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: { nonEmpty: true }
    },
    private: {
      type: DataTypes.BOOLEAN,
      validate: { nonEmpty: true }
    }
  });

  Channel.associate = models => {
    Channel.belongsTo(models.User, {
      foreignKey: {
        name: 'ownerId',
        field: 'owner_id'
      }
    });

    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
    Channel.belongsToMany(models.User, {
      through: {
        model: models.PrivateMessage
      },
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
  };

  return Channel;
};

export default channel;
