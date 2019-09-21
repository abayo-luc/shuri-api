import db from '../../../../models';
import { ADMIN_TYPES } from '../../../../constants';
import { notFound, badRequest } from '../../../../utils/response';

const { Admin } = db;

export default class AdminController {
  static async create(req, res) {
    try {
      const newUser = {};
      ({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name
      } = req.body);
      const user = await Admin.create(newUser);
      user.password = undefined;
      return res.json({ message: 'Success', data: user });
    } catch (err) {
      return badRequest(res, err, 'Admin registration failed');
    }
  }

  static async findAll(req, res) {
    try {
      const filters = {};
      const { type: adminType } = req.query;
      const type = adminType ? adminType.toString().toLowerCase() : null;

      if (type && ADMIN_TYPES.includes(type)) {
        filters.type = type;
      }
      const allAdmins = await Admin.findAll({
        where: {
          ...filters
        },
        attributes: {
          exclude: ['password']
        }
      });
      return res.json({ message: 'Success', data: allAdmins });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async findOne(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findOne({
        where: { id },
        attributes: {
          exclude: ['password']
        }
      });
      if (!admin) {
        return notFound(res);
      }
      return res.json({ message: 'Success', data: admin });
    } catch (err) {
      return badRequest(res, err);
    }
  }
}
