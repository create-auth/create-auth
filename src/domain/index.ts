import { mkdirSync } from "fs";
import CreateIUser from "./CreateIUser";
import CreateuserRepository from "./CreateuserRepository";


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
    };
};

export default CreateDomain;