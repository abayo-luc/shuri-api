import Joi from '@hapi/joi';
import joiError from '../../../../utils/joiError';

export default (req, res, next) => {
  const schema = Joi.object().keys({
    plateNumber: Joi.string()
      .min(7)
      .max(7)
      .required()
      .label('Invalid plat number'),
    model: Joi.string()
  });
  return Joi.validate({ ...req.body }, schema, (err, _value) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
