import ToastProvider from "@/components/bar/ToastProvider";
import "./globals.css";
import { ContextProvider } from "@/components/context/Context";


import { headers } from "next/headers";

export async function generateMetadata() {
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