module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Drivers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: false
      },
      birthDay: {
        allowNull: false,
        type: Sequelize.DATE
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      drivingLicence: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      busCompanyId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: { model: 'BusCompanies', key: 'id' }
      }
    });
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('Drivers');
  }
};
