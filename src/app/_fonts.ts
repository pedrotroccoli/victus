import { Inter, Recursive } from "next/font/google";

export const RecursiveFont = Recursive({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-recursive",
});

export const InterFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});
