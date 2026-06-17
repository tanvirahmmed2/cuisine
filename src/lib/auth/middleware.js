import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { JWT_SECRET } from "../database/secret";
import { pool } from "../database/pg";
import { getTenantContext } from "../tenant/helper";
async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("restaurant_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const { rows } = await pool.query(
      "SELECT id, tenant_id, name, email, phone, role, is_banned FROM restaurant_users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );

    if (rows.length === 0) return null;
    const user = rows[0];

    if (user.is_banned) return null;

    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success || tenantCtx.payload.tenant_id !== user.tenant_id) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function isLogin() {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Please login" };

  return { success: true, payload: user };
}

export async function isAdmin() {
  const auth = await isLogin();
  if (!auth.success) return auth;
  if (auth.payload.role !== "admin") return { success: false, message: "Admins only" };
  return auth;
}

export async function isManager() {
  const auth = await isLogin();
  if (!auth.success) return auth;
  if (auth.payload.role !== "manager" && auth.payload.role !== "admin") {
    return { success: false, message: "Manager only" };
  }
  return auth;
}

export async function isSales() {
  const auth = await isLogin();
  if (!auth.success) return auth;
  if (auth.payload.role !== "sales" && auth.payload.role !== "admin") {
    return { success: false, message: "Sales only" };
  }
  return auth;
}



