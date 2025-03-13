import { spawn } from "child_process";

export default function setupProject(projectName: string, AuthMethod: string[]) {
  const dependencies = [
    "@prisma/client@^6.3.1",
    "cookie-parser@^1.4.6",
    "cors@^2.8.5",
    "dotenv@^16.4.5",
    "express@^4.19.2",
    "express-session@^1.18.1",
    "inquirer@^12.4.2",
    "uuid@^11.0.5",
  ];

  const devDependencies = [
    "@inquirer/prompts@^7.3.2",
    "@types/bcrypt@^5.0.2",
    "@types/cookie-parser@^1.4.8",
    "@types/cors@^2.8.17",
    "@types/express@^4.17.21",
    "@types/jsonwebtoken@^9.0.8",
    "@types/node@^20.14.10",
    "@types/uuid@^10.0.0",
    "@types/validator@^13.12.2",
    "@typescript-eslint/eslint-plugin@^7.18.0",
    "@typescript-eslint/parser@^7.18.0",
    "bcrypt@^5.1.1",
    "eslint@^8.57.0",
    "eslint-config-airbnb-typescript@^18.0.0",
    "eslint-import-resolver-typescript@^3.6.1",
    "eslint-plugin-import@^2.29.1",
    "jsonwebtoken@^9.0.2",
    "nodemon@^3.1.4",
    "prisma@^6.3.1",
    "ts-node@^10.9.2",
    "typescript@^5.7.3",
    "validator@^13.12.0",
  ];

  let passportAdded = false;

  for (const method of AuthMethod) {
    if (method === "email") {
      dependencies.push("nodemailer@^6.10.0", "ioredis@^5.5.0");
      devDependencies.push("@types/ioredis@^4.28.10", "@types/nodemailer@^6.4.17");
    }
    if (method === "google") {
      if (!passportAdded) {
        dependencies.push("passport");
        devDependencies.push("@types/passport");
        passportAdded = true;
      }
      dependencies.push("passport-google-oauth20");
      devDependencies.push("@types/passport-google-oauth20");
    }
    if (method === "github") {
      if (!passportAdded) {
        dependencies.push("passport");
        devDependencies.push("@types/passport");
        passportAdded = true;
      }
      dependencies.push("passport-github2");
      devDependencies.push("@types/passport-github2");
    }
    if (method === "facebook") {
      if (!passportAdded) {
        dependencies.push("passport");
        devDependencies.push("@types/passport");
        passportAdded = true;
      }
      dependencies.push("passport-facebook");
      devDependencies.push("@types/passport-facebook");
    }
  }

  return new Promise((resolve, reject) => {
    const command = `
      cd ${projectName} &&
      npm install ${dependencies.join(" ")} --legacy-peer-deps &&
      npm install -D ${devDependencies.join(" ")} --legacy-peer-deps &&
      npx prisma generate --schema=src/infrastructure/prisma/schema.prisma &&
      npx prisma db push --schema=src/infrastructure/prisma/schema.prisma
    `;

    const p = spawn("sh", ["-c", command], { stdio: "inherit" });

    p.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Project setup completed successfully.");
        resolve("done");
      } else {
        console.error(`❌ Process failed with code ${code}`);
        reject(new Error(`Process failed with code ${code}`));
      }
    });

    p.on("error", (err) => {
      console.error("❌ Error occurred:", err);
      reject(err);
    });
  });
}
