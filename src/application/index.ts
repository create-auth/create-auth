import { mkdirSync } from "fs";
import CreateApiError from "./CreateApiError";
import CreateJWTUsecase from "./CreateJWTUsecase";
import CreateUserUsecase from "./CreateUserUsecase";
import CreateValidationUsecase from "./CreateValidationUsecase";

class CreateApplication {
    private ProjectName: string;
    constructor(ProjectName: string) {
        this.ProjectName = ProjectName;
        mkdirSync(`${this.ProjectName}/src`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/application`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/application/Errors`, { recursive: true });
        CreateApiError(`${this.ProjectName}/src/application/Errors`);
        CreateJWTUsecase(`${this.ProjectName}/src/application`);
    };
    CreateEmail = () => {
        CreateUserUsecase(`${this.ProjectName}/src/application`);
        CreateValidationUsecase(`${this.ProjectName}/src/application`);
    }
};

export default CreateApplication;