import { pool } from "@/lib/database/pg";
import { headers } from "next/headers";

export async function getBaseUrl() {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  } catch (error) {
    return "http://localhost:3000";
  }
}

export async function getTenantContext() {
  try {
    const headersList = await headers();
    let hostWithPort = headersList.get("host") || "";
    let hostWithoutPort = hostWithPort.includes(":") ? hostWithPort.split(":")[0] : hostWithPort;

    let tenant_id = null;

    // 1. Try exact domain match in ress_domains
    const { rows: domainRows } = await pool.query(
      "SELECT tenant_id FROM ress_domains WHERE domain = $1 OR domain = $2 LIMIT 1",
      [hostWithPort, hostWithoutPort]
    );

    if (domainRows.length > 0) {
      tenant_id = domainRows[0].tenant_id;
    } else {
      // 2. Try subdomain match against slug in ress_tenants
      const parts = hostWithoutPort.split('.');
      if (parts.length >= 2) {
        const slug = parts[0];
        const { rows: slugRows } = await pool.query(
          "SELECT tenant_id FROM ress_tenants WHERE slug = $1 LIMIT 1",
          [slug]
        );
        if (slugRows.length > 0) {
          tenant_id = slugRows[0].tenant_id;
        }
      }
    }

    if (!tenant_id) {
      return { success: false, message: "Tenant not found for this domain", status: 404 };
    }

    // Check tenant status
    const { rows: tenantRows } = await pool.query(
      "SELECT status FROM ress_tenants WHERE tenant_id = $1 LIMIT 1",
      [tenant_id]
    );

    if (tenantRows.length === 0) {
      return { success: false, message: "Tenant does not exist", status: 404 };
    }

    const tenantStatus = tenantRows[0].status;
    if (tenantStatus !== 'active') {
      return { success: false, message: `Tenant is ${tenantStatus}`, status: 403 };
    }

    // Check subscription status
    const { rows: subRows } = await pool.query(
      "SELECT status FROM ress_subscriptions WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 1",
      [tenant_id]
    );

    if (subRows.length === 0) {
       return { success: false, message: "No subscription found", status: 402 };
    }

    const subStatus = subRows[0].status;
    if (!['active', 'trial'].includes(subStatus)) {
      return { success: false, message: `Subscription is ${subStatus}`, status: 402 };
    }

    return { success: true, payload: { tenant_id } };
  } catch (error) {
    console.error("Tenant resolution error:", error);
    return { success: false, message: "Internal server error during tenant resolution", status: 500 };
  }
}
