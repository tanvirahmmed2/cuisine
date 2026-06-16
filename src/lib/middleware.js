import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const COOKIE_NAME = 'disibin';
const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}


export function buildSessionCookie(token) {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  return [
    `${COOKIE_NAME}=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    `SameSite=Lax`,
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

// -----------------------------------------------------------------------------
// CORE MIDDLEWARE PATTERN
// -----------------------------------------------------------------------------

export async function getAuthenticatedContext() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;

        if (!token) return null;

        const decoded = verifyToken(token);
        if (!decoded) return null;
        const userId = decoded.id || decoded._id || decoded.user_id;
        if (!userId) return null;

        const res = await query("SELECT user_id, name, email, role FROM ress_users WHERE user_id = $1", [userId]);

        if (res.rows.length === 0) return null;
        const user = res.rows[0];

        return {
            id: user.user_id,
            _id: user.user_id,
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            tenant_id: decoded.tenant_id,
            tenant_slug: decoded.tenant_slug
        };
    } catch (error) {
        console.error('[Auth Middleware Error]', error);
        return null;
    }
}

export async function isLogin() {
    const context = await getAuthenticatedContext();
    if (!context) return { success: false, message: 'Please login' };
    return { success: true, data: context };
}

export async function isAdmin() {
    const context = await getAuthenticatedContext();
    if (!context || context.role !== 'admin') {
        return { success: false, message: 'Access denied: Admin only' };
    }
    return { success: true, data: context };
}

export async function isManager() {
    const context = await getAuthenticatedContext();
    if (!context || (context.role !== 'manager' && context.role !== 'admin')) {
        return { success: false, message: 'Access denied: Manager access required' };
    }
    return { success: true, data: context };
}

export async function isSupport() {
    const context = await getAuthenticatedContext();
    if (!context || (context.role !== 'support' && context.role !== 'manager' && context.role !== 'admin')) {
        return { success: false, message: 'Access denied: Support access required' };
    }
    return { success: true, data: context };
}

export async function isCustomer() {
    const context = await getAuthenticatedContext();
    if (!context || context.role !== 'customer') {
        return { success: false, message: 'Access denied: Customer access required' };
    }
    return { success: true, data: context };
}

export async function hasRole(allowedRoles) {
    const context = await getAuthenticatedContext();
    if (!context) return { success: false, message: 'Please login' };
    if (!allowedRoles.includes(context.role)) {
        return { success: false, message: 'Access denied' };
    }
    return { success: true, data: context };
}

// Kept for seamless backwards compatibility across the platform without needing a deep refactor
export async function getSession() {
    return getAuthenticatedContext();
}

import { redirect } from 'next/navigation';

export async function redirectIfAuthenticated() {
    const context = await getAuthenticatedContext();
    if (context) {
        if (context.role === 'admin') redirect('/control/admin');
        if (context.role === 'manager') redirect('/control/manager');
        if (context.role === 'support') redirect('/control/support');
        redirect('/dashboard');
    }
}
