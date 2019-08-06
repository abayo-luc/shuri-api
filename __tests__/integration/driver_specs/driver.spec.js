import '@babel/polyfill';
import request from '../../helpers/request';

const newDriver = {
  firstName: 'Luc',
  lastName: 'Aba',
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
        .post('/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers')
        .send({ ...newDriver })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(201)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Driver registered successfully/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining([
              'id',
              'busCompanyId',
              'firstName',
              'lastName',
              'username'
            ]),
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
        .post('/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers')
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
        .post('/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers')
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
    test('should authenticated user get bus company driver', () => {
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
        .get(
          `/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers/${driverId}`
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining([
              'id',
              'busCompanyId',
              'firstName',
              'lastName',
              'username'
            ]),
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should not find bus if provided wrong bus company id', () => {
      return request
        .get(
          `/api/v1/companies/f4d40af8-b73d-4715-bc7d-5513588a3560/drivers/${driverId}`
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });

    test('should error on invalid id form', () => {
      return request
        .get(
          `/api/v1/companies/f4d40af8-b73d-4715-bc7d-5513588a3560/drivers/${driverId}-kaf`
        )
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

  describe('Update Bus Company Driver', () => {
    test('should not find bus if provided wrong bus company id', () => {
      return request
        .put(
          `/api/v1/companies/f4d40af8-b73d-4715-bc7d-5513588a3560/drivers/36e46bea-3f99-88bb-a610-23e7a997a678`
        )
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
        .put(
          `/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers/${driverId}`
        )
        .send({ firstName: 'luc-a', lastName: 'abayo-b' })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(data.firstName).toMatch(/luc-a/);
          expect(data.lastName).toMatch(/abayo-b/);
          expect(Object.keys(data)).toEqual(
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should bus company update its own driver', () => {
      return request
        .put(
          `/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers/${driverId}-hadf`
        )
        .send({ firstName: 'luc-a', lastName: 'abayo-b' })
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
    test('should not find bus if provided wrong bus company id', () => {
      return request
        .delete(
          `/api/v1/companies/f4d40af8-b73d-4715-bc7d-5513588a3560/drivers/36e46bea-3f99-88bb-a610-23e7a997a678`
        )

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
        .delete(
          `/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers/${driverId}-hadf`
        )
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
        .delete(
          `/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/drivers/${driverId}`
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(message).toMatch(/Driver removed successfully/);
        });
    });
  });
});