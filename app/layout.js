import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./Providers";
import { ThemeProvider } from "next-themes";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Documate",
  description: "created by John Mark Depaclayon",
  icons: {
    icon: [
      { url: "/DarkModeLogo-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/DarkModeLogo-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} antialiased bg-[#f5f5f5] dark:bg-black`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
