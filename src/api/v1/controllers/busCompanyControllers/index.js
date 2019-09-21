import { isEmpty } from 'lodash';
import db from '../../../../models';
import { badRequest, notFound, okResponse } from '../../../../utils/response';
import generatePwd from '../../../../utils/genPwd';
import { textSearch, paginate } from '../../../../utils/queryHelpers';

const { BusCompany, School, SchoolCompanyPartnership: Partners } = db;
export default class CompanyController {
  static async create(req, res) {
    try {
      const newCompany = {
        ...req.body,
        password: generatePwd() // password to be sent to the user and changed
      };
      const company = await BusCompany.create(newCompany);
      company.password = undefined;
      return okResponse(res, company, 201);
    } catch (err) {
      return badRequest(res, err, 'Company registration failed');
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const company = await BusCompany.findOne({ where: { id } });
      if (isEmpty(company)) {
        return notFound(res);
      }
      const updatedCompany = await company.update(req.body);
      updatedCompany.password = undefined;
      return okResponse(
        res,
        updatedCompany,
        200,
        'Company update successfully'
      );
    } catch (err) {
      return badRequest(res, err, 'Company update failed');
    }
  }

  static async findAll(req, res) {
    try {
      const { page, limit, search } = req.query;
      const { rows, count } = await BusCompany.findAndCountAll({
        ...textSearch(search, 'company'),
        order: [['updatedAt', 'DESC']],
        ...paginate(page, limit),
        attributes: {
          exclude: ['password']
        }
      });
      return okResponse(res, { companies: rows, totalCompanies: count });
    } catch (error) {
      return badRequest(error);
    }
  }

  static async find(req, res) {
    try {
      const { id } = req.params;
      const company = await BusCompany.findOne({
        where: { id },
        attributes: {
          exclude: ['password']
        }
      });
      if (isEmpty(company)) {
        return notFound(res);
      }
      return okResponse(res, company);
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const company = await BusCompany.findOne({ where: { id } });
      if (isEmpty(company)) {
        return notFound(res);
      }
      await company.destroy();
      return okResponse(res, undefined, 200, 'Record deleted');
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async partners(req, res) {
    try {
      const { id } = req.params;
      const data = await Partners.findAll({
        where: {
          companyId: id
        },
        include: [
          {
            model: School
          }
        ]
      });
      return res.status(200).json({ message: 'Success', data });
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async approvePartner(req, res) {
    try {
      const { schoolId } = req.params;
      const { id: companyId } = req.user;
      const record = await Partners.findOne({ where: { schoolId, companyId } });
      if (!record) {
        return notFound(res);
      }
      if (record.status === 'approved') {
        throw new Error('Request already approved');
      }
      await record.update({ status: 'approved' });
      return okResponse(res, undefined, 200, 'Partnership request approved ');
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async rejectPartner(req, res) {
    try {
      const { schoolId } = req.params;
      const { id: companyId } = req.user;
      const record = await Partners.findOne({ where: { schoolId, companyId } });
      if (!record) {
        return notFound(res);
      }
      if (record.status === 'rejected') {
        throw new Error('Request already rejected');
      }
      await record.update({ status: 'rejected' });
      return okResponse(res, undefined, 200, 'Partnership request rejected');
    } catch (error) {
      return badRequest(res, error);
    }
  }
}
