import fs from 'fs-extra';
import path from 'path';

export default function CreatSocialIndex(projectDir: string) {
    fs.writeFileSync(
        path.join(projectDir, '/index.ts'),
        `import express from 'express';
const router = express.Router();
export default router;`);
}