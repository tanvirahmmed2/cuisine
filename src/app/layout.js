import ToastProvider from "@/components/bar/ToastProvider";
import "./globals.css";
import { ContextProvider } from "@/components/context/Context";


import { headers } from "next/headers";

import { pool } from "@/lib/database/pg";

export async function generateMetadata() {
  try {
    const { rows } = await pool.query("SELECT name, tagline, hero_subtitle FROM restaurant_websites LIMIT 1");
    if (rows.length > 0) {
      const site = rows[0];
      const title = site.name || "Restaurant";
      const desc = site.hero_subtitle || site.tagline || "Exceptional culinary experience.";
      return {
        title: title,
        description: desc,
        openGraph: {
          title: title,
          description: desc,
        },
      };
    }
  } catch (error) {
    console.error("Metadata generation error:", error);
  }
  return {
    title: "Restaurant",
    description: "Exceptional culinary experience.",
    openGraph: {
      title: "Restaurant",
      description: "Exceptional culinary experience.",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full overflow-x-hidden relative font-sans text-xs md:text-sm">
        <ContextProvider>
          <ToastProvider>
            <main>{children}</main>
          </ToastProvider>
        </ContextProvider>
      </body>
    </html>
  );
}