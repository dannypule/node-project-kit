import jwt from 'jsonwebtoken';
import config from '../config';

export const getJWT = user => {
  const expirationTime = parseInt(config.jwt_expiration, 10);
  const token = jwt.sign(
    {
      userUuid: user.uuid,
      userRoleCode: user.user_role_code,
      companyUuid: user.company_uuid,
      verified: user.verified,
      status: user.status,
    },
    config.jwt_encryption,
    {
      expiresIn: expirationTime,
    },
  );

  return `Bearer ${token}`;
};
