import { input, checkbox } from '@inquirer/prompts';
import { authmethod } from './choices';

export default async function cliQuestions() {
  let projectName = '';

  while (!projectName) {
    projectName = await input({
      message: 'Enter project name',
      required: true,
      validate: (value) => {
        if (!value.trim()) {
          return 'Project name cannot be empty';
        }
        if (value.length < 3) {
          return 'Project name must be at least 3 characters long';
        }
        return true;
      },
    });
  }

  const method = await checkbox({
    message:
      'Select Authentication Options you need (use space to select multiple)',
    choices: authmethod,
    required: true,
  });

  return {
    projectName,
    method,
  };
}
