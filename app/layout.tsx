import type { Metadata } from "next";
import "./globals.css";
import "./verify.css";

export const metadata: Metadata = {
  title: "Evaluación · Gobernanza de IA · AADTC",
  description: "Evaluación grupal del Módulo 6 con resultados académicos y certificados individuales.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
