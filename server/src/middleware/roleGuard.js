import ApiError from '../utils/ApiError.js';

/**
 * Role-based access control middleware.
 * Usage:  router.get('/admin', protect, authorize('super_admin'), handler)
 *         router.get('/staff', protect, authorize('super_admin', 'principal'), handler)
 *
 * @param  {...string} allowedRoles - one or more role strings
 */
const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role "${req.user.role}" is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export default authorize;
