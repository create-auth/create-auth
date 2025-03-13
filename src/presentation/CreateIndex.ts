import fs from "fs-extra";
import path from "path";

export default function CreateIndex(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, "/index.ts"),
    `import main from './presentation';

main();
`,
  );
}
