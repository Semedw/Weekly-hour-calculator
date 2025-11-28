import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { WEEKLY_REQUIREMENT } from '../utils/timeCalculations';
import styles from './ProgressChart.module.css';

interface ProgressChartProps {
  totalHours: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ totalHours }) => {
  const percentage = Math.min(100, (totalHours / WEEKLY_REQUIREMENT) * 100);
  const isComplete = totalHours >= WEEKLY_REQUIREMENT;

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.title}>Progress</h2>
      <div className={styles.chartWrapper}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage.toFixed(0)}%`}
          styles={buildStyles({
            textSize: '1.5rem',
            pathColor: isComplete ? '#48bb78' : '#4299e1',
            textColor: '#2d3748',
            trailColor: '#e2e8f0',
            pathTransitionDuration: 0.5,
          })}
        />
      </div>
      <div className={styles.status}>
        {isComplete ? (
          <div className={styles.completeMessage}>
            <span className={styles.checkmark}>✓</span>
            <span>Weekly goal reached!</span>
          </div>
        ) : (
          <div className={styles.progressMessage}>
            Keep going! {(WEEKLY_REQUIREMENT - totalHours).toFixed(2)} hours to go
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
