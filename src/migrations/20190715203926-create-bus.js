module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Buses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      plateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      seatsNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      carteJaune: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      assignedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      busCompanyId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: { model: 'BusCompanies', key: 'id' }
      },
      occupied: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      driverId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: 'Drivers', key: 'id' }
      }
    });
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('Buses');
  }
};
