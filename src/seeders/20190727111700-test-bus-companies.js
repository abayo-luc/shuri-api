module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'BusCompanies',
      [
        {
          id: '36e46bea-3f99-44ee-a610-23e7a997a641',
          name: 'Bus Company 1',
          email: 'company_1@example.com',
          country: 'Rwanda',
          district: 'Nyarugenge',
          phoneNumber: '0759277275',
          sector: 'Kimironko',
          password:
            '$2b$10$CzfqN8d7S0hhrsMceldTO.Cv9Zxey2Ibd3U6Nmh95NSPyva5z.jeW',
          createdAt: new Date('2012-05-05'),
          updatedAt: new Date('2017-05-05')
        },
        {
          id: 'f4d40af8-b73d-4715-bc7d-5513588a3560',
          name: 'Bus Company 2',
          email: 'company_2@example.com',
          country: 'Rwanda',
          district: 'Nyarugenge',
          phoneNumber: '0759277277',
          sector: 'Kimironko',
          password:
            '$2b$10$CzfqN8d7S0hhrsMceldTO.Cv9Zxey2Ibd3U6Nmh95NSPyva5z.jeW',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('BusCompanies', null, {});
  }
};
