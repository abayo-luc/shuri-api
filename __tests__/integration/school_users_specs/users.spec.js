import '@babel/polyfill';
import request from '../../helpers/request';

let token;
let userId;
describe('School Users Controller', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/school-users/auth').send({
      email: 'principal@school.org',
      password: 'password'
    });

    ({ token } = response.body);
  });
  describe('Create New User', () => {
    test('should new user be addded successfully', () => {
      return request
        .post('/api/v1/school-users')
        .send({
          users: [
            {
              email: 'user@school.org',
              name: 'user',
              type: 'TEACHER'
            }
          ]
        })
        .set('Authorization', `Bearer ${token}`)

        .then(res => {
          const { message, data } = res.body;
          const user = data[0];
          userId = user.id;
          expect(message).toMatch(/User registered successfully/);
          expect(Object.keys(user)).toEqual(
            expect.arrayContaining(['id', 'email', 'schoolId']),
            expect.not.arrayContaining(['password'])
          );
          expect(user.type).toEqual('TEACHER');
        });
    });

    test('should new user be addded successfully', () => {
      return request
        .post('/api/v1/school-users')
        .send({
          users: [
            {
              email: 'user@school.org',
              name: 'user'
            }
          ]
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ email: 'email is already taken' })
          );
        });
    });

    test('should new user be addded successfully', () => {
      return request
        .post('/api/v1/school-users')
        .send({ users: [{ email: 'sup' }] })
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ email: 'Invalid email' })
          );
        });
    });
  });

  describe('Find School Users', () => {
    test('should retrieve all users', () => {
      return request
        .get(
          '/api/v1/schools/36e46bea-3f99-44ee-a610-23e7a997c678/school-users'
        )
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'users'])
          );
          expect(data.users).toEqual(expect.arrayContaining([]));
          expect(data.users.length >= 0).toBeTruthy();
        });
    });

    test('should return an error on invalid school id', () => {
      return request
        .get(
          '/api/v1/schools/36e46bea-3f99-44ee-a610-23e7a99ad7c678/school-users'
        )
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });

    test('should find a school users', () => {
      return request
        .get(`/api/v1/school-users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'email', 'schoolId']),
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should return not found on non existing user id', () => {
      return request
        .get(`/api/v1/school-users/36e46bea-3f99-44ee-a610-23e7a997c678`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });

    test('should return error on invalid user id', () => {
      return request
        .get(`/api/v1/school-users/${userId}-kjaf`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });
  });

  describe('Update School User', () => {
    test('should update school user', () => {
      return request
        .put(`/api/v1/school-users/${userId}`)
        .send({ name: 'Dodos' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/User update successfully/);
          expect(data.name).toMatch(/Dodos/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'schoolId', 'email']),
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should not update user with invalid id', () => {
      return request
        .put(`/api/v1/school-users/${userId}-kjafl`)
        .send({ name: 'Dodo' })
        .set('Authorization', `Bearer ${token}`)
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
        .put(`/api/v1/school-users/36e46bea-3f99-44ee-a610-23e7a997c678`)
        .send({ name: 'Dodo' })
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });
  });

  describe('Delete School User', () => {
    test('should not found user if provided wrong user id', () => {
      return request
        .delete(`/api/v1/school-users/36e46bea-3f99-44ee-a610-23e7a997c678`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({ error: 'Record not found' })
          );
        });
    });
    test('should fail on invalid user id', () => {
      return request
        .delete(`/api/v1/school-users/36e46bea-3f99-44ee-a610-23e7a997c678kajf`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(
            error.message.includes('invalid input syntax for type uuid:')
          ).toBeTruthy();
        });
    });

    test('should school principal delete school user', () => {
      return request
        .delete(`/api/v1/school-users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(message).toMatch(/User removed successfully/);
        });
    });
  });
});
