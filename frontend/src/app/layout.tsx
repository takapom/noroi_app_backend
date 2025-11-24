import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "呪癖",
  description: "関わりたくないが関わってしまう人々への鬱憤を、ゴシックホラーの世界観の中で「呪い」として昇華させる匿名SNSアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Noto+Serif+JP:wght@300;400;500;700&family=IM+Fell+English:ital@0;1&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
