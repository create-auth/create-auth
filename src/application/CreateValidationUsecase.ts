import fs from 'fs-extra';
import path from 'path';

export default function CreateValidationUsecase(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, '/validationUsecase.ts'),
    `import { IVerificationSession } from "../../domain/model/IVerificationSession";
import { IVerificationStorage } from "../../domain/repository/IVerificationStorage ";
import APIError from "../Errors/APIError";
import { StorageFactory } from "./StorageFactory";
import EmailTemplate from "../../../public/template/emailTemplate";
import nodemailer from 'nodemailer';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

class ValidationUseCase {
  private static MAX_ATTEMPTS = 3;
  private storage: IVerificationStorage;

  constructor(storage?: IVerificationStorage) {
    this.storage = storage || StorageFactory.createStorage();
  }

  static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async createVerificationSession(email: string): Promise<string> {
    const isAvailable = await this.storage.isAvailable();
    if (!isAvailable) {
      throw new APIError('Storage service is not available', 500);
    }

    const code = ValidationUseCase.generateVerificationCode();
    const sessionId = uuid();

    const session: IVerificationSession = {
      email,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
      attempts: 0
    };

    try {
      await this.storage.saveSession(sessionId, session, 300); // 5 minutes in seconds
      return code;
    } catch (error) {
      throw new APIError(\`Failed to create verification session: \${error}\`, 500);
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      const code = await this.createVerificationSession(email);
      await transporter.sendMail({
        from: \`"Auth" <\${process.env.EMAIL_USER}>\`,
        to: email,
        subject: 'Login Verification Code',
        html: EmailTemplate(code, new Date()),
      });
    } catch (error) {
      throw new APIError(\`Failed to send verification email: \${error}\`, 400);
    }
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const sessions = await this.storage.findSessionsByEmail(email);
      
      if (sessions.length === 0) {
        throw new APIError('No active verification session found', 404);
      }

      for (const { sessionId, session } of sessions) {
        if (new Date(session.expiresAt) < new Date()) {
          await this.storage.deleteSession(sessionId);
          continue;
        }

        const attempts = session.attempts || 0;
        if (attempts >= ValidationUseCase.MAX_ATTEMPTS) {
          await this.storage.deleteSession(sessionId);
          throw new APIError('Too many failed attempts. Please request a new code.', 401);
        }

        if (session.code !== code) {
          session.attempts = attempts + 1;
          await this.storage.saveSession(
            sessionId,
            session,
            Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
          );
          throw new APIError(\`Invalid code. \${ValidationUseCase.MAX_ATTEMPTS - session.attempts} attempts remaining.\`, 401);
        }

        await this.storage.deleteSession(sessionId);
        return true;
      }

      throw new APIError('No valid verification session found', 404);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(\`Verification failed: \${error}\`, 500);
    }
  }
}

export default ValidationUseCase;`,
  );
  fs.writeFileSync(
    path.join(projectDir, '/StorageFactory.ts'),
    `import { IVerificationStorage } from "../../domain/repository/IVerificationStorage ";
import { InMemoryVerificationStorage } from "./InMemoryVerificationStorage";
import { RedisVerificationStorage } from "./RedisVerificationStorage";
import dotenv from 'dotenv';

dotenv.config();

export class StorageFactory {
    static createStorage(): IVerificationStorage {
      if (process.env.REDIS_URL) {
        try {
          const redisStorage = new RedisVerificationStorage(process.env.REDIS_URL);
          return redisStorage;
        } catch (error) {
          console.warn(\`Failed to initialize Redis storage: \${error}. Falling back to in-memory storage.\`);
        }
      }
      return new InMemoryVerificationStorage();
    }
  }`,
  );
  fs.writeFileSync(
    path.join(projectDir, '/RedisVerificationStorage.ts'),
    `import Redis from "ioredis";
import { IVerificationStorage } from "../../domain/repository/IVerificationStorage ";
import { IVerificationSession } from "../../domain/model/IVerificationSession";
import APIError from "../../application/Errors/APIError";

export class RedisVerificationStorage implements IVerificationStorage {
    private redis: Redis;
  
    constructor(redisUrl: string) {
      this.redis = new Redis(redisUrl, { keepAlive: 10000 });
    }
  
    async isAvailable(): Promise<boolean> {
      try {
        await this.redis.ping();
        return true;
      } catch (error) {
        return false;
      }
    }
  
    async saveSession(sessionId: string, session: IVerificationSession, expirySeconds: number): Promise<void> {
      try {
        await this.redis.setex(
          \`verification:\${sessionId}\`,
          expirySeconds,
          JSON.stringify(session),
        );
      } catch (error) {
        throw new APIError(\`Failed to save session: \${error}\`, 500);
      }
    }
  
    async getSession(sessionId: string): Promise<IVerificationSession | null> {
      try {
        const data = await this.redis.get(\`verification:\${sessionId}\`);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        throw new APIError(\`Failed to get session: \${error}\`, 500);
      }
    }
  
    async deleteSession(sessionId: string): Promise<void> {
      try {
        await this.redis.del(\`verification:\${sessionId}\`);
      } catch (error) {
        throw new APIError(\`Failed to delete session: \${error}\`, 500);
      }
    }
  
    async findSessionsByEmail(email: string): Promise<{sessionId: string, session: IVerificationSession}[]> {
      try {
        const keys = await this.redis.keys('verification:*');
        const results: {sessionId: string, session: IVerificationSession}[] = [];
  
        for (const key of keys) {
          const data = await this.redis.get(key);
          if (!data) continue;
  
          const session = JSON.parse(data) as IVerificationSession;
          if (session.email === email) {
            const sessionId = key.replace('verification:', '');
            results.push({ sessionId, session });
          }
        }
  
        return results;
      } catch (error) {
        throw new APIError(\`Failed to find sessions: \${error}\`, 500);
      }
    }
  }`,
  );
  fs.writeFileSync(
    path.join(projectDir, '/InMemoryVerificationStorage.ts'),
    `import { IVerificationSession } from "../../domain/model/IVerificationSession";
import { IVerificationStorage } from "../../domain/repository/IVerificationStorage ";

export class InMemoryVerificationStorage implements IVerificationStorage {
    private sessions: Map<string, { session: IVerificationSession, expiresAt: number }> = new Map();
  
    async isAvailable(): Promise<boolean> {
      return true;
    }
  
    async saveSession(sessionId: string, session: IVerificationSession, expirySeconds: number): Promise<void> {
      const expiresAt = Date.now() + expirySeconds * 1000;
      this.sessions.set(\`verification:\${sessionId}\`, { session, expiresAt });
      
      setTimeout(() => {
        this.sessions.delete(\`verification:\${sessionId}\`);
      }, expirySeconds * 1000);
    }
  
    async getSession(sessionId: string): Promise<IVerificationSession | null> {
      const data = this.sessions.get(\`verification:\${sessionId}\`);
      if (!data) return null;
      
      if (data.expiresAt < Date.now()) {
        this.sessions.delete(\`verification:\${sessionId}\`);
        return null;
      }
      
      return data.session;
    }
  
    async deleteSession(sessionId: string): Promise<void> {
      this.sessions.delete(\`verification:\${sessionId}\`);
    }
  
    async findSessionsByEmail(email: string): Promise<{sessionId: string, session: IVerificationSession}[]> {
      const results: {sessionId: string, session: IVerificationSession}[] = [];
      const now = Date.now();
      
      this.sessions.forEach((data, key) => {
        if (data.expiresAt < now) {
          this.sessions.delete(key);
          return;
        }
        
        if (data.session.email === email) {
          const sessionId = key.replace('verification:', '');
          results.push({ sessionId, session: data.session });
        }
      });
      
      return results;
    }
  }
  
  `,
  );
}
