import Joi from '@hapi/joi';
import { isEmpty } from 'lodash';
import joiError from '../../../../utils/joiError';
import { TRANSPORT_MANAGER, DIRECTOR_OF_DISCIPLINE, TEACHER } from './types';

export default (req, res, next) => {
  const { users } = req.body;
  if (isEmpty(users)) {
    return res.status(400).json({ message: `List of user can't be empty` });
  }
  const user = Joi.object().keys({
    name: Joi.string().label('Name should be a string'),
    email: Joi.string()
      .email()
      .required()
      .label('Invalid email'),
    password: Joi.string()
      .min(6)
      .label('Password should have minimum of 6 characters'),
    phoneNumber: Joi.string()
      .min(10)
      .max(13)
      .label('Invalid phone number'),
    type: Joi.string()
      .valid([TRANSPORT_MANAGER, DIRECTOR_OF_DISCIPLINE, TEACHER])
      .label(
        `School user type should be either ${TRANSPORT_MANAGER}, ${DIRECTOR_OF_DISCIPLINE}, or ${TEACHER}`
      )
  });
  const usersSchema = Joi.array().items(user);
  return Joi.validate(users, usersSchema, (err, _value) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
