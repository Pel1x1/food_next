"use client";

import React, { useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import LogoIcon from "@/shared/components/icons/LogoIcon";
import { LuHeart, LuUser, LuMenu, LuX } from "react-icons/lu";
import styles from "./Header.module.scss";
import { AppRoutePaths } from "@/app/routes";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Recipes", path: AppRoutePaths.home },
    { name: "Categories", path: AppRoutePaths.categories },
    { name: "Favourites", path: AppRoutePaths.favourites },
    { name: "Cart", path: AppRoutePaths.cart },
    { name: "Meal planning", path: AppRoutePaths.mealPlanning },
    { name: "Random Recipe", path: AppRoutePaths.randomRecipe },
    { name: "Profile", path: AppRoutePaths.profile },
  ];

  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href={AppRoutePaths.home} className={styles.logo}>
          <LogoIcon width={40} height={40} />
          <span>Food Client</span>
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={classNames(styles.navLink, {
                    [styles.active]: pathname === link.path,
                  })}
                  onClick={closeMobile}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <Link
            href={AppRoutePaths.favourites}
            className={styles.actionButton}
            title="Favourites"
          >
            <LuHeart size={20} />
          </Link>
          <Link
            href={AppRoutePaths.profile}
            className={classNames(styles.actionButton, styles.profileBtn)}
            title="Profile"
          >
            <LuUser size={20} />
          </Link>

          <button
            className={styles.burgerBtn}
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenu}>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={classNames(styles.mobileNavLink, {
                      [styles.active]: pathname === link.path,
                    })}
                    onClick={closeMobile}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
