import { mkdirSync } from "fs";
import CreateIUser from "./CreateIUser";
import CreateuserRepository from "./CreateuserRepository";
import CreateIVerificationSession from "./CreateIVerificationSession";
import CreateIVerificationStorage from "./CreateIVerificationStorage";

class CreateDomain {
  private ProjectName: string;
  constructor(ProjectName: string) {
    this.ProjectName = ProjectName;
    mkdirSync(`${this.ProjectName}/src`, { recursive: true });
    mkdirSync(`${this.ProjectName}/src/domain`, { recursive: true });
    mkdirSync(`${this.ProjectName}/src/domain/model`, { recursive: true });
    mkdirSync(`${this.ProjectName}/src/domain/repository`, { recursive: true });
    CreateIUser(`${this.ProjectName}/src/domain/model`);
    CreateuserRepository(`${this.ProjectName}/src/domain/repository`);
  }
  CreateEmail = () => {
    CreateIVerificationSession(`${this.ProjectName}/src/domain/model`);
    CreateIVerificationStorage(`${this.ProjectName}/src/domain/repository`);
  };
}

export default CreateDomain;
