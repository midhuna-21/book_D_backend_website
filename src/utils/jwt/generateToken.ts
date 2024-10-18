import jwt, { SignOptions } from 'jsonwebtoken';
import { Response, Request } from 'express';
import config from '../../config/config';

interface UserTokenPayload {
  userId: string;
  userRole: string;
}

const generateTokens = (res: Response, payload: UserTokenPayload): { accessToken: string, refreshToken: string } => {
  const accessToken = jwt.sign({ userId: payload.userId, userRole: payload.userRole }, config.JWT_SECRET as string, {
    expiresIn: '1m'
  } as SignOptions);

  const refreshToken = jwt.sign({ userId: payload.userId, userRole: payload.userRole }, config.JWT_SECRET as string, {
    expiresIn: '30d'
  } as SignOptions);

  const cookieName = payload.userRole === 'admin' ? 'adminrefreshToken' : 'userRerreshToken';
  res.cookie(cookieName, refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: false, 
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export { generateTokens };
