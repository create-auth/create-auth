import CreatePresentation from '../presentation';
import CreateApplication from '../application';
import CreateDomain from '../domain';
import CreateInfrastructure from '../infrastructure';

export default function ChooseFrameworks(frameworks: string[], projectName: string) {
    const createPresentation = new CreatePresentation(projectName);
    const createApplication = new CreateApplication(projectName);
    new CreateDomain(projectName);
    new CreateInfrastructure(projectName);
    for (const framework of frameworks) {
        switch (framework) {
            case 'email':
                createApplication.CreateEmail();
                createPresentation.CreateEmail();
                break;
            case 'google':
                createPresentation.CreateGoogle();
                break;
            case 'github':
                createPresentation.CreateGitHub();
                break;
            case 'facebook':
                createPresentation.CreateFaceBook();
                break;
        }
    }
}