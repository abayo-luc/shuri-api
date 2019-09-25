import '@babel/polyfill';
import request from '../../helpers/request';

const schoolId = '36e46bea-3f99-44ee-a610-23e7a997c678';
const teacherId = '6aa95e4a-c7cf-4281-814c-fca595c4f61c';
let schoolToken;
let classroomId;
describe('Classroom Controller', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/school-users/auth').send({
      email: 'principal@school.org',
      password: 'password'
    });
    schoolToken = response.body.token;
  });
  describe('Create', () => {
    test('should create new class', done => {
      return request
        .post('/api/v1/classrooms')
        .send({
          name: 'Grade 3 B',
          code: 'FFF'
        })
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(201)
        .then(res => {
          const { data, message } = res.body;
          classroomId = data.id;
          expect(message).toMatch(/Classroom created successfully/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'code', 'schoolId'])
          );
          done();
        });
    });

    test('should not create class with existing name', done => {
      return request
        .post('/api/v1/classrooms')
        .send({
          name: 'Grade 3 B',
          code: 'FFF'
        })
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ name: 'name is already taken' })
          );
          done();
        });
    });

    test('should not create class with existing code', done => {
      return request
        .post('/api/v1/classrooms')
        .send({
          name: 'Grade 6 B',
          code: 'FFF'
        })
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual(
            expect.objectContaining({ code: 'code is already taken' })
          );
          done();
        });
    });
  });

  describe('Find All', () => {
    test('should find all school classrooms', done => {
      return request
        .get(`/api/v1/schools/${schoolId}/classrooms`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(data.classrooms).toBeTruthy();
          done();
        });
    });

    test('should not find all school classrooms with invalid schoolId', () => {
      return request
        .get(`/api/v1/schools/some-non-existing-id-67/classrooms`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400);
    });
  });

  describe('Find One', () => {
    test('should return not found', () => {
      return request
        .get(`/api/v1/classrooms/${schoolId}`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(404);
    });

    test('should return not found', () => {
      return request
        .get(`/api/v1/classrooms/${schoolId}-world`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400);
    });
  });

  describe('Update', () => {
    test('should return not found', () => {
      return request
        .put(`/api/v1/classrooms/${schoolId}`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(404);
    });

    test('should return error on invalid id', () => {
      return request
        .put(`/api/v1/classrooms/${schoolId}-world`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400);
    });

    test('should update school classroom', () => {
      return request
        .put(`/api/v1/classrooms/${classroomId}`)
        .send({
          avatar: 'https://sample.png'
        })
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Classroom successfully updated/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining(['id', 'name', 'schoolId', 'avatar'])
          );
          expect(data.code).toEqual('FFF');
          expect(data.name).toEqual('Grade 3 B');
          expect(data.avatar).toEqual('https://sample.png');
        });
    });
  });

  describe('Assign & Remove Teacher', () => {
    test('should not found teacher', () => {
      return request
        .post(`/api/v1/classrooms/${teacherId}/teachers/${classroomId}`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(404)
        .then(res => {
          const { error } = res.body;
          expect(error).toEqual('Teacher not found');
        });
    });
    test('should assign teacher to classroom', () => {
      return request
        .post(`/api/v1/classrooms/${classroomId}/teachers/${teacherId}`)
        .expect(200)
        .set('Authorization', `Bearer ${schoolToken}`)
        .then(res => {
          const { message } = res.body;
          expect(message.includes('successfully added to')).toBeTruthy();
        });
    });

    test('should not assign teacher twice', () => {
      return request
        .post(`/api/v1/classrooms/${classroomId}/teachers/${teacherId}`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400)
        .then(res => {
          const {
            error: { message }
          } = res.body;
          expect(message.includes('already assigned')).toBeTruthy();
        });
    });
    test('should remove teacher from classroom', () => {
      return request
        .put(`/api/v1/classrooms/${classroomId}/teachers/remove`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(
            message.includes('Teacher successfully removed from the class')
          ).toBeTruthy();
        });
    });

    test('should not found teacher', () => {
      return request
        .put(`/api/v1/classrooms/${teacherId}/teachers/remove`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(404);
    });

    test('should not found teacher', () => {
      return request
        .put(`/api/v1/classrooms/${teacherId}-kid/teachers/remove`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400);
    });
  });

  describe('Delete', () => {
    test('should assign teacher to classroom', () => {
      return request
        .post(`/api/v1/classrooms/${classroomId}/teachers/${teacherId}`)
        .expect(200)
        .set('Authorization', `Bearer ${schoolToken}`)
        .then(res => {
          const { message } = res.body;
          expect(message.includes('successfully added to')).toBeTruthy();
        });
    });

    test('should find one classroom', () => {
      return request
        .get(`/api/v1/classrooms/${classroomId}`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          expect(message).toMatch(/Success/);
          expect(Object.keys(data)).toEqual(
            expect.arrayContaining([
              "id", "name", "code", "avatar", "schoolId", "createdAt", "updatedAt", "teacher"
            ])
          );
          expect(Object.keys(data.teacher)).toEqual(
            expect.arrayContaining(['id', 'email']),
            expect.not.arrayContaining(['password'])
          );
        });
    });

    test('should return not found', () => {
      return request
        .delete(`/api/v1/classrooms/${schoolId}`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(404);
    });

    test('should return error on invalid id', () => {
      return request
        .delete(`/api/v1/classrooms/${schoolId}-world`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400);
    });
    test('should delete school classroom', () => {
      return request
        .delete(`/api/v1/classrooms/${classroomId}`)
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(200)
        .then(res => {
          const { message } = res.body;
          expect(message).toEqual('Classroom successfully deleted');
        });
    });
  });
});
