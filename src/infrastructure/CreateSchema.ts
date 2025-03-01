import fs from 'fs-extra';
import path from 'path';

export default function CreateSchema(projectDir: string) {
    fs.writeFileSync(
        path.join(projectDir, '/schema.prisma'),
        `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id    String @id
  name  String
  price Int
}

enum AuthProvider {
  EMAIL
  GOOGLE
  GITHUB
  FACEBOOK
}

model User {
  id           String  @id @default(uuid())
  providerId   String? @unique
  name         String
  email        String?  @unique
  photo        String?
  password     String?
  refreshToken String?
  provider     AuthProvider @default(EMAIL)
  verified      Boolean     @default(false)
}`)
}