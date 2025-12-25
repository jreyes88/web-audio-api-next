import "./styles/globals.scss";
import { Orbitron } from "next/font/google";

const font = Orbitron({
  subsets: ["latin"],
  variable: "--font-sans-serif",
  display: "swap",
});

export const metadata = {
  title: "Web Audio API Synth",
  description: "buzz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${font.variable}`}>
      <body>{children}</body>
    </html>
  );
}
