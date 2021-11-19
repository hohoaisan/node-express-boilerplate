const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const { dialect, database, username, password, host } = config.sequelize;

const _token = require('./token');
const _user = require('./user');

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const token = _token.init(sequelize, DataTypes);
const user = _user.init(sequelize, DataTypes);

token.belongsTo(user, { as: 'user_user', foreignKey: 'user' });
user.hasMany(token, { as: 'tokens', foreignKey: 'user' });

module.exports = sequelize;
