import jwt from 'jsonwebtoken';
import { IJwtPayload } from '@/types';

export const generateAccessToken = (payload: Omit<IJwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(
    payload as object,
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (payload: Omit<IJwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(
    payload as object,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as IJwtPayload;
};