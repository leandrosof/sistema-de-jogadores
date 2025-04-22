import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faShieldAlt, faCog } from "@fortawesome/free-solid-svg-icons";

export default function CustomTabs() {
  const pathname = usePathname();

  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <Link
          className={`nav-link ${pathname === "/" ? "active" : ""}`}
          href="/"
        >
          <FontAwesomeIcon icon={faUsers} className="me-2" /> Jogadores
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={`nav-link ${pathname === "/teams" ? "active" : ""}`}
          href="/teams"
        >
          <FontAwesomeIcon icon={faShieldAlt} className="me-2" /> Times
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={`nav-link ${pathname === "/config" ? "active" : ""}`}
          href="/config"
        >
          <FontAwesomeIcon icon={faCog} className="me-2" /> Configurações
        </Link>
      </li>
    </ul>
  );
}
