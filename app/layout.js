
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata = {
  title: "Wealth",
  description: "One stop financial platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en" className=""
      >
        <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-950 antialiased`}>
          <Header />
          <main className="min-h-screen px-4 pb-12 pt-24 sm:px-6 lg:px-8">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
          <Toaster richColors></Toaster>
          <footer className="border-t border-slate-200 bg-white py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
              <p>Wealth. Personal finance with a little more signal.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
