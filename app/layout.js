
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

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
        <body className={`${inter.className} bg-white`}>
          {/* header */}
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          {/* footer */}
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center 
          text-gray-600">
              <p>
                Footer for the app
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
