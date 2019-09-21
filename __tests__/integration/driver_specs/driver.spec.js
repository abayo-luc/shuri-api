import '@babel/polyfill';
import request from '../../helpers/request';

const newDriver = {
  name: 'Luc',
  username: 'driver_3',
  phoneNumber: '0789277765',
  password: 'password'
};
let companyToken;
let driverId;
describe('Driver Controller', () => {
  beforeAll(async () => {
    const {
      body: { token }
    } = await request.post('/api/v1/companies/auth').send({
      email: 'company_1@example.com',
      password: 'password'
    });
    companyToken = token;
  });

  describe('Create New Driver', () => {
    test('should company add new driver successfully', () => {
      return request
        .post('/api/v1/drivers')
        .send({ ...newDriver })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(201)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Driver registered successfully/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'busCompanyId', 'name', 'username']),
            expect.not.arrayContaining(['password'])
          );
          expect(data.busCompanyId).toEqual(
            '36e46bea-3f99-44ee-a610-23e7a997a641'
          );
          driverId = data.id;
        });
    });

    test('should validate new driver inputs', () => {
      return request
        .post('/api/v1/drivers')
        .send({ ...newDriver, username: 'lu' })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { message, error } = res.body;
          expect(message).toMatch(/Validation error/);
          expect(error).toEqual(
            expect.objectContaining({
              username: 'Username should be between 4-12 characters'
            })
          );
        });
    });

    test('should not register driver username twice', () => {
      return request
        .post('/api/v1/drivers')
        .send({ ...newDriver })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ username: 'username is already taken' })
          );
        });
    });
  });

  describe('Get Driver', () => {
    test('should authenticated user get bus company drivers', () => {
      return request
        .get('/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers')

        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'email', 'drivers']),
            expect.not.arrayContaining(['password'])
          );
          expect(data.id).toEqual('36e46bea-3f99-44ee-a610-23e7a997a641');
          expect(data.drivers.length >= 1).toBeTruthy();
          expect(data.drivers[0].busCompanyId).toEqual(
            '36e46bea-3f99-44ee-a610-23e7a997a641'
          );
          expect(Object.keys(data.drivers[0])).toEqual(
            expect.arrayContaining(['id', 'busCompanyId']),
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should find bus company driver by id', () => {
      return request
        .get(`/api/v1/drivers/${driverId}`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'busCompanyId', 'name', 'username']),
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should authenticated user get bus company drivers', () => {
      return request
        .get('/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers')

        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'email', 'drivers']),
            expect.not.arrayContaining(['password'])
          );
          expect(data.id).toEqual('36e46bea-3f99-44ee-a610-23e7a997a641');
          expect(data.drivers.length >= 1).toBeTruthy();
          expect(data.drivers[0].busCompanyId).toEqual(
            '36e46bea-3f99-44ee-a610-23e7a997a641'
          );
          expect(Object.keys(data.drivers[0])).toEqual(
            expect.arrayContaining(['id', 'busCompanyId']),
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should return invalid company id', () => {
      return request
        .get(
          `/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641kadjf/drivers`
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400);
    });

    test('should error on invalid id form', () => {
      return request
        .get(`/api/v1/drivers/${driverId}-kaf`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });
    test('should return not found on non existing id', () => {
      return request
        .get(`/api/v1/drivers/36e46bea-3f99-88bb-a610-23e7a997a6ab`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404);
    });
  });

  describe('Update Bus Company Driver', () => {
    test('should not find bus if provided wrong bus company id', () => {
      return request
        .put(`/api/v1/drivers/36e46bea-3f99-88bb-a610-23e7a997a690`)
        .send({ username: 'luc-tyaf' })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });

    test('should bus company update its own driver', () => {
      return request
        .put(`/api/v1/drivers/${driverId}`)
        .send({ name: 'luc-a' })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(data.name).toMatch(/luc-a/);
          expect(Object.keys(data)).toEqual(
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should bus company update its own driver', () => {
      return request
        .put(`/api/v1/drivers/${driverId}-hadf`)
        .send({ name: 'luc-a' })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });
  });

  describe('Delete Bus Company Driver', () => {
    test('should not find driver if provided wrong bus company id', () => {
      return request
        .delete(`/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a689`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });
    test('should fail on invalid invalid id', () => {
      return request
        .delete(`/api/v1/drivers/${driverId}-hadf`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });

    test('should company delete its own driver', () => {
      return request
        .delete(`/api/v1/drivers/${driverId}`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(message).toMatch(/Driver removed successfully/);
        });
    });
  });

  describe('Assign Bus', () => {
    test('should bus company assign bus to a driver', () => {
      return request
        .post(
          '/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a678/buses/36e46bea-3f99-44ee-a610-23e7a997c678'
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(201)
        .then(res => {
          const { message } = res.body;
          expect(message).toMatch(/Driver assigned to bus successfully/);
        });
    });

    test('should bus company assign bus to a driver', () => {
      return request
        .post(
          '/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a678/buses/36e46bea-3f99-44ee-a610-23e7a997c678'
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const {
            error: { message }
          } = res.body;
          expect(message).toMatch(/Driver already assigned to the bus!!!/);
        });
    });

    test('should bus company assign bus to a driver', () => {
      return request
        .post(
          '/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a677/buses/36e46bea-3f99-44ee-a610-23e7a997c678'
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404);
    });

    test('should bus company assign bus to a driver', () => {
      return request
        .post(
          '/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a678/buses/36e46bea-3f99-44ee-a610-23e7a997c697'
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404);
    });
  });

  describe('Remove driver from the bus', () => {
    test('should bus company assign bus to a driver', () => {
      return request
        .delete(
          '/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a678/buses/36e46bea-3f99-44ee-a610-23e7a997c678'
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(message).toMatch(/Driver removed from bus successfully/);
        });
    });

    test('should bus company assign bus to a driver', () => {
      return request
        .delete(
          '/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a678/buses/36e46bea-3f99-44ee-a610-23e7a997c678'
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404)
        .then(res => {
          const { error } = res.body;
          expect(error).toMatch(/Record not found/);
        });
    });

    test('should bus company assign bus to a driver', () => {
      return request
        .delete(
          '/api/v1/drivers/36e46bea-3f99-44ee-a610-23e7a997a6akdjf/buses/36e46bea-3f99-44ee-a610-23e7a997c678'
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400);
    });
  });
});
