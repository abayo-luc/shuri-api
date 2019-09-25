import Joi from '@hapi/joi';
import joiError from '../../../../utils/joiError';

const allSchema = {
  POST: Joi.object().keys({
    plateNumber: Joi.string()
      .min(7)
      .max(7)
      .required()
      .label('Invalid plat number'),
    seatsNumber: Joi.number()
      .required()
      .label('Seats number should be a number'),
    carteJaune: Joi.string()
      .required()
      .label('Carte Jaune is required'),
    model: Joi.string()
      .required()
      .label('Model is required')
  }),
  PUT: Joi.object().keys({
    plateNumber: Joi.string()
      .min(7)
      .max(7)
      .label('Invalid plat number'),
    seatsNumber: Joi.number().label('Seats number should be a number'),
    carteJaune: Joi.string().label('Carte Jaune is required'),
    model: Joi.string().label('Model is required')
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
