import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = '1d';

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    user,
    token,
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
};
