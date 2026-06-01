const sequelize = require('../config/database');
const Profile = require('./Profile');
const Address = require('./Address');

Profile.hasMany(Address, { foreignKey: 'profile_id', as: 'addresses' });
Address.belongsTo(Profile, { foreignKey: 'profile_id', as: 'profile' });

module.exports = {
  sequelize,
  Profile,
  Address
};
