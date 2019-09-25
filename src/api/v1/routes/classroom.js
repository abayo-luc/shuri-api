import { Router } from 'express';
import authenticate from '../../../middleware/authenticate';
import authorize from '../../../middleware/authorize';
import { schoolPrincipal } from '../../../utils/roles';
import validateClassroom from '../controllers/classroomControllers/validate';
import ClassroomController from '../controllers/classroomControllers';

const classroomRouters = Router();
classroomRouters.all('*', authenticate);

classroomRouters
  .post(
    '/classrooms',
    authorize(schoolPrincipal),
    validateClassroom,
    ClassroomController.create
  )
  .get('/schools/:schoolId/classrooms', ClassroomController.findAll)
  .get('/classrooms/:id', ClassroomController.find)
  .put(
    '/classrooms/:id',
    authorize(schoolPrincipal),
    ClassroomController.update
  )
  .delete(
    '/classrooms/:id',
    authorize(schoolPrincipal),
    ClassroomController.delete
  )
  .post(
    '/classrooms/:id/teachers/:teacherId',
    authorize(schoolPrincipal),
    ClassroomController.addTeacher
  )
  .put(
    `/classrooms/:id/teachers/remove`,
    authorize(schoolPrincipal),
    ClassroomController.removeTeacher
  );

export default classroomRouters;
