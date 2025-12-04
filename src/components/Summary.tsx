import React from 'react';
import { WEEKLY_REQUIREMENT, formatHoursMinutes } from '../utils/timeCalculations';
import styles from './Summary.module.css';

interface SummaryProps {
  totalHours: number;
}

const Summary: React.FC<SummaryProps> = ({ totalHours }) => {
  const remainingHours = Math.max(0, WEEKLY_REQUIREMENT - totalHours);
  const percentage = Math.min(100, (totalHours / WEEKLY_REQUIREMENT) * 100);
  const isComplete = totalHours >= WEEKLY_REQUIREMENT;

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Weekly Summary</h2>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatHoursMinutes(totalHours)}</div>
          <div className={styles.statLabel}>Total Hours</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatHoursMinutes(remainingHours)}</div>
          <div className={styles.statLabel}>Hours Remaining</div>
        </div>
        
        <div className={`${styles.statCard} ${isComplete ? styles.complete : ''}`}>
          <div className={styles.statValue}>{percentage.toFixed(1)}%</div>
          <div className={styles.statLabel}>Complete</div>
        </div>
      </div>

      <div className={styles.requirement}>
        <span className={styles.requirementLabel}>Weekly Requirement:</span>
        <span className={styles.requirementValue}>{WEEKLY_REQUIREMENT} hours</span>
      </div>
    </div>
  );
};

export default Summary;
