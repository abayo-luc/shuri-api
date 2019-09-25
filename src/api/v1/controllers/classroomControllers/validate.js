import Joi from '@hapi/joi';
import joiError from '../../../../utils/joiError';

export default (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .required()
      .label('Name is required'),
    avatar: Joi.string().uri().label('Avatar must be a valid url'),
    code: Joi.string()
      .required()
      .label('Classroom code is required')
  });
  return Joi.validate(req.body, schema, (err, _values) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
