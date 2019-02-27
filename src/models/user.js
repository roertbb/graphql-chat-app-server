const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    nick: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        nonEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        nonEmpty: true,
        isEmail: true
      }
    },
    // validate password in resolvers
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING
    }
  });

  User.associate = models => {
    User.hasMany(models.PrivateMessage, { as: 'senderId' });
    User.hasMany(models.PrivateMessage, { as: 'receiverId' });

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
    User.belongsToMany(models.Channel, {
      through: {
        model: models.PrivateMessage
      },
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  };

  return User;
};

export default user;
