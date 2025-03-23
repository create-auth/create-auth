import { mkdirSync } from 'fs';
import fs from 'fs-extra';
import path from 'path';

export default function CreatePublic(projectDir: string) {
  mkdirSync(`${projectDir}/public`, { recursive: true });
  mkdirSync(`${projectDir}/public/template`, { recursive: true });
  fs.writeFileSync(
    path.join(projectDir, '/public/template/emailTemplate.ts'),
    `export default function OceanBreezeTemplate(code: string, date: Date) {
  return \`
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background: linear-gradient(135deg, #cce5ff 0%, #99ccff 100%); border-radius: 16px;">
      <div style="background: white; padding: 35px; border-radius: 20px; box-shadow: 0 8px 20px rgba(0, 136, 255, 0.15);">
        <div style="text-align: center;">
          <h2 style="color: #007BFF; font-size: 26px; font-weight: 700; margin: 0 0 20px;">Verification Code</h2>
          <p style="color: #666; font-size: 16px; margin: 0 0 30px;">
            Enter this code to verify your account
          </p>
          <div style="background: linear-gradient(135deg, #e6f2ff 0%, #ccf2ff 100%); padding: 25px; border-radius: 15px; margin: 0 auto 30px;">
            <span style="font-size: 38px; font-weight: 800; color: #0056b3; letter-spacing: 6px;">\${code}</span>
          </div>
          <p style="color: #888; font-size: 14px;">
            Code expires in <strong>10 minutes</strong>
          </p>
          <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #cce5ff;">
            <p style="color: #bbb; font-size: 13px;">© \${date.getFullYear()} Create Authentication</p>
          </div>
        </div>
      </div>
    </div>
  \`;
}
`,
  );
}
