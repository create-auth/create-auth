import fs from 'fs-extra';
import path from 'path';
import CreatePresentation from '../presentation';
import CreateApplication from '../application';

export default function ChooseFrameworks(frameworks: string[], projectName: string) {
    const createPresentation = new CreatePresentation(projectName);
    new CreateApplication(projectName);
    for (const framework of frameworks) {
        switch (framework) {
            case 'email':
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