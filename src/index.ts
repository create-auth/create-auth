
import cliQuestions from "./cli";
import CreateGinIndex from "./presentation/Create.G.index";
import CreataPresentation from "./presentation";

async function main() {
    const { projectName, framework } = await cliQuestions();
    /* const schema = parseSchema(schemaPath) || {
      Product: { id: 'string', name: 'string', price: 'int' },
    };
  
    await createProject(projectName, framework, orm, schema, structure); */
    const creataPresentation =  new CreataPresentation(projectName);
    creataPresentation.CreateEmail();
    creataPresentation.CreateGoogle();
    creataPresentation.CreateGitHub();
    creataPresentation.CreateFaceBook();
    console.log('Project Name:', projectName);
    console.log('Framework:', framework);
    for (const f of framework) {
      console.log(f);
    }
  }
  main();