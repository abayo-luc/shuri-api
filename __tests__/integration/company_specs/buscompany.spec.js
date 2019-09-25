import '@babel/polyfill';
import request from '../../helpers/request';

const company = {
  name: 'Company 3',
  email: 'company_3@example.com',
  phoneNumber: '0789277275',
  country: 'Rwanda',
  district: 'Gasabo',
  sector: 'Kimironko'
};
let adminToken;
let companyToken;
let companyId;
describe('Bus Company Controller', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/admins/auth').send({
      email: 'admin1@example.com',
      password: 'password'
    });
    adminToken = response.body.token;
  });
  describe('Create Company', () => {
    test('should create a new bus company successfully', () => {
      return request
        .post('/api/v1/companies')
        .send(company)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'email'])
          );
          companyId = data.id;
        });
    });

    test('should fail on an already existing company', done => {
      return request
        .post('/api/v1/companies')
        .send(company)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { message, error } = res.body;
          expect(message).toMatch(/Company registration failed/);
          expect(error).toEqual(
            expect.objectContaining({ name: 'name is already taken' })
          );
          done();
        });
    });
    test('should return auth error', done => {
      return request
        .post('/api/v1/companies')
        .send(company)

        .expect(401)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual('User not authorized');
          done();
        });
    });

    test('should return validation error', done => {
      return request
        .post('/api/v1/companies')
        .send({ ...company, email: undefined })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { message, error } = res.body;
          expect(message).toMatch(/Validation error/);
          expect(error).toEqual(
            expect.objectContaining({ email: 'Invalid email' })
          );
          done();
        });
    });
  });

  describe('Bus Company Authentication', () => {
    test('should authenticate bus company', done => {
      return request
        .post('/api/v1/companies/auth')
        .send({
          email: 'company_1@example.com',
          password: 'password'
        })
        .expect(200)
        .then(res => {
          const { message, token } = res.body;
          expect(message).toMatch(/Success/);
          expect(token).toBeTruthy();
          companyToken = token;
          done();
        });
    });

    test('should not authenticate company on invalid credentials', done => {
      return request
        .post('/api/v1/companies/auth')
        .send({
          email: company.email,
          password: '45678'
        })
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error.message).toEqual('Invalid email/password');
          done();
        });
    });

    test('should return validation errors', done => {
      return request
        .post('/api/v1/companies/auth')
        .send({})
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ email: 'Email is required' })
          );
          done();
        });
    });

    test('should not allow company to create another company', done => {
      return request
        .post('/api/v1/companies')
        .send(company)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(401)
        .then(res => {
          const { error, message } = res.body;
          expect(error).toEqual('Access is denied');
          expect(message).toEqual(
            'You may not have the appropriate permissions to perform this action'
          );
          done();
        });
    });

    test('should not allow company to create another company', done => {
      return request
        .post('/api/v1/companies')
        .send({ ...company, phoneNumber: '34567893456789' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual({ phoneNumber: 'Invalid phone number' });
          done();
        });
    });
  });

  describe('Get Company', () => {
    test('should find company by id', done => {
      return request
        .get('/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641')
        .set('Authorization', `Bearer ${companyToken}`)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'email']),
            expect.not.arrayContaining(['password'])
          );
          done();
        });
    });

    test('should return 404', () => {
      return request
        .get('/api/v1/companies/36e46bea-3f99-99ee-a610-23e7a997a641')
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404)
        .then(res => {
          const { error } = res.body;
          expect(error).toMatch(/Record not found/);
        });
    });

    test('should return all companies', done => {
      return request
        .get('/api/v1/companies')
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const {
            message,
            data: { companies }
          } = res.body;
          expect(message).toMatch(/Success/);
          expect(companies).toBeTruthy();
          expect(companies.length >= 1).toBeTruthy();
          done();
        });
    });
  });

  describe('Update Bus Company', () => {
    test('should update bus company', done => {
      return request
        .put(`/api/v1/companies/${companyId}`)
        .send({ email: 'company_three@example.com', name: 'Company Three' })
        .set('Authorization', `Bearer ${adminToken}`)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Company update successfully/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'email']),
            expect.not.arrayContaining(['password'])
          );
          done();
        });
    });

    test('should not update company if email already taken', done => {
      return request
        .put(`/api/v1/companies/${companyId}`)
        .send({ email: 'company_1@example.com' })
        .set('Authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message: 'Company update failed',
              error: { email: 'email is already taken' }
            })
          );
          done();
        });
    });

    test('should respond with not found', done => {
      return request
        .put(`/api/v1/companies/36e46bea-3f99-99ee-a610-23e7a997a641`)
        .send({ email: 'me@example.com' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
          done();
        });
    });
  });

  describe('Delete Bus Company', () => {
    test('should not allow other user to delete company', done => {
      return request
        .delete(`/api/v1/companies/${companyId}`)
        .set('Authorization', `Bearer ${companyToken}`)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              error: 'Access is denied',
              message:
                'You may not have the appropriate permissions to perform this action'
            })
          );
          done();
        });
    });

    test('should allow admin to delete bus company', done => {
      return request
        .delete(`/api/v1/companies/${companyId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ message: 'Record deleted' })
          );
          done();
        });
    });

    test('should respond with not found', done => {
      return request
        .delete(`/api/v1/companies/${companyId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
          done();
        });
    });

    test('should allow admin to delete bus company', done => {
      return request
        .delete(`/api/v1/companies/kajhdkfhakjhfjk`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400, done);
    });
  });
});
