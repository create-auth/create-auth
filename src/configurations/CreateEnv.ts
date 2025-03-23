import fs from 'fs-extra';
import path from 'path';

export default function CreateEnv(projectDir: string, AuthMethod: string[]) {
  let Auth = '';

  if (AuthMethod.includes('email')) {
    Auth +=
      'EMAIL_USER= /* ex: "email@gmail.com" */\n\
EMAIL_PASSWORD=/* Create a App Password from https://myaccount.google.com/apppasswords */\n\
REDIS_URL=/* ex: redis://localhost:6379 */\n\n';
  }
  if (AuthMethod.includes('google')) {
    Auth +=
      '/* Create OAuth Credentials From https://console.cloud.google.com/ */\n\
GOOGLE_CLIENT_ID=\n\
GOOGLE_CLIENT_SECRET=\n\
GOOGLE_CALLBACK_URL=/* ex: https://localhost:3443/api/v1/social/google/callback */\n\n';
  }

  if (AuthMethod.includes('github')) {
    Auth +=
      '/* Register a New OAuth App From https://github.com/settings/developers */\n\
GITHUB_CLIENT_ID=\n\
GITHUB_CLIENT_SECRET=\n\
GITHUB_CALLBACK_URL=/* ex: https://localhost:3443/api/v1/social/github/callback */\n\n';
  }

  if (AuthMethod.includes('facebook')) {
    Auth +=
      '/* Create a New App From https://developers.facebook.com/ */\n\
FACEBOOK_CLIENT_ID=\n\
FACEBOOK_CLIENT_SECRET=\n\
FACEBOOK_CALLBACK_URL=/* ex: https://localhost:3443/api/v1/social/facebook/callback */';
  }

  fs.writeFileSync(
    path.join(projectDir, '.env'),
    `DATABASE_URL="file:./dev.db"
PORT=3443


ACCESS_TOKEN_SECRET= /* You can Use this command to create SECRET */ /* node -e "console.log(require('crypto').createHash('sha512').update('your_input_string').digest('hex'))" */
REFRESH_TOKEN_SECRET= /* You can Use this command to create SECRET */ /* node -e "console.log(require('crypto').createHash('sha512').update('your_input_string').digest('hex'))" */

CLIENT_URL_SECURE= /* Find a way to make your clint server https */ /* ex: https://localhost:5173 */
CLIENT_URL= /* ex: http://localhost:5173 */

REDIRECT_URL_ON_SUCCESS= /* ex: https://localhost:5173/ */
REDIRECT_URL_ON_FAIL= /* ex: https://localhost:5173/login */

SESSION_SECRET= /* You can Use this command to create SECRET */ /* node -e "console.log(require('crypto').createHash('sha512').update('your_input_string').digest('hex'))" */

${Auth}`,
  );
}
