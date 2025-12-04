import React from 'react';
import { calculateDailyHours, TimeSession, formatHoursMinutes } from '../utils/timeCalculations';
import WheelTimePicker from './WheelTimePicker';
import styles from './DayRow.module.css';

interface DayRowProps {
  day: string;
  sessions: TimeSession[];
  onSessionChange: (index: number, field: 'checkIn' | 'checkOut', value: string) => void;
  onAddSession: () => void;
  onRemoveSession: (index: number) => void;
}

const DayRow: React.FC<DayRowProps> = ({ 
  day, 
  sessions,
  onSessionChange,
  onAddSession,
  onRemoveSession
}) => {
  const totalHours = sessions.reduce((sum, session) => {
    return sum + calculateDailyHours(session.checkIn, session.checkOut);
  }, 0);

  return (
    <div className={styles.dayRow}>
      <div className={styles.dayHeader}>
        <div className={styles.dayName}>{day}</div>
        <div className={styles.dayTotal}>
          <span className={styles.hoursValue}>{formatHoursMinutes(totalHours)}</span>
        </div>
      </div>
      
      <div className={styles.sessionsContainer}>
        {sessions.map((session, index) => (
          <div key={index} className={styles.sessionRow}>
            <div className={styles.timeInputs}>
              <WheelTimePicker
                id={`${day}-${index}-checkin`}
                label="Check In"
                value={session.checkIn}
                onChange={(value) => onSessionChange(index, 'checkIn', value)}
              />
              <WheelTimePicker
                id={`${day}-${index}-checkout`}
                label="Check Out"
                value={session.checkOut}
                onChange={(value) => onSessionChange(index, 'checkOut', value)}
              />
            </div>
            <div className={styles.sessionHours}>
              {formatHoursMinutes(calculateDailyHours(session.checkIn, session.checkOut))}
            </div>
            {sessions.length > 1 && (
              <button
                onClick={() => onRemoveSession(index)}
                className={styles.removeButton}
                title="Remove session"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        <button onClick={onAddSession} className={styles.addButton}>
          + Add Session
        </button>
      </div>
    </div>
  );
};

export default DayRow;
