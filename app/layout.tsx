import "@/app/ui/global.css";
import {inter} from "@/app/ui/fonts"
import Navbar from "./navbar/page";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    
      <body className={`${inter.className} antialiased`}>
      <Navbar/>
        {children}</body>
    </html>
  );
}
