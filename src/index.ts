#! /usr/bin/env node

import cliQuestions from './cli';
import ChooseAuthMethod from './cli/ChooseAuthMethod';

async function main() {
  const { projectName, method } = await cliQuestions();
  ChooseAuthMethod(method, projectName);
  console.log('Project Name:', projectName);
  console.log('Selected Methods:', method);
}
main();
