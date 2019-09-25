import db from '../../../../models';
import { badRequest, notFound, okResponse } from '../../../../utils/response';
import { TEACHER } from '../schoolUserControllers/types';
import {paginate, textSearch} from '../../../../utils/queryHelpers'

const { Classroom,  User } = db;

export default class ClassroomController {
  static async create(req, res) {
    try {
      const { schoolId } = req.user;
      const data = await Classroom.create({ ...req.body, schoolId });
      const message = 'Classroom created successfully';
      return okResponse(res, data, 201, message);
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async findAll(req, res) {
    try {
      const { schoolId } = req.params;
      const {limit, page, search} = req.query
      const {rows, count} = await Classroom.findAndCountAll({
        where: {
         schoolId,
         ...textSearch(search, 'classroom').where
        },
        ...paginate(page, limit),
        include: [
          {
            model: User,
            as: 'teacher'
          }
        ]
      });
      return okResponse(res, {classrooms: rows, totalClassrooms: count});
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async find(req, res) {
    try {
      const { id } = req.params;
      const data = await Classroom.findByPk(id, {
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: {
              exclude: ['password', 'classroomId']
            }
          },
          {
            model: User,
            as: 'teacher'
          }
        ]
      });
      if (!data) {
        return notFound(res);
      }
      return okResponse(res, data);
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async update(req, res) {
    try {
      const attributes = {};
      ({
        name: attributes.name,
        avatar: attributes.avatar,
        code: attributes.avatar,
        avatar: attributes.avatar
      } = req.body);
      const { id } = req.params;
      const { schoolId } = req.user;
      const classroom = await Classroom.findOne({
        where: {
          id,
          schoolId
        }
      });
      if (!classroom) {
        return notFound(res);
      }
      const data = await classroom.update(attributes);
      return okResponse(res, data, 200, 'Classroom successfully updated');
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { schoolId } = req.user;
      const classroom = await Classroom.findOne({
        where: {
          id,
          schoolId
        }
      });
      if (!classroom) {
        return notFound(res);
      }
      const teacher = await User.findOne({
        where: {
          classroomId: classroom.id,
          schoolId
        }
      });
      if (teacher) {
        await teacher.setClassroom(null);
      }
      await classroom.destroy();
      return okResponse(res, undefined, 200, 'Classroom successfully deleted');
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async addTeacher(req, res) {
    try {
      const { id, teacherId } = req.params;
      const { schoolId } = req.user;
      const teacher = await User.findOne({
        where: {
          schoolId,
          id: teacherId,
          type: TEACHER
        },
        include:[
          {
            model: Classroom,
            as:'classroom'
          }
        ]
      });
      if (!teacher) {
        return notFound(res, 'Teacher not found');
      } if(teacher.classroom){
        throw Error(`${teacher.name || 'Teacher'} already assigned to ${teacher.classroom.name || 'classroom'}`)
      }
      const classroom = await Classroom.findOne({
        where: {
          id,
          schoolId
        },
        include:[
          {
            model: User,
            as:'teacher'
          }
        ]
      });
      if(!classroom){
        return notFound(res, 'Classroom not found')
      } if(classroom.teacher){
        throw Error(`${classroom.name} already assigned to ${classroom.teacher.name || 'a teacher'}`)
      }

      const alreadyExit = teacher.classroomId === id;
      if (alreadyExit) {
        throw new Error(
          `${teacher.name || 'Teacher'} already assigned to class ${
            classroom.name
          }`
        );
      }
      await teacher.setClassroom(classroom);
      return okResponse(
        res,
        undefined,
        200,
        `${teacher.name || 'Teacher'} successfully added to ${classroom.name}`
      );
    } catch (error) {
      return badRequest(res, error);
    }
  }

  static async removeTeacher(req, res) {
    try {
      const { id } = req.params;
      const { schoolId } = req.user;
      const teacher = await User.findOne({
        where: {
          classroomId: id,
          schoolId
        }
      });
      if (!teacher) {
        return notFound(
          res,
          'Not teacher class relation found with provided details'
        );
      }
      await teacher.setClassroom(null);
      return okResponse(
        res,
        undefined,
        200,
        'Teacher successfully removed from the class'
      );
    } catch (error) {
      return badRequest(res, error);
    }
  }
}
