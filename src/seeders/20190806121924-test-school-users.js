module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '36e46bea-3f99-44ee-a610-23e7a997a641',
          email: 'principal@school.org',
          sex: 'MALE',
          birthDay: new Date('1995-09-09'),
          password:
            '$2b$10$CzfqN8d7S0hhrsMceldTO.Cv9Zxey2Ibd3U6Nmh95NSPyva5z.jeW',
          type: 'PRINCIPAL',
          schoolId: '36e46bea-3f99-44ee-a610-23e7a997c678',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '6aa95e4a-c7cf-4281-814c-fca595c4f61c',
          email: 'teacher@school.org',
          sex: 'FEMALE',
          birthDay: new Date('2013-09-09'),
          password:
            '$2b$10$CzfqN8d7S0hhrsMceldTO.Cv9Zxey2Ibd3U6Nmh95NSPyva5z.jeW',
          type: 'TEACHER',
          schoolId: '36e46bea-3f99-44ee-a610-23e7a997c678',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
