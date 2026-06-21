import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Internship Tracker",
  description: "Track your internship applications easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}