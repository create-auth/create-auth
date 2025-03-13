import CreatePresentation from "../presentation";
import CreateApplication from "../application";
import CreateDomain from "../domain";
import CreateInfrastructure from "../infrastructure";
import CreatePublic from "../public";
import CreateConfigurations from "../configurations";

export default function ChooseAuthMethod(
  AuthMethod: string[],
  projectName: string,
) {
  const createPresentation = new CreatePresentation(projectName);
  const createApplication = new CreateApplication(projectName);
  const createDomain = new CreateDomain(projectName);
  const createInfrastructure = new CreateInfrastructure(projectName);
  const createConfigurations = new CreateConfigurations(projectName);
  for (const method of AuthMethod) {
    switch (method) {
      case "email":
        createApplication.CreateEmail();
        createPresentation.CreateEmail();
        createInfrastructure.CreateEmail();
        createConfigurations.CreateEmail();
        createDomain.CreateEmail();
        break;
      case "google":
        createPresentation.CreateGoogle();
        createInfrastructure.CreateGoogle();
        createConfigurations.CreateGoogle();
        break;
      case "github":
        createPresentation.CreateGitHub();
        createInfrastructure.CreateGitHub();
        createConfigurations.CreateGitHub();
        break;
      case "facebook":
        createPresentation.CreateFaceBook();
        createInfrastructure.CreateFaceBook();
        createConfigurations.CreateFaceBook();
        break;
    }
  }
  createPresentation.InitializeIndex();
  createInfrastructure.InitializeSchema();
  createConfigurations.InitializeIndex();
  CreatePublic(projectName);
}
