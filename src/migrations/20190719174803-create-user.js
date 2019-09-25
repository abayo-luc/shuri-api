module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        /**
         * TM: transport manager
         * DOD: director of discipline
         * PRINCIPAL: school admin or general manager
         */
        type: Sequelize.ENUM('TM', 'DOD', 'PRINCIPAL', 'TEACHER'),
        defaultValue: 'TM'
      },
      sex:{
        type: Sequelize.STRING,
        allowNull: true
      },
      birthDay:{
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      schoolId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: { model: 'Schools', key: 'id' }
      },
      classroomId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: 'Classrooms', key: 'id' }
      }
    });
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
