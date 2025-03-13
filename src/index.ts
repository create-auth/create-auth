#! /usr/bin/env node

import cliQuestions from "./cli";
import ChooseAuthMethod from "./cli/ChooseAuthMethod";

async function main() {
  const { projectName, framework } = await cliQuestions();
  ChooseAuthMethod(framework, projectName);
  console.log("Project Name:", projectName);
  console.log("Framework:", framework);
}
main();
