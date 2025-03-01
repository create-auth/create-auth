import { mkdirSync } from "fs";
import CreatePrismaClient from "./CreatePrismaClient";
import CreateSchema from "./CreateSchema";
import CreatePrismaUserRepository from "./CreatePrismaUserRepository";


class CreateInfrastructure {
    private ProjectName: string;
    constructor(ProjectName: string) {
        this.ProjectName = ProjectName;
        mkdirSync(`${this.ProjectName}/src`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/infrastructure`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/infrastructure/prisma`, { recursive: true });
        mkdirSync(`${this.ProjectName}/src/infrastructure/prisma/prismaRepositories`, { recursive: true });
        CreatePrismaClient(`${this.ProjectName}/src/infrastructure/prisma`);
        CreateSchema(`${this.ProjectName}/src/infrastructure/prisma`);
        CreatePrismaUserRepository(`${this.ProjectName}/src/infrastructure/prisma/prismaRepositories`);
    };
};

export default CreateInfrastructure;