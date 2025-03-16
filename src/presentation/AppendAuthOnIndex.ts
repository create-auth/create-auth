import { readFileSync, writeFileSync, existsSync } from 'fs';
import CreatSocialIndex from './CreatSocialIndex';

export default function appendAuthProvider(
  filePath: string,
  provider: 'Google' | 'GitHub' | 'FaceBook',
) {
  if (!existsSync(filePath)) {
    CreatSocialIndex(filePath.split('/index.ts')[0]);
  }

  let fileContent = readFileSync(filePath, 'utf8');

  const importLine = `import ${provider} from './${provider}';`;
  const routeLine = `router.use('/${provider.toLowerCase()}', ${provider});`;

  if (fileContent.includes(importLine) || fileContent.includes(routeLine)) {
    return;
  }

  const importInsertIndex = fileContent.indexOf(
    'const router = express.Router();',
  );
  if (importInsertIndex !== -1) {
    fileContent =
      fileContent.slice(0, importInsertIndex) +
      importLine +
      '\n' +
      fileContent.slice(importInsertIndex);
  }

  const exportIndex = fileContent.indexOf('export default router;');
  if (exportIndex !== -1) {
    fileContent =
      fileContent.slice(0, exportIndex) +
      routeLine +
      '\n' +
      fileContent.slice(exportIndex);
  }

  writeFileSync(filePath, fileContent, 'utf8');
}
