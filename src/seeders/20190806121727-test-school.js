module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Schools',
      [
        {
          id: '36e46bea-3f99-44ee-a610-23e7a997c678',
          name: 'School',
          country: 'Rwanda',
          district: 'Gasabo',
          phoneNumber: '07800000',
          email: 'principal@school.org',
          sector: 'Kimironko',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Schools', null, {});
  }
};
