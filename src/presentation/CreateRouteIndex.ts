import fs from "fs-extra";
import path from "path";

export default function CreateRouteIndex(
  projectDir: string,
  AuthMethod: string[],
) {
  let Router = "";
  let Imports = "";
  let isPassport = false;
  for (const method of AuthMethod) {
    if (method === "email") {
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
    path.join(projectDir, "/index.ts"),
    `import express from 'express';
${Imports}
const apiRouter = express.Router();

${Router}
export default apiRouter;`,
  );
}
