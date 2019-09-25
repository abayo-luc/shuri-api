module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BusCompanies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      district: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sector: {
        type: Sequelize.STRING,
        allowNull: false
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: ''
      },
      description: {
        type: Sequelize.STRING(250)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('BusCompanies');
  }
};
