import fs from 'fs-extra';
import path from 'path';

export default function CreateEnv(projectDir: string, AuthMethod: string[]) {
  let Auth = '';

  if (AuthMethod.includes('email')) {
    Auth +=
      'EMAIL_USER="authe795@gmail.com"\n\
EMAIL_PASSWORD="djjgoaqchjyqzlau"\n\n\
REDIS_URL=redis://localhost:6379\n\n';
  }
  if (AuthMethod.includes('google')) {
    Auth +=
      'GOOGLE_CLIENT_ID=772485631565-qa1kme52hkenpdm653pjv41nlsrubtnu.apps.googleusercontent.com\n\
GOOGLE_CLIENT_SECRET=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\n\
GOOGLE_CALLBACK_URL=https://localhost:3443/api/v1/social/google/callback\n\n';
  }

  if (AuthMethod.includes('github')) {
    Auth +=
      'GITHUB_CLIENT_ID=Ov23li07J8uIriUPWqhj\n\
GITHUB_CLIENT_SECRET=924a0e75ce670415dce1a198952b7d2a3f726248\n\
GITHUB_CALLBACK_URL=https://localhost:3443/api/v1/social/github/callback\n\n';
  }

  if (AuthMethod.includes('facebook')) {
    Auth +=
      'FACEBOOK_CLIENT_ID=959978976197408\n\
FACEBOOK_CLIENT_SECRET=46354998efe40526ac0293999240e17d\n\
FACEBOOK_CALLBACK_URL=https://localhost:3443/api/v1/social/facebook/callback';
  }

  fs.writeFileSync(
    path.join(projectDir, '.env'),
    `DATABASE_URL="file:./dev.db"
PORT=3443

NODE_ENV=development
CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=c091ac9c4b5e7b2ee7286ff143540163c6a74297ebc4b6fd02b28c170dec1e04ecc992beb5b9b86ad254bec9e962813b567312d9b9c78b41534573c5f4496308
REFRESH_TOKEN_SECRET=bb835fa6423018b8f883a1cce390637cc1259e784429bd8a348ae2ae94c58342461c73e00f82963b52d42910245732d9c8b78b667c23bf06ce422e487c48233e

REDIRECT_URL_ON_FAIL=http://localhost:5173/login
REDIRECT_URL_ON_SUCCESS=http://localhost:5173/

SESSION_SECRET=a3c2f10c4b6f8e9d0c1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v

${Auth}`,
  );
}
