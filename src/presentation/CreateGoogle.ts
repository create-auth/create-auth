import fs from 'fs-extra';
import path from 'path';

export default function CreateGoogle(projectDir: string) {
    fs.writeFileSync(
        path.join(projectDir, '/index.ts'),
        `import express from 'express';

import passport from 'passport';
import UserUseCase from '../../../../application/UserUsecase';
import UserRepository from '../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import GoogleUseCase from './GoogleUsecase';
const router = express.Router();

const userRepository = new UserRepository();
const userUsecase = new UserUseCase(userRepository);
const googleUseCase = new GoogleUseCase(userRepository, userUsecase);

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback', passport.authenticate('google', { failureRedirect: process.env.REDIRECT_URL_ON_FAIL! }), googleUseCase.GoogleCallBack);

export default router;`);

    fs.writeFileSync(
        path.join(projectDir, '/GoogleUsecase.ts'),
        `import { NextFunction, Request, Response } from "express";
import UserRepository from "../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository";
import { AuthProvider } from "@prisma/client";
import APIError from "../../../../application/Errors/APIError";
import IUser from "../../../../domain/model/IUser";
import JWTService from "../../../../application/JWTUsecase";
import UserUseCase from "../../../../application/UserUsecase";
import dotenv from 'dotenv';

dotenv.config();

class GoogleUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly userUsecase: UserUseCase) { }
  GoogleSignIn = async (profile: any) => {
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value;
    const photo = photos[0].value;

    let userByProvider = await this.userRepository.getByProviderId(id);
    if (userByProvider) {
      if (userByProvider && userByProvider?.provider !== AuthProvider.GOOGLE) throw new APIError(\`this Email is Already Provided by \${userByProvider?.provider}\`, 400);
      if (!userByProvider) {
        userByProvider = await this.userRepository.create({
          providerId: id,
          name: displayName,
          email,
          photo,
          password: null,
          refreshToken: null,
          provider: AuthProvider.GOOGLE,
          verified: true,
        });
      }
      return userByProvider;
    }else {
      let user = await this.userRepository.getByEmail(email);
      if (user && user?.provider !== AuthProvider.GOOGLE) throw new APIError(\`this Email is Already Provided by \${user?.provider}\`, 400);
      if (!user) {
        user = await this.userRepository.create({
          providerId: id,
          name: displayName,
          email,
          photo,
          password: null,
          refreshToken: null,
          provider: AuthProvider.GOOGLE,
          verified: true,
        });
      }
      return user;
    }
  };
  GoogleCallBack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const user = req.user as IUser;
      const { accessToken, refreshToken } = JWTService.generateTokens(user.id);
      this.userUsecase.saveRefreshToken(user.id, refreshToken);
      JWTService.setTokenCookies(res, accessToken, refreshToken);
      const { refreshToken: userRefreshToken, password, ...userWithoutRefreshToken } = user;
      res.status(200).json({userWithoutRefreshToken, accessToken})/* .redirect(\`\${process.env.REDIRECT_URL_ON_SUCCESS!}google/callback?token=\${accessToken}&user=\${JSON.stringify(userWithoutRefreshToken)}\`); */
    } catch (error: any) {
      next(error);
    }
  }
}
export default GoogleUseCase;`);

    fs.writeFileSync(
        path.join(projectDir, '/GoogleAuth.ts'),
        `import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import GoogleUseCase from './GoogleUsecase';
import UserRepository from "../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository";
import UserUseCase from '../../../../application/UserUsecase';

dotenv.config();

const userRepository = new UserRepository();
const userUsecase = new UserUseCase(userRepository);
const googleUseCase = new GoogleUseCase(userRepository, userUsecase);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const user = await googleUseCase.GoogleSignIn(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id)
});
passport.deserializeUser(async (user: any, done) => {
  try {
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
export default passport;`);
}