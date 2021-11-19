const Sequelize = require('sequelize');

class token extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        token: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        user: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expires: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        blacklisted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'token',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'token_pkey',
            unique: true,
            fields: [{ name: 'token' }],
          },
        ],
      }
    );
    return token;
  }
}

module.exports = token;
