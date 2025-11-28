import React, { useState, useRef, useEffect } from 'react';
import styles from './TimeInput.module.css';

interface TimeInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ id, value, onChange, label }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);

  // Parse value when it changes externally
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h || '');
      setMinutes(m || '');
    } else {
      setHours('');
      setMinutes('');
    }
  }, [value]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');

    if (val.length > 2) val = val.slice(0, 2);

    if (val === '') {
      setHours('');
      return;
    }

    if (val.length === 1) {
      // Allow any single digit 0-9 while typing without forcing formatting
      setHours(val);
      return;
    }

    // length === 2
    let hhNum = parseInt(val, 10);
    if (hhNum > 23) hhNum = 23;
    const hh = hhNum.toString().padStart(2, '0');
    setHours(hh);
    minutesRef.current?.focus();
    if (minutes.length === 2) {
      onChange(`${hh}:${minutes}`);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');

    if (val.length > 2) val = val.slice(0, 2);

    if (val === '') {
      setMinutes('');
      return;
    }

    if (val.length === 1) {
      const d = parseInt(val, 10);
      if (d <= 5) {
        setMinutes(val);
      } else {
        const mm = `0${d}`;
        setMinutes(mm);
        if (hours.length === 2) {
          onChange(`${hours}:${mm}`);
        }
      }
      return;
    }

    let mmNum = parseInt(val, 10);
    if (mmNum > 59) mmNum = 59;
    const mm = mmNum.toString().padStart(2, '0');
    setMinutes(mm);
    if (hours.length === 2) {
      onChange(`${hours}:${mm}`);
    }
  };

  const handleHoursBlur = () => {
    if (hours) {
      const paddedHours = hours.padStart(2, '0');
      setHours(paddedHours);
      
      if (minutes) {
        const paddedMinutes = minutes.padStart(2, '0');
        onChange(`${paddedHours}:${paddedMinutes}`);
      }
    }
  };

  const handleMinutesBlur = () => {
    if (minutes) {
      const paddedMinutes = minutes.padStart(2, '0');
      setMinutes(paddedMinutes);
      
      if (hours) {
        const paddedHours = hours.padStart(2, '0');
        onChange(`${paddedHours}:${paddedMinutes}`);
      }
    }
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.timeInputContainer}>
        <input
          ref={hoursRef}
          type="text"
          value={hours}
          onChange={handleHoursChange}
          onBlur={handleHoursBlur}
          placeholder="HH"
          className={styles.timeField}
          maxLength={2}
          inputMode="numeric"
        />
        <span className={styles.separator}>:</span>
        <input
          ref={minutesRef}
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          onBlur={handleMinutesBlur}
          placeholder="MM"
          className={styles.timeField}
          maxLength={2}
          inputMode="numeric"
        />
        <span className={styles.format24}>24h</span>
      </div>
    </div>
  );
};

export default TimeInput;
