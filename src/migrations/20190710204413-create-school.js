module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schools', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
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
      latitude: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      longitude: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      sector: {
        type: Sequelize.STRING,
        allowNull: false
      },
      logo: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('Schools');
  }
};
