"use client";

import Image from "next/image";
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image
          src="/images/logo.png"
          alt="NúcleoFC"
          className={styles.logo}
          width={100}
          height={100}
          priority
        />
      </div>
    </header>
  );
}
