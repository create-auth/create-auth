import fs from 'fs-extra';
import path from 'path';

export default function CreateIVerificationStorage(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, '/IVerificationStorage .ts'),
    `import { IVerificationSession } from "../model/IVerificationSession";

export interface IVerificationStorage {
    saveSession(sessionId: string, session: IVerificationSession, expirySeconds: number): Promise<void>;
    getSession(sessionId: string): Promise<IVerificationSession | null>;
    deleteSession(sessionId: string): Promise<void>;
    findSessionsByEmail(email: string): Promise<{sessionId: string, session: IVerificationSession}[]>;
    isAvailable(): Promise<boolean>;
  }`,
  );
}
