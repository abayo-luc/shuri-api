module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define(
    'School',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      logo: DataTypes.STRING,
      description: DataTypes.STRING,
      sector: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'Schools'
    }
  );
  School.associate = models => {
    School.hasMany(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'schoolId',
      as: 'users'
    });
    School.belongsToMany(models.BusCompany, {
      foreignKey: 'schoolId',
      through: models.SchoolCompanyPartnership,
      as: 'companies'
    });
    School.hasMany(models.Classroom, {
      onDelete: 'CASCADE',
      foreignKey: 'schoolId',
      as: 'classrooms'
    });
  };
  return School;
};
