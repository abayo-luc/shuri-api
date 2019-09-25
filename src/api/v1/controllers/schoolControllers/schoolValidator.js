/* eslint-disable no-useless-escape */
import Joi from '@hapi/joi';
import isValidCoordinates from 'is-valid-coordinates';
import { isEmpty } from 'lodash';
import joiError from '../../../../utils/joiError';

const Schemas = {
  POST: Joi.object().keys({
    name: Joi.string()
      .required()
      .label('Name is required'),
    country: Joi.string()
      .required()
      .label('Country is required'),
    district: Joi.string()
      .required()
      .label('District is required'),
    sector: Joi.string()
      .required()
      .label('Sector is required'),
    email: Joi.string()
      .email()
      .required()
      .label('Invalid principal email'),
    password: Joi.string()
      .min(6)
      .label('Password should have minimum of 6 characters'),
    phoneNumber: Joi.string()
      .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .label('Invalid principal phone number'),
    longitude: Joi.string()
      .regex(/^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/)
      .label('Invalid longitude value'),
    latitude: Joi.string()
      .regex(/^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/)
      .label('Invalid latitude value'),
    logo: Joi.string()
      .uri()
      .label('Logo should be a valid url'),
    description: Joi.string()
      .max(250)
      .label('Description should not be more than 250 character')
  }),
  PUT: Joi.object().keys({
    name: Joi.string().label('Name is required'),
    country: Joi.string().label('Country is required'),
    district: Joi.string().label('District is required'),
    sector: Joi.string().label('Sector is required'),
    email: Joi.string()
      .email()
      .label('Invalid principal email'),
    phoneNumber: Joi.string()
      .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .label('Invalid principal phone number'),
    longitude: Joi.string().label('Invalid longitude value'),
    latitude: Joi.string().label('Invalid latitude value'),
    logo: Joi.string()
      .uri()
      .label('Logo should be a valid url'),
    description: Joi.string()
      .max(250)
      .label('Description should not be more than 250 character')
  })
};
export default (req, res, next) => {
  const school = req.body;
  const { method } = req;
  const schema = Schemas[method];
  if (school.longitude || school.latitude) {
    const error = {};
    ['latitude', 'longitude'].forEach(el => {
      if (!isValidCoordinates[el](Number(school[el]))) {
        error[el] = `Invalid ${el} value`;
      }
    });
    if (!isEmpty(error)) {
      return res.status(400).json({
        message: 'Validation error',
        error
      });
    }
  }
  return Joi.validate(school, schema, (err, _value) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
