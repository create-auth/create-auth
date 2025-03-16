import CreateConfig from './CreateConfig';
import CreateEnv from './CreateEnv';
import InstallDependencies from './InstallDependencies';

class CreateConfigurations {
  private ProjectName: string;
  private AuthMethod: string[] = [];
  constructor(ProjectName: string) {
    this.ProjectName = ProjectName;
    CreateConfig(`${this.ProjectName}`);
  }
  InitializeIndex = () => {
    CreateEnv(`${this.ProjectName}`, this.AuthMethod);
    InstallDependencies(`${this.ProjectName}`, this.AuthMethod);
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

export default CreateConfigurations;
