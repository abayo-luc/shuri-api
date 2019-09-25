import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { BCRYPT_SALT_FACTOR } = process.env;
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: DataTypes.ENUM(['accountant', 'general'])
    },
    {
      tableName: 'Admins'
    }
  );
  Admin.beforeCreate((admin, _options) => {
    return bcrypt
      .hash(admin.password, parseInt(BCRYPT_SALT_FACTOR, 10))
      .then(hash => {
        admin.setDataValue('password', hash);
      })
      .catch(err => {
        throw new Error(err);
      });
  });
  return Admin;
};
