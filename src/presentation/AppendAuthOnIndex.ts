import { readFileSync, writeFileSync, existsSync } from "fs";
import CreatSocialIndex from "./CreatSocialIndex";

export default function appendAuthProvider(filePath: string, provider: "Google" | "GitHub" | "FaceBook") {
    if (!existsSync(filePath)) {
        console.error("File does not exist:", filePath);
        CreatSocialIndex(filePath.split("/index.ts")[0]);
    }

    // Read existing file content
    let fileContent = readFileSync(filePath, "utf8");

    // Define import and router usage lines
    const importLine = `import ${provider} from './${provider}';`;
    const routeLine = `router.use('/${provider.toLowerCase()}', ${provider});`;

    // Check if the provider is already added
    if (fileContent.includes(importLine) || fileContent.includes(routeLine)) {
        console.log(`${provider} is already added.`);
        return;
    }

    // Find the correct place to insert the import (before "const router = express.Router();")
    const importInsertIndex = fileContent.indexOf("const router = express.Router();");
    if (importInsertIndex !== -1) {
        fileContent = fileContent.slice(0, importInsertIndex) + importLine + "\n" + fileContent.slice(importInsertIndex);
    }

    // Find where to insert the router line (before "export default router;")
    const exportIndex = fileContent.indexOf("export default router;");
    if (exportIndex !== -1) {
        fileContent = fileContent.slice(0, exportIndex) + routeLine + "\n" + fileContent.slice(exportIndex);
    }

    // Write the updated content back to the file
    writeFileSync(filePath, fileContent, "utf8");

    console.log(`${provider} added successfully.`);
}