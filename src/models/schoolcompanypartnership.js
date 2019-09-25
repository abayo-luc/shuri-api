module.exports = (sequelize, DataTypes) => {
  const SchoolCompanyPartnership = sequelize.define(
    'SchoolCompanyPartnership',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(['approved', 'pending', 'rejected']),
        defaultValue: 'pending'
      }
    },
    {
      tableName: 'SchoolCompanyPartnerships'
    }
  );
  SchoolCompanyPartnership.associate = models => {
    SchoolCompanyPartnership.belongsTo(models.School, {
      foreignKey: 'schoolId',
      as: 'school'
    });
    SchoolCompanyPartnership.belongsTo(models.BusCompany, {
      foreignKey: 'companyId',
      as: 'company'
    });
  };

  return SchoolCompanyPartnership;
};
