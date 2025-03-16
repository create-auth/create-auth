import { mkdirSync } from 'fs';
import CreateGinIndex from './Create.G.index';
import CreateAuthentication from './CreateAuth';
import CreateVerify from './CreateVerify';
import CreateGoogle from './CreateGoogle';
import CreateGitHub from './CreateGitHub';
import CreateFaceBook from './CreateFaceBook';
import appendAuthProvider from './AppendAuthOnIndex';
import CreateRouteIndex from './CreateRouteIndex';
import CreateIndex from './CreateIndex';

class CreatePresentation {
  private ProjectName: string;
  private AuthMethod: string[] = [];
  constructor(ProjectName: string) {
    this.ProjectName = ProjectName;
    mkdirSync(`${this.ProjectName}/src`, { recursive: true });
    CreateIndex(`${this.ProjectName}/src`);
    mkdirSync(`${this.ProjectName}/src/presentation`, { recursive: true });
    mkdirSync(`${this.ProjectName}/src/presentation/api`, { recursive: true });
  }
  InitializeIndex = () => {
    CreateGinIndex(`${this.ProjectName}/src/presentation`, this.AuthMethod);
    CreateRouteIndex(
      `${this.ProjectName}/src/presentation/api`,
      this.AuthMethod,
    );
  };
  CreateEmail = () => {
    this.AuthMethod.push('email');
    mkdirSync(`${this.ProjectName}/src/presentation/api/Auth`, {
      recursive: true,
    });
    mkdirSync(`${this.ProjectName}/src/presentation/api/Auth/Verify`, {
      recursive: true,
    });
    CreateAuthentication(`${this.ProjectName}/src/presentation/api/Auth`);
    CreateVerify(`${this.ProjectName}/src/presentation/api/Auth/Verify`);
  };

  CreateGoogle = () => {
    this.AuthMethod.push('google');
    mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders`, {
      recursive: true,
    });
    appendAuthProvider(
      `${this.ProjectName}/src/presentation/api/socialProviders/index.ts`,
      'Google',
    );
    mkdirSync(
      `${this.ProjectName}/src/presentation/api/socialProviders/Google`,
      { recursive: true },
    );
    CreateGoogle(
      `${this.ProjectName}/src/presentation/api/socialProviders/Google`,
    );
  };
  CreateGitHub = () => {
    this.AuthMethod.push('github');
    mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders`, {
      recursive: true,
    });
    appendAuthProvider(
      `${this.ProjectName}/src/presentation/api/socialProviders/index.ts`,
      'GitHub',
    );
    mkdirSync(
      `${this.ProjectName}/src/presentation/api/socialProviders/GitHub`,
      { recursive: true },
    );
    CreateGitHub(
      `${this.ProjectName}/src/presentation/api/socialProviders/GitHub`,
    );
  };
  CreateFaceBook = () => {
    this.AuthMethod.push('facebook');
    mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders`, {
      recursive: true,
    });
    appendAuthProvider(
      `${this.ProjectName}/src/presentation/api/socialProviders/index.ts`,
      'FaceBook',
    );
    mkdirSync(
      `${this.ProjectName}/src/presentation/api/socialProviders/FaceBook`,
      { recursive: true },
    );
    CreateFaceBook(
      `${this.ProjectName}/src/presentation/api/socialProviders/FaceBook`,
    );
  };
}

export default CreatePresentation;
