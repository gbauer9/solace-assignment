import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {/* Navbar */}
          <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <h1 className="text-2xl font-brand">Solace</h1>
                  <div className="hidden md:flex space-x-6">
                    <Button variant="ghost" className="text-sm">
                      Home
                    </Button>
                    <Button variant="ghost" className="text-sm">
                      About
                    </Button>
                    <Button variant="ghost" className="text-sm">
                      Services
                    </Button>
                    <Button variant="ghost" className="text-sm">
                      Contact
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                  <Button size="sm">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
