import { generatePasswordHash } from '../auth';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    nick: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
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
    User.hasMany(models.PrivateMessage, {
      as: 'senderId',
      foreignKey: {
        name: 'senderId',
        field: 'sender_id'
      }
    });
    User.hasMany(models.PrivateMessage, {
      as: 'receiverId',
      foreignKey: {
        name: 'receiverId',
        field: 'receiver_id'
      }
    });

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
    User.belongsToMany(models.Channel, {
      through: {
        model: models.Message
      },
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  };

  // handle password hashing
  User.beforeCreate(async user => {
    user.password = await generatePasswordHash(user.password);
  });

  return User;
};

export default user;
