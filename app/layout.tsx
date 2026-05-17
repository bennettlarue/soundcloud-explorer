import { SoundCloudWidget } from "./components/player/SoundCloudWidget";
import { PlayerBar } from "./components/player/PlayerBar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col mx-2">
        <main>{children}</main>
        <SoundCloudWidget />
        <PlayerBar />
      </body>
    </html>
  );
}
