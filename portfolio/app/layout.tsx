import "./globals.css";

export const metadata = {
  title: "Prithvi Raj",
  description: "Software Engineer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0b] text-white">
        {children}
      </body>
    </html>
  );
}
