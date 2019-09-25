import { Router } from 'express';
import SchoolController from '../controllers/schoolControllers';
import authenticate from '../../../middleware/authenticate';
import validateSchool from '../controllers/schoolControllers/schoolValidator';
import authorize from '../../../middleware/authorize';
import {
  superAdmin,
  accountantAdmin,
  schoolPrincipal
} from '../../../utils/roles';

const schoolRouters = Router();
schoolRouters.all('*', authenticate);
schoolRouters
  .post(
    '/schools',
    authorize(superAdmin, accountantAdmin),
    validateSchool,
    SchoolController.create
  )
  .get('/schools', SchoolController.findAll)
  .get('/schools/:id', SchoolController.find)
  .put(
    '/schools/:id',
    authorize(superAdmin, accountantAdmin),
    validateSchool,
    SchoolController.update
  )
  .post(
    '/partners/:companyId',
    authorize(schoolPrincipal),
    SchoolController.partnershipRequest
  )
  .delete(
    '/schools/:id',
    authorize(superAdmin, accountantAdmin),
    SchoolController.destroy
  );

export default schoolRouters;
