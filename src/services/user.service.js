const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, options) => {
  return User.findByPk(id, options);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email, options = {}) => {
  const { excludeUserId, ...rest } = options;
  const exclude = excludeUserId
    ? {
        [Op.not]: {
          id: excludeUserId,
        },
      }
    : undefined;

  return User.findOne({
    where: {
      email,
      ...exclude,
    },
    ...rest,
  });
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await getUserByEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user.toJSON();
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(options);
  return users;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found or had been deleted');
  }
  if (updateBody.email && (await getUserByEmail(updateBody.email, { excludeUserId: userId }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  user.set(updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found or had been deleted');
  }
  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
