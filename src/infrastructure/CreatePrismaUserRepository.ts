import fs from 'fs-extra';
import path from 'path';

export default function CreatePrismaUserRepository(projectDir: string) {
    fs.writeFileSync(
        path.join(projectDir, '/PrismaUserRepository.ts'),
        `import IUserRepository from '../../../domain/repository/userRepository';
import IUser from '../../../domain/model/IUser';
import prisma from '../../prisma/PrismaClient';
import bcrypt from 'bcrypt';

class PrismaUserRepository implements IUserRepository {
  async create(data: any): Promise<any> {
    const user = await prisma.user.create({ data });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async get(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }
  async getByProviderId(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { providerId: id } });
    return user;
  }
  async getByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  async update(id: string, data: any): Promise<IUser> {
    const user = await prisma.user.update({ where: { id }, data });
    return user;
  }

  async delete(id: string): Promise<IUser> {
    const user = await prisma.user.delete({ where: { id } });
    return user;
  }
  async getrefreshToken(userId: string, refreshToken: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) return null;
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    return isMatch ? user : null;
  }
  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    refreshToken = await bcrypt.hash(refreshToken, salt);
    await prisma.user.update({ where: { id: userId }, data: { refreshToken } });
  }
  async deleteRefreshToken(userId: string): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }
  async verifyEmail(email: string): Promise<IUser | void> {
    await prisma.user.update({ where: { email }, data: { verified: true } });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;
    return user;
  }
}

export default PrismaUserRepository;

`)
}