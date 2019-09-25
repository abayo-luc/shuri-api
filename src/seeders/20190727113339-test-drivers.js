module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Drivers',
      [
        {
          id: '36e46bea-3f99-44ee-a610-23e7a997a678',
          name: 'Driver One',
          phoneNumber: '0789277765',
          sex: 'Male',
          birthDay: '2014-08-07',
          country: 'Rwanda',
          drivingLicence: '345-5678-678',
          password:
            '$2b$10$CzfqN8d7S0hhrsMceldTO.Cv9Zxey2Ibd3U6Nmh95NSPyva5z.jeW',
          busCompanyId: '36e46bea-3f99-44ee-a610-23e7a997a641',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '36e46bea-3f99-88bb-a610-23e7a997a678',
          name: 'Driver Two',
          sex: 'Male',
          birthDay: '1995-09-07',
          phoneNumber: '0789277576',
          country: 'Rwanda',
          drivingLicence: '345-5678-678',
          password:
            '$2b$10$CzfqN8d7S0hhrsMceldTO.Cv9Zxey2Ibd3U6Nmh95NSPyva5z.jeW',
          busCompanyId: 'f4d40af8-b73d-4715-bc7d-5513588a3560',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Drivers', null, {});
  }
};
