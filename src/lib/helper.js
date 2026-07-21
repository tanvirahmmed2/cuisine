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
