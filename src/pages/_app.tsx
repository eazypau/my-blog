import "@/styles/globals.css";
import type { AppProps } from "next/app";
// components
import Footer from "@/components/Footer";
// fonts
import { Montserrat, Raleway } from "next/font/google";
// vercel
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-monts",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${raleway.variable} ${montserrat.variable}`}>
      <Component {...pageProps} />
      <SpeedInsights />
      <Analytics />
      <Footer />
    </div>
  );
}
