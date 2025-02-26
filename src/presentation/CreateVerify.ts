import fs from 'fs-extra';
import path from 'path';

export default function CreateVerify(projectDir: string) {
    fs.writeFileSync(
        path.join(projectDir, '/index.ts'),
        `import express from 'express';
import dotenv from 'dotenv';
import VerificationController from './Verification';
import UserUsecase from '../../../../application/UserUsecase';
import UserRepository from '../../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import ValidationUseCase from '../../../../application/validationUsecase';
dotenv.config();
const router = express.Router();
const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository);
const validationUseCase = new ValidationUseCase();
const verificationController = new VerificationController(userUsecase, validationUseCase);


router.post('/send-code', verificationController.sendCode);
router.post('/verify-code', verificationController.verifyCode);


export default router;
`
    );
    fs.writeFileSync(
        path.join(projectDir, '/Verification.ts'),
        `import { NextFunction, Request, Response } from "express";
import ValidationUseCase from "../../../../application/validationUsecase";
import UserUseCase from "../../../../application/UserUsecase";
import JWTUsecase from "../../../../application/JWTUsecase";
class VerificationController {
    constructor(private readonly userUseCase: UserUseCase, private readonly validationUseCase: ValidationUseCase) { }

    sendCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);
            const { email } = req.body;
            const IsEmailVerified = await this.userUseCase.getUserByEmail(email);
            if (IsEmailVerified?.verified) return res.status(400).json({ error: 'Email already verified' });
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            await this.validationUseCase.sendVerificationEmail(email);

            res.status(200).json({ message: 'Verification code sent successfully' });
        } catch (error: any) {
            next(error);
        }
    }

    verifyCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, code } = req.body;
            const IsEmailVerified = await this.userUseCase.getUserByEmail(email);
            if (IsEmailVerified?.verified) return res.status(400).json({ error: 'Email already verified' });
            if (!email || !code) {
                return res.status(400).json({
                    error: 'Email and verification code are required'
                });
            }
            await this.validationUseCase.verifyCode(email, code);
            const user = await this.userUseCase.verifyEmail(email);
            if (!user) {
                return res.status(400).json({
                    error: 'Email not found'
                });
            }
            const { accessToken, refreshToken } = JWTUsecase.generateTokens(user.id);
            this.userUseCase.saveRefreshToken(user.id, refreshToken);
            JWTUsecase.setTokenCookies(res, accessToken, refreshToken);
            res.status(200).json({
                message: 'Code verified successfully and email is verified',
                verified: true,
                accessToken,
                user
            });
        } catch (error: any) {
            next(error);
        }
    }
}

export default VerificationController;`);
}