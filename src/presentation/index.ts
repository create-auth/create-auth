import { mkdirSync } from "fs";
import CreateGinIndex from "./Create.G.index";
import CreateAuthentication from "./CreateAuth";
import CreateVerify from "./CreateVerify";
import CreateGoogle from "./CreateGoogle";
import CreateGitHub from "./CreateGitHub";
import CreateFaceBook from "./CreateFaceBook";
import appendAuthProvider from "./AppendAuthOnIndex";

class CreataPresentation {
    private ProjectName: string;
    constructor(ProjectName: string) {
        this.ProjectName = ProjectName;
        mkdirSync(`${this.ProjectName}/src`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/presentation`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/presentation/api`, { recursive: true });
    };
    CreateEmail = () => {
        mkdirSync(`${this.ProjectName}/src/presentation/api/Auth`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/presentation/api/Verify`, { recursive: true });
        CreateGinIndex(`${this.ProjectName}/src/presentation`);
        CreateAuthentication(`${this.ProjectName}/src/presentation/api/Auth`);
        CreateVerify(`${this.ProjectName}/src/presentation/api/Verify`);
    }
    
    CreateGoogle = () => {
        mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders`, { recursive: true });
        appendAuthProvider(`${this.ProjectName}/src/presentation/api/socialProviders/index.ts`, "Google");
        mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders/Google`, { recursive: true });
        CreateGoogle(`${this.ProjectName}/src/presentation/api/socialProviders/Google`);
    }
    CreateGitHub = () => {
        mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders`, { recursive: true });
        appendAuthProvider(`${this.ProjectName}/src/presentation/api/socialProviders/index.ts`, "GitHub");
        mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders/GitHub`, { recursive: true });
        CreateGitHub(`${this.ProjectName}/src/presentation/api/socialProviders/GitHub`);
    }
    CreateFaceBook = () => {
        mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders`, { recursive: true });
        appendAuthProvider(`${this.ProjectName}/src/presentation/api/socialProviders/index.ts`, "FaceBook");
        mkdirSync(`${this.ProjectName}/src/presentation/api/socialProviders/FaceBook`, { recursive: true });
        CreateFaceBook(`${this.ProjectName}/src/presentation/api/socialProviders/FaceBook`);
    }
};

export default CreataPresentation;