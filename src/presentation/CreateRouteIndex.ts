import fs from 'fs-extra';
import path from 'path';

export default function CreateRouteIndex(
  projectDir: string,
  AuthMethod: string[],
) {
  let Router = '';
  let Imports = '';
  let isPassport = false;
  for (const method of AuthMethod) {
    if (method === 'email') {
      Router += `apiRouter.use('/auth', auth);\n`;
      Imports += `import auth from './Auth';\n`;
    } else {
      if (isPassport) break;
      Router += `apiRouter.use('/social', social);\n`;
      Imports += `import social from './socialProviders/index';\n`;
      isPassport = true;
    }
  }

  fs.writeFileSync(
    path.join(projectDir, '/index.ts'),
    `import express from 'express';
import { Request, Response } from "express";
import AuthorizationController from './Auth/Authorization';
import UserRepository from '../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';
import UserUseCase from '../../application/UserUsecase';
${Imports}
const apiRouter = express.Router();

const userRepository = new UserRepository();
const userUsecase = new UserUseCase(userRepository);
const authorizationController = new AuthorizationController(userUsecase);

const getProduct = (req: Request, res: Response): void => {
    res.json(["product1", "product2", "product3"]);
};

apiRouter.get('/products', authorizationController.AuthToken, getProduct);
${Router}
export default apiRouter;`,
  );
}
