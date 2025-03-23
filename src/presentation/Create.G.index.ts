import fs from 'fs-extra';
import path from 'path';

export default function CreateGinIndex(
  projectDir: string,
  AuthMethod: string[],
) {
  let socialImports = '';
  let socialLinks = '';
  let isPassport = false;
  let initializePass = '';
  if (AuthMethod.includes('google')) {
    if (!isPassport) {
      socialImports += `import passport from 'passport';\n`;
      initializePass =
        'app.use(passport.initialize());\n\
  app.use(passport.session());';
      isPassport = true;
    }
    socialImports += `import './api/socialProviders/Google/GoogleAuth';\n`;
    socialLinks += `<a href="/api/v1/social/google">Google </a>`;
  }

  if (AuthMethod.includes('github')) {
    if (!isPassport) {
      socialImports += `import passport from 'passport';\n`;
      initializePass =
        'app.use(passport.initialize());\n\
  app.use(passport.session());';
      isPassport = true;
    }
    socialImports += `import './api/socialProviders/GitHub/GitHubAuth';\n`;
    socialLinks += `<a href="/api/v1/social/github">GitHub </a>`;
  }

  if (AuthMethod.includes('facebook')) {
    if (!isPassport) {
      socialImports += `import passport from 'passport';\n`;
      initializePass =
        'app.use(passport.initialize());\n\
  app.use(passport.session());';
      isPassport = true;
    }
    socialImports += `import './api/socialProviders/FaceBook/FaceBookAuth';\n`;
    socialLinks += `<a href="/api/v1/social/facebook">Facebook </a>`;
  }
  if (!isPassport) {
    socialLinks = '🦄🌈✨👋🌎🌍🌏✨🌈🦄';
  }

  fs.writeFileSync(
    path.join(projectDir, '/index.ts'),
    `import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import apiRouter from './api';
import session from 'express-session';
import https from 'https';
import fs from 'fs';
import path from 'path';

${socialImports}
dotenv.config();


function main() {
  const app = express();

  app.use(cors({ origin: [process.env.CLIENT_URL!, process.env.CLIENT_URL_SECURE!], credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true, httpOnly: true, sameSite: 'strict' },
    })
  );

  ${initializePass}

  app.get('/', (req, res) => {
    res.send(\`${socialLinks}\`);
  });

  app.use('/api/v1', apiRouter);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
    next();
  });

  let sslOptions;
  try {
    sslOptions = {
      key: fs.readFileSync(path.join(__dirname, '../../server.key')),
      cert: fs.readFileSync(path.join(__dirname, '../../server.cert')),
    };
  } catch (error) {
    console.error('Error loading SSL certificates:', error);
    process.exit(1);
  }

  const port = process.env.PORT || 3000;
  https.createServer(sslOptions, app).listen(port, () => {
    console.log(\`Server is running at https://localhost:\${port}\`);
  });
}

export default main;`,
  );
}
