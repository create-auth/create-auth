
import cliQuestions from "./cli";
import ChooseFrameworks from "./cli/ChooseFrameworks";

async function main() {
    const { projectName, framework } = await cliQuestions();
    /* const schema = parseSchema(schemaPath) || {
      Product: { id: 'string', name: 'string', price: 'int' },
    };
  
    await createProject(projectName, framework, orm, schema, structure); */
    ChooseFrameworks(framework, projectName);
    console.log('Project Name:', projectName);
    console.log('Framework:', framework);
  }
  main();