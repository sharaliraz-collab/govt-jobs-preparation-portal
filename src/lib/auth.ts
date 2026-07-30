import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'govt_jobs_secret_key_super_secure_123!';

export function generateToken(id: string, role: string) {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d'
  });
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(enteredPassword: string, hashedPassword: string) {
  return bcrypt.compare(enteredPassword, hashedPassword);
}

export async function getAuthUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) return null;

    return {
      ...user,
      _id: user.id,
    };
  } catch (error) {
    return null;
  }
}
