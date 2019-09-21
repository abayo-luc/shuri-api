import Joi from '@hapi/joi';
import joiError from '../../../../utils/joiError';

export default (req, res, next) => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .min(4)
      .max(12)
      .required()
      .label('Username should be between 4-12 characters'),
    password: Joi.string()
      .min(6)
      .required()
      .label('Password should have minimum of 6 characters'),
    name: Joi.string()
      .required()
      .label('First name is required'),
    phoneNumber: Joi.string()
      .required()
      .label('Phone number is required')
  });
  return Joi.validate({ ...req.body }, schema, (err, _value) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
