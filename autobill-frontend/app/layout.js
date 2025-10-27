import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "AutoBill 2.0",
  description: "Generate invoices automatically",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
