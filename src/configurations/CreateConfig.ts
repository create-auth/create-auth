import fs from 'fs-extra';
import path from 'path';

export default function CreateConfig(projectDir: string) {
  fs.writeFileSync(
    path.join(projectDir, '.eslintrc.json'),
    `{
  "root": true,
  "env": {
    "jest": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": [
      "./tsconfig.json"
    ]
  },
  "extends": "airbnb-typescript/base",
  "plugins": [
    "import",
    "@typescript-eslint"
  ],
  "rules": {
    "comma-dangle": 0,
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "no-return-assign": 0,
    "camelcase": 0,
    "import/extensions": 0,
    "@typescript-eslint/no-redeclare": 0
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts",
        ".tsx"
      ]
    },
    "import/resolver": {
      "typescript": {}
    }
  }
}`,
  );
  fs.writeFileSync(
    path.join(projectDir, '.prettierrc'),
    `{
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all"
}
    `,
  );
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    `{
  "name": "auth",
  "version": "1.0.0",
  "description": "A basic starter for Authentication with Typescript",
  "main": "src/index.ts",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start:dist": "node dist/src/index.js",
    "lint": "eslint --fix src",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [],
  "license": "MIT"
}
`,
  );

  fs.writeFileSync(
    path.join(projectDir, 'README.md'),
    `# Auth
`,
  );
  fs.writeFileSync(
    path.join(projectDir, 'tsconfig.json'),
    `{
  "compilerOptions": {
    "outDir": "dist",
    "sourceMap": true,
    "target": "esnext",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "./*.js",
    "./*.ts",
    "src/**/*.ts",
    "test/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
`,
  );
  fs.writeFileSync(
    path.join(projectDir, 'server.cert'),
    `-----BEGIN CERTIFICATE-----
MIIDbzCCAlegAwIBAgIUDtWghjfJVUBWimVgnQl1T5PtpcYwDQYJKoZIhvcNAQEL
BQAwRzELMAkGA1UEBhMCVVMxFDASBgNVBAgMC0xvc19hbmdsb3NlMRQwEgYDVQQH
DAtsb3NfYW5nb2xzZTEMMAoGA1UECgwDbG9zMB4XDTI1MDIxOTE1NDEzOFoXDTI1
MDMyMTE1NDEzOFowRzELMAkGA1UEBhMCVVMxFDASBgNVBAgMC0xvc19hbmdsb3Nl
MRQwEgYDVQQHDAtsb3NfYW5nb2xzZTEMMAoGA1UECgwDbG9zMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEAurjmetgdXQwg4rdIl6BzhgOkKrJ2qcn+/x7B
PKnnGxmcZUOXUZqg7VsnXjpO9kPVebR5ttIj8jOG8U+3Srzvwj++nVxew4ijbrtZ
7VukeZEQ86TBVnAp7AtnIemZC8OVwaHtAKZvMvUEmazSR0Xn9bt3pUn/sVmmG7h5
E0lYJolS37VOJCBu/Dxf+iIkpQ7DSh2dV+2OoZ+ILUpjmLchD7iXUk7j1r8aiyPJ
Jl9wwQEWYzQCtiPMKAzNxAY8nigA1YZK+f7hhA5IE/996TvqkUtWiOl9IhpZ7FEv
2Y6oCRjPW73O6sg6oCKciGRyQe7jk0eH9shshwt00dZPNU/fuwIDAQABo1MwUTAd
BgNVHQ4EFgQUA516wGioNHWAOkv4RuPCMLsPYZwwHwYDVR0jBBgwFoAUA516wGio
NHWAOkv4RuPCMLsPYZwwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOC
AQEAGhxHYUWt3euFJCCE/XpbTIA7gqE/klmnBPGzPOCTC6jCJ2t6+yHXFeH4xwVn
nDyR49ZFK9evd47zoafTB7goCmHuu8+gyMGljs3uL+GsIDnh4/UCtqwg5rfdQBfv
nvbw2w2bvanCJqMOzzT5PehX/r8xQ0H/XJcZ9fFPkE4W5HYzwNgcHXDoSqkasBlT
sb5d7qima9t0xP8XmngPdOGKispqk1NOOe3c+88j1UA+bw2oGWyM0SYGv1HyR9TK
w6QBB/ZA9JybLMZ9gCJWgRHQir6u2PC2EdX5cUaDJxSMuMprqqFCQrOd1BNRZp8r
BT0n4VwFTIU3mhr9aTUHtB2Azw==
-----END CERTIFICATE-----
`,
  );
  fs.writeFileSync(
    path.join(projectDir, 'server.key'),
    `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6uOZ62B1dDCDi
t0iXoHOGA6Qqsnapyf7/HsE8qecbGZxlQ5dRmqDtWydeOk72Q9V5tHm20iPyM4bx
T7dKvO/CP76dXF7DiKNuu1ntW6R5kRDzpMFWcCnsC2ch6ZkLw5XBoe0Apm8y9QSZ
rNJHRef1u3elSf+xWaYbuHkTSVgmiVLftU4kIG78PF/6IiSlDsNKHZ1X7Y6hn4gt
SmOYtyEPuJdSTuPWvxqLI8kmX3DBARZjNAK2I8woDM3EBjyeKADVhkr5/uGEDkgT
/33pO+qRS1aI6X0iGlnsUS/ZjqgJGM9bvc7qyDqgIpyIZHJB7uOTR4f2yGyHC3TR
1k81T9+7AgMBAAECggEAANvn54nF/M8Y+aIJOfVZgrTSlQW0KQzOWQMdtXc8onHI
N+kLMatp8R2ZvUO8aEKgoUo0wyQNWUhmZwbMW5Ip8jVT3ap2nySqR9Ch1cc1pv+F
WfGYmBq0/qqAw3WtKBIyxqzFh9q8KTpaVpCmeQB31DgUEVUZUYoNixQarn2IY8j8
7oDumuJjvHu5+FwWoicksjt+krVqsOvXYaj/mAO/w0zWR6oRX5FWqqnLPZ9RsCHb
W9+vkHCdn1e5/KfC6LUHJXpJpaPhAJspfbIX/AAW5k3W6ctkx99XtpEHd+FmG0Si
f8EQj8XkYF4DJ6KlgrYXPFh7amXsh+4FnJm3KdWJDQKBgQDlrmy+YHt/+7j14jEc
5FyYc7SYG6i/4QZYqlKBciXl8qjC/Bb2AlWZ5U2N6I0C4Sa1dipCE5RhhDkFskN6
XTJ9uCR0bxksqr9wk8VzhkJDXg6X356fanjfg4zZTTQlAqX3ijfOJQo5byiBcohO
UB9gis56uqv9AEeoX+xnlq3DjQKBgQDQHktw7a2/Iu7dEl9q5B9nOnDT0N4nMeyQ
Tm1ENY9MDbGDP2wdsCVgYYTM7mGpWhVl0xpcwqw7jQe4diq3qrlZ7eOkgfW31Vjy
yt/iZk8SRpAyBgHH1vE4Qe19QivSspvMBomOSIqCCFCxrFEwzTa4lGMtmhJOiURm
c1WDz0l6ZwKBgGKS9KrUP8zS3TPySv/KZo8rgYOSw17ulcmx980Ej41cEt/0T2pv
4As3pYxVFUf6F6HjwAkx3AnqNIrkUh+PJh9cy5CJKfXIpncLhL+rDH9bO8okuDBV
AuFy1R1iDBIiS9aspHy92uCBe5Hq9OMfcgf+KtXzjeL8nsR9vrlKqvL1AoGAJ0dg
c6rYHPfp3x2FlrYBW0lDXCbSltEsVbwHkVUOe4smEqBYtm21UDB3kPn4wq621SX3
lsRDH2Ypq93ZiBqXqupkCXthtdV1WTWC9cbba5aXxmkt0tq1YinHOdnQTY7aKrKd
KZZ1Vb9eA3qDRFOm3UVcRpIKnHn5x+BCpoLr2kcCgYEAgl/UfG4aAVSZCH2Oe9sg
AsL+611s09UEXEAbFuAaS2Xf7axbR+LfCCjiFU7GuSO1BDvbR/sMlKQCPqjHUbQ1
qJxx9U1w7V2znu3MvwgTjapnPKPFkqodjiVkDc+74U0ONpsw1OZUCqj8JTC5EVRS
w6WSX9E6T3LtY/Jjrqqowrk=
-----END PRIVATE KEY-----
`,
  );
}
