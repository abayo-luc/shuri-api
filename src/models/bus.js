/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Bus = sequelize.define(
    'Bus',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false
      },
      seatsNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      carteJaune: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      assignedAt: DataTypes.DATE,
      occupied: DataTypes.BOOLEAN,
      driverId: DataTypes.UUID
    },
    {
      tableName: 'Buses'
    }
  );
  Bus.findById = async function(id, options) {
    const data = await this.findByPk(id, options);
    if (!data) {
      throw new Error('Record not found');
    }
    return data;
  };

  Bus.associate = models => {
    Bus.belongsTo(models.BusCompany, {
      foreignKey: 'busCompanyId',
      hooks: true
    });
    // Bus.belongsToMany(models.Driver, {
    //   foreignKey: 'busId',
    //   through: models.BusDriver
    //   // as: 'buses'
    // });
    Bus.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver'
    });
  };

  return Bus;
};
