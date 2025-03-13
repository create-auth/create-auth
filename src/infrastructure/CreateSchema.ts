import fs from "fs-extra";
import path from "path";

export default function CreateSchema(projectDir: string, AuthMethod: string[]) {
  const authProviderEnum = AuthMethod.map((method) =>
    method.toUpperCase(),
  ).join("\n  ");

  if (!AuthMethod || AuthMethod.length === 0) {
    AuthMethod = ["EMAIL"];
  }
  fs.writeFileSync(
    path.join(projectDir, "/schema.prisma"),
    `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum AuthProvider {
  ${authProviderEnum}
}

model User {
  id           String  @id @default(uuid())
  providerId   String? @unique
  name         String
  email        String?  @unique
  photo        String?
  password     String?
  refreshToken String?
  provider     AuthProvider @default(${AuthMethod[0].toUpperCase()})
  verified      Boolean     @default(false)
}`,
  );
}
