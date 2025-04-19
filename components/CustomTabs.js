"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomTabs() {
  const pathname = usePathname();

  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <Link
          className={`nav-link ${pathname === "/" ? "active" : ""}`}
          href="/"
        >
          <i className="fas fa-users me-2"></i> Jogadores
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={`nav-link ${pathname === "/teams" ? "active" : ""}`}
          href="/teams"
        >
          <i className="fas fa-shield-alt me-2"></i> Times
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={`nav-link ${pathname === "/config" ? "active" : ""}`}
          href="/config"
        >
          <i className="fas fa-cog me-2"></i> Configurações
        </Link>
      </li>
    </ul>
  );
}
