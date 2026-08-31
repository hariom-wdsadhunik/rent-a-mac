import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'rent-a-mac-super-secret-jwt-key-change-in-prod-12345'
);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(req?: NextRequest): Promise<SessionPayload> {
  let token: string | undefined;
  
  if (req) {
    token = req.cookies.get('auth_token')?.value;
  } else {
    token = cookies().get('auth_token')?.value;
  }

  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  const session = await verifyToken(token);
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }

  return session;
}

export async function requireAdmin(req?: NextRequest): Promise<SessionPayload> {
  const session = await requireAuth(req);
  if (session.role !== 'ADMIN') {
    throw new Error('FORBIDDEN_ADMIN_ONLY');
  }
  return session;
}
