import '@babel/polyfill';
import request from '../../helpers/request';

let companyToken;
let busId;
describe('Bus Controller', () => {
  beforeAll(async () => {
    const {
      body: { token }
    } = await request.post('/api/v1/companies/auth').send({
      email: 'company_1@example.com',
      password: 'password'
    });
    companyToken = token;
  });

  describe('BusCompany should be able to add a new bus', () => {
    test('should add a new bus successfully', done => {
      return request
        .post('/api/v1/buses')
        .send({
          plateNumber: 'REC234X'
        })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(201)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Bus registered successfully/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining([
              'id',
              'model',
              'plateNumber',
              'busCompanyId',
              'updatedAt',
              'createdAt'
            ])
          );
          busId = data.id;
          done();
        });
    });

    test('should not add an already existing car', done => {
      return request
        .post('/api/v1/buses')
        .send({
          plateNumber: 'REC234X'
        })
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({
              plateNumber: 'plateNumber is already taken'
            })
          );
          done();
        });
    });

    test('should validate new bus', done => {
      return request
        .post('/api/v1/buses')
        .send({})
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message: 'Validation error',
              error: { plateNumber: 'Invalid plat number' }
            })
          );
          done();
        });
    });
  });

  describe('Get Buss', () => {
    test('Should return one bus', done => {
      return request
        .get(`/api/v1/buses/${busId}`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining([
              'id',
              'model',
              'plateNumber',
              'busCompanyId',
              'updatedAt',
              'createdAt'
            ])
          );
          done();
        });
    });

    test('should return error on invalid bus id', () => {
      return request
        .get(`/api/v1/buses/${busId}-jka`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(Object.keys(error)).toEqual(
            expect.arrayContaining(['message'])
          );
        });
    });

    test('should return not found error', () => {
      return request
        .get(`/api/v1/buses/36e46bea-3f99-44ee-a610-23e7a997a680`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });

    test('should get all company busess', () => {
      return request
        .get(`/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/buses`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(expect.arrayContaining(['buses']));
          expect(data.buses.length >= 1).toBeTruthy();
          expect(Object.keys(data.buses[0])).toEqual(
            expect.arrayContaining(['id', 'plateNumber', 'busCompanyId'])
          );
        });
    });
  });

  describe('Edit Buses', () => {
    it('should update bus successfully', () => {
      return request
        .put(`/api/v1/buses/${busId}`)
        .send({
          model: 'Yutongo'
        })
        .set('Authorization', `Bearer ${companyToken}`)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Bus updated successfully/);
          expect(data.model).toEqual('Yutongo');
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'plateNumber'])
          );
        });
    });

    it('should not update bus with an already existing platNumber', () => {
      return request
        .put(`/api/v1/buses/${busId}`)
        .send({
          plateNumber: '676BCD'
        })
        .set('Authorization', `Bearer ${companyToken}`)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message: 'Bus update failed',
              error: { plateNumber: 'plateNumber is already taken' }
            })
          );
        });
    });
  });

  describe('Delete Bus', () => {
    it('should only delete company buses', () => {
      return request
        .delete(`/api/v1/buses/36e46bea-3f99-88bb-a610-23e7a107a678`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404)
        .then(res => {
          const { error } = res.body;
          expect(error).toMatch(/Record not found/);
        });
    });

    it('should should delete company bus', () => {
      return request
        .delete(`/api/v1/buses/${busId}`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(message).toMatch(/Bus deleted successfully/);
        });
    });

    it('should not deleted with invalid bus id', () => {
      return request
        .delete(`/api/v1/buses/${busId}-jka`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(Object.keys(error)).toEqual(
            expect.arrayContaining(['message'])
          );
        });
    });
  });
});
