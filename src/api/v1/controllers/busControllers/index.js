import db from '../../../../models';
import { notFound, badRequest, okResponse } from '../../../../utils/response';
import { textSearch, paginate } from '../../../../utils/queryHelpers';

const { Bus, Driver } = db;

export default class BusController {
  static async create(req, res) {
    try {
      const { id } = req.user;
      const bus = await Bus.create({
        ...req.body,
        busCompanyId: id
      });
      return okResponse(res, bus, 201, 'Bus registered successfully');
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async findAll(req, res) {
    try {
      const { companyId } = req.params;
      const { page, limit, search } = req.query;
      const { rows, count } = await Bus.findAndCountAll({
        where: {
          busCompanyId: companyId,
          ...textSearch(search, 'bus').where
        },
        ...paginate(page, limit),
        include: [
          {
            model: Driver,
            as: 'driver',
            attributes: {
              exclude: ['password', 'busCompanyId']
            }
          }
        ]
      });
      return okResponse(res, { buses: rows, totalBuses: count });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async find(req, res) {
    try {
      const { id } = req.params;
      const bus = await Bus.findOne({
        where: {
          id
        },
        attributes: {
          exclude: ['companyId', 'driverId']
        },
        include: [
          {
            model: Driver,
            as: 'driver',
            attributes: {
              exclude: ['password', 'busCompanyId']
            }
          }
        ]
      });
      if (!bus) {
        return notFound(res);
      }
      return okResponse(res, bus);
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { id: busCompanyId } = req.user;
      const bus = await Bus.findOne({
        where: {
          id,
          busCompanyId
        }
      });
      const data = await bus.update({ ...req.body });
      return okResponse(res, data, 200, 'Bus updated successfully');
    } catch (err) {
      return badRequest(res, err, 'Bus update failed');
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const { id: busCompanyId } = req.user;
      const bus = await Bus.findOne({
        where: {
          id,
          busCompanyId
        }
      });
      if (!bus) {
        return notFound(res);
      }
      await bus.destroy();
      return okResponse(res, undefined, 200, 'Bus deleted successfully');
    } catch (err) {
      return badRequest(res, err);
    }
  }
}
