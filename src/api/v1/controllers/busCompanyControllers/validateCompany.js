/* eslint-disable no-useless-escape */
import Joi from '@hapi/joi';
import joiError from '../../../../utils/joiError';

const allSchema = {
  PUT: Joi.object().keys({
    name: Joi.string().label('Name is required'),
    email: Joi.string()
      .email()
      .label('Invalid email'),
    country: Joi.string().label('Country is required'),
    district: Joi.string().label('District is required'),
    sector: Joi.string().label('Sector is required'),
    phoneNumber: Joi.string()
      .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .label('Invalid phone number'),
    password: Joi.string()
      .min(4)
      .label('Password too short'),
    logo: Joi.string()
      .uri()
      .label('Logo should be a valid url'),
    description: Joi.string()
      .max(250)
      .label('Description should not be more than 250 character')
  }),
  POST: Joi.object().keys({
    name: Joi.string()
      .required()
      .label('Name is required'),
    email: Joi.string()
      .email()
      .required()
      .label('Invalid email'),
    country: Joi.string()
      .required()
      .label('Country is required'),
    district: Joi.string()
      .required()
      .label('District is required'),
    sector: Joi.string()
      .required()
      .label('Sector is required'),
    phoneNumber: Joi.string()
      .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .required()
      .label('Invalid phone number'),
    password: Joi.string()
      .min(4)
      .label('Password too short'),
    logo: Joi.string()
      .uri()
      .label('Logo should be a valid url'),
    description: Joi.string()
      .max(250)
      .label('Description should not be more than 250 character')
  })
};
export default (req, res, next) => {
  const schema = allSchema[req.method];
  Joi.validate({ ...req.body }, schema, (err, _value) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
