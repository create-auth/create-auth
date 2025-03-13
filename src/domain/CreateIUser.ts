import fs from "fs-extra";
import path from "path";

export default function CreateIUser(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, "/IUser.ts"),
    `import { AuthProvider } from "@prisma/client";
interface IUser {
  id: string;
  providerId: string | null;
  name: string;
  email: string | null;
  password: string | null;
  refreshToken: string | null;
  provider: AuthProvider;
  verified: Boolean;
}

export default IUser;`,
  );
}
