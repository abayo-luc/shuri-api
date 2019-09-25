import '@babel/polyfill';
import request from '../../helpers/request';

let companyToken;
let schoolToken;
let partnershipId;
describe('Partnership Functionalities', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/companies/auth').send({
      email: 'company_1@example.com',
      password: 'password'
    });
    companyToken = response.body.token;
    const res = await request.post('/api/v1/school-users/auth').send({
      email: 'principal@school.org',
      password: 'password'
    });
    schoolToken = res.body.token;
  });
  describe('Partnering Schools', () => {
    test('should return all partnering schools', () => {
      return request
        .get(`/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641/partners`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { message, data } = res.body;
          partnershipId = data.partners[0].id;
          expect(message).toMatch(/Success/);
          expect(data).toEqual(expect.arrayContaining([]));
          expect(Object.keys(data.partners[0])).toEqual(
            expect.arrayContaining(['id', 'schoolId', 'companyId', 'school'])
          );
        });
    });

    test('should return partnership already exist', () => {
      return request
        .post('/api/v1/partners/36e46bea-3f99-44ee-a610-23e7a997a641')
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400)
        .then(res => {
          const {
            error: { message }
          } = res.body;
          expect(message.includes('is already your partner')).toBeTruthy();
        });
    });

    test('should return not found', () => {
      return request
        .post('/api/v1/partners/36e46bea-3f99-44ee-a610-23e7a997a687')
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(404);
    });

    test('should return invalid id', () => {
      return request
        .post('/api/v1/partners/36e46bea-3f99-44ee-a610-23e7a997a687adkfj')
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(400);
    });
    test('should return all partnering schools', () => {
      return request
        .get(
          `/api/v1/companies/36e46bea-3f99-44ee-a610-23e7a997a641kjadf/partners`
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400);
    });
    test('should company approve partnership request', () => {
      return request
        .put(`/api/v1/partners/${partnershipId}/approve`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { data } = res.body;
          expect(data.status).toMatch(/approved/);
        });
    });
    test('should company reject partnership request', () => {
      return request
        .put(`/api/v1/partners/${partnershipId}/reject`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200)
        .then(res => {
          const { data } = res.body;
          expect(data.status).toMatch(/rejected/);
        });
    });

    test('should return not found on reject non existing request', () => {
      return request
        .put(`/api/v1/partners/36e46bea-3f99-44ee-a610-23e7a998c678/reject`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404);
    });
    test('should return not found on reject non existing request', () => {
      return request
        .put(`/api/v1/partners/36e46bea-3f99-44ee-a610-23e7a998c678/approve`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(404);
    });

    test('should return bad request on invalid id', () => {
      return request
        .put(
          `/api/v1/partners/36e46bea-3f99-44ee-a610-23e7a998c678lkjad/reject`
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400);
    });

    test('should return bad request on invalid id', () => {
      return request
        .put(
          `/api/v1/partners/36e46bea-3f99-44ee-a610-23e7a998c678lkjad/approve`
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(400);
    });

    test('should return send partnership request successfully', () => {
      return request
        .post('/api/v1/partners/f4d40af8-b73d-4715-bc7d-5513588a3560')
        .set('Authorization', `Bearer ${schoolToken}`)
        .expect(201)
        .then(res => {
          const { message } = res.body;
          expect(
            message.includes('Partnership request sent successfully')
          ).toBeTruthy();
        });
    });
  });
});
