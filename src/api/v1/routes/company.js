import { Router } from 'express';
import CompanyController from '../controllers/busCompanyControllers';
import validateCompany from '../controllers/busCompanyControllers/validateCompany';
import authenticate from '../../../middleware/authenticate';
import authorize from '../../../middleware/authorize';
import { superAdmin, accountantAdmin, busCompany } from '../../../utils/roles';

const companyRouters = Router();
companyRouters.all('*', authenticate);
companyRouters
  .get('/companies', CompanyController.findAll)
  .post(
    '/companies',
    authorize(superAdmin, accountantAdmin),
    validateCompany,
    CompanyController.create
  )
  .put(
    '/companies/:id',
    authorize(superAdmin, accountantAdmin),
    validateCompany,
    CompanyController.update
  )
  .get('/companies/:id', CompanyController.find)
  .get('/companies/:id/partners', CompanyController.partners)
  .get('/partners/:id', CompanyController.getPartner)
  .put(
    '/partners/:id/approve',
    authorize(busCompany),
    CompanyController.approvePartner
  )
  .put(
    '/partners/:id/reject',
    authorize(busCompany),
    CompanyController.rejectPartner
  )
  .delete(
    '/companies/:id',
    authorize(superAdmin, accountantAdmin),
    CompanyController.destroy
  );

export default companyRouters;
