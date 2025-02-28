import fs from 'fs-extra';
import path from 'path';

export default function CreateFaceBook(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, '/index.ts'),
    `import passport from "passport";
import express from "express";
import UserRepository from '../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import FaceBookUseCase from './FaceBookUsecase';

const router = express.Router();

const userRepository = new UserRepository();
const faceBookUseCase = new FaceBookUseCase(userRepository);

router.get('/', passport.authenticate('facebook'));
router.get('/callback', passport.authenticate('facebook', { failureRedirect: process.env.REDIRECT_URL_ON_FAIL!}),faceBookUseCase.FaceBookCallBack);

export default router;`);

  fs.writeFileSync(
    path.join(projectDir, '/FaceBookUsecase.ts'),
    `import { NextFunction, Request, Response } from "express";
import UserRepository from "../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository";
import { AuthProvider } from "@prisma/client";
import APIError from "../../../../application/Errors/APIError";
import IUser from "../../../../domain/model/IUser";
import JWTService from "../../../../application/JWTUsecase";
import dotenv from 'dotenv';

dotenv.config();

class FaceBookUseCase {
  constructor(private readonly userRepository: UserRepository) { }
  FaceBookSignIn = async (profile: any) => {
    const { id, displayName, photos } = profile;
    const photo = photos[0].value;
    let user = await this.userRepository.getByProviderId(id);

    if (user && user?.provider !== AuthProvider.FACEBOOK) throw new APIError(\`this Email is Already Provided by \${user?.provider}\`, 400);
    if (!user) {
      user = await this.userRepository.create({
        providerId: id,
        name: displayName,
        email: displayName,
        photo,
        password: null,
        refreshToken: null,
        provider: AuthProvider.FACEBOOK,
        verified: true,
      });
    }
    return user;
  };
  FaceBookCallBack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const user = req.user as IUser;
      const { accessToken, refreshToken } = JWTService.generateTokens(user.id);
      this.userRepository.saveRefreshToken(user.id, refreshToken);
      JWTService.setTokenCookies(res, accessToken, refreshToken);
      console.log(user, accessToken)
      const { refreshToken: userRefreshToken, password, ...userWithoutRefreshToken } = user;
      res.status(200).json({userWithoutRefreshToken, accessToken})
    } catch (error: any) {
      next(error);
    }
  }
}
export default FaceBookUseCase;`);

  fs.writeFileSync(
    path.join(projectDir, '/FaceBookAuth.ts'),
    `import passport from 'passport';
import { Strategy as  FacebookStrategy} from 'passport-facebook';
import UserRepository from '../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import FaceBookUseCase from './FaceBookUsecase';
import dotenv from 'dotenv';

dotenv.config();

const userRepository = new UserRepository();
const faceBookUseCase = new FaceBookUseCase(userRepository);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                const user = await faceBookUseCase.FaceBookSignIn(profile);
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