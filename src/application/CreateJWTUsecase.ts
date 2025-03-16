import fs from 'fs-extra';
import path from 'path';

export default function CreateJWTUsecase(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, '/JWTUsecase.ts'),
    `import { Response } from 'express';
import jwt from 'jsonwebtoken';

class JWTService {
    static generateTokens(id: string) {
        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

        return { accessToken, refreshToken };
    }

    static setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
    }
}

export default JWTService;
`,
  );
}
