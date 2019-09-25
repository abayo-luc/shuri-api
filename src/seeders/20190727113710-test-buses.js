module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Buses',
      [
        {
          id: '36e46bea-3f99-44ee-a610-23e7a997c678',
          plateNumber: '676BCD',
          model: 'YutongoV1',
          seatsNumber: 24,
          carteJaune: '6787-787-788',
          busCompanyId: '36e46bea-3f99-44ee-a610-23e7a997a641',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '36e46bea-3f99-88bb-a610-23e7a107a678',
          plateNumber: '679CDB',
          model: 'YutongoV2',
          seatsNumber: 40,
          carteJaune: '6787-7UH-788',
          busCompanyId: 'f4d40af8-b73d-4715-bc7d-5513588a3560',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Buses', null, {});
  }
};
