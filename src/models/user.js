const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const plugins = require('./plugins');
const { roles } = require('../config/roles');

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'user_email_key',
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'user',
          validate: {
            isIn: roles,
          },
        },
        emailverified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'user',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'user_email_key',
            unique: true,
            fields: [{ name: 'email' }],
          },
          {
            name: 'user_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
        defaultScope: {
          attributes: { exclude: ['password'] },
        },
      }
    );
    return User;
  }
}

User.prototype.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// add plugin to model
plugins.paginate(User);

module.exports.init = (sequelize, DataTypes) => {
  const user = User.init(sequelize, DataTypes);
  // hooks need init fist
  user.beforeSave(async (usr) => {
    if (usr.password) {
      // eslint-disable-next-line no-param-reassign
      usr.password = await bcrypt.hash(usr.password, 8);
    }
  });
  return user;
};

module.exports = User;
