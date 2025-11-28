import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.appTitle}>Weekly School Time Tracker</h1>
        <p className={styles.subtitle}>
          Track your school hours throughout the week. Valid hours are counted between 09:00 and 18:00.
        </p>
      </div>
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.userIcon}>{username.charAt(0).toUpperCase()}</div>
          <span className={styles.username}>{username}</span>
        </div>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
