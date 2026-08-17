import ToastProvider from "@/components/bar/ToastProvider";
import "./globals.css";
import { ContextProvider } from "@/components/context/Context";
import { name, tagline } from "@/lib/database/secret";

export async function generateMetadata() {
  return {
    title: name,
    description: tagline,
    openGraph: {
      title: name,
      description: tagline,
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