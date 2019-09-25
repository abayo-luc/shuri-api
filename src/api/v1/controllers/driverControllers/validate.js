/* eslint-disable no-useless-escape */
import Joi from '@hapi/joi';
import joiError from '../../../../utils/joiError';

const allSchema = {
  POST: Joi.object().keys({
    name: Joi.string()
      .required()
      .label('First name is required'),
    country: Joi.string()
      .required()
      .label('Country is required'),
    sex: Joi.string()
      .required()
      .label('Field is required'),
    drivingLicence: Joi.string()
      .required()
      .label('Driving licence is required'),
    birthDay: Joi.date()
      .required()
      .label('Invalid birth date'),
    phoneNumber: Joi.string()
      .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .label('Invalid phone number')
  }),
  PUT: Joi.object().keys({
    name: Joi.string().label('First name is required'),
    country: Joi.string().label('Country is required'),
    sex: Joi.string().label('Field is required'),
    drivingLicence: Joi.string().label('Driving licence is required'),
    birthDay: Joi.date().label('Invalid birth date'),
    phoneNumber: Joi.string()
      .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .label('Invalid phone number')
  })
};
export default (req, res, next) => {
  const schema = allSchema[req.method];
  return Joi.validate({ ...req.body }, schema, (err, _value) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
