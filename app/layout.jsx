import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import AuthWrapper from "@/components/AuthWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Conference Room Booking",
  description: "Book conference rooms easily and efficiently",
};

export default function RootLayout({ children }) {
  return (
    <AuthWrapper>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <main className="bg-gray-100  py-6  ">{children}</main>

          <Footer />
          <ToastContainer />
        </body>
      </html>
    </AuthWrapper>
  );
}
// bg-[url('@/assets/images/background(2).png')] bg-cover bg-no-repeat
