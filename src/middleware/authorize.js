import { some } from 'lodash';

export default (...roles) => {
  const isAllowed = role => some(roles, role);
  return (req, res, next) => {
    if(roles.includes('owner') && req.user.id === req.params.id){
      next()
    }
    if (req.user && isAllowed(req.user.role)) {
      return next();
    }
    return res.status(401).json({
      error: 'Access is denied',
      message:
        'You may not have the appropriate permissions to perform this action'
    });
  };
};
