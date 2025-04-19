import "./globals.css";
import { Roboto } from "next/font/google";
import Image from "next/image";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
});

export const metadata = {
  title: "NúcleoFC - Sistema Original"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={roboto.className}>
        <header className="d-flex justify-content-between align-items-center px-4">
          <div className="header-left d-flex align-items-center">
            <Image
              src="/images/logo.png"
              alt="Logo NúcleoFC"
              width={80}
              height={80}
              priority
            />
          </div>
          <div className="header-right">
            <p className="text-white mb-0">Gerencie seus jogadores e times!</p>
          </div>
        </header>

        <main className="container py-4 flex-grow-1">{children}</main>

        <footer className="py-3 text-center">
          <p className="mb-0 text-white">
            &copy; {new Date().getFullYear()} NúcleoFC - Todos os direitos
            reservados
          </p>
        </footer>
      </body>
    </html>
  );
}
