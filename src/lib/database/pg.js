import { Pool } from "pg";
import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from "./secret";

const rawPool = new Pool({
  user: PG_USER,
  password: PG_PASSWORD,
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const pool = {
  ...rawPool,
  
  connect: async function() {
    let headersList;
    try {
      const { headers } = require('next/headers');
      headersList = await headers();
    } catch (e) {
      return rawPool.connect();
    }

    let hostWithPort = headersList.get("host") || "";
    let hostWithoutPort = hostWithPort.includes(":") ? hostWithPort.split(":")[0] : hostWithPort;

    const client = await rawPool.connect();
    
    try {
      let tenant_id = null;
      const { rows } = await client.query("SELECT tenant_id FROM ress_domains WHERE domain = $1 OR domain = $2 LIMIT 1", [hostWithPort, hostWithoutPort]);
      if (rows.length > 0) {
        tenant_id = rows[0].tenant_id;
      } else {
        const parts = hostWithoutPort.split('.');
        if (parts.length >= 2) {
          const slug = parts[0];
          const { rows: slugRows } = await client.query("SELECT tenant_id FROM ress_tenants WHERE slug = $1 LIMIT 1", [slug]);
          if (slugRows.length > 0) {
            tenant_id = slugRows[0].tenant_id;
          }
        }
      }

      if (tenant_id) {
        await client.query(`SET app.current_tenant_id = '${tenant_id}'`);
      } else {
        await client.query(`SET app.current_tenant_id = ''`);
      }
    } catch (e) {
      // Ignore errors if table doesn't exist yet etc
    }

    return client;
  },

  query: async function (text, params, cb) {
    const client = await this.connect();
    try {
      return await client.query(text, params, cb);
    } finally {
      client.release();
    }
  },
  
  on: rawPool.on.bind(rawPool),
  end: rawPool.end.bind(rawPool),
};


