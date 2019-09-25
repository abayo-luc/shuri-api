import Sequelize from 'sequelize';
import db from '../../../../models';
import { badRequest, notFound, okResponse } from '../../../../utils/response';
import generatePwd from '../../../../utils/genPwd';
import { paginate, textSearch } from '../../../../utils/queryHelpers';

const { Driver, Bus } = db;

export default class DriverController {
  static async create(req, res) {
    try {
      const { id: companyId } = req.user;
      const newDriver = {
        ...req.body,
        busCompanyId: companyId,
        password: generatePwd()
      };

      const driver = await Driver.create(newDriver);
      driver.password = undefined;
      return okResponse(res, driver, 201, 'Driver registered successfully');
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async findAll(req, res) {
    try {
      const { companyId } = req.params;
      const { page, limit, search } = req.query;
      const { rows, count } = await Driver.findAndCountAll({
        where: {
          busCompanyId: companyId,
          ...textSearch(search, 'driver').where
        },
        ...paginate(page, limit),
        attributes: {
          exclude: ['password']
        },
        include: [
          {
            model: Bus,
            as: 'bus',
            attributes: {
              exclude: ['busCompanyId', 'driverId']
            },
            where: Sequelize.and({ occupied: true }),
            required: false
          }
        ]
      });
      return okResponse(res, { drivers: rows, totalDrivers: count });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async find(req, res) {
    try {
      const { id } = req.params;
      const driver = await Driver.findOne({
        where: {
          id
        },
        attributes: {
          exclude: ['password']
        },
        include: [
          {
            model: Bus,
            as: 'bus',
            attributes: {
              exclude: ['busCompanyId', 'driverId']
            },
            where: Sequelize.and({ occupied: true }),
            required: false
          }
        ]
      });
      if (!driver) {
        return notFound(res);
      }
      return okResponse(res, driver);
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { id: busCompanyId } = req.user;
      const { name } = req.body;
      const driver = await Driver.findOne({
        where: {
          id,
          busCompanyId
        }
      });
      if (!driver) {
        return notFound(res);
      }
      const data = await driver.update({ name });
      data.password = undefined;
      return okResponse(res, driver);
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const { id: busCompanyId } = req.user;
      const driver = await Driver.findOne({
        where: {
          id,
          busCompanyId
        }
      });
      if (!driver) {
        return notFound(res);
      }
      await driver.destroy();
      return okResponse(res, undefined, 200, 'Driver removed successfully');
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async assignBus(req, res) {
    try {
      const { id, busId } = req.params;
      const { id: busCompanyId } = req.user;
      const bus = await Bus.findOne({
        where: {
          id: busId,
          busCompanyId
        }
      });
      if (!bus) {
        return notFound(res, 'Bus not found');
      }
      if (bus.driverId === id && bus.occupied) {
        throw Error('Driver already assigned to bus');
      }
      const driver = await Driver.findByPk(id);
      if (!driver) {
        return notFound(res, 'Driver not found');
      }
      await bus.update({
        occupied: true,
        driverId: driver.id,
        assignedAt: new Date()
      });
      return okResponse(res, undefined, 200, 'Driver assigned successfully');
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async removeBus(req, res) {
    try {
      const { id, busId } = req.params;
      const { id: busCompanyId } = req.user;
      const record = await Bus.findOne({
        where: {
          driverId: id,
          id: busId,
          busCompanyId
        }
      });
      if (!record) {
        return notFound(res);
      }
      await record.update({
        occupied: false
      });
      return okResponse(
        res,
        undefined,
        200,
        'Driver removed from bus successfully'
      );
    } catch (error) {
      return badRequest(res, error);
    }
  }
}
