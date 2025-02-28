import fs from 'fs-extra';
import path from 'path';

export default function CreateGitHub(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, '/index.ts'),
    `import passport from "passport";
import express from "express";
import UserRepository from '../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import GitHubUseCase from './GitHubUsecase';

const router = express.Router();

const userRepository = new UserRepository();
const gitHubUseCase = new GitHubUseCase(userRepository);

router.get('/', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/callback', passport.authenticate('github', { failureRedirect: process.env.REDIRECT_URL_ON_FAIL! }),gitHubUseCase.GitHubCallBack);

export default router;`);

  fs.writeFileSync(
    path.join(projectDir, '/GitHubUsecase.ts'),
    `import { NextFunction, Request, Response } from "express";
import UserRepository from "../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository";
import { AuthProvider } from "@prisma/client";
import APIError from "../../../../application/Errors/APIError";
import IUser from "../../../../domain/model/IUser";
import JWTService from "../../../../application/JWTUsecase";
import dotenv from 'dotenv';

dotenv.config();

class GitHubUseCase {
  constructor(private readonly userRepository: UserRepository) { }
  GitHubSignIn = async (profile: any) => {
    const { id, displayName, photos, username } = profile;
    const photo = photos[0].value;
    let user = await this.userRepository.getByProviderId(id);

    if (user && user?.provider !== AuthProvider.GITHUB) throw new APIError(\`this Email is Already Provided by \${user?.provider}\`, 400);
    if (!user) {
      user = await this.userRepository.create({
        providerId: id,
        name: displayName,
        email: username,
        photo,
        password: null,
        refreshToken: null,
        provider: AuthProvider.GITHUB,
        verified: true,
      });
    }
    return user;
  };
  GitHubCallBack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.user)      
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const user = req.user as IUser;
      const { accessToken, refreshToken } = JWTService.generateTokens(user.id);
      this.userRepository.saveRefreshToken(user.id, refreshToken);
      JWTService.setTokenCookies(res, accessToken, refreshToken);
      const { refreshToken: userRefreshToken, password, ...userWithoutRefreshToken } = user;
      res.json({userWithoutRefreshToken, accessToken})
    } catch (error: any) {
      next(error);
    }
  }
}
export default GitHubUseCase;`);

  fs.writeFileSync(
    path.join(projectDir, '/GitHubAuth.ts'),
    `import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import UserRepository from '../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import GitHubUseCase from './GitHubUsecase';
import dotenv from 'dotenv';

dotenv.config();

const userRepository = new UserRepository();
const gitHubUseCase = new GitHubUseCase(userRepository);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            callbackURL: process.env.GITHUB_CALLBACK_URL!,
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                const user = await gitHubUseCase.GitHubSignIn(profile);
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));

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