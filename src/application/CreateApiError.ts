import fs from 'fs-extra';
import path from 'path';

export default function CreateApiError(projectDir: string) {
    fs.writeFileSync(
        path.join(projectDir, '/APIError.ts'),
        `class APIError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export default APIError;
`);
}