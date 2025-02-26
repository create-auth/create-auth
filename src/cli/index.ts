import { select, input, checkbox } from '@inquirer/prompts';
import { authmethod } from './choices';

export default async function cliQuestions() {
  const projectName = await input({ message: 'Enter project name' });

  const framework = await checkbox({
    message: 'Select Authentication Options you need (use space to select multiple)',
    choices: authmethod,
  });

  return {
    projectName,
    framework,
  };
}