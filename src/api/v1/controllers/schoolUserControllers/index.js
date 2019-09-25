import model from '../../../../models';
import { badRequest, notFound, okResponse } from '../../../../utils/response';
import generatePwd from '../../../../utils/genPwd';
import {paginate, textSearch} from '../../../../utils/queryHelpers'

const { User, Classroom } = model;
export default class SchoolUserController {
  static async create(req, res) {
    try {
      const { schoolId } = req.user;
      const users = req.body.users.map(user => ({ ...user, password: generatePwd(), schoolId }));

      const response = await User.bulkCreate(users, {
        returning: true,
        individualHooks: true
      });
      response.password = undefined;
      return res
        .status(201)
        .json({ message: 'User registered successfully', data: response });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async findAll(req, res) {
    try {
      const { schoolId } = req.params;
      const {limit, page, search, filter} = req.query
      const filterBy = {}
      if(filter && ['TM', 'DOD', 'PRINCIPAL', 'TEACHER'].includes(filter)){
        filterBy.type = filter
      }
      const {rows, count}= await User.findAndCountAll({
        where: {
          schoolId,
          ...filterBy,
          ...textSearch(search, 'user').where
        },
        ...paginate(page, limit),
        attributes: {
          exclude: ['password', 'schoolId', 'classroomId']
        },
        include: [
          {
            model: Classroom,
            as: 'classroom',
            
          }
        ]
      });
      return okResponse(res, {users: rows, totalUsers: count})
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async find(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: {
          id
        },
        attributes: {
          exclude: ['password', 'schoolId', 'classroomId']
        },
        include: [
          {
            model: Classroom,
            as: 'classroom',
            
          }
        ]
      });
      if (!user) {
        return notFound(res);
      }
      return res.json({ message: 'Success', data: user });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { schoolId } = req.user;
      const newUser = {};
      ({ name: newUser.name, phoneNumber: newUser.phoneNumber } = req.body);
      const user = await User.findOne({
        where: {
          id,
          schoolId
        }
      });
      if (!user) {
        return notFound(res);
      }
      const response = await user.update(newUser);
      response.password = undefined;
      return res
        .status(200)
        .json({ message: 'User update successfully', data: response });
    } catch (err) {
      return badRequest(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { schoolId } = req.user;
      const user = await User.findOne({
        where: {
          id,
          schoolId
        }
      });
      if (!user) {
        return notFound(res);
      }
      await user.destroy();
      return res.status(200).json({ message: 'User removed successfully' });
    } catch (err) {
      return badRequest(res, err);
    }
  }
}
