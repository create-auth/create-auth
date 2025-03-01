import fs from 'fs-extra';
import path from 'path';

export default function CreatePrismaClient(projectDir: string) {
    fs.writeFileSync(
        path.join(projectDir, '/PrismaClient.ts'),
        `import { PrismaClient } from '@prisma/client';

export default new PrismaClient();`)
}