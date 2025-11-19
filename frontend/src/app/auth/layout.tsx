import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Login & Registration - Next.js",
  description: "Login and Registration page with Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`font-display ${plusJakartaSans.variable} ${plusJakartaSans.className} antialiased`}
      >
        {/* Loại bỏ các class 'dark:...' vì bạn không muốn Dark Mode */}
        <div
          className="relative flex h-auto min-h-screen w-full flex-col bg-background-light group/design-root"
          style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
        >
          <div className="layout-container flex h-full grow flex-col">
            <div className="flex flex-1 justify-center">
              <div className="layout-content-container flex flex-col w-full flex-1">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
