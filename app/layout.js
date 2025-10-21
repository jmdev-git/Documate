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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9338364553475290"
          crossorigin="anonymous"
        ></script>
      </head>
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
