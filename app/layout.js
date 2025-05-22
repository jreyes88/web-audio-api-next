import "./styles/globals.scss";
import Store from "./context/Store";
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
    <Store>
      <html lang="en" className={`${font.variable}`}>
        <body>{children}</body>
      </html>
    </Store>
  );
}
