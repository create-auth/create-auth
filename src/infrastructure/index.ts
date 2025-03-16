import { mkdirSync } from 'fs';
import CreatePrismaClient from './CreatePrismaClient';
import CreateSchema from './CreateSchema';
import CreatePrismaUserRepository from './CreatePrismaUserRepository';

class CreateInfrastructure {
  private ProjectName: string;
  private AuthMethod: string[] = [];
  constructor(ProjectName: string) {
    this.ProjectName = ProjectName;
    mkdirSync(`${this.ProjectName}/src`, { recursive: true });
    mkdirSync(`${this.ProjectName}/src/infrastructure`, { recursive: true });
    mkdirSync(`${this.ProjectName}/src/infrastructure/prisma`, {
      recursive: true,
    });
    mkdirSync(
      `${this.ProjectName}/src/infrastructure/prisma/prismaRepositories`,
      { recursive: true },
    );
    CreatePrismaClient(`${this.ProjectName}/src/infrastructure/prisma`);
    CreatePrismaUserRepository(
      `${this.ProjectName}/src/infrastructure/prisma/prismaRepositories`,
    );
  }
  InitializeSchema = () => {
    if (this.AuthMethod.length === 0) {
      this.AuthMethod.push('email');
    }
    CreateSchema(
      `${this.ProjectName}/src/infrastructure/prisma`,
      this.AuthMethod,
    );
  };
  CreateEmail = () => {
    this.AuthMethod.push('email');
  };

  CreateGoogle = () => {
    this.AuthMethod.push('google');
  };
  CreateGitHub = () => {
    this.AuthMethod.push('github');
  };
  CreateFaceBook = () => {
    this.AuthMethod.push('facebook');
  };
}

export default CreateInfrastructure;
