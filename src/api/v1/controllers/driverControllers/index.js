import db from '../../../../models';
import { badRequest, notFound } from '../../../../utils/response';

const { Driver, BusCompany, Bus, BusDriver } = db;

export default class DriverController {
  static async create(req, res) {
    try {
      const { id: companyId } = req.user;
      const newDriver = { busCompanyId: companyId };
      ({
        name: newDriver.name,
        phoneNumber: newDriver.phoneNumber,
        username: newDriver.username,
        password: newDriver.password
      } = req.body);
      const driver = await Driver.create(newDriver);
      driver.password = undefined;
      return res
        .status(201)
        .json({ message: 'Driver registered successfully', data: driver });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async findAll(req, res) {
    try {
      const { companyId } = req.params;
      const data = await BusCompany.findOne({
        where: {
          id: companyId
        },
        attributes: {
          exclude: ['password']
        },
        include: [
          {
            model: Driver,
            as: 'drivers',
            attributes: {
              exclude: ['password']
            }
          }
        ]
      });
      return res.status(200).json({ message: 'Success', data });
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
            attributes: {
              exclude: ['BusDriver']
            }
          }
        ]
      });
      if (!driver) {
        return notFound(res);
      }
      return res.status(200).json({ message: 'Success', data: driver });
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
      return res.status(200).json({ message: 'Success', data });
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
      return res.status(200).json({ message: 'Driver removed successfully' });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async assignBus(req, res) {
    try {
      const { id, busId } = req.params;
      const { id: companyId } = req.user;
      const driver = await Driver.findOne({
        where: {
          id,
          busCompanyId: companyId
        }
      });
      if (!driver) {
        return notFound(res);
      }
      const bus = await Bus.findOne({
        where: {
          id: busId,
          busCompanyId: companyId
        }
      });
      if (!bus) {
        return notFound(res);
      }

      const alreadyAssigned = await driver.hasBus(bus);
      if (alreadyAssigned) {
        throw new Error('Driver already assigned to the bus!!!');
      }
      const response = await driver.addBus(bus, {
        through: {
          companyId
        }
      });

      return res.status(201).json({
        message: 'Driver assigned to bus successfully',
        data: response
      });
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async removeBus(req, res) {
    try {
      const { id, busId } = req.params;
      const { id: companyId } = req.user;
      const record = await BusDriver.findOne({
        where: {
          driverId: id,
          busId,
          companyId
        }
      });
      if (!record) {
        return notFound(res);
      }
      await record.destroy();
      return res
        .status(200)
        .json({ message: 'Driver removed from bus successfully' });
    } catch (error) {
      return badRequest(res, error);
    }
  }
}
