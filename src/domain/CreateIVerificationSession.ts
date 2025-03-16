import fs from 'fs-extra';
import path from 'path';

export default function CreateIVerificationSession(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, '/IVerificationSession.ts'),
    `export interface IVerificationSession {
    email: string;
    code: string;
    expiresAt: Date;
    attempts?: number;
}`,
  );
}
