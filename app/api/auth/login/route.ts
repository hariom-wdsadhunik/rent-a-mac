import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid login credentials format' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    let user = await db.user.findUnique({
      where: { email },
    });

    // Auto-create default admin if logging in with env initial admin credentials and DB is unseeded
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rent-a-mac.com';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminPassword123!';

    if (!user && email === adminEmail && password === adminPassword) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      user = await db.user.create({
        data: {
          email: adminEmail,
          name: 'System Admin',
          passwordHash,
          role: 'ADMIN',
          company: 'Rent-a-Mac',
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Sign JWT Session Token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'USER' | 'ADMIN',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-Only Cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
