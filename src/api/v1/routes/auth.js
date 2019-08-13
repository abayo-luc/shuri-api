import { Router } from 'express';
import AuthController from '../controllers/authControllers';
import validate, {
  validateCompanyLogin
} from '../controllers/authControllers/validate';
import authenticate from '../../../middleware/authenticate';

const authRouters = Router();

authRouters
  .post('/admins/auth', validate, AuthController.admin)
  .post('/companies/auth', validateCompanyLogin, AuthController.company)
  .post('/school-users/auth', validateCompanyLogin, AuthController.user)
  .get('/current', authenticate, AuthController.currentUser);

export default authRouters;
