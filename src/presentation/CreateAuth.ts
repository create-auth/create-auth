import fs from "fs-extra";
import path from "path";

export default function CreateAuthentication(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, "/Authentication.ts"),
    `import UserUseCase from '../../../application/UserUsecase';
import { NextFunction, Request, Response } from 'express';
import APIError from '../../../application/Errors/APIError';
import JWTUsecase from '../../../application/JWTUsecase';
class UserAuthentication {
  constructor(private readonly userUseCase: UserUseCase) { }

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;
      const newUser = await this.userUseCase.createUser(user);
      res.status(201).json({ user: newUser });
    } catch (error: any) {
      next(error);
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userUseCase.loginUser(req.body);
      const { accessToken, refreshToken } = JWTUsecase.generateTokens(user.id);
      this.userUseCase.saveRefreshToken(user.id, refreshToken);
      JWTUsecase.setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({ user, accessToken });
    } catch (error: any) {
      next(error);
    }
  };

  generateNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies
      const { accessToken, refreshToken } = await this.userUseCase.generateNewAccessToken(cookies);
      JWTUsecase.setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({ accessToken });
    } catch (error: any) {
      next(error);
    }
  }

  logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) throw new APIError('No content', 204);
      await this.userUseCase.invalidateRefreshToken(refreshToken);
      res.clearCookie('accessToken', { secure: true });
      res.clearCookie('refreshToken', { secure: true });
      console.log('Logged out successfully');
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      next(error);
    }
  };
}

export default UserAuthentication;
`,
  );
  fs.writeFileSync(
    path.join(projectDir, "/Authorization.ts"),
    `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import APIError from '../../../application/Errors/APIError';
import UserUseCase from '../../../application/UserUsecase';

class AuthorizationController {
  constructor(private readonly userUseCase: UserUseCase) { }
  AuthToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['accessToken'];

    
    try {
      if (!token) throw new APIError('Access token is required', 401);
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await this.userUseCase.getUserById((decoded as any).id);
      if (!user) throw new APIError('User not found', 404);
      if (!user.verified) throw new APIError('Email is not verified', 403);

      (req as any).user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new APIError('Access token has expired', 401));
      }
  
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new APIError('Invalid access token', 403));
      }
  
      next(error);
    }
  }
}

export default AuthorizationController;
`,
  );
  fs.writeFileSync(
    path.join(projectDir, "/index.ts"),
    `import express from 'express';
import UserAuthentication from './Authentication';
import UserUsecase from '../../../application/UserUsecase';
import UserRepository from '../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import verify from './Verify';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository);
const userAuthentication = new UserAuthentication(userUsecase); 

router.post('/register', userAuthentication.registerUser);
router.post('/login', userAuthentication.loginUser);
router.get('/refresh', userAuthentication.generateNewAccessToken);
router.post('/logout', userAuthentication.logoutUser);

router.use('/verify', verify);

export default router;
`,
  );
}
