import Joi from '@hapi/joi';
import joiError from '../../../../utils/joiError';

export default (req, res, next) => {
  const { email, password } = req.body;
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .label('Invalid email'),
    name: Joi.string().label('Invalid first name'),
    password: Joi.string()
      .min(6)
      .required()
      .label('Password should have minimum of 6 characters')
  });
  Joi.validate({ email, password }, schema, (err, _value) => {
    if (err) {
      const error = joiError(err);
      return res.status(400).json({ message: 'Validation error', error });
    }
    return next();
  });
};
