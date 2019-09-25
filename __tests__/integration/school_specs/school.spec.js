import '@babel/polyfill';
import request from '../../helpers/request';

let adminToken;
let schoolId;
const newSchool = {
  name: 'School 1',
  email: 'principal@kepler.org',
  phoneNumber: '0789277275',
  password: 'password',
  sector: 'Kimironko',
  district: 'Gasabo',
  country: 'Rwanda',
  latitude: '-1.9496959999999999',
  longitude: '30.101504'
};
describe('School Controller', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/admins/auth').send({
      email: 'admin1@example.com',
      password: 'password'
    });
    const { token } = response.body;
    adminToken = token;
  });
  describe('New School', () => {
    it('should admin add new school', () => {
      return request
        .post('/api/v1/schools')
        .send(newSchool)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201)
        .then(res => {
          const { message, data } = res.body;
          schoolId = data.id;
          expect(message).toMatch(/School registered successfully/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining([
              'id',
              'name',
              'country',
              'district',
              'phoneNumber',
              'users',
              'updatedAt',
              'createdAt'
            ])
          );
          expect(Object.keys(data.users[0])).toEqual(
            expect.arrayContaining(['id', 'schoolId', 'email']),
            expect.not.arrayContaining(['password'])
          );
          expect(data.users[0].schoolId).toEqual(schoolId);
          expect(data.users[0].type).toEqual('PRINCIPAL');
        });
    });

    it('should respond email already taken', () => {
      return request
        .post('/api/v1/schools')
        .send(newSchool)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({
              message: 'Principal email already taken'
            })
          );
        });
    });

    it('should respond school name already taken', () => {
      return request
        .post('/api/v1/schools')
        .send({
          ...newSchool,
          email: 'principal_he@gmail.com',
          password: 'password'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ name: 'name is already taken' })
          );
        });
    });

    it('should respond with principal validation error', () => {
      return request
        .post('/api/v1/schools')
        .send({
          ...newSchool,
          email: 'ooo'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ email: 'Invalid principal email' })
          );
        });
    });

    it('should respond with principal validation error', () => {
      return request
        .post('/api/v1/schools')
        .send({
          ...newSchool,
          name: undefined,
          principal: {}
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ name: 'Name is required' })
          );
        });
    });
  });

  describe('Get School', () => {
    test('should retrieve all schools', () => {
      return request
        .get('/api/v1/schools')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(data).toEqual(expect.arrayContaining([]));
        });
    });

    test('should find school by id', () => {
      return request
        .get(`/api/v1/schools/${schoolId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name'])
          );
        });
    });

    test('should find school by id', () => {
      return request
        .get(`/api/v1/schools/${schoolId}-kjafl`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });

    test('should find school by id', () => {
      return request
        .get(`/api/v1/schools/f4d40af8-b73d-4715-bc7d-5513588a3560`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });
  });

  describe('Update School', () => {
    test('should update school', () => {
      return request
        .put(`/api/v1/schools/${schoolId}`)
        .send({ name: 'Kepler HQ' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/School update successfully/);
          expect(data.name).toMatch(/Kepler HQ/);
        });
    });
    test('should update school', () => {
      return request
        .put(`/api/v1/schools/${schoolId}`)
        .send({ latitude: '-1.9496959999999999', longitude: 'lkajdf' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual({
            longitude: 'Invalid longitude value'
          });
        });
    });
    test('should not update school with invalid id', () => {
      return request
        .put(`/api/v1/schools/${schoolId}-kjafl`)
        .send({ name: 'Kepler HQ' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });

    test('should respond with 404 error', () => {
      return request
        .put(`/api/v1/schools/f4d40af8-b73d-4715-bc7d-5513588a3560`)
        .send({ name: 'Kepler hq' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });
  });

  describe('Delete School', () => {
    test('should not find bus if provided wrong bus company id', () => {
      return request
        .delete(`/api/v1/schools/f4d40af8-b73d-4715-bc7d-5513588a3560`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });
    test('should fail on invalid invalid id', () => {
      return request
        .delete(`/api/v1/schools/36e46bea-3f99-44ee-a610-23e7a99`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });

    test('should admin delete school', () => {
      return request
        .delete(`/api/v1/schools/${schoolId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(message).toMatch(/School removed successfully/);
        });
    });
  });
});
