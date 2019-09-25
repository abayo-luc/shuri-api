import bcrypt from '../utils/bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      birthDay:{
        type: DataTypes.DATE,
        allowNull: true
      },
      sex:{
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        /**
         * TM: transport manager
         * DOD: director of discipline
         * PRINCIPAL: school admin or general manager
         */
        type: DataTypes.ENUM('TM', 'DOD', 'PRINCIPAL', 'TEACHER'),
        defaultValue: 'TM'
      },
      classroomId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: 'Users'
    }
  );
  User.beforeCreate((user, _options) => bcrypt(user));
  User.beforeBulkCreate((user, _options) => bcrypt(user));
  User.associate = models => {
    User.belongsTo(models.School, {
      foreignKey: 'schoolId',
      hooks: true
    });
    User.belongsTo(models.Classroom, {
      foreignKey: 'classroomId',
      as: 'classroom'
    });
  };
  return User;
};
