import { IBM_Plex_Sans, Recursive } from "next/font/google";

export const RecursiveFont = Recursive({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-recursive",
});

export const IBMPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex",
});
